export default function Label({ text, color }: { text: string; color: "purple" | "blue" | "cyan" | "green" | "orange" | "indigo" | "white" | "pink" }) {
  const colors = {
    purple: "text-purple-600",
    blue: "text-blue-600",
    cyan: "text-cyan-600",
    green: "text-emerald-600",
    orange: "text-orange-600",
    indigo: "text-indigo-600",
    pink: "text-pink-600",
    white: "text-white/80",
  };
  return (
    <span className={`font-mono text-[10px] font-bold tracking-widest ${colors[color]} mb-2 block uppercase`}>
      {text}
    </span>
  );
}
