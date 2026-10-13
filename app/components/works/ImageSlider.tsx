'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import type { WorkAccent } from '@/app/content/works';
import { accentStyles } from '@/app/content/accents';

type Props = {
  images: string[];
  index: number;
  onSelect: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
  accent: WorkAccent;
  alt: string;
  /** 矢印を画像の内側に置くか外側に置くか（既存の 2 パターンを吸収） */
  inset?: boolean;
};

/**
 * 画像スライダー（フェード切替・左右ボタン・インジケーター）。
 * Home OS と白鷺祭用語集で重複していた約 60 行 x 2 をここに集約している。
 */
export default function ImageSlider({
  images, index, onSelect, onNext, onPrev, accent, alt, inset = true,
}: Props) {
  const styles = accentStyles[accent];
  const src = images[index];

  return (
    <>
      <div className="relative w-full h-full max-h-[400px] aspect-[4/3] rounded-xl overflow-hidden shadow-sm bg-white border border-slate-200">
        <AnimatePresence mode="wait">
          <motion.div
            key={src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <Image src={src} alt={`${alt} ${index + 1}`} fill className="object-contain p-1" priority />
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <>
          <button
            aria-label="前の画像"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className={`absolute ${inset ? 'left-4' : 'left-0'} top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md backdrop-blur-sm transition-transform hover:scale-110 z-10`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            aria-label="次の画像"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className={`absolute ${inset ? 'right-4' : 'right-0'} top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md backdrop-blur-sm transition-transform hover:scale-110 z-10`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          <div className={`absolute ${inset ? 'bottom-4' : 'bottom-2'} left-1/2 -translate-x-1/2 flex gap-2 z-10`}>
            {images.map((image, idx) => (
              <button
                key={image}
                aria-label={`${idx + 1}枚目を表示`}
                onClick={() => onSelect(idx)}
                className={`w-2 h-2 rounded-full transition-all shadow-sm ${
                  idx === index ? `${styles.sliderDot} w-4` : 'bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
