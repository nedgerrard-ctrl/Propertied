import type { Metadata } from "next";
import { Geist, Cormorant_Garamond } from "next/font/google";
import Providers from "./components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PPM — Property Project Marketing | Melbourne Off-the-Plan Specialists",
    template: "%s | PPM Property Project Marketing",
  },
  description:
    "PPM are business and management consultants with a real estate licence — Melbourne's off-the-plan apartment and townhouse specialists since 2013. We find, manage and resell properties for investors and owner-occupiers.",
  keywords: [
    "off-the-plan Melbourne",
    "property investment Melbourne",
    "off-the-plan apartments Melbourne",
    "property management Melbourne",
    "property project marketing",
    "new apartments Melbourne",
    "townhouse investment Melbourne",
  ],
  openGraph: {
    siteName: "PPM — Property Project Marketing",
    locale: "en_AU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${cormorant.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}