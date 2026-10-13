export default function TechTag({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className={`px-2.5 py-1 rounded text-[11px] font-bold border ${color} transition-transform hover:-translate-y-0.5 cursor-default`}>
      {children}
    </span>
  );
}
