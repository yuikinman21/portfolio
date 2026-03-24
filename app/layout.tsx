import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://portfolio-yuikinman21.vercel.app'), 
  title: "YUIKI - Portfolio",
  description: "Engineering logic, crafting future. IoTやWeb開発のプロジェクトをまとめたポートフォリオサイト",
  keywords: ["ポートフォリオ", "エンジニア", "情報工学", "IoT", "スマートホーム", "Yuikinman21", "YUIKI", "Web開発", "プロジェクト"],
  authors: [{ name: "YUIKI MAKINO" }],
  icons: {
    icon: '/サーキュラー8bit.png',
    apple: '/サーキュラー8bit.jpg',
  },
  openGraph: {
    title: "YUIKI - Portfolio",
    description: "Engineering logic, crafting future. IoTやWeb開発のプロジェクトをまとめたポートフォリオサイト",
    url: '/',
    siteName: 'YUIKI Portfolio',
    images: [
      {
        url: '/サーキュラー8bit.jpg',
        width: 800,
        height: 600,
        alt: 'YUIKI Portfolio Profile Image',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "YUIKI - Portfolio",
    description: "Engineering logic, crafting future.",
    images: ['/サーキュラー8bit.jpg'],
  },
  verification: {
    google: 'kK-fS0ZwkpLXOm-a3oHAUkpCibUHAlD2w5_h9rBwcy0',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}