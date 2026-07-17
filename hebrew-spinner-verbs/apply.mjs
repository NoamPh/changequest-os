#!/usr/bin/env node
// ממזג את פעלי-הספינר העבריים לתוך קובץ settings.json של Claude Code
// שימוש:
//   node apply.mjs [נתיב-settings] [mode]
// דוגמאות:
//   node apply.mjs                       -> ~/.claude/settings.json, mode=replace
//   node apply.mjs .claude/settings.json append
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const settingsPath = process.argv[2] || join(homedir(), ".claude", "settings.json");
const mode = process.argv[3] || "replace";

if (!["append", "replace"].includes(mode)) {
  console.error(`mode לא חוקי: "${mode}". חייב להיות "append" או "replace".`);
  process.exit(1);
}

const verbs = JSON.parse(readFileSync(join(here, "verbs.json"), "utf8"));

let settings = {};
if (existsSync(settingsPath)) {
  const raw = readFileSync(settingsPath, "utf8").trim();
  if (raw) {
    try {
      settings = JSON.parse(raw);
    } catch (e) {
      console.error(`הקובץ ${settingsPath} אינו JSON תקין — עצרתי כדי לא לדרוס אותו.`);
      process.exit(1);
    }
  }
}

settings.spinnerVerbs = { mode, verbs };

mkdirSync(dirname(settingsPath), { recursive: true });
writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");

console.log(`✓ נכתבו ${verbs.length} פעלים אל ${settingsPath} (mode: ${mode})`);
console.log("פתחו סשן חדש של Claude Code (או הריצו /status) כדי לראות אותם בפעולה.");
