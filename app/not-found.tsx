import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="bento-card w-full max-w-xl p-8 md:p-14 flex flex-col items-center text-center">
        {/* 上部のグラデーション（プロフィールカードと同じ質感） */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none" />

        {/* サーキュラーアイコン */}
        <div className="relative z-10 w-40 h-40 md:w-48 md:h-48 shadow-2xl shadow-indigo-100 rounded-full overflow-hidden border-[6px] border-white">
          <Image
            src="/サーキュラー8bit.jpg"
            alt="YUIKI Profile Icon"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-10 mt-8 space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <p className="font-mono text-slate-500 text-xs tracking-widest font-bold uppercase">
              Error 404 / Not Found
            </p>
          </div>

          <h1 className="text-7xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">
            404
          </h1>

          <p className="text-slate-500 font-medium">
            お探しのページは見つかりませんでした。
            {/* 狭い画面では自然に流し、広い画面でのみ改行位置を固定する */}
            <br className="hidden sm:inline" />
            URLが変更されたか、削除された可能性があります。
          </p>
        </div>

        <Link
          href="/"
          className="relative z-10 mt-8 px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow active:scale-95"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
