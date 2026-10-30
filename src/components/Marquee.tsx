"use client";

import Image
  from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import MarqueeText from "react-marquee-text";
import "react-marquee-text/dist/styles.css";

type ApiChange = {
  dir?: "up" | "down" | "flat" | string;
  pct?: number;
};

type RawProduct = {
  id: string | number;
  nameBn?: string;
  name?: string;
  unit?: string;
  today?: number | string;
  change?: ApiChange | number | string | null;
  icon?: string;
  image?: string;
};

type TickerItem = {
  id: string;
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

function toSafeNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const cleaned = value.replace(/[%\s+]/g, "");
    const parsed = Number(cleaned);

    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function normalizeChange(
  raw: RawProduct
): { dir: "up" | "down" | "flat"; pct: number } {
  const c = raw.change;

  if (c && typeof c === "object" && !Array.isArray(c)) {
    const dir =
      c.dir === "up" || c.dir === "down" || c.dir === "flat"
        ? c.dir
        : "flat";

    const pct = toSafeNumber(c.pct) ?? 0;

    return { dir, pct: Math.abs(pct) };
  }

  const numeric = toSafeNumber(c);

  if (numeric !== null) {
    if (numeric > 0) return { dir: "up", pct: numeric };
    if (numeric < 0) return { dir: "down", pct: Math.abs(numeric) };

    return { dir: "flat", pct: 0 };
  }

  return { dir: "flat", pct: 0 };
}

function isImageUrl(value?: string): value is string {
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

export default function Marquee() {
  const [items, setItems] = useState<TickerItem[]>([]);

  useEffect(() => {
    fetch("https://openapi.programming-hero.com/api/bazardor/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data: unknown) => {
        const list = Array.isArray(data)
          ? (data as RawProduct[])
          : Array.isArray((data as { data?: RawProduct[] })?.data)
            ? (data as { data: RawProduct[] }).data
            : [];

        const mapped: TickerItem[] = list
          .map((raw) => {
            const { dir, pct } = normalizeChange(raw);
            const today = toSafeNumber(raw.today) ?? 0;

            return {
              id: String(raw.id),
              nameBn: raw.nameBn ?? raw.name ?? "",
              unit: raw.unit ?? "",
              today,
              pct,
              dir,
              icon: raw.icon,
              image: raw.image,
            };
          })
          .filter((item) => item.nameBn !== "");

        const decreasing = mapped.filter((i) => i.dir === "down");
        const rest = mapped.filter((i) => i.dir !== "down");

        const seed = Math.floor(Date.now() / 60000);
        const shuffledDecreasing = seededShuffle(decreasing, seed);

        setItems([...shuffledDecreasing, ...rest]);
      })
      .catch((error) => {
        console.error("Marquee fetch error:", error);
        setItems([]);
      });
  }, []);

  if (items.length === 0) {
    return <div className="h-8" />;
  }

  return (
    <div className="w-full overflow-hidden border-b border-base-200 bg-base-100 py-2 text-sm">
      <MarqueeText
        className="py-1"
        direction="right"
        duration={40}
      >
        {items.map((item) => {
          const color =
            item.dir === "up"
              ? "text-red-500"
              : item.dir === "down"
                ? "text-green-600"
                : "text-gray-500";

          const symbol =
            item.dir === "up" ? "▲" : item.dir === "down" ? "▼" : "—";

          const safePct = Number.isFinite(item.pct) ? item.pct : 0;

          return (
            <Link
              key={item.id}
              href={`/product/${item.id}`}
              className="group relative mx-4 inline-flex items-center gap-1.5 whitespace-nowrap font-medium no-underline"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-200 group-hover:scale-x-100"
              />

              {isImageUrl(item.image) ? (
                <Image
                  src={item.image.trim()}
                  alt={item.nameBn}
                  width={20}
                  height={20}
                  className="h-5 w-5 rounded-full object-cover"
                />
              ) : isEmoji(item.image) ? (
                <span>{item.image}</span>
              ) : isEmoji(item.icon) ? (
                <span>{item.icon}</span>
              ) : (
                <span>🛒</span>
              )}

              <span>{item.nameBn}</span>

              <span>৳{toBengaliNumber(item.today)}</span>

              {item.unit && (
                <span className="text-[11px] text-base-content/60">
                  /{item.unit}
                </span>
              )}

              <span className={`text-[11px] ${color}`}>
                {symbol} {toBengaliNumber(Number(safePct.toFixed(1)))}%
              </span>
            </Link>
          );
        })}
      </MarqueeText>
    </div>
  );
}
