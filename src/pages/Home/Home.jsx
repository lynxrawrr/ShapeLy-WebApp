import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiPlayCircle,
  FiBox,
  FiMousePointer,
  FiLayers,
} from "react-icons/fi";
import styles from "./Home.module.scss";

import heroImg from "../../assets/home/hero.webp";
import { SHAPES } from "../../app/shapes.config";

/* Motion presets */
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Background */}
      <div className={styles.ambientBackground}>
        <div className={styles.gridPattern}></div>
        <div className={styles.glowSpot}></div>
      </div>

      {/* Hero */}
      <section className={`container ${styles.hero}`}>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className={styles.heroLeft}
        >
          <motion.h1 variants={fadeUp} className={styles.title}>
            Bikin <span className={styles.highlight}>bangun ruang</span> <br />
            jadi lebih nyata.
          </motion.h1>

          <motion.p variants={fadeUp} className={styles.subtitle}>
            Visualisasi 3D interaktif untuk memahami berbagai rumus bangun
            ruang. Putar, zoom, dan buka jaring jaring supaya konsepnya langsung
            kebayang.
          </motion.p>

          <motion.div variants={fadeUp} className={styles.heroActions}>
            <Link to="/shapes" className="btn btnPrimary">
              Mulai Eksplorasi <FiArrowRight />
            </Link>

            <a href="#cara-pakai" className="btn btnGhost">
              Tutorial <FiPlayCircle />
            </a>
          </motion.div>

          {/* Meta */}
          <motion.div variants={fadeUp} className={styles.heroMeta}>
            <MetaCard
              icon={<FiMousePointer />}
              title="Interaktif"
              desc="Putar dan zoom 360°"
            />
            <MetaCard
              icon={<FiLayers />}
              title="Jaring - Jaring"
              desc="Animasi buka dan tutup"
            />
            <MetaCard
              icon={<FiBox />}
              title="Kalkulasi"
              desc="Rumus dan contoh hitungan"
            />
          </motion.div>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className={styles.heroRight}
        >
          <div className={styles.heroPreview}>
            <div className={styles.blob}></div>
            <img
              src={heroImg}
              alt="Solidify Dashboard Preview"
              className={styles.heroImg}
              loading="eager"
            />
          </div>
        </motion.div>
      </section>

      {/* Why */}
      <section className={`container ${styles.section}`}>
        <SectionTitle
          title="Kenapa ShapeLy?"
          desc="Belajar geometri dari gambar 2D sering bikin bingung. ShapeLy bantu kamu melihat konsepnya jadi nyata lewat visual 3D interaktif."
        />

        <div className={styles.problemGrid}>
          <ProblemItem
            title="Dari abstrak jadi konkret"
            desc="Ubah gambar di buku jadi objek 3D yang bisa kamu putar dan amati dari semua sisi."
          />
          <ProblemItem
            title="Dari hapal jadi paham"
            desc="Pahami asal rumus lewat jaring jaring dan bentuknya, bukan sekadar menghafal."
          />
          <ProblemItem
            title="Dari pasif jadi aktif"
            desc="Eksplorasi mandiri membuat kamu lebih cepat mengerti dan lebih lama ingat."
          />
        </div>
      </section>

      {/* Features */}
      <section className={`container ${styles.section}`}>
        <SectionTitle
          title="Fitur Belajar"
          desc="Belajar bangun ruang jadi lebih kebayang karena kamu bisa eksplor bentuknya secara langsung."
        />

        <div className={styles.features}>
          <FeatureCard
            icon={<FiMousePointer />}
            title="Kendali Penuh"
            desc="Putar dan zoom bangun ruang dengan mouse atau sentuhan, lalu lihat dari berbagai sisi."
          />
          <FeatureCard
            icon={<FiLayers />}
            title="Animasi Jaring-jaring"
            desc="Lihat bagaimana bangun ruang terbuka menjadi jaring jaring, supaya kamu paham strukturnya."
          />
          <FeatureCard
            icon={<FiBox />}
            title="Panel Rumus Pintar"
            desc="Rumus otomatis mengikuti bangun yang kamu pilih, lengkap dengan contoh angka."
          />
        </div>
      </section>

      {/* How to */}
      <section id="cara-pakai" className={`container ${styles.section}`}>
        <SectionTitle
          title="Cara Menggunakan"
          desc="Mulai belajar dalam hitungan detik, tinggal ikuti alurnya."
        />

        <div className={styles.steps}>
          <Step
            n="01"
            title="Pilih Bangun"
            desc="Temukan bangun ruang yang ingin kamu pelajari."
          />
          <Step
            n="02"
            title="Eksplorasi"
            desc="Putar dan zoom untuk melihat sisi, sudut, dan detail bentuk."
          />
          <Step
            n="03"
            title="Buka Jaring jaring"
            desc="Gunakan kontrol untuk membuka bentuk menjadi jaring jaring."
          />
          <Step
            n="04"
            title="Hitung dan Coba"
            desc="Masukkan angka untuk melihat hasil luas dan volume secara langsung.."
          />
        </div>
      </section>

      {/* Shapes */}
      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHeadRow}>
          <SectionTitle
            title="Jelajahi Bangun Ruang"
            desc="Pilih bangun, putar 3D, buka jaring jaring."
          />
          <Link
            to="/shapes"
            className={`btn btnGhost ${styles.seeAll}`}
            onClick={() => window.scrollTo(0, 0)}
          >
            Lihat Semua <FiArrowRight />
          </Link>
        </div>

        <div className={styles.shapesGrid}>
          {SHAPES.slice(0, 5).map((s) => (
            <ShapeCard key={s.key} shape={s} to={`/shape/${s.key}`} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={`container ${styles.section} ${styles.cta}`}>
        <motion.div
          className={styles.ctaCard}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <h2 className={styles.ctaTitle}>
            Geometri jadi lebih gampang kalau bisa kamu lihat.
          </h2>
          <p className={styles.ctaDesc}>
            Coba ShapeLy sekarang. Gratis, langsung di browser, tanpa instalasi.
          </p>

          <div className={styles.ctaActions}>
            <Link
              to="/shapes"
              className="btn btnPrimary"
              onClick={() => window.scrollTo(0, 0)}
            >
              Mulai Eksplorasi <FiArrowRight />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

/* Components */
function MetaCard({ icon, title, desc }) {
  return (
    <div className={styles.metaCard}>
      <div className={styles.metaIcon} aria-hidden="true">
        {icon}
      </div>
      <div>
        <div className={styles.metaTitle}>{title}</div>
        <div className={styles.metaDesc}>{desc}</div>
      </div>
    </div>
  );
}

function SectionTitle({ title, desc }) {
  return (
    <div className={styles.sectionTitle}>
      <h2>{title}</h2>
      {desc && <p>{desc}</p>}
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      className={styles.featureCard}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className={styles.featureIcon}>{icon}</div>
      <div className={styles.featureBody}>
        <div className={styles.featureTitle}>{title}</div>
        <div className={styles.featureDesc}>{desc}</div>
      </div>
    </motion.div>
  );
}

function ProblemItem({ title, desc }) {
  return (
    <div className={styles.problemItem}>
      <div className={styles.problemTitle}>{title}</div>
      <div className={styles.problemDesc}>{desc}</div>
    </div>
  );
}

function Step({ n, title, desc }) {
  return (
    <div className={styles.step}>
      <div className={styles.stepNo}>{n}</div>
      <div>
        <div className={styles.stepTitle}>{title}</div>
        <div className={styles.stepDesc}>{desc}</div>
      </div>
    </div>
  );
}

function ShapeCard({ shape, to }) {
  const tags = ["Rumus", "3D", "Jaring"];
  return (
    <Link to={to} className={styles.shapeCard}>
      <div className={styles.shapeTop}>
        <div className={styles.shapeTitle}>{shape.title}</div>
        <div className={styles.shapeKey}>{shape.key}</div>
      </div>
      <div className={styles.shapeDesc}>{shape.desc}</div>
      <div className={styles.tags}>
        {tags.map((t) => (
          <span key={t} className={styles.tag}>
            {t}
          </span>
        ))}
      </div>
      <div className={styles.shapeCta}>
        Mulai Belajar <FiArrowRight />
      </div>
    </Link>
  );
}
