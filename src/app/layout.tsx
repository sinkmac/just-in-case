import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://justincase.scot"),
  title: "Just In Case — Emergency Food Calculator for UK Households",
  description:
    "Calculate how much long-life food your UK household can buy within budget, with shelf-stable categories, calories, storage estimates, and Amazon-linked shopping routes.",
  alternates: { canonical: "https://justincase.scot/" },
  openGraph: {
    title: "Just In Case — Emergency Food Calculator for UK Households",
    description:
      "A free UK just-in-case pantry calculator for long-life food, budget reality, storage space, and printable shopping lists.",
    url: "https://justincase.scot/",
    type: "website",
    siteName: "Just In Case",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
