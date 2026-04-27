#!/bin/bash
# setup-claude-efficiency.sh
# Bootstraps Claude Code efficiency tools in a new project.
# Run from the project root: bash scripts/setup-claude-efficiency.sh
# Or from anywhere:          bash /path/to/setup-claude-efficiency.sh /path/to/project

set -e

PROJECT_DIR="${1:-$(pwd)}"
GLOBAL_DIR="$HOME/.claude"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$(dirname "$SCRIPT_DIR")/.claude"  # sibling .claude/ of scripts/

# ── Colors ─────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()  { echo -e "${BLUE}[setup]${NC} $1"; }
ok()   { echo -e "${GREEN}[done]${NC}  $1"; }
warn() { echo -e "${YELLOW}[skip]${NC}  $1"; }

echo ""
echo "Claude Code Efficiency Setup"
echo "============================"
echo "Project: $PROJECT_DIR"
echo ""

# ── 1. Global: hook script ──────────────────────────────────────────────────
HOOK_DEST="$GLOBAL_DIR/hooks/prompt-complexity-check.sh"

if [ -f "$HOOK_DEST" ]; then
    warn "Hook already exists at $HOOK_DEST — skipping"
else
    log "Installing hook to $HOOK_DEST..."
    mkdir -p "$GLOBAL_DIR/hooks"
    cp "$SOURCE_DIR/hooks/prompt-complexity-check.sh" "$HOOK_DEST"
    chmod +x "$HOOK_DEST"
    ok "Hook installed"
fi

# ── 2. Global: check-prompt skill ──────────────────────────────────────────
SKILL_DEST="$GLOBAL_DIR/skills/check-prompt/SKILL.md"

if [ -f "$SKILL_DEST" ]; then
    warn "Skill already exists at $SKILL_DEST — skipping"
else
    log "Installing /check-prompt skill..."
    mkdir -p "$GLOBAL_DIR/skills/check-prompt"
    cp "$SOURCE_DIR/skills/check-prompt/SKILL.md" "$SKILL_DEST"
    ok "Skill installed"
fi

# ── 3. Global: hook registration in settings.json ──────────────────────────
SETTINGS="$GLOBAL_DIR/settings.json"
HOOK_CMD="~/.claude/hooks/prompt-complexity-check.sh"

if [ ! -f "$SETTINGS" ]; then
    log "Creating $SETTINGS with hook..."
    cat > "$SETTINGS" << 'EOF'
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/prompt-complexity-check.sh"
          }
        ]
      }
    ]
  }
}
EOF
    ok "settings.json created"
elif grep -q "prompt-complexity-check" "$SETTINGS" 2>/dev/null; then
    warn "Hook already registered in $SETTINGS — skipping"
else
    warn "Hook not registered automatically (settings.json already exists)"
    echo "      Add this manually to $SETTINGS:"
    echo '      "hooks": { "UserPromptSubmit": [{ "hooks": [{ "type": "command", "command": "~/.claude/hooks/prompt-complexity-check.sh" }] }] }'
fi

# ── 4. Per-project: PROMPT_EFFICIENCY.md ───────────────────────────────────
GUIDE_SRC="$SOURCE_DIR/PROMPT_EFFICIENCY.md"
GUIDE_DEST="$PROJECT_DIR/.claude/PROMPT_EFFICIENCY.md"

if [ -f "$GUIDE_DEST" ]; then
    warn "PROMPT_EFFICIENCY.md already exists in project — skipping"
else
    log "Copying PROMPT_EFFICIENCY.md to project..."
    mkdir -p "$PROJECT_DIR/.claude"
    cp "$GUIDE_SRC" "$GUIDE_DEST"
    ok "Guide copied to $GUIDE_DEST"
fi

echo ""
echo "Setup complete!"
echo ""
echo "What's active globally (all projects):"
echo "  ~/.claude/hooks/prompt-complexity-check.sh  — auto-detects complex prompts"
echo "  ~/.claude/skills/check-prompt/SKILL.md       — /check-prompt skill"
echo ""
echo "What's active in this project:"
echo "  .claude/PROMPT_EFFICIENCY.md                  — efficiency guide"
echo ""
echo "Usage:"
echo "  /check-prompt <describe your task>   — analyze before executing"
echo ""
