export const SHEET_DEFINITIONS = Object.freeze([
  {
    tab: "ELISA Results",
    range: "'ELISA Results'!A:AD",
    detailHeader: "Pathogen / Antigen",
    resultHeader: "Positive %",
    sampleHeader: "Sample Count",
  },
  {
    tab: "HI Results",
    range: "'HI Results'!A:U",
    detailHeader: "Pathogen / Antigen",
    resultHeader: "Overall Mean",
    sampleHeader: "Sample Count",
  },
  {
    tab: "PCR Results",
    range: "'PCR Results'!A:U",
    detailHeader: "Target Pathogen",
    fallbackDetailHeader: "Pathogen / Antigen",
    resultHeader: "Result",
  },
  {
    tab: "Antibiotic Results",
    range: "'Antibiotic Results'!A:S",
    detailHeader: "Antibiotic Name",
    resultHeader: "Interpretation",
  },
  {
    tab: "Bacteriology Results",
    range: "'Bacteriology Results'!A:S",
    detailHeader: "Organism",
    resultHeader: "Result",
  },
]);

const MONTH_KEY_PATTERN = /^\d{4}-\d{2}$/;

function text(value) {
  return value == null ? "" : String(value).trim();
}

export function toNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(text(value).replace(/,/g, "").replace(/%$/, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function normalizeDate(value) {
  const raw = text(value);
  if (!raw) return "";

  const iso = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) {
    return `${iso[1]}-${iso[2].padStart(2, "0")}-${iso[3].padStart(2, "0")}`;
  }

  const local = raw.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{4})$/);
  if (local) {
    return `${local[3]}-${local[2].padStart(2, "0")}-${local[1].padStart(2, "0")}`;
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.valueOf())) return "";
  return parsed.toISOString().slice(0, 10);
}

export function rowsToObjects(values = []) {
  if (!Array.isArray(values) || values.length < 2) return [];
  const headers = values[0].map(text);
  return values.slice(1).map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])),
  );
}

function uniqueList(values) {
  return [...new Set(values.map(text).filter(Boolean))];
}

function mergeTest(existing, incoming) {
  existing.details = uniqueList([...existing.details, ...incoming.details]);
  existing.results = uniqueList([...existing.results, ...incoming.results]);
  existing.qualityFlags = uniqueList([
    ...existing.qualityFlags,
    ...incoming.qualityFlags,
  ]);
  existing.sampleCount = Math.max(existing.sampleCount, incoming.sampleCount);
  existing.statuses = uniqueList([...existing.statuses, ...incoming.statuses]);
  for (const key of [
    "date",
    "customer",
    "farm",
    "lab",
    "area",
    "fieldForce",
    "sampleType",
  ]) {
    if (!existing[key] && incoming[key]) existing[key] = incoming[key];
  }
  return existing;
}

export function normalizeValueRanges(valueRanges = []) {
  const rawRecords = [];

  SHEET_DEFINITIONS.forEach((definition, index) => {
    const rows = rowsToObjects(valueRanges[index]?.values ?? []);
    for (const row of rows) {
      const id = text(row["Test ID"]);
      if (!id) continue;

      const detail = text(
        row[definition.detailHeader] ?? row[definition.fallbackDetailHeader],
      );
      const result = text(row[definition.resultHeader]);

      rawRecords.push({
        id,
        date: normalizeDate(row["Test Date"]),
        customer: text(row["Customer Name"]),
        farm: text(row["Farm Name (Optional)"]),
        lab: text(row["Lab Name"]),
        area: text(row.Area),
        fieldForce: text(row["Field Force"]),
        sampleType: text(row["Sample Type"]),
        category: text(row["Test Category"]) || definition.tab.replace(" Results", ""),
        details: detail ? [detail] : [],
        results: result ? [result] : [],
        sampleCount: definition.sampleHeader
          ? toNumber(row[definition.sampleHeader])
          : 0,
        statuses: [text(row.Status)],
        qualityFlags: text(row["Quality Flag"]) ? [text(row["Quality Flag"])] : [],
      });
    }
  });

  const tests = new Map();
  for (const record of rawRecords) {
    const key = `${record.category}::${record.id}`;
    if (tests.has(key)) {
      mergeTest(tests.get(key), record);
    } else {
      tests.set(key, record);
    }
  }

  return [...tests.values()]
    .map((record) => ({
      ...record,
      detail: record.details.join(", "),
      result: record.results.join(", "),
      qualityFlag: record.qualityFlags.join("; "),
      status:
        record.statuses.length > 0 &&
        record.statuses.every((status) => status.toLowerCase() === "complete")
          ? "Complete"
          : record.statuses.find(Boolean) || "Incomplete",
      year: record.date.slice(0, 4),
      month: record.date.slice(5, 7),
      monthKey: record.date.slice(0, 7),
    }))
    .sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}

