'use client';

import Image from "next/image";
import dynamic from 'next/dynamic';
import { useState, useEffect, useRef, useMemo, MouseEvent } from 'react';
// アニメーション用ライブラリ
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import Modal from './components/Modal';
import ContributionGraph from './components/ContributionGraph';
import AnimatedBentoCard from './components/AnimatedBentoCard';
import Label from './components/Label';
import TechTag from './components/TechTag';
import WorkCard from './components/works/WorkCard';
import ShowMoreCard from './components/works/ShowMoreCard';
import { works, featuredWorks, moreWorks } from './content/works';
import { workDetails } from './components/works';
import { FaPython, FaReact, FaJava, FaDocker, FaGithub, FaNetworkWired, FaShieldAlt } from 'react-icons/fa';
import { SiTypescript, SiNextdotjs, SiTailwindcss, SiCplusplus, SiBlender, SiVercel, SiGoogleappsscript, SiDart, SiDavinciresolve, SiFlutter, SiGimp, SiGo, } from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';

type SkillType = {
  name: string;
  icon: React.ReactNode;
  exp: string;
  level: number;
  color: string;
  category: 'LANGUAGE' | 'FRAMEWORK' | 'TOOLS' | 'CREATIVE';
  description: string;
  url?: string;
};

// 3Dコンポーネントを動的インポート（SSR無効化）
const ModelViewer = dynamic(() => import('./components/ModelViewer'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-900">
      <div className="animate-spin h-6 w-6 border-2 border-indigo-500 rounded-full border-t-transparent"></div>
    </div>
  )
});

// --- サイバー風テキストコンポーネント ---
const CYBER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

function ScrambleText({ text, className }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startScramble = () => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CYBER_CHARS[Math.floor(Math.random() * CYBER_CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }

      iteration += 1 / 3;
    }, 30);
  };

  useEffect(() => {
    startScramble();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <span className={className} onMouseEnter={startScramble}>
      {displayText}
    </span>
  );
}

