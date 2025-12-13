export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        
        {/* ヘッダー部分：名前と大学 */}
        <div className="bg-slate-900 text-white p-8 text-center">
          <h1 className="text-5xl font-bold mb-4">YUIKI</h1>
          <p className="text-xl">大阪公立大学 工学部 情報工学科 3年</p>
          <p className="mt-2 text-gray-300">Class of 2029 (Graduate School Aim)</p>
        </div>

        {/* コンテンツ部分 */}
        <div className="p-8 space-y-8">
          
          {/* 自己紹介 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-slate-900 pb-2 mb-4">
              About Me
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Web技術、低レイヤープログラミング、3Dモデリング、動画編集などのスキルを日々学習しています。
              また、IoT分野に興味を持っており、研究室ではIoTのセキュリティに関するテーマに取り組んでいます。
              現在は大学院への進学を目指して勉強中です。
            </p>
          </section>

          {/* 技術スタック */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-slate-900 pb-2 mb-4">
              Tech Stack
            </h2>
            
            <div className="mb-4">
              <h3 className="font-semibold text-lg text-gray-700 mb-2">Languages & Frameworks</h3>
              <div className="flex flex-wrap gap-2">
                {/* READMEのバッジ内容をテキストタグ化 */}
                {["C", "C++", "Java", "Python", "Processing", "JavaScript", "TypeScript", "Node.js", "Next.js", "HTML5", "CSS3", "GAS", "VBA"].map((tech) => (
                  <span key={tech} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-700 mb-2">Tools & Creative</h3>
              <div className="flex flex-wrap gap-2">
                {["Blender", "AviUtl", "VSCode", "Git", "GitHub", "Vercel"].map((tool) => (
                  <span key={tool} className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* 資格 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-slate-900 pb-2 mb-4">
              Certifications
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <span className="font-semibold">応用情報技術者試験 (AP)</span>
                <span className="text-sm text-gray-500 ml-2">- 2025年10月 受験 (結果待ち)</span>
              </li>
              <li>
                <span className="font-semibold">基本情報技術者試験 (FE)</span>
                <span className="text-sm text-gray-500 ml-2">- 2025年6月 合格</span>
              </li>
            </ul>
          </section>

        </div>
      </div>
    </main>
  );
}