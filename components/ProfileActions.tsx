import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Download, Save, Shuffle } from 'lucide-react';

interface ProfileActionsProps {
  randomizeProfile: () => void;
  downloadCard: () => void;
  isDownloading: boolean;
}

export function ProfileActions({ randomizeProfile, downloadCard, isDownloading }: ProfileActionsProps) {
  return (
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
  );
}
