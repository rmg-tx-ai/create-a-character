import React, { useState, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  Download, 
  Upload, 
  Zap, 
  Megaphone, 
  Users, 
  Lightbulb,
  Star,
  Palette,
  Save,
  Shuffle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Custom Animated Slider Component
interface AnimatedSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  color: string;
  className?: string;
  trackBackground?: string;
}

function AnimatedSlider({ value, onValueChange, min, max, color, className, trackBackground = 'bg-gray-200' }: AnimatedSliderProps) {
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

interface StrengthCategory {
  id: string;
  name: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  description: string;
}

interface ProfileData {
  name: string;
  title: string;
  description: string;
  image: string;
  strengths: StrengthCategory[];
  notes: string;
  theme: 'minimal' | 'dark mode' | 'verizon';
}

const themes = {
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

const getStrengthCategories = (theme: string): StrengthCategory[] => {
  const baseCategories = [
    {
      id: 'executing',
      name: 'Executing',
      value: 3,
      icon: <Zap className="w-4 h-4" />,
      description: 'Gets things done and delivers results'
    },
    {
      id: 'influencing',
      name: 'Influencing',
      value: 4,
      icon: <Megaphone className="w-4 h-4" />,
      description: 'Leads and motivates others effectively'
    },
    {
      id: 'relationship-building',
      name: 'Relationship Building',
      value: 5,
      icon: <Users className="w-4 h-4" />,
      description: 'Connects and collaborates with others'
    },
    {
      id: 'strategic-thinking',
      name: 'Strategic Thinking',
      value: 2,
      icon: <Lightbulb className="w-4 h-4" />,
      description: 'Thinks ahead and plans strategically'
    }
  ];

  const colorSchemes = {
    minimal: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'],
    'dark mode': ['#60a5fa', '#a78bfa', '#f472b6', '#34d399'],
    verizon: ['#EE0000', '#000000', '#1E40AF', '#6B7280']
  };

  const colors = colorSchemes[theme as keyof typeof colorSchemes] || colorSchemes.minimal;

  return baseCategories.map((category, index) => ({
    ...category,
    color: colors[index]
  }));
};

interface EmployeeProfileCardProps {
  onThemeChange?: (isDarkMode: boolean) => void;
}

export function EmployeeProfileCard({ onThemeChange }: EmployeeProfileCardProps = {}) {
  const [profile, setProfile] = useState<ProfileData>({
    name: 'Aria Montgomery',
    title: 'Product Designer',
    description: 'Leads the design team for our flagship product, turning user research into intuitive and beautiful interfaces.',
    image: '',
    strengths: getStrengthCategories('minimal'),
    notes: '',
    theme: 'minimal'
  });

  const [dragActive, setDragActive] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const updateProfile = useCallback((updates: Partial<ProfileData>) => {
    setProfile(prev => {
      const newProfile = { ...prev, ...updates };
      
      // Update strength colors when theme changes
      if (updates.theme && updates.theme !== prev.theme) {
        const newStrengths = getStrengthCategories(updates.theme).map((newCategory, index) => ({
          ...prev.strengths[index],
          color: newCategory.color
        }));
        newProfile.strengths = newStrengths;
        
        // Notify parent component about theme change
        if (onThemeChange) {
          onThemeChange(updates.theme === 'dark mode');
        }
      }
      
      return newProfile;
    });
  }, [onThemeChange]);

  const updateStrength = useCallback((id: string, value: number) => {
    setProfile(prev => ({
      ...prev,
      strengths: prev.strengths.map(strength =>
        strength.id === id ? { ...strength, value } : strength
      )
    }));
  }, []);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      updateProfile({ image: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  }, [updateProfile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleImageUpload(imageFile);
    }
  }, [handleImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const randomizeProfile = useCallback(() => {
    const names = ['Alex Rivera', 'Jordan Chen', 'Casey Murphy', 'Taylor Kim', 'Morgan Davis'];
    const titles = ['Product Designer', 'Engineering Lead', 'Marketing Strategist', 'Data Scientist', 'UX Researcher'];
    const descriptions = [
      'Passionate about creating user-centered designs that solve real problems.',
      'Leads cross-functional teams to deliver innovative solutions.',
      'Drives growth through data-driven marketing strategies.',
      'Transforms complex data into actionable insights.',
      'Advocates for users through comprehensive research and testing.'
    ];

    const randomStrengths = profile.strengths.map(strength => ({
      ...strength,
      value: Math.floor(Math.random() * 5) + 1
    }));

    updateProfile({
      name: names[Math.floor(Math.random() * names.length)],
      title: titles[Math.floor(Math.random() * titles.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      strengths: randomStrengths
    });
  }, [profile.strengths, updateProfile]);

  const downloadCard = useCallback(async () => {
    if (!cardRef.current) return;
    
    setIsDownloading(true);
    
    // Simulate download process
    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `${profile.name.replace(/\s+/g, '-').toLowerCase()}-character-sheet.png`;
      // In a real implementation, you'd use html2canvas or similar
      console.log('Download functionality would be implemented here');
      setIsDownloading(false);
    }, 1500);
  }, [profile.name]);

  const theme = themes[profile.theme];

  return (
    <TooltipProvider>
      <div className={`min-h-screen p-4 transition-all duration-500 ${theme.background}`}>
        <div className="max-w-md mx-auto space-y-6">
          {/* Theme Selector */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-2"
          >
            {Object.entries(themes).map(([key, _]) => (
              <Button
                key={key}
                size="sm"
                variant={profile.theme === key ? "default" : "outline"}
                onClick={() => updateProfile({ theme: key as any })}
                className="capitalize"
              >
                <Palette className="w-3 h-3 mr-1" />
                {key}
              </Button>
            ))}
          </motion.div>

          {/* Main Card */}
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <Card className={`p-6 shadow-2xl transition-all duration-300 ${theme.card} ${theme.borderClass}`}>
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center mb-6">
                <motion.div 
                  className={`relative group ${dragActive ? 'scale-105' : ''}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage src={profile.image} alt={profile.name} />
                    <AvatarFallback className="text-2xl font-medium bg-gradient-to-br from-violet-100 to-pink-100 text-violet-700">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full shadow-lg"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Upload photo</TooltipContent>
                  </Tooltip>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                </motion.div>
              </div>

              {/* Name and Title */}
              <div className="text-center mb-6 space-y-2">
                <Input
                  value={profile.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  className="text-center text-2xl font-semibold border-none bg-transparent focus:bg-accent/20 transition-colors"
                  placeholder="Employee Name"
                />
                <Input
                  value={profile.title}
                  onChange={(e) => updateProfile({ title: e.target.value })}
                  className="text-center text-muted-foreground border-none bg-transparent focus:bg-accent/20 transition-colors"
                  placeholder="Job Title"
                />
                <Textarea
                  value={profile.description}
                  onChange={(e) => updateProfile({ description: e.target.value })}
                  className="text-center text-sm text-muted-foreground border-none bg-transparent focus:bg-accent/20 transition-colors resize-none"
                  placeholder="Brief description..."
                  rows={2}
                />
              </div>

              {/* Strengths */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Strengths</h3>
                  <Badge variant="secondary" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Character Stats
                  </Badge>
                </div>
                
                <AnimatePresence>
                  {profile.strengths.map((strength, index) => (
                    <motion.div
                      key={strength.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button 
                              type="button"
                              className="flex items-center gap-2 cursor-help text-left bg-transparent border-none p-0 hover:opacity-80 transition-opacity"
                            >
                              <div style={{ color: strength.color }}>
                                {strength.icon}
                              </div>
                              <span className="text-sm font-medium">{strength.name}</span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{strength.description}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Badge 
                          variant="outline" 
                          className="font-bold text-xs min-w-[24px] justify-center"
                          style={{ borderColor: strength.color, color: strength.color }}
                        >
                          {strength.value}
                        </Badge>
                      </div>
                      <AnimatedSlider
                        value={strength.value}
                        onValueChange={(value) => updateStrength(strength.id, value)}
                        max={5}
                        min={1}
                        color={strength.color}
                        className="w-full"
                        trackBackground={theme.sliderTrack}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Succession Profile</h3>
                <Textarea
                  value={profile.notes}
                  onChange={(e) => updateProfile({ notes: e.target.value })}
                  placeholder="Manager's notes and development areas..."
                  className="min-h-[80px] transition-all focus:ring-2"
                  rows={3}
                />
              </div>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-2 justify-center"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={randomizeProfile}>
                  <Shuffle className="w-4 h-4 mr-2" />
                  Randomize
                </Button>
              </TooltipTrigger>
              <TooltipContent>Generate random profile data</TooltipContent>
            </Tooltip>

            <Button onClick={downloadCard} disabled={isDownloading}>
              {isDownloading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 mr-2"
                >
                  <Save className="w-4 h-4" />
                </motion.div>
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isDownloading ? 'Generating...' : 'Download PNG'}
            </Button>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
}