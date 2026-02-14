import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiPlay,
  FiXCircle,
  FiInfo,
  FiRefreshCw,
  FiPlus,
  FiMinus,
  FiCornerUpLeft,
} from "react-icons/fi";
import s from "./ShapeViewerPage.module.scss";
import { getShapeNav } from "../../app/shapes.config";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

/* Motion + 3D viewer shell */
export default function ShapeViewerPage({
  shapeKey,
  title,
  initFn,
  formulaTitle = "Rumus",
  formulas = [],
  defaultExample = { lines: [] },
}) {
  const isDesktop = useIsDesktop(1100);
  useBodyScrollLock(isDesktop);

  const mountRef = useRef(null);
  const apiRef = useRef(null);

  const [example, setExample] = useState(defaultExample);

  useEffect(() => {
    if (!mountRef.current) return;

    apiRef.current = initFn({
      mountEl: mountRef.current,
      onExampleChange: setExample,
    });

    return () => apiRef.current?.destroy?.();
  }, [initFn]);

  const api = apiRef.current;
  const { prev, next } = getShapeNav(shapeKey);

  return (
    <div className={s.page}>
      <div className={s.layout}>
        {/* Controls */}
        <aside className={s.sidebarLeft}>
          <div className={s.sidebarHeader}>
            <h2 className={s.panelTitle}>Kendali</h2>
          </div>

          <div className={s.sidebarContent}>
            {/* Unfold / fold */}
            <div className={s.controlGroup}>
              <button className={s.btnPrimary} onClick={() => api?.unfold?.()}>
                <FiPlay size={18} /> Buka Jaring
              </button>

              <button className={s.btnOutline} onClick={() => api?.fold?.()}>
                <FiXCircle size={18} /> Tutup Jaring
              </button>
            </div>

            <div className={s.divider} />

            {/* View */}
            <div className={s.controlGroup}>
              <button
                className={s.btnGhost}
                onClick={() => api?.toggleInfo?.()}
              >
                <FiInfo size={18} /> Toggle Info
              </button>

              <button className={s.btnGhost} onClick={() => api?.resetView?.()}>
                <FiRefreshCw size={18} /> Reset Kamera
              </button>
            </div>

            <div className={s.divider} />

            {/* Tuning */}
            <div className={s.tuningGrid}>
              <div className={s.tuningBlock}>
                <span className={s.tuningLabel}>Zoom</span>
                <div className={s.tuningActions}>
                  <button className={s.btnIcon} onClick={() => api?.zoomIn?.()}>
                    <FiPlus />
                  </button>
                  <button
                    className={s.btnIcon}
                    onClick={() => api?.zoomOut?.()}
                  >
                    <FiMinus />
                  </button>
                </div>
              </div>

              <div className={s.tuningBlock}>
                <span className={s.tuningLabel}>Size</span>
                <div className={s.tuningActions}>
                  <button
                    className={s.btnIcon}
                    onClick={() => api?.addSize?.()}
                  >
                    <FiPlus />
                  </button>
                  <button
                    className={s.btnIcon}
                    onClick={() => api?.reduceSize?.()}
                  >
                    <FiMinus />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Back */}
          <div className={s.sidebarFooter}>
            <Link to="/shapes" className={s.btnOutline}>
              <FiCornerUpLeft size={18} /> Kembali ke Menu
            </Link>
          </div>
        </aside>

        {/* Canvas */}
        <main className={s.stageArea}>
          {/* Nav */}
          <header className={s.stageHeader}>
            <Link
              to={prev ?? "/shapes"}
              className={s.navArrow}
              aria-label="Previous Shape"
            >
              <FiChevronLeft size={24} />
            </Link>

            <h1 className={s.shapeTitle}>{title}</h1>

            <Link
              to={next ?? "/shapes"}
              className={s.navArrow}
              aria-label="Next Shape"
            >
              <FiChevronRight size={24} />
            </Link>
          </header>

          {/* Mount */}
          <div className={s.canvasContainer}>
            <div className={s.canvasWindow}>
              <div ref={mountRef} className={s.canvasMount} />
              <div className={s.canvasHint}>Klik & Drag untuk memutar</div>
            </div>
          </div>
        </main>

        {/* Info */}
        <aside className={s.sidebarRight}>
          {/* Formulas */}
          <div className={s.infoBlock}>
            <h2 className={s.panelTitle}>{formulaTitle}</h2>
            <div className={s.formulaList}>
              {formulas.map((f, idx) => (
                <div key={idx} className={s.formulaItem}>
                  <span className={s.formulaLabel}>{f.label}</span>
                  <span className={s.formulaValue}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={s.divider} />

          {/* Example */}
          <div className={s.infoBlock}>
            <h2 className={s.panelTitle}>Simulasi Hitungan</h2>
            <div className={s.calcBox}>
              {example?.lines?.map((line, idx) => (
                <div key={idx} className={s.calcLine}>
                  {line}
                </div>
              ))}
              {(!example?.lines || example.lines.length === 0) && (
                <span className={s.emptyState}>
                  Masukkan angka di canvas...
                </span>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}