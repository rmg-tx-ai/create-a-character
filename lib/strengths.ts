import React from 'react';
import { Zap, Megaphone, Users, Lightbulb } from 'lucide-react';
import { ThemeName } from './themes';

export interface StrengthCategory {
  id: string;
  name: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  description: string;
}

export const getStrengthCategories = (theme: ThemeName): StrengthCategory[] => {
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

  const colors = colorSchemes[theme] || colorSchemes.minimal;

  return baseCategories.map((category, index) => ({
    ...category,
    color: colors[index]
  }));
};
