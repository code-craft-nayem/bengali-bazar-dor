import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type ApiChange = { dir?: "up" | "down" | "flat" | string; pct?: number };

type RawMarket = {
  market?: string;
  division?: string;
  min?: number | string;
  max?: number | string;
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
  category?: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  markets?: RawMarket[];
};

type NormalizedMarket = {
  marketName: string;
  division: string;
  min: number | null;
  max: number | null;
  avg: number | null;
};

type Product = {
  id: string;
  slug: string;
  nameBn: string;
  unit: string;
  today: number;
  yesterday?: number;
  pct: number;
  dir: "up" | "down" | "flat";
  icon?: string;
  image?: string;
  categoryNameBn?: string;
  markets: NormalizedMarket[];
  missingFigmaMarkets: string[];
  summaryMin: number | null;
  summaryMax: number | null;
  summaryAvg: number | null;
};

const FIGMA_ORDER: { market: string; division: string }[] = [
  { market: "মাঠ বাজার", division: "ময়মনসিংহ" },
  { market: "সদর বাজার", division: "রাজশাহী" },
  { market: "বাজারহাট", division: "খুলনা" },
  { market: "বাসারহাট বাজার", division: "রাজশাহী" },
  { market: "চৌর বাজার", division: "ময়মনসিংহ" },
  { market: "আমতলী বাজার", division: "চট্টগ্রাম" },
  { market: "ডবলগেট বাজার", division: "খুলনা" },
  { market: "চৌরাস্তা বাজার", division: "সিলেট" },
  { market: "গ্রীন মার্কেট, মিরপুর", division: "ঢাকা" },
  { market: "চৌদগ্রাম বাজার", division: "চট্টগ্রাম" },
  { market: "আমবাজার", division: "সিলেট" },
  { market: "কারওয়ান বাজার", division: "ঢাকা" },
];

const FIGMA_ALIASES: Record<string, string> = {
  "ঢাকা": "চাকা",
  "চৌদ্দগ্রাম বাজার": "চৌদগ্রাম বাজার",
};

function normalizeForMatch(value: string): string {
  return value.trim();
}

function figmaIndexFor(market: string, division: string): number {
  const m = normalizeForMatch(market);
  const d = normalizeForMatch(division);

  let idx = FIGMA_ORDER.findIndex(
    (f) => f.market === m && f.division === d,
  );
  if (idx !== -1) return idx;

  const mAlias = FIGMA_ALIASES[m] ?? m;
  idx = FIGMA_ORDER.findIndex(
    (f) => (f.market === mAlias || FIGMA_ALIASES[f.market] === m) && f.division === d,
  );
  return idx;
}

const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

function toBengaliNumber(num: number): string {
  const safe = Number.isFinite(num) ? num : 0;
  return safe.toString().replace(/\d/g, (d) => BENGALI_DIGITS[parseInt(d)]);
}

function toBengaliDecimal(num: number, places: number): string {
  const fixed = num.toFixed(places);
  const [intPart, fracPart] = fixed.split(".");
  const intBn = intPart.replace(/\d/g, (d) => BENGALI_DIGITS[parseInt(d)]);
  if (!fracPart) return intBn;
  const fracBn = fracPart.replace(/\d/g, (d) => BENGALI_DIGITS[parseInt(d)]);
  return `${intBn}.${fracBn}`;
}

function toSafeNumber(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const cleaned = v.replace(/[%\s,৳টাকা]/g, "").trim();
    if (cleaned === "") return null;
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
  const n = toSafeNumber(c);
  if (n !== null) {
    if (n > 0) return { dir: "up", pct: n };
    if (n < 0) return { dir: "down", pct: Math.abs(n) };
    return { dir: "flat", pct: 0 };
  }
  const t = toSafeNumber(raw.today);
  const y = toSafeNumber(raw.yesterday);
  if (t !== null && y !== null && y !== 0) {
    const p = ((t - y) / y) * 100;
    if (p > 0) return { dir: "up", pct: Math.abs(p) };
    if (p < 0) return { dir: "down", pct: Math.abs(p) };
    return { dir: "flat", pct: 0 };
  }
  return { dir: "flat", pct: 0 };
}

function isImageUrl(v?: string): boolean {
  return typeof v === "string" && /^https?:\/\//i.test(v.trim());
}
function isEmoji(v?: string): boolean {
  if (!v) return false;
  return !/^https?:\/\//i.test(v) && v.trim().length > 0;
}

