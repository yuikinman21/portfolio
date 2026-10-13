'use client';

import TechTag from '../TechTag';
import ImageSlider from './ImageSlider';
import TeamBadge from './TeamBadge';
import WorkModalLayout from './WorkModalLayout';
import { useImageSlider } from '@/app/hooks/useImageSlider';
import { workImages } from '@/app/content/works';
import { accentStyles } from '@/app/content/accents';

const ACCENT = 'indigo' as const;
const tag = accentStyles[ACCENT].techTag;

const SITE_URL = 'https://find-sagisai.yuiki.dev';

/** 迷子・落とし物サイトの詳細。バージョン切替を持たない単一構成。 */
export default function FindSagisaiDetail() {
  const images = workImages.findsagisai.v1;
  const slider = useImageSlider(images);

  return (
    <WorkModalLayout
      visual={
        <ImageSlider
          images={images}
          index={slider.index}
          onSelect={slider.setIndex}
          onNext={slider.next}
          onPrev={slider.prev}
          accent={ACCENT}
          alt="迷子・落とし物サイト"
        />
      }
      info={
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full tracking-wide animate-pulse">NOW BUILDING</span>
              <span className="text-slate-400 text-xs font-mono">2026.08-Current</span>
              <TeamBadge name="Albus" />
            </div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 tracking-tight leading-tight">
              迷子・落とし物サイト
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mt-4">
              大学祭の<b>迷子・落とし物情報</b>を、来場者がその場で検索できるサービス。<br/>
              品名・色・場所から検索でき、迷子情報も常時掲示する。本祭典で運用する際に1万人以上のアクセスに耐えるように設計。<br/>
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">担当</h3>
            <p className="text-sm text-slate-800 font-medium">企画 / 設計 / 実装</p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">Stack</h3>
            <div className="flex flex-wrap gap-2">
              {['Next.js', 'Cloudflare Workers', 'Cloudflare D1', 'Cloudflare R2'].map((t) => (
                <TechTag key={t} color={tag}>{t}</TechTag>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-2">
            <a
              href={SITE_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors text-sm shadow-md"
            >
              <span>サイトを見る</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          </div>
        </div>
      }
    />
  );
}
