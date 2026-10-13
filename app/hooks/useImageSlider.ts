'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * モーダル内の画像スライダー制御。
 * 作品ごとに `currentImageIndex` / `next` / `prev` を書いていたのを 1 本に集約している。
 * `images` が差し替わったとき（＝バージョンタブ切替時）はインデックスを 0 に戻す。
 */
export function useImageSlider(images: string[], isActive = true) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [images]);

  useEffect(() => {
    if (!isActive) setIndex(0);
  }, [isActive]);

  const next = useCallback(
    () => setIndex((prev) => (prev + 1) % images.length),
    [images.length],
  );
  const prev = useCallback(
    () => setIndex((prev) => (prev - 1 + images.length) % images.length),
    [images.length],
  );

  return { index, setIndex, next, prev };
}
