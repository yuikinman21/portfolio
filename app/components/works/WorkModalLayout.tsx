import type { ReactNode } from 'react';

/**
 * モーダル本体の 2 ペインレイアウト（左: ビジュアル / 右: テキスト）。
 * 3 作品すべてが同じ骨格なので共通化し、中身だけ slot で受け取る。
 */
export default function WorkModalLayout({ visual, info }: { visual: ReactNode; info: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-[60vh]">
      {/* モバイルは画面が狭いので、ビジュアルの最低高と余白を詰めて本文を早く見せる */}
      <div className="w-full md:w-3/5 bg-slate-100 relative min-h-[200px] md:min-h-[300px] flex flex-col items-center justify-center px-3 pt-3 pb-7 md:p-8 overflow-hidden gap-3 md:gap-4">
        {visual}
      </div>
      <div className="w-full md:w-2/5 bg-white px-5 py-6 md:p-6 lg:p-8 flex flex-col overflow-y-auto relative">
        {info}
      </div>
    </div>
  );
}
