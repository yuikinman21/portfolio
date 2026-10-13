'use client';

import { motion } from 'framer-motion';
import type { WorkAccent } from '@/app/content/works';

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; sparkle?: boolean }[];
  accent: WorkAccent;
  /** layoutId はページ内で一意である必要があるため作品ごとに渡す */
  layoutId: string;
};

const activeBg: Record<WorkAccent, string> = {
  cyan: 'bg-cyan-600',
  pink: 'bg-pink-500',
  purple: 'bg-purple-500',
  indigo: 'bg-indigo-500',
};

const activeText: Record<WorkAccent, string> = {
  cyan: 'text-cyan-800',
  pink: 'text-slate-700',
  purple: 'text-slate-700',
  indigo: 'text-slate-700',
};

/**
 * v1.0 / v2.0 のトグル。Home OS と白鷺祭用語集で重複していた実装を共通化。
 * 先頭の option は白背景、2 番目以降はアクセント色の塗りになる（既存の見た目を踏襲）。
 */
export default function VersionTabs({ value, onChange, options, accent, layoutId }: Props) {
  return (
    <div className="flex bg-slate-100 p-1 rounded-full mb-2 w-full max-w-[280px] relative isolate">
      {options.map((option, i) => {
        const isActive = value === option.value;
        const isPrimary = i > 0;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`relative flex-1 text-[11px] font-bold py-2.5 px-4 rounded-full transition-colors duration-300 z-10 flex items-center justify-center gap-1 ${
              isActive
                ? isPrimary ? 'text-white' : activeText[accent]
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className={`absolute inset-0 rounded-full shadow-sm -z-10 ${isPrimary ? activeBg[accent] : 'bg-white'}`}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            {option.label}
            {option.sparkle && <span className="text-yellow-300">✨</span>}
          </button>
        );
      })}
    </div>
  );
}
