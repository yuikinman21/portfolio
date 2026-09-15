import type { WorkAccent } from '@/app/content/works';

const linkHover: Record<WorkAccent, string> = {
  cyan: 'hover:text-cyan-600 hover:border-cyan-200',
  pink: 'hover:text-pink-600 hover:border-pink-200',
  purple: 'hover:text-purple-600 hover:border-purple-200',
};

/** Canva スライドの埋め込みと「別のタブで開く」リンク。白鷺祭 v1 と IoT 研究で共用。 */
export default function CanvaEmbed({ embedSrc, viewHref, accent }: {
  embedSrc: string; viewHref: string; accent: WorkAccent;
}) {
  return (
    <>
      <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-white border border-slate-200">
        <iframe loading="lazy" className="w-full h-full border-none" src={embedSrc} allowFullScreen allow="fullscreen" />
      </div>
      <a
        href={viewHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-2 px-6 py-2.5 bg-white text-slate-600 rounded-full text-xs font-bold shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 ${linkHover[accent]}`}
      >
        <span>別のタブで開く</span>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
      </a>
    </>
  );
}
