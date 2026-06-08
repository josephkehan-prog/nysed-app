import pytest

import transform


def test_valid_transform():
    raw = {
        "stem": "2 + 2 = ?",
        "interactionType": "choice",
        "correctResponse": ["4"],
        "standard": "4.OA.A.1",
        "license": "CC-BY-NC-SA-4.0",
        "attribution": "EngageNY",
    }
    item = transform.oer_to_item(raw)
    assert item["standard"] == "4.OA.A.1"
    assert item["sourceTier"] == "oer"
    assert item["license"] == "CC-BY-NC-SA-4.0"
    assert item["correctResponse"] == ["4"]
    assert item["attribution"] == "EngageNY"


def test_missing_standard_raises():
    with pytest.raises(ValueError):
        transform.oer_to_item({"stem": "x", "license": "X"})


def test_missing_license_raises():
    with pytest.raises(ValueError):
        transform.oer_to_item({"stem": "x", "standard": "4.OA.A.1"})
