import 'mathlive';
import { useEffect, useRef } from 'react';

/** Equation entry via MathLive's <math-field> web component (emits LaTeX/MathJSON). */
export function MathField() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current && !ref.current.firstChild) {
      ref.current.appendChild(document.createElement('math-field'));
    }
  }, []);
  return <div ref={ref} />;
}
