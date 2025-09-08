# Figma 파일 구조 설정 가이드

## 📄 페이지 구조

### 1. 🎨 01-Design Foundation
**목적**: 모든 디자인 토큰과 기초 요소 정의

**섹션 구성**:
```
├── Color System
│   ├── Light Mode Palette
│   ├── Dark Mode Palette
│   ├── Brand Colors
│   └── Semantic Colors
│
├── Typography System
│   ├── Display Styles
│   ├── Title Styles
│   ├── Body Styles
│   └── Korean Optimized
│
├── Spacing System
│   ├── Base Grid (8pt)
│   ├── Component Spacing
│   └── Layout Margins
│
├── Shadow & Effects
│   ├── Drop Shadows (Level 1-4)
│   ├── Mystical Glows
│   └── Backdrop Blur
│
└── Brand Assets
    ├── Logo Variations
    ├── Mystical Icons
    └── Sacred Geometry Patterns
```

### 2. 🧩 02-Component Library
**목적**: 재사용 가능한 모든 UI 컴포넌트

**섹션 구성**:
```
├── Atoms (기본 컴포넌트)
│   ├── Buttons
│   │   ├── Primary Button
│   │   ├── Secondary Button
│   │   ├── Premium Button
│   │   └── Icon Button
│   │
│   ├── Badges
│   │   ├── Premium Badge
│   │   ├── Status Badge
│   │   └── Time Badge
│   │
│   ├── Cards
│   │   ├── Tarot Card
│   │   ├── Card Container
│   │   └── Empty Card State
│   │
│   └── Form Elements
│       ├── Text Input
│       ├── Textarea
│       └── Switch Toggle
│
├── Molecules (조합 컴포넌트)
│   ├── List Items
│   │   ├── Basic List Item
│   │   ├── Card Preview Item
│   │   └── Journal Entry Item
│   │
│   ├── Card Groups
│   │   ├── Horizontal Card Scroll
│   │   ├── Card Grid
│   │   └── Spread Preview
│   │
│   └── Input Groups
│       ├── Search Bar
│       ├── Journal Input
│       └── Settings Row
│
├── Organisms (복잡한 컴포넌트)
│   ├── Navigation
│   │   ├── Bottom Tab Bar
│   │   ├── Header Bar
│   │   └── Back Navigation
│   │
│   ├── Spread Layouts
│   │   ├── Celtic Cross
│   │   ├── Three Card
│   │   ├── AB Choice
│   │   ├── Four Card
│   │   ├── Five Card
│   │   └── Relationship Cup
│   │
│   └── Modal Components
│       ├── Card Detail Modal
│       ├── Confirmation Dialog
│       └── Bottom Sheet
│
└── Templates (화면 템플릿)
    ├── Screen Template Base
    ├── Modal Template Base
    └── Loading State Template
```

### 3. 📱 03-Mobile Screens
**목적**: 모든 앱 화면의 완성된 디자인

**섹션 구성**:
```
├── Timer Screens (7개)
│   ├── Timer - Initial State
│   ├── Timer - Drawing Cards
│   ├── Timer - Cards Revealed
│   ├── Timer - Card Selected
│   ├── Timer - Journal Active
│   ├── Timer - Saved State
│   └── Timer - Loading State
│
├── Spreads Screens (8개)
│   ├── Spreads - Main List
│   ├── Spread Detail - Celtic Cross
│   ├── Spread Detail - Three Card
│   ├── Spread Detail - AB Choice
│   ├── Spread Detail - Four Card
│   ├── Spread Detail - Five Card
│   ├── Spread Detail - Relationship
│   └── Spread - Completed State
│
├── Journal Screens (6개)
│   ├── Journal - Main (Daily Tab)
│   ├── Journal - Main (Spreads Tab)
│   ├── Journal - Daily Detail View
│   ├── Journal - Spread Detail View
│   ├── Journal - Empty Daily
│   └── Journal - Empty Spreads
│
├── Settings Screens (4개)
│   ├── Settings - Main (Korean)
│   ├── Settings - Main (English)
│   ├── Settings - Premium Active
│   └── Settings - Dark Mode
│
└── Modal States (4개)
    ├── Card Detail Modal
    ├── Card Flip Animation
    ├── Loading Spinner
    └── Error State
```

### 4. 🔄 04-User Flows
**목적**: 사용자 여정과 인터랙션 플로우

