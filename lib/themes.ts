export const themes = {
  minimal: {
    background: 'bg-white',
    card: 'bg-white border-transparent',
    accent: 'text-gray-600',
    borderClass: 'animated-border',
    sliderTrack: 'bg-gray-200'
  },
  'dark mode': {
    background: 'bg-background dark',
    card: 'bg-card border-transparent dark',
    accent: 'text-muted-foreground',
    borderClass: 'animated-border-dark',
    sliderTrack: 'bg-muted'
  },
  verizon: {
    background: 'bg-white',
    card: 'bg-white border-transparent',
    accent: 'text-red-600',
    borderClass: 'animated-border-verizon',
    sliderTrack: 'bg-gray-200'
  }
};

export type ThemeName = keyof typeof themes;

export type Theme = typeof themes[ThemeName];
