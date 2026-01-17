'use client';

import React, { useEffect, useState } from 'react';
import styles from './ImageOverlay.module.css';

interface ImageOverlayProps {
  src: string;
  alt: string;
  tone: 'clinical' | 'surveillance';
  onCloseAction: () => void;
  corrupted?: boolean;
}

export default function ImageOverlay({ src, alt, tone, onCloseAction, corrupted = false }: ImageOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [flickering, setFlickering] = useState(true);
  
  useEffect(() => {
    // Initial flicker effect
    const flickerTimeout = setTimeout(() => {
      setFlickering(false);
      setVisible(true);
    }, 300);
    
    // Random flicker during display
    const flickerInterval = setInterval(() => {
      if (Math.random() < 0.15) {
        setFlickering(true);
        setTimeout(() => setFlickering(false), 100 + Math.random() * 150);
      }
    }, 2000);
    
    return () => {
      clearTimeout(flickerTimeout);
      clearInterval(flickerInterval);
    };
  }, []);
  
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
      className={`${styles.overlay} ${flickering ? styles.flickering : ''}`}
      onClick={onCloseAction}
    >
      {/* Scanlines */}
      <div className={styles.scanlines} />
      
      {/* CRT glow */}
      <div className={`${styles.glow} ${tone === 'clinical' ? styles.greenGlow : styles.amberGlow}`} />
      
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.headerText}>
            ═══ RECOVERED VISUAL DATA ═══
          </span>
        </div>
        
        {/* Image frame */}
        <div className={`${styles.imageFrame} ${corrupted ? styles.corrupted : ''}`}>
          <div className={`${styles.imageWrapper} ${tone === 'clinical' ? styles.greenTone : styles.amberTone}`}>
            {visible && (
              <img 
                src={src} 
                alt={alt}
                className={styles.image}
              />
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
        
        {/* Footer */}
        <div className={styles.footer}>
          <span className={styles.footerText}>
            [PRESS ANY KEY TO CONTINUE]
          </span>
        </div>
        
        {/* Metadata */}
        <div className={styles.metadata}>
          <div>SOURCE: ARCHIVE RECOVERY</div>
          <div>STATUS: {corrupted ? 'PARTIAL' : 'RECONSTRUCTED'}</div>
          <div>CLASSIFICATION: RESTRICTED</div>
        </div>
      </div>
    </div>
  );
}
