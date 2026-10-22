'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useEffect } from 'react';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
};

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    // モーダルが開いているときはスクロールを無効化
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // Esc キーでも閉じられるようにする（キーボード操作だけで抜け出せるように）
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className='fixed inset-0 h-[100dvh] bg-black/20 z-[100] backdrop-blur-sm'
                    />

                    <div className="fixed inset-0 h-[100dvh] z-[101] flex items-center justify-center p-4 overflow-hidden pointer-events-none">
                        <motion.div
                            initial={{ opacity:0, scale: 0.95, y: 20 }}
                            animate={{ opacity:1, scale: 1, y: 0 }}
                            exit={{ opacity:0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="work-modal-title"
                            className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
                        >
                            {/* 見出しは中身側（各 Detail）が持つため、ここでは表示しない。
                                ただしダイアログには名前が必要なので、読み上げ用にだけ残す。 */}
                            <h2 id="work-modal-title" className="sr-only">{title}</h2>

                            {/* ヘッダー帯をなくし、閉じるボタンだけを中身の上に浮かせる。
                                帯の高さぶん（約70px）がモバイルで効いてくるため。 */}
                            <button
                                onClick={onClose}
                                aria-label="閉じる"
                                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm shadow-md ring-1 ring-slate-900/5 text-slate-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin='round' strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                            {/* 余白は中身（WorkModalLayout）側が持つ。ここで付けると
                                モバイルで左右の padding が二重になり、本文幅が極端に狭くなる。 */}
                            <div className="overflow-y-auto">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}