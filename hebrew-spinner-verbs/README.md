# hebrew-spinner-verbs 🌀

> Funny Hebrew verbs for Claude Code's "thinking" spinner —
> **מדרבק… · מכווצץ… · מסנטז… · מפבלש…**

[![CI](https://github.com/NoamPh/hebrew-spinner-verbs/actions/workflows/ci.yml/badge.svg)](https://github.com/NoamPh/hebrew-spinner-verbs/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Claude Code shows a rotating verb next to its spinner while it works
(*Thinking…, Simmering…, Noodling…*). This tiny tool swaps them for a set of
playful, made-up Hebrew verbs. It's a thin, safe wrapper around the official
[`spinnerVerbs`](#how-it-works) setting.

*[עברית למטה ⬇︎](#עברית)*

---

## Quick start

```bash
# Global — applies everywhere (~/.claude/settings.json)
npx hebrew-spinner-verbs

# This project only (./.claude/settings.json)
npx hebrew-spinner-verbs --project

# Add to Claude's built-in verbs instead of replacing them
npx hebrew-spinner-verbs --append

# Feminine forms (Hebrew-origin verbs only)
npx hebrew-spinner-verbs --feminine

# Preview the JSON without writing anything
npx hebrew-spinner-verbs --print
```

Then open a **new** Claude Code session — the verbs appear next to the spinner.

No Node? Clone the repo and run `./install.sh` (same flags), or copy the block
from [`settings.json`](./settings.json) into your settings file by hand.

## How it works

Claude Code (v2.1.23+) officially supports a `spinnerVerbs` setting. The exact
schema (verified against the CLI source) is:

```json
{
  "spinnerVerbs": {
    "mode": "replace",
    "verbs": ["מדרבק", "מכווצץ", "מסנטז", "מפבלש"]
  }
}
```

- `mode: "replace"` — use **only** your verbs.
- `mode: "append"` — your verbs **plus** Claude's built-in defaults.

The setting is read from the `settings.json` hierarchy:

| Scope | Path |
| --- | --- |
| User (global) | `~/.claude/settings.json` |
| Project (shared) | `.claude/settings.json` |
| Local (personal, per-project) | `.claude/settings.local.json` |

`hebrew-spinner-verbs` merges the block into the target file **without touching
your other settings**, and refuses to run if the file contains invalid JSON.

## Customize the verbs

The list lives in [`verbs.json`](./verbs.json) — a plain string array. Edit or
add your own, then re-run the installer. Present-tense masculine-singular forms
(the `מ־` prefix) read best.

Feminine forms of the Hebrew-origin verbs live in
[`verbs.fem.json`](./verbs.fem.json) and are used with `--feminine`. Foreign
loanwords (מרנדר, מדבג, מג'נרט…) have no natural Hebrew feminine form, so they're
intentionally left out of that list.

## Uninstall

Remove the `"spinnerVerbs"` key from your `settings.json` (or set
`mode` back to `"append"` with an empty edit). Claude falls back to its
built-in verbs.

## A note on RTL

Terminals render the spinner line left-to-right, so Hebrew may look slightly
odd next to the token counter. The verbs themselves read fine — it's a terminal
display quirk, not a config problem.

## Is this a "plugin"?

Not exactly. `spinnerVerbs` is read from the `settings.json` hierarchy, and the
Claude Code plugin system (skills / agents / hooks / MCP) doesn't expose a field
to override spinner verbs. A [`.claude-plugin/plugin.json`](./.claude-plugin/plugin.json)
manifest is included for discoverability, but the verbs are applied through
`settings.json` — which is exactly what the CLI here does.

## Contributing

PRs adding verbs or themes are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)

---

<a name="עברית"></a>

## עברית

תוסף קטן שמחליף את פעלי ה"חשיבה" שמופיעים ליד הספינר של **Claude Code** (הכלי
בטרמינל) בפעלים עבריים מצחיקים וממוצאים: *מדרבק, מכווצץ, מסנטז, מפבלש* ועוד.

### התקנה מהירה

```bash
npx hebrew-spinner-verbs            # גלובלי (~/.claude/settings.json)
npx hebrew-spinner-verbs --project  # רק לפרויקט הנוכחי
npx hebrew-spinner-verbs --append   # להוסיף מעל ברירות המחדל
npx hebrew-spinner-verbs --feminine # צורות נקבה (רק לפעלים ממקור עברי)
npx hebrew-spinner-verbs --print    # להדפיס את ה-JSON בלי לכתוב
```

אחר כך פתחו סשן חדש של Claude Code — הפעלים יופיעו ליד הספינר. בלי Node?
שכפלו את ה-repo והריצו `./install.sh` (אותם דגלים), או העתיקו ידנית את הבלוק
מ-[`settings.json`](./settings.json).

### איך זה עובד

מגרסה 2.1.23 יש ל-Claude Code הגדרה רשמית `spinnerVerbs`. המבנה (מאומת מול קוד
ה-CLI): `{ "mode": "replace" | "append", "verbs": [...] }`. הכלי ממזג את הבלוק
לתוך `settings.json` **בלי לדרוס** שאר הגדרות, ומסרב לרוץ אם הקובץ אינו JSON תקין.

### עריכת הפעלים

הרשימה נמצאת ב-[`verbs.json`](./verbs.json) — מערך מחרוזות פשוט. ערכו/הוסיפו
והריצו שוב. פעלים בהווה זכר יחיד (מ־...) עובדים הכי טוב. צורות הנקבה (רק לפעלים
ממקור עברי) נמצאות ב-[`verbs.fem.json`](./verbs.fem.json) ומופעלות עם `--feminine`.
פעלים לועזיים (מרנדר, מדבג, מג'נרט...) אין להם נטיית נקבה עברית טבעית ולכן הם לא
נכללים שם.

### הערה על כיווניות (RTL)

הטרמינל מציג את שורת הספינר משמאל-לימין, ולכן עברית עלולה להיראות מעט משונה לצד
מונה הטוקנים — עניין תצוגה, לא של ההגדרה.
