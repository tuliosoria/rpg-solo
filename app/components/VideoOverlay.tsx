'use client';

import React, { useEffect, useState, useRef } from 'react';
import styles from './VideoOverlay.module.css';

interface VideoOverlayProps {
  src: string;
  alt: string;
  onCloseAction: () => void;
  corrupted?: boolean;
}

export default function VideoOverlay({ src, alt, onCloseAction, corrupted = false }: VideoOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [flickering, setFlickering] = useState(true);
  const [initialShock, setInitialShock] = useState(true);
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
      // Auto-play the video
      if (videoRef.current) {
        videoRef.current.play().catch(err => {
          console.error('Video autoplay failed:', err);
        });
      }
    }, 150);
    
    // Random flicker during display
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
  
  // Handle video end
  const handleVideoEnd = () => {
    // Auto-close when video ends
    setTimeout(() => {
      onCloseAction();
    }, 1000);
  };
  
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        onCloseAction();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCloseAction]);
  
  return (
    <div 
      className={`${styles.overlay} ${flickering ? styles.flickering : ''} ${initialShock ? styles.initialShock : ''}`}
      onClick={onCloseAction}
    >
      {/* Scanlines */}
      <div className={styles.scanlines} />
      
      {/* CRT glow */}
      <div className={`${styles.glow} ${styles.amberGlow}`} />
      
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.headerText}>
            {corrupted ? '▓▓▓ PARTIAL VIDEO RECOVERY ▓▓▓' : '═══ RECOVERED VIDEO DATA ═══'}
          </span>
        </div>
        
        {/* Video frame */}
        <div className={`${styles.videoFrame} ${corrupted ? styles.corrupted : ''}`}>
          <div className={styles.videoWrapper}>
            {visible && (
              <video 
                ref={videoRef}
                src={src}
                className={styles.video}
                controls
                onEnded={handleVideoEnd}
                onClick={(e) => e.stopPropagation()}
              >
                <track kind="captions" />
                Your browser does not support the video tag.
              </video>
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
        
        {/* Minimal metadata */}
        <div className={styles.metadata}>
          <div>CLASSIFICATION: RESTRICTED</div>
          <div>Press ESC to close</div>
        </div>
      </div>
    </div>
  );
}
