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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function HackerAvatar({ expression, detectionLevel, sessionStability, onExpressionTimeout }: HackerAvatarProps) {
  const [currentExpression, setCurrentExpression] = useState<AvatarExpression>(expression);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
  
  return (
    <div className={styles.hudPanel}>
      {/* Avatar only - meters removed per UI cleanup */}
      <div className={styles.avatarColumn}>
        <div className={styles.tvFrame}>
          {/* Green scanning bar */}
          <div className={styles.scanBar} />
          
          <div className={`${styles.imageWrapper} ${isTransitioning ? styles.transitioning : ''}`}>
            <Image
              src={EXPRESSION_IMAGES[currentExpression]}
              alt="Hacker avatar"
              width={156}
              height={208}
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
