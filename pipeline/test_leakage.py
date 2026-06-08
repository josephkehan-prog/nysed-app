import leakage


def test_identical_text_is_full_similarity_and_leak():
    text = "A train leaves the station at noon"
    assert leakage.similarity(text, text) == 1.0
    assert leakage.is_leak(text, [text]) is True


def test_unrelated_text_is_low_similarity_and_not_leak():
    a = "A train leaves the station at noon"
    b = "Photosynthesis occurs in green plants"
    assert leakage.similarity(a, b) < 0.3
    assert leakage.is_leak(a, [b]) is False


def test_near_duplicate_flagged():
    corpus = ["the quick brown fox jumps over the lazy dog"]
    candidate = "the quick brown fox jumps over the lazy dog today"
    assert leakage.is_leak(candidate, corpus, threshold=0.8) is True
