import { useParams, Navigate } from "react-router-dom";
import ShapeViewerPage from "./ShapeViewerPage";
import { getShapeConfig } from "../../app/shapes.config";

export default function ShapeViewerRoute() {
  const { key } = useParams();
  const cfg = getShapeConfig(key);

  /* Guard */
  if (!cfg) return <Navigate to="/shapes" replace />;
  if (!cfg.initFn) return <Navigate to="/shapes" replace />;

  return (
    <ShapeViewerPage
      shapeKey={cfg.key}
      title={cfg.title}
      initFn={cfg.initFn}
      formulaTitle={`Rumus ${cfg.title}`}
      formulas={cfg.formulas ?? []}
      defaultExample={cfg.defaultExample ?? { lines: [] }}
    />
  );
}
