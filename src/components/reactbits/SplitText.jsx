import React from 'react';

/**
 * SplitText component inspired by ReactBits.dev
 * Splits text into words with staggered reveal animation,
 * respecting reduced motion and maintaining typography flow without layout shift.
 */
export default function SplitText({
  text = '',
  className = '',
  delay = 40,
  wordClassName = '',
}) {
  const words = text.split(' ');

  return (
    <span className={`inline-block ${className}`} aria-label={text}>
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          className="inline-block whitespace-nowrap mr-[0.25em]"
        >
          <span
            className={`animate-split-word ${wordClassName}`}
            style={{
              animationDelay: `${wordIndex * delay}ms`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}
