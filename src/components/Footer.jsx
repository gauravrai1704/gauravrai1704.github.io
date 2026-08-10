export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="mono">Gaurav Rai © {new Date().getFullYear()}</span>
        <a className="mono" href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
