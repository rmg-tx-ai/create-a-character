import React from 'react';

// Custom Animated Slider Component
export interface AnimatedSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  color: string;
  className?: string;
  trackBackground?: string;
}

export function AnimatedSlider({ value, onValueChange, min, max, color, className, trackBackground = 'bg-gray-200' }: AnimatedSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`relative h-3 w-full ${className}`}>
      {/* Background track */}
      <div className={`absolute inset-0 ${trackBackground} rounded-full`} />

      {/* Progress track with subtle animation */}
      <div
        className="h-full rounded-full relative overflow-hidden"
        style={{
          backgroundColor: color,
          width: `${percentage}%`,
        }}
      >
        {/* Subtle animated shine effect */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
            backgroundSize: '200% 100%',
            animation: 'strength-flow 3s ease-in-out infinite',
          }}
        />
      </div>

      {/* Interactive slider input */}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onValueChange(parseInt(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      {/* Simple thumb */}
      <div
        className="absolute top-1/2 w-5 h-5 bg-white rounded-full shadow-md border-2 transform -translate-y-1/2 cursor-pointer transition-transform hover:scale-110"
        style={{
          left: `calc(${percentage}% - 10px)`,
          borderColor: color,
        }}
      />
    </div>
  );
}
