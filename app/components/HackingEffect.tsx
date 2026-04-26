'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CYBER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

function HackedText({ text, speed = 30 }: { text: string, speed?: number }) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let iteration = 0;
    intervalRef.current = setInterval(() => {
      setDisplayText((prev) =>
        text.split("").map((char, index) => {
          if (index < iteration) return text[index];
          return CYBER_CHARS[Math.floor(Math.random() * CYBER_CHARS.length)];
        }).join("")
      );
      if (iteration >= text.length) clearInterval(intervalRef.current!);
      iteration += 1 / 3;
    }, speed);
    return () => clearInterval(intervalRef.current!);
  }, [text, speed]);

  return <span>{displayText}</span>;
}

type Props = {
  isActive: boolean;
  onComplete: () => void;
};

export default function HackingEffect({ isActive, onComplete }: Props) {
  const [phase, setPhase] = useState<'idle' | 'corrupting' | 'locked' | 'unlocking'>('idle');
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);

  useEffect(() => {
    if (isActive) {
      setPhase('corrupting');
      const t = setTimeout(() => setPhase('locked'), 4000);
      return () => clearTimeout(t);
    } else {
      setPhase('idle');
      setInputCode('');
    }
  }, [isActive]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // パスコードを 'yuikinman21' に変更
    if (inputCode.toLowerCase() === 'yuikinman21') {
      setPhase('unlocking');
      setTimeout(() => {
        onComplete();
      }, 2500);
    } else {
      setErrorMsg(true);
      setTimeout(() => setErrorMsg(false), 1000);
      setInputCode('');
    }
  };

  return (
    <AnimatePresence>
      {isActive && phase !== 'idle' && (
        <div id="hack-container" className="fixed inset-0 w-screen h-[100dvh] z-[9999] flex items-center justify-center pointer-events-auto">
          
          {/* --- バグ演出フェーズのみ魔法のCSSを適用 --- */}
          {phase === 'corrupting' && (
            <style>{`
              body { overflow: hidden !important; }
              header, main, footer {
                animation: screen-glitch 0.2s infinite !important;
                pointer-events: none !important;
              }
              header *, main *, footer * {
                font-family: 'Courier New', Courier, monospace !important;
                color: #ef4444 !important;
                text-shadow: 2px 0px 0px rgba(255,0,0,0.8), -2px 0px 0px rgba(0,0,255,0.8) !important;
                border-color: #ef4444 !important;
                background-color: rgba(0,0,0,0.1) !important;
              }
              @keyframes screen-glitch {
                0% { filter: hue-rotate(0deg) contrast(1.2); transform: translate(1px, 0px); }
                20% { filter: hue-rotate(90deg) contrast(1.5); transform: translate(-1px, 0px); }
                40% { filter: hue-rotate(180deg) contrast(1.1); transform: translate(0px, 1px); }
                60% { filter: hue-rotate(270deg) contrast(2) invert(0.8); transform: translate(0px, -1px); }
                80% { filter: hue-rotate(300deg) contrast(1.2); transform: translate(1px, 0px); }
                100% { filter: hue-rotate(360deg) contrast(1.2); transform: translate(0, 0); }
              }
            `}</style>
          )}

          {phase === 'corrupting' && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 30 }).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute text-red-500 font-mono text-xl md:text-3xl font-black mix-blend-difference drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]"
                  style={{ 
                    top: `${Math.random() * 100}%`, 
                    left: `${Math.random() * 100}%`,
                    animation: `pulse ${Math.random() * 0.5 + 0.1}s infinite alternate`
                  }}
                >
                  <HackedText text={`FATAL_ERR_0x${Math.floor(Math.random()*999999).toString(16).toUpperCase()}`} speed={40} />
                </div>
              ))}
            </div>
          )}

          {/* --- ロック画面（モダンで人間らしいデザインに変更） --- */}
          {(phase === 'locked' || phase === 'unlocking') && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center p-4"
            >
              {phase === 'locked' ? (
                // --- 入力フォーム ---
                <div className="max-w-md w-full p-8 bg-white/90 border border-white/20 rounded-3xl shadow-2xl text-center">
                  <div className="w-14 h-14 mx-auto mb-4 text-indigo-500 bg-indigo-50 rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    <HackedText text="Authentication Required" />
                  </h2>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                    セキュリティシステムが作動しました。<br/>
                    解除するにはユーザーID（<span className="font-bold text-indigo-600">yuikinman21</span>）を入力してください。
                  </p>

                  <form onSubmit={handleUnlock} className="space-y-4">
                    <div className="relative">
                      <input 
                        type="text" 
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder="Enter User ID..."
                        className={`w-full bg-slate-50 border ${errorMsg ? 'border-red-400 bg-red-50 text-red-600' : 'border-slate-200'} text-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-center font-medium text-lg`}
                        autoFocus
                      />
                      {errorMsg && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="absolute -bottom-6 left-0 right-0 text-red-500 text-xs font-bold">
                          IDが正しくありません
                        </motion.p>
                      )}
                    </div>
                    
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors shadow-md mt-2">
                      アクセスを復元
                    </button>
                  </form>
                </div>
              ) : (
                // --- 解除成功画面 ---
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center bg-white/90 p-10 rounded-3xl shadow-2xl"
                >
                  <div className="w-16 h-16 mx-auto mb-4 text-green-500 bg-green-50 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    <HackedText text="Welcome Back!" />
                  </h2>
                  <p className="text-slate-500 text-sm">ポートフォリオを復元しています...</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}