"""Map OER source items into standards-tagged QTI-style items with provenance.

Released NYSED items are NOT transformed here — they are blueprint/anti-leakage
only (see leakage.py). This module handles open educational resources.
"""
from __future__ import annotations


def oer_to_item(raw: dict) -> dict:
    """Convert an OER question dict into a QTI-style item with provenance.

    Raises ValueError if the required `standard` or `license` is missing.
    """
    for field in ("standard", "license"):
        if not raw.get(field):
            raise ValueError(f"missing required field: {field}")
    return {
        "stem": raw.get("stem", ""),
        "interactionType": raw.get("interactionType", "choice"),
        "correctResponse": raw.get("correctResponse", []),
        "standard": raw["standard"],
        "sourceTier": "oer",
        "license": raw["license"],
        "attribution": raw.get("attribution", ""),
    }
