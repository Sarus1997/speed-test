"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "th" | "en";

interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
}

const translations: Record<Lang, Record<string, string>> = {
  th: {
    title: "ทดสอบความเร็วอินเตอร์เน็ต",
    subtitle1:
      "วัดการดาวน์โหลด การอัปโหลด ความหน่วง และความสั่นไหวโดยตรงจากเซิร์ฟเวอร์ของคุณ",
    subtitle2:
      "หมายเหตุ: การทดสอบความเร็วอินเตอร์เน็ต จะทดสอบผ่าน Server ของ Vercel ทั้งสิ้น",
    download: "ดาวน์โหลด",
    upload: "อัปโหลด",
    latency: "เวลาในการตอบสนอง",
    jitter: "ความสั่นไหว",
    start: "เริ่มทดสอบ",
    reset: "รีเซ็ต",
    ready: "พร้อม",
    measuring: "กำลังวัด Latency...",
    testingDownload: "กำลังทดสอบความเร็วดาวน์โหลด...",
    testingUpload: "กำลังทดสอบความเร็วอัปโหลด...",
    done: "เสร็จสิ้น",
    summaryFast:
      "การเชื่อมต่ออินเทอร์เน็ตเร็วมาก สามารถสตรีมวิดีโอ 4K ประชุมทางวิดีโอ และเล่นเกมได้พร้อมกันหลายเครื่อง",
    summaryGood:
      "การเชื่อมต่ออินเทอร์เน็ตอยู่ในระดับดี สามารถดูวิดีโอ HD และใช้งานหลายอุปกรณ์พร้อมกันได้",
    summarySlow:
      "การเชื่อมต่ออินเทอร์เน็ตค่อนข้างช้า อาจกระตุกเมื่อดูวิดีโอหรือเล่นเกมออนไลน์",
    server: "เซิร์ฟเวอร์: Queenstown Estate",
  },
  en: {
    title: "Internet Speed Test",
    subtitle1:
      "Measure download, upload, latency and jitter directly from your server",
    subtitle2: "Note: The speed test runs entirely through Vercel's server",
    download: "Download",
    upload: "Upload",
    latency: "Latency",
    jitter: "Jitter",
    start: "Start test",
    reset: "Reset",
    ready: "Ready",
    measuring: "Measuring latency...",
    testingDownload: "Testing download speed...",
    testingUpload: "Testing upload speed...",
    done: "Done",
    summaryFast:
      "Your internet connection is very fast. You can stream 4K videos, join video calls, and play games on multiple devices simultaneously.",
    summaryGood:
      "Your internet connection is good. You can watch HD videos and use multiple devices at the same time.",
    summarySlow:
      "Your internet connection is quite slow. You may experience lag when streaming or gaming online.",
    server: "Server: Queenstown Estate",
  },
};

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("th");

  const toggleLang = () => setLang(lang === "th" ? "en" : "th");
  const t = (key: string) => translations[lang][key] || key;

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LangContext);
  if (!context) throw new Error("useLang must be used within LanguageProvider");
  return context;
}
