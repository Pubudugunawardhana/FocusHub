import React from 'react';
import { 
  Folder, Book, Code, Music, Video, Laptop, Star, Briefcase, 
  Palette, Gamepad2, Dumbbell, Plane, Camera, Compass,
  Database, FlaskConical, Globe, GraduationCap, Headphones,
  Heart, Image, Lightbulb, Map, Mic, Moon, PenTool,
  Rocket, Shield, Smartphone, Smile, Sparkles, Sun, Target,
  Trophy, Umbrella, Zap
} from 'lucide-react';

export const ICON_OPTIONS = [
  'Folder', 'Book', 'Code', 'Music', 'Video', 'Laptop', 'Star', 'Briefcase',
  'Palette', 'Gamepad2', 'Dumbbell', 'Plane', 'Camera', 'Compass',
  'Database', 'FlaskConical', 'Globe', 'GraduationCap', 'Headphones',
  'Heart', 'Image', 'Lightbulb', 'Map', 'Mic', 'Moon', 'PenTool',
  'Rocket', 'Shield', 'Smartphone', 'Smile', 'Sparkles', 'Sun', 'Target',
  'Trophy', 'Umbrella', 'Zap'
];

const IconMap: Record<string, React.ElementType> = {
  Folder, Book, Code, Music, Video, Laptop, Star, Briefcase,
  Palette, Gamepad2, Dumbbell, Plane, Camera, Compass,
  Database, FlaskConical, Globe, GraduationCap, Headphones,
  Heart, Image, Lightbulb, Map, Mic, Moon, PenTool,
  Rocket, Shield, Smartphone, Smile, Sparkles, Sun, Target,
  Trophy, Umbrella, Zap
};

interface IconRendererProps extends React.SVGProps<SVGSVGElement> {
  iconName: string;
  size?: number;
  className?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ iconName, size = 24, className = '', ...props }) => {
  const IconComponent = IconMap[iconName] || Folder;
  return <IconComponent size={size} className={className} {...props} />;
};

