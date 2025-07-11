// components/ParallaxBackground.tsx
import React, { ReactNode, useEffect, useRef, useState, useCallback } from 'react';

interface ParallaxBackgroundProps {
  children?: ReactNode;
  intensity?: number; // Overall intensity of parallax effects
  scrollMultiplier?: number; // How much scroll affects elements
  mouseSensitivity?: number; // How much mouse movement affects elements
  enableMouseParallax?: boolean; // Toggle mouse parallax effect
  enableScrollParallax?: boolean; // Toggle scroll parallax effect
  baseHueRotation?: number; // Starting hue for color shifts
  darkMode?: boolean; // Dark mode toggle
}

const ParallaxBackground = ({
  children,
  intensity = 1,
  scrollMultiplier = 0.5,
  mouseSensitivity = 0.05,
  enableMouseParallax = true,
  enableScrollParallax = true,
  baseHueRotation = 0,
  darkMode = true, // Default to dark mode
}: ParallaxBackgroundProps) => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (enableScrollParallax) {
      setScrollY(window.scrollY * scrollMultiplier);
    }
  }, [scrollMultiplier, enableScrollParallax]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (enableMouseParallax && containerRef.current) {
      const { clientX, clientY } = e;
      const { offsetWidth, offsetHeight } = containerRef.current;

      setMousePosition({
        x: ((clientX - offsetWidth / 2) / offsetWidth) * 2,
        y: ((clientY - offsetHeight / 2) / offsetHeight) * 2,
      });
    }
  }, [enableMouseParallax]);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [handleScroll, handleMouseMove]);

  const getAdjustedTransform = (
    scrollFactor: number,
    mouseFactor: number,
    rotationFactor = 0,
    scaleFactor = 0
  ) => {
    const translateY = enableScrollParallax ? scrollY * scrollFactor * intensity : 0;
    const mouseX = enableMouseParallax ? mousePosition.x * mouseSensitivity * intensity * mouseFactor : 0;
    const mouseY = enableMouseParallax ? mousePosition.y * mouseSensitivity * intensity * mouseFactor : 0;
    const rotate = enableScrollParallax ? scrollY * rotationFactor * intensity : 0;
    const scale = enableScrollParallax ? 1 + Math.sin(scrollY * scaleFactor * 0.005) * 0.1 : 1;

    return {
      transform: `translate(${mouseX}px, ${mouseY + translateY}px) rotate(${rotate}deg) scale(${scale})`,
    };
  };

  // Dark mode color adjustments
  const bgGradient = darkMode
    ? `linear-gradient(
        ${135 + scrollY * 0.01}deg,
        hsl(${baseHueRotation + scrollY * 0.02}, 30%, 10%) 0%,
        hsl(${baseHueRotation + 180 + scrollY * 0.03}, 30%, 15%) 100%
      )`
    : `linear-gradient(
        ${135 + scrollY * 0.01}deg,
        hsl(${baseHueRotation + scrollY * 0.02}, 70%, 85%) 0%,
        hsl(${baseHueRotation + 180 + scrollY * 0.03}, 70%, 90%) 100%
      )`;

  const shapeColor = darkMode ? 'rgba(100, 150, 255, 0.1)' : 'rgba(0, 0, 255, 0.15)';
  const shapeColor2 = darkMode ? 'rgba(150, 100, 255, 0.1)' : 'rgba(128, 0, 128, 0.15)';
  const shapeColor3 = darkMode ? 'rgba(100, 255, 150, 0.1)' : 'rgba(0, 128, 0, 0.15)';
  const particleColor = darkMode ? 'rgba(0, 255, 255, 0.3)' : 'rgba(0, 200, 200, 0.5)';
  const gridColor = darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)';
  const vignetteColor = darkMode 
    ? `rgba(0, 0, 0, ${0.3 + Math.sin(scrollY * 0.004) * 0.1})` 
    : `rgba(0, 0, 0, ${0.2 + Math.sin(scrollY * 0.004) * 0.08})`;

  return (
    <div ref={containerRef} className="absolute inset-0 will-change-transform overflow-hidden">
      {/* Layer 1: Dark Gradient Background */}
      <div
        className="absolute inset-0 transition-all duration-300 ease-out"
        style={{
          background: bgGradient,
          ...getAdjustedTransform(0.1, 0.05),
        }}
      />

      {/* Layer 2: Floating Geometric Shapes */}
      <div
        className="absolute inset-0"
        style={{
          ...getAdjustedTransform(0.2, 0.1),
        }}
      >
        <div
          className="absolute top-[10%] left-[15%] w-48 h-48 rounded-full mix-blend-multiply opacity-15 md:w-64 md:h-64 lg:w-80 lg:h-80 transition-all duration-300 ease-out"
          style={{
            backgroundColor: shapeColor,
            transform: `rotate(${scrollY * 0.05}deg) scale(${1 + Math.sin(scrollY * 0.005) * 0.05})`,
          }}
        />
        <div
          className="absolute bottom-[20%] right-[10%] w-32 h-32 rounded-lg mix-blend-multiply opacity-15 md:w-48 md:h-48 lg:w-60 lg:h-60 transition-all duration-300 ease-out"
          style={{
            backgroundColor: shapeColor2,
            transform: `rotate(${-scrollY * 0.07}deg) scale(${1 + Math.cos(scrollY * 0.004) * 0.05})`,
          }}
        />
        <div
          className="absolute top-[40%] right-[30%] w-24 h-24 rounded-3xl mix-blend-multiply opacity-15 md:w-36 md:h-36 lg:w-48 lg:h-48 transition-all duration-300 ease-out"
          style={{
            backgroundColor: shapeColor3,
            transform: `rotate(${scrollY * 0.03}deg) scale(${1 + Math.sin(scrollY * 0.006) * 0.05})`,
          }}
        />
      </div>

      {/* Layer 3: Subtle Grid Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundSize: '40px 40px',
          backgroundImage: `radial-gradient(circle, ${gridColor} 1px, transparent 1px)`,
          ...getAdjustedTransform(0.3, 0.15),
          filter: `hue-rotate(${scrollY * 0.05}deg)`,
          opacity: 0.5,
        }}
      />

      {/* Layer 4: Interactive Particles */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          ...getAdjustedTransform(0.4, 0.3),
        }}
      >
        {[...Array(30)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full opacity-50"
            style={{
              left: `${(i * 3.33) % 100}%`,
              top: `${(i * 5.55) % 100}%`,
              backgroundColor: particleColor,
              transform: `translate(
                ${Math.sin(scrollY * 0.01 + i) * 15}px,
                ${Math.cos(scrollY * 0.01 + i) * 15}px
              ) scale(${1 + Math.sin(scrollY * 0.008 + i) * 0.2})`,
              filter: `blur(${Math.abs(Math.sin(scrollY * 0.005 + i)) * 2}px)`,
              transition: 'transform 0.1s ease-out',
            }}
          />
        ))}
      </div>

      {/* Layer 5: Dynamic Vignette */}
      <div
        className="absolute inset-0 transition-all duration-300 ease-out"
        style={{
          background: `radial-gradient(
            circle at ${50 + mousePosition.x * 2}% ${50 + mousePosition.y * 2}%,
            transparent 0%,
            rgba(0, 0, 0, ${0.2 + Math.sin(scrollY * 0.003) * 0.1}) 70%,
            ${vignetteColor} 100%
          )`,
          opacity: 0.7,
          mixBlendMode: 'overlay',
          filter: `brightness(${1 + Math.abs(mousePosition.x) * 0.05})`,
        }}
      />

      {/* Children content */}
      {children && (
        <div className="relative z-10 h-full w-full pointer-events-auto">
          {children}
        </div>
      )}
    </div>
  );
};

export default ParallaxBackground;