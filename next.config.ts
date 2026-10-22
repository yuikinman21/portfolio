import type { NextConfig } from "next";

// 'unsafe-eval' は next dev（React のデバッグ機能）でだけ必要。本番では付けない。
// 3Dモデルの読み込みで WebAssembly を使うため、本番でも 'wasm-unsafe-eval' は残す
// （外すと WebAssembly.instantiate が CSP で拒否され、モデルが表示されない）。
const isDev = process.env.NODE_ENV === "development";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' https: data: blob:",
  "frame-src 'self' https://www.canva.com",
  // drei の <Environment preset> が HDR を raw.githack.com から取得するため https: を許可している
  "connect-src 'self' https: data: blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
