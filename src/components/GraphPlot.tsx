import { Mafs, Coordinates, Plot } from 'mafs';
import 'mafs/core.css';

/** Interactive coordinate plane for graphing/plot items. */
export function GraphPlot() {
  return (
    <Mafs height={240}>
      <Coordinates.Cartesian />
      <Plot.OfX y={(x) => x * x} />
    </Mafs>
  );
}
