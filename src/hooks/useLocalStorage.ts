"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [isMounted, setIsMounted] = useState(false);
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setValue(JSON.parse(stored));
      } catch (error) {
        console.error("Error parsing localStorage", error);
      }
    }
  }, [key]);

  const setLocalStorageValue = (newValue: T) => {
    setValue(newValue);
    if (isMounted) {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  };

  return [value, setLocalStorageValue];
}
