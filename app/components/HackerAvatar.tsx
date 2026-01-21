'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import styles from './HackerAvatar.module.css';

export type AvatarExpression = 'neutral' | 'shocked' | 'scared' | 'angry' | 'smirk';

interface HackerAvatarProps {
  expression: AvatarExpression;
  onExpressionTimeout?: () => void;
}

const EXPRESSION_IMAGES: Record<AvatarExpression, string> = {
  neutral: '/images/avatar/neutral.jpg',
  shocked: '/images/avatar/shocked.jpg',
  scared: '/images/avatar/scared.jpg',
  angry: '/images/avatar/angry.jpg',
  smirk: '/images/avatar/smirk.jpg',
};

export default function HackerAvatar({ expression, onExpressionTimeout }: HackerAvatarProps) {
  const [currentExpression, setCurrentExpression] = useState<AvatarExpression>(expression);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // When expression changes
    if (expression !== 'neutral') {
      setIsTransitioning(true);
      setCurrentExpression(expression);
      
      // Brief transition effect
      setTimeout(() => setIsTransitioning(false), 150);
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Return to neutral after 5 seconds
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
    <div className={styles.avatarContainer}>
      {/* TV frame effect */}
      <div className={styles.tvFrame}>
        {/* Avatar image */}
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
        
        {/* TV static overlay */}
        <div className={styles.staticOverlay} />
        
        {/* Scanlines */}
        <div className={styles.scanlines} />
        
        {/* Screen flicker */}
        <div className={styles.flicker} />
        
        {/* CRT curve effect */}
        <div className={styles.crtCurve} />
      </div>
      
      {/* TV base/stand */}
      <div className={styles.tvStand} />
    </div>
  );
}
