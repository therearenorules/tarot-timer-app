import React from 'react';
import Svg, { Path, Circle, Polyline, Rect, Line, G, Polygon } from 'react-native-svg';

interface IconProps {
  color?: string;
  size?: number;
  style?: any;
}

export const ClockIcon: React.FC<IconProps> = ({ color = '#d4af37', size = 24, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Polyline points="12,6 12,12 16,14" stroke={color} strokeWidth="2" />
  </Svg>
);

export const LayoutIcon: React.FC<IconProps> = ({ color = '#d4af37', size = 24, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth="2" />
    <Line x1="9" y1="9" x2="15" y2="9" stroke={color} strokeWidth="2" />
    <Line x1="9" y1="15" x2="15" y2="15" stroke={color} strokeWidth="2" />
  </Svg>
);

export const BookOpenIcon: React.FC<IconProps> = ({ color = '#d4af37', size = 24, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke={color} strokeWidth="2" />
    <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke={color} strokeWidth="2" />
  </Svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ color = '#d4af37', size = 24, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={color} strokeWidth="2" />
  </Svg>
);

export const TarotCardsIcon: React.FC<IconProps> = ({ color = '#d4af37', size = 24, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <G transform="rotate(-15 8 12)">
      <Rect x="5" y="7" width="6" height="10" rx="1" ry="1" stroke={color} strokeWidth="1.5" fill="none" />
      <Line x1="6" y1="9" x2="10" y2="9" stroke={color} strokeWidth="1" />
      <Line x1="6" y1="11" x2="10" y2="11" stroke={color} strokeWidth="1" />
      <Circle cx="8" cy="13.5" r="1" stroke={color} strokeWidth="1" fill={color} />
    </G>
    
    <G>
      <Rect x="9" y="5" width="6" height="10" rx="1" ry="1" stroke={color} strokeWidth="1.5" fill="none" />
      <Line x1="10" y1="7" x2="14" y2="7" stroke={color} strokeWidth="1" />
      <Line x1="10" y1="9" x2="14" y2="9" stroke={color} strokeWidth="1" />
      <Circle cx="12" cy="11.5" r="1" stroke={color} strokeWidth="1" fill={color} />
    </G>
    
    <G transform="rotate(15 16 12)">
      <Rect x="13" y="7" width="6" height="10" rx="1" ry="1" stroke={color} strokeWidth="1.5" fill="none" />
      <Line x1="14" y1="9" x2="18" y2="9" stroke={color} strokeWidth="1" />
      <Line x1="14" y1="11" x2="18" y2="11" stroke={color} strokeWidth="1" />
      <Circle cx="16" cy="13.5" r="1" stroke={color} strokeWidth="1" fill={color} />
    </G>
    
    <G opacity="0.6">
      <Circle cx="6" cy="5" r="0.5" fill={color} />
      <Circle cx="18" cy="6" r="0.5" fill={color} />
      <Circle cx="12" cy="19" r="0.5" fill={color} />
    </G>
  </Svg>
);

export const StarIcon: React.FC<IconProps> = ({ color = '#d4af37', size = 24, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke={color} strokeWidth="2" />
  </Svg>
);

export const ZapIcon: React.FC<IconProps> = ({ color = '#d4af37', size = 24, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Polygon points="13,2 3,14 12,14 11,22 21,10 12,10" stroke={color} strokeWidth="2" />
  </Svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ color = '#d4af37', size = 24, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" stroke={color} strokeWidth="2" />
    <Path d="M20 3v4" stroke={color} strokeWidth="2" />
    <Path d="M22 5h-4" stroke={color} strokeWidth="2" />
    <Path d="M4 17v2" stroke={color} strokeWidth="2" />
    <Path d="M5 18H3" stroke={color} strokeWidth="2" />
  </Svg>
);

export const SaveIcon: React.FC<IconProps> = ({ color = '#d4af37', size = 24, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke={color} strokeWidth="2" />
    <Polyline points="17,21 17,13 7,13 7,21" stroke={color} strokeWidth="2" />
    <Polyline points="7,3 7,8 15,8" stroke={color} strokeWidth="2" />
  </Svg>
);

export const CrownIcon: React.FC<IconProps> = ({ color = '#d4af37', size = 24, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M2 19h20l-2-8-6 2-2-8-2 8-6-2z" stroke={color} strokeWidth="2" />
  </Svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ color = '#d4af37', size = 24, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth="2" />
    <Line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="2" />
    <Line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="2" />
    <Line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="2" />
  </Svg>
);

export const BellIcon: React.FC<IconProps> = ({ color = '#d4af37', size = 24, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="2" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="2" />
  </Svg>
);

export const Volume2Icon: React.FC<IconProps> = ({ color = '#d4af37', size = 24, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Polygon points="11,5 6,9 2,9 2,15 6,15 11,19" stroke={color} strokeWidth="2" />
    <Path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke={color} strokeWidth="2" />
  </Svg>
);

export const SunIcon: React.FC<IconProps> = ({ color = '#d4af37', size = 24, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" />
    <Line x1="12" y1="1" x2="12" y2="3" stroke={color} strokeWidth="2" />
    <Line x1="12" y1="21" x2="12" y2="23" stroke={color} strokeWidth="2" />
    <Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke={color} strokeWidth="2" />
    <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke={color} strokeWidth="2" />
    <Line x1="1" y1="12" x2="3" y2="12" stroke={color} strokeWidth="2" />
    <Line x1="21" y1="12" x2="23" y2="12" stroke={color} strokeWidth="2" />
    <Line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke={color} strokeWidth="2" />
    <Line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke={color} strokeWidth="2" />
  </Svg>
);

export const GlobeIcon: React.FC<IconProps> = ({ color = '#d4af37', size = 24, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="2" />
    <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={color} strokeWidth="2" />
  </Svg>
);