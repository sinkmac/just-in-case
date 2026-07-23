import type { Metadata } from "next";
import { Fraunces, Public_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  weight: ["400", "500"],
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
      className={`${fraunces.variable} ${publicSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}