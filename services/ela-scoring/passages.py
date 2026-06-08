"""Passage model + license gating.

Excludes non-redistributable sources (notably CommonLit) so only openly-licensed
or public-domain passages are served.
"""
from __future__ import annotations

from dataclasses import dataclass

_BLOCKED = ("commonlit",)


@dataclass
class Passage:
    title: str
    text: str
    source: str
    license: str


def is_allowed(passage: Passage) -> bool:
    haystack = f"{passage.source} {passage.license}".lower()
    return not any(blocked in haystack for blocked in _BLOCKED)
