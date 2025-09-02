# Tarot Timer - Figma Design Guidelines

## Brand Identity

### Brand Personality

- **Mystical but Accessible**: Engaging mysterious elements while maintaining user-friendly interface
- **Premium Feel**: High-quality, polished aesthetic that conveys value
- **Trustworthy**: Reliable and consistent design language that builds confidence
- **Calming**: Soothing visual atmosphere that promotes relaxation
- **Intuitive**: Clear navigation and interaction patterns

### Visual Principles

- **Sacred Geometry**: Incorporate subtle geometric patterns and balanced layouts
- **Depth & Layering**: Use shadows and elevation to create mystical depth
- **Smooth Transitions**: Fluid animations that feel magical yet purposeful
- **Premium Materials**: Rich textures and sophisticated color treatments

## Color System

### Primary Palette

```
Deep Purple (Primary)    : #4A1A4F
Midnight Blue (Secondary): #1A1F3A
Gold Accent (Premium)    : #D4AF37
White Base              : #FFFFFF
```

### Light Mode Tokens

```
Background Primary   : #FFFFFF
Background Secondary : #FAFAFA
Text Primary        : #1A1F3A (Midnight Blue)
Text Secondary      : #4A1A4F (Deep Purple)
Text Tertiary       : #6B6B7D
Accent Primary      : #D4AF37 (Gold)
Accent Secondary    : #4A1A4F (Deep Purple)
Divider            : #E8E1E8
Surface Elevated   : #FFFFFF
Border Default     : #E8E1E8
Border Focus       : #4A1A4F
```

### Dark Mode Tokens

```
Background Primary   : #0F0F1A
Background Secondary : #1A1F3A (Midnight Blue)
Text Primary        : #FFFFFF
Text Secondary      : #C8B8D4 (Light Purple)
Text Tertiary       : #8A8A9A
Accent Primary      : #F4D03F (Lighter Gold)
Accent Secondary    : #7A5A7F (Lighter Purple)
Divider            : #2A2F4A
Surface Elevated   : #1A1F3A
Border Default     : #2A2F4A
Border Focus       : #7A5A7F
```

### Semantic Colors

```
Success : #28A745 (Light) / #34CE57 (Dark)
Warning : #FFC107 (Light) / #FFD60A (Dark)
Error   : #DC3545 (Light) / #FF453A (Dark)
Info    : #17A2B8 (Light) / #64D2FF (Dark)
```

## Typography

### Font System

- **Primary**: SF Pro Display (iOS) / Roboto (Android)
- **Fallback**: System fonts with Korean optimization
- **Characteristics**: Clean, readable, premium feel

### Type Scale

```
Display Large   : 32pt / Semi-bold / Line height 1.2
Display Medium  : 28pt / Semi-bold / Line height 1.2
Title Large     : 24pt / Semi-bold / Line height 1.3
Title Medium    : 20pt / Medium / Line height 1.3
Title Small     : 18pt / Medium / Line height 1.4
Body Large      : 16pt / Regular / Line height 1.5
Body Medium     : 14pt / Regular / Line height 1.5
Body Small      : 12pt / Regular / Line height 1.4
Caption         : 11pt / Medium / Line height 1.3
Overline        : 10pt / Medium / Line height 1.3 / Letter spacing +0.5pt
```

### Korean Typography Guidelines

- Use system fonts optimized for Korean characters
- Maintain proper spacing between Korean and Latin characters
- Ensure readability at small sizes for Korean text
- Apply appropriate line heights for Korean text (typically 1.6-1.8)

## Spacing System

### Base Grid: 8pt

```
XXS : 2pt   (0.25x)
XS  : 4pt   (0.5x)
S   : 8pt   (1x)
M   : 16pt  (2x)
L   : 24pt  (3x)
XL  : 32pt  (4x)
XXL : 40pt  (5x)
XXXL: 48pt  (6x)
```

### Component Spacing

- **Card Padding**: 16pt (M)
- **Button Padding**: Horizontal 24pt, Vertical 12pt
- **Section Margins**: 24pt (L)
- **List Item Height**: 56pt minimum (7x)
- **Tab Bar Height**: 80pt (10x)

## Component Library

### Card Components

```
Border Radius: 8pt
Shadow: 0 2pt 8pt rgba(74, 26, 79, 0.12)
Border: 1pt solid [Border Default]
Padding: 16pt
Background: [Surface Elevated]
```

**States:**

