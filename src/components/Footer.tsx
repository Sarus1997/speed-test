"use client";
import { useLang } from "contexts/LanguageContext";
import styles from "../scss/Footer.module.scss";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className={styles.footer}>
      <p>
        © {new Date().getFullYear()} Sarus – {t("developer")}
      </p>
    </footer>
  );
}
