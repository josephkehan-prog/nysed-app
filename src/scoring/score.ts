import type { CandidateResponse, ResponseDeclaration, Score } from './types';

function normalizeResponse(response: CandidateResponse): string[] {
  if (response == null) return [];
  return Array.isArray(response) ? response : [response];
}

function scoreMatchCorrect(decl: ResponseDeclaration, values: string[]): Score {
  const maxScore = decl.maxScore ?? 1;
  const { cardinality, correctResponse } = decl;
  let correct: boolean;

  if (cardinality === 'single') {
    correct = values.length === 1 && values[0] === correctResponse[0];
  } else if (cardinality === 'multiple') {
    const responseSet = new Set(values);
    const correctSet = new Set(correctResponse);
    correct =
      responseSet.size === correctSet.size &&
      [...correctSet].every((v) => responseSet.has(v));
  } else if (cardinality === 'ordered') {
    correct =
      values.length === correctResponse.length &&
      values.every((v, i) => v === correctResponse[i]);
  } else {
    throw new Error(`Unknown cardinality: "${cardinality}"`);
  }

  return { score: correct ? maxScore : 0, maxScore };
}

function scoreMapResponse(decl: ResponseDeclaration, values: string[]): Score {
  const mapping = decl.mapping!;
  const defaultValue = mapping.defaultValue ?? 0;
  const distinctValues = [...new Set(values)];

  let total = 0;
  for (const v of distinctValues) {
    const entry = mapping.entries.find((e) => e.key === v);
    total += entry !== undefined ? entry.value : defaultValue;
  }

  if (mapping.lowerBound !== undefined) total = Math.max(total, mapping.lowerBound);
  if (mapping.upperBound !== undefined) total = Math.min(total, mapping.upperBound);

  const positiveSum = mapping.entries.reduce((sum, e) => sum + Math.max(0, e.value), 0);
  const maxScore =
    mapping.upperBound !== undefined
      ? Math.min(positiveSum, mapping.upperBound)
      : positiveSum;

  return { score: total, maxScore };
}

export function scoreItem(decl: ResponseDeclaration, response: CandidateResponse): Score {
  const values = normalizeResponse(response);

  if (decl.mapping) {
    return scoreMapResponse(decl, values);
  }

  return scoreMatchCorrect(decl, values);
}
