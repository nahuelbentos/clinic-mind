---
name: check-prompt
description: Analyzes a planned task for token efficiency before execution. Use when the user describes a large or complex task.
argument-hint: <describe your task here>
---

Analyze the following planned task for token/context efficiency, using the guidelines in `.claude/PROMPT_EFFICIENCY.md`.

Task to analyze:
$ARGUMENTS

## Your analysis must include:

### 1. Complexity Score
Rate the task 1-10 based on:
- Number of files likely to be touched
- Whether it's a mass operation (migrate, translate, refactor all, etc.)
- Whether the prompt includes inline code examples
- Whether subtasks are independent or tightly coupled

### 2. Risk Factors
List the specific signals that make this task expensive (e.g., "affects 20+ files", "requires full file rewrites", "no clear stopping point").

### 3. Recommended Approach
One of:
- **Go ahead** (score < 4): Task is focused enough, proceed as-is
- **Minor adjustments** (score 4-6): Suggest small changes to reduce cost
- **Split into sessions** (score 7-10): Provide a concrete session breakdown

### 4. Optimized Prompt (if needed)
If the task needs splitting or rewording, provide the **first session's prompt** rewritten to be more efficient, using the template:

```
OBJETIVO: ...
SCOPE: ...
CONTEXTO: ...
RESTRICCIONES: ...
ENTREGABLE: ...
```

### 5. Session Plan (if splitting is recommended)
A numbered list of focused sessions, each with scope and estimated file count.

---

Be direct. If the task is fine, say so. If it needs splitting, provide the exact breakdown — don't just say "consider splitting".
