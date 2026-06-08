"""Deterministic math answer-key verification using SymPy.

Replaces human key-checking: a candidate answer is correct iff it is
*symbolically equivalent* to the expected key, so equivalent forms
(1/2 vs 0.5, commuted terms, expanded vs factored) all match.
"""
from __future__ import annotations

from sympy import simplify, sympify
from sympy.core.sympify import SympifyError


def _parse(expr: str):
    return sympify(expr)


def is_equivalent(a: str, b: str) -> bool:
    """True iff a and b parse to symbolically equivalent expressions.

    Invalid input never raises — it returns False.
    """
    try:
        ea = _parse(a)
        eb = _parse(b)
    except (SympifyError, SyntaxError, TypeError, ValueError):
        return False
    try:
        return simplify(ea - eb) == 0
    except (TypeError, ValueError):
        try:
            return bool(ea.equals(eb))
        except Exception:
            return False


def verify_key(candidate: str, expected: str) -> bool:
    """Grade a candidate answer against the expected key."""
    return is_equivalent(candidate, expected)
