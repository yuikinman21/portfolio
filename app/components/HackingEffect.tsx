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

          {/* --- ロック画面（ハッカー風のダークデザインに戻す） --- */}
          {(phase === 'locked' || phase === 'unlocking') && (
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center font-mono p-4"
            >
              {phase === 'locked' ? (
                // --- パスコード入力フォーム ---
                <div className="max-w-md w-full p-8 bg-black/80 border border-red-500/50 rounded-2xl shadow-[0_0_80px_rgba(220,38,38,0.3)] text-center">
                  <div className="w-16 h-16 mx-auto mb-6 text-red-500 animate-pulse">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-black text-red-500 mb-2 tracking-widest drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
                    <HackedText text="SYSTEM LOCKED" />
                  </h2>
                  <p className="text-red-400 text-sm mb-8 leading-relaxed">
                    セキュリティシステムが作動しました。<br/>
                    解除するにはユーザーID（<span className="font-bold text-red-500">yuikinman21</span>）を入力してください。
                  </p>

                  <form onSubmit={handleUnlock} className="space-y-4">
                    <div className="relative">
                      <input 
                        type="text" 
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder="Enter User ID..."
                        className={`w-full bg-slate-900 border ${errorMsg ? 'border-red-500 bg-red-950/30' : 'border-red-500/30'} text-red-500 px-4 py-4 rounded-xl focus:outline-none focus:border-red-500 transition-colors text-center tracking-widest font-bold text-lg`}
                        autoFocus
                      />
                      {errorMsg && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute -bottom-7 left-0 right-0 text-red-500 text-sm font-bold">
                          IDが正しくありません
                        </motion.p>
                      )}
                    </div>
                    
                    <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white border border-red-500 py-4 rounded-xl font-bold tracking-widest transition-colors text-lg mt-4 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                      アクセスを復元
                    </button>
                  </form>
                </div>
              ) : (
                // --- 解除成功画面 ---
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="w-24 h-24 mx-auto mb-6 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-emerald-400 mb-4 tracking-widest drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]">
                    <HackedText text="ACCESS GRANTED" />
                  </h2>
                  <p className="text-emerald-500 font-bold text-lg animate-pulse">ポートフォリオを復元しています...</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}