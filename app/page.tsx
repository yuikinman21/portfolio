import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* ヒーローセクション */}
      <header className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 text-center">
        {/* 背景の装飾: ふんわりとしたオーラ */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-full blur-[120px] -z-10 opacity-60" />
        
        <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-block px-4 py-1.5 rounded-full border border-indigo-100 bg-white/50 backdrop-blur-sm text-indigo-600 font-mono text-sm tracking-wider shadow-sm">
            HELLO, I&apos;M YUIKI
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1] text-slate-800">
            Designing logic,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Crafting future.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-light">
            大阪公立大学 工学部 情報工学科。<br />
            論理的なコードと感性豊かなクリエイティブで、新しい体験を実装する。
          </p>
          
          <div className="pt-8 flex justify-center gap-4">
            <a 
              href="#about"
              className="px-8 py-3 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-700 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              View Profile
            </a>
            <a 
              href="#skills"
              className="px-8 py-3 rounded-full bg-white text-slate-700 border border-slate-200 font-medium hover:bg-slate-50 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Tech Stack
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-24 space-y-40">
        
        {/* About Section */}
        <section id="about" className="scroll-mt-32">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5 sticky top-32 text-center md:text-left">
              <SectionLabel number="01" title="About Me" />
              
              {/* ▼▼▼ 画像追加エリア ▼▼▼ */}
              <div className="mt-12 relative mx-auto md:mx-0 max-w-[280px] aspect-square">
                 {/* 背景の光沢（装飾） */}
                 <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl -z-10" />

                 {/* 画像コンテナ: 丸形、白い太枠、少し回転させる遊び心 */}
                 <div className="relative w-full h-full rounded-full overflow-hidden border-[6px] border-white shadow-2xl shadow-indigo-900/10 rotate-3 hover:rotate-0 transition-all duration-500 group">
                    <Image
                       src="/サーキュラー8bit.jpg" // publicフォルダに置いたファイル名
                       alt="YUIKI Profile Icon"
                       fill
                       sizes="(max-width: 768px) 280px, 280px"
                       className="object-cover group-hover:scale-110 transition-transform duration-500"
                       priority
                    />
                 </div>
              </div>
              {/* ▲▲▲ 画像追加エリア ▲▲▲ */}

            </div>
            
            <div className="md:col-span-7 space-y-8 pt-4">
              <h3 className="text-3xl font-bold text-slate-800 leading-snug">
                Web技術から低レイヤーまで。<br/>
                <span className="text-indigo-500">「仕組み」を知り、「表現」を作る。</span>
              </h3>
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed font-light">
                <p>
                  情報工学を専攻し、コンピュータの基礎から最新のWebフレームワークまで幅広く学んでいます。私の強みは、エンジニアリング（論理）とクリエイティブ（感性）の双方を行き来できることです。
                </p>
                <p>
                  コードを書くだけでなく、Blenderによる3DモデリングやAviUtlでの動画編集など、視覚的なアウトプットも得意としています。現在は大学院進学を見据え、より深い技術の探求を行っています。
                </p>
              </div>
              
              <div className="flex gap-4 pt-4">
                <StatusBadge label="Class of 2029" />
                <StatusBadge label="Graduate School Aim" />
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="skills" className="scroll-mt-32">
          <div className="mb-16">
             <SectionLabel number="02" title="Tech Stack" />
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            <SkillCard title="Engineering & Code" description="Web開発からシステムプログラミングまで">
              <div className="flex flex-wrap gap-2">
                {["TypeScript", "Next.js", "React", "Node.js", "Python", "C++", "C", "Java", "Processing", "GAS"].map((tech) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
              </div>
            </SkillCard>

            <SkillCard title="Creative Tools" description="アイデアを形にするためのクリエイティブツール">
              <div className="flex flex-wrap gap-2">
                {["Git & GitHub", "Vercel", "VSCode", "Blender", "AviUtl", "Figma"].map((tool) => (
                  <Tag key={tool} variant="secondary">{tool}</Tag>
                ))}
              </div>
            </SkillCard>
          </div>
        </section>

        {/* Certifications Section */}
        <section id="certifications" className="scroll-mt-32">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <SectionLabel number="03" title="Certifications" />
            </div>
            <div className="md:col-span-8 space-y-4">
               <CertificationCard 
                  name="応用情報技術者試験 (AP)" 
                  date="2025年10月 受験予定" 
                  status="pending"
               />
               <CertificationCard 
                  name="基本情報技術者試験 (FE)" 
                  date="2025年6月 合格" 
                  status="certified"
               />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 text-center space-y-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Let&apos;s build something amazing.</h2>
            <p className="text-slate-500">ご興味を持っていただけましたら、ぜひGitHubもご覧ください。</p>
          </div>
          <a 
            href="https://github.com/yuikinman21" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-200"
          >
            <span>GitHub @yuikinman21</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </section>

      </main>

      <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-md py-12 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} YUIKI. All rights reserved.</p>
        <p className="mt-2 text-xs">Designed & Built with Next.js</p>
      </footer>
    </div>
  );
}

// --- Components ---

function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex flex-col gap-2 items-center md:items-start">
      <span className="font-mono text-indigo-500 text-sm font-bold tracking-widest">{number}.</span>
      <h2 className="text-4xl font-bold text-slate-800">{title}</h2>
      <div className="w-12 h-1 bg-indigo-500 mt-2 rounded-full" />
    </div>
  );
}

function SkillCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/60 transition-shadow duration-300">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      {children}
    </div>
  );
}

function Tag({ children, variant = "primary" }: { children: React.ReactNode; variant?: "primary" | "secondary" }) {
  const baseStyle = "px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-default";
  // プライマリは薄いインディゴ、セカンダリは薄いグレーやピンクなど
  const styles = variant === "primary" 
    ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
    : "bg-slate-100 text-slate-700 hover:bg-slate-200";

  return <span className={`${baseStyle} ${styles}`}>{children}</span>;
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="inline-block px-3 py-1 rounded-full border border-slate-200 text-slate-500 text-xs font-mono bg-white">
      {label}
    </span>
  );
}

function CertificationCard({ name, date, status }: { name: string; date: string; status: "certified" | "pending" }) {
  return (
    <div className="flex items-center justify-between p-6 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-center gap-4">
        <div className={`w-2 h-2 rounded-full ${status === "certified" ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" : "bg-amber-400"}`} />
        <span className="font-bold text-lg text-slate-700 group-hover:text-indigo-600 transition-colors">{name}</span>
      </div>
      <span className="font-mono text-sm text-slate-400 bg-slate-50 px-3 py-1 rounded-md">{date}</span>
    </div>
  );
}