import type { Metadata } from "next";
import en from "./locales/en.json";
import "./globals.css";

export const metadata: Metadata = {
  title: en["meta.title"],
  description: en["meta.description"],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
        // suppressHydrationWarning is required because Next.js injects attributes
        // (e.g. class, style) into <body> at runtime for font-loading and theming,
        // which differ from the server-rendered HTML and would trigger a React
        // hydration mismatch warning without this flag.
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
