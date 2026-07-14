/* Shared responsive hook, used across the prototype's plain-JS/Babel components
   (inline-style architecture, so breakpoints are applied in JS rather than CSS). */
function useIsMobile(breakpoint = 860) {
  const { useState, useEffect } = React;
  const get = () => typeof window !== "undefined" && window.innerWidth <= breakpoint;
  const [isMobile, setIsMobile] = useState(get());
  useEffect(() => {
    const onResize = () => setIsMobile(get());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}
Object.assign(window, { useIsMobile });
