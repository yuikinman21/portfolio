# MAKINO YUIKI — Portfolio

大阪公立大学 工学部 情報工学科 (B4) の **MAKINO YUIKI (Yuikinman21)** の個人ポートフォリオサイトです。
ネットワーク・IoTセキュリティの研究と、Web / スマートホーム基盤の開発内容をまとめています。

**Site: [https://yuiki.dev](https://yuiki.dev)**

![Portfolio Preview](./public/screen.png)

## 概要

Next.js (App Router) の単一ページ構成で、Bento Grid 上に9枚のカードを配置しています。
プロジェクト詳細はモーダルで展開し、ページ遷移を伴わずに情報量を確保する構成です。

| # | カード | 内容 |
|---|---|---|
| — | Profile | プロフィールアイコンと所属 |
| 01 | WHO AM I | 自己紹介 |
| 02 | 3D WORKS | React Three Fiber による視線追従3Dモデル |
| 03 | TIMELINE | 学歴・資格・研究の時系列（スクロール／展開式） |
| 04 | TECH STACK & FOCUS | 18種の技術スタックと習熟度、現在の注力分野 |
| 05 | Home LAB | Home OS 2.0 — 自宅環境の統合管理システム（構成図・v1/v2 切替モーダル） |
| 06 | PROJECT | 白鷺祭用語集 — 実行委員向け用語まとめサイト（モーダル） |
| — | PROJECT | 迷子・落とし物サイト — 大学祭の迷子・落とし物検索（「もっと見る」で展開） |
| 07 | PRE-RESEARCH | IoTマルウェアの通信分析（モーダル） |
| 08 | REPOSITORY | GitHub プロフィールと Contributions グラフ |

## 主な実装

### 3Dモデルの視線追従 — `app/components/ModelViewer.tsx`

glTF モデル (`EXPO2025_eye.glb`) を走査して瞳メッシュ (`Hitomi_Blue`) を抽出し、
カメラ基準の右／上ベクトルから四元数を合成、`slerp` で補間してマウス方向へ追従させています。

R3F の `state.pointer` はマウント時点の親要素矩形に依存するため、Bento Grid のレスポンシブ再配置で
カードが移動すると稼働中心がずれます。これを避けるため、`pointermove` ごとに Canvas の
`getBoundingClientRect()` から座標を再計算し、`[-1, 1]` にクランプする実装にしています。

### スポットライトカード — `AnimatedBentoCard`

`useMotionValue` + `useMotionTemplate` でマウス座標を CSS の `radial-gradient` マスクに流し込み、
ホバー中のカードのみ境界線が発光します。React の再レンダリングを経由しないため座標追従が軽量です。

### テキストスクランブル — `ScrambleText`

`useState(text)` で実テキストを初期値にしているため、SSR 時のHTMLには正しい文字列が出力されます。
スクランブルはハイドレーション後にのみ動作し、クローラや JS 無効環境では素のテキストが読まれます。

### 技術スタックカードの自動巡回

4秒ごとに選択スキルが自動で切り替わり、ユーザーが操作した場合は 10 秒間自動巡回を停止します
(`lastInteraction`)。カード下部のロゴ列は `globals.css` の `scroll-left` / `scroll-right`
アニメーションによる無限マーキーで、ホバー中は `animation-play-state: paused` で停止します。

### Home LAB モーダルの v1/v2 切替

`homeOsTab` で v1.0 / v2.0 を切り替え、スライダーの画像配列 (`homeOsImagesV1` / `homeOsImagesV2`) と
右ペインの本文を同時に差し替えます。トグルの背景は `layoutId="homeOsTabBg"` を共有した
`motion.div` で、タブ間をスプリングで移動します。モーダルを閉じると v2.0 とインデックス 0 に復帰します。

v2.0 のスライダー最終ページにはシステム構成図 (`Home_OS_2.0_architecture.png`) を配置し、
右ペインの **v2.0 Architecture** / **External API** と対応させています。構成の要点は以下の通りです。

| レイヤ | 構成 |
|---|---|
| Client & Network | Cloudflare (DNS Only) → Tailscale VPN → Traefik (SSL終端 / サブドメイン振り分け) |
| Web UI | Flutter Web を静的ビルドし NGINX で配信 (`home-os`)、Grafana (`grafana`) |
| API & DB | Node-RED (`node-red`) / Telegraf → InfluxDB (`influxdb`)、Mosquitto で Pub/Sub |
| Bridge | `switchbot-bridge` / `irobot-bridge` / `github-sync` を Python コンテナで個別実装 |
| Host | WSL2 (Ubuntu) 上の Docker、今後 Raspberry Pi へ移行予定 |

## 技術スタック

### Core

| 技術 | バージョン | 用途 |
|---|---|---|
| [Next.js](https://nextjs.org/) | ^16.1.6 | App Router / Metadata API / Image 最適化 |
| [React](https://react.dev/) | 19.2.1 | UI |
| [TypeScript](https://www.typescriptlang.org/) | ^5 | 型安全性 |

### Styling & Animation

| 技術 | バージョン | 用途 |
|---|---|---|
| [Tailwind CSS](https://tailwindcss.com/) | ^4 | スタイリング (`@tailwindcss/postcss`) |
| [Framer Motion](https://www.framer.com/motion/) | ^12.0.0-alpha | 出現アニメーション / モーダル遷移 |
| [react-icons](https://react-icons.github.io/react-icons/) | ^5.6.0 | 技術スタックアイコン |

### 3D

| 技術 | バージョン | 用途 |
|---|---|---|
| [Three.js](https://threejs.org/) | ^0.182.0 | WebGL レンダリング |
| [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) | ^9.0.0-rc | Three.js の React レンダラー |
| [@react-three/drei](https://github.com/pmndrs/drei) | ^10.0.0-rc | `useGLTF` / `OrbitControls` / `Environment` |

> **Note**
> Framer Motion (alpha) と R3F / drei (RC) を React 19 環境で併用しているため、
> peer dependency の解決に `--legacy-peer-deps` が必要です。
> Vercel 側は `vercel.json` の `installCommand` で指定済みです。

## セットアップ

```bash
git clone https://github.com/yuikinman21/portfolio.git
cd portfolio

# peer dependency の競合を回避するためフラグが必要
npm install --legacy-peer-deps

npm run dev
```

[http://localhost:3000](http://localhost:3000) で確認できます。

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番サーバー起動 |
| `npm run lint` | ESLint 実行 |

## ディレクトリ構成

```text
.
├── app/
│   ├── content/
│   │   ├── works.ts             # 作品のメタデータ定義（作品追加はここに1エントリ）
│   │   └── accents.ts           # アクセントカラーのクラス名テーブル
│   ├── hooks/
│   │   └── useImageSlider.ts    # モーダル内スライダーの共通ロジック
│   ├── components/
│   │   ├── works/
│   │   │   ├── index.ts         # slug → 詳細コンポーネント（slot）の対応表
│   │   │   ├── WorkCard.tsx     # メタデータ駆動の作品カード（3バリアント）
│   │   │   ├── WorkModalLayout.tsx  # モーダルの2ペイン骨格
│   │   │   ├── ImageSlider.tsx  # 画像スライダー
│   │   │   ├── VersionTabs.tsx  # v1.0 / v2.0 トグル
│   │   │   ├── ShowMoreCard.tsx # 「もっと見る」トグル
│   │   │   ├── CanvaEmbed.tsx   # Canva 埋め込み + 外部リンク
│   │   │   └── *Detail.tsx      # 作品ごとの固有UI（slot の実体）
│   │   ├── AnimatedBentoCard.tsx  # スポットライト付きカード
│   │   ├── ContributionGraph.tsx  # GitHub Contributions グラフ
│   │   ├── Label.tsx / TechTag.tsx
│   │   ├── Modal.tsx            # 共通モーダル（スクロールロック / 100dvh 対応）
│   │   └── ModelViewer.tsx      # 3Dモデル表示と視線追従ロジック
│   ├── globals.css              # Tailwind テーマ / マーキー / カスタムスクロールバー
│   ├── layout.tsx               # ルートレイアウト・メタデータ (OGP, Twitter Card)
│   ├── not-found.tsx            # 404 ページ
│   ├── page.tsx                 # メインページ（Bento Grid の配置とモーダルの開閉）
│   ├── robots.ts                # robots.txt 生成
│   └── sitemap.ts               # sitemap.xml 生成
├── public/
│   ├── EXPO2025_eye.glb         # 3Dモデル（視線追従対象）
│   ├── Home_OS_2.0.1*.png       # Home OS ダッシュボード（PC / モバイル）
│   ├── Home_OS_2.0_architecture.png  # Home OS v2.0 システム構成図
│   ├── find-sagisai.png         # 迷子・落とし物サイト スクリーンショット
│   ├── shirasagi-sai*.png       # 白鷺祭用語集スクリーンショット
│   ├── ogp.png                  # OGP 画像 (1200x630)
│   └── サーキュラー8bit.jpg     # プロフィールアイコン
├── next.config.ts               # セキュリティヘッダー設定
└── vercel.json                  # installCommand (--legacy-peer-deps)
```

`page.tsx` にはページ固有の UI（`ScrambleText` / `SocialButton` /
`ExpandableTimelineItem` / `ContactButton`）のみを残し、再利用するものは `components/` に切り出しています。

### 作品（Works）の追加方法

作品ごとに表現が異なる（v1/v2 タブ・Canva 埋め込み・画像スライダー）ため、
**共通なのはメタデータだけ**という前提で分離しています。

1. `app/content/works.ts` に 1 エントリ追加（タイトル・期間・ステータス・タグ・カード画像・`variant`・`span`）
2. `app/components/works/` に詳細コンポーネントを 1 つ作成（固有UIはここに閉じ込める）
3. `app/components/works/index.ts` の対応表に 1 行登録

**`page.tsx` の編集は不要です。** カードは `works.ts` の内容から自動で並びます。

カードの `variant` は `feature`（大きな画像が主役） / `split`（左テキスト・右画像） /
`text`（画像なし）の 3 種類。配色は `accent`（cyan / pink / purple）、
Bento のマス割りは `span` で指定します。配色は cyan / pink / purple / indigo の 4 色。
`categories` はフィルタ UI 用に定義だけ先に持っていますが、UI は未実装です。

カード左上の通し番号は `number` に持たせますが、**表示されるのは `featured: true` の作品だけ**です。
「もっと見る」で展開される作品に番号を振ると、収納時に欠番が見えてしまうため、
`featured` でない作品では `number` を指定しても無視されます。

### 「もっと見る」による展開

トップに常時表示するのは `featured: true` の作品だけで、残りは作品グリッドの下にある
トグルを押すと**同じ画面に展開**されます（別ページに遷移しないため、スクロール位置も
ブラウザの戻る操作も壊れません）。`featured` を省略した作品は展開側に入るので、
新しく追加した作品はまず展開側に置かれ、代表作として出すときに `featured: true` を付けます。

展開する作品が 0 件のときはトグル自体を描画しません。トグルは Bento の最小行高
(180px) を受けないよう、グリッドの外に置いて細いバーにしています。
展開・収納は Framer Motion の `layout` / `AnimatePresence` で、周囲のカードが
押し下げられる動きも含めて補間されます。

## SEO / セキュリティ

- **メタデータ**: `layout.tsx` の Metadata API で OGP (1200x630) と Twitter Card を定義
- **クロール制御**: `robots.ts` / `sitemap.ts` を App Router の規約に沿って動的生成
- **`lang="ja"`**: 日本語コンテンツとして正しく宣言（検索評価とスクリーンリーダー読み上げに影響）
- **メールアドレス**: `ContactButton` で user / domain を分割保持し、静的HTMLに完全なアドレスを残さない
- **セキュリティヘッダー**: `next.config.ts` で全パスに付与

  | ヘッダー | 値 |
  |---|---|
  | `X-Frame-Options` | `DENY` |
  | `X-Content-Type-Options` | `nosniff` |
  | `Referrer-Policy` | `strict-origin-when-cross-origin` |
  | `Content-Security-Policy` | `default-src 'self'` を基点に個別許可 |

## デプロイ

[Vercel](https://vercel.com/) でホスティングし、`main` への push で自動デプロイされます。

## Author

**MAKINO YUIKI**

- 大阪公立大学 工学部 情報工学科 B4 / 知的ネットワーキング研究グループ
- 応用情報技術者 (AP), 基本情報技術者 (FE)
- 関心領域: ネットワーク, IoTセキュリティ, スマートホーム, Web開発
- [GitHub](https://github.com/yuikinman21) / [Qiita](https://qiita.com/yuikinman21) / [Note](https://note.com/yuikinman21)

## License

This project is for personal portfolio use.