- Default: Standard styling
- Hover: Subtle lift (shadow increase)
- Selected: Gold accent border (#D4AF37)
- Disabled: 40% opacity

### Buttons

**Primary Button**

```
Background: #4A1A4F (Deep Purple)
Text: #D4AF37 (Gold)
Border Radius: 8pt
Padding: 12pt 24pt
Typography: Body Medium / Medium
```

**Secondary Button**

```
Background: Transparent
Text: #4A1A4F
Border: 1pt solid #4A1A4F
Border Radius: 8pt
Padding: 12pt 24pt
Typography: Body Medium / Medium
```

**Premium Button**

```
Background: #D4AF37 (Gold)
Text: #4A1A4F (Deep Purple)
Border Radius: 8pt
Padding: 12pt 24pt
Typography: Body Medium / Semi-bold
```

### Premium Badge

```
Background: #D4AF37 (Gold)
Text: #4A1A4F
Border Radius: 4pt
Padding: 4pt 8pt
Typography: Caption / Medium
Text: "프리미엄"
```

### Navigation Components

**Bottom Tab Bar**

```
Height: 80pt
Background: [Surface Elevated]
Border Top: 1pt solid [Divider]
Tab Padding: 8pt
Icon Size: 24pt
Active State: Deep Purple with Gold accent
Inactive State: Text Tertiary
```

**Header Bar**

```
Height: 56pt
Background: [Background Primary]
Border Bottom: 1pt solid [Divider]
Title: Title Medium
Padding: 16pt horizontal
```

## Layout Guidelines

### Screen Structure

```
Safe Area Margins: 16pt (iOS) / 16pt (Android)
Maximum Content Width: 375pt (mobile)
Minimum Touch Target: 44pt × 44pt
Grid System: 8pt base grid
```

### Card Layouts

- **Single Card Display**: Centered, max width 280pt
- **Card Grid**: 2 columns with 16pt gap
- **Horizontal Scroll**: 8pt gap between cards
- **List Items**: Full width with 16pt horizontal padding

### Responsive Breakpoints

```
Small (iPhone SE): 320pt width
Medium (iPhone): 375pt width
Large (iPhone Plus): 414pt width
Extra Large (iPad): 768pt+ width
```

## Interaction & Animation

### Timing Functions

```
Standard: cubic-bezier(0.4, 0.0, 0.2, 1)
Decelerate: cubic-bezier(0.0, 0.0, 0.2, 1)
Accelerate: cubic-bezier(0.4, 0.0, 1, 1)
```

### Duration Scale

```
Fast: 150ms (micro-interactions)
Medium: 300ms (standard transitions)
Slow: 500ms (page transitions)
```

### Motion Principles

- **Card Flip**: 300ms with perspective transform
- **Modal Entry**: Slide up with 300ms ease-out
- **Button Press**: 150ms scale with haptic feedback
- **Loading States**: Subtle pulse animation

## Accessibility Standards

### Color Contrast

- **Text on Light**: Minimum 4.5:1 ratio
- **Text on Dark**: Minimum 4.5:1 ratio
- **Interactive Elements**: Minimum 3:1 ratio

### Touch Targets

- **Minimum Size**: 44pt × 44pt
- **Recommended**: 48pt × 48pt
- **Spacing**: Minimum 8pt between interactive elements

### Text Scaling

- Support Dynamic Type (iOS)
- Support font scaling up to 200%
- Maintain layout integrity at all sizes

## Dark Mode Guidelines

### Implementation

- Use semantic color tokens throughout
- Test all components in both modes
- Maintain proper contrast ratios
- Preserve brand identity in dark theme

### Color Adaptations

- Darker backgrounds with elevated surfaces
- Lighter text with appropriate contrast
- Adjusted gold accent for dark backgrounds
- Consistent interactive states

## File Organization

### Naming Conventions

```
Components: PascalCase (CardComponent)
Instances: kebab-case (card-component-large)
Pages: PascalCase (TimerMain)
Styles: kebab-case (text-primary)
```

### Layer Structure

```
📁 Foundations
  └── Colors
  └── Typography
  └── Spacing
📁 Components
  └── Base
  └── Composite
📁 Templates
  └── Mobile
  └── Tablet
📁 Pages
  └── Timer
  └── Spread
  └── Journal
  └── Settings
```

### Component States

- Use variants for different states
- Group related components in sets
- Maintain consistent naming across variants
- Document component usage in descriptions

## Quality Checklist

### Before Handoff

- [ ] All components use design tokens
- [ ] Both light and dark modes tested
- [ ] All interactive states defined
- [ ] Accessibility requirements met
- [ ] Responsive behavior documented
- [ ] Animation specs included
- [ ] Korean text properly displayed
- [ ] Premium features clearly marked