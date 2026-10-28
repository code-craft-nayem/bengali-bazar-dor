import Footer from "@/components/Footer";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { Noto_Serif_Bengali } from "next/font/google";
import Header from "@/components/Header";
import { Metadata } from "next";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";


const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["latin", "bengali"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "বাজার দর | BazarDor",
  description: "প্রয়োজনীয় পণ্যের দাম এক নজরে।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      data-theme="light"
      className={`${notoSerifBengali.className} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <Suspense fallback={<div className="h-8" />}>
          {/* Marquee will be added here in P3 */}
        </Suspense>
        <main className="mx-auto w-full max-w-6xl flex-1">
          <Suspense fallback={<p className="py-8 text-center">লোড হচ্ছে...</p>}>
            {children}
          </Suspense>
        </main>
        <footer className="mt-auto">
          <Footer />
        </footer>
        <ToastContainer position="top-center" autoClose={3500} />
      </body>
    </html >
  );
}