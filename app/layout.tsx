import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Note App - Minimal Online Note Taking",
    template: "%s | Note App"
  },
  description:
    "Note App is a minimal online note app with auto-save, shareable slug URLs, and image upload support. Create and share notes instantly.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg"
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  openGraph: {
    title: "Note App - Minimal Online Note Taking",
    description:
      "Note App is a minimal online note app with auto-save, shareable slug URLs, and image upload support.",
    type: "website",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "Note App - Minimal Online Note Taking",
    description:
      "Note App is a minimal online note app with auto-save, shareable slug URLs, and image upload support."
  },
  keywords: [
    "note app",
    "note taking",
    "online notes",
    "shareable notes",
    "auto-save",
    "quick notes"
  ],
  authors: [{ name: "Note App" }],
  creator: "Note App",
  category: "Productivity"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var saved=localStorage.getItem("theme");var dark=saved?saved==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",dark);}catch(e){}})();`
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
