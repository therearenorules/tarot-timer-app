import React from 'react';
import { ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

// Figma UI 아이콘 SVG 문자열들
const ICONS = {
  // 네비게이션 아이콘
  clock: `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke-width="2" />
    <polyline points="12,6 12,12 16,14" stroke-width="2" />
  </svg>`,
  
  layout: `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="9" stroke-width="2" />
    <rect x="14" y="3" width="7" height="5" stroke-width="2" />
    <rect x="14" y="12" width="7" height="9" stroke-width="2" />
    <rect x="3" y="16" width="7" height="5" stroke-width="2" />
  </svg>`,
  
  'book-open': `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke-width="2" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke-width="2" />
  </svg>`,
  
  settings: `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="3" stroke-width="2" />
    <path d="M12 1v6m0 8v6m11-6h-6M8 12H2m15.5-5l-4.5 4.5m0 3l4.5 4.5M6.5 6.5l4.5 4.5m0-3L6.5 17.5" stroke-width="2" />
  </svg>`,

  // 브랜드 아이콘
  'tarot-cards': `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <g transform="rotate(-15 8 12)">
      <rect x="5" y="7" width="6" height="10" rx="1" ry="1" stroke-width="1.5" fill="none" />
      <line x1="6" y1="9" x2="10" y2="9" stroke-width="1" />
      <line x1="6" y1="11" x2="10" y2="11" stroke-width="1" />
      <circle cx="8" cy="13.5" r="1" stroke-width="1" fill="currentColor" />
    </g>
    <g>
      <rect x="9" y="5" width="6" height="10" rx="1" ry="1" stroke-width="1.5" fill="none" />
      <line x1="10" y1="7" x2="14" y2="7" stroke-width="1" />
      <line x1="10" y1="9" x2="14" y2="9" stroke-width="1" />
      <circle cx="12" cy="11.5" r="1" stroke-width="1" fill="currentColor" />
    </g>
    <g transform="rotate(15 16 12)">
      <rect x="13" y="7" width="6" height="10" rx="1" ry="1" stroke-width="1.5" fill="none" />
      <line x1="14" y1="9" x2="18" y2="9" stroke-width="1" />
      <line x1="14" y1="11" x2="18" y2="11" stroke-width="1" />
      <circle cx="16" cy="13.5" r="1" stroke-width="1" fill="currentColor" />
    </g>
    <g opacity="0.6">
      <circle cx="6" cy="5" r="0.5" fill="currentColor" />
      <circle cx="18" cy="6" r="0.5" fill="currentColor" />
      <circle cx="12" cy="19" r="0.5" fill="currentColor" />
    </g>
  </svg>`,

  moon: `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke-width="2" />
  </svg>`,

  // 액션 아이콘
  star: `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke-width="2" />
  </svg>`,

  sparkles: `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" stroke-width="2" />
    <path d="M20 3v4" stroke-width="2" />
    <path d="M22 5h-4" stroke-width="2" />
    <path d="M4 17v2" stroke-width="2" />
    <path d="M5 18H3" stroke-width="2" />
  </svg>`,

  shuffle: `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <polyline points="16,3 21,3 21,8" stroke-width="2" />
    <line x1="4" y1="20" x2="21" y2="3" stroke-width="2" />
    <polyline points="21,16 21,21 16,21" stroke-width="2" />
    <line x1="15" y1="15" x2="21" y2="21" stroke-width="2" />
    <line x1="4" y1="4" x2="9" y2="9" stroke-width="2" />
  </svg>`,

  crown: `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 18h20l-2-12-3 7-5-10-5 10-3-7-2 12z" stroke-width="2" />
  </svg>`,

  // 인터페이스 아이콘
  'chevron-left': `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <polyline points="15,18 9,12 15,6" stroke-width="2" />
  </svg>`,

  check: `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <polyline points="20,6 9,17 4,12" stroke-width="2" />
  </svg>`,

  x: `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <line x1="18" y1="6" x2="6" y2="18" stroke-width="2" />
    <line x1="6" y1="6" x2="18" y2="18" stroke-width="2" />
  </svg>`,

  // 설정 아이콘
  sun: `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="5" stroke-width="2" />
    <line x1="12" y1="1" x2="12" y2="3" stroke-width="2" />
    <line x1="12" y1="21" x2="12" y2="23" stroke-width="2" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke-width="2" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke-width="2" />
    <line x1="1" y1="12" x2="3" y2="12" stroke-width="2" />
    <line x1="21" y1="12" x2="23" y2="12" stroke-width="2" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke-width="2" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke-width="2" />
  </svg>`,

  bell: `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke-width="2" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke-width="2" />
  </svg>`,
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

/**
 * Figma UI 아이콘 컴포넌트
 * 
 * 24x24px 기본 크기의 SVG 아이콘을 렌더링합니다.
 * currentColor를 사용하여 테마 색상을 자동으로 적용합니다.
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#FFFFFF', // 기본값을 흰색으로 설정
  style,
}) => {
  const svgString = ICONS[name];
  
  // SVG에서 currentColor를 실제 색상으로 교체
  const coloredSvg = svgString.replace(/stroke="currentColor"/g, `stroke="${color}"`);
  const filledSvg = coloredSvg.replace(/fill="currentColor"/g, `fill="${color}"`);

  return (
    <SvgXml
      xml={filledSvg}
      width={size}
      height={size}
      style={style}
    />
  );
};

// 개별 아이콘 컴포넌트들 (편의성을 위해)
export const ClockIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon name="clock" {...props} />
);

export const TarotCardsIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon name="tarot-cards" {...props} />
);

export const SparklesIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon name="sparkles" {...props} />
);

export const MoonIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon name="moon" {...props} />
);

export const StarIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon name="star" {...props} />
);

export const CrownIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon name="crown" {...props} />
);

export const ShuffleIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon name="shuffle" {...props} />
);

export const SettingsIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon name="settings" {...props} />
);

export const ChevronLeftIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon name="chevron-left" {...props} />
);

export const CheckIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon name="check" {...props} />
);

export const SunIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon name="sun" {...props} />
);

export const BellIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon name="bell" {...props} />
);