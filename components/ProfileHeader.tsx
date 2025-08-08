import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Upload } from 'lucide-react';
import { ProfileData } from '../lib/types';

interface ProfileHeaderProps {
  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => void;
  handleImageUpload: (file: File) => void;
}

export function ProfileHeader({ profile, updateProfile, handleImageUpload }: ProfileHeaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <>
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
    </>
  );
}
