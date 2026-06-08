"""Readability metrics: Flesch Reading Ease and Flesch-Kincaid Grade Level.

Deterministic, dependency-free. Used to level passages and gauge response
complexity without human judgment.
"""
from __future__ import annotations

import re


def _sentence_count(text: str) -> int:
    return max(len(re.findall(r"[.!?]+", text)), 1)


def _words(text: str) -> list[str]:
    return re.findall(r"[A-Za-z]+", text)


def _count_syllables(word: str) -> int:
    word = word.lower()
    vowels = "aeiouy"
    count = 0
    prev_vowel = False
    for ch in word:
        is_vowel = ch in vowels
        if is_vowel and not prev_vowel:
            count += 1
        prev_vowel = is_vowel
    if word.endswith("e") and count > 1:
        count -= 1
    return max(count, 1)


def _stats(text: str) -> tuple[int, int, int]:
    words = _words(text)
    num_words = max(len(words), 1)
    num_sentences = _sentence_count(text)
    num_syllables = sum(_count_syllables(w) for w in words)
    return num_words, num_sentences, num_syllables


def flesch_reading_ease(text: str) -> float:
    w, s, syl = _stats(text)
    return 206.835 - 1.015 * (w / s) - 84.6 * (syl / w)


def estimate_grade_level(text: str) -> float:
    w, s, syl = _stats(text)
    return 0.39 * (w / s) + 11.8 * (syl / w) - 15.59
