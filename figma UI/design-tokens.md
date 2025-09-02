# 🎨 Tarot Timer - Design Tokens Reference

> **Single Source of Truth for all design decisions**
> 
> This document outlines the complete design token system that serves as the foundation for all UI components and styling across the Tarot Timer application.

---

## 📋 Table of Contents

1. [🌟 Brand Colors](#-brand-colors)
2. [🌅🌚 Light & Dark Mode](#-light--dark-mode)
3. [⚡ Interactive States](#-interactive-states)
4. [📏 Spacing System](#-spacing-system)
5. [📝 Typography Scale](#-typography-scale)
6. [✨ Effects & Shadows](#-effects--shadows)
7. [🛠️ Usage Examples](#️-usage-examples)
8. [✅ Token Testing](#-token-testing)

---

## 🌟 Brand Colors

### Core Brand Identity

```css
--brand-primary: #4A1A4F;        /* Deep Purple - Primary brand color */
--brand-secondary: #1A1F3A;      /* Midnight Blue - Secondary brand color */
--brand-accent: #D4AF37;         /* Gold - Premium accent color */
--brand-white: #FFFFFF;          /* Pure White - Base color */
```

### Usage

```css
/* Direct usage */
color: var(--brand-primary);
background: var(--brand-accent);

/* Tailwind utility classes */
.text-brand-primary { color: var(--brand-primary); }
.bg-brand-accent { background: var(--brand-accent); }
```

---

## 🌅🌚 Light & Dark Mode

### Light Mode Tokens

```css
/* Backgrounds */
--light-bg-primary: #FFFFFF;       /* Main background */
--light-bg-secondary: #FAFAFA;     /* Secondary surfaces */
--light-bg-elevated: #FFFFFF;      /* Elevated elements (cards, modals) */

/* Text Colors */
--light-text-primary: #1A1F3A;     /* Main text (Midnight Blue) */
--light-text-secondary: #4A1A4F;   /* Secondary text (Deep Purple) */
--light-text-tertiary: #6B6B7D;    /* Tertiary text (Gray) */

/* Borders & Dividers */
--light-border-default: #E8E1E8;   /* Default borders */
--light-border-focus: #4A1A4F;     /* Focus states */
--light-divider: #E8E1E8;          /* Section dividers */
```

### Dark Mode Tokens

```css
/* Backgrounds */
--dark-bg-primary: #0F0F1A;        /* Main background (Very dark) */
--dark-bg-secondary: #1A1F3A;      /* Secondary surfaces (Midnight Blue) */
--dark-bg-elevated: #1A1F3A;       /* Elevated elements */

/* Text Colors */
--dark-text-primary: #FFFFFF;      /* Main text (White) */
--dark-text-secondary: #C8B8D4;    /* Secondary text (Light Purple) */
--dark-text-tertiary: #8A8A9A;     /* Tertiary text (Light Gray) */

/* Borders & Dividers */
--dark-border-default: #2A2F4A;    /* Default borders */
--dark-border-focus: #7A5A7F;      /* Focus states */
--dark-divider: #2A2F4A;           /* Section dividers */
```

### Semantic Color Mapping

The system automatically switches between light and dark values:

```css
/* These automatically adapt based on theme */
--color-text-primary: var(--light-text-primary) | var(--dark-text-primary)
--color-surface-base: var(--light-bg-primary) | var(--dark-bg-primary)
--color-surface-elevated: var(--light-bg-elevated) | var(--dark-bg-elevated)
```

---

## ⚡ Interactive States

### State Colors

```css
/* Success States */
--state-success: #28A745;          /* Light mode success */
--state-success-dark: #34CE57;     /* Dark mode success */

/* Warning States */
--state-warning: #FFC107;          /* Light mode warning */
--state-warning-dark: #FFD60A;     /* Dark mode warning */

/* Error States */
--state-error: #DC3545;            /* Light mode error */
--state-error-dark: #FF453A;       /* Dark mode error */

/* Info States */
--state-info: #17A2B8;             /* Light mode info */
--state-info-dark: #64D2FF;        /* Dark mode info */
```

---

## 📏 Spacing System

### 8pt Grid Base

```css
--space-xxs: 2px;      /* 0.25x - Micro spacing */
--space-xs: 4px;       /* 0.5x  - Extra small */
--space-s: 8px;        /* 1x    - Small (base unit) */
--space-m: 16px;       /* 2x    - Medium */
--space-l: 24px;       /* 3x    - Large */
--space-xl: 32px;      /* 4x    - Extra large */
--space-xxl: 40px;     /* 5x    - Double extra large */
--space-xxxl: 48px;    /* 6x    - Triple extra large */
```

### Component-Specific Spacing

```css
--spacing-card-padding: var(--space-m);          /* 16px - Standard card padding */
--spacing-button-horizontal: var(--space-l);     /* 24px - Button horizontal padding */
--spacing-button-vertical: var(--space-s);       /* 8px  - Button vertical padding */
--spacing-section-margin: var(--space-l);        /* 24px - Section margins */
--spacing-list-item: 56px;                       /* 7x   - List item minimum height */
--spacing-safe-margin: var(--space-m);           /* 16px - Safe area margins */
```

### Usage Examples

```css
/* Direct usage */
padding: var(--space-m);
margin-bottom: var(--spacing-section-margin);

/* Tailwind utility classes */
.p-token-m { padding: var(--space-m); }
.m-token-l { margin: var(--space-l); }
```

---

## 📝 Typography Scale

### Font Sizes

```css
--text-display-large: 32px;        /* Large displays, hero text */
--text-display-medium: 28px;       /* Medium displays */
--text-title-large: 24px;          /* Large titles, page headers */
--text-title-medium: 20px;         /* Medium titles, section headers */
--text-title-small: 18px;          /* Small titles, card headers */
--text-body-large: 16px;           /* Large body text */
--text-body-medium: 14px;          /* Standard body text */
--text-body-small: 12px;           /* Small body text */
--text-caption: 11px;              /* Captions, metadata */
--text-overline: 10px;             /* Overlines, labels */
```

### Font Weights

```css
--font-weight-regular: 400;        /* Regular text */
--font-weight-medium: 500;         /* Medium emphasis */
--font-weight-semibold: 600;       /* Strong emphasis */
--font-weight-bold: 700;           /* Bold text */
```

### Line Heights

```css
--line-height-tight: 1.2;          /* Tight spacing for displays */
--line-height-normal: 1.3;         /* Normal spacing for titles */
--line-height-relaxed: 1.4;        /* Relaxed spacing */
--line-height-loose: 1.5;          /* Loose spacing for body text */
--line-height-extra-loose: 1.6;    /* Extra loose for readability */
```

### Typography Classes

```css
/* Pre-defined type styles */
.display-large {
  font-size: var(--text-display-large);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
}

.title-medium {
  font-size: var(--text-title-medium);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
}

.body-medium {
  font-size: var(--text-body-medium);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-loose);
  color: var(--foreground);
}
```

---

## ✨ Effects & Shadows

### Shadow System

```css
--shadow-card: 0 2px 8px rgba(74, 26, 79, 0.12);      /* Standard card shadow */
--shadow-elevated: 0 4px 16px rgba(74, 26, 79, 0.16); /* Elevated elements */
--shadow-modal: 0 8px 32px rgba(74, 26, 79, 0.24);    /* Modal dialogs */
--shadow-none: none;                                    /* No shadow */
```

### Border Radius

```css
--radius-small: 4px;        /* Small radius - badges, small buttons */
--radius-medium: 8px;       /* Medium radius - cards, standard buttons */
--radius-large: 16px;       /* Large radius - prominent cards */
--radius-full: 9999px;      /* Full radius - pills, circular elements */
```

### Usage

```css
/* Direct usage */
box-shadow: var(--shadow-card);
border-radius: var(--radius-medium);

/* Utility classes */
.shadow-card { box-shadow: var(--shadow-card); }
.rounded-token-medium { border-radius: var(--radius-medium); }
```

---

## 🛠️ Usage Examples

### 1. Creating a Premium Card Component

```css
.premium-card {
  /* Use semantic tokens */
  background: var(--color-surface-elevated);
  color: var(--color-text-primary);
  border: 2px solid var(--brand-accent);
  
  /* Use spacing tokens */
  padding: var(--spacing-card-padding);
  margin-bottom: var(--spacing-section-margin);
  
  /* Use effect tokens */
  border-radius: var(--radius-medium);
  box-shadow: var(--shadow-elevated);
}
```

### 2. Typography with Tokens

```css
.card-title {
  font-size: var(--text-title-medium);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
  margin-bottom: var(--space-m);
}
```

### 3. Responsive Button System

```css
.button-primary {
  /* Colors */
  background: var(--brand-primary);
  color: var(--brand-white);
  border: 1px solid var(--brand-primary);
  
  /* Typography */
  font-size: var(--text-body-medium);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-relaxed);
  
  /* Spacing */
  padding: var(--spacing-button-vertical) var(--spacing-button-horizontal);
  
  /* Effects */
  border-radius: var(--radius-medium);
  box-shadow: var(--shadow-card);
}

.button-secondary {
  background: transparent;
  color: var(--brand-primary);
  border: 1px solid var(--brand-primary);
  /* ... rest inherits from primary */
}

.button-premium {
  background: var(--brand-accent);
  color: var(--brand-primary);
  border: 1px solid var(--brand-accent);
  font-weight: var(--font-weight-semibold);
  /* ... rest inherits from primary */
}
```

---

## ✅ Token Testing

### Validation Checklist

- [ ] **Brand Colors**: All brand colors are defined as variables
- [ ] **Light/Dark Collections**: Complete collections for both modes  
- [ ] **Semantic Aliases**: Properly reference base tokens
- [ ] **Typography Styles**: Linked to color tokens
- [ ] **Spacing System**: Follows 8pt grid consistently
- [ ] **Shadow Effects**: Use brand colors in rgba values
- [ ] **Mode Switching**: Light ↔ Dark switching works correctly
- [ ] **No Hardcoded Values**: No hardcoded colors/sizes in components
- [ ] **Descriptive Names**: All tokens have clear, descriptive names
- [ ] **Logical Organization**: Token organization is intuitive

### Testing Process

1. **Color Token Test**: Create test elements and apply each color token
2. **Typography Test**: Apply each text style to sample content
3. **Spacing Test**: Use spacing tokens in various layout contexts
4. **Effect Test**: Apply shadows and border radius to elements
5. **Theme Switch Test**: Toggle between light and dark modes
6. **Component Test**: Build test components using only tokens

### Example Test Component

```css
.test-card {
  /* Should use only design tokens */
  background: var(--color-surface-elevated);
  color: var(--color-text-primary);
  border: 1px solid var(--color-divider);
  padding: var(--spacing-card-padding);
  border-radius: var(--radius-medium);
  box-shadow: var(--shadow-card);
  margin-bottom: var(--spacing-section-margin);
}

.test-card h3 {
  font-size: var(--text-title-small);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--space-s);
}

.test-card p {
  font-size: var(--text-body-medium);
  line-height: var(--line-height-loose);
  color: var(--color-text-secondary);
}
```

---

## 🚀 Next Steps

After completing the design token system:

1. **✅ Foundation Complete**: All tokens are defined and tested
2. **➡️ Step 2**: Build base components (Button, Card, Icon, Text) using these tokens
3. **➡️ Step 3**: Create composite components from base components
4. **➡️ Step 4**: Build template screens using the component library

---

## 💡 Key Benefits

- **Consistency**: Single source of truth eliminates design inconsistencies
- **Maintainability**: Update tokens in one place, changes reflect everywhere  
- **Theme Support**: Automatic light/dark mode switching
- **Scalability**: Easy to add new themes or variants
- **Developer Experience**: Clear, semantic naming makes development faster
- **Design-Dev Sync**: Perfect alignment between Figma and code

---

*This token system serves as the foundation for the entire Tarot Timer design system. All future components and screens should be built using these tokens exclusively.*