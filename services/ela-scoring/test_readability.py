import readability


def test_simple_text_easier_than_complex():
    simple = "The cat sat on the mat. The dog ran fast."
    complex_ = (
        "Photosynthesis is a complex biochemical process whereby "
        "chloroplasts synthesize carbohydrates."
    )
    assert readability.flesch_reading_ease(simple) > readability.flesch_reading_ease(
        complex_
    )


def test_grade_level_increases_with_complexity():
    simple = "I see a big red ball. We can play."
    complex_ = (
        "The aforementioned constitutional jurisprudence necessitates "
        "comprehensive interpretation."
    )
    assert readability.estimate_grade_level(complex_) > readability.estimate_grade_level(
        simple
    )
