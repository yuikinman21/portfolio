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
 *
 * カード型にすると Bento の一部に見えて作品と紛らわしいので、
 * 細い罫線の上にピルを置く「区切り線 + ボタン」の形にしている。
 * 隠れている作品が 0 件のときは page.tsx 側で描画しない。
 */
export default function ShowMoreCard({ expanded, hiddenCount, onToggle, className = '' }: Props) {
  return (
    <motion.div className={`relative flex items-center justify-center py-1 ${className}`}>
      {/* 中央が濃く、両端に向かって消える罫線 */}
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"
        animate={{ opacity: expanded ? 0.6 : 1 }}
        transition={{ duration: 0.3 }}
      />

      <motion.button
        id="works-toggle"
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="group relative inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white/90 py-2.5 pl-5 pr-3 shadow-sm backdrop-blur-sm transition-colors hover:border-slate-300 hover:shadow-md"
      >
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 transition-colors group-hover:text-indigo-500">
          {expanded ? 'Show less' : `+${hiddenCount} more`}
        </span>
        <span className="text-sm font-bold text-slate-700 transition-colors group-hover:text-indigo-600">
          {expanded ? '閉じる' : 'もっと見る'}
        </span>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-500"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.span>
      </motion.button>
    </motion.div>
  );
}
