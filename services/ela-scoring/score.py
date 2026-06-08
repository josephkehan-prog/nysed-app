"""Automated rubric-trait scoring for ELA short responses (no human in the loop).

The conventions trait is derived from a pluggable `grammar_check` callable so a
LanguageTool backend can replace the default heuristic without changing callers.
Deterministic for a fixed grammar_check.
"""
from __future__ import annotations

import re
from typing import Callable


def _default_grammar_check(text: str) -> int:
    """Heuristic error count: double spaces + lowercase sentence starts."""
    errors = len(re.findall(r"  +", text))
    for sentence in re.split(r"[.!?]+", text):
        s = sentence.strip()
        if s and s[0].islower():
            errors += 1
    return errors


def score_short_response(
    response: str,
    rubric: dict,
    grammar_check: Callable[[str], int] = _default_grammar_check,
) -> dict:
    max_trait = rubric.get("maxPerTrait", 4)
    min_words = rubric.get("minWords", 20)

    words = re.findall(r"[A-Za-z']+", response)
    num_words = len(words)
    content = (
        max_trait
        if num_words >= min_words
        else round(max_trait * num_words / min_words, 2)
    )

    sentences = [s for s in re.split(r"[.!?]+", response) if s.strip()]
    organization = max_trait if len(sentences) >= 2 else max_trait / 2

    conventions = max(0, max_trait - grammar_check(response))

    total = round(content + organization + conventions, 2)
    return {
        "content": content,
        "organization": organization,
        "conventions": conventions,
        "total": total,
    }
