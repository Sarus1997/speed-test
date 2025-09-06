import styles from "../scss/Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} Sarus – ผู้พัฒนา</p>
    </footer>
  );
}
