import "./../styles/globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import Nav from "@/components/Nav";
import { AudioProvider } from "@/providers/AudioProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const jet = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Matthew — Software Engineer",
  description: "AI-tinged, interactive portfolio showcasing robust software work.",
  openGraph: { title: "Matthew — Software Engineer", url: "https://example.com", type: "website" },
  metadataBase: new URL("https://example.com"),
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, space.variable, jet.variable, "antialiased")}>
        <AudioProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus-ring">
            Skip to content
          </a>
          <Nav />
          <main id="main">{children}</main>
          <footer className="px-6 py-10 text-sm text-muted">© {new Date().getFullYear()} Matthew.</footer>
          <Analytics />
        </AudioProvider>
      </body>
    </html>
  );
}
