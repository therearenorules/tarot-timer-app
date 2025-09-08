# 타로 타이머 앱 에셋 폴더

이 폴더에는 타로 타이머 앱에서 사용하는 모든 정적 에셋들이 정리되어 있습니다.

## 📁 폴더 구조

```
/assets/
├── icons/              # SVG 아이콘 파일들
│   ├── clock.svg
│   ├── layout.svg
│   ├── tarot-cards.svg
│   ├── ...
│   └── index.ts        # 아이콘 인덱스 및 타입 정의
├── images/             # 이미지 에셋 파일들
│   ├── tarot-card-back.svg
│   ├── app-logo-main.svg
│   ├── sacred-geometry-pattern.svg
│   ├── ...
│   └── index.ts        # 이미지 인덱스 및 타입 정의
└── README.md          # 이 파일
```

## 🎨 아이콘 가이드라인

### 디자인 원칙
- **크기**: 24x24px 기본 크기
- **스트로크**: 일관된 2px 두께
- **색상**: `currentColor` 사용으로 테마 적응
- **스타일**: 미니멀하고 신비로운 느낌

### 아이콘 카테고리

#### 🧭 네비게이션 (Navigation)
- `clock.svg` - 타이머 탭
- `layout.svg` - 스프레드 탭  
- `book-open.svg` - 저널 탭
- `settings.svg` - 설정 탭

#### ✨ 브랜드 (Brand)
- `tarot-cards.svg` - 메인 브랜드 아이콘 (3장 카드)
- `moon.svg` - 신비로운 분위기

#### ⚡ 액션 (Actions)
- `star.svg` - 즐겨찾기, 프리미엄
- `sparkles.svg` - 마법적 효과
- `zap.svg` - 빠른 액션, 에너지
- `rotate-ccw.svg` - 다시 뽑기
- `save.svg` - 저장하기
- `crown.svg` - 프리미엄 기능
- `shuffle.svg` - 섞기

#### 🔧 인터페이스 (Interface)  
- `chevron-left.svg` - 뒤로가기
- `check.svg` - 확인, 완료
- `x.svg` - 닫기, 취소
- `eye.svg` - 보기, 미리보기
- `calendar.svg` - 날짜, 일정

#### ⚙️ 설정 (Settings)
- `sun.svg` - 라이트 모드
- `globe.svg` - 언어 설정
- `volume2.svg` - 소리 설정  
- `bell.svg` - 알림 설정
- `lock.svg` - 보안, 프라이버시
- `shield.svg` - 보안
- `help-circle.svg` - 도움말

## 🛠️ 사용 방법

### React 컴포넌트에서 사용
```tsx
import { TarotCardsIcon, StarIcon } from '../assets/icons';

// 직접 사용
<TarotCardsIcon className="w-6 h-6 text-premium-gold" />

// 기존 React 컴포넌트와 함께 사용  
<TarotCards className="w-6 h-6 text-premium-gold" />
```

### CSS에서 사용
```css
.icon-background {
  background-image: url('./assets/icons/tarot-cards.svg');
  background-size: 24px 24px;
}
```

### Figma에서 사용
1. SVG 파일을 Figma로 드래그앤드롭
2. 색상 변경 시 Fill 속성에서 조정
3. 크기 조정 시 비율 유지 (Shift + 드래그)

## 🎯 디자인 토큰과의 연동

아이콘들은 다음 브랜드 컬러와 함께 사용됩니다:

```css
/* 주요 브랜드 컬러 */
--premium-gold: #d4af37;
--deep-purple: #4a1a4f;  
--midnight-blue: #1a1f3a;

/* 사용 예시 */
.icon-gold { color: var(--premium-gold); }
.icon-purple { color: var(--deep-purple); }
.icon-blue { color: var(--midnight-blue); }
```

## 📱 반응형 크기

```css
/* 모바일 기본 */
.icon-sm { width: 16px; height: 16px; }
.icon-md { width: 24px; height: 24px; }  /* 기본 크기 */
.icon-lg { width: 32px; height: 32px; }

/* Tailwind 클래스 */
.w-4.h-4  /* 16px - 작은 버튼 */
.w-6.h-6  /* 24px - 기본 크기 */
.w-8.h-8  /* 32px - 헤더, 큰 버튼 */
```

## ✅ 품질 체크리스트

아이콘 추가 시 확인사항:
- [ ] 24x24px 뷰박스 사용
- [ ] 2px 스트로크 위드 일관성
- [ ] `currentColor` 속성 사용
- [ ] SVG 코드 최적화 완료
- [ ] 접근성 고려 (의미 있는 파일명)
- [ ] 브랜드 가이드라인 준수
- [ ] 다크/라이트 모드에서 테스트 완료

