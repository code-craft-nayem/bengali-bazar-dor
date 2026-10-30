import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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

type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

function toBengaliNumber(num: number): string {
  const bengaliDigits = [
    "০", "১", "২", "৩", "৪",
    "৫", "৬", "৭", "৮", "৯",];

  const safe = Number.isFinite(num) ? num : 0;
  return safe.toString().replace(/\d/g, (d) => bengaliDigits[parseInt(d)]);
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

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { category } = await getCategoryData(slug);

    return {
      title: category?.nameBn ?? "Category",
    };
  } catch {
    return {
      title: "Category",
    };
  }
}


async function getCategoryData(slug: string) {
  const catRes = await fetch(
    "https://openapi.programming-hero.com/api/bazardor/categories",
    { cache: "no-store" }
  );

  const prodRes = await fetch(
    `https://openapi.programming-hero.com/api/bazardor/products?category=${slug}`,
    { cache: "no-store" }
  );

  if (!catRes.ok || !prodRes.ok) {
    throw new Error("Failed to fetch data");
  }

  const catData = await catRes.json();
  const catList = Array.isArray(catData)
    ? (catData as Category[])
    : Array.isArray((catData as { data?: Category[] })?.data)
      ? (catData as { data: Category[] }).data
      : [];

  const foundCategory = catList.find((c) => c.slug === slug);

  const prodData = await prodRes.json();
  const prodList = Array.isArray(prodData)
    ? (prodData as RawProduct[])
    : Array.isArray((prodData as { data?: RawProduct[] })?.data)
      ? (prodData as { data: RawProduct[] }).data
      : [];

  const products: Product[] = prodList
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

  return { category: foundCategory, products };
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
      href={`/product/${product.id}`}
      className="group flex flex-col justify-between rounded-2xl border border-base-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-base-200/50">
          {isImageUrl(product.image) ? (
            <Image
              src={(product.image as string).trim()}
              alt={product.nameBn}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          ) : isEmoji(product.image) ? (
            <span className="text-xl">{product.image}</span>
          ) : isEmoji(product.icon) ? (
            <span className="text-xl">{product.icon}</span>
          ) : (
            <span className="text-xl">🛒</span>
          )}
        </div>
        <div className="pt-0.5">
          <h3 className="text-base font-bold leading-tight text-base-content">
            {product.nameBn}
          </h3>
          <p className="mt-0.5 text-xs text-base-content/60">
            প্রতি {product.unit}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="mb-1 text-[11px] text-base-content/60">আজকের দাম</p>
          <span className="text-lg font-bold text-base-content">
            {toBengaliNumber(product.today)} টাকা
          </span>
        </div>
        <span
          className={`flex items-center gap-0.5 rounded-full ${bgPillColor} px-2 py-0.5 text-[11px] font-bold ${changeColor}`}
        >
          {changeSymbol} {toBengaliNumber(Number(safePct.toFixed(1)))}%
        </span>
      </div>
    </Link>
  );
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { slug } = await params;
  const { sort } = await searchParams;

  let data;
  try {
    data = await getCategoryData(slug);
  } catch {
    notFound();
  }

  if (!data || !data.category) {
    notFound();
  }

  const { category, products } = data;

  const sortedProducts = [...products];
  if (sort === "low-high") {
    sortedProducts.sort((a, b) => a.today - b.today);
  } else if (sort === "high-low") {
    sortedProducts.sort((a, b) => b.today - a.today);
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6">
      <div className="mb-6 flex items-center gap-4 rounded-2xl border border-base-200 bg-white p-5 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-base-200 text-2xl">
          {category.icon || "🛒"}
        </div>
        <div>
          <h1 className="text-xl font-bold text-base-content">
            {category.nameBn}
          </h1>
          <p className="mt-0.5 text-xs text-base-content/60">
            {toBengaliNumber(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
          </p>
        </div>
      </div>

      <form
        method="GET"
        className="mb-4 flex flex-col items-stretch gap-2 rounded-xl border border-base-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-end"
      >
        <span className="text-sm text-base-content/70">সাজান:</span>
        <select
          name="sort"
          defaultValue={sort || "default"}
          className="select select-bordered select-sm w-full max-w-xs sm:w-auto"
        >
          <option value="default">ডিফল্ট</option>
          <option value="low-high">দাম: কম থেকে বেশি</option>
          <option value="high-low">দাম: বেশি থেকে কম</option>
        </select>
        <button type="submit" className="btn btn-sm btn-success">
          সাজান
        </button>
      </form>

      <div className="mb-4 text-sm text-base-content/60">
        মোট {toBengaliNumber(products.length)}টি পণ্য দেখানো হচ্ছে
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-base-200 bg-base-100 py-16 text-center">
          <p className="text-lg text-base-content/60">
            এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}