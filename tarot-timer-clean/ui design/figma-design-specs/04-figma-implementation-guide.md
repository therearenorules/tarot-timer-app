# Figma 구현 가이드 - 타로 타이머 앱

## 🎯 단계별 구현 로드맵

### Phase 1: Foundation Setup (기초 설정)
```
1. 새 Figma 파일 생성: "Tarot Timer App Design System"
2. 페이지 구조 생성:
   📁 🎨 Design Tokens
   📁 🧩 Components
   📁 📱 Mobile Screens
   📁 📋 Documentation

3. 디바이스 프레임 설정:
   - iPhone 12 Pro (390x844)
   - 안전 영역 가이드
   - 그리드 시스템 (8pt base)
```

### Phase 2: Design Tokens (디자인 토큰)
```
1. Color Styles 생성:
   - 모든 브랜드 컬러
   - 라이트/다크 모드 변형
   - 의미적 색상 (Success, Warning, Error)

2. Text Styles 생성:
   - 모든 타이포그래피 스타일
   - 한국어 최적화 버전
   - 라인 하이트 및 레터 스페이싱

3. Effect Styles 생성:
   - 그림자 시스템 (Level 1-4)
   - 글로우 효과
   - 블러 효과
```

### Phase 3: Base Components (기본 컴포넌트)
```
1. Atomic Components:
   - Buttons (Primary, Secondary, Premium, Icon)
   - Badges (Premium, Status, Time)
   - Cards (Tarot Card, Card Container)
   - Form Elements (Input, Textarea, Switch)

2. Component Properties:
   - Size variants
   - State variants
   - Content variants
   - Boolean properties
```

### Phase 4: Composite Components (복합 컴포넌트)
```
1. Layout Components:
   - Navigation (Bottom Tab, Header)
   - Lists (List Item, Card List Item)
   - Modals (Dialog, Bottom Sheet)

2. Specialized Components:
   - Spread Layouts (Celtic Cross, Three Card, etc.)
   - Card Grids
   - Loading States
   - Empty States
```

### Phase 5: Screen Templates (화면 템플릿)
```
1. Main Screens:
   - Timer Screen
   - Spreads Screen
   - Journal Screen
   - Settings Screen

2. Detail Screens:
   - Spread Detail
   - Daily Tarot Viewer
   - Card Modal

3. States:
   - Loading states
   - Empty states
   - Error states
```

## 🎨 컬러 스타일 생성

### Figma Color Styles 이름 규칙
```
Brand/Primary/Deep Purple
Brand/Secondary/Midnight Blue
Brand/Accent/Premium Gold

Semantic/Success/Light
Semantic/Success/Dark
Semantic/Warning/Light
Semantic/Warning/Dark
Semantic/Error/Light
Semantic/Error/Dark

Text/Primary/Light
Text/Primary/Dark
Text/Secondary/Light
Text/Secondary/Dark

Background/Primary/Light
Background/Primary/Dark
Background/Secondary/Light
Background/Secondary/Dark

Border/Default/Light
Border/Default/Dark
Border/Focus/Light
Border/Focus/Dark
```

### 컬러 값 입력
```
Deep Purple: #4A1A4F
Midnight Blue: #1A1F3A
Premium Gold (Light): #D4AF37
Premium Gold (Dark): #F4D03F

White: #FFFFFF
Black: #000000
Gray 100: #F8F6F9
Gray 200: #E8E1E8
Gray 300: #C8B8D4
Gray 400: #8A8A9A
Gray 500: #6B6B7B
Gray 600: #4A4A5A
Gray 700: #2A2F4A
Gray 800: #1A1F3A
Gray 900: #0F0F1A
```

## ✍️ 텍스트 스타일 생성

### Figma Text Styles 이름 규칙
```
Display/Large/Regular
Display/Large/Semibold
Display/Medium/Regular
Display/Medium/Semibold

Title/Large/Regular
Title/Large/Semibold
Title/Medium/Regular
Title/Medium/Semibold
Title/Small/Regular
Title/Small/Semibold

Body/Large/Regular
Body/Large/Medium
Body/Medium/Regular
Body/Medium/Medium
Body/Medium/Semibold
Body/Small/Regular
Body/Small/Medium

Caption/Regular
Caption/Medium
Caption/Semibold

Overline/Regular
Overline/Medium
```

