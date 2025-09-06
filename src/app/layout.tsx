import Footer from "@/components/Footer";
import "./globals.scss";
import type { Metadata } from "next";

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
        <div className="container flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