**섹션 구성**:
```
├── Core Flows
│   ├── First Time Experience
│   ├── Daily Card Drawing Flow
│   ├── Spread Creation Flow
│   └── Journal Saving Flow
│
├── Navigation Flows
│   ├── Tab Navigation
│   ├── Modal Navigation
│   └── Back Navigation
│
└── State Transitions
    ├── Loading → Content
    ├── Empty → Filled
    └── Default → Selected
```

### 5. 📋 05-Documentation
**목적**: 디자인 가이드라인과 개발자 핸드오프

**섹션 구성**:
```
├── Design Guidelines
│   ├── Color Usage Guide
│   ├── Typography Guide
│   ├── Spacing Guidelines
│   └── Component Usage Rules
│
├── Developer Handoff
│   ├── Component Props
│   ├── CSS Variables
│   ├── Animation Specs
│   └── Responsive Breakpoints
│
└── Brand Guidelines
    ├── Logo Usage
    ├── Brand Voice
    └── Visual Identity
```

## 🎨 컬러 스타일 생성 매뉴얼

### Light Mode Colors
```
Brand/Primary/Deep-Purple → #4A1A4F
Brand/Secondary/Midnight-Blue → #1A1F3A
Brand/Accent/Premium-Gold → #D4AF37

Light/Background/Primary → #FFFFFF
Light/Background/Secondary → #FAFAFA
Light/Background/Card → #FFFFFF
Light/Text/Primary → #1A1F3A
Light/Text/Secondary → #4A1A4F
Light/Text/Tertiary → #6B6B7D
Light/Border/Default → #E8E1E8
Light/Border/Focus → #4A1A4F
```

### Dark Mode Colors
```
Dark/Background/Primary → #0F0F1A
Dark/Background/Secondary → #1A1F3A
Dark/Background/Card → #1A1F3A
Dark/Text/Primary → #FFFFFF
Dark/Text/Secondary → #C8B8D4
Dark/Text/Tertiary → #8A8A9A
Dark/Border/Default → #2A2F4A
Dark/Border/Focus → #7A5A7F
Dark/Accent/Premium-Gold → #F4D03F
```

### Semantic Colors
```
Success/Light → #28A745
Success/Dark → #34CE57
Warning/Light → #FFC107
Warning/Dark → #FFD60A
Error/Light → #DC3545
Error/Dark → #FF453A
Info/Light → #17A2B8
Info/Dark → #64D2FF
```

## ✍️ 텍스트 스타일 생성 매뉴얼

### Display Styles
```
Display/Large/Regular → 32pt, Regular, Line 38pt
Display/Large/Semibold → 32pt, Semibold, Line 38pt
Display/Medium/Regular → 28pt, Regular, Line 34pt
Display/Medium/Semibold → 28pt, Semibold, Line 34pt
```

### Title Styles
```
Title/Large/Regular → 24pt, Regular, Line 29pt
Title/Large/Medium → 24pt, Medium, Line 29pt
Title/Large/Semibold → 24pt, Semibold, Line 29pt
Title/Medium/Regular → 20pt, Regular, Line 24pt
Title/Medium/Medium → 20pt, Medium, Line 24pt
Title/Medium/Semibold → 20pt, Semibold, Line 24pt
Title/Small/Regular → 18pt, Regular, Line 22pt
Title/Small/Medium → 18pt, Medium, Line 22pt
Title/Small/Semibold → 18pt, Semibold, Line 22pt
```

### Body Styles
```
Body/Large/Regular → 16pt, Regular, Line 24pt
Body/Large/Medium → 16pt, Medium, Line 24pt
Body/Medium/Regular → 14pt, Regular, Line 20pt
Body/Medium/Medium → 14pt, Medium, Line 20pt
Body/Medium/Semibold → 14pt, Semibold, Line 20pt
Body/Small/Regular → 12pt, Regular, Line 16pt
Body/Small/Medium → 12pt, Medium, Line 16pt
```

### Specialty Styles
```
Caption/Regular → 11pt, Regular, Line 13pt
Caption/Medium → 11pt, Medium, Line 13pt
Caption/Semibold → 11pt, Semibold, Line 13pt
Overline/Regular → 10pt, Regular, Line 12pt, +0.5pt letter spacing
Overline/Medium → 10pt, Medium, Line 12pt, +0.5pt letter spacing
```

## 🌗 이펙트 스타일 생성 매뉴얼

