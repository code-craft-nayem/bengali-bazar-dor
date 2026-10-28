import Image from "next/image";
import Link from "next/link";

type ApiChange = {
  dir?: "up" | "down" | "flat" | string;
  pct?: number;
};

type RawProduct = {
  id: string | number;
  slug?: string;
  nameBn?: string;
  name?: string;
  unit?: string;
  today?: number | string;
  yesterday?: number | string;
  change?: ApiChange | number | string | null;
  icon?: string;
  image?: string;
};

type Product = {
  id: string;
  slug: string;
  nameBn: string;
  unit: string;
  today: number;
  pct: number;
  dir: "up" | "down" | "flat";
  icon?: string;
  image?: string;
};

function toBengaliNumber(num: number): string {
  const bengaliDigits = [
    "\u09E6", "\u09E7", "\u09E8", "\u09E9", "\u09EA",
    "\u09EB", "\u09EC", "\u09ED", "\u09EE", "\u09EF",
  ];
  const safe = Number.isFinite(num) ? num : 0;
  return safe.toString().replace(/\d/g, (d) => bengaliDigits[parseInt(d)]);
}

function getBengaliDate() {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());
}

function toSafeNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[%\s+]/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normalizeChange(raw: RawProduct): { dir: "up" | "down" | "flat"; pct: number } {
  const c = raw.change;

  if (c && typeof c === "object" && !Array.isArray(c)) {
    const dir = c.dir === "up" || c.dir === "down" || c.dir === "flat" ? c.dir : "flat";
    const pct = toSafeNumber(c.pct) ?? 0;
    return { dir, pct: Math.abs(pct) };
  }

  const numeric = toSafeNumber(c);
  if (numeric !== null) {
    if (numeric > 0) return { dir: "up", pct: numeric };
    if (numeric < 0) return { dir: "down", pct: Math.abs(numeric) };
    return { dir: "flat", pct: 0 };
  }

  const today = toSafeNumber(raw.today);
  const yesterday = toSafeNumber(raw.yesterday);
  if (today !== null && yesterday !== null && yesterday !== 0) {
    const pct = ((today - yesterday) / yesterday) * 100;
    if (pct > 0) return { dir: "up", pct: Math.abs(pct) };
    if (pct < 0) return { dir: "down", pct: Math.abs(pct) };
    return { dir: "flat", pct: 0 };
  }

  return { dir: "flat", pct: 0 };
}

function isImageUrl(value?: string): boolean {
  return typeof value === "string" && /^https?:\/\//i.test(value.trim());
}

function isEmoji(value?: string): boolean {
  if (!value) return false;
  return !/^https?:\/\//i.test(value) && value.trim().length > 0;
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed || 1;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function getProducts(): Promise<Product[]> {
  const res = await fetch(
    "https://openapi.programming-hero.com/api/bazardor/products",
    { cache: "no-store" },
  );
  if (!res.ok) return [];
  const data: unknown = await res.json();
  const list = Array.isArray(data)
    ? (data as RawProduct[])
    : Array.isArray((data as { data?: RawProduct[] })?.data)
      ? (data as { data: RawProduct[] }).data
      : [];

  return list
    .map((raw) => {
      const { dir, pct } = normalizeChange(raw);
      return {
        id: String(raw.id),
        slug: raw.slug ?? String(raw.id),
        nameBn: raw.nameBn ?? raw.name ?? "",
        unit: raw.unit ?? "",
        today: toSafeNumber(raw.today) ?? 0,
        pct,
        dir,
        icon: raw.icon,
        image: raw.image,
      };
    })
    .filter((p) => p.nameBn !== "");
}

function ProductCard({ product }: { product: Product }) {
  const changeColor =
    product.dir === "up"
      ? "text-red-500"
      : product.dir === "down"
        ? "text-green-600"
        : "text-gray-500";
  const bgPillColor =
    product.dir === "up"
      ? "bg-red-50"
      : product.dir === "down"
        ? "bg-green-50"
        : "bg-gray-100";
  const changeSymbol =
    product.dir === "up" ? "▲" : product.dir === "down" ? "▼" : "—";
  const safePct = Number.isFinite(product.pct) ? product.pct : 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col justify-between rounded-2xl border border-base-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-base-200/50">
          {isImageUrl(product.image) ? (
            <Image
              src={(product.image as string).trim()}
              alt={product.nameBn}
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          ) : isEmoji(product.image) ? (
            <span className="text-2xl">{product.image}</span>
          ) : isEmoji(product.icon) ? (
            <span className="text-2xl">{product.icon}</span>
          ) : (
            <span className="text-2xl">🛒</span>
          )}
        </div>
        <div className="pt-1">
          <h3 className="text-lg font-bold leading-tight text-base-content">
            {product.nameBn}
          </h3>
          <p className="mt-1 text-xs text-base-content/60">
            প্রতি {product.unit}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs text-base-content/60">আজকের দাম</p>
          <span className="text-xl font-bold text-base-content">
            ৳{toBengaliNumber(product.today)}
          </span>
        </div>
        <span
          className={`flex items-center gap-1 rounded-full ${bgPillColor} px-2.5 py-1 text-xs font-bold ${changeColor}`}
        >
          {changeSymbol} {toBengaliNumber(Number(safePct.toFixed(1)))}%
        </span>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const products = await getProducts();

  const allRisers = [...products].filter((p) => p.dir === "up");
  const allFallers = [...products].filter((p) => p.dir === "down");

  const risers = seededShuffle(allRisers, 42).slice(0, 6);
  const fallers = seededShuffle(allFallers, 42).slice(0, 6);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">

      <section className="relative overflow-hidden rounded-3xl border border-success/20 bg-[#f8faf9] px-6 py-10 md:px-10 md:py-14">
        <div className="flex flex-col-reverse items-center justify-between gap-8 md:flex-row">
          <div className="max-w-xl">
            <span className="mb-4 inline-block rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
              {getBengaliDate()}
            </span>
            <h1 className="text-3xl font-bold leading-tight text-base-content md:text-4xl">
              আজকের বাজারের দাম এক নজরে
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-base-content/70 md:text-base">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারদর প্রতিদিন হালনাগাদ।
            </p>
            <Link href="#সব-পণ্য" className="btn btn-success mt-6 rounded-md px-6">
              সব পণ্য দেখুন
            </Link>
          </div>
          <div className="relative w-full max-w-[280px] shrink-0 md:max-w-[340px]">
            <Image
              src="/bazar-hero.png"
              alt="বাজার দর"
              width={400}
              height={300}
              priority
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </section>


      {
        risers.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-red-500">
              <span className="text-sm">▲</span> আজ দাম বেড়েছে
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {risers.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )
      }

      {
        fallers.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-green-600">
              <span className="text-sm">▼</span> আজ দাম কমেছে
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fallers.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )
      }


      <section id="সব-পণ্য" className="mt-12 scroll-mt-24">
        <h2 className="text-xl font-bold text-base-content">সব পণ্য</h2>
        <p className="mt-1 mb-5 text-xs text-base-content/60">
          মোট {toBengaliNumber(products.length)}টি পণ্য দেখানো হচ্ছে
        </p>

        {products.length === 0 ? (
          <p className="py-8 text-center text-base-content/60">
            কোনো পণ্য পাওয়া যায়নি।
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div >
  );
}