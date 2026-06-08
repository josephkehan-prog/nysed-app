import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';

/** Freehand scratch / blank paper. Scratch only — not auto-graded. */
export function ScratchPad() {
  return (
    <div style={{ height: 320 }}>
      <Excalidraw />
    </div>
  );
}