### 폰트 설정 값
```
Font Family: SF Pro Display (또는 Inter)
Korean Font: Apple SD Gothic Neo (또는 Noto Sans KR)

Display Large: 32px / Line 38px / Regular
Display Medium: 28px / Line 34px / Regular

Title Large: 24px / Line 29px / Regular
Title Medium: 20px / Line 24px / Regular
Title Small: 18px / Line 22px / Regular

Body Large: 16px / Line 24px / Regular
Body Medium: 14px / Line 20px / Regular
Body Small: 12px / Line 16px / Regular

Caption: 11px / Line 13px / Regular
Overline: 10px / Line 12px / 0.5px letter spacing
```

## 🌗 이펙트 스타일 생성

### Figma Effect Styles 이름
```
Shadow/Level 1/Card
Shadow/Level 2/Button
Shadow/Level 3/Modal
Shadow/Level 4/Dropdown

Glow/Premium Gold/Small
Glow/Premium Gold/Medium
Glow/Premium Gold/Large

Blur/Backdrop/Small
Blur/Backdrop/Medium
Blur/Backdrop/Large
```

### 이펙트 값 설정
```
Shadow Level 1:
- Type: Drop Shadow
- X: 0, Y: 2, Blur: 8, Spread: 0
- Color: #4A1A4F with 12% opacity

Shadow Level 2:
- Type: Drop Shadow
- X: 0, Y: 4, Blur: 16, Spread: 0
- Color: #4A1A4F with 16% opacity

Shadow Level 3:
- Type: Drop Shadow
- X: 0, Y: 8, Blur: 32, Spread: 0
- Color: #4A1A4F with 20% opacity

Shadow Level 4:
- Type: Drop Shadow
- X: 0, Y: 16, Blur: 48, Spread: 0
- Color: #4A1A4F with 24% opacity

Glow Premium Small:
- Type: Drop Shadow
- X: 0, Y: 0, Blur: 12, Spread: 0
- Color: #D4AF37 with 30% opacity

Glow Premium Medium:
- Type: Drop Shadow
- X: 0, Y: 0, Blur: 24, Spread: 0
- Color: #D4AF37 with 40% opacity

Glow Premium Large:
- Type: Drop Shadow
- X: 0, Y: 0, Blur: 36, Spread: 0
- Color: #D4AF37 with 50% opacity

Backdrop Blur Small:
- Type: Background Blur
- Blur: 4px

Backdrop Blur Medium:
- Type: Background Blur
- Blur: 8px

Backdrop Blur Large:
- Type: Background Blur
- Blur: 16px
```

## 🔘 컴포넌트 생성 가이드

### Button Component 생성
```
1. 기본 버튼 프레임 생성 (Auto Layout)
2. Properties 설정:
   - Type: Primary | Secondary | Premium (Variant)
   - Size: Medium | Large (Variant)
   - State: Default | Hover | Active | Disabled (Variant)
   - Icon: Boolean
   - Loading: Boolean

3. Auto Layout 설정:
   - Direction: Horizontal
   - Spacing: 8px
   - Padding: 12px 24px
   - Alignment: Center

4. 텍스트 레이어:
   - Text Style: Body/Medium/Semibold
   - Content: Text Property

5. 아이콘 레이어 (조건부):
   - Size: 24x24px
   - Visible when: Icon = True

6. 로딩 스피너 (조건부):
   - Component: Loading Spinner
   - Visible when: Loading = True
```

### Card Component 생성
```
1. 카드 컨테이너 프레임 (Auto Layout)
2. Properties:
   - Type: Default | Tarot Card (Variant)
   - State: Empty | Face Down | Revealed (Variant)
   - Size: Thumbnail | Small | Medium | Large (Variant)

3. Tarot Card 구조:
   - Container (백그라운드 + 테두리)
   - Image Layer (조건부)
   - Number Badge (Empty 상태용)
   - Loading Spinner (조건부)
   - Premium Glow (조건부)

4. 비율 제약:
   - Aspect Ratio: 2:3 고정
   - Responsive: Scale proportionally
```

### Navigation Component 생성
```
1. Bottom Tab Bar 프레임
2. Properties:
   - Active Tab: Timer | Spreads | Journal | Settings (Variant)

3. Tab Item 구조:
   - Icon (24x24px)
   - Label (Caption/Medium)
   - Active Indicator (라운드 바)
   - Glow Effect (활성 상태)

4. Auto Layout:
   - Direction: Horizontal
   - Distribution: Space Between
   - Padding: 16px
   - Height: 80px
```

## 📱 화면 템플릿 생성

