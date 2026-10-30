'use client';
import Link from 'next/link';

export default function NotFound() {
  const mounted = true;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F0F5F0] px-4 py-16 sm:px-6 lg:px-8">

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-[#008B45]/10 blur-3xl animate-float-slow" />
        <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-[#008B45]/10 blur-3xl animate-float-slower" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-3xl" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage: 'radial-gradient(#26352B 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />


      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg className="absolute top-16 left-[12%] h-10 w-10 text-[#008B45]/20 animate-float-leaf-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
        </svg>
        <svg className="absolute bottom-20 right-[10%] h-12 w-12 text-[#008B45]/15 animate-float-leaf-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
        </svg>
        <svg className="absolute top-1/3 right-[18%] h-8 w-8 text-[#008B45]/10 animate-float-leaf-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
        </svg>
      </div>

      <div
        className={`relative w-full max-w-xl transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
      >

        <div
          aria-hidden="true"
          className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-[#008B45]/30 via-transparent to-[#008B45]/20 blur-lg animate-glow-pulse"
        />


        <div className="relative overflow-hidden rounded-[1.75rem] border border-white bg-white/90 shadow-[0_20px_60px_-15px_rgba(38,53,43,0.25)] backdrop-blur-xl px-6 py-12 sm:px-12 sm:py-14 text-center">

          <div className="absolute top-0 left-0 right-0 h-1.5 overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-[#008B45] to-transparent animate-shimmer" />
          </div>


          <div aria-hidden="true" className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#008B45]/10 blur-2xl" />
          <div aria-hidden="true" className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-[#008B45]/10 blur-2xl" />

          <div
            className={`relative mx-auto mb-8 flex items-center justify-center transition-all duration-700 delay-150 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
          >

            <span className="absolute h-28 w-28 rounded-full bg-[#008B45]/10 animate-ping-slow" />
            <span className="absolute h-32 w-32 rounded-full bg-[#008B45]/5 animate-ping-slower" />


            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#008B45] to-[#00733a] shadow-lg shadow-[#008B45]/30">

              <span
                aria-hidden="true"
                className="absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,#008B45_90deg,transparent_180deg,#008B45_270deg,transparent_360deg)] opacity-40 animate-spin-slow"
              />
              <div className="relative flex h-[5.25rem] w-[5.25rem] items-center justify-center rounded-full bg-white">
                <svg
                  className="h-10 w-10 text-[#008B45]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 10.5L21 3m-5.25 0H21v5.25M3 13.5l7.5-7.5M3 18.75V21h2.25M13.5 13.5l4.5 4.5"
                  />
                </svg>
              </div>
            </div>
          </div>


          <h1
            className={`relative text-[6rem] sm:text-[8rem] font-black leading-none tracking-tighter transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            <span className="bg-gradient-to-b from-[#26352B] to-[#4a5c51] bg-clip-text text-transparent drop-shadow-sm">
              404
            </span>
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 select-none bg-gradient-to-b from-[#008B45]/20 to-transparent bg-clip-text text-transparent blur-md"
            >
              404
            </span>
          </h1>

          <div
            className={`mt-2 inline-flex items-center gap-2 rounded-full border border-[#008B45]/20 bg-[#F0F5F0] px-4 py-1.5 transition-all duration-700 delay-[400ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#008B45] opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#008B45]" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#26352B]">
              Page Not Found
            </span>
          </div>


          <h2
            className={`mt-5 text-2xl sm:text-3xl font-bold text-[#26352B] transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
          >
            Oops! Page Not Found
          </h2>

          <p
            className={`mx-auto mt-3 max-w-md text-base sm:text-lg leading-relaxed text-[#4a5c51] transition-all duration-700 delay-[600ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
          >
            দুঃখিত! আপনি যে পৃষ্ঠাটি খুঁজছেন, সেটি পাওয়া যায়নি।
          </p>

          <div
            className={`mx-auto mt-8 mb-8 flex items-center justify-center gap-3 transition-all duration-700 delay-[700ms] ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
          >
            <div className="h-px w-14 bg-gradient-to-r from-transparent to-[#008B45]/40" />
            <span className="h-2 w-2 rotate-45 bg-[#008B45]/60 animate-pulse-soft" />
            <div className="h-px w-14 bg-gradient-to-l from-transparent to-[#008B45]/40" />
          </div>


          <div
            className={`flex flex-col items-center justify-center gap-3 sm:flex-row transition-all duration-700 delay-[800ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
          >
            <Link
              href="/"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#008B45] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#008B45]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#008B45]/40 focus:outline-none focus:ring-2 focus:ring-[#008B45] focus:ring-offset-2 active:scale-[0.98]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9m-9-9v18" />
              </svg>
              Back to Home
            </Link>


          </div>

          <p
            className={`mt-10 text-xs uppercase tracking-[0.2em] text-[#8a9a8f] transition-all duration-700 delay-[900ms] ${mounted ? 'opacity-100' : 'opacity-0'
              }`}
          >
            Bengali Bazar Dor
          </p>
        </div>
      </div>


      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.05); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, 20px) scale(1.05); }
        }
        @keyframes float-leaf-1 {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-14px) rotate(20deg); }
        }
        @keyframes float-leaf-2 {
          0%, 100% { transform: translateY(0) rotate(-12deg); }
          50% { transform: translateY(14px) rotate(-20deg); }
        }
        @keyframes float-leaf-3 {
          0%, 100% { transform: translateY(0) rotate(45deg); }
          50% { transform: translateY(-10px) rotate(55deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.5; }
          80%, 100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes ping-slower {
          0% { transform: scale(1); opacity: 0.3; }
          80%, 100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.6; transform: rotate(45deg) scale(1); }
          50% { opacity: 1; transform: rotate(45deg) scale(1.15); }
        }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 16s ease-in-out infinite; }
        .animate-float-leaf-1 { animation: float-leaf-1 6s ease-in-out infinite; }
        .animate-float-leaf-2 { animation: float-leaf-2 7s ease-in-out infinite; }
        .animate-float-leaf-3 { animation: float-leaf-3 5s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 4s ease-in-out infinite; }
        .animate-glow-pulse { animation: glow-pulse 4s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        .animate-ping-slow { animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-ping-slower { animation: ping-slower 4s cubic-bezier(0, 0, 0.2, 1) infinite 0.5s; }
        .animate-pulse-soft { animation: pulse-soft 2.5s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .animate-float-slow,
          .animate-float-slower,
          .animate-float-leaf-1,
          .animate-float-leaf-2,
          .animate-float-leaf-3,
          .animate-shimmer,
          .animate-glow-pulse,
          .animate-spin-slow,
          .animate-ping-slow,
          .animate-ping-slower,
          .animate-pulse-soft {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}