import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { AnimatedSlider } from './ui/AnimatedSlider';
import { StrengthCategory } from '../lib/strengths';
import { Star } from 'lucide-react';
import { Theme } from '../lib/themes';

interface StrengthsSectionProps {
  strengths: StrengthCategory[];
  updateStrength: (id: string, value: number) => void;
  theme: Theme;
}

export function StrengthsSection({ strengths, updateStrength, theme }: StrengthsSectionProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Strengths</h3>
        <Badge variant="secondary" className="text-xs">
          <Star className="w-3 h-3 mr-1" />
          Character Stats
        </Badge>
      </div>

      <AnimatePresence>
        {strengths.map((strength, index) => (
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
  );
}
