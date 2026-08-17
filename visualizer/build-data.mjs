import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const visualizerDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(visualizerDirectory, "..");
const inputPath = resolve(
  repositoryRoot,
  process.argv[2] ?? "data/output/gpt_5_6_terra_simplified_five_rows.json",
);
const outputPath = resolve(visualizerDirectory, "data.js");

const extractionRun = JSON.parse(await readFile(inputPath, "utf8"));
const javascript = `window.EXTRACTION_RUN = ${JSON.stringify(extractionRun, null, 2)};\n`;
await writeFile(outputPath, javascript);

console.log(`Embedded ${extractionRun.results.length} reports in ${outputPath}`);
