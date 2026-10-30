'use client'
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending, error } = authClient.useSession();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center px-4 py-20">
        <span className="loading loading-spinner loading-lg text-success"></span>
        <p className="mt-4 text-sm text-base-content/60">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-20 text-center">
        <p className="text-lg text-red-500">সমস্যা হয়েছে: {error.message}</p>
        <Link href="/" className="btn btn-success mt-4">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    const formData = new FormData(e.currentTarget);
    const newName = formData.get("name") as string;

    const { error } = await authClient.updateUser({ name: newName });

    if (error) {
      toast.error(error.message || "আপডেট ব্যর্থ হয়েছে।");
    } else {
      toast.success("তথ্য সফলভাবে আপডেট হয়েছে।");
    }
    setIsUpdating(false);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-6 bg-[#f4fbf7] min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-base-content">আমার প্রোফাইল</h1>
        <p className="mt-1 text-sm text-base-content/60">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
        </p>
      </div>

      <div className="flex flex-col gap-6">

        <div className="rounded-2xl border border-base-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-base-200/50">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">👤</span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-base-content">
                  {user.name}
                </h2>
                <p className="mt-0.5 text-sm text-base-content/70">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="btn btn-outline btn-error btn-sm rounded-lg px-4"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              সাইন আউট
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-base-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="mb-6 text-lg font-bold text-base-content">তথ্য</h2>

          <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-base-content">
                নাম
              </label>
              <input
                type="text"
                name="name"
                defaultValue={user.name}
                required
                placeholder="আপনার নাম লিখুন"
                className="input input-bordered w-full rounded-lg text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="mt-2 w-full rounded-lg bg-[#15803d] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-800 disabled:opacity-50"
            >
              {isUpdating ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}