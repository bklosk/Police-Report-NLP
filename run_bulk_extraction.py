from __future__ import annotations

import argparse
import asyncio
import csv
import hashlib
import json
import re
import time
from collections.abc import Iterable
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from openai import AsyncOpenAI

from run_structured_test import (
    ROOT,
    format_input,
    load_instructions,
    normalize_response_payload,
    response_metadata,
    validate_source_coverage,
)
from schema import FIOReport


DEFAULT_INPUT = ROOT / "data/contacts/fieldcontact_all.csv"
DEFAULT_OUTPUT = ROOT / "data/output/gpt_5_6_terra_2022_2024_gun_drugs_gang.jsonl"
DEFAULT_SUMMARY = ROOT / "data/output/gpt_5_6_terra_2022_2024_gun_drugs_gang_summary.json"
DEFAULT_MODEL = "gpt-5.6-terra"
TARGET_YEARS = {"2022", "2023", "2024"}
TARGET_SITUATIONS = {"gun", "drugs", "gang"}


def row_year(contact_date: str) -> str | None:
    match = re.search(r"\b(2022|2023|2024)\b", contact_date or "")
    return match.group(1) if match else None


def row_situations(value: str) -> set[str]:
    return {item.strip().lower() for item in (value or "").split(",") if item.strip()}


def target_rows(input_path: Path) -> list[dict[str, str]]:
    selected: list[dict[str, str]] = []
    with input_path.open(newline="") as source:
        for source_line, row in enumerate(csv.DictReader(source), start=2):
            year = row_year(row.get("contact_date", ""))
            situations = row_situations(row.get("key_situations", ""))
            if year in TARGET_YEARS and situations & TARGET_SITUATIONS:
                row["_source_line"] = str(source_line)
                row["_year"] = year
                row["_row_id"] = f"{source_line}:{row['fc_num']}"
                selected.append(row)
    return selected


def completed_row_ids(output_path: Path) -> set[str]:
    if not output_path.exists():
        return set()
    completed: set[str] = set()
    with output_path.open() as output:
        for line in output:
            if line.strip():
                completed.add(json.loads(line)["row_id"])
    return completed


def read_results(output_path: Path) -> list[dict[str, Any]]:
    if not output_path.exists():
        return []
    with output_path.open() as output:
        return [json.loads(line) for line in output if line.strip()]


def usage_dict(response: Any) -> dict[str, Any] | None:
    return response.usage.model_dump(mode="json") if response.usage else None


def append_jsonl(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a") as output:
        output.write(json.dumps(payload) + "\n")


def write_summary(path: Path, summary: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(summary, indent=2) + "\n")


def sum_usage(results: Iterable[dict[str, Any]]) -> dict[str, int]:
    totals = {
        "input_tokens": 0,
        "cached_tokens": 0,
        "cache_write_tokens": 0,
        "output_tokens": 0,
        "reasoning_tokens": 0,
        "total_tokens": 0,
    }
    for result in results:
        usage = result.get("usage") or {}
        input_details = usage.get("input_tokens_details") or {}
        output_details = usage.get("output_tokens_details") or {}
        totals["input_tokens"] += usage.get("input_tokens", 0)
        totals["cached_tokens"] += input_details.get("cached_tokens", 0)
        totals["cache_write_tokens"] += input_details.get("cache_write_tokens", 0)
        totals["output_tokens"] += usage.get("output_tokens", 0)
        totals["reasoning_tokens"] += output_details.get("reasoning_tokens", 0)
        totals["total_tokens"] += usage.get("total_tokens", 0)
    return totals


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Extract all 2022-2024 gun, drugs, or gang contact rows."
    )
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--summary", type=Path, default=DEFAULT_SUMMARY)
    parser.add_argument("--prompt", type=Path, default=ROOT / "prompt.txt")
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--concurrency", type=int, default=10)
    return parser.parse_args()


