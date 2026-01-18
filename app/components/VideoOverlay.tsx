'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import styles from './VideoOverlay.module.css';

export interface VideoTrigger {
  src: string;
  title: string;
  tone: 'clinical' | 'surveillance';
  corrupted?: boolean;
}

interface VideoOverlayProps {
  src: string;
  title: string;
  tone: 'clinical' | 'surveillance';
  onCloseAction: () => void;
  corrupted?: boolean;
}

export default function VideoOverlay({ src, title, tone, onCloseAction, corrupted = false }: VideoOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [flickering, setFlickering] = useState(true);
  const [initialShock, setInitialShock] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    // SUDDEN appearance - immediate flash then video
    const shockTimeout = setTimeout(() => {
      setInitialShock(false);
    }, 50);
    
    // Video appears quickly after initial flash
    const flickerTimeout = setTimeout(() => {
      setFlickering(false);
      setVisible(true);
    }, 150);
    
    // Random flicker during display - more aggressive
    const flickerInterval = setInterval(() => {
      if (Math.random() < 0.15) {
        setFlickering(true);
        setTimeout(() => setFlickering(false), 50 + Math.random() * 100);
      }
    }, 2000);
    
    return () => {
      clearTimeout(shockTimeout);
      clearTimeout(flickerTimeout);
      clearInterval(flickerInterval);
    };
  }, []);
  
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseAction();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        togglePlayPause();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCloseAction]);
  
  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  }, [isPlaying]);
  
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    }
  }, []);
  
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  }, []);
  
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);
  
  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setProgress(100);
  }, []);
  
  const handleError = useCallback(() => {
    setError('VIDEO DATA CORRUPTED - RETRIEVAL FAILED');
    setIsLoading(false);
  }, []);
  
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = clickPosition * duration;
    }
  }, [duration]);
  
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div 
      className={`${styles.overlay} ${flickering ? styles.flickering : ''} ${initialShock ? styles.initialShock : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCloseAction();
        }
      }}
    >
      {/* Scanlines */}
      <div className={styles.scanlines} />
      
      {/* CRT glow */}
      <div className={`${styles.glow} ${tone === 'clinical' ? styles.greenGlow : styles.amberGlow}`} />
      
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.headerText}>
            {corrupted ? '▓▓▓ PARTIAL VIDEO RECOVERY ▓▓▓' : '═══ RECOVERED VIDEO DATA ═══'}
          </span>
        </div>
        
        {/* Video frame */}
        <div className={`${styles.videoFrame} ${corrupted ? styles.corrupted : ''}`}>
          <div className={`${styles.videoWrapper} ${tone === 'clinical' ? styles.greenTone : styles.amberTone}`}>
            {visible && !error && (
              <video 
                ref={videoRef}
                src={src}
                className={styles.video}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
                onError={handleError}
                playsInline
              />
            )}
            {error && (
              <div className={styles.errorDisplay}>
                <div className={styles.errorIcon}>▓▓▓</div>
                <div className={styles.errorText}>{error}</div>
              </div>
            )}
            {/* Noise overlay */}
            <div className={styles.noise} />
          </div>
          
          {corrupted && (
            <div className={styles.corruptionOverlay}>
              <div className={styles.corruptionLine} style={{ top: '23%' }} />
              <div className={styles.corruptionLine} style={{ top: '67%' }} />
            </div>
          )}
        </div>
        
        {/* Video controls */}
        {!error && (
          <div className={styles.controls}>
            <button 
              className={styles.playButton}
              onClick={togglePlayPause}
              disabled={isLoading}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isLoading ? '...' : isPlaying ? '║║' : '▶'}
            </button>
            
            <div className={styles.progressContainer} onClick={handleProgressClick}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            <div className={styles.timeDisplay}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        )}
        
        {/* Metadata */}
        <div className={styles.metadata}>
          <div>CLASSIFICATION: RESTRICTED</div>
          <div>FILE: {title}</div>
          <div className={styles.hint}>[SPACE] Play/Pause • [ESC] Close</div>
        </div>
      </div>
    </div>
  );
}