### Screen Template 구조
```
1. Device Frame (iPhone 12 Pro)
2. Safe Area Guide
3. Status Bar
4. Content Container
5. Navigation (하단 고정)

Template Components:
- Header Section
- Content Area (스크롤 가능)
- Bottom Navigation
- Floating Action Button (조건부)
```

### Timer Screen 구성
```
1. Mystical Header
   - Background Gradient
   - Animated Dots
   - App Title
   - Date

2. Main Card Section (조건부)
   - Card Display
   - Card Info
   - Time Badge

3. 24-Hour Scroll (조건부)
   - Section Header
   - Horizontal Card List
   - Gradient Fade

4. Journal Section (조건부)
   - Text Area
   - Character Counter
   - Save Button

5. Draw Cards CTA (조건부)
   - Central Icon
   - Title & Description
   - Premium Button
```

### Spreads Screen 구성
```
1. Header Section
2. Spread Cards List
   - Auto Layout (세로)
   - Card Components
   - 16px 간격

3. Premium Highlight
4. Bottom Padding
```

## 🔄 인터랙션 & 프로토타이핑

### 기본 인터랙션
```
1. Button Hover:
   - Trigger: Mouse Enter
   - Animation: Scale 102% + Glow
   - Duration: 200ms
   - Easing: Ease Out

2. Card Tap:
   - Trigger: Tap
   - Animation: Scale 98% → 100%
   - Duration: 150ms
   - Haptic: Light Impact

3. Modal Open:
   - Trigger: Tap
   - Animation: Slide Up + Fade In
   - Duration: 300ms
   - Overlay: Fade In

4. Page Transition:
   - Trigger: Tab Change
   - Animation: Slide Horizontal
   - Duration: 500ms
   - Easing: Ease In Out
```

### Advanced Prototyping
```
1. Smart Animate 사용:
   - 같은 레이어 이름으로 연결
   - 부드러운 전환 효과
   - 상태 변화 애니메이션

2. Component States 연결:
   - After Delay 트리거
   - State 변경 액션
   - 조건부 표시/숨김

3. Overlay Actions:
   - Modal 열기/닫기
   - Position: Center
   - Background: Darken
   - Close on Click Outside
```

## 📋 구현 체크리스트

### Foundation ✅
```
□ Figma 파일 구조 생성
□ 페이지 및 섹션 정리
□ 디바이스 프레임 설정
□ 그리드 시스템 설정
□ 컬러 스타일 생성 (50+ 스타일)
□ 텍스트 스타일 생성 (30+ 스타일)
□ 이펙트 스타일 생성 (15+ 이펙트)
```

### Components ✅
```
□ Button 컴포넌트 (12+ variants)
□ Badge 컴포넌트 (8+ variants)
□ Card 컴포넌트 (15+ variants)
□ Input 컴포넌트 (6+ variants)
□ Navigation 컴포넌트 (4+ variants)
□ List Item 컴포넌트 (8+ variants)
□ Modal 컴포넌트 (4+ variants)
□ Loading 컴포넌트 (6+ variants)
```

### Screens ✅
```
□ Timer Screen (6+ states)
□ Spreads Screen (3+ states)
□ Spread Detail Screen (각 스프레드별)
□ Journal Screen (4+ states)
□ Settings Screen (2+ states)
□ Card Modal (1+ state)
□ Loading States (모든 화면)
□ Empty States (해당 화면)
```

### Prototyping ✅
```
□ 기본 네비게이션 플로우
□ 버튼 인터랙션
□ 모달 열기/닫기
□ 카드 상호작용
□ 페이지 전환 애니메이션
□ 마이크로 인터랙션
```

### Documentation ✅
```
□ 컴포넌트 사용법 설명
□ 디자인 토큰 가이드
□ 인터랙션 스펙
□ 개발자 핸드오프 준비
□ 브랜드 가이드라인
```

## 🚀 다음 단계

완성된 Figma 파일로 다음을 진행할 수 있습니다:

1. **Developer Handoff**: Figma의 Inspect 기능으로 CSS 코드 추출
2. **Design QA**: 실제 구현과 디자인 비교 검토
3. **Usability Testing**: 인터랙티브 프로토타입으로 사용자 테스트
4. **Design System Evolution**: 컴포넌트 라이브러리 확장 및 업데이트

이 가이드를 따라 구현하면 완전한 타로 타이머 앱 디자인 시스템을 Figma에서 구축할 수 있습니다!