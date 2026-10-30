import type { Metadata } from "next";
import { Noto_Serif_Bengali } from "next/font/google";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["latin", "bengali"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "বাজার দর",
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
        <Suspense fallback={<div className="h-16" />}>
          <Header />
        </Suspense>
        <Suspense fallback={<div className="h-8" />}>
          <Marquee />
        </Suspense>
        <main className="w-full flex-1 bg-[#f4fbf7]">
          <div className="mx-auto w-full max-w-6xl ">

            {children}

          </div>
        </main>
        <footer className="mt-auto">
          <Footer />
        </footer>
        <ToastContainer position="top-center" autoClose={3500} />
      </body>
    </html>
  );
}