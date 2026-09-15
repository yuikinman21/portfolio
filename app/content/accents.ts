import type { WorkAccent } from './works';

/**
 * アクセントカラーごとのクラス名テーブル。
 * Tailwind は文字列連結したクラスを検出できないため、完全な形で静的に列挙する。
 */
export const accentStyles: Record<WorkAccent, {
  label: 'cyan' | 'pink' | 'purple';
  card: string;
  titleHover: string;
  statusBadge: string;
  statusDot: string;
  divider: string;
  cardTag: string;
  arrowButton: string;
  sliderDot: string;
  techTag: string;
}> = {
  cyan: {
    label: 'cyan',
    card: 'hover:border-cyan-300 bg-gradient-to-br from-cyan-50/50 to-white',
    titleHover: 'group-hover:text-cyan-600',
    statusBadge: 'bg-cyan-100 text-cyan-700',
    statusDot: 'bg-cyan-500',
    divider: 'border-cyan-100/50',
    cardTag: 'border-cyan-100 text-cyan-600 font-mono',
    arrowButton: 'text-cyan-400 border-cyan-200 group-hover:text-cyan-600',
    sliderDot: 'bg-cyan-600',
    techTag: 'bg-cyan-100 text-cyan-600 border-cyan-200',
  },
  pink: {
    label: 'pink',
    card: 'hover:border-pink-300 bg-gradient-to-br from-pink-50/50 to-white',
    titleHover: 'group-hover:text-pink-600',
    statusBadge: 'bg-pink-100 text-pink-600',
    statusDot: 'bg-pink-500',
    divider: 'border-pink-100/50',
    cardTag: 'border-pink-100 text-pink-500 font-mono',
    arrowButton: 'text-pink-400 border-pink-200 group-hover:text-pink-600',
    sliderDot: 'bg-pink-500',
    techTag: 'bg-pink-100 text-pink-600 border-pink-200',
  },
  purple: {
    label: 'purple',
    card: 'hover:border-purple-300 bg-gradient-to-br from-purple-50/50 to-white',
    titleHover: 'group-hover:text-purple-600',
    statusBadge: 'bg-purple-100 text-purple-700',
    statusDot: 'bg-purple-500',
    divider: 'border-purple-100/50',
    cardTag: 'border-purple-100 text-purple-500',
    arrowButton: 'text-purple-400 border-purple-200 group-hover:text-purple-600',
    sliderDot: 'bg-purple-500',
    techTag: 'bg-purple-50 text-purple-700 border-purple-200',
  },
};
