'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  return (
    <Script
      src="/sw.js"
      strategy="afterInteractive"
    />
  );
}
