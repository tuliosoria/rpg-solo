'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SaveSlot, FlickerIntensity, FontSize, TextSpeed } from '../types';
import { getSaveSlots, getSaveSlotsAsync, deleteSave } from '../storage/saves';
import { useOptions } from '../hooks/useOptions';
import { useSound } from '../hooks';
import { useI18n } from '../i18n';
import { startMenuMusic, setMenuMusicVolume, stopMenuMusic } from '../audio/menuMusic';
import MenuLogo from './MenuLogo';
import MenuEyes from './MenuEyes';
import styles from './Menu.module.css';

interface MenuProps {
  onNewGameAction: () => void;
  onLoadGameAction: (
    slotId: string,
    signal?: AbortSignal
  ) => void | boolean | Promise<void | boolean>;
  initialScreen?: 'main' | 'load';
}

type Screen = 'main' | 'load' | 'credits' | 'options' | 'terms' | 'privacy';

export default function Menu({ onNewGameAction, onLoadGameAction, initialScreen = 'main' }: MenuProps) {
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [saves, setSaves] = useState<SaveSlot[]>([]);
  const [flickerActive, setFlickerActive] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadingSaveId, setLoadingSaveId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const loadAbortControllerRef = useRef<AbortController | null>(null);

  // Options state
  const { options, setOption } = useOptions();
  const { language, setLanguage, t } = useI18n();
  const { playSound } = useSound();

  const handleHover = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      playSound('hover');
    },
    [playSound]
  );

  const cycleLanguage = useCallback((direction: 1 | -1 = 1) => {
    const ordered = ['en', 'pt-BR', 'es'] as const;
    const currentIndex = ordered.indexOf(language);
    const nextIndex = (currentIndex + direction + ordered.length) % ordered.length;
    setLanguage(ordered[nextIndex]);
  }, [language, setLanguage]);

  const adjustOptionValue = useCallback(
    (index: number, direction: 1 | -1 = 1) => {
      const flickerOptions: FlickerIntensity[] = ['low', 'medium', 'high'];
      const fontSizeOptions: FontSize[] = ['small', 'medium', 'large'];
      const textSpeedOptions: TextSpeed[] = ['slow', 'normal', 'fast', 'instant'];

      switch (index) {
        case 0:
          setOption('masterVolume', Math.max(0, Math.min(100, options.masterVolume + direction * 10)));
          break;
        case 1:
          setOption('ambientSoundEnabled', !options.ambientSoundEnabled);
          break;
        case 2:
          setOption('soundEffectsEnabled', !options.soundEffectsEnabled);
          break;
        case 3:
          setOption('turingVoiceEnabled', !options.turingVoiceEnabled);
          break;
        case 4:
          setOption('crtEffectsEnabled', !options.crtEffectsEnabled);
          break;
        case 5:
          setOption('screenFlickerEnabled', !options.screenFlickerEnabled);
          break;
        case 6:
          if (options.screenFlickerEnabled) {
            const currentIdx = flickerOptions.indexOf(options.flickerIntensity);
            const nextIdx = (currentIdx + direction + flickerOptions.length) % flickerOptions.length;
            setOption('flickerIntensity', flickerOptions[nextIdx]);
          }
          break;
        case 7: {
          const currentIdx = fontSizeOptions.indexOf(options.fontSize);
          const nextIdx = (currentIdx + direction + fontSizeOptions.length) % fontSizeOptions.length;
          setOption('fontSize', fontSizeOptions[nextIdx]);
          break;
        }
        case 8: {
          const currentIdx = textSpeedOptions.indexOf(options.textSpeed);
          const nextIdx =
            (currentIdx + direction + textSpeedOptions.length) % textSpeedOptions.length;
          setOption('textSpeed', textSpeedOptions[nextIdx]);
          break;
        }
        case 9:
          cycleLanguage(direction);
          break;
        default:
          break;
      }
    },
    [cycleLanguage, options, setOption]
  );

  const abortPendingLoad = useCallback(() => {
    loadAbortControllerRef.current?.abort();
    loadAbortControllerRef.current = null;
  }, []);

  const handleReturnToMain = useCallback(() => {
    abortPendingLoad();
    setLoadingSaveId(null);
    setLoadError(null);
    setScreen('main');
  }, [abortPendingLoad]);

  const handleStartNewGame = useCallback(() => {
    abortPendingLoad();
    setLoadingSaveId(null);
    setLoadError(null);
    onNewGameAction();
  }, [abortPendingLoad, onNewGameAction]);

  const handleLoadSelection = useCallback(
    (slotId: string) => {
      if (loadingSaveId) return;
      const controller = new AbortController();
      const isCurrentLoad = () => loadAbortControllerRef.current === controller;
      const clearCurrentLoad = () => {
        if (!isCurrentLoad()) return;
        loadAbortControllerRef.current = null;
        setLoadingSaveId(current => (current === slotId ? null : current));
      };

      const showLoadError = () => {
        if (controller.signal.aborted || !isCurrentLoad()) return;
        setLoadError(t('menu.load.failed'));
        clearCurrentLoad();
      };

      abortPendingLoad();
      loadAbortControllerRef.current = controller;
      setLoadError(null);
      setLoadingSaveId(slotId);

      try {
        const result = onLoadGameAction(slotId, controller.signal);
        if (result && typeof (result as Promise<boolean | void>).then === 'function') {
          void Promise.resolve(result)
            .then(loaded => {
              if (controller.signal.aborted || !isCurrentLoad()) {
                return;
              }
              if (loaded === false) {
                showLoadError();
                return;
              }
              clearCurrentLoad();
            })
            .catch(() => {
              showLoadError();
            });
          return;
        }

        if (controller.signal.aborted || !isCurrentLoad()) {
          return;
        }
        if (result === false) {
          showLoadError();
          return;
        }

        clearCurrentLoad();
      } catch {
        showLoadError();
      }
    },
    [abortPendingLoad, loadingSaveId, onLoadGameAction, t]
  );

  // Refs for menu buttons for focus management
  const mainMenuRef = useRef<HTMLDivElement>(null);
  const loadListRef = useRef<HTMLDivElement>(null);

  // Load saves when showing load screen
  useEffect(() => {
    let cancelled = false;

    if (screen === 'load') {
      setSaves(getSaveSlots());
      setSelectedIndex(0);
      setLoadError(null);
      setLoadingSaveId(null);

      void getSaveSlotsAsync().then(slots => {
        if (!cancelled) {
          setSaves(slots);
        }
      });
    }

    return () => {
      cancelled = true;
    };
  }, [screen]);

  // Reset selection when changing screens
  useEffect(() => {
    setSelectedIndex(0);
  }, [screen]);

  // Initial flicker effect
  useEffect(() => {
    setFlickerActive(true);
    const timer = setTimeout(() => setFlickerActive(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Looping menu music (shared singleton). The IntroSequence starts it
  // when the production logo appears so it carries seamlessly into the
  // menu. We just keep volume in sync and ensure it's running while
  // mounted. HomeContent stops it when the player starts/loads a game.
  useEffect(() => {
    startMenuMusic({
      musicEnabled: options.musicEnabled,
      masterVolume: options.masterVolume,
    });
    setMenuMusicVolume({
      musicEnabled: options.musicEnabled,
      masterVolume: options.masterVolume,
    });
    if (!options.musicEnabled) {
      stopMenuMusic();
    }
  }, [options.musicEnabled, options.masterVolume]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Main menu has 4 items now: NEW GAME, LOAD GAME, OPTIONS, CREDITS
      const maxIndex =
        screen === 'main'
          ? 3
          : screen === 'load'
            ? (saves.length > 0 ? saves.length : 0)
            : screen === 'options'
              ? 10
              : 0;

      switch (e.key) {
        case 'ArrowLeft':
          if (screen === 'options') {
            e.preventDefault();
            adjustOptionValue(selectedIndex, -1);
          }
          break;
        case 'ArrowRight':
          if (screen === 'options') {
            e.preventDefault();
            adjustOptionValue(selectedIndex, 1);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
          playSound('hover');
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev < maxIndex ? prev + 1 : 0));
          playSound('hover');
          break;
        case 'Enter':
          e.preventDefault();
          if (screen === 'main') {
            if (selectedIndex === 0) handleStartNewGame();
            else if (selectedIndex === 1) setScreen('load');
            else if (selectedIndex === 2) setScreen('options');
            else if (selectedIndex === 3) setScreen('credits');
          } else if (screen === 'load') {
            if (saves.length > 0 && selectedIndex < saves.length) {
              void handleLoadSelection(saves[selectedIndex].id);
            } else if (selectedIndex === saves.length || saves.length === 0) {
              handleReturnToMain();
            }
          } else if (screen === 'credits') {
            setScreen('main');
          } else if (screen === 'options') {
            if (selectedIndex === 10) {
              setScreen('main');
            } else {
              adjustOptionValue(selectedIndex, 1);
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          if (screen !== 'main') {
            if (screen === 'load') {
              handleReturnToMain();
            } else {
              setScreen('main');
            }
          }
          break;
      }
    },
    [
      screen,
      selectedIndex,
      saves,
      handleStartNewGame,
      handleReturnToMain,
      handleLoadSelection,
      adjustOptionValue,
      playSound,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => () => abortPendingLoad(), [abortPendingLoad]);

  const handleDelete = (slotId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(t('menu.confirm.deleteSave'))) {
      deleteSave(slotId);
      setSaves(getSaveSlots());
    }
  };

  const formatDate = (timestamp: number) => {
    const locale = language === 'pt-BR' ? 'pt-BR' : language === 'es' ? 'es' : 'en-US';
    return new Date(timestamp).toLocaleString(locale);
  };

  const renderMainMenu = () => (
    <div className={styles.menuContent} ref={mainMenuRef}>
      <div className={styles.title}>
        <MenuLogo />
      </div>

      <div className={styles.menuOptions}>
        <button
          className={`${styles.menuButton} ${selectedIndex === 0 ? styles.selected : ''}`}
          onClick={handleStartNewGame}
          onMouseEnter={() => handleHover(0)}
        >
          {selectedIndex === 0 ? '▶ ' : '  '}{t('menu.main.newGame')}
        </button>

        <button
          className={`${styles.menuButton} ${selectedIndex === 1 ? styles.selected : ''}`}
          onClick={() => setScreen('load')}
          onMouseEnter={() => handleHover(1)}
        >
          {selectedIndex === 1 ? '▶ ' : '  '}{t('menu.main.loadGame')}
        </button>

        <button
          className={`${styles.menuButton} ${selectedIndex === 2 ? styles.selected : ''}`}
          onClick={() => setScreen('options')}
          onMouseEnter={() => handleHover(2)}
        >
          {selectedIndex === 2 ? '▶ ' : '  '}{t('menu.main.options')}
        </button>

        <button
          className={`${styles.menuButton} ${selectedIndex === 3 ? styles.selected : ''}`}
          onClick={() => setScreen('credits')}
          onMouseEnter={() => handleHover(3)}
        >
          {selectedIndex === 3 ? '▶ ' : '  '}{t('menu.main.credits')}
        </button>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerLine}>{t('menu.main.warningUnauthorized')}</div>
        <div className={styles.footerLine}>{t('menu.main.sessionLogging')}</div>
        <div className={styles.keyHint}>{t('menu.main.keyHint')}</div>
        <div className={styles.footerLine} style={{ marginTop: '1rem', opacity: 0.6 }}>
          {t('menu.footer.copyright')}
        </div>
        <div className={styles.legalLinks}>
          <button
            className={styles.legalLink}
            onClick={() => setScreen('terms')}
            onMouseEnter={() => playSound('hover')}
          >
            {t('menu.footer.terms')}
          </button>
          <span className={styles.legalSeparator}>|</span>
          <button
            className={styles.legalLink}
            onClick={() => setScreen('privacy')}
            onMouseEnter={() => playSound('hover')}
          >
            {t('menu.footer.privacy')}
          </button>
        </div>
      </div>
    </div>
  );

  const renderLoadScreen = () => (
    <div className={styles.menuContent} ref={loadListRef}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>{t('menu.load.title')}</h2>
        <div className={styles.titleLine}>═══════════════════════════════════</div>
      </div>

      <div className={styles.savesList}>
        {saves.length === 0 ? (
          <div className={styles.noSaves}>{t('menu.load.none')}</div>
        ) : (
          saves.map((slot, index) => (
            <div
              key={slot.id}
              className={`${styles.saveSlot} ${selectedIndex === index ? styles.selected : ''}`}
              onClick={() => {
                void handleLoadSelection(slot.id);
              }}
              onMouseEnter={() => handleHover(index)}
            >
              <div className={styles.saveSelector}>{selectedIndex === index ? '▶' : ' '}</div>
              <div className={styles.saveContent}>
                <div className={styles.saveName}>
                  {slot.name}
                  {loadingSaveId === slot.id ? ` ${t('menu.load.loading')}` : ''}
                </div>
                <div className={styles.saveInfo}>
                  <span>{t('menu.load.path')}: {slot.currentPath}</span>
                  <span>{t('menu.load.progress')}: {slot.truthCount}/10</span>
                  <span
                    className={
                      slot.detectionLevel >= 80
                        ? styles.riskCritical
                        : slot.detectionLevel >= 50
                          ? styles.riskHigh
                          : styles.riskLow
                    }
                  >
                    {t('menu.load.risk')}: {slot.detectionLevel ?? 0}%
                  </span>
                </div>
                <div className={styles.saveDate}>{formatDate(slot.timestamp)}</div>
              </div>
              <button className={styles.deleteButton} onClick={e => handleDelete(slot.id, e)}>
                [X]
              </button>
            </div>
          ))
        )}
      </div>

      {loadError && <div className={styles.noSaves} role="alert">{loadError}</div>}

      <button
        className={`${styles.backButton} ${selectedIndex === saves.length ? styles.selected : ''}`}
        onClick={handleReturnToMain}
        onMouseEnter={() => handleHover(saves.length)}
      >
        {selectedIndex === saves.length ? '▶ ' : '  '}{t('menu.load.back')}
      </button>
      <div className={styles.keyHint}>
        {loadingSaveId ? t('menu.load.loading') : t('menu.load.keyHint')}
      </div>
    </div>
  );

  const renderCredits = () => (
    <div className={styles.menuContent}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>{t('menu.credits.title')}</h2>
        <div className={styles.titleLine}>═══════════════════════════════════</div>
      </div>

      <div className={styles.credits}>
        <div className={styles.creditSection}>
          <div className={styles.creditLabel}>{t('menu.credits.gameLabel')}</div>
          <div className={styles.creditValue}>{t('menu.credits.gameValue')}</div>
        </div>

        <div className={styles.creditSection}>
          <div className={styles.creditLabel}>{t('menu.credits.createdByLabel')}</div>
          <div className={styles.creditValue}>Tulio Soria & Arthur Ramos</div>
        </div>

        <div className={styles.creditSection}>
          <div className={styles.creditLabel}>{t('menu.credits.genreLabel')}</div>
          <div className={styles.creditValue}>{t('menu.credits.genreValue')}</div>
        </div>

        <div className={styles.creditSection}>
          <div className={styles.creditLabel}>{t('menu.credits.settingLabel')}</div>
          <div className={styles.creditValue}>{t('menu.credits.settingValue')}</div>
        </div>

        <div className={styles.creditSection}>
          <div className={styles.creditLabel}>{t('menu.credits.inspiredByLabel')}</div>
          <div className={styles.creditValue}>{t('menu.credits.inspiredByValue')}</div>
        </div>

        <div className={styles.creditSection}>
          <div className={styles.creditLabel}>{t('menu.credits.noteLabel')}</div>
          <div className={styles.creditValue}>{t('menu.credits.noteValue')}</div>
        </div>

        <div className={styles.creditSection}>
          <div className={styles.creditValue}>{t('menu.credits.copyright')}</div>
        </div>
      </div>

      <button
        className={`${styles.backButton} ${styles.selected}`}
        onClick={() => setScreen('main')}
      >
        ▶ {t('menu.load.back')}
      </button>
      <div className={styles.keyHint}>{t('menu.credits.backHint')}</div>
    </div>
  );

  const renderTerms = () => (
    <div className={styles.menuContent}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>{t('menu.terms.title')}</h2>
        <div className={styles.titleLine}>═══════════════════════════════════</div>
      </div>

      <div className={styles.legalContent}>
        <p className={styles.legalDate}>{t('menu.terms.lastUpdated')}</p>

        <div className={styles.legalSection}>
          <h3 className={styles.legalHeading}>{t('menu.terms.agreementHeading')}</h3>
          <p>{t('menu.terms.agreementBody')}</p>
        </div>

        <div className={styles.legalSection}>
          <h3 className={styles.legalHeading}>{t('menu.terms.whatThisIsHeading')}</h3>
          <p>{t('menu.terms.whatThisIsBody')}</p>
        </div>

        <div className={styles.legalSection}>
          <h3 className={styles.legalHeading}>{t('menu.terms.yourDataHeading')}</h3>
          <p>{t('menu.terms.yourDataBody')}</p>
        </div>

        <div className={styles.legalSection}>
          <h3 className={styles.legalHeading}>{t('menu.terms.ipHeading')}</h3>
          <p>{t('menu.terms.ipBody')}</p>
        </div>

        <div className={styles.legalSection}>
          <h3 className={styles.legalHeading}>{t('menu.terms.warrantyHeading')}</h3>
          <p>{t('menu.terms.warrantyBody')}</p>
        </div>

        <div className={styles.legalSection}>
          <h3 className={styles.legalHeading}>{t('menu.terms.contactHeading')}</h3>
          <p>{t('menu.terms.contactBody')}</p>
        </div>
      </div>

      <button
        className={`${styles.backButton} ${styles.selected}`}
        onClick={() => setScreen('main')}
      >
        ▶ {t('menu.load.back')}
      </button>
    </div>
  );

  const renderPrivacy = () => (
    <div className={styles.menuContent}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>{t('menu.privacy.title')}</h2>
        <div className={styles.titleLine}>═══════════════════════════════════</div>
      </div>

      <div className={styles.legalContent}>
        <p className={styles.legalDate}>{t('menu.privacy.lastUpdated')}</p>

        <div className={styles.legalSection}>
          <h3 className={styles.legalHeading}>{t('menu.privacy.summaryHeading')}</h3>
          <p>{t('menu.privacy.summaryBody')}</p>
        </div>

        <div className={styles.legalSection}>
          <h3 className={styles.legalHeading}>{t('menu.privacy.dataCollectionHeading')}</h3>
          <p>{t('menu.privacy.dataCollectionBody')}</p>
        </div>

        <div className={styles.legalSection}>
          <h3 className={styles.legalHeading}>{t('menu.privacy.localStorageHeading')}</h3>
          <p>{t('menu.privacy.localStorageBody')}</p>
        </div>

        <div className={styles.legalSection}>
          <h3 className={styles.legalHeading}>{t('menu.privacy.thirdPartiesHeading')}</h3>
          <p>{t('menu.privacy.thirdPartiesBody')}</p>
        </div>

        <div className={styles.legalSection}>
          <h3 className={styles.legalHeading}>{t('menu.privacy.audioHeading')}</h3>
          <p>{t('menu.privacy.audioBody')}</p>
        </div>

        <div className={styles.legalSection}>
          <h3 className={styles.legalHeading}>{t('menu.privacy.childrenHeading')}</h3>
          <p>{t('menu.privacy.childrenBody')}</p>
        </div>

        <div className={styles.legalSection}>
          <h3 className={styles.legalHeading}>{t('menu.privacy.changesHeading')}</h3>
          <p>{t('menu.privacy.changesBody')}</p>
        </div>

        <div className={styles.legalSection}>
          <h3 className={styles.legalHeading}>{t('menu.privacy.contactHeading')}</h3>
          <p>{t('menu.privacy.contactBody')}</p>
        </div>
      </div>

      <button
        className={`${styles.backButton} ${styles.selected}`}
        onClick={() => setScreen('main')}
      >
        ▶ {t('menu.load.back')}
      </button>
    </div>
  );

  const renderOptions = () => {
    const flickerOptions: FlickerIntensity[] = ['low', 'medium', 'high'];
    const fontSizeOptions: FontSize[] = ['small', 'medium', 'large'];
    const textSpeedOptions: TextSpeed[] = ['slow', 'normal', 'fast', 'instant'];

    return (
      <div className={styles.menuContent}>
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>{t('menu.options.title')}</h2>
          <div className={styles.titleLine}>═══════════════════════════════════</div>
        </div>

        <div className={styles.optionsContainer}>
          {/* AUDIO SECTION */}
          <div className={styles.optionSection}>
            <div className={styles.optionSectionTitle}>{t('menu.options.audio')}</div>

            {/* Master Volume Slider */}
            <div
              className={`${styles.optionRow} ${selectedIndex === 0 ? styles.selected : ''}`}
              onMouseEnter={() => handleHover(0)}
            >
              <span className={styles.optionLabel}>{t('menu.options.masterVolume')}</span>
              <div className={styles.sliderContainer}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={options.masterVolume}
                  onChange={e => setOption('masterVolume', parseInt(e.target.value))}
                  className={styles.slider}
                />
                <span className={styles.sliderValue}>{options.masterVolume}%</span>
              </div>
            </div>

            {/* Ambient Sound Toggle */}
            <div
              className={`${styles.optionRow} ${selectedIndex === 1 ? styles.selected : ''}`}
              onMouseEnter={() => handleHover(1)}
              onClick={() => setOption('ambientSoundEnabled', !options.ambientSoundEnabled)}
            >
              <span className={styles.optionLabel}>{t('menu.options.ambientSound')}</span>
              <span className={styles.optionToggle}>
                [ {options.ambientSoundEnabled ? t('options.value.on') : t('options.value.off')} ]
              </span>
            </div>

            {/* Sound Effects Toggle */}
            <div
              className={`${styles.optionRow} ${selectedIndex === 2 ? styles.selected : ''}`}
              onMouseEnter={() => handleHover(2)}
              onClick={() => setOption('soundEffectsEnabled', !options.soundEffectsEnabled)}
            >
              <span className={styles.optionLabel}>{t('menu.options.soundEffects')}</span>
              <span className={styles.optionToggle}>
                [ {options.soundEffectsEnabled ? t('options.value.on') : t('options.value.off')} ]
              </span>
            </div>

            {/* Turing Voice Toggle */}
            <div
              className={`${styles.optionRow} ${selectedIndex === 3 ? styles.selected : ''}`}
              onMouseEnter={() => handleHover(3)}
              onClick={() => setOption('turingVoiceEnabled', !options.turingVoiceEnabled)}
            >
              <span className={styles.optionLabel}>{t('menu.options.turingVoice')}</span>
              <span className={styles.optionToggle}>
                [ {options.turingVoiceEnabled ? t('options.value.on') : t('options.value.off')} ]
              </span>
            </div>
          </div>

          {/* VISUAL SECTION */}
          <div className={styles.optionSection}>
            <div className={styles.optionSectionTitle}>{t('menu.options.visual')}</div>

            {/* CRT Effects Toggle */}
            <div
              className={`${styles.optionRow} ${selectedIndex === 4 ? styles.selected : ''}`}
              onMouseEnter={() => handleHover(4)}
              onClick={() => setOption('crtEffectsEnabled', !options.crtEffectsEnabled)}
            >
              <span className={styles.optionLabel}>{t('menu.options.crtEffects')}</span>
              <span className={styles.optionToggle}>
                [ {options.crtEffectsEnabled ? t('options.value.on') : t('options.value.off')} ]
              </span>
            </div>

            {/* Screen Flicker Toggle */}
            <div
              className={`${styles.optionRow} ${selectedIndex === 5 ? styles.selected : ''}`}
              onMouseEnter={() => handleHover(5)}
              onClick={() => setOption('screenFlickerEnabled', !options.screenFlickerEnabled)}
            >
              <span className={styles.optionLabel}>{t('menu.options.screenFlicker')}</span>
              <span className={styles.optionToggle}>
                [ {options.screenFlickerEnabled ? t('options.value.on') : t('options.value.off')} ]
              </span>
            </div>

            {/* Flicker Intensity Select (only when flicker is on) */}
            <div
              className={`${styles.optionRow} ${selectedIndex === 6 ? styles.selected : ''} ${!options.screenFlickerEnabled ? styles.optionDisabled : ''}`}
              onMouseEnter={() => handleHover(6)}
              onClick={() => {
                if (options.screenFlickerEnabled) {
                  const currentIdx = flickerOptions.indexOf(options.flickerIntensity);
                  const nextIdx = (currentIdx + 1) % flickerOptions.length;
                  setOption('flickerIntensity', flickerOptions[nextIdx]);
                }
              }}
            >
              <span className={styles.optionLabel}>{t('menu.options.flickerIntensity')}</span>
              <span className={styles.optionSelect}>
                {'< '}
                {options.flickerIntensity === 'low'
                  ? t('options.value.low')
                  : options.flickerIntensity === 'high'
                    ? t('options.value.high')
                    : t('options.value.medium')}
                {' >'}
              </span>
            </div>

            {/* Font Size Select */}
            <div
              className={`${styles.optionRow} ${selectedIndex === 7 ? styles.selected : ''}`}
              onMouseEnter={() => handleHover(7)}
              onClick={() => {
                const currentIdx = fontSizeOptions.indexOf(options.fontSize);
                const nextIdx = (currentIdx + 1) % fontSizeOptions.length;
                setOption('fontSize', fontSizeOptions[nextIdx]);
              }}
            >
              <span className={styles.optionLabel}>{t('menu.options.fontSize')}</span>
              <span className={styles.optionSelect}>
                {'< '}
                {options.fontSize === 'small'
                  ? t('options.value.small')
                  : options.fontSize === 'large'
                    ? t('options.value.large')
                    : t('options.value.medium')}
                {' >'}
              </span>
            </div>

            {/* Text Speed Select */}
            <div
              className={`${styles.optionRow} ${selectedIndex === 8 ? styles.selected : ''}`}
              onMouseEnter={() => handleHover(8)}
              onClick={() => {
                const currentIdx = textSpeedOptions.indexOf(options.textSpeed);
                const nextIdx = (currentIdx + 1) % textSpeedOptions.length;
                setOption('textSpeed', textSpeedOptions[nextIdx]);
              }}
            >
              <span className={styles.optionLabel}>{t('menu.options.textSpeed')}</span>
              <span className={styles.optionSelect}>
                {'< '}
                {options.textSpeed === 'slow'
                  ? t('options.value.slow')
                  : options.textSpeed === 'fast'
                    ? t('options.value.fast')
                    : options.textSpeed === 'instant'
                      ? t('options.value.instant')
                      : t('options.value.normal')}
                {' >'}
              </span>
            </div>

            {/* Language Select */}
            <div
              className={`${styles.optionRow} ${selectedIndex === 9 ? styles.selected : ''}`}
              onMouseEnter={() => handleHover(9)}
              onClick={() => cycleLanguage()}
            >
              <span className={styles.optionLabel}>{t('menu.options.language')}</span>
              <span className={styles.optionSelect}>
                {'< '}
                {language === 'en'
                  ? t('language.en')
                  : language === 'pt-BR'
                    ? t('language.pt-BR')
                    : t('language.es')}
                {' >'}
              </span>
            </div>
          </div>
        </div>

        <button
          className={`${styles.backButton} ${selectedIndex === 10 ? styles.selected : ''}`}
          onClick={() => setScreen('main')}
          onMouseEnter={() => handleHover(10)}
        >
          {selectedIndex === 10 ? '▶ ' : '  '}{t('menu.options.back')}
        </button>
        <div className={styles.keyHint}>{t('menu.options.keyHint')}</div>
      </div>
    );
  };

  return (
    <div className={`${styles.menu} ${flickerActive ? styles.flicker : ''}`}>
      {/* Scanlines */}
      <div className={styles.scanlines} />

      {/* CRT glow effect */}
      <div className={styles.glow} />

      {/* Watcher eyes drifting around the menu perimeter */}
      <MenuEyes />

      {screen === 'main' && renderMainMenu()}
      {screen === 'load' && renderLoadScreen()}
      {screen === 'credits' && renderCredits()}
      {screen === 'options' && renderOptions()}
      {screen === 'terms' && renderTerms()}
      {screen === 'privacy' && renderPrivacy()}
    </div>
  );
}
