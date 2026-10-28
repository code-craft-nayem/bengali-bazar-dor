export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F0F5F0] pb-20">
      {/* Accessible loading announcement for screen readers */}
      <div className="sr-only" role="status" aria-live="polite">
        Loading market prices, please wait...
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">

        {/* --- Hero Section Skeleton --- */}
        <section className="relative mb-12 overflow-hidden rounded-3xl bg-white p-8 shadow-sm sm:p-12">
          <div className="flex flex-col items-center justify-between gap-10 lg:flex-row">
            {/* Hero Text */}
            <div className="flex w-full max-w-xl flex-col items-center lg:items-start">
              {/* Date pill */}
              <Skeleton className="mb-6 h-6 w-40 rounded-full" />
              {/* Main Title */}
              <Skeleton className="mb-4 h-10 w-full max-w-md rounded-lg sm:h-12" />
              {/* Subtitle */}
              <Skeleton className="mb-8 h-5 w-full max-w-sm rounded-md" />
              <Skeleton className="h-5 w-2/3 max-w-xs rounded-md" />
              {/* CTA Button */}
              <Skeleton className="mt-8 h-12 w-36 rounded-xl bg-[#008B45]/10" />
            </div>

            {/* Hero Illustration Placeholder */}
            <div className="relative flex h-48 w-full max-w-[280px] items-center justify-center rounded-2xl bg-[#F0F5F0]/50 lg:h-64 lg:w-64">
              <Skeleton className="h-32 w-32 rounded-full opacity-50" />
            </div>
          </div>
        </section>

        {/* --- Product Grid Section Skeleton --- */}
        <section>
          {/* Section Header */}
          <div className="mb-6 flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-md bg-[#008B45]/20" />
            <Skeleton className="h-7 w-48 rounded-md" />
          </div>

          {/* Grid Container - Matches the 3-column layout from your homepage */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Render 6 placeholder cards to fill the initial viewport */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col rounded-2xl border border-[#e2e8e2] bg-white p-5 shadow-sm"
              >
                {/* Product Header (Icon + Name + Unit) */}
                <div className="mb-4 flex items-start gap-4">
                  {/* Product Icon/Image Placeholder */}
                  <Skeleton className="h-12 w-12 shrink-0 rounded-full" />

                  {/* Name and Unit */}
                  <div className="flex w-full flex-col gap-2 pt-1">
                    <Skeleton className="h-5 w-3/4 rounded-md" />
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                  </div>
                </div>

                {/* Price Row */}
                <div className="mt-auto flex items-end justify-between pt-4">
                  {/* Price */}
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-3 w-16 rounded-md" />
                    <Skeleton className="h-6 w-24 rounded-md" />
                  </div>
                  {/* Price Change Indicator */}
                  <Skeleton className="h-6 w-16 rounded-md bg-[#008B45]/5" />
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* 
        Custom Shimmer Animation 
        Using Tailwind's arbitrary group classes to safely respect reduced-motion 
      */}
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        @media (prefers-reduced-motion: no-preference) {
          .animate-shimmer {
            animation: shimmer 2s infinite linear;
          }
        }
      `}</style>
    </div>
  );
}

// --- Reusable Skeleton Component ---
// Kept local to this file as it's specifically tuned for this loading state.
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden rounded-md bg-[#e2e8e2] ${className}`}
    >
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  );
}