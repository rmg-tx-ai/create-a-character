import { StrengthCategory } from './strengths';
import { ThemeName } from './themes';

export interface ProfileData {
  name: string;
  title: string;
  description: string;
  image: string;
  strengths: StrengthCategory[];
  notes: string;
  theme: ThemeName;
}
