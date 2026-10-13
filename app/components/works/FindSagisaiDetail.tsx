'use client';

import TechTag from '../TechTag';
import ImageSlider from './ImageSlider';
import TeamBadge from './TeamBadge';
import WorkModalLayout from './WorkModalLayout';
import { useImageSlider } from '@/app/hooks/useImageSlider';
import { workImages, ALBUS } from '@/app/content/works';
import { accentStyles } from '@/app/content/accents';

const ACCENT = 'indigo' as const;
const tag = accentStyles[ACCENT].techTag;

// 実サイト（https://find-sagisai.yuiki.dev）への導線は先方の意向で一旦外している。
// 公開してよくなったら「サイトを見る」ボタンを戻す。

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
              <TeamBadge name={ALBUS.name} href={ALBUS.url} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 tracking-tight leading-tight">
              迷子・落とし物サイト
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mt-4">
              大学祭の<b>迷子・落とし物情報</b>を扱うサービス。<br/>
              来場者は品名・色・場所から自分で探すことができ、委員は専用画面から情報を扱える。
              <b>来場者と委員の双方</b>の手間を減らすことを狙っている。<br/>
              <b>今年の大学祭で実際に運用予定</b>。1万人以上のアクセスに耐えるよう設計している。
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
        </div>
      }
    />
  );
}
