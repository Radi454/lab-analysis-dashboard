import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateMetrics,
  completedTests,
  filterRecords,
  monthlyCounts,
  normalizeDatabaseRows,
  normalizeDate,
  normalizeValueRanges,
  recentlyAdded,
} from "../dashboard-core.js";

function range(headers, rows) {
  return { values: [headers, ...rows] };
}

test("normalizes dates in ISO and Egyptian day-first formats", () => {
  assert.equal(normalizeDate("2026-03-11"), "2026-03-11");
  assert.equal(normalizeDate("11/03/2026"), "2026-03-11");
});

test("deduplicates antibiotic rows into one completed test", () => {
  const empty = { values: [] };
  const tests = normalizeValueRanges([
    empty,
    empty,
    empty,
    range(
      [
        "Test ID",
        "Test Date",
        "Customer Name",
        "Farm Name (Optional)",
        "Test Category",
        "Antibiotic Name",
        "Interpretation",
        "Status",
      ],
      [
        [
          "TEST-1",
          "2026-03-12",
          "Customer A",
          "",
          "Antibiotic Sensitivity",
          "Fosfomycin",
          "Highly Sensitive",
          "Complete",
        ],
        [
          "TEST-1",
          "2026-03-12",
          "Customer A",
          "",
          "Antibiotic Sensitivity",
          "Gentamicin",
          "Highly Sensitive",
          "Complete",
        ],
      ],
    ),
    empty,
  ]);

  assert.equal(tests.length, 1);
  assert.deepEqual(tests[0].details, ["Fosfomycin", "Gentamicin"]);
  assert.equal(completedTests(tests).length, 1);
});

test("calculates metrics and applies customer/year filters", () => {
  const records = [
    {
      id: "A",
      customer: "Customer A",
      farm: "",
      category: "ELISA",
      details: ["IBDV"],
      result: "",
      sampleCount: 20,
      qualityFlags: [],
      year: "2026",
      month: "03",
      monthKey: "2026-03",
      status: "Complete",
    },
    {
      id: "B",
      customer: "Customer B",
      farm: "Farm 1",
      category: "PCR",
      details: ["NDV"],
      result: "Positive",
      sampleCount: 0,
      qualityFlags: ["Review"],
      year: "2025",
      month: "12",
      monthKey: "2025-12",
      status: "Complete",
    },
  ];

  assert.equal(
    filterRecords(records, { customer: "Customer A", year: "2026" }).length,
    1,
  );
  assert.deepEqual(calculateMetrics(records), {
    completed: 2,
    samples: 20,
    customers: 2,
    farms: 1,
    pcrPositiveRate: 100,
    flagged: 1,
  });
  assert.deepEqual(monthlyCounts(records, "2026")[2], {
    key: "2026-03",
    value: 1,
  });
});

test("normalizes protected database rows and orders recently added tests", () => {
  const records = completedTests(
    normalizeDatabaseRows([
      {
        test_id: "TEST-OLDER",
        test_date: "2026-03-10",
        customer_name: "Customer A",
        farm_name: "",
        test_category: "PCR",
        detail: "NDV",
        result: "Negative",
        sample_count: 0,
        status: "Complete",
        quality_flag: "",
        added_at: "2026-03-10T10:00:00Z",
        added_by: "admin@example.com",
      },
      {
        test_id: "TEST-NEWER",
        test_date: "2026-03-09",
        customer_name: "Customer B",
        farm_name: "",
        test_category: "ELISA",
        detail: "IBDV",
        result: "100",
        sample_count: 10,
        status: "Complete",
        quality_flag: "",
        added_at: "2026-03-12T10:00:00Z",
        added_by: "admin@example.com",
      },
    ]),
  );

  assert.equal(records.length, 2);
  assert.equal(recentlyAdded(records, 1)[0].id, "TEST-NEWER");
});
