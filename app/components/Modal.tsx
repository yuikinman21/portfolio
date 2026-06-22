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
                            className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
                        >
                        
                            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white/50 sticky top-0 z-10">
                                <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin='round' strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}