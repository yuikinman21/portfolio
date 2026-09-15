/**
 * 作品（Works）のメタデータ定義。
 *
 * ここに置くのは「どの作品にも共通して存在する情報」だけ。
 * v1/v2 タブ・Canva 埋め込みのような作品固有の表現は
 * `app/components/works/` の詳細コンポーネント（slot）側に置き、
 * このファイルからは `slug` で参照する。
 *
 * 作品を追加するときは、原則このファイルに 1 エントリ足し、
 * 詳細コンポーネントを 1 つ作って `app/components/works/index.ts` に登録するだけでよい。
 */

/** カードとモーダルの配色テーマ。Tailwind の purge 対策でクラス名は静的に持つ。 */
export type WorkAccent = 'cyan' | 'pink' | 'purple' | 'indigo';

/** カードのレイアウト種別。作品ごとに情報量が違うため 3 種類を用意している。 */
export type WorkCardVariant =
  | 'feature' // 縦長・大きな画像を主役にする（lg で 2x2）
  | 'split'   // 左に説明 / 右に画像
  | 'text';   // 画像なし・テキスト主体

export type WorkStatus = {
  text: string;
  /** どの要素を明滅させるか（既存の見た目を維持するための指定） */
  pulse: 'dot' | 'badge' | 'none';
};

export type Work = {
  slug: string;
  /** Bento カード左上のラベル（例: "05. Home LAB"） */
  label: string;
  accent: WorkAccent;
  variant: WorkCardVariant;
  status: WorkStatus;
  /** カード見出し */
  title: string;
  /** モーダルのヘッダー */
  modalTitle: string;
  /** カード本文。配列の 1 要素が 1 行。 */
  summary: string[];
  /** カード内サムネイル。`text` バリアントでは省略。 */
  cardImage?: { src: string; alt: string; fit: 'contain' | 'cover'; bg: string };
  /** カード下部に出す技術スタック */
  cardTags: string[];
  /** 期間（モーダル側の表示は詳細コンポーネントが持つ。一覧・並び替え用） */
  period: string;
  /** 分類タグ。フィルタ UI は作品が増えるまで作らないが、定義だけ先に持つ。 */
  categories: string[];
  /**
   * トップに常時表示する代表作かどうか。
   * false（未指定）の作品は「もっと見る」を押したときに展開される。
   */
  featured?: boolean;
  /** Bento Grid でのマス割り。page.tsx を触らずに作品を追加できるようここに持つ。 */
  span: string;
};

export const works: Work[] = [
  {
    slug: 'homeos',
    label: '05. Home LAB',
    accent: 'cyan',
    variant: 'feature',
    status: { text: 'NOW STUDYING', pulse: 'dot' },
    title: 'Home OS 2.0',
    modalTitle: 'Home OS 2.0',
    summary: [
      '自宅環境を統合管理するシステムの構築',
      'Docker / MQTT 基盤 + Flutter ダッシュボード',
      'クリックして詳細を見ることができます。',
    ],
    cardImage: {
      src: '/Home_OS_2.0.1.png',
      alt: 'Home OS Dashboard Mockup',
      fit: 'contain',
      bg: 'bg-slate-900',
    },
    cardTags: ['Docker', 'Traefik', 'Tailscale', 'MQTT', 'InfluxDB', 'Grafana', 'Node-RED', 'Python', 'Flutter'],
    period: '2025.11-Current',
    categories: ['IoT', 'Infrastructure'],
    featured: true,
    span: 'md:col-span-6 lg:col-span-2 lg:row-span-2',
  },
  {
    slug: 'shirasagisai',
    label: '06. PROJECT',
    accent: 'pink',
    variant: 'split',
    status: { text: 'NOW BUILDING', pulse: 'badge' },
    title: '白鷺祭用語集',
    modalTitle: '白鷺祭用語集',
    summary: [
      '実行委員向けの用語まとめサイト',
      'クリックして詳細を見ることができます。',
    ],
    cardImage: {
      src: '/shirasagi-sai.png',
      alt: '白鷺祭用語集',
      fit: 'cover',
      bg: 'bg-pink-50',
    },
    cardTags: ['Next.js', 'Vercel'],
    period: '2025.11-Current',
    categories: ['Web'],
    featured: true,
    span: 'md:col-span-3 lg:col-span-2',
  },
  {
    slug: 'iot',
    label: '07. PRE-RESEARCH',
    accent: 'purple',
    variant: 'text',
    status: { text: 'NOW RESEARCHING', pulse: 'none' },
    title: 'IoTマルウェアの通信分析',
    modalTitle: 'IoTマルウェアの通信分析',
    summary: [
      '機械学習を用いたスマートホームデバイスの脅威検知',
      '各マルウェアの通信特徴を分析し、異常検知・マルウェア識別モデルを構築',
    ],
    cardTags: ['Python', 'Network Security', 'Machine Learning', 'Packet Analysis'],
    period: '2025.09-2026.01',
    categories: ['Research', 'Security'],
    featured: true,
    span: 'md:col-span-3 lg:col-span-2',
  },
  {
    slug: 'findsagisai',
    label: '09. PROJECT',
    accent: 'indigo',
    variant: 'split',
    status: { text: 'NOW BUILDING', pulse: 'badge' },
    title: '迷子・落とし物サイト',
    modalTitle: '迷子・落とし物サイト',
    summary: [
      '大学祭の迷子・落とし物をWeb上で検索できるサービス',
      '立て看板を削減し、掲示物の経費を圧縮',
      'クリックして詳細を見ることができます。',
    ],
    cardImage: {
      src: '/find-sagisai.png',
      alt: '迷子・落とし物サイト',
      fit: 'cover',
      bg: 'bg-indigo-50',
    },
    cardTags: ['Next.js', 'Cloudflare Workers', 'Cloudflare D1', 'Cloudflare R2'],
    period: '2026.08-Current',
    categories: ['Web'],
    // featured は付けない → 「もっと見る」で展開される
    span: 'md:col-span-6 lg:col-span-4',
  },
];

/** モーダルのスライダーに出す画像。作品ごと・バージョンごとに持つ。 */
export const workImages: Record<string, Record<string, string[]>> = {
  homeos: {
    v1: ['/My_Room_OS4.jpg', '/My_Room_OS3.jpg'],
    v2: [
      '/Home_OS_2.0.1_0.png',
      '/Home_OS_2.0.1.png',
      '/Home_OS_2.0.1_mobile_1.png',
      '/Home_OS_2.0.1_mobile_2.png',
      '/Home_OS_2.0.1_mobile_3.png',
      '/Home_OS_2.0_architecture.png',
    ],
  },
  findsagisai: {
    v1: ['/find-sagisai.png'],
  },
  shirasagisai: {
    v2: [
      '/shirasagi-sai_1.png',
      '/shirasagi-sai_2.png',
      '/shirasagi-sai_3.png',
      '/shirasagi-sai_4.png',
    ],
  },
};

/** トップに常時表示する代表作 */
export const featuredWorks = works.filter((w) => w.featured);

/** 「もっと見る」で展開される作品 */
export const moreWorks = works.filter((w) => !w.featured);
