import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Period Product News - 世界の生理用品情報",
  description:
    "世界各国の生理用品（ナプキン・吸水ショーツ）の最新情報を毎日お届け",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} antialiased bg-gray-50 min-h-screen font-sans`}
      >
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
