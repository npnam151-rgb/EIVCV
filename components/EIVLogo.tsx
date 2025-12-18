
import React from 'react';

interface EIVLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  light?: boolean;
}

const EIVLogo: React.FC<EIVLogoProps> = ({ className = '', size = 'md', showTagline = true, light = false }) => {
  const sizes = {
    sm: { width: 120 },
    md: { width: 220 },
    lg: { width: 440 },
    xl: { width: 660 },
  };

  const currentSize = sizes[size];
  const orangeColor = light ? '#FFFFFF' : '#F26522';
  const darkRedColor = light ? '#FFFFFF' : '#8B1E1E';

  return (
    <div className={`flex flex-col items-center select-none ${className}`} style={{ width: currentSize.width }}>
      <svg
        viewBox="0 0 420 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        {/* Flame Icon above the I */}
        <g transform="translate(182, 5)">
          {/* Outer dark red flame */}
          <path
            d="M17.5 0C17.5 0 27 12 27 22C27 32 19 38 13.5 38C8 38 5 34 5 28C5 22 9 17 9 17C9 17 0 25 0 34.5C0 44 8 54 18.5 54C29 54 38 45 38 31C38 17 17.5 0 17.5 0Z"
            fill={darkRedColor}
          />
          {/* Inner orange flame */}
          <path
            d="M17.5 9C17.5 9 24 16 24 23.5C24 31 19 35 15.5 35C12 35 10 32 10 28.5C10 25 12.5 21.5 12.5 21.5C12.5 21.5 6 26.5 6 34C6 41.5 12 47.5 18 47.5C24 47.5 31 41 31 31C31 21 17.5 9 17.5 9Z"
            fill={orangeColor}
          />
        </g>

        {/* E - Corrected stylized shape */}
        <path
          d="M135 60H65C45 60 30 75 30 100C30 125 45 140 65 140H135V118H75C68 118 60 112 60 105H130V95H60C60 88 68 82 75 82H135V60Z"
          fill={orangeColor}
        />

        {/* I - Block with concave top */}
        <path
          d="M165 72C175 80 190 80 200 72V140H165V72Z"
          fill={orangeColor}
        />

        {/* V - Bold slanted V */}
        <path
          d="M215 60H248L275 118L302 60H335L290 140H260L215 60Z"
          fill={orangeColor}
        />

        {/* Registered Symbol R */}
        <g transform="translate(345, 110)">
          <circle cx="15" cy="15" r="14" stroke={orangeColor} strokeWidth="2.5" fill="none" />
          <path
            d="M10 22V8H16C18.5 8 20.5 9.5 20.5 12C20.5 14 19.5 15.5 17.5 16L21.5 22H18.5L15 16.5H12.5V22H10ZM12.5 14H16C17.5 14 18 13.5 18 12C18 10.5 17.5 10 16 10H12.5V14Z"
            fill={orangeColor}
          />
        </g>

        {/* Tagline "Since 2009 | Native Teacher" */}
        {showTagline && (
          <text
            x="210"
            y="185"
            textAnchor="middle"
            fill={darkRedColor}
            style={{
              fontSize: '24px',
              fontWeight: '900',
              fontFamily: 'Inter, Arial, sans-serif',
              textTransform: 'none',
              letterSpacing: '0.5px'
            }}
          >
            Since 2009 | Native Teacher
          </text>
        )}
      </svg>
    </div>
  );
};

export default EIVLogo;
