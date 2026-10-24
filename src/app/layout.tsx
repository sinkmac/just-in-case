import type { Metadata, Viewport } from "next";
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
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://justincase.scot"),
  title: "Just In Case",
  description:
    "See what your household needs for three days without shops, power or water, then get a shopping list of what's missing.",
  alternates: { canonical: "https://justincase.scot/" },
  openGraph: {
    title: "Just In Case",
    description:
      "See what your household needs for three days without shops, power or water, then get a shopping list of what's missing.",
    url: "https://justincase.scot/",
    type: "website",
    siteName: "Just In Case",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Be ready for three days. Just In Case",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F1E3",
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