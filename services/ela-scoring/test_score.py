import score


def test_scores_are_bounded_and_total_is_sum():
    rubric = {"maxPerTrait": 4, "minWords": 10}
    text = (
        "The author argues that recycling matters. "
        "She gives three reasons and supports each one clearly."
    )
    result = score.score_short_response(text, rubric)
    assert result["content"] == 4
    assert result["organization"] == 4
    assert 0 <= result["conventions"] <= 4
    assert result["total"] == (
        result["content"] + result["organization"] + result["conventions"]
    )


def test_injected_grammar_check_changes_conventions():
    rubric = {"maxPerTrait": 4, "minWords": 5}
    text = "Good writing here always."
    perfect = score.score_short_response(text, rubric, grammar_check=lambda t: 0)
    flawed = score.score_short_response(text, rubric, grammar_check=lambda t: 2)
    assert perfect["conventions"] == 4
    assert flawed["conventions"] == 2


def test_short_response_gets_partial_content():
    rubric = {"maxPerTrait": 4, "minWords": 20}
    result = score.score_short_response("Too short.", rubric, grammar_check=lambda t: 0)
    assert result["content"] < 4