## 🔄 업데이트 로그

- **v1.0.0** (2024-01-15): 초기 아이콘 세트 생성 (25개)
- 메인 브랜드 아이콘 `tarot-cards.svg` 추가
- 네비게이션, 액션, 설정 카테고리별 아이콘 정리
- TypeScript 인덱스 파일 생성

---

## 🖼️ 이미지 에셋 가이드라인

### 카테고리별 이미지 에셋

#### 🃏 타로 카드 (Cards)
- `tarot-card-back.svg` - 타로 카드 뒷면
- `card-placeholder.svg` - 로딩/오류 시 플레이스홀더

#### 🏷️ 브랜딩 (Branding)
- `app-logo-main.svg` - 메인 로고 (120×120px)
- `app-logo-icon.svg` - 아이콘 로고 (64×64px)

#### 🎨 배경 & 텍스처 (Backgrounds)
- `sacred-geometry-pattern.svg` - Sacred Geometry 패턴
- `mystical-texture-light.svg` - 라이트 모드 텍스처
- `mystical-texture-dark.svg` - 다크 모드 텍스처

#### ✨ 효과 (Effects)
- `sparkle-effect.svg` - 애니메이션 반짝임 효과

### 이미지 사용 방법

#### React 컴포넌트에서 사용
```tsx
import { TarotCardBack, AppLogoMain, SparkleEffect } from '../assets/images';

// SVG 컴포넌트로 사용 (권장)
<TarotCardBack className="w-32 h-48" />
<AppLogoMain className="w-20 h-20" />

// 이미지 태그로 사용
<img src={TarotCardBack} alt="Tarot Card Back" className="w-32 h-48" />
```

#### CSS 배경으로 사용
```css
.mystical-background {
  background-image: url('../assets/images/sacred-geometry-pattern.svg');
  background-repeat: repeat;
  background-size: 200px 200px;
}

.card-texture {
  background-image: url('../assets/images/mystical-texture-dark.svg');
  background-repeat: repeat;
}
```

#### 다크 모드 대응
```tsx
// 테마에 따른 텍스처 선택
const textureImage = isDarkMode ? MysticalTextureDark : MysticalTextureLight;

<div 
  className="mystical-bg" 
  style={{ backgroundImage: `url(${textureImage})` }}
>
  Content here
</div>
```

### 디자인 토큰과의 연동

이미지 에셋들은 다음 브랜드 컬러와 연동됩니다:

```css
/* 이미지 내 사용된 주요 컬러 */
--premium-gold: #d4af37;      /* 주요 강조 요소 */
--bright-gold: #f4d03f;       /* 글로우 및 하이라이트 */
--deep-purple: #4a1a4f;       /* 카드 배경 */
--midnight-blue: #1a1f3a;     /* 어두운 배경 */
```

### 애니메이션 에셋

일부 SVG는 내장 애니메이션을 포함합니다:

- `card-placeholder.svg` - 로딩 시머 효과
- `sparkle-effect.svg` - 반짝임 및 회전 애니메이션

```tsx
// 애니메이션 제어
<SparkleEffect 
  className="w-24 h-24" 
  style={{ animationPlayState: isHovered ? 'running' : 'paused' }}
/>
```

### Figma에서 사용

1. SVG 파일을 Figma로 드래그앤드롭
2. 색상 변경 시 Fill 속성에서 조정
3. 크기 조정 시 비율 유지 (Shift + 드래그)
4. 패턴으로 사용 시 타일링 설정

### 성능 최적화

```tsx
// 지연 로딩
const LazyLogo = lazy(() => import('../assets/images/app-logo-main.svg'));

// 프리로드
<link rel="preload" href={TarotCardBack} as="image" type="image/svg+xml" />

// WebP 대체 (필요 시)
<picture>
  <source srcSet="card-back.webp" type="image/webp" />
  <img src={TarotCardBack} alt="Tarot Card Back" />
</picture>
```

### 접근성 고려사항

```tsx
// 의미 있는 alt 텍스트
<img src={AppLogoMain} alt="타로 타이머 앱 로고" />

// 장식적 이미지는 빈 alt
<img src={SacredGeometryPattern} alt="" role="presentation" />

// 중요한 정보는 텍스트로도 제공
<div className="logo-container">
  <img src={AppLogoIcon} alt="타로 타이머" />
  <span className="sr-only">타로 타이머 앱</span>
</div>
```

💫 **신비로운 디자인, 완벽한 구현** ✨