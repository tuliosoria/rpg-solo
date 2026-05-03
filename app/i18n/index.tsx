'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import en from '../locales/en.json';
import ptBr from '../locales/pt-br.json';
import es from '../locales/es.json';
import { RUNTIME_TRANSLATIONS } from './runtime';
import { setTrayLanguage } from '../lib/steamBridge';

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

const INLINE_RUNTIME_TAG_KEYS = {
  READ: 'runtime.readLabel',
  UNREAD: 'runtime.unreadLabel',
  CORRUPTED: 'runtime.fileStatus.corrupted',
  ENCRYPTED: 'runtime.fileStatus.encrypted',
  RESTRICTED: 'runtime.fileStatus.restricted',
  RESTRICTED_BRIEFING: 'runtime.fileStatus.restrictedBriefing',
  UNSTABLE: 'runtime.fileStatus.unstable',
  CONDITIONAL: 'runtime.fileStatus.conditional',
} as const;

type InlineRuntimeTag = keyof typeof INLINE_RUNTIME_TAG_KEYS;

function isInlineRuntimeTag(value: string): value is InlineRuntimeTag {
  return Object.prototype.hasOwnProperty.call(INLINE_RUNTIME_TAG_KEYS, value);
}

function normalizeRuntimePresentation(text: string): string {
  return text.replace(/^\[UFO74\]:\s*/, 'UFO74: ');
}

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

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.title = translateStatic('meta.title', undefined, undefined, language);

      const description = document.querySelector('meta[name="description"]');
      if (description) {
        description.setAttribute(
          'content',
          translateStatic('meta.description', undefined, undefined, language)
        );
      }
    }

    void setTrayLanguage(language);
  }, [language]);

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
    (text: string): string => {
      if (!text) return text;
      if (language === 'en') return normalizeRuntimePresentation(text);
      const applyLeadingWhitespace = (
        match: RegExpMatchArray,
        key: string,
        values?: TranslationValues,
        fallback?: string
      ) => `${match[1] ?? ''}${t(key, values, fallback)}`;
      const unknownCommandPrefix = 'Unknown command: ';
      if (text.startsWith(unknownCommandPrefix)) {
        return normalizeRuntimePresentation(
          t('runtime.unknownCommand', { value: text.slice(unknownCommandPrefix.length) }, text)
        );
      }
      if (text === 'ERROR: Unknown command') {
        return normalizeRuntimePresentation(t('runtime.errorUnknownCommand', undefined, text));
      }
      if (text === 'INPUT TOO LONG') {
        return normalizeRuntimePresentation(t('runtime.inputTooLong', undefined, text));
      }
      const invalidAttemptsMatch = text.match(/^(\s*)\[Invalid attempts: (\d+)\/8\]$/);
      if (invalidAttemptsMatch) {
        return `${invalidAttemptsMatch[1]}${t('runtime.invalidAttempts', { value: invalidAttemptsMatch[2] })}`;
      }
      const directoryMatch = text.match(/^Directory:\s*(.+)$/);
      if (directoryMatch) {
        return `${t('runtime.directoryPrefix')}: ${directoryMatch[1]}`;
      }
      const maximumCommandLengthMatch = text.match(/^Maximum command length is (\d+) characters\.$/);
      if (maximumCommandLengthMatch) {
        return t(
          'runtime.maximumCommandLength',
          { value: maximumCommandLengthMatch[1] },
          text
        );
      }
      const changedToMatch = text.match(/^Changed to:\s*(.+)$/);
      if (changedToMatch) {
        return t('runtime.changedTo', { value: changedToMatch[1] }, text);
      }
      const andMoreMatch = text.match(/^\.\.\.\s+and\s+(\d+)\s+more$/);
      if (andMoreMatch) {
        return t('runtime.andMore', { value: andMoreMatch[1] }, text);
      }
      const commandNotRecognizedMatch = text.match(/^Command not recognized:\s*(.+)$/);
      if (commandNotRecognizedMatch) {
        return t('runtime.commandNotRecognized', { value: commandNotRecognizedMatch[1] }, text);
      }
      const unknownGodCommandMatch = text.match(/^Unknown god command:\s*(.+)$/);
      if (unknownGodCommandMatch) {
        return t('runtime.unknownGodCommand', { value: unknownGodCommandMatch[1] }, text);
      }
      const errorDirectoryNotFoundMatch = text.match(/^ERROR: Directory not found:\s*(.+)$/);
      if (errorDirectoryNotFoundMatch) {
        return t(
          'runtime.errorDirectoryNotFound',
          { value: errorDirectoryNotFoundMatch[1] },
          text
        );
      }
      const errorNotDirectoryMatch = text.match(/^ERROR: Not a directory:\s*(.+)$/);
      if (errorNotDirectoryMatch) {
        return t('runtime.errorNotDirectory', { value: errorNotDirectoryMatch[1] }, text);
      }
      const errorFileNotFoundMatch = text.match(/^ERROR: File not found:\s*(.+)$/);
      if (errorFileNotFoundMatch) {
        return t('runtime.errorFileNotFound', { value: errorFileNotFoundMatch[1] }, text);
      }
      const errorFileNoLongerAccessibleMatch = text.match(
        /^ERROR: File no longer accessible:\s*(.+)$/
      );
      if (errorFileNoLongerAccessibleMatch) {
        return t(
          'runtime.errorFileNoLongerAccessible',
          { value: errorFileNoLongerAccessibleMatch[1] },
          text
        );
      }
      const errorIsDirectoryMatch = text.match(/^ERROR:\s+(.+)\s+is a directory$/);
      if (errorIsDirectoryMatch) {
        return t('runtime.errorIsDirectory', { value: errorIsDirectoryMatch[1] }, text);
      }
      const currentLocationMatch = text.match(/^Current location:\s*(.+)$/);
      if (currentLocationMatch) {
        return t('runtime.currentLocation', { value: currentLocationMatch[1] }, text);
      }
      const rereadingMatch = text.match(/^\[Re-reading:\s*(.+)\]$/);
      if (rereadingMatch) {
        return t('runtime.rereading', { value: rereadingMatch[1] }, text);
      }
      const noteSavedMatch = text.match(/^Note saved:\s*"([\s\S]+)"$/);
      if (noteSavedMatch) {
        return t('runtime.noteSaved', { value: noteSavedMatch[1] }, text);
      }
      const notesTotalMatch = text.match(/^\[(\d+)\s+notes total - use "notes" to view\]$/);
      if (notesTotalMatch) {
        return t('runtime.notesTotal', { value: notesTotalMatch[1] }, text);
      }
      const unreadFilesHeaderMatch = text.match(/^(\s*)UNREAD FILES \((\d+)\)(\s*)$/);
      if (unreadFilesHeaderMatch) {
        return `${unreadFilesHeaderMatch[1]}${t(
          'runtime.unreadFilesHeader',
          { value: unreadFilesHeaderMatch[2] },
          `UNREAD FILES (${unreadFilesHeaderMatch[2]})`
        )}${unreadFilesHeaderMatch[3]}`;
      }
      const evidenceLegendMatch = text.match(/^(\s*)([^=\s]+)=evidence logged$/);
      if (evidenceLegendMatch) {
        return `${evidenceLegendMatch[1]}${t(
          'runtime.evidenceLegend',
          { symbol: evidenceLegendMatch[2] },
          `${evidenceLegendMatch[2]}=evidence logged`
        )}`;
      }
      const evidenceFoundMatch = text.match(/^Evidence found:\s*(\d+)\/(\d+)$/);
      if (evidenceFoundMatch) {
        return t(
          'runtime.evidenceFound',
          { current: evidenceFoundMatch[1], total: evidenceFoundMatch[2] },
          text
        );
      }
      const evidenceFoundCapitalizedMatch = text.match(/^(\s*)Evidence Found:\s*(\d+)\/(\d+)$/);
      if (evidenceFoundCapitalizedMatch) {
        return applyLeadingWhitespace(
          evidenceFoundCapitalizedMatch,
          'runtime.evidenceFound',
          {
            current: evidenceFoundCapitalizedMatch[2],
            total: evidenceFoundCapitalizedMatch[3],
          },
          text
        );
      }
      const caseStatusMatch = text.match(/^(\s*)CASE STATUS:\s*(\d+)\/(\d+)\s+evidence confirmed$/);
      if (caseStatusMatch) {
        return applyLeadingWhitespace(
          caseStatusMatch,
          'runtime.caseStatus',
          { current: caseStatusMatch[2], total: caseStatusMatch[3] },
          text
        );
      }
      const strengthLabelMatch = text.match(/^(\s*)STRENGTH:\s*(.+)$/);
      if (strengthLabelMatch) {
        return applyLeadingWhitespace(
          strengthLabelMatch,
          'runtime.strengthLabel',
          { value: translateRuntimeText(strengthLabelMatch[2]) },
          text
        );
      }
      const filesExaminedMatch = text.match(/^(\s*)Files examined:\s*(\d+)$/);
      if (filesExaminedMatch) {
        return applyLeadingWhitespace(
          filesExaminedMatch,
          'runtime.filesExamined',
          { value: filesExaminedMatch[2] },
          text
        );
      }
      const evidenceDocumentedMatch = text.match(/^(\s*)Evidence documented:\s*(\d+)\/(\d+)$/);
      if (evidenceDocumentedMatch) {
        return applyLeadingWhitespace(
          evidenceDocumentedMatch,
          'runtime.evidenceDocumented',
          { current: evidenceDocumentedMatch[2], total: evidenceDocumentedMatch[3] },
          text
        );
      }
      const purgeInMatch = text.match(/^(\s*)▓▓▓ PURGE IN (\d+) ▓▓▓$/);
      if (purgeInMatch) {
        return applyLeadingWhitespace(
          purgeInMatch,
          'runtime.purgeIn',
          { value: purgeInMatch[2] },
          text
        );
      }
      const purgeCountdownMatch = text.match(/^(\s*)\[PURGE COUNTDOWN: (\d+)\]$/);
      if (purgeCountdownMatch) {
        return applyLeadingWhitespace(
          purgeCountdownMatch,
          'runtime.purgeCountdown',
          { value: purgeCountdownMatch[2] },
          text
        );
      }
      const questionsBeforeLockoutMatch = text.match(
        /^\[(\d+)\s+questions remaining before trace lockout\]$/
      );
      if (questionsBeforeLockoutMatch) {
        return t(
          'runtime.questionsRemainingBeforeTraceLockout',
          { value: questionsBeforeLockoutMatch[1] },
          text
        );
      }
      const questionsRemainingMatch = text.match(/^\[(\d+)\s+questions remaining\]$/);
      if (questionsRemainingMatch) {
        return t('runtime.questionsRemaining', { value: questionsRemainingMatch[1] }, text);
      }
      const patternStabilityMatch = text.match(/^\[Pattern stability:\s*(\d+)\s+queries remaining\]$/);
      if (patternStabilityMatch) {
        return t('runtime.patternStability', { value: patternStabilityMatch[1] }, text);
      }
      const attemptsRemainingMatch = text.match(/^\[Attempts remaining:\s*(\d+)\]$/);
      if (attemptsRemainingMatch) {
        return t('runtime.attemptsRemaining', { value: attemptsRemainingMatch[1] }, text);
      }
      const yourAnswerMatch = text.match(/^Your answer:\s*(.+)$/);
      if (yourAnswerMatch) {
        return t('runtime.yourAnswer', { value: yourAnswerMatch[1] }, text);
      }
      const expectedMatch = text.match(/^Expected:\s*(.+)$/);
      if (expectedMatch) {
        return t('runtime.expected', { value: expectedMatch[1] }, text);
      }
      const receivedMatch = text.match(/^Received:\s*(.+)$/);
      if (receivedMatch) {
        return t('runtime.received', { value: receivedMatch[1] }, text);
      }
      const verifyingCodeMatch = text.match(/^Verifying code:\s*(.+)\.\.\.$/);
      if (verifyingCodeMatch) {
        return t('runtime.verifyingCode', { value: verifyingCodeMatch[1] }, text);
      }
      const attemptsBeforeLockdownMatch = text.match(
        /^WARNING:\s*(\d+)\s+attempt\(s\)\s+remaining before lockdown$/
      );
      if (attemptsBeforeLockdownMatch) {
        return t(
          'runtime.attemptsBeforeLockdown',
          { value: attemptsBeforeLockdownMatch[1] },
          text
        );
      }
      const warningInvalidAttemptsMatch = text.match(/^WARNING:\s*Invalid attempts:\s*(\d+)\/8$/);
      if (warningInvalidAttemptsMatch) {
        return t('runtime.warningInvalidAttempts', { value: warningInvalidAttemptsMatch[1] }, text);
      }
      const tooSoonWaitMatch = text.match(
        /^Too soon\. Wait (\d+) second(s)? before trying again\.$/
      );
      if (tooSoonWaitMatch) {
        const key = tooSoonWaitMatch[1] === '1' ? 'runtime.tooSoonWait.one' : 'runtime.tooSoonWait.other';
        return t(key, { value: tooSoonWaitMatch[1] }, text);
      }
      const waitRemainingMatch = text.match(
        /^(\s*)Detection reduced\.\s*\[(\d+)\s+wait(s)? remaining\]$/
      );
      if (waitRemainingMatch) {
        const key = waitRemainingMatch[2] === '1'
          ? 'runtime.waitRemaining.one'
          : 'runtime.waitRemaining.other';
        return applyLeadingWhitespace(waitRemainingMatch, key, { value: waitRemainingMatch[2] }, text);
      }
      const leakDetectionDeltaMatch = text.match(/^DETECTION:\s*\+(\d+)%$/);
      if (leakDetectionDeltaMatch) {
        return t('runtime.leakDetectionDelta', { value: leakDetectionDeltaMatch[1] }, text);
      }
      const wrongAnswersMatch = text.match(/^Wrong answers:\s*(\d+)\/(\d+)$/);
      if (wrongAnswersMatch) {
        return t(
          'runtime.wrongAnswers',
          { current: wrongAnswersMatch[1], total: wrongAnswersMatch[2] },
          text
        );
      }
      const conspiracyDocumentsCachedMatch = text.match(
        /^You have (\d+) conspiracy document\(s\) in your cache\.$/
      );
      if (conspiracyDocumentsCachedMatch) {
        return t(
          'runtime.conspiracyDocumentsCached',
          { value: conspiracyDocumentsCachedMatch[1] },
          text
        );
      }
      const filesSavedMatch = text.match(/^(\s*)Files saved:\s*(\d+)\/(\d+)\s*$/);
      if (filesSavedMatch) {
        return applyLeadingWhitespace(
          filesSavedMatch,
          'runtime.filesSaved',
          { count: filesSavedMatch[2], total: filesSavedMatch[3] },
          text
        );
      }
      const dossierFilesSavedMatch = text.match(/^(\s*)DOSSIER:\s*(\d+)\/(\d+)\s*files saved\s*$/);
      if (dossierFilesSavedMatch) {
        return applyLeadingWhitespace(
          dossierFilesSavedMatch,
          'runtime.dossierFilesSaved',
          { count: dossierFilesSavedMatch[2], total: dossierFilesSavedMatch[3] },
          text
        );
      }
      const stepConfirmedMatch = text.match(/^(\s*)Step\s*(\d+)\/(\d+)\s*confirmed\.\s*$/);
      if (stepConfirmedMatch) {
        return applyLeadingWhitespace(
          stepConfirmedMatch,
          'runtime.stepConfirmed',
          { step: stepConfirmedMatch[2], total: stepConfirmedMatch[3] },
          text
        );
      }
      const nextLeakMatch = text.match(/^(\s*)Next:\s*leak\s+(.+)\s*$/);
      if (nextLeakMatch) {
        return applyLeadingWhitespace(
          nextLeakMatch,
          'runtime.nextLeak',
          { command: nextLeakMatch[2] },
          text
        );
      }
      const progressStepsMatch = text.match(/^(\s*)Progress:\s*(\d+)\/(\d+)\s*steps completed\.\s*$/);
      if (progressStepsMatch) {
        return applyLeadingWhitespace(
          progressStepsMatch,
          'runtime.progressSteps',
          { done: progressStepsMatch[2], total: progressStepsMatch[3] },
          text
        );
      }
      const moreFilesNeededMatch = text.match(/^(\s*)(\d+)\s*more file\(s\) needed before leak\.\s*$/);
      if (moreFilesNeededMatch) {
        return applyLeadingWhitespace(
          moreFilesNeededMatch,
          'runtime.moreFilesNeeded',
          { count: moreFilesNeededMatch[2] },
          text
        );
      }
      const compilingDossierMatch = text.match(/^(\s*)Compiling dossier\.\.\.\s*(\d+)\s*files confirmed\.\s*$/);
      if (compilingDossierMatch) {
        return applyLeadingWhitespace(
          compilingDossierMatch,
          'runtime.compilingDossier',
          { count: compilingDossierMatch[2] },
          text
        );
      }
      const questionProgressMatch = text.match(/^(\s*)Question:\s*(\d+)\/(\d+)$/);
      if (questionProgressMatch) {
        return applyLeadingWhitespace(
          questionProgressMatch,
          'runtime.questionProgress',
          { current: questionProgressMatch[2], total: questionProgressMatch[3] },
          text
        );
      }
      const errorsProgressMatch = text.match(/^(\s*)Errors:\s*(\d+)\/(\d+)$/);
      if (errorsProgressMatch) {
        return applyLeadingWhitespace(
          errorsProgressMatch,
          'runtime.errorsProgress',
          { current: errorsProgressMatch[2], total: errorsProgressMatch[3] },
          text
        );
      }
      const targetSearchingMatch = text.match(/^TARGET=(.+)\.\.\.\s+SEARCHING$/);
      if (targetSearchingMatch) {
        return t('runtime.targetSearching', { value: targetSearchingMatch[1] }, text);
      }
      const toReadFileMatch = text.match(
        /^(\s*)To read a file use 'cat (.+)' or 'open (.+)'\.$/
      );
      if (toReadFileMatch) {
        return applyLeadingWhitespace(
          toReadFileMatch,
          'runtime.toReadFileUseCatOpen',
          { catValue: toReadFileMatch[2], openValue: toReadFileMatch[3] },
          text
        );
      }
      const toExploreDirectoryMatch = text.match(
        /^(\s*)To explore a directory use 'cd (.+)' then 'ls'\.$/
      );
      if (toExploreDirectoryMatch) {
        return applyLeadingWhitespace(
          toExploreDirectoryMatch,
          'runtime.toExploreDirectoryUseCdThenLs',
          { value: toExploreDirectoryMatch[2] },
          text
        );
      }
      const thatsAFileMatch = text.match(/^\[UFO74\]: thats a file\. try: open (.+)$/);
      if (thatsAFileMatch) {
        return t('runtime.thatsAFileTryOpen', { value: thatsAFileMatch[1] }, text);
      }
      const thatsADirectoryMatch = text.match(/^\[UFO74\]: thats a directory\. use: cd (.+)$/);
      if (thatsADirectoryMatch) {
        return t('runtime.thatsADirectoryUseCd', { value: thatsADirectoryMatch[1] }, text);
      }
      const onceYouHaveAnswerMatch = text.match(
        /^\[UFO74\]: once you have the answer, the old recovery wrapper is "decrypt (.+)"\.$/
      );
      if (onceYouHaveAnswerMatch) {
        return t('runtime.onceYouHaveAnswerDecrypt', { value: onceYouHaveAnswerMatch[1] }, text);
      }
      const whenReadyStartDecryptMatch = text.match(
        /^\[UFO74\]: when you are ready, start it with "decrypt (.+)"\.$/
      );
      if (whenReadyStartDecryptMatch) {
        return t('runtime.whenReadyStartDecrypt', { value: whenReadyStartDecryptMatch[1] }, text);
      }
      const legacyWrapperDecryptMatch = text.match(
        /^\[UFO74\]: legacy wrapper: "decrypt (.+)"\.$/
      );
      if (legacyWrapperDecryptMatch) {
        return t('runtime.legacyWrapperDecrypt', { value: legacyWrapperDecryptMatch[1] }, text);
      }
      const notEncryptedJustUseOpenMatch = text.match(
        /^\[UFO74\]: this ones not encrypted\. just use: open (.+)$/
      );
      if (notEncryptedJustUseOpenMatch) {
        return t(
          'runtime.notEncryptedJustUseOpen',
          { value: notEncryptedJustUseOpenMatch[1] },
          text
        );
      }
      const tryAgainWithDecryptMatch = text.match(/^Try again with: decrypt (.+)$/);
      if (tryAgainWithDecryptMatch) {
        return t('runtime.tryAgainWithDecrypt', { value: tryAgainWithDecryptMatch[1] }, text);
      }
      const fileLabelMatch = text.match(/^FILE:\s*(.+)$/);
      if (fileLabelMatch) {
        return t('runtime.fileLabel', { value: fileLabelMatch[1] }, text);
      }
      const readLabelMatch = text.match(/^(\s*)\[READ\]$/);
      if (readLabelMatch) {
        return applyLeadingWhitespace(readLabelMatch, 'runtime.readLabel', undefined, text);
      }
      const unreadLabelMatch = text.match(/^(\s*)\[UNREAD\]$/);
      if (unreadLabelMatch) {
        return applyLeadingWhitespace(unreadLabelMatch, 'runtime.unreadLabel', undefined, text);
      }
      const emptyMatch = text.match(/^(\s*)\(empty\)$/);
      if (emptyMatch) {
        return applyLeadingWhitespace(emptyMatch, 'runtime.empty', undefined, text);
      }
      const endingLabelMatch = text.match(/^>> ENDING:\s*(.+?)\s*<<$/);
      if (endingLabelMatch) {
        return t(
          'runtime.endingLabel',
          { value: translateRuntimeText(endingLabelMatch[1]) },
          text
        );
      }
      const scriptNotFoundMatch = text.match(/^Script not found:\s*(.+)$/);
      if (scriptNotFoundMatch) {
        return t('runtime.scriptNotFound', { value: scriptNotFoundMatch[1] }, text);
      }
      const translated = RUNTIME_TRANSLATIONS[language][text];
      if (translated !== undefined) {
        return normalizeRuntimePresentation(translated);
      }
      if (text.startsWith('UFO74: ')) {
        const translatedInner = translateRuntimeText(text.slice('UFO74: '.length));
        if (translatedInner !== text.slice('UFO74: '.length)) {
          return normalizeRuntimePresentation(`UFO74: ${translatedInner}`);
        }
      }
      const translatedInlineTags = text
        .replace(
          /\[(READ|UNREAD|CORRUPTED|ENCRYPTED|RESTRICTED|RESTRICTED_BRIEFING|UNSTABLE|CONDITIONAL)\]/g,
          (match, tag: string) => {
            if (!isInlineRuntimeTag(tag)) {
              return match;
            }

            return t(INLINE_RUNTIME_TAG_KEYS[tag], undefined, match);
          }
        )
        .replace(/\[~(\d+)min\]/g, (_, value: string) =>
          t('runtime.readingEstimate', { value }, `[~${value}min]`)
        );
      if (translatedInlineTags !== text) {
        return normalizeRuntimePresentation(translatedInlineTags);
      }
      const quotedLineMatch = text.match(/^(\s*)"(.+)"$/);
      if (quotedLineMatch) {
        const translatedInner = translateRuntimeText(quotedLineMatch[2]);
        if (translatedInner !== quotedLineMatch[2]) {
          return normalizeRuntimePresentation(`${quotedLineMatch[1]}"${translatedInner}"`);
        }
      }
      const bracketedLineMatch = text.match(/^(\s*)\[(.+)\]$/);
      if (bracketedLineMatch) {
        const translatedInner = translateRuntimeText(bracketedLineMatch[2]);
        if (translatedInner !== bracketedLineMatch[2]) {
          return normalizeRuntimePresentation(`${bracketedLineMatch[1]}[${translatedInner}]`);
        }
      }
      const leadingWhitespaceMatch = text.match(/^(\s+)(.+)$/);
      if (leadingWhitespaceMatch) {
        const translatedInner = translateRuntimeText(leadingWhitespaceMatch[2]);
        if (translatedInner !== leadingWhitespaceMatch[2]) {
          return normalizeRuntimePresentation(`${leadingWhitespaceMatch[1]}${translatedInner}`);
        }
      }
      return normalizeRuntimePresentation(text);
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
