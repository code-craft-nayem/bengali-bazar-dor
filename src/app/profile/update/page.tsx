'use client'
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  if (!session) {
    return null;
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {

    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const newName = formData.get("name") as string;

    const { error } = await authClient.updateUser({ name: newName });

    if (error) {
      setMessage({ type: "error", text: error.message || "আপডেট ব্যর্থ হয়েছে।" });
    } else {
      setMessage({ type: "success", text: "তথ্য সফলভাবে আপডেট হয়েছে।" });
      setTimeout(() => router.push("/profile"), 1500);
    }
    setIsUpdating(false);
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-8 md:px-6">
      <div className="mb-6">
        <Link href="/profile" className="text-sm text-success hover:underline">
          ← প্রোফাইলে ফিরে যান
        </Link>
      </div>

      <div className="rounded-3xl border border-base-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="mb-2 text-xl font-bold text-base-content">তথ্য আপডেট করুন</h1>
        <p className="mb-6 text-sm text-base-content/60">
          আপনার নাম পরিবর্তন করতে পারেন।
        </p>

        {message && (
          <div
            className={`mb-4 rounded-lg p-3 text-sm ${message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
              }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-base-content">
              নাম
            </label>
            <input
              type="text"
              name="name"
              defaultValue={session.user.name}
              required
              className="input input-bordered w-full"
              placeholder="আপনার নাম লিখুন"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="btn btn-success w-full rounded-md"
          >
            {isUpdating ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "আপডেট করুন"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}