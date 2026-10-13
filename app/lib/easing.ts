/**
 * CSS の cubic-bezier(x1, y1, x2, y2) と同じ曲線を JS 側で再現する。
 *
 * 「もっと見る」を閉じるとき、高さのアニメーション（Framer Motion）と
 * スクロールの補正（requestAnimationFrame）を**同じ曲線**で動かす必要がある。
 * 曲線がずれるとブラウザのスクロールクランプが途中で割り込み、カクつく。
 */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const A = (a: number, b: number) => 1 - 3 * b + 3 * a;
  const B = (a: number, b: number) => 3 * b - 6 * a;
  const C = (a: number) => 3 * a;

  const calc = (t: number, a: number, b: number) => ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
  const slope = (t: number, a: number, b: number) => 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);

  return (x: number): number => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;

    // Newton 法で x に対応する媒介変数 t を解く
    let t = x;
    for (let i = 0; i < 8; i++) {
      const d = slope(t, x1, x2);
      if (d === 0) break;
      const err = calc(t, x1, x2) - x;
      if (Math.abs(err) < 1e-6) break;
      t -= err / d;
    }
    return calc(t, y1, y2);
  };
}

/** 「もっと見る」を閉じるときの曲線と所要時間。高さとスクロールで共有する。 */
export const COLLAPSE_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
export const COLLAPSE_MS = 420;
