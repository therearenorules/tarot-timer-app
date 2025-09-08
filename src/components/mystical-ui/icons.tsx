// React Native 버전 아이콘 컴포넌트
// UI design/components/mystical-ui/icons.tsx에서 변환

import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Line, Polygon, Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const Clock: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#ffffff', 
  strokeWidth = 2 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={strokeWidth} />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const TarotCards: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#ffffff', 
  strokeWidth = 1.5 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* 왼쪽 카드 (15도 회전) */}
    <g transform="rotate(-15 8 12)">
      <Rect x={5} y={7} width={6} height={10} rx={1} ry={1} stroke={color} strokeWidth={strokeWidth} fill="none" />
      <Line x1={6} y1={9} x2={10} y2={9} stroke={color} strokeWidth={1} />
      <Line x1={6} y1={11} x2={10} y2={11} stroke={color} strokeWidth={1} />
      <Circle cx={8} cy={13.5} r={1} stroke={color} strokeWidth={1} fill={color} />
    </g>
    
    {/* 중앙 카드 (똑바로) */}
    <g>
      <Rect x={9} y={5} width={6} height={10} rx={1} ry={1} stroke={color} strokeWidth={strokeWidth} fill="none" />
      <Line x1={10} y1={7} x2={14} y2={7} stroke={color} strokeWidth={1} />
      <Line x1={10} y1={9} x2={14} y2={9} stroke={color} strokeWidth={1} />
      <Circle cx={12} cy={11.5} r={1} stroke={color} strokeWidth={1} fill={color} />
    </g>
    
    {/* 오른쪽 카드 (15도 회전) */}
    <g transform="rotate(15 16 12)">
      <Rect x={13} y={7} width={6} height={10} rx={1} ry={1} stroke={color} strokeWidth={strokeWidth} fill="none" />
      <Line x1={14} y1={9} x2={18} y2={9} stroke={color} strokeWidth={1} />
      <Line x1={14} y1={11} x2={18} y2={11} stroke={color} strokeWidth={1} />
      <Circle cx={16} cy={13.5} r={1} stroke={color} strokeWidth={1} fill={color} />
    </g>
    
    {/* 신비로운 반짝임 효과 */}
    <g opacity={0.8}>
      <Circle cx={6} cy={5} r={0.5} fill={color} />
      <Circle cx={18} cy={6} r={0.5} fill={color} />
      <Circle cx={12} cy={19} r={0.5} fill={color} />
    </g>
  </Svg>
);

export const BookOpen: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#ffffff', 
  strokeWidth = 2 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <Path 
      d="m22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

export const Settings: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#ffffff', 
  strokeWidth = 2 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={strokeWidth} />
    <Path 
      d="m12 1l3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6z" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

export const Sparkles: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#ffffff', 
  strokeWidth = 2 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* 메인 스파크 */}
    <Path 
      d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" 
      stroke={color} 
      strokeWidth={strokeWidth}
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    {/* 작은 스파클들 */}
    <Path d="M20 3v4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M22 5h-4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4 17v2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5 18H3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const Star: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#ffffff', 
  strokeWidth = 2 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polygon 
      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

export const ChevronLeft: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#ffffff', 
  strokeWidth = 2 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="m15 18-6-6 6-6" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

export const Save: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#ffffff', 
  strokeWidth = 2 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <Path d="M17 21v-8H7v8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7 3v5h8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const RotateCcw: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#ffffff', 
  strokeWidth = 2 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <Path d="M3 3v5h5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const Shuffle: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#ffffff', 
  strokeWidth = 2 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="m16 3 4 4-4 4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="m16 17 4 4-4 4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4 7h4l6 10h6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4 17h4l6-10h6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const Zap: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#ffffff', 
  strokeWidth = 2 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

export const Moon: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#ffffff', 
  strokeWidth = 2 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

export const Sun: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#ffffff', 
  strokeWidth = 2 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={5} stroke={color} strokeWidth={strokeWidth} />
    <Line x1={12} y1={1} x2={12} y2={3} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1={12} y1={21} x2={12} y2={23} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1={4.22} y1={4.22} x2={5.64} y2={5.64} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1={18.36} y1={18.36} x2={19.78} y2={19.78} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1={1} y1={12} x2={3} y2={12} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1={21} y1={12} x2={23} y2={12} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1={4.22} y1={19.78} x2={5.64} y2={18.36} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1={18.36} y1={5.64} x2={19.78} y2={4.22} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const Bell: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#ffffff', 
  strokeWidth = 2 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M6 8A6 6 0 0 1 18 8c0 7-3 9-3 9H9s-3-2-3-9" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <Path d="M13.73 21C13.5 21.28 13.17 21.5 12.8 21.66c-.37.16-.77.24-1.18.24s-.81-.08-1.18-.24c-.37-.16-.7-.38-.93-.66" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const Calendar: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#ffffff', 
  strokeWidth = 2 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={4} width={18} height={18} rx={2} ry={2} stroke={color} strokeWidth={strokeWidth} />
    <Line x1={16} y1={2} x2={16} y2={6} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1={8} y1={2} x2={8} y2={6} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1={3} y1={10} x2={21} y2={10} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const Check: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#ffffff', 
  strokeWidth = 2 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6 9 17l-5-5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const X: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#ffffff', 
  strokeWidth = 2 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6 6 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="m6 6 12 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const Eye: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#ffffff', 
  strokeWidth = 2 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

export const ArrowLeft: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#ffffff', 
  strokeWidth = 2 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M19 12H5" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <Path 
      d="M12 19l-7-7 7-7" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);