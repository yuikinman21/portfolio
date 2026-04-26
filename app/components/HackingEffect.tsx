'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 文字化けコンポーネント ---
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

// --- メインのエフェクトコンポーネント ---
type Props = {
  isActive: boolean;
  onComplete: () => void;
};

export default function HackingEffect({ isActive, onComplete }: Props) {
  // 演出のフェーズ管理: idle(待機) -> corrupting(バグ進行) -> locked(ロック画面) -> unlocking(解除中)
  const [phase, setPhase] = useState<'idle' | 'corrupting' | 'locked' | 'unlocking'>('idle');
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);

  // 発動時の進行タイマー
  useEffect(() => {
    if (isActive && phase === 'idle') {
      setPhase('corrupting'); // バグ演出開始
      // 2.5秒後にロック画面へ移行
      const t = setTimeout(() => setPhase('locked'), 2500);
      return () => clearTimeout(t);
    }
  }, [isActive, phase]);

  // パスコード解除の処理
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // パスコードを 'yuiki' に設定（大文字小文字区別なし）
    if (inputCode.toLowerCase() === 'yuiki') {
      setPhase('unlocking'); // 解除成功画面へ
      setTimeout(() => {
        setPhase('idle');
        setInputCode('');
        onComplete(); // page.tsxに終了を伝えて完全に消す
      }, 2500);
    } else {
      // パスコード間違い
      setErrorMsg(true);
      setTimeout(() => setErrorMsg(false), 1000);
      setInputCode('');
    }
  };

  return (
    <AnimatePresence>
      {isActive && phase !== 'idle' && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
          
          {/* --- フェーズ1: サイトが徐々にバグるエフェクト --- */}
          {phase === 'corrupting' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2.5, ease: "easeIn" }}
              // 背景を反転＆色を変えて、元のサイトを不気味に見せる
              className="absolute inset-0 bg-red-900/20 backdrop-invert backdrop-hue-rotate-90 pointer-events-none overflow-hidden"
            >
              {/* 元のサイトの上にランダムな文字化けエラーを散りばめる */}
              {Array.from({ length: 15 }).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute text-red-500 font-mono text-sm md:text-xl font-bold opacity-80 mix-blend-difference"
                  style={{ 
                    top: `${Math.random() * 100}%`, 
                    left: `${Math.random() * 100}%`,
                  }}
                >
                  <HackedText text={`ERR_0x${Math.floor(Math.random()*10000).toString(16).toUpperCase()}`} speed={50} />
                </div>
              ))}
            </motion.div>
          )}

          {/* --- フェーズ2 & 3: ロック画面 --- */}
          {(phase === 'locked' || phase === 'unlocking') && (
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center font-mono pointer-events-auto p-4"
            >
              {phase === 'locked' ? (
                // --- 入力フォーム（ロック中） ---
                <div className="max-w-md w-full p-8 bg-black/60 border border-red-500/30 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.15)] text-center">
                  <div className="w-16 h-16 mx-auto mb-6 text-red-500 animate-pulse">
                    {/* ロックアイコン */}
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  
                  <h2 className="text-3xl font-black text-red-500 mb-2 tracking-widest">
                    <HackedText text="SYSTEM LOCKED" />
                  </h2>
                  <p className="text-red-400/60 text-xs md:text-sm mb-8 leading-relaxed">
                    Unauthorized access detected.<br/>Enter the master passcode to decrypt.
                  </p>

                  <form onSubmit={handleUnlock} className="space-y-4">
                    <div className="relative">
                      <input 
                        type="password" 
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder="Passcode..."
                        className={`w-full bg-slate-900/50 border ${errorMsg ? 'border-red-500' : 'border-red-500/30'} text-red-500 px-4 py-3 rounded-lg focus:outline-none focus:border-red-500 transition-colors text-center tracking-widest font-bold`}
                        autoFocus
                      />
                      {errorMsg && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -bottom-6 left-0 right-0 text-red-500 text-xs font-bold">
                          ACCESS DENIED
                        </motion.p>
                      )}
                    </div>
                    
                    <button type="submit" className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 py-3 rounded-lg font-bold tracking-widest transition-colors text-sm mt-2">
                      DECRYPT
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
                  <div className="w-20 h-20 mx-auto mb-6 text-emerald-500">
                    {/* アンロックアイコン */}
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-black text-emerald-400 mb-2 tracking-widest drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                    <HackedText text="ACCESS GRANTED" />
                  </h2>
                  <p className="text-emerald-500/70 text-sm animate-pulse">System restoring...</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}