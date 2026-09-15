'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TechTag from '../TechTag';
import ImageSlider from './ImageSlider';
import VersionTabs from './VersionTabs';
import WorkModalLayout from './WorkModalLayout';
import { useImageSlider } from '@/app/hooks/useImageSlider';
import { workImages } from '@/app/content/works';
import { accentStyles } from '@/app/content/accents';

const ACCENT = 'cyan' as const;
const tag = accentStyles[ACCENT].techTag;

/** Home OS の詳細（v1/v2 タブ + 画像スライダー）。この作品固有の表現をここに閉じ込める。 */
export default function HomeOsDetail() {
  const [tab, setTab] = useState<'v1' | 'v2'>('v2');
  const images = workImages.homeos[tab];
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
          alt="Home OS Slide"
        />
      }
      info={
        <>
          <VersionTabs
            value={tab}
            onChange={(v) => setTab(v as 'v1' | 'v2')}
            accent={ACCENT}
            layoutId="homeOsTabBg"
            options={[
              { value: 'v1', label: 'v1.0 Overview' },
              { value: 'v2', label: 'v2.0 Update', sparkle: true },
            ]}
          />

          <div className="relative flex-1">
            <AnimatePresence mode="wait">
              {tab === 'v1' ? (
                <motion.div
                  key="v1"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full tracking-wide">PAST VERSION</span>
                      <span className="text-slate-400 text-xs font-mono">2025.11-2026.02</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Home OS <span className="text-lg font-bold text-slate-400">v1.0</span></h2>
                    <p className="text-sm text-slate-600 leading-relaxed mt-4">
                      自宅サーバー(Ubuntu)上でDockerコンテナ群を運用し、室温・電力使用量の可視化を行うIoTプラットフォーム。<br/>
                      InfluxDBへのデータ蓄積とGrafanaによる可視化を実現しており、スマートホーム化の基礎基盤として構築。
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">v1.0 Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Docker', 'Ubuntu', 'Grafana', 'Python', 'Node-RED'].map((t) => (
                        <TechTag key={t} color={tag}>{t}</TechTag>
                      ))}
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
                      <span className="text-[10px] font-bold bg-cyan-100 text-cyan-600 px-2 py-0.5 rounded-full tracking-wide animate-pulse">MAJOR UPDATE</span>
                      <span className="text-slate-400 text-xs font-mono">2026.02-Current</span>
                    </div>
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 tracking-tight">Home OS <span className="text-lg font-bold text-cyan-700">v2.0</span></h2>
                    <p className="text-sm text-slate-600 leading-relaxed mt-4">
                      フロントエンドを<b>Flutter</b>で完全再構築し、<b>Grafana</b>による「表示」から
                      ダッシュボード上での「操作」へ進化させた。<br/>
                      基盤側も<b>Traefik</b>でサービスをサブドメイン分離し、<b>Tailscale</b>により
                      外部公開せず自宅外からアクセスできる構成に再設計している。
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">v2.0 New Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Flutter', 'Dart', 'Traefik', 'Tailscale', 'NGINX', 'MQTT', 'InfluxDB'].map((t) => (
                        <TechTag key={t} color={tag}>{t}</TechTag>
                      ))}
                    </div>
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
