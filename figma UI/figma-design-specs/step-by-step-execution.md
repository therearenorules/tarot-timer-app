# Figma 실행 가이드 - 단계별 작업 순서

## 🚀 즉시 시작 가능한 작업들

### **STEP 1: Figma 파일 기본 설정 (5분)**

1. **새 Figma 파일 생성**
   ```
   - Figma 열기 → "+" → "디자인 파일"
   - 파일명: "Tarot Timer - Design System"
   - 설명: "완전한 타로 타이머 앱 디자인 시스템"
   ```

2. **첫 번째 페이지 이름 변경**
   ```
   - 기본 "Page 1" → "🎨 01-Design Foundation"으로 변경
   ```

3. **나머지 4개 페이지 추가**
   ```
   - 페이지 탭 옆 "+" 클릭
   - "🧩 02-Component Library" 추가
   - "📱 03-Mobile Screens" 추가
   - "🔄 04-User Flows" 추가
   - "📋 05-Documentation" 추가
   ```

---

### **STEP 2: 첫 번째 컬러 스타일 생성 (10분)**

**🎨 01-Design Foundation** 페이지로 이동

1. **Brand Colors 섹션 생성**
   ```
   - Rectangle 툴로 색상 샘플 생성 (100x100px)
   - Fill: #4A1A4F (Deep Purple)
   - 우클릭 → "Selection colors" → "Create style"
   - 이름: "Brand/Primary/Deep-Purple"
   - 설명: "Primary brand color - Deep Purple"
   ```

2. **추가 브랜드 컬러 생성**
   ```
   Deep Purple: #4A1A4F → "Brand/Primary/Deep-Purple"
   Midnight Blue: #1A1F3A → "Brand/Secondary/Midnight-Blue"  
   Premium Gold: #D4AF37 → "Brand/Accent/Premium-Gold"
   White: #FFFFFF → "Base/White"
   Black: #000000 → "Base/Black"
   ```

3. **첫 번째 Light Mode 컬러 생성**
   ```
   Background Primary: #FFFFFF → "Light/Background/Primary"
   Text Primary: #1A1F3A → "Light/Text/Primary"
   Text Secondary: #4A1A4F → "Light/Text/Secondary"
   Border Default: #E8E1E8 → "Light/Border/Default"
   ```

---

### **STEP 3: 첫 번째 텍스트 스타일 생성 (10분)**

1. **Display Large 스타일 생성**
   ```
   - Text 툴로 "Display Large" 텍스트 생성
   - Font: SF Pro Display (또는 시스템 기본)
   - Size: 32pt
   - Weight: Semibold
   - Line Height: 38pt (1.19 비율)
   - Color: Light/Text/Primary 적용
   - 우클릭 → "Create style"
   - 이름: "Display/Large/Semibold"
   ```

2. **기본 텍스트 스타일들 생성**
   ```
   Display Large: 32pt/Semibold → "Display/Large/Semibold"
   Title Large: 24pt/Medium → "Title/Large/Medium" 
   Body Medium: 14pt/Regular → "Body/Medium/Regular"
   Caption: 11pt/Medium → "Caption/Medium"
   ```

---

### **STEP 4: 첫 번째 이펙트 스타일 생성 (5분)**

1. **Card Shadow 생성**
   ```
   - Rectangle 생성 (200x100px)
   - Fill: 흰색
   - Effect → "+" → "Drop Shadow"
   - X: 0, Y: 2, Blur: 8, Spread: 0
   - Color: #4A1A4F, Opacity: 12%
   - 우클릭 Effects → "Create style"
   - 이름: "Shadow/Level-1/Card"
   ```

---

### **STEP 5: 첫 번째 컴포넌트 생성 (15분)**

**🧩 02-Component Library** 페이지로 이동

1. **Primary Button 생성**
   ```
   - Rectangle 툴 → 160x48px
   - Auto Layout 활성화
   - Padding: 12px top/bottom, 24px left/right  
   - Spacing: 8px
   - Fill: Brand/Primary/Deep-Purple
   - Corner Radius: 8px
   ```

