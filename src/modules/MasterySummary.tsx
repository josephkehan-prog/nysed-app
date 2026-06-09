import type { StandardMastery } from '../progress/mastery';

/** Mastery-by-standard view: one labelled bar per standard the student has practiced.
 * Empty until auto-scored ('practice') items are attempted — 'explore' tasks don't score. */
export function MasterySummary({ mastery }: { mastery: StandardMastery[] }) {
  if (mastery.length === 0) {
    return (
      <p>
        <small>No scored practice yet — your mastery by standard will appear here.</small>
      </p>
    );
  }
  return (
    <section aria-label="Mastery by standard">
      <h3>Mastery by standard</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {mastery.map((m) => {
          const pct = Math.round(m.mastery * 100);
          return (
            <li key={m.standard} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ minWidth: 90, fontVariantNumeric: 'tabular-nums' }}>{m.standard}</span>
              <span
                aria-hidden
                style={{ display: 'inline-block', width: 140, height: 8, background: '#eee', borderRadius: 4 }}
              >
                <span
                  style={{ display: 'block', width: `${pct}%`, height: '100%', background: '#2e9e6b', borderRadius: 4 }}
                />
              </span>
              <small>{`${pct}% (${m.earned}/${m.possible})`}</small>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
