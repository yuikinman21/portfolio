'use client';

import Image from 'next/image';
import AnimatedBentoCard from '../AnimatedBentoCard';
import Label from '../Label';
import TeamBadge from './TeamBadge';
import type { Work } from '@/app/content/works';
import { accentStyles } from '@/app/content/accents';

type Props = {
  work: Work;
  onOpen: (slug: string) => void;
  /** マス割りは work.span を使う。上書きしたい場合のみ指定する。 */
  className?: string;
  delay?: number;
  /** 「もっと見る」で後から現れるカードは layout アニメーションの対象にする */
  animateLayout?: boolean;
};

const ExpandIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
);

/**
 * 作品カード。メタデータ（Work）から描画し、情報量の差は `variant` で吸収する。
 * 作品が増えてもこのコンポーネントは変更せず、works.ts にエントリを足すだけでよい。
 */
export default function WorkCard({ work, onOpen, className, delay = 0, animateLayout = false }: Props) {
  const s = accentStyles[work.accent];
  const badgePulse = work.status.pulse === 'badge' ? ' animate-pulse' : '';
  const dotPulse = work.status.pulse === 'dot' ? ' animate-pulse' : '';

  const header = (
    <div className="flex items-start justify-between gap-2">
      {/* 番号は常時表示のカードだけに付ける。展開側に番号を振ると収納時に欠番が見えるため。 */}
      <Label text={work.featured && work.number ? `${work.number}. ${work.label}` : work.label} color={s.label} />
      {/* 狭い幅ではバッジが折り返せるようにしておく */}
      <div className="flex flex-wrap items-center justify-end gap-1.5">
        {work.team && <TeamBadge name={work.team} />}
        <span className={`inline-flex items-center gap-1.5 ${s.statusBadge} px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide whitespace-nowrap${badgePulse}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.statusDot}${dotPulse}`} />
          {work.status.text}
        </span>
      </div>
    </div>
  );

  const heading = (
    <div>
      <h3 className={`${work.variant === 'text' ? 'text-xl' : 'text-2xl'} font-bold text-slate-800 ${s.titleHover} transition-colors`}>
        {work.title}
      </h3>
      <p className="text-slate-500 text-sm mt-2 leading-relaxed">
        {work.summary.map((line) => <span key={line}>{line}<br/></span>)}
      </p>
    </div>
  );

  const thumbnail = work.cardImage && (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200/60 shadow-sm group-hover:shadow-md transition-shadow duration-500 flex flex-col">
      <div className={`relative w-full aspect-video ${work.cardImage.bg} overflow-hidden`}>
        <Image
          src={work.cardImage.src}
          alt={work.cardImage.alt}
          fill
          className={`${work.cardImage.fit === 'cover' ? 'object-cover' : 'object-contain'} opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700`}
        />
      </div>
    </div>
  );

  const footer = (
    <div className={`flex items-center justify-between border-t ${s.divider} pt-4`}>
      <div className="flex flex-wrap gap-2">
        {work.cardTags.map((t) => (
          <span key={t} className={`text-[10px] bg-white border ${s.cardTag} px-2 py-1 rounded`}>{t}</span>
        ))}
      </div>
      <div className={`w-10 h-10 shrink-0 rounded-full bg-white border ${s.arrowButton} flex items-center justify-center group-hover:scale-110 transition-all shadow-sm`}>
        <ExpandIcon />
      </div>
    </div>
  );

  const body = work.variant === 'split' ? (
    <>
      <div className="space-y-3 pointer-events-none">
        {header}
        <div className="flex flex-col md:flex-row md:items-center md:gap-5">
          <div className="md:flex-1 md:min-w-0">{heading}</div>
          {/* 横長カードでは画像が支配的にならないよう、幅広時は少し絞る */}
          <div className="w-full md:w-1/2 lg:w-[42%] md:shrink-0 mt-4 md:mt-0">{thumbnail}</div>
        </div>
      </div>
      <div className="mt-6 md:mt-2 relative z-10 pointer-events-none">{footer}</div>
    </>
  ) : work.variant === 'feature' ? (
    <>
      <div className="space-y-3 pointer-events-none">
        {header}
        {heading}
      </div>
      <div className="w-full my-6 pointer-events-none">{thumbnail}</div>
      <div className="mt-2 relative z-10 pointer-events-none">{footer}</div>
    </>
  ) : (
    <>
      <div className="space-y-2 pointer-events-none">
        {header}
        {heading}
      </div>
      <div className="mt-6 relative z-10 pointer-events-none">{footer}</div>
    </>
  );

  return (
    <AnimatedBentoCard
      delay={delay}
      layout={animateLayout}
      exit={animateLayout ? { opacity: 0, y: -12, scale: 0.97 } : undefined}
      className={`p-8 flex flex-col justify-between group ${s.card} transition-colors cursor-pointer ${className ?? work.span}`}
      onClick={() => onOpen(work.slug)}
    >
      {body}
    </AnimatedBentoCard>
  );
}
