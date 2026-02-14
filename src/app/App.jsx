import { Outlet, useLocation, matchPath } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

/* Motion variants */
const pageVariants = {
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(6px)" },
};

export default function App() {
  const location = useLocation();

  /* Route flags */
  const isViewer = !!matchPath({ path: "/shape/:key" }, location.pathname);

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Page transition */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.28, ease: "easeOut" }}
          style={{ minHeight: "calc(100vh - var(--nav-height))" }}
        >
          {/* Page content */}
          <Outlet />

          {/* Footer */}
          {!isViewer && <Footer />}
        </motion.main>
      </AnimatePresence>
    </>
  );
}
