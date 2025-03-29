import { useRef, useState, useEffect } from 'react';

/**
 * Custom hook to auto-resize font size so content fits inside its container.
 * 
 * @param {string} dependency - Any string or prop that should trigger a resize check (e.g., motionName)
 * @param {number} maxSize - The starting (maximum) font size in rem
 * @param {number} minSize - The minimum allowed font size in rem
 * @returns [fontSize, ref] - A font size string and a ref to attach to the element
 */
const useAutoFontSize = (dependency, maxSize = 3, minSize = 1.2) => {
  const ref = useRef(null);
  const [fontSize, setFontSize] = useState(maxSize);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let size = maxSize;
    element.style.fontSize = `${size}rem`;

    while (element.scrollHeight > element.clientHeight && size > minSize) {
      size -= 0.1;
      element.style.fontSize = `${size}rem`;
    }

    setFontSize(size);
  }, [dependency, maxSize, minSize]);

  useEffect(() => {
    const handleResize = () => {
      const element = ref.current;
      if (!element) return;

      let size = maxSize;
      element.style.fontSize = `${size}rem`;

      while (element.scrollHeight > element.clientHeight && size > minSize) {
        size -= 0.1;
        element.style.fontSize = `${size}rem`;
      }

      setFontSize(size);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [maxSize, minSize]);

  return [fontSize, ref];
};

export default useAutoFontSize;
