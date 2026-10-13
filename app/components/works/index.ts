import type { ComponentType } from 'react';
import HomeOsDetail from './HomeOsDetail';
import ShirasagiDetail from './ShirasagiDetail';
import IotDetail from './IotDetail';
import FindSagisaiDetail from './FindSagisaiDetail';

/**
 * slug → 詳細コンポーネント（slot）の対応表。
 * 作品ごとに表現が異なるため、共通テンプレートに押し込めず、ここで差し替える。
 * 作品を追加したら `app/content/works.ts` にメタデータを足し、ここに 1 行登録する。
 */
export const workDetails: Record<string, ComponentType> = {
  homeos: HomeOsDetail,
  shirasagisai: ShirasagiDetail,
  iot: IotDetail,
  findsagisai: FindSagisaiDetail,
};
