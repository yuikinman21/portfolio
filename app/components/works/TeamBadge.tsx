/**
 * チーム開発であることを示すバッジ。
 * 本文で「〇〇で開発」と書く代わりに、カードとモーダルの双方で同じ見た目を使う。
 * ステータスバッジと competing しないよう、配色はアクセント色を使わず中立にしている。
 *
 * `href` を渡すとチームの公式サイトへのリンクになる。
 * カード側では渡さない: カード全体がモーダルを開くクリック領域で、
 * 中身は pointer-events-none にしているため、入れ子のリンクは機能しない。
 */
export default function TeamBadge({ name, href, className = '' }: {
  name: string;
  href?: string;
  className?: string;
}) {
  const base = `inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-500 px-2 py-1 rounded-full text-[10px] font-bold tracking-wide whitespace-nowrap ${className}`;

  const content = (
    <>
      <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <span className="sr-only">チーム開発: </span>
      {name}
    </>
  );

  if (!href) {
    return <span title={`${name} でのチーム開発`} className={base}>{content}</span>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      title={`${name} でのチーム開発（公式サイトを開く）`}
      className={`${base} hover:border-slate-400 hover:text-slate-700 hover:shadow-sm transition-all`}
    >
      {content}
      <svg className="w-2.5 h-2.5 shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}