async def main() -> None:
    args = parse_args()
    rows = target_rows(args.input)
    already_completed = completed_row_ids(args.output)
    pending = [row for row in rows if row["_row_id"] not in already_completed]
    instructions = load_instructions(args.prompt)
    schema = FIOReport.model_json_schema()
    cache_fingerprint = hashlib.sha256(
        (instructions + json.dumps(schema, sort_keys=True)).encode()
    ).hexdigest()[:24]
    cache_key = f"police-report-nlp-{cache_fingerprint}"
    client = AsyncOpenAI(timeout=240.0, max_retries=5)
    semaphore = asyncio.Semaphore(args.concurrency)
    output_lock = asyncio.Lock()
    counters = {"completed": len(already_completed), "failed": 0}
    new_results: list[dict[str, Any]] = []
    errors: list[dict[str, Any]] = []
    started = datetime.now(UTC)
    started_timer = time.perf_counter()

    summary: dict[str, Any] = {
        "model": args.model,
        "api": "OpenAI Responses API",
        "prompt_cache_key": cache_key,
        "prompt_cache_retention": "24h",
        "target_years": sorted(TARGET_YEARS),
        "target_key_situations": sorted(TARGET_SITUATIONS),
        "source_rows": len(rows),
        "source_rows_by_year": {
            year: sum(row["_year"] == year for row in rows)
            for year in sorted(TARGET_YEARS)
        },
        "started_at": started.isoformat(),
        "resumed_completed_rows": len(already_completed),
        "completed_rows": len(already_completed),
        "failed_rows": 0,
    }
    write_summary(args.summary, summary)
    print(
        f"Selected {len(rows)} rows; {len(pending)} pending; "
        f"cache_key={cache_key}; concurrency={args.concurrency}",
        flush=True,
    )

    async def extract(row: dict[str, str]) -> None:
        async with semaphore:
            request_started = time.perf_counter()
            last_error: Exception | None = None
            for attempt in range(1, 4):
                try:
                    response = await client.responses.create(
                        model=args.model,
                        reasoning={"effort": "none"},
                        instructions=instructions,
                        input=[
                            {
                                "role": "user",
                                "content": [
                                    {
                                        "type": "input_text",
                                        "text": format_input(row),
                                    }
                                ],
                            }
                        ],
                        text={
                            "format": {
                                "type": "json_schema",
                                "name": "fio_report",
                                "schema": schema,
                                "strict": True,
                            }
                        },
                        prompt_cache_key=cache_key,
                        prompt_cache_retention="24h",
                    )
                    if not response.output_text:
                        raise RuntimeError(
                            f"Response {response.id} returned no output text "
                            f"(status={response.status})"
                        )
                    report = FIOReport.model_validate(
                        normalize_response_payload(response.output_text, row)
                    )
                    if report.fc_number != row["fc_num"]:
                        raise ValueError(
                            f"Expected {row['fc_num']}, received {report.fc_number}"
                        )
                    validate_source_coverage(report, row)
                    result = {
                        "row_id": row["_row_id"],
                        "source_line": int(row["_source_line"]),
                        "year": row["_year"],
                        "fc_number": row["fc_num"],
                        "elapsed_seconds": round(
                            time.perf_counter() - request_started, 3
                        ),
                        **response_metadata(response),
                        "report": report.model_dump(mode="json"),
                    }
                    async with output_lock:
                        append_jsonl(args.output, result)
                        new_results.append(result)
                        counters["completed"] += 1
                        if counters["completed"] % 25 == 0:
                            usage = sum_usage(new_results)
                            elapsed = time.perf_counter() - started_timer
                            print(
                                f"completed={counters['completed']}/{len(rows)} "
                                f"failed={counters['failed']} "
                                f"cached={usage['cached_tokens']} "
                                f"elapsed={elapsed / 60:.1f}m",
                                flush=True,
                            )
                    return
                except Exception as exc:
                    last_error = exc
                    if attempt < 3:
                        await asyncio.sleep(2**attempt)

            error = {
                "row_id": row["_row_id"],
                "source_line": int(row["_source_line"]),
                "year": row["_year"],
                "fc_number": row["fc_num"],
                "error_type": type(last_error).__name__,
                "message": str(last_error),
            }
            async with output_lock:
                errors.append(error)
                counters["failed"] += 1
                print(
                    f"FAILED {row['_row_id']}: {error['error_type']} "
                    f"{error['message']}",
                    flush=True,
                )

    await asyncio.gather(*(extract(row) for row in pending))
    await client.close()

    all_results = read_results(args.output)
    total_usage = sum_usage(all_results)
    uncached_input_tokens = (
        total_usage["input_tokens"] - total_usage["cached_tokens"]
    )
    estimated_cost = (
        uncached_input_tokens * 2.0 / 1_000_000
        + total_usage["cached_tokens"] * 0.2 / 1_000_000
        + total_usage["output_tokens"] * 12.0 / 1_000_000
    )
    summary.update(
        {
            "completed_at": datetime.now(UTC).isoformat(),
            "elapsed_seconds": round(time.perf_counter() - started_timer, 3),
            "completed_rows": counters["completed"],
            "failed_rows": counters["failed"],
            "new_usage": sum_usage(new_results),
            "total_usage": total_usage,
            "prompt_cache_hit_rate": (
                total_usage["cached_tokens"] / total_usage["input_tokens"]
                if total_usage["input_tokens"]
                else 0
            ),
            "estimated_standard_cost_usd": round(estimated_cost, 4),
            "errors": errors,
        }
    )
    write_summary(args.summary, summary)
    print(
        f"Finished completed={counters['completed']}/{len(rows)} "
        f"failed={counters['failed']} output={args.output}",
        flush=True,
    )
    if errors:
        raise SystemExit(f"{len(errors)} rows failed; rerun to retry them")


if __name__ == "__main__":
    asyncio.run(main())
