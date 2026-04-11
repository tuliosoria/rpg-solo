import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Varginha: Terminal 1996",
  description:
    "A terminal horror puzzle set during the 1996 Varginha incident. Explore a classified Brazilian intelligence system and uncover the hidden truths before detection catches up.",
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
