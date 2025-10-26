import type { Metadata } from "next";

export const defaultMetadata: Metadata = {
  title: {
    default: "Matthew — Software Engineer",
    template: "%s | Matthew",
  },
  description: "AI-tinged, interactive portfolio showcasing robust software work.",
  keywords: ["Software Engineer", "Web Developer", "TypeScript", "React", "Next.js", "3D", "WebGL"],
  authors: [{ name: "Matthew" }],
  creator: "Matthew",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://example.com",
    title: "Matthew — Software Engineer",
    description: "AI-tinged, interactive portfolio showcasing robust software work.",
    siteName: "Matthew Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matthew — Software Engineer",
    description: "AI-tinged, interactive portfolio showcasing robust software work.",
    creator: "@matthewcks",
  },
  metadataBase: new URL("https://example.com"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
