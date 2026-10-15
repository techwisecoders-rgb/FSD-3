import React from 'react';

/**
 * BlurText component inspired by ReactBits.dev
 * Smooth blur-in reveal for subheadings, captions, and key metrics.
 */
export default function BlurText({
  text = '',
  className = '',
  delay = 20,
}) {
  const words = text.split(' ');

  return (
    <span className={`inline-block ${className}`} aria-label={text}>
      {words.map((word, index) => (
        <span
          key={index}
          className="inline-block whitespace-nowrap mr-[0.22em] transition-all duration-700 ease-out"
          style={{
            animation: 'reactbits-fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            animationDelay: `${index * delay}ms`,
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
