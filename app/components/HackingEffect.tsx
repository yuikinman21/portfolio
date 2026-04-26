'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- エフェクト専用の文字化けコンポーネント ---
const CYBER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

function HackedText({ text, className }: { text: string; className?: string }) {
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
    }, 30);
    return () => clearInterval(intervalRef.current!);
  }, [text]);

  return <span className={className}>{displayText}</span>;
}

// --- メインのエフェクトコンポーネント ---
type Props = {
  isActive: boolean;
  onComplete: () => void;
};

export default function HackingEffect({ isActive, onComplete }: Props) {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (!isActive) return;

    if (timeLeft === 0) {
      onComplete(); // 親(page.tsx)に完了を知らせる
      setTimeLeft(5); // 次回のためにリセット
      return;
    }

    const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timerId);
  }, [isActive, timeLeft, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 h-[100dvh] z-[9999] bg-black text-red-500 flex flex-col items-center justify-center overflow-hidden font-mono pointer-events-auto"
        >
          {/* 背景のHexコード */}
          <div className="absolute inset-0 opacity-20 pointer-events-none text-[10px] sm:text-xs break-all overflow-hidden leading-tight p-4">
            {Array.from({ length: 50 }).map((_, i) => (
              <span key={i}>
                0x4F 0x2A 0x8B 0x11 0xFA 0xC3 0x9D 0x22 0x7E 0x55 0xB4 0x00 0x1A 0x99 0xDF 0x44 0x8C 0x31 0xEE 0x77{" "}
              </span>
            ))}
          </div>

          {/* メインの警告メッセージ */}
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="relative z-10 text-center space-y-6 bg-black/80 p-8 md:p-12 rounded-xl border border-red-900 shadow-[0_0_80px_rgba(220,38,38,0.4)] backdrop-blur-sm mx-4"
          >
            <h1 className="text-4xl md:text-7xl font-black mb-4 tracking-tighter text-red-600">
              <HackedText text="FILES ENCRYPTED" />
            </h1>
            <p className="text-lg md:text-2xl text-red-400 font-bold">
              <HackedText text="YOUR DATA HAS BEEN COMPROMISED." />
            </p>
            
            <div className="w-full h-px bg-red-900/50 my-6" />

            <div className="text-2xl md:text-4xl font-bold animate-pulse text-red-500 mt-8">
              System Restoring in: {timeLeft}s
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}