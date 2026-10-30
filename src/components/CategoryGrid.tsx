"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Product = {
  id: string | number;
  slug: string;
  nameBn: string;
  unit: string;
  image?: string;
  icon?: string;
  dir: "up" | "down" | string;
  pct: number;
  today: number;
};

function toBengaliNumber(num: number): string {
  const digits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const safe = Number.isFinite(num) ? num : 0;
  return safe.toString().replace(/\d/g, (d) => digits[parseInt(d)]);
}

function isImageUrl(v?: string): boolean { return typeof v === "string" && /^https?:\/\//i.test(v.trim()); }
function isEmoji(v?: string): boolean { if (!v) return false; return !/^https?:\/\//i.test(v) && v.trim().length > 0; }

function ProductCard({ product }: { product: Product }) {
  const color = product.dir === "up" ? "text-red-500" : product.dir === "down" ? "text-green-600" : "text-gray-500";
  const bg = product.dir === "up" ? "bg-red-50" : product.dir === "down" ? "bg-green-50" : "bg-gray-100";
  const sym = product.dir === "up" ? "▲" : product.dir === "down" ? "▼" : "—";
  const pct = Number.isFinite(product.pct) ? product.pct : 0;
  return (
    <Link href={`/product/${product.id}`} className="group flex flex-col justify-between rounded-2xl border border-base-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-base-200/50">
          {isImageUrl(product.image) ? <Image src={(product.image as string).trim()} alt={product.nameBn} width={48} height={48} className="h-full w-full object-cover" />
            : isEmoji(product.image) ? <span className="text-xl">{product.image}</span>
              : isEmoji(product.icon) ? <span className="text-xl">{product.icon}</span>
                : <span className="text-xl">🛒</span>}
        </div>
        <div className="pt-0.5">
          <h3 className="text-base font-bold leading-tight text-base-content">{product.nameBn}</h3>
          <p className="mt-0.5 text-xs text-base-content/60">প্রতি {product.unit}</p>
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="mb-1 text-[11px] text-base-content/60">আজকের দাম</p>
          <span className="text-lg font-bold text-base-content">{toBengaliNumber(product.today)} টাকা</span>
        </div>
        <span className={`flex items-center gap-0.5 rounded-full ${bg} px-2 py-0.5 text-[11px] font-bold ${color}`}>{sym} {toBengaliNumber(Number(pct.toFixed(1)))}%</span>
      </div>
    </Link>
  );
}

export default function CategoryGrid({ initialProducts }: { initialProducts: Product[] }) {
  const [sortOrder, setSortOrder] = useState<"default" | "low-high" | "high-low">("default");
  const sorted = [...initialProducts];
  if (sortOrder === "low-high") sorted.sort((a, b) => a.today - b.today);
  else if (sortOrder === "high-low") sorted.sort((a, b) => b.today - a.today);

  return (
    <>
      <div className="mb-4 flex items-center justify-end gap-2 rounded-xl border border-base-200 bg-white p-3">
        <span className="text-sm text-base-content/70">সাজান:</span>
        <select className="select select-bordered select-sm max-w-xs" value={sortOrder} onChange={(e) => setSortOrder(e.target.value as "default" | "low-high" | "high-low")}>
          <option value="default">ডিফল্ট</option>
          <option value="low-high">দাম: কম থেকে বেশি</option>
          <option value="high-low">দাম: বেশি থেকে কম</option>
        </select>
      </div>

      <div className="mb-4 text-sm text-base-content/60">মোট {toBengaliNumber(initialProducts.length)}টি পণ্য দেখানো হচ্ছে</div>

      {initialProducts.length === 0 ? (
        <div className="rounded-2xl border border-base-200 bg-base-100 py-16 text-center">
          <p className="text-lg text-base-content/60">এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{sorted.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </>
  );
}