import type { Metadata } from "next";
import en from "./locales/en.json";
import es from "./locales/es.json";
import ptBr from "./locales/pt-br.json";
import "./globals.css";

const LANGUAGE_STORAGE_KEY = 'terminal1996_language';

const LOCALIZED_METADATA = {
  en: {
    title: en["meta.title"],
    description: en["meta.description"],
  },
  'pt-BR': {
    title: ptBr["meta.title"],
    description: ptBr["meta.description"],
  },
  es: {
    title: es["meta.title"],
    description: es["meta.description"],
  },
} as const;

const I18N_BOOTSTRAP_SCRIPT = `
(() => {
  const locales = ${JSON.stringify(LOCALIZED_METADATA)};
  const storageKey = ${JSON.stringify(LANGUAGE_STORAGE_KEY)};
  const normalizeLanguage = (value) => {
    if (value === 'pt-BR' || value === 'pt-br') return 'pt-BR';
    if (value === 'es') return 'es';
    return 'en';
  };

  try {
    const language = normalizeLanguage(window.localStorage.getItem(storageKey));
    const locale = locales[language] ?? locales.en;

    document.documentElement.lang = language;
    document.title = locale.title;

    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement('meta');
      description.setAttribute('name', 'description');
      document.head.appendChild(description);
    }

    description.setAttribute('content', locale.description);
  } catch {
    // Fall back to the default static metadata when storage is unavailable.
  }
})();
`;

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
    <html lang="und" suppressHydrationWarning={true}>
      <body
        className="antialiased"
        // suppressHydrationWarning is required because Next.js injects attributes
        // (e.g. class, style) into <body> at runtime for font-loading and theming,
        // which differ from the server-rendered HTML and would trigger a React
        // hydration mismatch warning without this flag.
        suppressHydrationWarning={true}
      >
        <script dangerouslySetInnerHTML={{ __html: I18N_BOOTSTRAP_SCRIPT }} />
        {children}
      </body>
    </html>
  );
}
