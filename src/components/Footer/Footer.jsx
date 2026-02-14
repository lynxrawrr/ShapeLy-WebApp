import { Link } from "react-router-dom";
import s from "./Footer.module.scss";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={s.footer}>
      <div className={`container ${s.inner}`}>
        {/* Brand */}
        <div className={s.brandCol}>
          <div className={s.logo}>
            ShapeLy<span>.</span>
          </div>

          <p className={s.tagline}>
            ShapeLy membantu kamu memahami bangun ruang lewat visualisasi 3D
            interaktif, jaring jaring, dan rumus yang mudah diikuti.
          </p>

          <div className={s.copy}>
            Copyright &copy; {currentYear} ShapeLy. All rights reserved.
          </div>
        </div>

        {/* Links */}
        <div className={s.linksCol}>
          {/* Menu */}
          <div className={s.group}>
            <h4>Menu</h4>
            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
              Home
            </Link>
            <Link to="/shapes" onClick={() => window.scrollTo(0, 0)}>
              Shapes
            </Link>
            <Link to="/about" onClick={() => window.scrollTo(0, 0)}>
              About
            </Link>
          </div>

          {/* Socials */}
          <div className={s.group}>
            <h4>Socials</h4>
            <a
              href="https://www.instagram.com/bram.pmbd/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://github.com/lynxrawrr"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a href="https://x.com/lynxrawr" target="_blank" rel="noreferrer">
              X
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
