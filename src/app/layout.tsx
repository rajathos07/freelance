import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VYNEX — Next Starts Here.",
  description: "Vision + Next; future-ready technology. Portfolio & digital studio of Rajath (Developer) & Ifhaam (Freelance).",
  keywords: ["VYNEX", "Creative Developer", "Next.js", "TypeScript", "Python", "FastAPI", "Portfolio"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="selection:bg-[#7b57f5] selection:text-white">
        {children}
      </body>
    </html>
  );
}