function normalizeMarkets(rawMarkets?: RawMarket[]): {
  markets: NormalizedMarket[];
  missingFigmaMarkets: string[];
} {
  if (!Array.isArray(rawMarkets)) {
    return { markets: [], missingFigmaMarkets: FIGMA_ORDER.map((f) => f.market) };
  }

  const mapped: NormalizedMarket[] = rawMarkets
    .map((m) => {
      const min = toSafeNumber(m.min);
      const max = toSafeNumber(m.max);
      const avg = min !== null && max !== null ? (min + max) / 2 : null;
      return {
        marketName: m.market ?? "",
        division: m.division ?? "",
        min,
        max,
        avg,
      };
    })
    .filter((m) => m.marketName !== "");

  const withIndex = mapped.map((m) => ({
    m,
    idx: figmaIndexFor(m.marketName, m.division),
  }));

  const matched = withIndex
    .filter((x) => x.idx !== -1)
    .sort((a, b) => a.idx - b.idx)
    .map((x) => x.m);

  const unmatched = withIndex.filter((x) => x.idx === -1).map((x) => x.m);

  const ordered = [...matched, ...unmatched];

  const missingFigmaMarkets = FIGMA_ORDER.filter(
    (f) => !matched.some((m) => m.marketName === f.market && m.division === f.division),
  ).map((f) => `${f.market} — ${f.division}`);

  return { markets: ordered, missingFigmaMarkets };
}

