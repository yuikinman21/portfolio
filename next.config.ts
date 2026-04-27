import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // 全てのページ(/(.*))に対して以下のヘッダーを適用する
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY", // 他のサイトの iframe でこのサイトを読み込むことを完全に禁止
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff", // MIMEタイプのスニッフィングを禁止
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin", // 別のサイトに遷移する際のURL情報の漏洩を最小限にする
          },
          {
            key: "Content-Security-Policy",
            // 許可リストの設定
            // default-src: 基本は自身のサイト('self')のみ許可
            // style-src: ハッキングエフェクトなどで直接書き込んだCSS('unsafe-inline')を許可
            // img-src: 自身のサイトと、GitHubの草画像APIを許可
            // frame-src: 自身のサイトと、Canvaの埋め込みを許可
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://github-contributions-api.deno.dev; frame-src 'self' https://www.canva.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
