/**
 * 타로 타이머 앱 이미지 에셋 인덱스
 * 
 * 이 폴더에는 앱에서 사용하는 모든 이미지 에셋들이 포함되어 있습니다.
 * SVG 형식으로 제작되어 모든 해상도에서 선명하게 표시됩니다.
 */

// 타로 카드 관련 에셋
export { default as TarotCardBack } from './tarot-card-back.svg';
export { default as CardPlaceholder } from './card-placeholder.svg';

// 브랜딩 에셋
export { default as AppLogoMain } from './app-logo-main.svg';
export { default as AppLogoIcon } from './app-logo-icon.svg';

// 배경 및 텍스처 에셋
export { default as SacredGeometryPattern } from './sacred-geometry-pattern.svg';
export { default as MysticalTextureLight } from './mystical-texture-light.svg';
export { default as MysticalTextureDark } from './mystical-texture-dark.svg';

// 효과 에셋
export { default as SparkleEffect } from './sparkle-effect.svg';

/**
 * 이미지 에셋 사용 가이드라인:
 * 
 * 1. **타로 카드 백면**: 카드 뒷면 표시 또는 로딩 상태
 * 2. **플레이스홀더**: 이미지 로딩 실패 시 기본 표시
 * 3. **로고**: 앱 브랜딩 및 아이덴티티
 * 4. **Sacred Geometry**: 배경 패턴 또는 장식 요소
 * 5. **텍스처**: 라이트/다크 모드별 배경 텍스처
 * 6. **이펙트**: 애니메이션 및 상호작용 효과
 * 
 * 사용 예시:
 * ```tsx
 * import { TarotCardBack, AppLogoMain } from '../assets/images';
 * 
 * // 직접 사용
 * <img src={TarotCardBack} alt="Tarot Card Back" />
 * 
 * // CSS 배경으로 사용
 * <div style={{ backgroundImage: `url(${SacredGeometryPattern})` }} />
 * 
 * // SVG 컴포넌트로 사용 (권장)
 * <TarotCardBack className="w-32 h-48" />
 * ```
 */

export const IMAGE_CATEGORIES = {
  cards: ['tarot-card-back', 'card-placeholder'],
  branding: ['app-logo-main', 'app-logo-icon'],
  backgrounds: ['sacred-geometry-pattern', 'mystical-texture-light', 'mystical-texture-dark'],
  effects: ['sparkle-effect']
} as const;

export const IMAGE_NAMES = [
  'tarot-card-back',
  'card-placeholder', 
  'app-logo-main',
  'app-logo-icon',
  'sacred-geometry-pattern',
  'mystical-texture-light',
  'mystical-texture-dark',
  'sparkle-effect'
] as const;

export type ImageName = typeof IMAGE_NAMES[number];
export type ImageCategory = keyof typeof IMAGE_CATEGORIES;

/**
 * 이미지 에셋 상세 정보
 */
export const IMAGE_ASSETS = {
  'tarot-card-back': {
    name: '타로 카드 백면',
    description: '신비로운 Sacred Geometry 패턴이 적용된 타로 카드 뒷면 디자인',
    dimensions: '300×450px',
    usage: ['카드 뒷면 표시', '미공개 카드', '카드 섞기 애니메이션'],
    darkMode: true,
    animated: false
  },
  
  'card-placeholder': {
    name: '카드 플레이스홀더',
    description: '이미지 로딩 중이거나 오류 시 표시되는 기본 카드',
    dimensions: '300×450px',
    usage: ['로딩 상태', '이미지 오류', '빈 카드 슬롯'],
    darkMode: true,
    animated: true
  },
  
  'app-logo-main': {
    name: '메인 로고',
    description: '3장의 타로 카드와 신비로운 효과가 포함된 메인 브랜드 로고',
    dimensions: '120×120px',
    usage: ['헤더 로고', '스플래시 화면', '브랜딩'],
    darkMode: true,
    animated: false
  },
  
  'app-logo-icon': {
    name: '아이콘 로고',
    description: '단순화된 앱 아이콘 버전 로고',
    dimensions: '64×64px',
    usage: ['앱 아이콘', '파비콘', '작은 브랜딩 요소'],
    darkMode: true,
    animated: false
  },
  
  'sacred-geometry-pattern': {
    name: 'Sacred Geometry 패턴',
    description: 'Flower of Life와 Metatron\'s Cube 요소가 포함된 배경 패턴',
    dimensions: '400×400px (타일 가능)',
    usage: ['배경 패턴', '장식 요소', '섹션 구분'],
    darkMode: false,
    animated: false
  },
  
  'mystical-texture-light': {
    name: '라이트 모드 텍스처',
    description: '라이트 모드용 미묘한 신비로운 텍스처 패턴',
    dimensions: '200×200px (타일 가능)',
    usage: ['라이트 모드 배경', '카드 텍스처', '섹션 배경'],
    darkMode: false,
    animated: false
  },
  
  'mystical-texture-dark': {
    name: '다크 모드 텍스처',
    description: '다크 모드용 글로우 효과가 포함된 신비로운 텍스처',
    dimensions: '200×200px (타일 가능)',
    usage: ['다크 모드 배경', '카드 텍스처', '글로우 효과'],
    darkMode: true,
    animated: false
  },
  
  'sparkle-effect': {
    name: '반짝임 효과',
    description: '애니메이션 반짝임과 파티클 효과',
    dimensions: '100×100px',
    usage: ['버튼 호버 효과', '카드 선택 효과', '마법적 애니메이션'],
    darkMode: true,
    animated: true
  }
} as const;