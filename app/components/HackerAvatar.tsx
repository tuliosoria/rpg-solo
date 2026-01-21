'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import styles from './HackerAvatar.module.css';

export type AvatarExpression = 'neutral' | 'shocked' | 'scared' | 'angry' | 'smirk';

interface HackerAvatarProps {
  expression: AvatarExpression;
  detectionLevel: number;
  sessionStability: number;
  onExpressionTimeout?: () => void;
}

const EXPRESSION_IMAGES: Record<AvatarExpression, string> = {
  neutral: '/images/avatar/neutral.jpg',
  shocked: '/images/avatar/shocked.jpg',
  scared: '/images/avatar/scared.jpg',
  angry: '/images/avatar/angry.jpg',
  smirk: '/images/avatar/smirk.jpg',
};

export default function HackerAvatar({ expression, detectionLevel, sessionStability, onExpressionTimeout }: HackerAvatarProps) {
  const [currentExpression, setCurrentExpression] = useState<AvatarExpression>(expression);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Format number as digital display (00:00 style)
  const formatDigital = (value: number) => {
    const clamped = Math.max(0, Math.min(100, value));
    const tens = Math.floor(clamped / 10);
    const ones = clamped % 10;
    return `${tens}0:${ones}0`;
  };
  
  useEffect(() => {
    if (expression !== 'neutral') {
      setIsTransitioning(true);
      setCurrentExpression(expression);
      
      setTimeout(() => setIsTransitioning(false), 150);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentExpression('neutral');
          setIsTransitioning(false);
          onExpressionTimeout?.();
        }, 150);
      }, 5000);
    } else {
      setCurrentExpression('neutral');
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [expression, onExpressionTimeout]);
  
  // Calculate risk bar segments (10 segments)
  const riskSegments = Math.ceil(detectionLevel / 10);
  
  return (
    <div className={styles.hudPanel}>
      {/* Left column - Meters */}
      <div className={styles.metersColumn}>
        {/* Memory meter */}
        <div className={styles.meterBox}>
          <div className={styles.meterBar}>
            <div 
              className={styles.meterFill} 
              style={{ height: `${sessionStability}%` }}
            />
          </div>
          <div className={styles.digitalDisplay}>
            {formatDigital(sessionStability)}
          </div>
          <div className={styles.meterLabel}>MEMORY</div>
        </div>
        
        {/* Risk meter */}
        <div className={styles.meterBox}>
          <div className={styles.meterLabel}>PTT</div>
          <div className={styles.riskBarContainer}>
            {[...Array(10)].map((_, i) => (
              <div 
                key={i}
                className={`${styles.riskSegment} ${i < riskSegments ? styles.riskActive : ''} ${i >= 7 ? styles.riskCritical : i >= 4 ? styles.riskWarning : ''}`}
              />
            ))}
          </div>
          <div className={styles.digitalDisplay}>
            {formatDigital(detectionLevel)}
          </div>
          <div className={styles.meterLabel}>RISK</div>
        </div>
      </div>
      
      {/* Right column - Avatar */}
      <div className={styles.avatarColumn}>
        <div className={styles.tvFrame}>
          <div className={`${styles.imageWrapper} ${isTransitioning ? styles.transitioning : ''}`}>
            <Image
              src={EXPRESSION_IMAGES[currentExpression]}
              alt="Hacker avatar"
              width={120}
              height={160}
              className={styles.avatarImage}
              priority
            />
          </div>
          
          {/* TV effects */}
          <div className={styles.staticOverlay} />
          <div className={styles.scanlines} />
          <div className={styles.flicker} />
          <div className={styles.crtCurve} />
        </div>
      </div>
    </div>
  );
}
