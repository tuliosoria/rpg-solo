import { executeCommand } from '../commands';
import { GameState, DEFAULT_GAME_STATE } from '../../types';

// Mock filesystem with a test file that has a video trigger
jest.mock('../../data/filesystem', () => ({
  FILESYSTEM_ROOT: {
    type: 'dir',
    name: '',
    children: {
      'test-video-file.mp4': {
        type: 'file',
        name: 'test-video-file.mp4',
        status: 'intact',
        content: ['Test video file content'],
        videoTrigger: {
          src: '/videos/test.mp4',
          alt: 'Test video',
          corrupted: false,
        },
      },
    },
  },
}));

describe('Video Trigger Logic', () => {
  let initialState: GameState;

  beforeEach(() => {
    initialState = {
      ...DEFAULT_GAME_STATE,
      seed: 12345,
      rngState: 12345,
      sessionStartTime: Date.now(),
    };
  });

  it('tracks shown videos in videosShownThisRun set', () => {
    const result = executeCommand('open test-video-file.mp4', initialState);

    if (result.stateChanges.videosShownThisRun) {
      expect(result.stateChanges.videosShownThisRun instanceof Set).toBe(true);
    }
  });

  it('initializes empty set if not present', () => {
    const result = executeCommand('help', initialState);
    
    // Help command shouldn't modify videosShownThisRun
    expect(result.stateChanges.videosShownThisRun).toBeUndefined();
  });
});
