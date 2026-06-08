import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://chawin.dev"),
  title: {
    default: "Chawin Phaikeaw — Computer Engineering Student & Builder",
    template: "%s | Chawin Phaikeaw",
  },
  description:
    "Computer Engineering student passionate about AI, Robotics, and Entrepreneurship. International experience across Thailand and Finland. Building meaningful things.",
  keywords: [
    "Chawin Phaikeaw",
    "Computer Engineering",
    "AI",
    "Robotics",
    "Entrepreneurship",
    "Thailand",
    "Finland",
    "Aalto University",
    "ODOS",
    "Portfolio",
  ],
  authors: [{ name: "Chawin Phaikeaw" }],
  creator: "Chawin Phaikeaw",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chawin.dev",
    siteName: "Chawin Phaikeaw",
    title: "Chawin Phaikeaw — Computer Engineering Student & Builder",
    description:
      "Computer Engineering student passionate about AI, Robotics, and Entrepreneurship. International experience across Thailand and Finland.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chawin Phaikeaw — Computer Engineering Student & Builder",
    description:
      "Computer Engineering student passionate about AI, Robotics, and Entrepreneurship.",
  },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
