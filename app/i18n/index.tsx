'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import en from '../locales/en.json';
import ptBr from '../locales/pt-br.json';
import es from '../locales/es.json';
import { RUNTIME_TRANSLATIONS } from './runtime';

export type Language = 'en' | 'pt-BR' | 'es';

const STORAGE_KEY = 'terminal1996_language';
const LANGUAGE_OPTIONS: Language[] = ['en', 'pt-BR', 'es'];

type LocaleDictionary = Record<string, string>;
type TranslationValues = Record<string, string | number>;

const LOCALES: Record<Language, LocaleDictionary> = {
  en,
  'pt-BR': ptBr,
  es,
};

function normalizeLanguage(value: string | null | undefined): Language {
  if (!value) return 'en';
  if (value === 'pt-br' || value === 'pt-BR') return 'pt-BR';
  if (value === 'es') return 'es';
  return 'en';
}

function interpolate(template: string, values?: TranslationValues): string {
  if (!values) return template;
  return template.replace(/\{\{(.*?)\}\}/g, (_, token: string) => {
    const key = token.trim();
    const value = values[key];
    return value === undefined || value === null ? '' : String(value);
  });
}

function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    return normalizeLanguage(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return 'en';
  }
}

function persistLanguage(language: Language): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Ignore storage failures and keep in-memory language.
  }
}

export function translateStatic(
  key: string,
  values?: TranslationValues,
  fallback?: string,
  language?: Language
): string {
  const targetLanguage = language ?? getStoredLanguage();
  const message = LOCALES[targetLanguage][key] ?? LOCALES.en[key] ?? fallback ?? key;
  return interpolate(message, values);
}

interface I18nContextValue {
  language: Language;
  languages: Language[];
  setLanguage: (language: Language) => void;
  t: (key: string, values?: TranslationValues, fallback?: string) => string;
  translateRuntimeText: (text: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const FALLBACK_CONTEXT: I18nContextValue = {
  language: 'en',
  languages: LANGUAGE_OPTIONS,
  setLanguage: () => undefined,
  t: (key, values, fallback) => translateStatic(key, values, fallback, 'en'),
  translateRuntimeText: (text: string) => text,
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    setLanguageState(getStoredLanguage());
  }, []);

  const setLanguage = useCallback((nextLanguage: Language) => {
    const normalized = normalizeLanguage(nextLanguage);
    setLanguageState(normalized);
    persistLanguage(normalized);
  }, []);

  const t = useCallback(
    (key: string, values?: TranslationValues, fallback?: string) =>
      translateStatic(key, values, fallback, language),
    [language]
  );

  const translateRuntimeText = useCallback(
    (text: string) => {
      if (language === 'en' || !text) return text;
      const unknownCommandPrefix = 'Unknown command: ';
      if (text.startsWith(unknownCommandPrefix)) {
        return t('runtime.unknownCommand', { value: text.slice(unknownCommandPrefix.length) }, text);
      }
      if (text === 'ERROR: Unknown command') {
        return t('runtime.errorUnknownCommand', undefined, text);
      }
      if (text === 'INPUT TOO LONG') {
        return t('runtime.inputTooLong', undefined, text);
      }
      const invalidAttemptsMatch = text.match(/^(\s*)\[Invalid attempts: (\d+)\/8\]$/);
      if (invalidAttemptsMatch) {
        return `${invalidAttemptsMatch[1]}${t('runtime.invalidAttempts', { value: invalidAttemptsMatch[2] })}`;
      }
      const directoryMatch = text.match(/^Directory:\s*(.+)$/);
      if (directoryMatch) {
        return `${t('runtime.directoryPrefix')}: ${directoryMatch[1]}`;
      }
      const translated = RUNTIME_TRANSLATIONS[language][text];
      return translated ?? text;
    },
    [language, t]
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      languages: LANGUAGE_OPTIONS,
      setLanguage,
      t,
      translateRuntimeText,
    }),
    [language, setLanguage, t, translateRuntimeText]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  return context ?? FALLBACK_CONTEXT;
}
