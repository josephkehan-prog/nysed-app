import { DatabaseSync } from 'node:sqlite';

// Persistence + analytics for student attempts and dispute flags.
// Uses Node's built-in synchronous SQLite (no native dependency).

export interface AttemptInput {
  studentId: string;
  itemId: string;
  standard: string;
  score: number;
  maxScore: number;
}

export interface StandardMastery {
  standard: string;
  attempts: number;
  earned: number;
  possible: number;
  /** earned / possible in [0, 1]. */
  mastery: number;
}

export interface Store {
  recordAttempt(a: AttemptInput): void;
  masteryByStandard(studentId: string): StandardMastery[];
  flagItem(itemId: string, reason: string, studentId?: string): void;
  flagCount(itemId: string): number;
  close(): void;
}

export function createStore(path = ':memory:'): Store {
  const db = new DatabaseSync(path);
  db.exec(`
    CREATE TABLE IF NOT EXISTS attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      studentId TEXT NOT NULL,
      itemId TEXT NOT NULL,
      standard TEXT NOT NULL,
      score REAL NOT NULL,
      maxScore REAL NOT NULL
    );
    CREATE TABLE IF NOT EXISTS flags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      itemId TEXT NOT NULL,
      studentId TEXT,
      reason TEXT
    );
  `);

  return {
    recordAttempt(a) {
      db.prepare(
        'INSERT INTO attempts (studentId, itemId, standard, score, maxScore) VALUES (?, ?, ?, ?, ?)',
      ).run(a.studentId, a.itemId, a.standard, a.score, a.maxScore);
    },
    masteryByStandard(studentId) {
      const rows = db
        .prepare(
          `SELECT standard,
                  COUNT(*)      AS attempts,
                  SUM(score)    AS earned,
                  SUM(maxScore) AS possible
           FROM attempts
           WHERE studentId = ?
           GROUP BY standard
           ORDER BY standard`,
        )
        .all(studentId) as Array<Record<string, number | string>>;
      return rows.map((r) => {
        const earned = Number(r.earned);
        const possible = Number(r.possible);
        return {
          standard: String(r.standard),
          attempts: Number(r.attempts),
          earned,
          possible,
          mastery: possible > 0 ? earned / possible : 0,
        };
      });
    },
    flagItem(itemId, reason, studentId) {
      db.prepare('INSERT INTO flags (itemId, studentId, reason) VALUES (?, ?, ?)').run(
        itemId,
        studentId ?? null,
        reason,
      );
    },
    flagCount(itemId) {
      const r = db.prepare('SELECT COUNT(*) AS n FROM flags WHERE itemId = ?').get(itemId) as {
        n: number;
      };
      return Number(r.n);
    },
    close() {
      db.close();
    },
  };
}
