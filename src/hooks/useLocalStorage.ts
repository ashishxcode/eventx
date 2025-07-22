import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to track client-side rendering
  const [isClient, setIsClient] = useState(false);

  // State for storing the value
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Always return initial value during SSR or before client hydration
    return initialValue;
  });

  // Ensure client-side status and load from localStorage
  useEffect(() => {
    // Mark as client-side
    setIsClient(true);

    // Attempt to retrieve from localStorage
    try {
      // Only attempt if we're in browser environment
      const item = localStorage.getItem(key);
      if (item) {
        const parsedItem = JSON.parse(item);
        setStoredValue(parsedItem);
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  // Effect to update localStorage when value changes
  useEffect(() => {
    // Only update localStorage when on client and value has changed from initial
    if (isClient && storedValue !== initialValue) {
      try {
        localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    }
  }, [isClient, key, storedValue, initialValue]);

  // Custom setter that mimics useState
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);
    } catch (error) {
      console.warn(`Error setting value for key "${key}":`, error);
    }
  };

  // If not on client, always return initial value to prevent hydration errors
  return [isClient ? storedValue : initialValue, setValue] as const;
}
