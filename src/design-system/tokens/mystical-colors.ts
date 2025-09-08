/**
 * 🔮 Mystical Color Palette - Sacred Design Tokens
 * Complete color system for the mystical tarot experience
 */

export const MysticalColors = {
  // 🌌 Primary Cosmic Colors
  cosmic: {
    deepSpace: '#0a051a',        // 가장 깊은 우주색
    voidPurple: '#1a0933',       // 깊은 공간 보라색
    mysticalDepth: '#2a1f3d',    // 신비로운 깊이
    etherealMid: '#4a148c',      // 초월적 중간색
    celestialBright: '#6a1b99',  // 천상의 밝은색
    luminousPurple: '#8e24aa',   // 빛나는 보라색
    transcendent: '#3f006a',     // 초월적 보라색
    amethyst: '#9c27b0',         // 자수정색
  },

  // ✨ Sacred Gold Accents
  sacred: {
    aurum: '#FF6B35',            // 신성한 오렌지 글로우
    premiumGold: '#D4AF37',      // 프리미엄 금색
    shimmerGold: '#F4D03F',      // 반짝이는 금색
    lightGold: '#E6C547',        // 밝은 금색
    cosmicGold: '#FFD700',       // 우주적 금색
    starlight: '#FFF8DC',        // 별빛색
  },

  // 🌟 Glow Effects
  glow: {
    orange: '#FF6B35',           // 오렌지 글로우
    gold: '#D4AF37',             // 금색 글로우
    purple: '#8e24aa',           // 보라색 글로우
    white: '#FFFFFF',            // 백색 글로우
    cosmic: '#6366F1',           // 우주적 글로우
  },

  // 🎭 Text Colors
  text: {
    primary: '#FFFFFF',          // 기본 텍스트
    secondary: '#E0E0E0',        // 보조 텍스트
    muted: '#B0B0B0',            // 음소거된 텍스트
    accent: '#FF6B35',           // 강조 텍스트
    gold: '#D4AF37',             // 금색 텍스트
    mystical: '#9c27b0',         // 신비로운 텍스트
  },

  // 🌈 Gradient Definitions
  gradients: {
    cosmicBackground: [
      '#0a051a',   // 가장 깊은 시작
      '#1a0933',   // 깊은 공간
      '#2a1f3d',   // 신비로운 깊이
      '#4a148c',   // 초월적 중간
      '#6a1b99',   // 천상의 밝음
      '#8e24aa',   // 빛나는 보라
      '#3f006a',   // 초월적 끝
    ],
    mysticalPurple: [
      '#1a0933',
      '#4a148c', 
      '#6a1b99',
      '#8e24aa',
      '#3f006a'
    ],
    sacredGold: [
      '#D4AF37',
      '#F4D03F', 
      '#E6C547',
      '#FFD700'
    ],
    auramGlow: [
      '#FF6B35',
      '#FFD700',
      '#F4D03F'
    ]
  },

  // 🎨 Component Specific Colors
  components: {
    card: {
      background: 'rgba(26, 9, 51, 0.95)',
      border: 'rgba(212, 175, 55, 0.3)',
      shadow: 'rgba(212, 175, 55, 0.2)',
    },
    button: {
      primary: '#D4AF37',
      primaryHover: '#F4D03F',
      secondary: 'rgba(212, 175, 55, 0.2)',
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'rgba(255, 255, 255, 0.2)',
      backdrop: 'rgba(26, 9, 51, 0.8)',
    }
  },

  // 🌌 Opacity Variations
  opacity: {
    10: '1A',
    20: '33', 
    30: '4D',
    40: '66',
    50: '80',
    60: '99',
    70: 'B3',
    80: 'CC',
    90: 'E6',
    95: 'F2'
  }
};

// Helper functions for color manipulation
export const getMysticalColor = (colorPath: string) => {
  const paths = colorPath.split('.');
  let result: any = MysticalColors;
  
  for (const path of paths) {
    result = result[path];
  }
  
  return result;
};

export const addOpacity = (color: string, opacity: keyof typeof MysticalColors.opacity) => {
  return color + MysticalColors.opacity[opacity];
};

export default MysticalColors;