### Drop Shadows
```
Shadow/Level-1/Card → X:0 Y:2 Blur:8 Spread:0 Color:#4A1A4F/12%
Shadow/Level-2/Button → X:0 Y:4 Blur:16 Spread:0 Color:#4A1A4F/16%
Shadow/Level-3/Modal → X:0 Y:8 Blur:32 Spread:0 Color:#4A1A4F/20%
Shadow/Level-4/Dropdown → X:0 Y:16 Blur:48 Spread:0 Color:#4A1A4F/24%
```

### Mystical Glows
```
Glow/Premium-Gold/Small → X:0 Y:0 Blur:12 Spread:0 Color:#D4AF37/30%
Glow/Premium-Gold/Medium → X:0 Y:0 Blur:24 Spread:0 Color:#D4AF37/40%
Glow/Premium-Gold/Large → X:0 Y:0 Blur:36 Spread:0 Color:#D4AF37/50%
```

### Backdrop Blur
```
Blur/Backdrop/Small → 4px blur
Blur/Backdrop/Medium → 8px blur
Blur/Backdrop/Large → 12px blur
Blur/Backdrop/XL → 16px blur
```

## 📐 컴포넌트 생성 가이드

### Button Component Properties
```
Variant: Primary | Secondary | Premium | Icon
Size: Small | Medium | Large
State: Default | Hover | Active | Disabled | Loading
Icon: Boolean (true/false)
Full Width: Boolean (true/false)
Text: String (placeholder: "Button")
```

### Card Component Properties
```
Type: Default | Tarot-Card | Container
State: Empty | Face-Down | Revealed | Selected
Size: Thumbnail | Small | Medium | Large | Display
Interactive: Boolean (true/false)
Shadow Level: 1 | 2 | 3 | 4
Border Style: Solid | Dashed | None
```

### Badge Component Properties
```
Type: Default | Premium | Success | Warning | Error
Size: Small | Medium
Has Icon: Boolean (true/false)
Text: String (placeholder: "Badge")
```

### Navigation Component Properties
```
Active Tab: Timer | Spreads | Journal | Settings
Theme: Light | Dark
Show Glow: Boolean (true/false)
```

## 📱 화면 템플릿 구조

### Mobile Screen Template (390x844)
```
📱 iPhone 12 Pro Frame
├── Status Bar (44pt height)
├── Safe Area Top
├── Content Container
│   ├── Header Section (optional, 120pt)
│   ├── Main Content Area (flexible)
│   ├── Action Section (optional, 140pt)
│   └── Bottom Padding (20pt)
├── Bottom Navigation (80pt + 34pt safe area)
└── Safe Area Bottom
```

### Content Container Specs
```
Max Width: 375pt (centered)
Side Margins: 16pt
Content Width: 343pt
Section Spacing: 24pt
Card Spacing: 16pt
```

## 🎯 컴포넌트 우선순위

### 1순위 (즉시 생성)
- [ ] Button (4 variants × 4 states)
- [ ] Badge (4 types × 2 sizes)  
- [ ] Card (3 types × 4 states × 5 sizes)
- [ ] Text Input & Textarea
- [ ] Switch Toggle

### 2순위 (기본 완료 후)
- [ ] Bottom Navigation
- [ ] Header Bar
- [ ] List Items
- [ ] Modal Components

### 3순위 (고급 컴포넌트)
- [ ] Spread Layouts (6 types)
- [ ] Loading States
- [ ] Empty States
- [ ] Animation Components

## 📋 실행 체크리스트

### Foundation Setup ✅
- [ ] Figma 파일 생성 완료
- [ ] 5개 페이지 구조 생성
- [ ] 색상 스타일 50+ 개 생성
- [ ] 텍스트 스타일 30+ 개 생성
- [ ] 이펙트 스타일 15+ 개 생성

### Component Library ✅
- [ ] 1순위 컴포넌트 5개 완성
- [ ] Properties 및 Variants 설정
- [ ] 2순위 컴포넌트 4개 완성
- [ ] 3순위 고급 컴포넌트 시작

### Screen Design ✅
- [ ] Timer 화면 7개 완성
- [ ] Spreads 화면 8개 완성
- [ ] Journal 화면 6개 완성
- [ ] Settings 화면 4개 완성
- [ ] Modal 화면 4개 완성

### User Flow & Documentation ✅
- [ ] 주요 사용자 플로우 4개 완성
- [ ] 프로토타이핑 연결 완료
- [ ] 개발자 핸드오프 준비
- [ ] 디자인 가이드라인 문서화

이 가이드를 따라 단계별로 진행하면 완전한 Figma 디자인 시스템을 구축할 수 있습니다!