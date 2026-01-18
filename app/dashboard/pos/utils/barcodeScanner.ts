import { useCallback, useEffect, useRef } from 'react';

export const useBarcodeScanner = (
  onScan: (barcode: string) => void,
  options = { minLength: 8, timeout: 100 }
) => {
  const barcodeRef = useRef('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Ignore if focus is in an input field
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }
    
    // Handle barcode scanner input (rapid keypresses)
    if (event.key === 'Enter') {
      // Complete barcode scan on Enter
      if (barcodeRef.current.length >= options.minLength) {
        onScan(barcodeRef.current);
        barcodeRef.current = '';
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }
    } else if (/^[0-9a-zA-Z]$/.test(event.key)) {
      // Accumulate barcode characters
      barcodeRef.current += event.key;
      
      // Clear previous timeout
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Set new timeout for auto-submit
      timerRef.current = setTimeout(() => {
        if (barcodeRef.current.length >= options.minLength) {
          onScan(barcodeRef.current);
        }
        barcodeRef.current = '';
        timerRef.current = null;
      }, options.timeout);
    }
  }, [onScan, options.minLength, options.timeout]);
  
  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [handleKeyPress]);
  
  // Optional: Also listen for physical scanner events (if using USB scanner)
  useEffect(() => {
    const handleScannerInput = (e: Event) => {
      // Some scanners dispatch custom events
      const barcode = (e as CustomEvent).detail?.barcode;
      if (barcode) {
        onScan(barcode);
      }
    };
    
    window.addEventListener('scanner-input', handleScannerInput as EventListener);
    return () => {
      window.removeEventListener('scanner-input', handleScannerInput as EventListener);
    };
  }, [onScan]);
  
  return { 
    reset: () => { 
      barcodeRef.current = '';
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    },
    getCurrentBarcode: () => barcodeRef.current
  };
};