import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const requiredFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "dashboard-core.js",
  "config.js",
  "assets/zoetis-logo.png",
  "vendor/supabase.js",
  ".nojekyll",
];

for (const file of requiredFiles) {
  const info = await stat(new URL(`../${file}`, import.meta.url));
  assert.ok(info.isFile(), `${file} must exist`);
}

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
const config = await readFile(new URL("../config.js", import.meta.url), "utf8");

assert.match(html, /lang="en"/);
assert.match(html, /vendor\/supabase\.js/);
assert.match(html, /id="authForm"/);
assert.match(html, /id="recentHistory"/);
assert.match(html, /id="registerToggle"/);
assert.match(html, /id="registerTabs"/);
assert.match(html, /id="customerFilter"[\s\S]*role="combobox"/);
assert.match(html, /id="customerSuggestions"[\s\S]*role="listbox"/);
assert.match(html, /class="filter-button-list" id="categoryFilter"/);
assert.match(html, /class="pathogen-filter-groups" id="detailFilter"/);
assert.match(html, /class="filter-button-list" id="yearFilter"/);
assert.match(html, /class="filter-button-list month-buttons" id="monthFilter"/);
assert.match(app, /expandedHistoryCategories/);
assert.match(app, /registerCategory/);
assert.doesNotMatch(
  html,
  /<select id="(?:customerFilter|categoryFilter|detailFilter|yearFilter|monthFilter)"/,
);
assert.match(app, /signInWithPassword/);
assert.match(app, /authorized_users/);
assert.match(app, /lab_result_rows/);
assert.match(app, /setInterval/);
assert.match(config, /https:\/\/leuqbsfyypfhhypfsjpx\.supabase\.co/);
assert.match(config, /sb_publishable_[A-Za-z0-9_-]+/);
assert.doesNotMatch(html, /accounts\.google\.com|Continue with Google/);
assert.doesNotMatch(app, /google\.accounts|spreadsheets\.readonly|values:batchGet/);
assert.doesNotMatch(
  config,
  /BEGIN PRIVATE KEY|client_secret|service_account|service_role|sb_secret_/,
);
assert.doesNotMatch(app, /\b(?:ELI|HIT|AST|BAC)-\d/);
assert.doesNotMatch(html, /\b(?:ELI|HIT|AST|BAC)-\d/);

console.log("Static dashboard validation passed.");
