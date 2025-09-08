/**
 * 📏 Sacred Geometry Spacing System
 * Mystical spacing based on golden ratio and sacred numbers
 */

export const MysticalSpacing = {
  // Base spacing unit (8px system with mystical touches)
  base: 8,

  // Sacred number based spacing
  spacing: {
    0: 0,
    1: 4,      // 1/2 base
    2: 8,      // base
    3: 12,     // 1.5x base
    4: 16,     // 2x base
    5: 20,     // 2.5x base
    6: 24,     // 3x base - sacred number
    7: 28,     // 3.5x base - mystical number
    8: 32,     // 4x base
    9: 36,     // 4.5x base - sacred number
    10: 40,    // 5x base
    11: 44,    // 5.5x base
    12: 48,    // 6x base - sacred number
    14: 56,    // 7x base - mystical number
    16: 64,    // 8x base
    18: 72,    // 9x base - sacred number
    20: 80,    // 10x base
    24: 96,    // 12x base - sacred number
    28: 112,   // 14x base
    32: 128,   // 16x base
    36: 144,   // 18x base - sacred number
    40: 160,   // 20x base
    44: 176,   // 22x base
    48: 192,   // 24x base
    52: 208,   // 26x base
    56: 224,   // 28x base
    60: 240,   // 30x base
    64: 256,   // 32x base
    72: 288,   // 36x base
    80: 320,   // 40x base
    96: 384,   // 48x base
  },

  // Semantic spacing names
  xs: 4,     // Extra small
  sm: 8,     // Small
  md: 16,    // Medium
  lg: 24,    // Large
  xl: 32,    // Extra large
  '2xl': 40, // 2x Extra large
  '3xl': 48, // 3x Extra large
  '4xl': 64, // 4x Extra large
  '5xl': 80, // 5x Extra large
  '6xl': 96, // 6x Extra large

  // Component specific spacing
  components: {
    // Card spacing
    card: {
      padding: 20,           // Internal padding
      margin: 16,            // External margin
      gap: 12,               // Gap between elements
      borderRadius: 16,      // Corner radius
    },

    // Button spacing
    button: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      margin: 8,
      borderRadius: 12,
    },

    // Icon spacing
    icon: {
      small: 16,
      medium: 24,
      large: 32,
      extraLarge: 48,
      massive: 64,
    },

    // Layout spacing
    layout: {
      screenPadding: 16,     // Screen edge padding
      sectionGap: 24,        // Gap between sections
      componentGap: 16,      // Gap between components
      itemGap: 8,            // Gap between small items
    },

    // Tab bar spacing
    tabBar: {
      height: 80,
      padding: 16,
      buttonPadding: 8,
      iconSize: 24,
      gap: 6,
    },

    // Header spacing
    header: {
      paddingTop: 60,
      paddingBottom: 40,
      paddingHorizontal: 24,
      titleMarginBottom: 16,
      subtitleMarginBottom: 24,
    },

    // Card grid spacing
    cardGrid: {
      padding: 16,
      gap: 12,
      itemMargin: 6,
    }
  },

  // Border radius system
  borderRadius: {
    none: 0,
    xs: 4,
    sm: 8,
    base: 12,
    md: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 48,
    full: 9999,
  },

  // Shadow spacing
  shadow: {
    offset: {
      small: { width: 0, height: 2 },
      medium: { width: 0, height: 4 },
      large: { width: 0, height: 8 },
      extraLarge: { width: 0, height: 16 },
    },
    blur: {
      small: 4,
      medium: 8,
      large: 16,
      extraLarge: 24,
    }
  },

  // Animation timing (based on golden ratio - 1.618)
  timing: {
    fast: 161,        // ~161ms
    medium: 261,      // ~261ms  
    slow: 422,        // ~422ms
    extraSlow: 683,   // ~683ms
  }
};

export default MysticalSpacing;