'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from 'react';

export type Zone =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

interface UIElement {
  id: string;
  zone: Zone;
  priority: number; // Lower = closer to edge
  height: number;
  visible: boolean;
}

interface FloatingUIContextType {
  register: (id: string, zone: Zone, priority: number) => void;
  unregister: (id: string) => void;
  setVisible: (id: string, visible: boolean) => void;
  setHeight: (id: string, height: number) => void;
  getStackOffset: (id: string) => number;
  getZoneElements: (zone: Zone) => UIElement[];
}

const FloatingUIContext = createContext<FloatingUIContextType | null>(null);

const ELEMENT_GAP = 8; // Gap between stacked elements

export function FloatingUIProvider({ children }: { children: ReactNode }) {
  const [elements, setElements] = useState<Map<string, UIElement>>(new Map());

  const register = useCallback((id: string, zone: Zone, priority: number) => {
    setElements(prev => {
      const next = new Map(prev);
      const existing = next.get(id);
      next.set(id, {
        id,
        zone,
        priority,
        height: existing?.height ?? 0,
        visible: existing?.visible ?? true,
      });
      return next;
    });
  }, []);

  const unregister = useCallback((id: string) => {
    setElements(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const setVisible = useCallback((id: string, visible: boolean) => {
    setElements(prev => {
      const el = prev.get(id);
      if (!el || el.visible === visible) return prev;
      const next = new Map(prev);
      next.set(id, { ...el, visible });
      return next;
    });
  }, []);

  const setHeight = useCallback((id: string, height: number) => {
    setElements(prev => {
      const el = prev.get(id);
      if (!el || el.height === height) return prev;
      const next = new Map(prev);
      next.set(id, { ...el, height });
      return next;
    });
  }, []);

  const getZoneElements = useCallback(
    (zone: Zone): UIElement[] => {
      return Array.from(elements.values())
        .filter(el => el.zone === zone && el.visible)
        .sort((a, b) => a.priority - b.priority);
    },
    [elements]
  );

  const getStackOffset = useCallback(
    (id: string): number => {
      const el = elements.get(id);
      if (!el || !el.visible) return 0;

      const zoneElements = getZoneElements(el.zone);
      let offset = 0;

      for (const other of zoneElements) {
        if (other.id === id) break;
        // Add height + gap for each element with lower priority
        offset += other.height + ELEMENT_GAP;
      }

      return offset;
    },
    [elements, getZoneElements]
  );

  const value = useMemo(
    () => ({
      register,
      unregister,
      setVisible,
      setHeight,
      getStackOffset,
      getZoneElements,
    }),
    [register, unregister, setVisible, setHeight, getStackOffset, getZoneElements]
  );

  return <FloatingUIContext.Provider value={value}>{children}</FloatingUIContext.Provider>;
}

export function useFloatingUI() {
  const context = useContext(FloatingUIContext);
  if (!context) {
    throw new Error('useFloatingUI must be used within FloatingUIProvider');
  }
  return context;
}
