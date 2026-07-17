#!/usr/bin/env bash
# מתקין את פעלי-הספינר העבריים לתוך Claude Code.
#
# שימוש:
#   ./install.sh                 # גלובלי: ~/.claude/settings.json  (mode=replace)
#   ./install.sh --project       # הפרויקט הנוכחי: .claude/settings.json
#   ./install.sh --append        # מוסיף לברירות המחדל במקום להחליף
#   ./install.sh --project --append
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

SETTINGS="$HOME/.claude/settings.json"
MODE="replace"

for arg in "$@"; do
  case "$arg" in
    --project) SETTINGS=".claude/settings.json" ;;
    --append)  MODE="append" ;;
    --replace) MODE="replace" ;;
    *) echo "דגל לא מוכר: $arg"; exit 1 ;;
  esac
done

node "$DIR/apply.mjs" "$SETTINGS" "$MODE"
