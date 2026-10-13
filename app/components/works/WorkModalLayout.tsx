import type { ReactNode } from 'react';

/**
 * モーダル本体の 2 ペインレイアウト（左: ビジュアル / 右: テキスト）。
 * 3 作品すべてが同じ骨格なので共通化し、中身だけ slot で受け取る。
 */
export default function WorkModalLayout({ visual, info }: { visual: ReactNode; info: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-[60vh]">
      <div className="w-full md:w-3/5 bg-slate-100 relative min-h-[300px] flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden gap-4">
        {visual}
      </div>
      <div className="w-full md:w-2/5 bg-white p-6 lg:p-8 flex flex-col overflow-y-auto relative">
        {info}
      </div>
    </div>
  );
}
