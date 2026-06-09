---
name: content-ingestion-pipeline
description: Workflow command scaffold for content-ingestion-pipeline in nysed-app.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /content-ingestion-pipeline

Use this workflow when working on **content-ingestion-pipeline** in `nysed-app`.

## Goal

Adds new educational content modules via an automated ingestion script, resulting in new JSON files and index updates.

## Common Files

- `scripts/ingest-im-tasks.ts`
- `src/modules/content/math/*.json`
- `src/modules/content/math/index.ts`
- `src/content/imParse.ts`
- `src/content/imParse.test.ts`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Write or update an ingestion script (e.g., scripts/ingest-*.ts)
- Parse and transform source content into JSON module files (e.g., src/modules/content/math/*.json)
- Update or create index files to auto-discover new modules (e.g., src/modules/content/math/index.ts)
- Add or update tests for parsing/ingestion logic (e.g., src/content/imParse.test.ts, src/content/imParse.ts)
- Run the ingestion script to generate new content files

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.