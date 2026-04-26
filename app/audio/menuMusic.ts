/**
 * Singleton menu/intro music controller.
 *
 * Starts during the IntroSequence "Simple Man Productions" scene and
 * keeps playing seamlessly through to the Menu. Stops when the player
 * starts a new game or loads a save.
 */

const MENU_MUSIC_SRC = '/audio/music/menu.mp3';

let audio: HTMLAudioElement | null = null;
let started = false;

function getAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!audio) {
    audio = new Audio(MENU_MUSIC_SRC);
    audio.loop = true;
    audio.preload = 'auto';
  }
  return audio;
}

export interface MenuMusicOptions {
  musicEnabled: boolean;
  masterVolume: number; // 0-100
}

export function setMenuMusicVolume({ musicEnabled, masterVolume }: MenuMusicOptions): void {
  const el = getAudio();
  if (!el) return;
  if (!musicEnabled) {
    el.volume = 0;
    return;
  }
  el.volume = Math.max(0, Math.min(1, masterVolume / 100));
}

export function startMenuMusic(opts: MenuMusicOptions): void {
  const el = getAudio();
  if (!el) return;
  setMenuMusicVolume(opts);
  if (!opts.musicEnabled) return;
  if (started && !el.paused) return;
  started = true;

  el.play().catch(() => {
    // Autoplay blocked; retry on first user interaction
    const retry = () => {
      el.play().catch(() => {});
      window.removeEventListener('pointerdown', retry);
      window.removeEventListener('keydown', retry);
    };
    window.addEventListener('pointerdown', retry, { once: true });
    window.addEventListener('keydown', retry, { once: true });
  });
}

export function stopMenuMusic(): void {
  if (!audio) return;
  audio.pause();
  try {
    audio.currentTime = 0;
  } catch {
    // ignore
  }
  started = false;
}
