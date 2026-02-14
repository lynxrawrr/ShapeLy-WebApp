import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiInfo,
  FiMenu,
  FiX,
  FiArrowRight,
} from "react-icons/fi";
import { motion } from "framer-motion";

import s from "./Navbar.module.scss";
import { useHideOnScrollMotion } from "../../hooks/useHideOnScrollMotion";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const hidden = useHideOnScrollMotion({ threshold: 10, topOffset: 10 });
  const shouldHide = hidden && !open;

  /* Auto-close on route change */
  useEffect(() => {
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <motion.header
        className={s.header}
        initial={false}
        animate={shouldHide ? "hidden" : "show"}
        variants={{
          show: { y: 0, opacity: 1, filter: "blur(0px)" },
          hidden: { y: -72, opacity: 0.98, filter: "blur(2px)" },
        }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <div className={`container ${s.inner}`}>
          {/* Brand */}
          <NavLink to="/" className={s.brand}>
            ShapeLy<span className={s.dot}>.</span>
          </NavLink>

          {/* Desktop nav */}
          <nav className={s.nav}>
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? s.active : s.link)}
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? s.active : s.link)}
            >
              About
            </NavLink>

            <NavLink to="/shapes" className={`${s.ctaLink}`}>
              Mulai Belajar
            </NavLink>
          </nav>

          {/* Mobile toggle */}
          <button
            className={s.menuBtn}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {/* Mobile panel */}
        <div className={`${s.mobilePanel} ${open ? s.open : ""}`}>
          <div className={s.mobileInner}>
            <NavLink to="/" end className={s.mobileLink}>
              <FiHome /> Home
            </NavLink>

            <NavLink to="/about" className={s.mobileLink}>
              <FiInfo /> About
            </NavLink>

            <div className={s.divider} />

            <NavLink to="/shapes" className={`${s.mobileLink} ${s.mobileCta}`}>
              <FiBox /> Mulai Belajar <FiArrowRight />
            </NavLink>
          </div>
        </div>
      </motion.header>

      {/* Backdrop */}
      <div
        className={`${s.overlay} ${open ? s.overlayOpen : ""}`}
        onClick={() => setOpen(false)}
      />
    </>
  );
}