// --- スポットライト付きBentoカード ---
// マウス位置に合わせて光るエフェクトを追加

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const [hoveredSkill, setHoveredSkill] = useState<any>(null);

  // 上段用データ（LANGUAGE / FRAMEWORK）
  const skillLanguages: SkillType[] = useMemo(() => [
    { name: "Python", icon: <FaPython />, exp: "3年", level: 3, color: "text-blue-500", category: "LANGUAGE", description: "データ解析や、機械学習など様々な用途で使用しています！", url: "https://www.python.org/" },
    { name: "Go", icon: <SiGo />, exp: "1年未満", level: 2, color: "text-cyan-600", category: "LANGUAGE", description: "バックエンド開発に使用しています！DBにも触れています！", url: "https://go.dev/" },
    { name: "TypeScript", icon: <SiTypescript />, exp: "1年未満", level: 2, color: "text-blue-600", category: "LANGUAGE", description: "Next.jsでのサイト作成に使用しています！", url: "https://www.typescriptlang.org/" },
    { name: "Next.js", icon: <SiNextdotjs />, exp: "1年未満", level: 2, color: "text-slate-800", category: "FRAMEWORK", description: "現在メインで使用しているフレームワークです！", url: "https://nextjs.org/" },
    { name: "React", icon: <FaReact />, exp: "1年未満", level: 2, color: "text-cyan-400", category: "FRAMEWORK", description: "いろいろ勉強中です！このサイトでも活用しています！", url: "https://react.dev/" },
    { name: "Tailwind CSS", icon: <SiTailwindcss />, exp: "1年未満", level: 2, color: "text-cyan-500", category: "FRAMEWORK", description: "CSSについては以前勉強したので結構分かります！", url: "https://tailwindcss.com/" },
    { name: "C++", icon: <SiCplusplus />, exp: "2年", level: 3, color: "text-blue-700", category: "LANGUAGE", description: "CもC#も触ったことあります！", url: "https://cplusplus.com/" },
    { name: "Java", icon: <FaJava />, exp: "2年", level: 1, color: "text-red-500", category: "LANGUAGE", description: "大学の授業で少しだけ触りました！", url: "https://dev.java/" },
    { name: "GAS", icon: <SiGoogleappsscript />, exp: "4年", level: 3, color: "text-green-600", category: "TOOLS", description: "高校でのゼミ活動から使っています！JavaScriptとほぼ一緒なので少し慣れてます！", url: "https://developers.google.com/apps-script" },
    { name: "Dart", icon: <SiDart />, exp: "1年未満", level: 2, color: "text-blue-400", category: "LANGUAGE", description: "Flutterでのアプリ開発に使用しています！", url: "https://dart.dev/" },
    { name: "Flutter", icon: <SiFlutter />, exp: "1年未満", level: 3, color: "text-cyan-400", category: "FRAMEWORK", description: "今一番触っています！研究でも開発でも活躍中！", url: "https://flutter.dev/" },
  ], []);

  // 下段用データ（TOOLS / CREATIVE）
  const skillTools: SkillType[] = useMemo(() => [
    { name: "Docker", icon: <FaDocker />, exp: "1年未満", level: 3, color: "text-blue-500", category: "TOOLS", description: "Home OSの実験用に複数のコンテナを立ち上げてます！", url: "https://www.docker.com/" },
    { name: "Blender", icon: <SiBlender />, exp: "3年", level: 3, color: "text-orange-500", category: "CREATIVE", description: "標準的なモデル作成のほか、バイト先で教えたりもしています。", url: "https://www.blender.org/" },
    { name: "GitHub", icon: <FaGithub />, exp: "1年未満", level: 3, color: "text-slate-800", category: "TOOLS", description: "バージョン管理や、チーム開発で活用しています！", url: "https://github.com/" },
    { name: "Vercel", icon: <SiVercel />, exp: "1年未満", level: 3, color: "text-slate-900", category: "TOOLS", description: "GitHubのレポジトリをデプロイするのに使用しています！", url: "https://vercel.com/" },
    { name: "VS Code", icon: <VscVscode />, exp: "4年", level: 4, color: "text-blue-500", category: "TOOLS", description: "Atomがサービス終了してからはこれを使ってます！", url: "https://code.visualstudio.com/" },
    { name: "GIMP", icon: <SiGimp />, exp: "2年", level: 2, color: "text-slate-700", category: "CREATIVE", description: "画像編集をするときに使っています！", url: "https://www.gimp.org/" },
    { name: "DaVinci Resolve", icon: <SiDavinciresolve />, exp: "2年", level: 2, color: "text-red-400", category: "CREATIVE", description: "映像編集をする時に使っています！", url: "https://www.blackmagicdesign.com/products/davinciresolve" },
  ], []);

  const allSkills = useMemo(() => [...skillLanguages, ...skillTools], [skillLanguages, skillTools]);
  const [selectedSkill, setSelectedSkill] = useState<SkillType | null>(null);
  const [lastInteraction, setLastInteraction] = useState<number>(0);

  useEffect(() => {
    if (allSkills.length > 0 && !selectedSkill) {
      setSelectedSkill(allSkills[Math.floor(Math.random() * allSkills.length)]);
    }
  }, [allSkills, selectedSkill]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastInteraction < 10000) return;
      
      // ★ 引数に明示的に型 (prev: SkillType | null) をつけて any エラーを解消
      setSelectedSkill((prev: SkillType | null) => {
        if (!prev) return allSkills[0];
        const currentIndex = allSkills.findIndex((s: SkillType) => s.name === prev.name);
        const nextIndex = (currentIndex + 1) % allSkills.length;
        return allSkills[nextIndex];
      });
    }, 4000); 

    return () => clearInterval(interval);
  }, [allSkills, lastInteraction]);

  const handleSkillClick = (skill: SkillType) => {
    setSelectedSkill(skill);
    setLastInteraction(Date.now());
  };

  // 作品モーダルの開閉のみを page が持つ。スライダー・タブの状態は
  // 各詳細コンポーネント（app/components/works/）が自分で持ち、モーダルを閉じると
  // アンマウントされて初期状態に戻る。

  // 「もっと見る」の展開状態。別ページへ遷移せず同じ画面で開くため、
  // スクロール位置もブラウザの戻る操作も壊れない。
  const [worksExpanded, setWorksExpanded] = useState(false);

  const toggleWorks = () => {
    const willCollapse = worksExpanded;
    setWorksExpanded((prev) => !prev);
    // 閉じたときにページ下部へ取り残されないよう、トグル自体を画面内に戻す
    if (willCollapse) {
      requestAnimationFrame(() => {
        document.getElementById('works-toggle')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto space-y-10">
      {/* --- Header Area --- */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 py-4">
        <div className="space-y-3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="font-mono text-slate-500 text-xs tracking-widest font-bold uppercase">
              Available for Research & Dev
            </p>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9]">
            <ScrambleText text="Yuikinman21" />
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-slate-500 font-medium max-w-lg text-lg"
          >
            IoTに興味がある大学生<br/>
            <span className="text-indigo-600">ネットワーク</span>と<span className="text-purple-600">セキュリティ</span>を研究しながら、Web開発やスマートホーム化に挑戦中。
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3"
        >
          <SocialButton href="https://github.com/yuikinman21" label="GitHub" />
          <SocialButton href="https://qiita.com/yuikinman21" label="Qiita" />
          <SocialButton href="https://note.com/yuikinman21" label="Note" />
          <ContactButton user="yuikinman21" domain="gmail.com" label="Contact" />
        </motion.div>
      </header>

      {/* --- Bento Grid Layout --- */}
      <main className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]">
        
        {/* 1. Profile Image Card */}
        <AnimatedBentoCard delay={0.1} className="md:col-span-3 lg:col-span-2 md:row-span-2 min-h-[350px] flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-50 to-white group relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none" />
          
          <div
            className="relative z-10 w-56 h-56 md:w-64 md:h-64 shadow-2xl shadow-indigo-100 rounded-full overflow-hidden border-[6px] border-white transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2 mx-auto"
          >
            <Image
              src="/サーキュラー8bit.jpg"
              alt="MAKINO YUIKI Profile Icon"
              fill
              className="object-cover"
              // style={{objectPosition: '45% 50%'}}
              priority
            />
          </div>
          <div className="mt-8 text-center space-y-1 relative z-10">
            <h2 className="text-3xl font-bold text-slate-800">MAKINO YUIKI</h2>
            <p className="text-slate-500 font-mono text-sm bg-slate-100 px-3 py-1 rounded-full inline-block">
              Osaka Metropolitan Univ. Student B4
            </p>
          </div>
        </AnimatedBentoCard>

        {/* 2. About Me */}
        <AnimatedBentoCard delay={0.2} className="md:col-span-3 lg:col-span-2 p-8 flex flex-col justify-center">
          <Label text="01. WHO AM I" color="indigo" />
          <h3 className="text-xl font-bold text-slate-800 leading-snug">
            様々なことに挑戦中の<span className="text-indigo-600">大学生</span>です！
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            フロントエンドからバックエンド、セキュリティからスマートホームに関する研究など幅広く挑戦中。<br/>
            新しい技術が大好きで、大阪関西万博にはボランティア活動のほか、来場者として合計30回会場に足を運びました。<br />
            将来的にはシステム開発に関する仕事に携わりたいと考えています。<br />
            現在は、本大学の情報基盤課学生スタッフTryAngleおよび大学発ベンチャー企業のバックエンドエンジニアとして勤務しながら、幅広く学び続けています。
          </p>
        </AnimatedBentoCard>

        {/* 3. 3D Showcase (02. 3D WORKS) */}
        <AnimatedBentoCard delay={0.3} className="md:col-span-3 lg:col-span-2 md:row-span-2 min-h-[420px] md:min-h-[300px] relative group bg-slate-900 overflow-hidden border-slate-800">
          <div className="absolute top-6 left-6 z-20 pointer-events-none">
            <Label text="02. 3D WORKS" color="purple" />
            <p className="text-slate-400 text-xs mt-1">Interactive 3D Demo with React Three Fiber</p>
          </div>
          
          <div className="absolute inset-0 z-10">
            <ModelViewer />
          </div>

          <div className="absolute bottom-6 right-6 z-20">
             {/* <span className="text-xs font-mono text-slate-500 bg-slate-800/50 px-2 py-1 rounded border border-slate-700">
               Drag to rotate
             </span> */}
          </div>
        </AnimatedBentoCard>

        {/* 4. Timeline (History & Status) */}
        <AnimatedBentoCard delay={0.4} className="md:col-span-3 lg:col-span-1 p-6 flex flex-col group h-full min-h-[400px]">
          <Label text="03. TIMELINE" color="green" />

          <div 
            className="flex-1 mt-4 relative w-full h-full min-h-[0]"
            style={{
              maskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)'
            }}
          >
            <div className="absolute inset-0 overflow-y-auto overflow-x-hidden px-2 pt-6 pb-10 scroll-pt-6 custom-scrollbar snap-y snap-mandatory">

              <ExpandableTimelineItem
                date="2026.04"
                title="ファイナンシャル・プランニング技能士3級 (FP3級)"
                org="日本FP協会"
                type="cert"
              >
                社会人として最低限のお金の知識を手に入れました！
              </ExpandableTimelineItem>

              <ExpandableTimelineItem
                date="2025.12"
                title="応用情報技術者 (AP)"
                org="情報処理推進機構 (IPA)"
                type="cert"
              >
                基本情報技術者の次のステップとして勉強し、一発で合格することができました！
              </ExpandableTimelineItem>

              <ExpandableTimelineItem
                date="2025.09 - Present"
                title="研究室配属"
                org="知的ネットワーキング研究グループ"
                type="edu"
                isCurrent
              >
                IoTや無線、機械学習に関する研究を行なっています！
              </ExpandableTimelineItem>

              <ExpandableTimelineItem
                date="2025.08"
                title="基本情報技術者 (FE)"
                org="情報処理推進機構 (IPA)"
                type="cert"
              >
                大学の授業での学びを活かして、短期間で合格することができました！
              </ExpandableTimelineItem>

              <ExpandableTimelineItem
                date="2023.04 - Present"
                title="大阪公立大学 工学部 情報工学科"
                org="Osaka Metropolitan University"
                type="edu"
                isCurrent
              >
                情報工学の基礎から応用まで幅広く学びながら、ネットワークやセキュリティ、IoTに関する研究に取り組んでいます。
              </ExpandableTimelineItem>

              <ExpandableTimelineItem
                date="2020.04 - 2023.03"
                title="京都市立西京高等学校 エンタープライジング科"
                org="Kyoto Saikyo High School"
                type="edu"
              >
                探究活動や委員会活動を通じて、主体的に様々なことに挑戦しました。部活は競技かるた部で、全国大会にも出場しました！(初戦が全国ですが...)
              </ExpandableTimelineItem>

            </div>
          </div>
        </AnimatedBentoCard>
        

        {/* 5. Tech Stack & Focus */}
        <AnimatedBentoCard delay={0.5} className="md:col-span-6 lg:col-span-1 p-6 flex flex-col bg-white overflow-hidden h-full">
          <Label text="04. TECH STACK & FOCUS" color="blue" />

          {/* ★ インライン詳細情報エリア (高さを140pxに拡張し、内部構造を整理) */}
          <div className="mt-5 h-[140px] relative shrink-0">
            <AnimatePresence mode="wait">
              {selectedSkill && (
                <motion.div
                  key={selectedSkill.name}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => {
                    if (selectedSkill.url) window.open(selectedSkill.url, '_blank', 'noopener,noreferrer');
                  }}
                  className={`absolute inset-0 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 flex gap-4 shadow-sm transition-[box-shadow,border-color] group/link ${selectedSkill.url ? 'cursor-pointer hover:shadow-md hover:border-blue-300' : ''}`}
                >
                  {/* 左: アイコン */}
                  <div className={`text-4xl ${selectedSkill.color} w-14 h-14 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0`}>
                    {selectedSkill.icon}
                  </div>
                  
                  {/* 右: テキスト・ゲージ領域（重ならないようにflexで分割） */}
                  <div className="flex-1 flex flex-col min-w-0">
                    
                    {/* 1段目: タイトル・バッジ・経験年数 */}
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <div className="flex flex-col gap-1 min-w-0">
                        <h3 className={`font-bold text-slate-800 text-sm truncate ${selectedSkill.url ? 'group-hover/link:text-blue-600 transition-colors' : ''}`}>
                          {selectedSkill.name}
                        </h3>
                        <span className="w-max text-[8px] font-bold text-slate-500 bg-slate-200/50 px-1.5 py-0.5 rounded border border-slate-200">
                          {selectedSkill.category}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-blue-600 font-mono bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 shrink-0 whitespace-nowrap">
                        経験: {selectedSkill.exp}
                      </span>
                    </div>

                    {/* 2段目: 説明文 (mb-autoでプログレスバーを下に押しやる) */}
                    <p className="text-[10px] text-slate-500 leading-snug line-clamp-2 mb-auto">
                      {selectedSkill.description}
                    </p>
                    
                    {/* 3段目: プログレスバー */}
                    <div className="flex items-center gap-2 mt-2 shrink-0">
                      <span className="text-[9px] text-slate-400 font-bold w-6">Lv.{selectedSkill.level}</span>
                      <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(selectedSkill.level / 5) * 100}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="bg-gradient-to-r from-blue-400 to-indigo-500 h-full rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 無限スクロール領域 */}
          <div className="mt-2 flex-1 flex flex-col justify-center gap-2 group-hover-pause mask-horizontal-fade min-h-0 py-2">
            {/* 上段：LANGUAGE & FRAMEWORKS */}
            <div className="w-full">
              <div className="animate-scroll-left flex gap-4 px-2">
                {[...skillLanguages, ...skillLanguages, ...skillLanguages, ...skillLanguages].map((skill, idx) => (
                  <div
                    key={`lang-${idx}`}
                    onClick={() => handleSkillClick(skill)}
                    className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 shrink-0 cursor-pointer group/icon"
                  >
                    <div className={`text-2xl ${skill.color} transition-transform duration-300 group-hover/icon:scale-125`}>{skill.icon}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 下段：TOOLS & CREATIVE */}
            <div className="w-full">
              <div className="animate-scroll-right flex gap-4 px-2">
                {[...skillTools, ...skillTools, ...skillTools, ...skillTools].map((skill, idx) => (
                  <div
                    key={`tool-${idx}`}
                    onClick={() => handleSkillClick(skill)}
                    className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 shrink-0 cursor-pointer group/icon"
                  >
                    <div className={`text-2xl ${skill.color} transition-transform duration-300 group-hover/icon:scale-125`}>{skill.icon}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ★ デザインを一新した FOCUS領域（システムインジケーター風） */}
          <div className="mt-4 pt-4 border-t border-slate-100 shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">Current Focus</p>
              <div className="flex-1 h-px bg-slate-100"></div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 hover:border-emerald-300 hover:shadow-sm transition-all cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm"></span> SC
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 hover:border-blue-300 hover:shadow-sm transition-all cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm"></span> DB
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 hover:border-indigo-300 hover:shadow-sm transition-all cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-sm"></span> Web Application
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 hover:border-orange-300 hover:shadow-sm transition-all cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-sm"></span> 3D Modeling
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 hover:border-cyan-300 hover:shadow-sm transition-all cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-sm animate-pulse"></span> IoT
              </div>
            </div>
          </div>
          
        </AnimatedBentoCard>

        {/* 作品カード: works.ts のメタデータから描画する。追加は works.ts への 1 エントリで完結。
            featured の作品を常時表示し、残りは「もっと見る」で同じ画面に展開する。 */}
        {featuredWorks.map((work, i) => (
          <WorkCard key={work.slug} work={work} onOpen={setSelectedProject} delay={0.6 + i * 0.1} animateLayout />
        ))}

        <AnimatePresence initial={false}>
          {worksExpanded && moreWorks.map((work, i) => (
            <WorkCard key={work.slug} work={work} onOpen={setSelectedProject} delay={i * 0.06} animateLayout />
          ))}
        </AnimatePresence>

      </main>

      {/* 「もっと見る」トグル。Bento の最小行高(180px)を受けないよう、グリッドの外に置く。 */}
      {moreWorks.length > 0 && (
        <ShowMoreCard
          expanded={worksExpanded}
          hiddenCount={moreWorks.length}
          onToggle={toggleWorks}
          className="w-full"
        />
      )}

      <main className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]">
        {/* 8. GitHub Link */}
        <AnimatedBentoCard delay={0.9} href="https://github.com/yuikinman21" target="_blank" rel="noopener noreferrer" className="md:col-span-6 lg:col-span-4 p-6 md:p-8 flex items-center group hover:border-slate-300 bg-slate-50 transition-colors cursor-pointer">

          <div className="flex flex-col xl:flex-row xl:items-center gap-5 xl:gap-8 w-full h-full">
            {/* 左側：テキスト情報 */}
            <div className="relative z-10 xl:flex-shrink-0 xl:basis-[248px]">
              <Label text="08. REPOSITORY" color="orange" />
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mt-2 group-hover:text-orange-600 transition-colors">
                @yuikinman21
              </h3>
              <p className="text-slate-500 text-sm mt-2 max-w-md leading-relaxed">
                ソースコードや開発ログはこちらから
              </p>
            </div>

            {/* 中央：GitHub Contributions グラフ（幅に応じて表示する週数が変わる） */}
            <div className="relative z-10 flex-1 min-w-0 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
              <ContributionGraph username="yuikinman21" />
            </div>

            {/* 右側：アイコンとCTAボタン（xl未満では横並びのフッター） */}
            <div className="relative z-10 flex w-full flex-row items-center justify-center gap-3 border-t border-slate-200/80 pt-4 xl:w-auto xl:flex-shrink-0 xl:flex-col xl:justify-start xl:gap-2 xl:border-0 xl:pt-0">
              <div className="w-11 h-11 xl:w-16 xl:h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-orange-600 group-hover:border-indigo-200 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-sm">
                <svg className="w-6 h-6 xl:w-8 xl:h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </div>
              <span className="text-xs font-bold text-slate-400 group-hover:text-orange-500 transition-colors">View Profile</span>
            </div>
          </div>
        </AnimatedBentoCard>
      </main>

      {/* --- プロジェクト詳細モーダル ---
          中身は slug ごとの詳細コンポーネント（slot）に委譲する。
          作品ごとに表現が違うため、共通テンプレートには押し込めていない。 */}
      {works.map((work) => {
        const Detail = workDetails[work.slug];
        if (!Detail) return null;
        return (
          <Modal
            key={work.slug}
            title={work.modalTitle}
            isOpen={selectedProject === work.slug}
            onClose={() => setSelectedProject(null)}
          >
            <Detail />
          </Modal>
        );
      })}

      <footer className="py-12 text-center">
        <p className="text-slate-400 text-xs font-mono">
          &copy; {new Date().getFullYear()} MAKINO YUIKI. All rights reserved. <br/>
          Built with Next.js, Tailwind CSS & React Three Fiber.
        </p>
      </footer>
    </div>
  );
}

// --- Helper Components ---


function SocialButton({ href, label }: { href: string; label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow active:scale-95"
    >
      {label}
    </a>
  );
}

// アコーディオン機能を持たせたタイムラインのラッパーコンポーネント
function ExpandableTimelineItem({ date, title, org, type, isCurrent, children }: { date: string, title: string, org?: string, type?: "cert" | "work" | "edu", isCurrent?: boolean, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -20px 0px" }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="snap-start my-4 mx-2 rounded-xl transition-[background-color,transform,box-shadow,border-color] duration-300 hover:bg-emerald-50/40 hover:translate-x-1 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] border border-transparent hover:border-emerald-200 group/expand relative"
    >
      {/* クリック領域をカード全体に広げる透明ボタン */}
      <button onClick={() => setIsOpen(!isOpen)} className="absolute inset-0 w-full h-full z-10 cursor-pointer focus:outline-none" aria-label="Toggle details"></button>

      {/* コンテンツ領域 */}
      <div className="relative z-0 p-3 pointer-events-none">
        
        {/* 右上の矢印アイコン (テキストなし) */}
        <div className="absolute right-2 top-3 text-slate-300 group-hover/expand:text-emerald-500 transition-transform duration-300 z-20">
          <motion.svg 
            animate={{ rotate: isOpen ? 180 : 0 }} 
            className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </div>

        <TimelineItem date={date} title={title} org={org} type={type} isCurrent={isCurrent}>
          {/* クリックで開く詳細コンテンツ */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                {/* 開いたエリアに少し背景色をつけて「インナーカード」っぽくする */}
                <div className="mt-3 pt-3 border-t border-emerald-100/50">
                  {children}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TimelineItem>
      </div>
    </motion.div>
  );
}

function TimelineItem({ date, title, org, children, icon, isCurrent, type }: { date: string, title: string, org?: string, children?: ReactNode, icon?: string, isCurrent?: boolean, type?: "cert" | "work" | "edu" }) {
  return (
    <div className="relative pl-6 pb-6 border-l-2 border-slate-100 last:border-0 last:pb-0 hover:border-green-200 transition-colors group/item">
      
      {/* --- タイムラインの丸ポチ --- */}
      <div 
        className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white box-content z-10 transition-all duration-300 group-hover/item:scale-110
          ${isCurrent 
            ? 'bg-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.1)]' 
            : type === 'cert' 
              ? 'bg-amber-400' 
              : 'bg-slate-300 group-hover/item:bg-green-400'
          }`} 
      />
      
      {/* --- 日付 & ステータスバッジ --- */}
      <div className="flex flex-wrap items-center gap-x-2 mb-1">
        <span className="font-mono text-xs text-slate-400 font-bold transition-colors">
          {date}
        </span>
        {isCurrent && (
          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold tracking-wider">
            CURRENT
          </span>
        )}
      </div>
      
      {/* --- タイトル --- */}
      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2 group-hover/item:text-emerald-600 transition-colors">
        {icon && <span>{icon}</span>}
        {title}
      </h4>

      {/* --- 所属・組織名 --- */}
      {org && (
        <div className="text-xs text-slate-500 font-medium mt-0.5">
          {org}
        </div>
      )}
      
      {/* --- 詳細説明 --- */}
      {children && (
        <div className="mt-2 text-xs text-slate-600 leading-relaxed opacity-80 group-hover/item:opacity-100 transition-opacity">
          {children}
        </div>
      )}
    </div>
  );
}


//メールアドレススパム対策のため、ユーザ名とドメインを分割して渡すコンポーネント
function ContactButton({ user, domain, label }: { user: string; domain: string; label: string }) {
  return (
    <button 
      onClick={() => { window.location.href = `mailto:${user}@${domain}`; }}
      className="px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow active:scale-95"
    >
      {label}
    </button>
  );
}