export function completedTests(records = []) {
  return records.filter((record) => record.status.toLowerCase() === "complete");
}

export function filterRecords(records = [], filters = {}) {
  const customer = text(filters.customer).toLowerCase();
  const category = text(filters.category).toLowerCase();
  const detail = text(filters.detail).toLowerCase();
  const year = text(filters.year);
  const month = text(filters.month);

  return records.filter((record) => {
    if (customer && record.customer.toLowerCase() !== customer) return false;
    if (category && record.category.toLowerCase() !== category) return false;
    if (
      detail &&
      !record.details.some((value) => value.toLowerCase() === detail)
    ) {
      return false;
    }
    if (year && record.year !== year) return false;
    if (month && record.month !== month) return false;
    return true;
  });
}

export function calculateMetrics(records = []) {
  const pcrRecords = records.filter(
    (record) => record.category.toLowerCase() === "pcr",
  );
  const pcrReported = pcrRecords.filter((record) =>
    ["positive", "negative"].includes(record.result.toLowerCase()),
  );
  const pcrPositive = pcrReported.filter(
    (record) => record.result.toLowerCase() === "positive",
  ).length;

  return {
    completed: records.length,
    samples: records.reduce((total, record) => total + record.sampleCount, 0),
    customers: new Set(records.map((record) => record.customer).filter(Boolean))
      .size,
    farms: new Set(records.map((record) => record.farm).filter(Boolean)).size,
    pcrPositiveRate:
      pcrReported.length > 0 ? (pcrPositive / pcrReported.length) * 100 : null,
    flagged: records.filter((record) => record.qualityFlags.length > 0).length,
  };
}

export function categoryCounts(records = []) {
  const counts = new Map();
  for (const record of records) {
    counts.set(record.category, (counts.get(record.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export function resultCounts(records = [], category = "PCR") {
  const counts = new Map();
  for (const record of records) {
    if (record.category.toLowerCase() !== category.toLowerCase()) continue;
    const result = record.result || "Not Reported";
    counts.set(result, (counts.get(result) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export function monthlyCounts(records = [], selectedYear = "") {
  const relevant = selectedYear
    ? records.filter((record) => record.year === selectedYear)
    : records;
  const counts = new Map();

  for (const record of relevant) {
    if (MONTH_KEY_PATTERN.test(record.monthKey)) {
      counts.set(record.monthKey, (counts.get(record.monthKey) ?? 0) + 1);
    }
  }

  if (selectedYear) {
    return Array.from({ length: 12 }, (_, index) => {
      const key = `${selectedYear}-${String(index + 1).padStart(2, "0")}`;
      return { key, value: counts.get(key) ?? 0 };
    });
  }

  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => ({ key, value }));
}

export function getFilterOptions(records = []) {
  return {
    customers: uniqueList(records.map((record) => record.customer)).sort((a, b) =>
      a.localeCompare(b),
    ),
    categories: uniqueList(records.map((record) => record.category)).sort((a, b) =>
      a.localeCompare(b),
    ),
    details: uniqueList(records.flatMap((record) => record.details)).sort((a, b) =>
      a.localeCompare(b),
    ),
    years: uniqueList(records.map((record) => record.year))
      .filter((value) => /^\d{4}$/.test(value))
      .sort((a, b) => b.localeCompare(a)),
  };
}