2. **버튼 텍스트 추가**
   ```
   - Text 툴 → "Button" 입력
   - Style: Body/Medium/Regular 적용
   - Color: Premium Gold (#D4AF37)
   ```

3. **컴포넌트로 변환**
   ```
   - 전체 선택 → 우클릭 → "Create component"
   - 이름: "Button/Primary"
   - 설명: "Primary action button with deep purple background"
   ```

4. **Properties 추가**
   ```
   - 컴포넌트 선택 → 우측 패널 "Create property"
   - Text: "Text" (기본값: "Button")
   - Boolean: "Full Width" (기본값: false)
   - Boolean: "Loading" (기본값: false)
   ```

---

### **STEP 6: 첫 번째 화면 템플릿 생성 (10분)**

**📱 03-Mobile Screens** 페이지로 이동

1. **iPhone 프레임 생성**
   ```
   - Frame 툴 → "iPhone 12 Pro" 선택 (390x844px)
   - 이름: "Timer - Initial State"
   ```

2. **기본 구조 추가**
   ```
   - Status Bar (상단 고정)
   - Content Container (max-width 375px, center)
   - Bottom Navigation 영역 (하단 80px + safe area)
   ```

3. **Background 추가**
   ```
   - Fill: Linear gradient
   - 135° angle
   - Color 1: #1A1F3A (0%)
   - Color 2: #4A1A4F (50%)  
   - Color 3: #1A1F3A (100%)
   ```

---

## **📋 다음 30분 체크리스트**

### **Foundation 확장 (10분)**
- [ ] 나머지 Light Mode 컬러 10개 생성
- [ ] Dark Mode 컬러 10개 생성  
- [ ] 추가 텍스트 스타일 5개 생성
- [ ] 추가 이펙트 스타일 3개 생성

### **Component Library 확장 (15분)**
- [ ] Secondary Button 생성
- [ ] Premium Button 생성
- [ ] Premium Badge 생성
- [ ] Basic Card 컴포넌트 생성

### **Screen Template 확장 (5분)**
- [ ] 추가 화면 프레임 2개 생성
- [ ] Mystical Background 효과 추가
- [ ] Navigation 컴포넌트 배치

---

## **🎯 1시간 완성 목표**

### **30분 후 달성 상태**
- ✅ 기본 Figma 구조 완성
- ✅ 25개 컬러 스타일
- ✅ 10개 텍스트 스타일
- ✅ 5개 이펙트 스타일
- ✅ 4개 기본 컴포넌트

### **1시간 후 목표 상태**
- ✅ 50개 컬러 스타일 (Light+Dark Mode)
- ✅ 20개 텍스트 스타일
- ✅ 10개 이펙트 스타일
- ✅ 10개 컴포넌트 (Button, Badge, Card 패밀리)
- ✅ 3개 화면 템플릿 기본 구조

---

## **💡 효율적인 작업 팁**

### **컬러 스타일 빠른 생성법**
1. 색상표를 미리 Rectangle들로 한번에 생성
2. 각각에 hex 값 적용
3. 일괄 Selection하여 스타일 생성
4. 이름 규칙에 따라 일관되게 작명

### **텍스트 스타일 빠른 생성법**
1. 한 텍스트에서 폰트, 사이즈, 웨이트 변경
2. 매번 스타일 생성
3. 같은 텍스트 레이어를 복사하여 다음 스타일 작업

### **컴포넌트 Properties 활용**
1. Boolean Properties로 상태 변경 가능하게 설정
2. Text Properties로 콘텐츠 변경 가능하게 설정
3. Instance Swap으로 아이콘 변경 가능하게 설정

---

## **🔥 지금 당장 시작할 수 있는 첫 번째 작업**

**바로 지금 할 수 있는 것:**

1. **Figma 열기**
2. **새 파일 생성** → "Tarot Timer - Design System"
3. **첫 번째 컬러 생성** → Rectangle + #4A1A4F + "Brand/Primary/Deep-Purple"

**이 3단계만 하셔도 시작입니다!** 나머지는 하나씩 따라오시면 됩니다.

어떤 단계부터 시작하고 싶으신가요?