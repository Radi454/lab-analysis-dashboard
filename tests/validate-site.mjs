import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const requiredFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "dashboard-core.js",
  "config.js",
  "assets/zoetis-logo.png",
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
assert.match(html, /google\.accounts\.oauth2/);
assert.match(app, /spreadsheets\.readonly/);
assert.match(app, /values:batchGet/);
assert.match(app, /setInterval/);
assert.match(config, /1KKZU6T2OikNZp6CdBm47uGwKiox7d_MxAHURMD8fx4E/);
assert.match(
  config,
  /googleClientId:[\s\S]*"\d+-[a-z0-9]+\.apps\.googleusercontent\.com"/,
);
assert.doesNotMatch(config, /BEGIN PRIVATE KEY|client_secret|service_account/);
assert.doesNotMatch(app, /\b(?:ELI|HIT|AST|BAC)-\d/);
assert.doesNotMatch(html, /\b(?:ELI|HIT|AST|BAC)-\d/);

console.log("Static dashboard validation passed.");
