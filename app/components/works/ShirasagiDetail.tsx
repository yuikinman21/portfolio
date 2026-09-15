'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TechTag from '../TechTag';
import CanvaEmbed from './CanvaEmbed';
import ImageSlider from './ImageSlider';
import VersionTabs from './VersionTabs';
import WorkModalLayout from './WorkModalLayout';
import { useImageSlider } from '@/app/hooks/useImageSlider';
import { workImages } from '@/app/content/works';
import { accentStyles } from '@/app/content/accents';

const ACCENT = 'pink' as const;
const tag = accentStyles[ACCENT].techTag;

const CANVA_EMBED = 'https://www.canva.com/design/DAG7xpWBnqk/UCJfIcK7AX7x_E11GjpSkw/view?embed';
const CANVA_VIEW = 'https://www.canva.com/design/DAG7xpWBnqk/UCJfIcK7AX7x_E11GjpSkw/view?utm_content=DAG7xpWBnqk&utm_campaign=designshare&utm_medium=embeds&utm_source=link';

/** 白鷺祭用語集の詳細。v1 は Canva 埋め込み、v2 は画像スライダーという固有構成を持つ。 */
export default function ShirasagiDetail() {
  const [tab, setTab] = useState<'v1' | 'v2'>('v2');
  const images = workImages.shirasagisai.v2;
  const slider = useImageSlider(images, tab === 'v2');

  return (
    <WorkModalLayout
      visual={
        <AnimatePresence mode="wait">
          {tab === 'v1' ? (
            <motion.div
              key="canva"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center gap-4"
            >
              <CanvaEmbed embedSrc={CANVA_EMBED} viewHref={CANVA_VIEW} accent={ACCENT} />
            </motion.div>
          ) : (
            <motion.div
              key="slider"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              className="relative w-full flex items-center justify-center"
            >
              <ImageSlider
                images={images}
                index={slider.index}
                onSelect={slider.setIndex}
                onNext={slider.next}
                onPrev={slider.prev}
                accent={ACCENT}
                alt="白鷺祭用語集"
                inset={false}
              />
            </motion.div>
          )}
        </AnimatePresence>
      }
      info={
        <>
          <VersionTabs
            value={tab}
            onChange={(v) => setTab(v as 'v1' | 'v2')}
            accent={ACCENT}
            layoutId="shirasagiTabBg"
            options={[
              { value: 'v1', label: 'v1.0 Overview' },
              { value: 'v2', label: 'v2.0 Update', sparkle: true },
            ]}
          />

          <div className="relative flex-1 mt-2">
            <AnimatePresence mode="wait">
              {tab === 'v1' ? (
                <motion.div
                  key="v1"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full tracking-wide">INITIAL RELEASE</span>
                      <span className="text-slate-400 text-xs font-mono">2025.11</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight leading-tight">
                      白鷺祭用語集 <span className="text-lg font-bold text-slate-400">v1.0</span>
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed mt-4">
                      大学祭実行委員のための用語まとめサイトです。<br/>
                      白鷺祭の準備や運営を円滑にするためのリソースを提供することを目的に、実行委員会のメンバーと共同開発を行いました。
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">担当</h3>
                    <p className="text-sm text-slate-800 font-medium">リードエンジニア / UIデザイン</p>
                    <p className="text-xs text-slate-500 mt-1">要件定義から実装、Vercelへのデプロイまでを一貫して担当。実行委員会のメンバーと連携し、使いやすさを重視したUIを設計しました。</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">v1.0 Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Next.js', 'Vercel'].map((t) => <TechTag key={t} color={tag}>{t}</TechTag>)}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="v2"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full tracking-wide animate-pulse">MAJOR UPDATE</span>
                      <span className="text-slate-400 text-xs font-mono">2026.04-Current</span>
                    </div>
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 tracking-tight">
                      白鷺祭用語集 <span className="text-lg font-bold text-pink-400">v2.0</span>
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed mt-4">
                      新しく地図検索機能を追加しました。<br/><br/>
                      新しいメンバーと共に安全性を見直しながらアップデートを行いました。
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">v2.0 Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Next.js', 'Vercel'].map((t) => <TechTag key={t} color={tag}>{t}</TechTag>)}
                    </div>
                  </div>
                  <div className="mt-auto pt-2">
                    <a
                      href="https://albus-glossary-demo.vercel.app/"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-pink-600 transition-colors text-sm shadow-md"
                    >
                      <span>サンプルサイトを見る</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      }
    />
  );
}
