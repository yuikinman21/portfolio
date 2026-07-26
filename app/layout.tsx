import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"], // 基本的なラテン文字をサブセット化
  weight: ["400", "500", "700", "900"], // 必要な太さを指定
  variable: "--font-noto-sans-jp", // Tailwind等で使う場合の変数名
});

export const metadata: Metadata = {
  metadataBase: new URL('https://yuiki.dev'),
  title: "Yuikinman21",
  description: "Engineering logic, crafting future. IoTやWeb開発のプロジェクトをまとめたポートフォリオサイト",
  keywords: ["ポートフォリオ", "エンジニア", "情報工学", "IoT", "スマートホーム", "Yuikinman21", "YUIKI", "Web開発", "プロジェクト"],
  authors: [{ name: "YUIKI MAKINO" }],
  icons: {
    icon: '/サーキュラー8bit.png',
    apple: '/サーキュラー8bit.jpg',
  },
  openGraph: {
    title: "Yuikinman21",
    description: "Engineering logic, crafting future. IoTやWeb開発のプロジェクトをまとめたポートフォリオサイト",
    url: '/',
    siteName: 'Yuikinman21 Portfolio',
    images: [
      {
        url: '/ogp.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Yuikinman21 Portfolio - Engineering logic, crafting future.',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Yuikinman21",
    description: "Engineering logic, crafting future.",
    images: ['/ogp.png'],
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
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}