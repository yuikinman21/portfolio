'use client';

import { motion } from 'framer-motion';

type Props = {
  expanded: boolean;
  /** 展開したときに増える作品数 */
  hiddenCount: number;
  onToggle: () => void;
  className?: string;
};

/**
 * 「もっと見る / 閉じる」のトグル。
 * 別ページへ遷移せず同じ画面で展開するため、スクロール位置と戻る操作を壊さない。
 * 隠れている作品が 0 件のときは page.tsx 側で描画しない。
 */
export default function ShowMoreCard({ expanded, hiddenCount, onToggle, className = '' }: Props) {
  return (
    <motion.button
      layout
      id="works-toggle"
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`bento-card group relative flex items-center justify-center gap-3 px-6 py-4 !border-dashed !border-slate-200 bg-white/60 hover:bg-white hover:!border-indigo-200 transition-colors cursor-pointer ${className}`}
    >
      <span className="font-mono text-[11px] font-bold tracking-widest text-slate-400 group-hover:text-indigo-500 transition-colors uppercase">
        {expanded ? 'Show Less' : `Show All Works (+${hiddenCount})`}
      </span>
      <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">
        {expanded ? '閉じる' : 'もっと見る'}
      </span>
      <motion.span
        animate={{ rotate: expanded ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:border-indigo-200 transition-colors shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.span>
    </motion.button>
  );
}
