import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiLayers,
  FiMousePointer,
  FiBox,
  FiTarget,
  FiCheckCircle,
  FiGlobe,
  FiGithub,
} from "react-icons/fi";
import styles from "./About.module.scss";

/* Motion variants */
const containerVars = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

const itemVars = {
  initial: { opacity: 0, y: 16, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function About() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <section className={`container ${styles.header}`}>
        <motion.div
          variants={containerVars}
          initial="initial"
          animate="animate"
          className={styles.headerInner}
        >
          <motion.div variants={itemVars} className={styles.badge}>
            Tentang ShapeLy
          </motion.div>

          <motion.h1 variants={itemVars} className={styles.title}>
            Media belajar bangun ruang yang lebih{" "}
            <span className={styles.highlight}>visual</span> dan{" "}
            <span className={styles.highlight}>interaktif</span>.
          </motion.h1>

          <motion.p variants={itemVars} className={styles.subtitle}>
            ShapeLy adalah media pembelajaran 3D berbasis web yang membantu siswa
            memahami konsep bangun ruang melalui eksplorasi. Kamu bisa memutar dan
            memperbesar objek, membuka jaring jaring, serta melihat rumus lengkap
            dengan contoh perhitungan.
          </motion.p>

          <motion.div variants={itemVars} className={styles.headerActions}>
            <Link to="/shapes" className="btn btnPrimary">
              Coba sekarang <FiArrowRight />
            </Link>
            <Link to="/" className="btn btnGhost">
              Kembali ke Home
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Latar belakang */}
      <section className={`container ${styles.section}`}>
        <SectionTitle
          title="Latar Belakang"
          desc="Belajar bangun ruang sering terasa abstrak karena keterbatasan visual dua dimensi."
        />

        <div className={styles.grid2}>
          <motion.div
            variants={itemVars}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className={`panel ${styles.card}`}
          >
            <h3 className={styles.cardTitle}>Masalah utama</h3>
            <p className={styles.cardText}>
              Banyak siswa kesulitan membayangkan bangun ruang hanya dari gambar
              dua dimensi. Akibatnya, konsep seperti luas permukaan dan volume
              dipahami sebagai hafalan, bukan hasil penalaran.
            </p>
          </motion.div>

          <motion.div
            variants={itemVars}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className={`panel ${styles.card}`}
          >
            <h3 className={styles.cardTitle}>Yang dibutuhkan</h3>
            <p className={styles.cardText}>
              Media pembelajaran yang mudah diakses dan interaktif, serta membantu
              menghubungkan bentuk, jaring jaring, dan rumus melalui visualisasi
              yang jelas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tujuan */}
      <section className={`container ${styles.section}`}>
        <SectionTitle
          title="Tujuan"
          desc="ShapeLy dirancang untuk membantu proses belajar yang lebih masuk akal dan menyenangkan."
        />

        <div className={`panel ${styles.bullets}`}>
          <Bullet text="Mempermudah pemahaman konsep bangun ruang melalui visualisasi 3D interaktif." />
          <Bullet text="Mendukung pembelajaran eksploratif melalui aktivitas mengamati, memutar, dan mencoba." />
          <Bullet text="Menyediakan media berbasis web yang mudah diakses di berbagai perangkat." />
          <Bullet text="Membantu guru dan siswa sebagai alat bantu visual saat pembelajaran di kelas maupun mandiri." />
          <Bullet text="Meningkatkan minat belajar melalui interaksi dan animasi jaring jaring." />
        </div>
      </section>

      {/* Solusi */}
      <section className={`container ${styles.section}`}>
        <SectionTitle
          title="Solusi"
          desc="Pendekatan sederhana yang terstruktur. Amati bentuknya, pahami jaring jaringnya, lalu hubungkan ke rumus."
        />

        <div className={styles.solutionGrid}>
          <SolutionStep
            n="01"
            icon={<FiMousePointer />}
            title="Visualisasi 3D konkret"
            desc="Putar dan zoom untuk mengamati sisi, rusuk, dan sudut dari berbagai arah."
          />
          <SolutionStep
            n="02"
            icon={<FiLayers />}
            title="Jaring jaring interaktif"
            desc="Buka dan tutup jaring jaring secara halus agar hubungan bentuk dan luas permukaan lebih mudah dipahami."
          />
          <SolutionStep
            n="03"
            icon={<FiBox />}
            title="Rumus dan contoh perhitungan"
            desc="Rumus inti ditampilkan sesuai bangun yang dipilih, lengkap dengan contoh angka untuk latihan."
          />
        </div>
      </section>

      {/* Fitur */}
      <section className={`container ${styles.section}`}>
        <SectionTitle
          title="Fitur"
          desc="Fitur inti yang fokus untuk menunjang pemahaman konsep, bukan sekadar tampilan."
        />

        <div className={styles.features}>
          <FeatureCard
            icon={<FiMousePointer />}
            title="Visualisasi 3D berbasis Three.js"
            desc="Model 3D dapat diputar dan di zoom untuk membantu memahami struktur bangun ruang secara lebih jelas."
          />
          <FeatureCard
            icon={<FiTarget />}
            title="Label informasi"
            desc="Penanda pada titik, garis, dan sisi membantu mengarahkan perhatian ke unsur yang sedang dipelajari."
          />
          <FeatureCard
            icon={<FiLayers />}
            title="Animasi unfold dan fold"
            desc="Transisi halus saat membuka dan menutup jaring jaring memperjelas keterkaitan bentuk, jaring jaring, dan luas permukaan."
          />
        </div>
      </section>

      {/* Versi sebelumnya */}
      <section className={`container ${styles.section}`}>
        <SectionTitle
          title="Versi Sebelumnya"
          desc="Halaman ini menampilkan prototipe awal yang menjadi dasar pengembangan ShapeLy. Fokusnya pada validasi konsep visualisasi 3D, interaksi dasar, dan eksperimen jaring jaring."
        />

        <div className={`panel ${styles.legacyCard}`}>
          <div className={styles.legacyText}>
            <h3 className={styles.legacyTitle}>Geo3D Prototipe Awal</h3>
            <p className={styles.legacyDesc}>
              Versi awal untuk uji konsep. Berisi viewer 3D, kontrol interaksi,
              serta percobaan animasi jaring jaring. Prototipe ini awalnya dibuat
              sebagai tugas mata kuliah Komputer Grafis, lalu disempurnakan dan
              dikembangkan menjadi ShapeLy.
            </p>
          </div>

          {/* Legacy links */}
          <div className={styles.legacyActions}>
            <a
              className="btn btnOutline"
              href="https://lynxrawrr.github.io/Geo3D/cone.html"
              target="_blank"
              rel="noreferrer"
            >
              <FiGlobe /> Buka Website
            </a>

            <a
              className="btn btnGhost"
              href="https://github.com/lynxrawrr/Geo3D.git"
              target="_blank"
              rel="noreferrer"
            >
              <FiGithub /> Lihat Repo
            </a>
          </div>
        </div>
      </section>

      {/* Kesimpulan */}
      <section className={`container ${styles.section}`}>
        <SectionTitle
          title="Kesimpulan"
          desc="ShapeLy membantu pembelajaran bangun ruang menjadi lebih visual, interaktif, dan mudah diakses melalui web."
        />

        <div className={styles.pills}>
          <Pill text="Memperkuat pemahaman konsep" />
          <Pill text="Interaktif dan menarik" />
          <Pill text="Mudah diakses melalui web" />
          <Pill text="Rumus dan contoh integrasi" />
          <Pill text="Mendukung pembelajaran modern" />
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
          <h2 className={styles.ctaTitle}>Coba ShapeLy sekarang</h2>
          <p className={styles.ctaDesc}>
            Pilih bangun ruang, buka jaring jaring, lalu pahami rumusnya lewat
            contoh perhitungan.
          </p>

          <div className={styles.ctaActions}>
            <Link
              to="/shapes"
              className="btn btnPrimary"
              onClick={() => window.scrollTo(0, 0)}
            >
              Mulai Belajar <FiArrowRight />
            </Link>
            <span className={styles.ctaHint}>
              Gratis dan langsung bisa dipakai di browser
            </span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

