import en from '../locales/en.json';
import ptBr from '../locales/pt-br.json';
import es from '../locales/es.json';

export const LANGUAGE_STORAGE_KEY = 'terminal1996_language';

export type DocumentLanguage = 'en' | 'pt-BR' | 'es';

interface DocumentLocalization {
  description: string;
  lang: DocumentLanguage;
  title: string;
}

function normalizeDocumentLanguage(language: string | null | undefined): DocumentLanguage {
  if (language === 'pt-BR' || language === 'pt-br') return 'pt-BR';
  if (language === 'es') return 'es';
  return 'en';
}

export const DOCUMENT_LOCALIZATION: Record<DocumentLanguage, DocumentLocalization> = {
  en: {
    lang: 'en',
    title: en['metadata.title'],
    description: en['metadata.description'],
  },
  'pt-BR': {
    lang: 'pt-BR',
    title: ptBr['metadata.title'],
    description: ptBr['metadata.description'],
  },
  es: {
    lang: 'es',
    title: es['metadata.title'],
    description: es['metadata.description'],
  },
};

export function getDocumentLocalization(language: string | null | undefined): DocumentLocalization {
  return DOCUMENT_LOCALIZATION[normalizeDocumentLanguage(language)];
}
