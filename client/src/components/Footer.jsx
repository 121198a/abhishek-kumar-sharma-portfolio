import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="ABHISHEK KUMAR SHARMA">
          ABHISHEK KUMAR SHARMA<span className="footer__dot"></span>
        </div>
        <p className="footer__copy">
          © {year} Abhishek Kumar Sharma. Built with React & Node.js.
        </p>
        <div className="footer__links">
          <a href="https://github.com/121198a" target="_blank" rel="noopener noreferrer" className="footer__link">GitHub</a>
          <a href="https://www.linkedin.com/in/abhishek-kumar-sharma-75306b1ba/" target="_blank" rel="noopener noreferrer" className="footer__link">LinkedIn</a>
          <a href="https://www.instagram.com/_.itsyourabhishek._/?__pwa=1" target="_blank" rel="noopener noreferrer" className="footer__link">Instagram</a>
        </div>
      </div>
    </footer>
  );
}
