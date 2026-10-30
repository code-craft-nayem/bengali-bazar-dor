export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen w-full flex-col items-center justify-center bg-[#f4fbf7] px-6 overflow-hidden">

      <style>{`
        @keyframes spin-slow { 100% { transform: rotate(360deg); } }
        @keyframes spin-reverse { 100% { transform: rotate(-360deg); } }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.8; transform: scale(1); box-shadow: 0 0 30px 8px rgba(34,197,94,0.6), 0 0 60px 15px rgba(34,197,94,0.2); }
          50% { opacity: 1; transform: scale(1.1); box-shadow: 0 0 50px 15px rgba(34,197,94,0.8), 0 0 100px 30px rgba(34,197,94,0.4); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer-text {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 4s linear infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-fade-up { animation: fade-up 1s ease-out forwards; }
        .animate-shimmer-text {
          background-size: 200% auto;
          animation: shimmer-text 3s linear infinite;
        }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(34,197,94,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center">


        <div className="relative flex h-56 w-56 items-center justify-center">

          <div className="animate-spin-slow absolute inset-0 rounded-full border-2 border-dashed border-green-500/60 shadow-[0_0_15px_rgba(34,197,94,0.4)]" />


          <div className="animate-spin-slow absolute inset-2 rounded-full border-[3px] border-transparent border-t-green-500 border-b-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.5)]" style={{ animationDirection: 'reverse' }} />

          <div className="animate-spin-reverse absolute inset-10 rounded-full border-[3px] border-transparent border-l-green-600 border-r-green-600/50" />


          <div className="absolute inset-16 rounded-full border border-green-500/30" />


          <div className="animate-pulse-glow relative flex h-20 w-20 items-center justify-center rounded-full bg-green-500 border-2 border-white/50">
            <div className="absolute inset-0 rounded-full bg-white/40 blur-sm" />
            <span className="relative z-10 text-4xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">🛒</span>
          </div>
        </div>

        <div className="animate-fade-up mt-12 flex flex-col items-center text-center" style={{ animationDelay: '0.2s' }}>
          <h1 className="animate-shimmer-text bg-gradient-to-r from-green-600 via-green-400 to-green-600 bg-clip-text text-transparent text-4xl font-extrabold tracking-[0.2em] sm:text-5xl drop-shadow-sm">
            লোড হচ্ছে
          </h1>
          <p className="mt-2 text-xs tracking-[0.3em] text-green-700 uppercase font-bold">
            বাজার দর
          </p>
        </div>

        <div className="animate-fade-up mt-8 flex items-center gap-3 rounded-full border-2 border-green-500/40 bg-white px-6 py-3 shadow-lg shadow-green-500/20" style={{ animationDelay: '0.4s' }}>
          <div className="relative flex h-3 w-3 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600"></span>
          </div>
          <span className="text-sm font-bold tracking-[0.15em] text-green-700 uppercase">
            তথ্য লোড হচ্ছে...
          </span>
        </div>
      </div>
    </div>
  );
}