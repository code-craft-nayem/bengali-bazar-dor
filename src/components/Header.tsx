"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    fetch("https://openapi.programming-hero.com/api/bazardor/categories")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const isActive = (slug: string) => pathname === `/category/${slug}`;

  const handleSignOut = async () => {
    if (isSigningOut) return;

    try {
      setIsSigningOut(true);

      await authClient.signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছে!");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
      setIsSigningOut(false);
    }
  };

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
                className="btn btn-ghost btn-sm gap-2 rounded-full px-2 hover:bg-base-200/50"
              >
                {session.user.image ? (
                  <div className="avatar">
                    <div className="w-8 rounded-full ring ring-success/20 ring-offset-base-100 ring-offset-1">
                      <Image
                        src={session.user.image}
                        alt={session.user.name}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="avatar placeholder">
                    <div className="w-8 rounded-full bg-neutral text-neutral-content">
                      <span className="text-sm">👤</span>
                    </div>
                  </div>
                )}

                <span className="hidden font-medium sm:inline">
                  {session.user.name?.split(" ")[0]}
                </span>

                <svg
                  className="hidden h-3 w-3 text-base-content/50 sm:inline"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content menu z-50 mt-3 w-64 rounded-2xl border border-base-200 bg-base-100 p-2 shadow-xl shadow-base-300/20"
              >
                <li className="pointer-events-none mb-1 border-b border-base-200 px-4 py-3">
                  <div className="block min-w-0 cursor-default">
                    <p className="truncate text-sm font-bold text-base-content">
                      {session.user.name}
                    </p>

                    <p className="truncate text-xs text-base-content/60">
                      {session.user.email}
                    </p>
                  </div>
                </li>

                <li>
                  <Link
                    href="/profile"
                    className="group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-base-content/80 transition-colors hover:bg-success/10 hover:text-success"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-base-200 text-success transition-colors group-hover:bg-success group-hover:text-white">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </span>

                    আমার প্রোফাইল
                  </Link>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="group mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-base-content/80 transition-colors hover:bg-error/10 hover:text-error disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-base-200 text-error transition-colors group-hover:bg-error group-hover:text-white">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                    </span>

                    {isSigningOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
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
              className={`flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-sm transition-colors ${isActive(cat.slug)
                ? "bg-success font-semibold text-success-content"
                : "text-base-content/70 hover:bg-base-200"
                }`}
            >
              {cat.icon && <span>{cat.icon}</span>}
              <span>{cat.nameBn}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
