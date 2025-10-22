import "../styles/globals.css";

export const metadata = {
  title: "Resumancer",
  description: "Brigid Bot – Resumancer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

