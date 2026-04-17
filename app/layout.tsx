import Script from 'next/script';
import type { Metadata } from 'next';
import { DOCUMENT_LOCALIZATION, LANGUAGE_STORAGE_KEY } from './i18n/documentMetadata';
import './globals.css';

const DEFAULT_DOCUMENT_LOCALIZATION = DOCUMENT_LOCALIZATION.en;
const DOCUMENT_LOCALIZATION_BOOTSTRAP = JSON.stringify(DOCUMENT_LOCALIZATION);

export const metadata: Metadata = {
  title: DEFAULT_DOCUMENT_LOCALIZATION.title,
  description: DEFAULT_DOCUMENT_LOCALIZATION.description,
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
    <html lang={DEFAULT_DOCUMENT_LOCALIZATION.lang} suppressHydrationWarning={true}>
      <head>
        <Script
          id="terminal1996-language-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                try {
                  const raw = window.localStorage.getItem(${JSON.stringify(LANGUAGE_STORAGE_KEY)});
                  const language = raw === 'pt-BR' || raw === 'pt-br' ? 'pt-BR' : raw === 'es' ? 'es' : 'en';
                  const localization = (${DOCUMENT_LOCALIZATION_BOOTSTRAP})[language] || (${DOCUMENT_LOCALIZATION_BOOTSTRAP}).en;
                  document.documentElement.lang = localization.lang;
                  document.title = localization.title;
                  let descriptionMeta = document.querySelector('meta[name="description"]');
                  if (!descriptionMeta) {
                    descriptionMeta = document.createElement('meta');
                    descriptionMeta.setAttribute('name', 'description');
                    document.head.appendChild(descriptionMeta);
                  }
                  descriptionMeta.setAttribute('content', localization.description);
                } catch (_error) {
                  // Ignore bootstrap failures and keep the default locale.
                }
              })();
            `,
          }}
        />
      </head>
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
