'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { MouseEvent } from 'react';

/** スポットライト付きの Bento カード。作品カード以外からも使うため独立させている。 */
export default function AnimatedBentoCard({ children, className, delay = 0, href, ...props }: any) {
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
      {/* コンテンツ（w-fullがないと横並びカードの中身が縮んでしまう） */}
      <div className="relative h-full w-full">
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
