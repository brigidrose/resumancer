import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";


const SITE_URL = "https://resumancer.app";

export const metadata = {
  title: "Resumancer",
  description: "Unconventional Marketability Coach",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}


