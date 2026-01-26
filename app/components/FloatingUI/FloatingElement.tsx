'use client';

import React, { useEffect, useRef, ReactNode, CSSProperties } from 'react';
import { useFloatingUI, Zone } from './FloatingUIContext';

interface FloatingElementProps {
  id: string;
  zone: Zone;
  priority?: number;
  visible?: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  baseOffset?: number; // Override default 20px edge offset
}

const DEFAULT_EDGE_OFFSET = 20;

function getZoneStyle(
  zone: Zone,
  stackOffset: number,
  baseOffset: number = DEFAULT_EDGE_OFFSET
): CSSProperties {
  const base: CSSProperties = {
    position: 'fixed',
    zIndex: 50,
  };

  // For top zones, stack downward (increase top)
  // For bottom zones, stack upward (increase bottom)
  switch (zone) {
    case 'top-left':
      return { ...base, top: baseOffset + stackOffset, left: baseOffset };
    case 'top-center':
      return {
        ...base,
        top: baseOffset + stackOffset,
        left: '50%',
        transform: 'translateX(-50%)',
      };
    case 'top-right':
      return { ...base, top: baseOffset + stackOffset, right: baseOffset };
    case 'bottom-left':
      return { ...base, bottom: baseOffset + stackOffset, left: baseOffset };
    case 'bottom-center':
      return {
        ...base,
        bottom: baseOffset + stackOffset,
        left: '50%',
        transform: 'translateX(-50%)',
      };
    case 'bottom-right':
      return { ...base, bottom: baseOffset + stackOffset, right: baseOffset };
  }
}

export function FloatingElement({
  id,
  zone,
  priority = 0,
  visible = true,
  children,
  className,
  style,
  baseOffset,
}: FloatingElementProps) {
  const { register, unregister, setVisible, setHeight, getStackOffset } = useFloatingUI();
  const ref = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Register element on mount
  useEffect(() => {
    register(id, zone, priority);
    return () => unregister(id);
  }, [id, zone, priority, register, unregister]);

  // Update visibility in context when prop changes
  useEffect(() => {
    setVisible(id, visible);
  }, [id, visible, setVisible]);

  // Track height changes with ResizeObserver
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    resizeObserverRef.current = new ResizeObserver(entries => {
      for (const entry of entries) {
        const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
        setHeight(id, height);
      }
    });

    resizeObserverRef.current.observe(element);

    // Initial height measurement
    setHeight(id, element.offsetHeight);

    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, [id, setHeight]);

  if (!visible) return null;

  const stackOffset = getStackOffset(id);
  const zoneStyle = getZoneStyle(zone, stackOffset, baseOffset);

  return (
    <div ref={ref} className={className} style={{ ...zoneStyle, ...style }}>
      {children}
    </div>
  );
}
