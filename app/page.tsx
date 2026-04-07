'use client';

import Image from "next/image";
import dynamic from 'next/dynamic';
import { useState, useEffect, useRef, MouseEvent } from 'react';
// アニメーション用ライブラリ
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import Modal from './components/Modal';

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
function AnimatedBentoCard({ children, className, delay = 0, href, ...props }: any) {
  const Component = href ? motion.a : motion.div;
  
  // マウス座標の管理
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <Component
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      className={`bento-card group relative overflow-hidden ${className}`}
      href={href}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {/* スポットライトエフェクト (背景) */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(99, 102, 241, 0.1),
              transparent 80%
            )
          `,
        }}
      />
      {/* コンテンツ */}
      <div className="relative h-full">
        {children}
      </div>
      
      {/* ボーダーを光らせるエフェクト */}
      <motion.div
         className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300"
         style={{
           border: "1px solid rgba(99, 102, 241, 0.2)",
           maskImage: useMotionTemplate`
             radial-gradient(
               300px circle at ${mouseX}px ${mouseY}px,
               black,
               transparent
             )
           `,
           WebkitMaskImage: useMotionTemplate`
             radial-gradient(
               300px circle at ${mouseX}px ${mouseY}px,
               black,
               transparent
             )
           `,
         }}
      />
    </Component>
  );
}

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const homeOsImagesV1 = [
    "/My_Room_OS4.jpg", 
    "/My_Room_OS3.jpg",
  ];
  
  const homeOsImagesV2 = [
    "/Home_OS_2.0.1_0.png",
    "/Home_OS_2.0.1.png",
    "/Home_OS_2.0.1_mobile_1.png",
    "/Home_OS_2.0.1_mobile_2.png",
    "/Home_OS_2.0.1_mobile_3.png",
  ];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [homeOsTab, setHomeOsTab] = useState<'v1' | 'v2'>('v1');

  const activeImages = homeOsTab === 'v1' ? homeOsImagesV1 : homeOsImagesV2;
  // 次の画像へ
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % activeImages.length);
  };

  // 前の画像へ
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + activeImages.length) % activeImages.length);
  };

  // モーダルを閉じたときにインデックスをリセットしたければ追加（任意）
  useEffect(() => {
    setCurrentImageIndex(0);
    if (selectedProject === null) {
      setCurrentImageIndex(0);
      setHomeOsTab('v2');
    }
  }, [selectedProject, homeOsTab]);

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
          <SocialButton href="mailto:yuikinman21@gmail.com" label="Contact" />
        </motion.div>
      </header>

      {/* --- Bento Grid Layout --- */}
      <main className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]">
        
        {/* 1. Profile Image Card */}
        <AnimatedBentoCard delay={0.1} className="md:col-span-3 lg:col-span-2 md:row-span-2 min-h-[350px] flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-50 to-white group relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none" />
          
          {/* ↓↓↓ className末尾に "mx-auto" を追加しました ↓↓↓ */}
          <div className="relative z-10 w-56 h-56 md:w-64 md:h-64 shadow-2xl shadow-indigo-100 rounded-full overflow-hidden border-[6px] border-white transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2 mx-auto">
            <Image
              src="/サーキュラー8bit.jpg"
              alt="YUIKI Profile Icon"
              fill
              className="object-cover"
              // style={{objectPosition: '45% 50%'}}
              priority
            />
          </div>
          <div className="mt-8 text-center space-y-1 relative z-10">
            <h2 className="text-3xl font-bold text-slate-800">YUIKI MAKINO</h2>
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
            将来的にはIoTやMaaS関連の研究開発に携わりたいと考えています。<br />
            現在は、アルバイトで中高生にPythonやBlenderなどを教えながら、家にIoT機器などを導入してスマートホームの構築をしたり、大学院進学に向けて勉強をしたりしています。
          </p>
        </AnimatedBentoCard>

        {/* 3. 3D Showcase (02. 3D WORKS) */}
        <AnimatedBentoCard delay={0.3} className="md:col-span-3 lg:col-span-2 md:row-span-2 min-h-[300px] relative group bg-slate-900 overflow-hidden border-slate-800">
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
        <AnimatedBentoCard delay={0.4} className="md:col-span-3 lg:col-span-1 p-6">
          <Label text="03. TIMELINE" color="green" />
          <div className="space-y-3">
            <TimelineItem 
              date="2026.04" 
              title="ファイナンシャル・プランニング技能士3級 (FP3級)" 
              org="日本FP協会"
              type="cert"
            />

            <TimelineItem 
              date="2025.10" 
              title="応用情報技術者 (AP)" 
              org="情報処理推進機構 (IPA)"
              type="cert"
            />

            <TimelineItem
              date="2025.09 - Present"
              title="研究室配属"
              org="知的ネットワーキング研究グループ"
              isCurrent
              type="edu"
            />

            <TimelineItem 
              date="2025.07" 
              title="基本情報技術者 (FE)" 
              org="情報処理推進機構 (IPA)"
              type="cert"
            />
            <TimelineItem
              date="2023.04 - Present"
              title="大阪公立大学 工学部 情報工学科"
              org="Osaka Metropolitan University"
              isCurrent
              type="edu"
            />
            <TimelineItem
              date="2020.04 - 2023.03"
              title="京都市立西京高等学校 エンタープライジング科"
              org="Kyoto Saikyo High School"
              type="edu"
            />

          </div>
          {/* <div className="pt-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-mono mb-2 uppercase tracking-wider">Focus</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded"> TOEIC</span>
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded"> NW</span>
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded"> SC</span>
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded"> Web Application</span>
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded"> 3D Modeling</span>
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded"> IoT</span>
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded"> Building-OS</span>
            </div>
          </div> */}
        </AnimatedBentoCard>
        

        {/* 5. Tech Stack */}
        <AnimatedBentoCard delay={0.5} className="md:col-span-6 lg:col-span-1 p-6">
          <Label text="04. Tech Stack & Focus" color="blue" />
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-[10px] text-slate-400 font-mono mb-2 uppercase tracking-wider">Languages & Frameworks</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "C", "C++", "Java", "Python", "Processing",
                  "JavaScript", "TypeScript", "Next.js", "Tailwind CSS",
                  "HTML5", "CSS3", "GAS", "VBA", "Dart", "Swift"
                ].map(tech => (
                  <TechTag key={tech} color="bg-blue-50 text-blue-700 border-blue-100">{tech}</TechTag>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-mono mb-2 uppercase tracking-wider">Tools & Creative</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Blender","GIMP","DaVinci Resolve", "AviUtl", "VSCode",
                  "Git", "GitHub", "Vercel", "Docker", "Canva", "Flutter"
                ].map(tool => (
                  <TechTag key={tool} color="bg-purple-50 text-purple-700 border-purple-100">{tool}</TechTag>
                ))}
              </div>
            </div>
            <div className="w-full h-px bg-slate-200" />
            <div>
              <p className="text-[10px] text-slate-400 font-mono mb-2 uppercase tracking-wider">Focus</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "TOEIC","NW","SC", "FP", "Web Application", "3D Modeling", "IoT",
                  "Building-OS", "Cybersecurity", "MaaS", "Smart Home"
                ].map(tool => (
                  <TechTag key={tool} color="bg-orange-50 text-orange-700 border-orange-100">{tool}</TechTag>
                ))}
              </div>
            </div>
          </div>

        </AnimatedBentoCard>

        {/* 6. Home OS */}
        <AnimatedBentoCard delay={0.6} className="md:col-span-6 lg:col-span-2 lg:row-span-2 p-8 flex flex-col justify-between group hover:border-cyan-300 bg-gradient-to-br from-cyan-50/50 to-white transition-colors cursor-pointer"
          onClick={() => setSelectedProject('homeos')}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label text="05. Home LAB" color="cyan" /> {/* 色はLabelコンポーネントの定義に合わせて調整してください */}
              <span className="inline-flex items-center gap-1.5 bg-cyan-100 text-cyan-700 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                NOW STUDYING
              </span>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-slate-800 group-hover:text-cyan-600 transition-colors">
                Home OS 2.0
              </h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                自宅環境を統合管理するシステムの構築<br/>
                クリックして詳細を見ることができます。<br/>
              </p>
            </div>
          </div>

          <div className="w-full my-6 relative rounded-xl overflow-hidden border border-slate-200/60 shadow-sm group-hover:shadow-md transition-shadow duration-500 pointer-events-none flex flex-col">
            {/* 画像*/}
            <div className="relative w-full aspect-video bg-slate-900 overflow-hidden">
              <Image 
                src="/Home_OS_2.0.1.png"
                alt="Home OS Dashboard Mockup"
                fill
                className="object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent pointer-events-none"></div>
            </div>
          </div>

          <div className="mt-2 relative z-10 pointer-events-none">
            {/* 使用技術スタック */}

            <div className="flex items-center justify-between border-t border-cyan-100/50 pt-4">
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] bg-white border border-cyan-100 text-cyan-600 px-2 py-1 rounded font-mono">Docker</span>
                <span className="text-[10px] bg-white border border-cyan-100 text-cyan-600 px-2 py-1 rounded font-mono">Grafana</span>
                <span className="text-[10px] bg-white border border-cyan-100 text-cyan-600 px-2 py-1 rounded font-mono">Ubuntu</span>
                <span className="text-[10px] bg-white border border-cyan-100 text-cyan-600 px-2 py-1 rounded font-mono">Python</span>
                <span className="text-[10px] bg-white border border-cyan-100 text-cyan-600 px-2 py-1 rounded font-mono">Node-RED</span>
                <span className="text-[10px] bg-white border border-cyan-100 text-cyan-600 px-2 py-1 rounded font-mono">Flutter</span>
                <span className="text-[10px] bg-white border border-cyan-100 text-cyan-600 px-2 py-1 rounded font-mono">Dart</span>
              </div>

              <div className="w-10 h-10 rounded-full bg-white border border-cyan-200 flex items-center justify-center text-cyan-400 group-hover:text-cyan-600 group-hover:scale-110 transition-all shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              </div>
            </div>
          </div>
        </AnimatedBentoCard>

        {/* 7. New Project Card (白鷺祭用語集) */}
        <AnimatedBentoCard delay={0.7} className="md:col-span-3 lg:col-span-2 p-8 flex flex-col justify-between group hover:border-pink-300 bg-gradient-to-br from-pink-50/50 to-white transition-colors cursor-pointer"
          onClick={() => setSelectedProject('shirasagisai')}
        >
          <div className="space-y-3 pointer-events-none">
            <div className="flex items-center justify-between">
              <Label text="06. PROJECT" color="pink" />
              <span className="inline-flex items-center gap-1.5 bg-pink-100 text-pink-600 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                NOW BUILDING
              </span>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-slate-800 group-hover:text-pink-600 transition-colors">
                白鷺祭用語集
              </h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                実行委員向けの用語まとめサイト<br/>
                クリックして詳細やスライドを見ることができます。<br/>
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-pink-100/50 pt-4 pointer-events-none">
            <div className="flex gap-2">
               <span className="text-[10px] bg-white border border-pink-100 text-pink-500 px-2 py-1 rounded">Next.js</span>
               <span className="text-[10px] bg-white border border-pink-100 text-pink-500 px-2 py-1 rounded">Vercel</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white border border-pink-200 flex items-center justify-center text-pink-400 group-hover:text-pink-600 group-hover:scale-110 transition-all shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
            </div>
          </div>
        </AnimatedBentoCard>

        {/* 8. IoTセキュリティ研究 (右下: 1マス分配置) - 新規追加 */}
        <AnimatedBentoCard delay={0.8} className="md:col-span-3 lg:col-span-2 p-8 flex flex-col justify-between group hover:border-purple-300 bg-gradient-to-br from-purple-50/50 to-white transition-colors cursor-pointer"
          onClick={() => setSelectedProject('iot')}
        >
          <div className="space-y-2 pointer-events-none">
            <div className="flex items-center justify-between">
              <Label text="07. PRE-RESEARCH" color="purple" />
              <span className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                NOW RESEARCHING
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                IoTマルウェアの通信分析
              </h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                機械学習を用いたスマートホームデバイスの脅威検知<br/>
                各マルウェアの通信特徴を分析し、異常検知・マルウェア識別モデルを構築<br/>
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-purple-100/50 pt-4 pointer-events-none">
            <div className="flex gap-2">
              <span className="text-[10px] bg-white border border-purple-100 text-purple-500 px-2 py-1 rounded">Python</span>
              <span className="text-[10px] bg-white border border-purple-100 text-purple-500 px-2 py-1 rounded">Network Security</span>
              <span className="text-[10px] bg-white border border-purple-100 text-purple-500 px-2 py-1 rounded">Machine Learning</span>
              <span className="text-[10px] bg-white border border-purple-100 text-purple-500 px-2 py-1 rounded">Packet Analysis</span>

            </div>
            <div className="w-10 h-10 rounded-full bg-white border border-purple-200 flex items-center justify-center text-purple-400 group-hover:text-purple-600 group-hover:scale-110 transition-all shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
            </div>
          </div>
        </AnimatedBentoCard>


        {/* 8. GitHub Link */}
        <AnimatedBentoCard delay={0.9} href="https://github.com/yuikinman21" target="_blank" rel="noopener noreferrer" className="md:col-span-6 lg:col-span-4 p-8 flex items-center group hover:border-slate-300 bg-slate-50 transition-colors cursor-pointer">

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 w-full h-full">
            {/* 左側：テキスト情報 */}
            <div className="relative z-10 w-full md:w-auto md:flex-1 min-w-[200px]">
              <Label text="07. REPOSITORY" color="orange" />
              <h3 className="text-3xl font-bold text-slate-800 mt-2 group-hover:text-orange-600 transition-colors">
                @yuikinman21
              </h3>
              <p className="text-slate-500 text-sm mt-2 max-w-md leading-relaxed">
                ソースコードや開発ログはこちらから<br/>
              </p>
            </div>
              {/* 中央：GitHub Contributions グラフ */}
            <div className="hidden md:flex flex-[2] justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-500">
              <img 
                src="https://github-contributions-api.deno.dev/yuikinman21.svg" 
                alt="GitHub Contributions" 
                className="w-full h-auto object-contain max-h-[130px] transform scale-100 origin-center"
              />
            </div>

            {/* 右側：アイコンとCTAボタン */}
            <div className="relative z-10 flex flex-col items-center gap-2 flex-shrink-0 mx-auto md:mx-0">
              <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-orange-600 group-hover:border-indigo-200 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-sm">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </div>
              <span className="text-xs font-bold text-slate-400 group-hover:text-orange-500 transition-colors">View Profile</span>
            </div>
          </div>
        </AnimatedBentoCard>
      </main>

      {/* --- プロジェクト詳細モーダル --- */}
      

      {/* 1. Home OSのモーダル*/}
      <Modal 
        title="Home OS 2.0"
        isOpen={selectedProject === 'homeos'} 
        onClose={() => setSelectedProject(null)} 
      >
        <div className="flex flex-col md:flex-row w-full h-full min-h-[60vh]">
          {/* 左側: 画像 */}
        <div className="w-full md:w-3/5 bg-slate-100 relative min-h-[300px] flex items-center justify-center p-4 md:p-8 overflow-hidden">
           
          {/* 画像表示部分 (AnimatePresenceでフェード切替) */}
          <div className="relative w-full h-full max-h-[400px] aspect-[4/3] rounded-xl overflow-hidden shadow-sm bg-white border border-slate-200">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImages[currentImageIndex]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
              >
                <Image 
                  src={activeImages[currentImageIndex]}
                  alt={`Home OS Slide ${currentImageIndex + 1}`}
                  fill 
                  className="object-contain p-1" 
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* --- ナビゲーションボタン (画像が2枚以上ある時のみ表示) --- */}
          {activeImages.length > 1 && (
            <>
              {/* 左ボタン */}
              <button 
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md backdrop-blur-sm transition-transform hover:scale-110 z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>

              {/* 右ボタン */}
              <button 
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md backdrop-blur-sm transition-transform hover:scale-110 z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>

              {/* インジケーター (下部の点) */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {activeImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all shadow-sm ${
                      idx === currentImageIndex ? "bg-indigo-600 w-4" : "bg-white/60 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

          {/* 右側: 詳細情報 */}
          <div className="w-full md:w-2/5 bg-white p-6 lg:p-8 flex flex-col overflow-y-auto relative">
             
            {/* ★ タブ切り替えトグルUI ★ */}
            <div className="flex bg-slate-100 p-1 rounded-full mb-2 w-full max-w-[280px] relative isolate">
              <button 
                onClick={() => setHomeOsTab('v1')}
                className={`relative flex-1 text-[11px] font-bold py-2.5 px-4 rounded-full transition-colors duration-300 z-10 ${homeOsTab === 'v1' ? 'text-cyan-800' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {homeOsTab === 'v1' && (
                  <motion.div layoutId="homeOsTabBg" className="absolute inset-0 bg-white rounded-full shadow-sm -z-10" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
                )}
                v1.0 Overview
              </button>

              <button 
                onClick={() => setHomeOsTab('v2')}
                className={`relative flex-1 text-[11px] font-bold py-2.5 px-4 rounded-full transition-colors duration-300 flex items-center justify-center gap-1 z-10 ${homeOsTab === 'v2' ? 'text-white' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {homeOsTab === 'v2' && (
                  <motion.div layoutId="homeOsTabBg" className="absolute inset-0 bg-cyan-600 rounded-full shadow-sm -z-10" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
                )}
                v2.0 Update <span className="text-yellow-300">✨</span>
              </button>
            </div>

            {/* ★ アニメーション付きコンテンツエリア ★ */}
            <div className="relative flex-1">
              <AnimatePresence mode="wait">
                {homeOsTab === 'v1' ? (
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
                        <TechTag color="bg-cyan-100 text-cyan-600 border-cyan-200">Docker</TechTag>
                        <TechTag color="bg-cyan-100 text-cyan-600 border-cyan-200">Ubuntu</TechTag>
                        <TechTag color="bg-cyan-100 text-cyan-600 border-cyan-200">Grafana</TechTag>
                        <TechTag color="bg-cyan-100 text-cyan-600 border-cyan-200">Python</TechTag>
                        <TechTag color="bg-cyan-100 text-cyan-600 border-cyan-200">Node-RED</TechTag>
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
                        フロントエンドを<b>Flutter</b>で完全再構築。<br/><br/>
                        これにより、従来の<b>Grafana</b>による「表示」から、ダッシュボード上での「操作」へと進化。<br/>
                        操作性豊かなUIへの変更により、さらに直感的に分かりやすく理解できるようになった。<br/>
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">v2.0 New Stack</h3>
                      <div className="flex flex-wrap gap-2">
                        <TechTag color="bg-cyan-100 text-cyan-600 border-cyan-200">Flutter</TechTag>
                        <TechTag color="bg-cyan-100 text-cyan-600 border-cyan-200">Dart</TechTag>
                        
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Modal>

      {/* 2. 白鷺祭用語集のモーダル */}
      <Modal
        title="白鷺祭用語集"
        isOpen={selectedProject === 'shirasagisai'} 
        onClose={() => setSelectedProject(null)} 
      >
        {/* レイアウト修正: gridではなくflexを使用し、md以上で横並び、それ以下で縦並びにする */}
        <div className="flex flex-col md:flex-row w-full h-full min-h-[60vh]">
          
          {/* 左側: メインビジュアルエリア (幅: md以上で60%) */}
          <div className="w-full md:w-3/5 bg-slate-100 flex flex-col items-center justify-center p-6 lg:p-10 relative gap-6">
              {/* Canva埋め込み */}
            <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-white border border-slate-200">
              <iframe 
                loading="lazy" 
                className="w-full h-full border-none"
                src="https://www.canva.com/design/DAG7xpWBnqk/UCJfIcK7AX7x_E11GjpSkw/view?embed" 
                allowFullScreen 
                allow="fullscreen"
              ></iframe>
            </div>

            <a 
              href="https://www.canva.com/design/DAG7xpWBnqk/UCJfIcK7AX7x_E11GjpSkw/view?utm_content=DAG7xpWBnqk&utm_campaign=designshare&utm_medium=embeds&utm_source=link" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-600 rounded-full text-xs font-bold shadow-sm border border-slate-200 hover:text-pink-600 hover:border-pink-200 hover:shadow-md transition-all duration-300"
            >
              <span>別のタブで開く</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>

          </div>

          {/* 右側: 詳細情報エリア (幅: md以上で40%) */}
          <div className="w-full md:w-2/5 bg-white p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto">
             
            {/* タイトルエリア */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full tracking-wide">NOW BUILDING</span>
                <span className="text-slate-400 text-xs font-mono">2025.11-Current</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight leading-tight">
                白鷺祭用語集
              </h2>
            </div>

            {/* 概要 Section */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">概要</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                大学祭実行委員のための用語まとめサイトです。<br/>
                白鷺祭の準備や運営を円滑にするためのリソースを提供することを目的に、実行委員会のメンバーと共同開発を行いました。
                リンク先はサンプルサイトですが、実際の運用ではVercel上にデプロイされた本番環境で使用されています。<br/>
              </p>
            </div>

            {/* 担当 Section (新規追加) */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">担当</h3>
              <p className="text-sm text-slate-800 font-medium">
                リードエンジニア / UIデザイン
              </p>
              <p className="text-xs text-slate-500 mt-1">
                要件定義から実装、Vercelへのデプロイまでを一貫して担当。実行委員会のメンバーと連携し、使いやすさを重視したUIを設計しました。
              </p>
            </div>

            {/* 使用技術 Section */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">使用技術</h3>
              <div className="flex flex-wrap gap-2">
                <TechTag color="bg-pink-100 text-pink-600 border-pink-200">Next.js</TechTag>
                <TechTag color="bg-pink-100 text-pink-600 border-pink-200">Vercel</TechTag>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="mt-auto pt-6">
              <a 
                href="https://shirasagi-sai-git-sample-yuikis-projects.vercel.app/" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-pink-600 transition-colors text-sm shadow-md"
              >
                <span>サンプルサイトを見る</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          </div>
        </div>
      </Modal>

      {/* 3. IoTセキュリティ研究のモーダル*/}
      <Modal 
        title="IoTマルウェアの通信分析"
        isOpen={selectedProject === 'iot'} 
        onClose={() => setSelectedProject(null)} 
      >
        <div className="flex flex-col md:flex-row w-full h-full min-h-[60vh]">
          {/* 左側: ビジュアルエリア */}
          <div className="w-full md:w-3/5 bg-slate-100 flex flex-col items-center justify-center p-6 lg:p-10 relative gap-6">
              {/* Canva埋め込み */}
            <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-white border border-slate-200">
              <iframe 
                loading="lazy" 
                className="w-full h-full border-none"
                src="https://www.canva.com/design/DAHCJZi458Y/mzojWOXa0asjUIGbfKOOcw/view?embed" 
                allowFullScreen 
                allow="fullscreen"
              ></iframe>
            </div>

            <a 
              href="https://www.canva.com/design/DAHCJZi458Y/D5pKPXqx5wr8eBM6YmTShg/view?utm_content=DAHCJZi458Y&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h0f81bba7c7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-600 rounded-full text-xs font-bold shadow-sm border border-slate-200 hover:text-purple-600 hover:border-purple-200 hover:shadow-md transition-all duration-300"
            >
              <span>別のタブで開く</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>

          </div>

          {/* 右側: 詳細情報 */}
          <div className="w-full md:w-2/5 bg-white p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto">
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
                 <TechTag color="bg-purple-50 text-purple-700 border-purple-200">Network Security</TechTag>
                 <TechTag color="bg-purple-50 text-purple-700 border-purple-200">Machine Learning</TechTag>
                 <TechTag color="bg-purple-50 text-purple-700 border-purple-200">Packet Analysis</TechTag>
                 <TechTag color="bg-purple-50 text-purple-700 border-purple-200">Python</TechTag>
               </div>
             </div>
          </div>
        </div>
      </Modal>
      

      <footer className="py-12 text-center">
        <p className="text-slate-400 text-xs font-mono">
          &copy; {new Date().getFullYear()} YUIKI. All rights reserved. <br/>
          Built with Next.js, Tailwind CSS & React Three Fiber.
        </p>
      </footer>
    </div>
  );
}

// --- Helper Components ---

function Label({ text, color }: { text: string; color: "purple" | "blue" | "cyan" | "green" | "orange" | "indigo" | "white" | "pink" }) {
  const colors = {
    purple: "text-purple-600",
    blue: "text-blue-600",
    cyan: "text-cyan-600",
    green: "text-emerald-600",
    orange: "text-orange-600",
    indigo: "text-indigo-600",
    pink: "text-pink-600",
    white: "text-white/80",
  };
  return (
    <span className={`font-mono text-[10px] font-bold tracking-widest ${colors[color]} mb-2 block uppercase`}>
      {text}
    </span>
  );
}

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

function TimelineItem({ date, title, org, children, icon, isCurrent, type }: { date: string, title: string, org?: string, children?: ReactNode, icon?: string, isCurrent?: boolean, type?: "cert" | "work" | "edu" }) {
  return (
        <div className="relative pl-6 pb-6 border-l-2 border-slate-100 last:border-0 last:pb-0 hover:border-indigo-200 transition-colors group">
      
      {/* --- タイムラインの丸ポチ (TimelineItemのステータス円を拡張) --- */}
      <div 
        className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white box-content z-10 transition-all duration-300 group-hover:scale-110
          ${isCurrent 
            ? 'bg-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.1)]' // 現在進行形は緑の光
            : type === 'cert' 
              ? 'bg-amber-400' // 資格は黄色
              : 'bg-slate-300 group-hover:bg-indigo-400' // 過去の経歴はグレー→ホバーで紫
          }`} 
      />
      
      {/* --- 日付 & ステータスバッジ --- */}
      <div className="flex flex-wrap items-center gap-x-2 mb-1">
        <span className="font-mono text-xs text-slate-400 font-bold group-hover:text-indigo-500 transition-colors">
          {date}
        </span>
        {isCurrent && (
          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold tracking-wider">
            CURRENT
          </span>
        )}
      </div>
      
      {/* --- タイトル (TimelineItemのデザインを継承) --- */}
      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
        {icon && <span>{icon}</span>}
        {title}
      </h4>

      {/* --- 所属・組織名 (新規追加) --- */}
      {org && (
        <div className="text-xs text-slate-500 font-medium mt-0.5">
          {org}
        </div>
      )}
      
      {/* --- 詳細説明 (childrenで柔軟に記述可能) --- */}
      {children && (
        <div className="mt-2 text-xs text-slate-600 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
          {children}
        </div>
      )}
    </div>
  );
}

function TechTag({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className={`px-2.5 py-1 rounded text-[11px] font-bold border ${color} transition-transform hover:-translate-y-0.5 cursor-default`}>
      {children}
    </span>
  );
}