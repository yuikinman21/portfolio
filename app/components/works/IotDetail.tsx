'use client';

import TechTag from '../TechTag';
import CanvaEmbed from './CanvaEmbed';
import WorkModalLayout from './WorkModalLayout';
import { accentStyles } from '@/app/content/accents';

const ACCENT = 'purple' as const;
const tag = accentStyles[ACCENT].techTag;

const CANVA_EMBED = 'https://www.canva.com/design/DAHCJZi458Y/mzojWOXa0asjUIGbfKOOcw/view?embed';
const CANVA_VIEW = 'https://www.canva.com/design/DAHCJZi458Y/D5pKPXqx5wr8eBM6YmTShg/view?utm_content=DAHCJZi458Y&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h0f81bba7c7';

/** IoT マルウェア研究の詳細。ビジュアルは Canva スライドのみで、バージョン切替を持たない。 */
export default function IotDetail() {
  return (
    <WorkModalLayout
      visual={<CanvaEmbed embedSrc={CANVA_EMBED} viewHref={CANVA_VIEW} accent={ACCENT} />}
      info={
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full tracking-wide">ACADEMIC RESEARCH</span>
              <span className="text-slate-400 text-xs font-mono">2025.09-2026.01</span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">IoTマルウェアの通信分析と多値分類</h2>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">概要</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              スマート家電等のIoTデバイスを標的としたマルウェアの挙動解析と分類手法の研究（プレ卒論）に取り組んでいました。<br/><br/>
              実環境に近いデータセット（Aposemat IoT-23）を活用し、パケットキャプチャ（pcap）データからフロー単位の特徴量を抽出・変換する手法を構築しました。機械学習アルゴリズムに<b>ランダムフォレスト</b>を採用し、マルウェアファミリーの統合を行うことで<b>99.9%以上の高精度な多値分類</b>を達成しています。<br/><br/>
              箱ひげ図を用いた統計的評価により、MiraiのDDoS攻撃特性やHide and Seekの探索挙動など、各マルウェアの機能的な違いを解明するアプローチを行っています。
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">キーワード</h3>
            <div className="flex flex-wrap gap-2">
              {['Network Security', 'Machine Learning', 'Packet Analysis', 'Python'].map((t) => (
                <TechTag key={t} color={tag}>{t}</TechTag>
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
}
