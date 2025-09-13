"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "../scss/Navbar.module.scss";
import { useLang } from "contexts/LanguageContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, toggleLang } = useLang(); // ✅ ดึง lang และฟังก์ชันเปลี่ยนภาษา

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>SR</div>

      <button
        className={styles.hamburger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <ul className={`${styles.menu} ${isOpen ? styles.show : ""}`}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/game/tic-tac-toe">Game</Link>
        </li>
        <li>
          {/* ✅ ปุ่มเปลี่ยนภาษา */}
          <button className={styles.langBtn} onClick={toggleLang}>
            🌐 {lang === "th" ? "TH" : "EN"}
          </button>
        </li>
      </ul>
    </nav>
  );
}
