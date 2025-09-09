import Footer from "@/components/Footer";
import "./globals.scss";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { LanguageProvider } from "contexts/LanguageContext";

export const metadata: Metadata = {
  title: "Speed Test",
  description: "Next.js (TS) + SCSS – Internet speed test",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <LanguageProvider>
          {" "}
          {/* ✅ ครอบ Provider */}
          <Navbar />
          <div className="container flex-1">{children}</div>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
