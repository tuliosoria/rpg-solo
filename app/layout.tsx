import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RPG Solo",
  description: "Narrativa interativa solo com testes de habilidade e capítulos dinâmicos.",
  applicationName: "RPG Solo",
  authors: [{ name: "RPG Solo" }],
  viewport: { width: "device-width", initialScale: 1, viewportFit: "cover" },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#10b981" },
    { media: "(prefers-color-scheme: dark)", color: "#065f46" }
  ],
  other: { "color-scheme": "light dark" }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <a
          href="#app-main"
          className="skip-link"
          style={{
            position: 'absolute', left: '-1000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden'
          }}
        >Ir para conteúdo principal</a>
        <div id="app-shell" className="app-shell" style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
          <main id="app-main" className="flex-1" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {children}
          </main>
          <footer style={{ padding: 'var(--space-6) 0', fontSize: 'var(--text-xs)', textAlign: 'center', opacity: .55 }}>
            <div className="container-balanced" style={{ color: 'var(--foreground-muted)' }}>
              © {new Date().getFullYear()} RPG Solo — Experiência narrativa experimental
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

