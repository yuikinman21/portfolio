# YUIKI MAKINO Portfolio

**IoT、ネットワーク、セキュリティ**を学ぶ大学生 **YUIKI MAKINO (Yuikinman21)** の個人ポートフォリオサイトです。
Next.js (App Router) と React Three Fiber を活用し、インタラクティブな3D要素やモダンなUIアニメーションを取り入れています。

## ✨ 特徴 (Features)

* **Bento Grid Layout**: 情報をカード形式で整理し、視認性を高めたモダンなグリッドレイアウトを採用。
* **Interactive 3D Eye Tracking**: `ModelViewer.tsx` により、マウスの動きに合わせて3Dモデル（EXPO2025_eye）の視線が追従するインタラクションを実装。
* **Dynamic Animations**:
    * **Spotlight Effect**: マウスホバー時にカードの境界線や背景が光るスポットライトエフェクト。
    * **Scramble Text**: ヘッダータイトルにおけるサイバー風のテキストスクランブル演出。
    * **Scroll Animations**: `Framer Motion` を使用したスムーズな出現アニメーション。
* **Responsive Design**: Tailwind CSS v4 を使用し、モバイルからデスクトップまで完全レスポンシブ対応。

## 🛠 使用技術 (Tech Stack)

プロジェクトは以下の技術スタックで構築されています。

### Core Frameworks
* **[Next.js 16.0.8](https://nextjs.org/)**: App Router を採用した最新のReactフレームワーク。
* **[React 19.2.1](https://react.dev/)**: 最新のUIライブラリ。
* **[TypeScript](https://www.typescriptlang.org/)**: 型安全性と開発効率の向上。

### Styling & UI
* **[Tailwind CSS v4](https://tailwindcss.com/)**: ユーティリティファーストなCSSフレームワーク。
* **[Framer Motion](https://www.framer.com/motion/)**: 宣言的なアニメーションライブラリ。

### 3D & Graphics
* **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)**: Three.js の React レンダラー。
* **[Drei](https://github.com/pmndrs/drei)**: R3F のための便利なヘルパーライブラリ。
* **[Three.js](https://threejs.org/)**: WebGL ベースの3Dライブラリ。

## 🚀 環境構築 (Getting Started)

以下の手順でローカル環境にてプロジェクトを起動できます。

### 1. リポジトリのクローン
```bash
git clone [https://github.com/yuikinman21/portfolio.git](https://github.com/yuikinman21/portfolio.git)
cd portfolio
````

### 2\. 依存関係のインストール

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3\. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) を開くと、アプリケーションを確認できます。

## 📂 ディレクトリ構成 (Project Structure)

主要なファイル構成は以下の通りです。

```text
.
├── app/
│   ├── components/
│   │   └── ModelViewer.tsx    # 3Dモデル表示と視線追従ロジック
│   ├── globals.css            # グローバルスタイル (Tailwind)
│   ├── layout.tsx             # ルートレイアウト
│   └── page.tsx               # メインページ (Bento Grid構成)
├── public/
│   ├── EXPO2025_eye.glb       # 3Dモデルファイル
│   ├── サーキュラー8bit.jpg   # プロフィール画像
│   └── ...
├── package.json               # 依存関係定義
└── next.config.ts             # Next.js 設定
```

## 👤 Author

**YUIKI MAKINO**

  * **Role**: University Student (B3)
  * **Focus**: IoT, Network, Security, Web Development
  * **Links**:
      * GitHub: [@yuikinman21](https://github.com/yuikinman21)
      * Contact: [Email](mailto:sw23263n@st.omu.ac.jp)

## 📄 License

This project is for personal portfolio use.

```
```
