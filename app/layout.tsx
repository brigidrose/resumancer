import "../styles/globals.css";

const SITE_URL = "https://resumancer.app";

export const metadata = {
  title: "Resumancer",
  description: "Unconventional Marketability Coach",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

