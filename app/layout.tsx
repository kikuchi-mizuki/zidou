import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "チョコレート納品計画システム",
  description: "チョコレート卸向け納品計画WEBアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
