import React from 'react';

export default function useAdaptation() {
  const adaptation = React.useCallback(() => {
    const { width, height } = window.getComputedStyle(document.querySelector('#root').firstElementChild);
    document.body.style.overflow = 'hidden';
    const radioX = document.documentElement.clientWidth / parseFloat(width);
    const radioY = document.documentElement.clientHeight / parseFloat(height);
    document.body.style.transformOrigin = '0 0'
    document.body.style.transform = `scale(${radioX},${radioY})`;
  });

  React.useEffect(() => {
    adaptation();
    window.addEventListener('resize', adaptation);
    return () => window.removeEventListener('resize', adaptation);
  }, []);
}
