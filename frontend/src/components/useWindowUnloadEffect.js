import { useEffect, useRef } from 'react';

export const useWindowUnloadEffect = (handler, callOnCleanup) => {
  const cb = useRef();
  
  cb.current = handler;
  
  useEffect(() => {
    const handler = () => cb.current();
  
    window.addEventListener('beforeunload', handler);
    
    return () => {
      // if(callOnCleanup) handler();
    
      window.removeEventListener('beforeunload', handler);
    }
  }, [callOnCleanup]);
};