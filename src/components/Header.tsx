"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

function getBengaliDate() {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());
}
export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("https://openapi.programming-hero.com/api/bazardor/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const isActive = (slug: string) => pathname === `/category/${slug}`;

  return (
    <header className="w-full border-b border-base-300 bg-base-100">

      <div className="navbar mx-auto max-w-6xl px-4">
        <div className="navbar-start">
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-xl font-bold text-success">
              🛒 বাজার দর
            </span>
            <span className="text-xs text-base-content/60">
              {getBengaliDate()}
            </span>
          </Link>
        </div>

        <div className="navbar-end gap-2">
          {isPending ? (
            <span className="loading loading-spinner loading-sm" />
          ) : session?.user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-sm gap-1"
              >
                <span className="text-lg">👤</span>
                <span className="hidden sm:inline">
                  {session.user.name || session.user.email}
                </span>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow"
              >
                <li>
                  <Link href="/profile">প্রোফাইল</Link>
                </li>
                <li>
                  <button
                    onClick={async () => {
                      await authClient.signOut();
                      router.push("/");
                    }}
                  >
                    সাইন আউট
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link href="/signin" className="btn btn-ghost btn-sm">
                সাইন ইন
              </Link>
              <Link href="/signup" className="btn btn-success btn-sm">
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-base-200">
        <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-1.5">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-sm whitespace-nowrap transition-colors ${isActive(cat.slug)
                ? "bg-success text-success-content font-semibold"
                : "text-base-content/70 hover:bg-base-200"
                }`}
            >
              {cat.icon && <span>{cat.icon}</span>}
              <span>{cat.nameBn}</span>
            </Link>
          ))}
        </div>
      </div>
    </header >
  );
}