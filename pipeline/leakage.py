"""Anti-leakage similarity check against the released-item corpus.

Guards against generated/OER items accidentally reproducing released NYSED
items. Probabilistic, not a guarantee.
"""
from __future__ import annotations

import re


def _tokens(text: str) -> set[str]:
    return set(re.findall(r"[a-z0-9]+", text.lower()))


def similarity(a: str, b: str) -> float:
    """Jaccard token overlap in [0, 1]."""
    ta, tb = _tokens(a), _tokens(b)
    if not ta and not tb:
        return 1.0
    if not ta or not tb:
        return 0.0
    return len(ta & tb) / len(ta | tb)


def is_leak(candidate: str, corpus: list[str], threshold: float = 0.8) -> bool:
    """True if candidate is too similar to any released item in the corpus."""
    return any(similarity(candidate, item) >= threshold for item in corpus)