async function getProduct(idOrSlug: string): Promise<Product | null> {
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/bazardor/products/${idOrSlug}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;

    const data = await res.json();
    const raw = Array.isArray(data)
      ? (data[0] as RawProduct)
      : Array.isArray((data as { data?: RawProduct[] })?.data)
        ? (data as { data: RawProduct[] }).data[0]
        : (data as RawProduct);

    if (!raw || (!raw.nameBn && !raw.name)) return null;

    const { dir, pct } = normalizeChange(raw);
    const { markets, missingFigmaMarkets } = normalizeMarkets(raw.markets);

    const validMins = markets.map((m) => m.min).filter((v): v is number => v !== null);
    const validMaxs = markets.map((m) => m.max).filter((v): v is number => v !== null);
    const validAvgs = markets.map((m) => m.avg).filter((v): v is number => v !== null);

    const summaryMin = validMins.length > 0 ? Math.min(...validMins) : null;
    const summaryMax = validMaxs.length > 0 ? Math.max(...validMaxs) : null;
    const summaryAvg =
      validAvgs.length > 0 ? validAvgs.reduce((a, b) => a + b, 0) / validAvgs.length : null;

    return {
      id: String(raw.id),
      slug: raw.slug ?? String(raw.id),
      nameBn: raw.nameBn ?? raw.name ?? "",
      unit: raw.unit ?? "",
      today: toSafeNumber(raw.today) ?? 0,
      yesterday: toSafeNumber(raw.yesterday) ?? undefined,
      pct,
      dir,
      icon: raw.icon ?? raw.categoryIcon,
      image: raw.image,
      categoryNameBn: raw.categoryNameBn,
      markets,
      missingFigmaMarkets,
      summaryMin,
      summaryMax,
      summaryAvg,
    };
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const color =
    product.dir === "up"
      ? "text-red-500"
      : product.dir === "down"
        ? "text-green-600"
        : "text-gray-500";
  const sym = product.dir === "up" ? "▲" : product.dir === "down" ? "▼" : "—";

  const priceDiff = product.yesterday !== undefined ? product.today - product.yesterday : 0;
  const absDiff = Math.abs(priceDiff);

  const changeWord =
    product.dir === "up" ? "বেড়েছে" : product.dir === "down" ? "কমেছে" : "অপরিবর্তিত";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 bg-[#f4fbf7] min-h-screen">
      <div className="mb-6 flex items-center gap-2 text-sm text-base-content/60">
        <Link href="/" className="hover:text-primary transition-colors">হোম</Link>
        <span>›</span>
        {product.categoryNameBn && (
          <>
            <Link
              href={`/category/${product.categoryNameBn}`}
              className="hover:text-primary transition-colors"
            >
              {product.categoryNameBn}
            </Link>
            <span>›</span>
          </>
        )}
        <span className="font-medium text-base-content">{product.nameBn}</span>
      </div>


      <div className="mb-6 flex flex-col items-center text-center gap-4 rounded-3xl border border-base-200 bg-white p-6 shadow-sm md:flex-row md:items-start md:justify-between md:text-left md:p-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-base-200/50">
            {isImageUrl(product.image) ? (
              <Image
                src={(product.image as string).trim()}
                alt={product.nameBn}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            ) : isEmoji(product.image) ? (
              <span className="text-4xl">{product.image}</span>
            ) : isEmoji(product.icon) ? (
              <span className="text-4xl">{product.icon}</span>
            ) : (
              <span className="text-4xl">🛒</span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-base-content md:text-3xl">{product.nameBn}</h1>
            <p className="mt-1 text-sm text-base-content/60">
              প্রতি {product.unit} : {product.categoryNameBn || "পণ্য"}
            </p>
            {product.yesterday !== undefined && (
              <p className="mt-2 text-xs text-base-content/60">
                গতকালের তুলনায় আজ দাম{" "}
                <span className="font-bold text-base-content">{changeWord}</span>
                {product.dir !== "flat" && (
                  <> · {toBengaliNumber(absDiff)} টাকা</>
                )}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center justify-center rounded-2xl bg-[#f8faf9] p-4 text-center md:min-w-[140px]">
          <p className="text-xs text-base-content/60">আজকের দাম</p>
          <p className="text-2xl font-bold text-base-content">৳{toBengaliNumber(product.today)}</p>
          <p className="text-xs text-base-content/60 mb-1">টাকা / {product.unit}</p>
          <span className={`flex items-center gap-1 text-xs font-bold ${color}`}>
            {sym} {toBengaliNumber(Number(product.pct.toFixed(1)))}%
          </span>
        </div>
      </div>

      <div className="mb-6 rounded-3xl border border-base-200 bg-white p-6 shadow-sm text-center md:text-left">
        <h2 className="mb-4 text-lg font-bold text-base-content">দামের সারসংক্ষেপ</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-base-200 p-4">
            <p className="text-xs text-base-content/60 mb-1">সর্বনিম্ন দাম</p>
            <p className="text-xl font-bold text-green-600">
              {product.summaryMin !== null
                ? `৳${toBengaliNumber(product.summaryMin)} টাকা`
                : "তথ্য নেই"}
            </p>
            <p className="mt-1 text-[10px] text-base-content/60">সবচেয়ে কম দামের বাজার</p>
          </div>
          <div className="rounded-xl border border-base-200 p-4">
            <p className="text-xs text-base-content/60 mb-1">সর্বোচ্চ দাম</p>
            <p className="text-xl font-bold text-red-500">
              {product.summaryMax !== null
                ? `৳${toBengaliNumber(product.summaryMax)} টাকা`
                : "তথ্য নেই"}
            </p>
            <p className="mt-1 text-[10px] text-base-content/60">সবচেয়ে বেশি দামের বাজার</p>
          </div>
          <div className="rounded-xl border border-base-200 p-4">
            <p className="text-xs text-base-content/60 mb-1">গড় দাম</p>
            <p className="text-xl font-bold text-green-600">
              {product.summaryAvg !== null
                ? `৳${toBengaliNumber(Math.round(product.summaryAvg))} টাকা`
                : "তথ্য নেই"}
            </p>
            <p className="mt-1 text-[10px] text-base-content/60">প্রতি কেজি-র হিসাব</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-base-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-center text-lg font-bold text-base-content md:text-left">
          বাজারভিত্তিক আজকের দাম
        </h2>
        {product.markets.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="table w-full text-center md:text-left">
                <thead>
                  <tr className="border-b border-base-200 text-xs text-base-content/60">
                    <th className="font-medium text-center md:text-left">বাজার</th>
                    <th className="font-medium text-center md:text-left">বিভাগ</th>
                    <th className="font-medium text-center">সর্বনিম্ন</th>
                    <th className="font-medium text-center">সর্বাধিক</th>
                    <th className="font-medium text-center">গড়</th>
                  </tr>
                </thead>
                <tbody>
                  {product.markets.map((market, idx) => (
                    <tr key={idx} className="border-b border-base-100 text-sm">
                      <td className="font-medium text-base-content">{market.marketName || "-"}</td>
                      <td className="text-base-content/70">{market.division || "-"}</td>
                      <td className="text-center">
                        {market.min !== null ? `৳${toBengaliNumber(market.min)} টাকা` : "-"}
                      </td>
                      <td className="text-center">
                        {market.max !== null ? `৳${toBengaliNumber(market.max)} টাকা` : "-"}
                      </td>
                      <td className="text-center font-semibold">
                        {market.avg !== null
                          ? `৳${Number.isInteger(market.avg)
                            ? toBengaliNumber(market.avg)
                            : toBengaliDecimal(market.avg, 2)
                          } টাকা`
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="rounded-lg bg-base-100 py-8 text-center text-sm text-base-content/60">
            এই পণ্যের বাজারভিত্তিক বিস্তারিত ডেটা API-তে পাওয়া যায়নি।
          </div>
        )}
      </div>
    </div>
  );
}