import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiBox } from "react-icons/fi";
import s from "./Shapes.module.scss";
import { SHAPES } from "../../app/shapes.config";

/* Motion variants */
const container = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const item = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Shapes() {
  return (
    <div className={s.page}>
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={s.head}
        >
          <span className={s.label}>Shapely</span>
          <h1 className={s.title}>Eksplorasi Bentuk</h1>
          <p className={s.desc}>
            Kumpulan bangun ruang untuk memahami sifat, unsur, jaring jaring,
            serta hubungan rumus luas permukaan dan volume.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="initial"
          animate="animate"
          className={s.grid}
        >
          {SHAPES.map((x) => {
            const Icon = x.icon ?? FiBox;
            const definition = x.desc ?? "Definisi belum tersedia.";

            return (
              <motion.div key={x.key} variants={item} className={s.cardWrapper}>
                <Link to={`/shape/${x.key}`} className={s.card}>
                  <div className={s.cardTop}>
                    <div className={s.iconWrap}>
                      <Icon size={24} />
                    </div>
                    <span className={s.badge}>{x.key}</span>
                  </div>

                  <div className={s.content}>
                    <h3 className={s.cardTitle}>{x.title}</h3>
                    <p className={s.cardDef}>{definition}</p>
                  </div>

                  <div className={s.cardFooter}>
                    <span className={s.btnText}>Pelajari Bentuk</span>
                    <div className={s.btnIcon}>
                      <FiArrowRight size={18} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}