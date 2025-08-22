// frontend/src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-center">
        <span>© {new Date().getFullYear()} Device Manager</span>
        <span>•</span>
        <a href="mailto:sineoyku@gmail.com">sineoyku@gmail.com</a>
        <span>•</span>
        <a
          href="https://github.com/sineoyku"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/sineoyku
        </a>
      </div>
    </footer>
  );
}
