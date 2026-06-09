// Client-first progress persistence. Attempts and module visits live in localStorage
// (no backend by design); mastery is computed on read via the shared pure aggregator.
import { aggregateMastery, type Attempt, type StandardMastery } from './mastery';

/** The slice of the Web Storage API we use; injectable so tests run without jsdom. */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface ProgressStore {
  recordAttempt(a: Attempt): void;
  /** Mark an (explore) module as worked on, even though it isn't auto-scored. */
  markVisited(studentId: string, moduleId: string): void;
  masteryByStandard(studentId: string): StandardMastery[];
  /** Module ids the student has attempted or visited — for catalog "worked on" badges. */
  engagedModuleIds(studentId: string): Set<string>;
}

const KEY = 'nysed:progress:v1';

interface Visit {
  studentId: string;
  moduleId: string;
}
interface Persisted {
  attempts: Attempt[];
  visits: Visit[];
}

/** In-memory fallback so the default store never throws when localStorage is absent. */
function memoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
  };
}

export function createLocalProgressStore(
  storage: StorageLike = typeof globalThis.localStorage !== 'undefined'
    ? globalThis.localStorage
    : memoryStorage(),
): ProgressStore {
  function read(): Persisted {
    const raw = storage.getItem(KEY);
    if (!raw) return { attempts: [], visits: [] };
    try {
      const parsed = JSON.parse(raw) as Partial<Persisted>;
      return { attempts: parsed.attempts ?? [], visits: parsed.visits ?? [] };
    } catch {
      return { attempts: [], visits: [] }; // corrupt → start clean rather than crash
    }
  }

  function write(state: Persisted): void {
    storage.setItem(KEY, JSON.stringify(state));
  }

  return {
    recordAttempt(a) {
      const state = read();
      state.attempts.push(a);
      write(state);
    },
    markVisited(studentId, moduleId) {
      const state = read();
      if (!state.visits.some((v) => v.studentId === studentId && v.moduleId === moduleId)) {
        state.visits.push({ studentId, moduleId });
        write(state);
      }
    },
    masteryByStandard(studentId) {
      return aggregateMastery(read().attempts.filter((a) => a.studentId === studentId));
    },
    engagedModuleIds(studentId) {
      const { attempts, visits } = read();
      const ids = new Set<string>();
      for (const a of attempts) if (a.studentId === studentId) ids.add(a.moduleId);
      for (const v of visits) if (v.studentId === studentId) ids.add(v.moduleId);
      return ids;
    },
  };
}

export type { Attempt, StandardMastery } from './mastery';
