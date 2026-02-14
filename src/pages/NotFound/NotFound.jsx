import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiHome, FiGrid } from "react-icons/fi";
import styles from "./NotFound.module.scss";

/* Assets */
import notFoundImg from "../../assets/notfound/notfound.png";

export default function NotFound() {
  return (
    <section className={styles.container}>
      <div className="container">
        <div className={styles.contentWrap}>
          {/* Copy */}
          <motion.div
            className={styles.textSide}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className={styles.label}>Error 404</span>
            <h1 className={styles.title}>
              Waduh, bangun ruangnya{" "}
              <span className={styles.highlight}>hilang?</span>
            </h1>
            <p className={styles.desc}>
              Halaman yang kamu cari sepertinya sudah terhapus atau dimensinya
              berpindah. Yuk, kita balik ke tempat yang pasti-pasti aja.
            </p>

            {/* Actions */}
            <div className={styles.actions}>
              <Link to="/" className={`${styles.btn} ${styles.btnPrimary}`}>
                <FiHome /> Back to Home
              </Link>

              <Link
                to="/shapes"
                className={`${styles.btn} ${styles.btnOutline}`}
              >
                <FiGrid /> Eksplor Shapes
              </Link>
            </div>

            {/* Back */}
            <button
              onClick={() => window.history.back()}
              className={styles.simpleBack}
            >
              <FiArrowLeft /> Kembali ke halaman sebelumnya
            </button>
          </motion.div>

          {/* Visual */}
          <motion.div
            className={styles.visualSide}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src={notFoundImg}
              alt="404 Illustration"
              className={styles.image404}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
