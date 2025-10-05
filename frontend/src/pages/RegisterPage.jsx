import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../css/RegisterPage.css";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="register-page">
    <div className="outer-container">
      <div className="container">
        {/* Header */}
        <header className="header">
          <img
            src="/assets/logo-wbg.png"
            alt="Nightingale Care Logo"
            className="logo"
          />
        </header>

        {/* Main Content */}
        <main className="content">
          <h2 className="roboto-slab-head">
            Welcome to
            <br />
            Nightingale Care.
          </h2>
          <p className="intro-text">
            Working with you to change the future of
            <br />
            Social Care Recruitment.
          </p>
          <p className="pre-text">
            Pre-register to unlock higher earning potential than traditional
            <br />
            recruitment agencies and take more control of your career.
          </p>

          {/* Register Button */}
          <Link to="/candidate/candidate_registration" className="register-btn">
            <div className="main btn-txt">Register now</div>
            <div className="icon">
              <b>
                <i className="fas fa-check"></i>
              </b>
            </div>
          </Link>
        </main>

        {/* Footer */}
        <footer className="footer">
          <ul className="social-links">
            <li>
              <a
                href="https://www.facebook.com/profile.php?id=61560868498998"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
            </li>
            <li>
              <a
                href="https://x.com/NightingaleC_"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-twitter"></i>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/nightingalecareapp"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </li>
            <li>
              <a
                href="https://youtube.com/@nightingalecare?si=K0a0a46CXVoof6px"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </li>
            <li>
              <a
                href="https://www.tiktok.com/@nightingalecare"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-tiktok"></i>
              </a>
            </li>
          </ul>
          <div>
            <a
              href="https://app.nightingale-care.co.uk/DataFolder/Privacy_Policy.pdf"
              id="privacy_policy"
              target="_blank"
              rel="noreferrer"
              download
            >
              Privacy Policy
            </a>
          </div>
        </footer>

        {/* Background Logo */}
        <img
          src="/assets/logo-filled.png"
          height="375px"
          alt="Background"
          className="bg-image"
        />
      </div>
    </div>
    </div>
  );
}
