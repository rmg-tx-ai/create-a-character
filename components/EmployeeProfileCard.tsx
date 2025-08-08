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
import { AnimatedSlider } from './ui/AnimatedSlider';

import { ProfileData } from '../lib/types';
import { themes, ThemeName } from '../lib/themes';
import { getStrengthCategories } from '../lib/strengths';
import { ProfileHeader } from './ProfileHeader';
import { StrengthsSection } from './StrengthsSection';
import { ProfileActions } from './ProfileActions';
import html2canvas from 'html2canvas';

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

  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const updateProfile = useCallback((updates: Partial<ProfileData>) => {
    setProfile(prev => {
      const newProfile = { ...prev, ...updates };

      if (updates.theme && updates.theme !== prev.theme) {
        const newStrengths = getStrengthCategories(updates.theme).map((newCategory, index) => ({
          ...prev.strengths[index],
          color: newCategory.color
        }));
        newProfile.strengths = newStrengths;

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

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // If you have images from other domains
        backgroundColor: null, // Use transparent background
      });
      const link = document.createElement('a');
      link.download = `${profile.name.replace(/\s+/g, '-').toLowerCase()}-character-sheet.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsDownloading(false);
    }
  }, [profile.name]);

  const theme = themes[profile.theme];

  return (
    <TooltipProvider>
      <div className={`min-h-screen p-4 transition-all duration-500 ${theme.background}`}>
        <div className="max-w-md mx-auto space-y-6">
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
                onClick={() => updateProfile({ theme: key as ThemeName })}
                className="capitalize"
              >
                <Palette className="w-3 h-3 mr-1" />
                {key}
              </Button>
            ))}
          </motion.div>

          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <Card className={`p-6 shadow-2xl transition-all duration-300 ${theme.card} ${theme.borderClass}`}>
              <ProfileHeader
                profile={profile}
                updateProfile={updateProfile}
                handleImageUpload={handleImageUpload}
              />
              <StrengthsSection
                strengths={profile.strengths}
                updateStrength={updateStrength}
                theme={theme}
              />
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

          <ProfileActions
            randomizeProfile={randomizeProfile}
            downloadCard={downloadCard}
            isDownloading={isDownloading}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}