/* Shared components */
function SectionTitle({ title, desc }) {
  return (
    <div className={`${styles.sectionTitle} sectionTitle`}>
      <h2>{title}</h2>
      <p>{desc}</p>
    </div>
  );
}

function Bullet({ text }) {
  return (
    <div className={styles.bullet}>
      <FiCheckCircle className={styles.bulletIcon} />
      <span>{text}</span>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      className={`panel ${styles.featureCard}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
    >
      <div className={styles.featureIcon} aria-hidden="true">
        {icon}
      </div>
      <div>
        <div className={styles.featureTitle}>{title}</div>
        <div className={styles.featureDesc}>{desc}</div>
      </div>
    </motion.div>
  );
}

function SolutionStep({ n, icon, title, desc }) {
  return (
    <motion.div
      className={`panel ${styles.solutionCard}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
    >
      <div className={styles.solutionTop}>
        <div className={styles.solutionNo}>{n}</div>
        <div className={styles.solutionIcon} aria-hidden="true">
          {icon}
        </div>
      </div>
      <div className={styles.solutionTitle}>{title}</div>
      <div className={styles.solutionDesc}>{desc}</div>
    </motion.div>
  );
}

function Pill({ text }) {
  return (
    <div className={styles.pill}>
      <FiCheckCircle className={styles.pillIcon} />
      <span>{text}</span>
    </div>
  );
}