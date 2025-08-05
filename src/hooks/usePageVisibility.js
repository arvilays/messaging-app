import { useState, useEffect } from 'react';

function getIsDocumentHidden() {
  return !document.hidden;
}

export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(getIsDocumentHidden());

  const handleVisibilityChange = () => setIsVisible(getIsDocumentHidden());

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isVisible;
}