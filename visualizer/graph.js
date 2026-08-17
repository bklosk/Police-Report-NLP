(() => {
  "use strict";

  const runData = window.EXTRACTION_RUN;
  if (!runData || !Array.isArray(runData.results)) {
    document.querySelector(".workspace").innerHTML =
      '<p class="empty">Missing visualizer/data.js. Run <code>node visualizer/build-data.mjs</code>.</p>';
    return;
  }

  const svg = document.getElementById("graph");
  const details = document.getElementById("details");
  const reportSelect = document.getElementById("report-select");
  const entitySelect = document.getElementById("entity-select");
  const labelsToggle = document.getElementById("labels-toggle");
  const reheatButton = document.getElementById("reheat-button");
  const resetViewButton = document.getElementById("reset-view-button");
  const typeToggles = [...document.querySelectorAll("[data-kind]")];
  const NS = "http://www.w3.org/2000/svg";

  const COLORS = {
    stop: css("--stop"),
    person: css("--person"),
    vehicle: css("--vehicle"),
    item: css("--item"),
  };

  let width = 1000;
  let height = 700;
  let graph = { nodes: [], edges: [], report: null };
  let selectedNodeId = "";
  let animationFrame = 0;
  let alpha = 1;
  let transform = { x: 0, y: 0, scale: 1 };
  let panState = null;
  let dragState = null;
  let graphLayer;
  let edgeLayer;
  let edgeLabelLayer;
  let nodeLayer;

  renderMetrics();
  populateReportSelector();
  bindControls();
  resize();
  rebuildGraph();
  window.addEventListener("resize", resize);

  function css(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function svgElement(tag, attributes = {}) {
    const element = document.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, String(value));
    }
    return element;
  }

  function renderMetrics() {
    const totalTokens = runData.results.reduce(
      (sum, result) => sum + (result.usage?.total_tokens || 0),
      0,
    );
    const metrics = [
      [runData.results.length, "validated reports"],
      [runData.errors.length, "errors"],
      [totalTokens.toLocaleString(), "tokens"],
      [`${runData.run.elapsed_seconds.toFixed(1)}s`, runData.run.model],
    ];
    const container = document.getElementById("metrics");
    for (const [value, label] of metrics) {
      const metric = document.createElement("div");
      metric.className = "metric";
      const strong = document.createElement("strong");
      strong.textContent = String(value);
      const span = document.createElement("span");
      span.textContent = String(label);
      metric.append(strong, span);
      container.append(metric);
    }
  }

  function populateReportSelector() {
    for (const result of runData.results) {
      const option = document.createElement("option");
      option.value = result.fc_number;
      const report = result.report;
      option.textContent =
        `${result.fc_number} · ${report.people.length} people · ${report.vehicles.length} vehicles`;
      reportSelect.append(option);
    }
  }

  function bindControls() {
    reportSelect.addEventListener("change", rebuildGraph);
    entitySelect.addEventListener("change", () => selectNode(entitySelect.value));
    labelsToggle.addEventListener("change", () => {
      edgeLabelLayer.style.display = labelsToggle.checked ? "" : "none";
    });
    typeToggles.forEach((toggle) => toggle.addEventListener("change", rebuildGraph));
    reheatButton.addEventListener("click", () => {
      scatterNodes();
      restartSimulation();
    });
    resetViewButton.addEventListener("click", resetView);

    svg.addEventListener("wheel", onWheel, { passive: false });
    svg.addEventListener("pointerdown", onBackgroundPointerDown);
    svg.addEventListener("pointermove", onPointerMove);
    svg.addEventListener("pointerup", endPointerAction);
    svg.addEventListener("pointercancel", endPointerAction);
  }

  function resize() {
    const rect = svg.getBoundingClientRect();
    width = Math.max(rect.width, 500);
    height = Math.max(rect.height, 460);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    const root = graph.nodes.find((node) => node.kind === "stop");
    if (root && !dragState) {
      root.x = width / 2;
      root.y = height / 2;
      root.fx = root.x;
      root.fy = root.y;
    }
    updatePositions();
  }

  function currentResult() {
    return (
      runData.results.find((result) => result.fc_number === reportSelect.value) ||
      runData.results[0]
    );
  }

  function enabledKinds() {
    return new Set(
      typeToggles.filter((toggle) => toggle.checked).map((toggle) => toggle.dataset.kind),
    );
  }

  function rebuildGraph() {
    cancelAnimationFrame(animationFrame);
    const result = currentResult();
    const report = result.report;
    const kinds = enabledKinds();
    const nodes = [
      {
        id: `stop:${report.fc_number}`,
        shortId: "STOP",
        kind: "stop",
        label: report.fc_number,
        data: report,
        x: width / 2,
        y: height / 2,
        vx: 0,
        vy: 0,
        fx: width / 2,
        fy: height / 2,
      },
    ];

    if (kinds.has("person")) {
      report.people.forEach((person) => nodes.push(entityNode(person, "person")));
    }
    if (kinds.has("vehicle")) {
      report.vehicles.forEach((vehicle) => nodes.push(entityNode(vehicle, "vehicle")));
    }
    if (kinds.has("item")) {
      report.items.forEach((item) => nodes.push(entityNode(item, "item")));
    }

    const nodeIds = new Set(nodes.map((node) => node.id));
    const edges = [];
    for (const node of nodes) {
      if (node.kind !== "stop") {
        edges.push({
          id: `contains:${node.id}`,
          source: nodes[0].id,
          target: node.id,
          label: "in stop",
          type: "contains",
          inferred: false,
          data: null,
        });
      }
    }

    for (const connection of report.person_connections) {
      if (
        nodeIds.has(connection.person_1_id) &&
        nodeIds.has(connection.person_2_id)
      ) {
        edges.push({
          id: `people:${connection.person_1_id}:${connection.person_2_id}`,
          source: connection.person_1_id,
          target: connection.person_2_id,
          label: humanize(connection.relationship),
          type: "person",
          inferred: false,
          data: connection,
        });
      }
    }

    for (const association of report.person_vehicle_associations) {
      if (
        nodeIds.has(association.person_id) &&
        nodeIds.has(association.vehicle_id)
      ) {
        edges.push({
          id: `person-vehicle:${association.person_id}:${association.vehicle_id}:${association.role}`,
          source: association.person_id,
          target: association.vehicle_id,
          label: humanize(association.role),
          type: "relation",
          inferred: false,
          data: association,
        });
      }
    }

    for (const association of report.person_item_associations) {
      if (
        nodeIds.has(association.person_id) &&
        nodeIds.has(association.item_id)
      ) {
        edges.push({
          id: `person-item:${association.person_id}:${association.item_id}:${association.relationship}`,
          source: association.person_id,
          target: association.item_id,
          label: humanize(association.relationship),
          type: "relation",
          inferred: false,
          data: association,
        });
      }
    }

    graph = { nodes, edges, report, result };
    selectedNodeId = nodes[0].id;
    populateEntitySelector(nodes);
    scatterNodes();
    drawGraph();
    renderDetails(nodes[0]);
    resetView();
    restartSimulation();
  }

  function populateEntitySelector(nodes) {
    entitySelect.replaceChildren();
    for (const node of nodes) {
      const option = document.createElement("option");
      option.value = node.id;
      option.textContent = `${humanize(node.kind)} · ${node.label}`;
      entitySelect.append(option);
    }
    entitySelect.value = selectedNodeId;
  }

  function entityNode(data, kind) {
    return {
      id: data.id,
      shortId: data.id,
      kind,
      label: entityLabel(data, kind),
      data,
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      fx: null,
      fy: null,
    };
  }

  function entityLabel(data, kind) {
    if (kind === "person") {
      const mention = data.mentions.find((value) => value && !/^x+$/i.test(value.trim()));
      return mention ? `${data.id} · ${mention}` : `${data.id} · person`;
    }
    if (kind === "vehicle") {
      const description = [data.year, data.color, data.make, data.model].filter(Boolean).join(" ");
      return `${data.id} · ${description || "vehicle"}`;
    }
    return `${data.id} · ${data.description || data.item_type}`;
  }

  function scatterNodes() {
    const movable = graph.nodes.filter((node) => node.kind !== "stop");
    movable.forEach((node, index) => {
      const angle = (index / Math.max(movable.length, 1)) * Math.PI * 2 + Math.random() * 0.25;
      const radius = Math.min(width, height) * (0.24 + Math.random() * 0.12);
      node.x = width / 2 + Math.cos(angle) * radius;
      node.y = height / 2 + Math.sin(angle) * radius;
      node.vx = 0;
      node.vy = 0;
      node.fx = null;
      node.fy = null;
    });
  }

  function drawGraph() {
    svg.replaceChildren();
    graphLayer = svgElement("g");
    edgeLayer = svgElement("g");
    edgeLabelLayer = svgElement("g");
    nodeLayer = svgElement("g");
    graphLayer.append(edgeLayer, edgeLabelLayer, nodeLayer);
    svg.append(graphLayer);
    applyTransform();

    for (const edge of graph.edges) {
      const line = svgElement("line", {
        "data-edge": edge.id,
        class: `edge ${edge.type === "person" ? "person-edge" : ""} ${edge.inferred ? "inferred" : ""}`,
        "stroke-width": edge.type === "person" ? 1.8 : 1.2,
      });
      edgeLayer.append(line);

      const label = svgElement("text", {
        "data-edge-label": edge.id,
        class: "edge-label",
      });
      label.textContent = edge.label;
      edgeLabelLayer.append(label);
    }
    edgeLabelLayer.style.display = labelsToggle.checked ? "" : "none";

    for (const node of graph.nodes) {
      const group = svgElement("g", {
        "data-node": node.id,
        class: `node ${node.id === selectedNodeId ? "selected" : ""}`,
        role: "button",
        tabindex: "0",
        "aria-label": node.label,
      });
      const radius = node.kind === "stop" ? 29 : 22;
      const circle = svgElement("circle", {
        r: radius,
        fill: COLORS[node.kind],
      });
      const id = svgElement("text", { class: "node-id", y: 1 });
      id.textContent = node.shortId;
      const label = svgElement("text", {
        class: "node-label",
        "data-node-label": node.id,
        x: radius + 7,
        y: 4,
      });
      label.textContent = truncate(node.label, 44);
      group.append(circle, id, label);
      group.addEventListener("click", (event) => {
        event.stopPropagation();
        selectNode(node.id);
      });
      group.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") selectNode(node.id);
      });
      group.addEventListener("pointerdown", (event) => startNodeDrag(event, node));
      nodeLayer.append(group);
    }
    updatePositions();
  }

  function restartSimulation() {
    alpha = 1;
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(tick);
  }

  function tick() {
    const nodes = graph.nodes;
    const nodeById = new Map(nodes.map((node) => [node.id, node]));

    for (let left = 0; left < nodes.length; left += 1) {
      for (let right = left + 1; right < nodes.length; right += 1) {
        const a = nodes[left];
        const b = nodes[right];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        const distanceSquared = Math.max(dx * dx + dy * dy, 100);
        const distance = Math.sqrt(distanceSquared);
        const force = (7000 * alpha) / distanceSquared;
        dx /= distance;
        dy /= distance;
        if (a.fx == null) {
          a.vx -= dx * force;
          a.vy -= dy * force;
        }
        if (b.fx == null) {
          b.vx += dx * force;
          b.vy += dy * force;
        }
      }
    }

    for (const edge of graph.edges) {
      const source = nodeById.get(edge.source);
      const target = nodeById.get(edge.target);
      if (!source || !target) continue;
      let dx = target.x - source.x;
      let dy = target.y - source.y;
      const distance = Math.max(Math.hypot(dx, dy), 1);
      const desired = edge.type === "person" ? 200 : edge.type === "relation" ? 155 : 240;
      const force = (distance - desired) * 0.012 * alpha;
      dx /= distance;
      dy /= distance;
      if (source.fx == null) {
        source.vx += dx * force;
        source.vy += dy * force;
      }
      if (target.fx == null) {
        target.vx -= dx * force;
        target.vy -= dy * force;
      }
    }

    for (const node of nodes) {
      if (node.fx != null) {
        node.x = node.fx;
        node.y = node.fy;
        node.vx = 0;
        node.vy = 0;
        continue;
      }
      node.vx += (width / 2 - node.x) * 0.0007 * alpha;
      node.vy += (height / 2 - node.y) * 0.0007 * alpha;
      node.vx *= 0.88;
      node.vy *= 0.88;
      node.x = clamp(node.x + node.vx, 40, width - 120);
      node.y = clamp(node.y + node.vy, 40, height - 40);
    }

    updatePositions();
    alpha *= 0.965;
    if (alpha > 0.018 || dragState) animationFrame = requestAnimationFrame(tick);
  }

  function updatePositions() {
    if (!graphLayer) return;
    const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
    for (const edge of graph.edges) {
      const source = nodeById.get(edge.source);
      const target = nodeById.get(edge.target);
      const line = edgeLayer.querySelector(`[data-edge="${selectorEscape(edge.id)}"]`);
      const label = edgeLabelLayer.querySelector(
        `[data-edge-label="${selectorEscape(edge.id)}"]`,
      );
      if (!source || !target || !line || !label) continue;
      line.setAttribute("x1", source.x);
      line.setAttribute("y1", source.y);
      line.setAttribute("x2", target.x);
      line.setAttribute("y2", target.y);
      label.setAttribute("x", (source.x + target.x) / 2);
      label.setAttribute("y", (source.y + target.y) / 2 - 4);
    }
    for (const node of graph.nodes) {
      const group = nodeLayer.querySelector(`[data-node="${selectorEscape(node.id)}"]`);
      if (!group) continue;
      group.setAttribute("transform", `translate(${node.x} ${node.y})`);
      const label = group.querySelector(
        `[data-node-label="${selectorEscape(node.id)}"]`,
      );
      if (label && node.kind !== "stop") {
        const placeLeft = node.x < width / 2;
        label.setAttribute("x", placeLeft ? -29 : 29);
        label.setAttribute("text-anchor", placeLeft ? "end" : "start");
      }
    }
  }

  function selectNode(id) {
    selectedNodeId = id;
    entitySelect.value = id;
    nodeLayer.querySelectorAll(".node").forEach((group) => {
      group.classList.toggle("selected", group.dataset.node === id);
    });
    const node = graph.nodes.find((candidate) => candidate.id === id);
    if (node) renderDetails(node);
  }

  function renderDetails(node) {
    details.replaceChildren();
    const title = document.createElement("h2");
    title.textContent = node.label;
    const subtitle = document.createElement("p");
    subtitle.className = "muted";
    subtitle.textContent = node.kind === "stop" ? "Root stop node" : humanize(node.kind);
    details.append(title, subtitle);

    if (node.kind === "stop") {
      appendDetailList([
        ["Field contact", graph.report.fc_number],
        ["People", graph.report.people.length],
        ["Vehicles", graph.report.vehicles.length],
        ["Locations", graph.report.locations.length],
        ["Items", graph.report.items.length],
        ["Person edges", graph.report.person_connections.length],
        ["Response time", `${graph.result.elapsed_seconds.toFixed(1)} seconds`],
      ]);
      const attributes = graph.report.stop_attributes;
      const attributeSection = document.createElement("section");
      attributeSection.className = "detail-section";
      const attributeHeading = document.createElement("h2");
      attributeHeading.textContent = "Stop attributes";
      attributeSection.append(attributeHeading);
      appendDetailList(
        compactRows([
          ["Contact date", attributes.contact_date],
          [
            "Contact officer",
            officerLabel(attributes.contact_officer),
          ],
          ["Supervisor", officerLabel(attributes.supervisor)],
          [
            "Structured location",
            [
              attributes.street,
              attributes.city,
              attributes.state,
              attributes.postal_code,
            ]
              .filter(Boolean)
              .join(", "),
          ],
          ["Frisked", formatFlag(attributes.frisked)],
          ["Person searched", formatFlag(attributes.person_searched)],
          ["Vehicle searched", formatFlag(attributes.vehicle_searched)],
          ["Summons issued", formatFlag(attributes.summons_issued)],
          ["Stop duration", attributes.stop_duration],
          ["Circumstance", attributes.circumstance],
          ["Basis", attributes.basis],
          ["Key situations", attributes.key_situations],
          ["Weather", attributes.weather],
          [
            "Reported vehicle",
            Object.values(attributes.reported_vehicle).filter(Boolean).join(" · "),
          ],
        ]),
        attributeSection,
      );
      details.append(attributeSection);

      const section = document.createElement("section");
      section.className = "detail-section";
      const heading = document.createElement("h2");
      heading.textContent = "Case note";
      section.append(heading);
      const caseNote = document.createElement("article");
      caseNote.className = "event case-note";
      caseNote.textContent = graph.report.case_note;
      section.append(caseNote);
      details.append(section);

      if (graph.report.locations.length) {
        const locationSection = document.createElement("section");
        locationSection.className = "detail-section";
        const locationHeading = document.createElement("h2");
        locationHeading.textContent = "Report locations";
        locationSection.append(locationHeading);
        graph.report.locations.forEach((location) => {
          const article = document.createElement("article");
          article.className = "event";
          const name = document.createElement("p");
          name.textContent = `${location.id} · ${locationLabel(location)}`;
          article.append(name);
          const geocode = document.createElement("p");
          geocode.className = "event-locations";
          geocode.textContent = `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)} · ${humanize(location.geocoding_confidence)} confidence`;
          article.append(geocode);
          locationSection.append(article);
        });
        details.append(locationSection);
      }
      return;
    }

    appendDetailList(entityDetails(node));
    const connectedEdges = graph.edges.filter(
      (edge) => edge.source === node.id || edge.target === node.id,
    );
    if (connectedEdges.length) {
      const section = document.createElement("section");
      section.className = "detail-section";
      const heading = document.createElement("h2");
      heading.textContent = "Connections";
      section.append(heading);
      const rows = connectedEdges.map((edge) => {
        const otherId = edge.source === node.id ? edge.target : edge.source;
        const other = graph.nodes.find((candidate) => candidate.id === otherId);
        return [edge.label, other?.label || otherId];
      });
      details.append(section);
      appendDetailList(rows, section);
    }
  }

  function entityDetails(node) {
    const data = node.data;
    if (node.kind === "person") {
      return compactRows([
        ["Mentions", data.mentions],
        ["BPD person ID", data.bpd_person_id],
        ["Sex", data.sex],
        ["Race", data.race],
        ["Ethnicity", data.ethnicity],
        ["Age", data.age],
        ["Build", data.build],
        ["Hair", data.hair],
        ["Skin tone", data.skin_tone],
        ["Clothing", data.clothing],
        ["License", data.license_info],
        ["Frisked", formatFlag(data.frisked)],
        ["Deceased", formatFlag(data.deceased)],
        ["Residences", data.residences],
        ["Affiliations", data.affiliations],
        ["Prior offenses", data.prior_offenses],
        ["Descriptors", data.descriptors],
        ["Outcomes", data.outcomes],
      ]);
    }
    if (node.kind === "vehicle") {
      return compactRows([
        ["Year", data.year],
        ["Make", data.make],
        ["Model", data.model],
        ["Color", data.color],
        ["Body style", data.body_style],
        ["Vehicle type", data.vehicle_type],
        ["Plate", [data.plate_number, data.plate_state].filter(Boolean).join(" · ")],
        ["Attributes", data.attributes],
        ["Notes", data.notes],
      ]);
    }
    return compactRows([
      ["Type", humanize(data.item_type)],
      ["Description", data.description],
      ["Quantity", data.quantity],
    ]);
  }

  function compactRows(rows) {
    return rows.filter(([, value]) => {
      if (value == null || value === "") return false;
      return !Array.isArray(value) || value.length > 0;
    });
  }

  function appendDetailList(rows, parent = details) {
    const list = document.createElement("dl");
    list.className = "detail-list";
    rows.forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "detail-row";
      const term = document.createElement("dt");
      term.textContent = String(label);
      const description = document.createElement("dd");
      description.textContent = Array.isArray(value) ? value.join(" · ") : String(value);
      row.append(term, description);
      list.append(row);
    });
    parent.append(list);
  }

  function startNodeDrag(event, node) {
    event.stopPropagation();
    svg.setPointerCapture(event.pointerId);
    const point = graphPoint(event);
    dragState = { pointerId: event.pointerId, node };
    node.fx = point.x;
    node.fy = point.y;
    selectNode(node.id);
    alpha = Math.max(alpha, 0.35);
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(tick);
  }

  function onBackgroundPointerDown(event) {
    if (event.target.closest?.(".node")) return;
    svg.setPointerCapture(event.pointerId);
    panState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: transform.x,
      originY: transform.y,
    };
  }

  function onPointerMove(event) {
    if (dragState?.pointerId === event.pointerId) {
      const point = graphPoint(event);
      dragState.node.fx = point.x;
      dragState.node.fy = point.y;
      dragState.node.x = point.x;
      dragState.node.y = point.y;
      updatePositions();
      return;
    }
    if (panState?.pointerId === event.pointerId) {
      transform.x = panState.originX + event.clientX - panState.startX;
      transform.y = panState.originY + event.clientY - panState.startY;
      applyTransform();
    }
  }

  function endPointerAction(event) {
    if (dragState?.pointerId === event.pointerId) {
      const node = dragState.node;
      if (node.kind !== "stop") {
        node.fx = null;
        node.fy = null;
      }
      dragState = null;
    }
    if (panState?.pointerId === event.pointerId) panState = null;
    if (svg.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId);
  }

  function onWheel(event) {
    event.preventDefault();
    const rect = svg.getBoundingClientRect();
    const cursorX = event.clientX - rect.left;
    const cursorY = event.clientY - rect.top;
    const oldScale = transform.scale;
    const nextScale = clamp(oldScale * Math.exp(-event.deltaY * 0.0012), 0.45, 2.8);
    transform.x = cursorX - ((cursorX - transform.x) / oldScale) * nextScale;
    transform.y = cursorY - ((cursorY - transform.y) / oldScale) * nextScale;
    transform.scale = nextScale;
    applyTransform();
  }

  function resetView() {
    transform = { x: 0, y: 0, scale: 1 };
    applyTransform();
  }

  function applyTransform() {
    if (graphLayer) {
      graphLayer.setAttribute(
        "transform",
        `translate(${transform.x} ${transform.y}) scale(${transform.scale})`,
      );
    }
  }

  function graphPoint(event) {
    const rect = svg.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left - transform.x) / transform.scale,
      y: (event.clientY - rect.top - transform.y) / transform.scale,
    };
  }

  function humanize(value) {
    return String(value).replaceAll("_", " ");
  }

  function locationLabel(location) {
    if (!location) return "unknown location";
    return location.text;
  }

  function officerLabel(officer) {
    return [officer.name, officer.officer_id].filter(Boolean).join(" · ");
  }

  function formatFlag(value) {
    if (value == null) return null;
    return value ? "Yes" : "No";
  }

  function truncate(value, length) {
    return value.length > length ? `${value.slice(0, length - 1)}…` : value;
  }

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function selectorEscape(value) {
    return CSS.escape(value);
  }
})();
