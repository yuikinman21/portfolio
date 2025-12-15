'use client';

import Image from "next/image";
import dynamic from 'next/dynamic';
import { useState, useEffect, useRef, MouseEvent } from 'react';
// アニメーション用ライブラリ
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

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
            <span className="text-indigo-600">ネットワーク</span>と<span className="text-purple-600">セキュリティ</span>を研究しながら、3Dモデル作成やWeb開発に挑戦中。
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3"
        >
          <SocialButton href="https://github.com/yuikinman21" label="GitHub" />
          <SocialButton href="mailto:sw23263n@st.omu.ac.jp" label="Contact" />
        </motion.div>
      </header>

      {/* --- Bento Grid Layout --- */}
      <main className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]">
        
        {/* 1. Profile Image Card */}
        <AnimatedBentoCard delay={0.1} className="md:col-span-3 lg:col-span-2 md:row-span-2 min-h-[350px] flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-50 to-white group relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none" />
          
          <div className="relative z-10 w-56 h-56 md:w-64 md:h-64 shadow-2xl shadow-indigo-100 rounded-full overflow-hidden border-[6px] border-white transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2">
            <Image
              src="/サーキュラー8bit.jpg"
              alt="YUIKI Profile Icon"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="mt-8 text-center space-y-1 relative z-10">
            <h2 className="text-3xl font-bold text-slate-800">YUIKI MAKINO</h2>
            <p className="text-slate-500 font-mono text-sm bg-slate-100 px-3 py-1 rounded-full inline-block">
              Osaka Metropolitan Univ. Student B3
            </p>
          </div>
        </AnimatedBentoCard>

        {/* 2. About Me */}
        <AnimatedBentoCard delay={0.2} className="md:col-span-3 lg:col-span-2 p-8 flex flex-col justify-center space-y-4">
          <Label text="01. WHO AM I" color="indigo" />
          <h3 className="text-xl font-bold text-slate-800 leading-snug">
            様々なことに挑戦中の<span className="text-indigo-600">大学生</span>です！
            <html lang="en">
            <head>
              <meta charSet="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Document</title>
            </head>
            <body>
              
            </body>
            </html>
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            フロントエンドからバックエンド、3Dモデリング、そして動画編集まで幅広く挑戦中の大学生。<br/>
            将来的にはIoTやMaaS関連の研究開発に携わりたいと考えています。<br />
            現在は、アルバイトで中学生にPythonやBlenderなどを教えながら、大学院進学に向けて勉強中です。
          </p>
        </AnimatedBentoCard>

        {/* 3. 3D Showcase (02. 3D WORKS) */}
        <AnimatedBentoCard delay={0.3} className="md:col-span-3 lg:col-span-2 md:row-span-2 min-h-[300px] relative group bg-slate-900 overflow-hidden border-slate-800">
          <div className="absolute top-6 left-6 z-20 pointer-events-none">
            <Label text="02. 3D WORKS" color="indigo" />
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

        {/* 4. Certifications */}
        <AnimatedBentoCard delay={0.4} className="md:col-span-3 lg:col-span-1 p-6 space-y-6">
          <Label text="03. STATUS" color="green" />
          <div className="space-y-3">
            <CertItem 
              title="応用情報技術者 (AP)" 
              date="2025.10" 
              status="pending"
              note="結果待ち"
            />
            <CertItem 
              title="基本情報技術者 (FE)" 
              date="2025.06" 
              status="certified" 
            />
          </div>
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-mono mb-2 uppercase tracking-wider">Focus</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded"> Web Application</span>
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded"> 3D Modeling</span>
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded"> TOEIC</span>
            </div>
          </div>
        </AnimatedBentoCard>

        {/* 5. Tech Stack */}
        <AnimatedBentoCard delay={0.5} className="md:col-span-6 lg:col-span-1 p-6">
          <Label text="04. SKILLS" color="blue" />
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-[10px] text-slate-400 font-mono mb-2 uppercase tracking-wider">Languages & Frameworks</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "C", "C++", "Java", "Python", "Processing",
                  "JavaScript", "TypeScript", "Next.js", "Tailwind CSS",
                  "HTML5", "CSS3", "GAS"
                ].map(tech => (
                  <TechTag key={tech} color="bg-blue-50 text-blue-700 border-blue-100">{tech}</TechTag>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-mono mb-2 uppercase tracking-wider">Tools & Creative</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Blender", "AviUtl", "VSCode",
                  "Git", "GitHub", "Vercel"
                ].map(tool => (
                  <TechTag key={tool} color="bg-purple-50 text-purple-700 border-purple-100">{tool}</TechTag>
                ))}
              </div>
            </div>
          </div>
        </AnimatedBentoCard>

        {/* 6. GitHub Link */}
        <AnimatedBentoCard delay={0.6} href="https://github.com/yuikinman21" target="_blank" rel="noopener noreferrer" className="md:col-span-3 lg:col-span-2 p-8 flex items-center justify-between group hover:border-slate-300 bg-slate-50 transition-colors cursor-pointer">
          <div>
            <Label text="05. REPOSITORY" color="orange" />
            <h3 className="text-2xl font-bold text-slate-800 mt-2 group-hover:text-indigo-600 transition-colors">
              Check my GitHub
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              ソースコードや開発ログはこちらから
            </p>
          </div>
          <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 group-hover:scale-110 transition-all duration-300 shadow-sm">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </div>
        </AnimatedBentoCard>

        {/* 7. New Project Card (白鷺祭用語集) */}
        <AnimatedBentoCard delay={0.7} href="https://shirasagi-sai.vercel.app/" target="_blank" rel="noopener noreferrer" className="md:col-span-3 lg:col-span-2 p-8 flex flex-col justify-between group hover:border-pink-300 bg-gradient-to-br from-pink-50/50 to-white transition-colors cursor-pointer">
          <div className="space-y-3">
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
                白鷺祭の準備や運営を円滑にするためのリソースを提供。<br />
                現在、実行委員OBのメンバーと共同開発中です。(リンク先はサンプルです)
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-pink-100/50 pt-4">
            <div className="flex gap-2">
               <span className="text-[10px] bg-white border border-pink-100 text-pink-500 px-2 py-1 rounded">React</span>
               <span className="text-[10px] bg-white border border-pink-100 text-pink-500 px-2 py-1 rounded">Vercel</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white border border-pink-200 flex items-center justify-center text-pink-400 group-hover:text-pink-600 group-hover:scale-110 transition-all shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </div>
          </div>
        </AnimatedBentoCard>

      </main>

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

function Label({ text, color }: { text: string; color: "purple" | "blue" | "green" | "orange" | "indigo" | "white" | "pink" }) {
  const colors = {
    purple: "text-purple-600",
    blue: "text-blue-600",
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

function CertItem({ title, date, status, note }: { title: string; date: string; status: "certified" | "pending"; note?: string }) {
  return (
    <div className="flex flex-col border-l-2 border-slate-100 pl-3 py-1 hover:border-indigo-400 transition-colors group">
      <div className="flex items-center gap-2">
        <span className="font-bold text-slate-700 text-sm group-hover:text-indigo-600 transition-colors">{title}</span>
        {status === "certified" ? (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        )}
      </div>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="font-mono text-xs text-slate-400">{date}</span>
        {note && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">{note}</span>}
      </div>
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