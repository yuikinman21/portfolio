'use client';

import Image from 'next/image';
import AnimatedBentoCard from '../AnimatedBentoCard';
import Label from '../Label';
import type { Work } from '@/app/content/works';
import { accentStyles } from '@/app/content/accents';

type Props = {
  work: Work;
  onOpen: (slug: string) => void;
  /** Bento のマス割りは呼び出し側（page.tsx）が決める */
  className?: string;
  delay?: number;
};

const ExpandIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
);

/**
 * 作品カード。メタデータ（Work）から描画し、情報量の差は `variant` で吸収する。
 * 作品が増えてもこのコンポーネントは変更せず、works.ts にエントリを足すだけでよい。
 */
export default function WorkCard({ work, onOpen, className = '', delay = 0 }: Props) {
  const s = accentStyles[work.accent];
  const badgePulse = work.status.pulse === 'badge' ? ' animate-pulse' : '';
  const dotPulse = work.status.pulse === 'dot' ? ' animate-pulse' : '';

  const header = (
    <div className="flex items-center justify-between">
      <Label text={work.label} color={s.label} />
      <span className={`inline-flex items-center gap-1.5 ${s.statusBadge} px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide${badgePulse}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${s.statusDot}${dotPulse}`} />
        {work.status.text}
      </span>
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
        <div className="flex flex-col md:flex-row md:items-start md:gap-5">
          <div className="md:flex-1 md:min-w-0">{heading}</div>
          <div className="w-full md:w-1/2 md:shrink-0 mt-4 md:mt-0">{thumbnail}</div>
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
      className={`p-8 flex flex-col justify-between group ${s.card} transition-colors cursor-pointer ${className}`}
      onClick={() => onOpen(work.slug)}
    >
      {body}
    </AnimatedBentoCard>
  );
}
