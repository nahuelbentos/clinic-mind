#!/bin/bash
# prompt-complexity-check.sh
# Runs on every UserPromptSubmit. Detects high-complexity prompts and
# injects a warning into Claude's context so it can proactively advise the user.

INPUT=$(cat)
PROMPT=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data.get('prompt', ''))
except:
    print('')
")

WORD_COUNT=$(echo "$PROMPT" | wc -w | tr -d ' ')
COMPLEXITY=0
REASONS=""

# --- Heuristics ---

# 1. Long prompt
if [ "$WORD_COUNT" -gt 300 ]; then
    COMPLEXITY=$((COMPLEXITY + 3))
    REASONS="$REASONS long-prompt(${WORD_COUNT}w)"
elif [ "$WORD_COUNT" -gt 150 ]; then
    COMPLEXITY=$((COMPLEXITY + 1))
    REASONS="$REASONS medium-prompt(${WORD_COUNT}w)"
fi

# 2. Mass scope keywords (all, every, entire, whole, each)
if echo "$PROMPT" | grep -qiE '\b(all|every|entire|whole|each|todos|todo|toda|cada)\b'; then
    COMPLEXITY=$((COMPLEXITY + 2))
    REASONS="$REASONS scope-amplifier"
fi

# 3. Mass operation keywords (migrate, refactor, rewrite, translate, convert, replace)
if echo "$PROMPT" | grep -qiE '\b(migrat|refactor|rewrite|translat|convert|replace all|rename all|mover todo|traducir)\b'; then
    COMPLEXITY=$((COMPLEXITY + 2))
    REASONS="$REASONS mass-operation"
fi

# 4. Many file references
FILE_REFS=$(echo "$PROMPT" | grep -oiE '\b(file|component|page|module|archivo|componente|pagina)\b' | wc -l | tr -d ' ')
if [ "$FILE_REFS" -gt 6 ]; then
    COMPLEXITY=$((COMPLEXITY + 2))
    REASONS="$REASONS many-file-refs(${FILE_REFS})"
elif [ "$FILE_REFS" -gt 3 ]; then
    COMPLEXITY=$((COMPLEXITY + 1))
    REASONS="$REASONS some-file-refs(${FILE_REFS})"
fi

# 5. Inline code blocks in the prompt (backtick fences)
CODE_BLOCKS=$(echo "$PROMPT" | grep -c '```' | tr -d ' ')
if [ "$CODE_BLOCKS" -gt 2 ]; then
    COMPLEXITY=$((COMPLEXITY + 2))
    REASONS="$REASONS inline-code-blocks(${CODE_BLOCKS})"
fi

# 6. Multiple distinct tasks chained
TASK_CONNECTORS=$(echo "$PROMPT" | grep -oiE '\b(and then|also|additionally|furthermore|luego|ademas|tambien|y tambien|y luego)\b' | wc -l | tr -d ' ')
if [ "$TASK_CONNECTORS" -gt 3 ]; then
    COMPLEXITY=$((COMPLEXITY + 2))
    REASONS="$REASONS chained-tasks(${TASK_CONNECTORS})"
fi

# --- Output ---
# Only inject context if complexity is high enough (score >= 5)
if [ "$COMPLEXITY" -ge 5 ]; then
    python3 - << PYEOF
import json
score = $COMPLEXITY
reasons = "$REASONS".strip()
output = {
    "hookSpecificOutput": {
        "hookEventName": "UserPromptSubmit",
        "additionalContext": f"""[PROMPT COMPLEXITY ALERT — score: {score}/10, signals: {reasons}]

Before starting, consider warning the user about token efficiency:
- This prompt has signals of high complexity that may consume significant context.
- Suggest checking .claude/PROMPT_EFFICIENCY.md or running /check-prompt for a breakdown.
- If scope is very large, proactively ask: "This looks like a large task. Want me to break it into focused sessions to avoid hitting context limits?"
- Prefer Edit over Write, use subagents for parallel work, avoid reading entire files when only sections are needed."""
    }
}
print(json.dumps(output))
PYEOF
fi

exit 0
