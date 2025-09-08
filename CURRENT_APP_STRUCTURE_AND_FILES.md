# 타로 타이머 앱 - 현재 구조 및 사용 파일 위치

## 📁 앱 진입점 및 핵심 설정

### 메인 진입점
```
/App.tsx                    ✅ 메인 애플리케이션 컴포넌트
/index.html                 ✅ HTML 진입점
```

### 빌드 및 설정
```
/package.json               ✅ 프로젝트 의존성 및 스크립트
/tsconfig.json              ✅ TypeScript 설정
/vite.config.ts             ✅ Vite 빌드 도구 설정
/postcss.config.js          ✅ PostCSS 설정
/tailwind.config.js         ✅ Tailwind CSS 설정
/.gitignore                 ✅ Git 무시 파일 목록
```

### 프로젝트 문서
```
/README.md                  ✅ 프로젝트 개요
/Guidelines.md              ✅ 디자인 가이드라인
/Attributions.md            ✅ 라이센스 및 저작권
```

## 🎨 스타일 시스템

### CSS 및 스타일
```
/styles/globals.css         ✅ Tailwind v4 토큰 + 글로벌 CSS
```

## 🧩 App.tsx에서 직접 Import하는 핵심 컴포넌트들

### 메인 화면 컴포넌트들
```
/components/Timer.tsx               ✅ 24시간 타로 타이머 화면
/components/Spreads.tsx             ✅ 스프레드 목록 화면  
/components/Journal.tsx             ✅ 저널/히스토리 화면
/components/Settings.tsx            ✅ 설정 화면
```

### 세부 화면 컴포넌트들
```
/components/SpreadDetail.tsx        ✅ 스프레드 상세/실행 화면
/components/SavedSpreadViewer.tsx   ✅ 저장된 스프레드 뷰어
/components/DailyTarotViewer.tsx    ✅ 데일리 타로 뷰어
```

### UI 라이브러리
```
/components/mystical-ui/icons.tsx   ✅ 커스텀 아이콘 컴포넌트들
/components/AnimationComponents.tsx ✅ 애니메이션 컴포넌트들
```

### 핵심 유틸리티
```
/utils/language.tsx         ✅ 다국어 지원 (LanguageProvider)
/utils/tarot.ts             ✅ 타로 타입 정의 (SpreadType, DailyTarotSave)
/utils/webStyles.ts         ✅ 웹 스타일 시스템 (tokens, commonStyles)
```

## 🔗 간접적으로 사용되는 파일들 (다른 컴포넌트에서 Import)

### SpreadDetail.tsx에서 사용
```
/components/SpreadLayouts.tsx       ✅ 스프레드 레이아웃 컴포넌트들
```

### Spreads.tsx에서 사용
```
/components/SpreadMiniature.tsx     ✅ 스프레드 미니어처 (Spreads 화면용)
```

### Journal.tsx에서 사용
```
/components/SpreadMiniatureForJournal.tsx ✅ 저널용 스프레드 미니어처
```

### Settings.tsx에서 사용
```
/components/PremiumCard.tsx         ✅ 프리미엄 기능 카드 컴포넌트
```

### mystical-ui 라이브러리
```
/components/mystical-ui/components.tsx ✅ mystical UI 컴포넌트들
```

### 보호된 Figma 컴포넌트
```
/components/figma/ImageWithFallback.tsx ✅ 이미지 fallback 컴포넌트 (보호됨)
```

## 🛠️ 유틸리티 파일들

### 타로 관련 데이터
```
/utils/tarot-cards.ts       ✅ 78장 타로 카드 전체 데이터
/utils/tarot-data.ts        ✅ 추가 타로 메타데이터
```

### 저널 시스템
```
/utils/journal-constants.ts ✅ 저널 관련 상수
/utils/journal-helpers.ts   ✅ 저널 헬퍼 함수들
```

## 🎭 에셋 파일들

### 아이콘 (21개)
```
/assets/icons/index.ts      ✅ 아이콘 인덱스 파일
/assets/icons/bell.svg      ✅ 알림
/assets/icons/book-open.svg ✅ 저널
/assets/icons/calendar.svg  ✅ 달력
/assets/icons/check.svg     ✅ 체크
/assets/icons/chevron-left.svg ✅ 뒤로가기
/assets/icons/clock.svg     ✅ 타이머
/assets/icons/crown.svg     ✅ 프리미엄
/assets/icons/eye.svg       ✅ 보기/숨기기
/assets/icons/globe.svg     ✅ 언어
/assets/icons/help-circle.svg ✅ 도움말
/assets/icons/layout.svg    ✅ 레이아웃
/assets/icons/lock.svg      ✅ 잠금
/assets/icons/moon.svg      ✅ 다크모드
/assets/icons/rotate-ccw.svg ✅ 리셋
/assets/icons/save.svg      ✅ 저장
/assets/icons/settings.svg  ✅ 설정
/assets/icons/shield.svg    ✅ 보안
/assets/icons/shuffle.svg   ✅ 셔플
/assets/icons/sparkles.svg  ✅ 마법효과
/assets/icons/star.svg      ✅ 즐겨찾기
/assets/icons/sun.svg       ✅ 라이트모드
/assets/icons/tarot-cards.svg ✅ 타로카드
/assets/icons/volume2.svg   ✅ 사운드
/assets/icons/x.svg         ✅ 닫기
/assets/icons/zap.svg       ✅ 에너지
```

### 이미지 (10개)
```
/assets/images/index.ts     ✅ 이미지 인덱스 파일
/assets/images/app-logo-icon.svg ✅ 앱 아이콘
/assets/images/app-logo-main.svg ✅ 메인 로고
/assets/images/card-placeholder.svg ✅ 카드 플레이스홀더
/assets/images/mystical-texture-dark.svg ✅ 다크 텍스처
/assets/images/mystical-texture-light.svg ✅ 라이트 텍스처
/assets/images/sacred-geometry-pattern.svg ✅ 기하학 패턴
/assets/images/sample-tarot-card.jpg ✅ 샘플 타로카드
/assets/images/sparkle-effect.svg ✅ 반짝임 효과
/assets/images/tarot-card-back.svg ✅ 타로카드 뒷면
```

## 🎛️ shadcn/ui 컴포넌트 라이브러리 (유지)

### 핵심 UI 컴포넌트들
```
/components/ui/accordion.tsx     ✅ 아코디언
/components/ui/alert-dialog.tsx  ✅ 알림 다이얼로그
/components/ui/alert.tsx         ✅ 알림
/components/ui/aspect-ratio.tsx  ✅ 비율 유지
/components/ui/avatar.tsx        ✅ 아바타
/components/ui/badge.tsx         ✅ 뱃지
/components/ui/breadcrumb.tsx    ✅ 브레드크럼
/components/ui/button.tsx        ✅ 버튼
/components/ui/calendar.tsx      ✅ 달력
/components/ui/card.tsx          ✅ 카드
/components/ui/carousel.tsx      ✅ 캐러셀
/components/ui/chart.tsx         ✅ 차트
/components/ui/checkbox.tsx      ✅ 체크박스
/components/ui/collapsible.tsx   ✅ 접기/펼치기
/components/ui/command.tsx       ✅ 명령어
/components/ui/context-menu.tsx  ✅ 컨텍스트 메뉴
/components/ui/dialog.tsx        ✅ 다이얼로그
/components/ui/drawer.tsx        ✅ 드로어
/components/ui/dropdown-menu.tsx ✅ 드롭다운 메뉴
/components/ui/form.tsx          ✅ 폼
/components/ui/hover-card.tsx    ✅ 호버 카드
/components/ui/icons.tsx         ✅ 기본 아이콘
/components/ui/input-otp.tsx     ✅ OTP 입력
/components/ui/input.tsx         ✅ 입력
/components/ui/label.tsx         ✅ 라벨
/components/ui/menubar.tsx       ✅ 메뉴바
/components/ui/navigation-menu.tsx ✅ 네비게이션 메뉴
/components/ui/pagination.tsx    ✅ 페이지네이션
/components/ui/popover.tsx       ✅ 팝오버
/components/ui/progress.tsx      ✅ 진행바
/components/ui/radio-group.tsx   ✅ 라디오 그룹
/components/ui/resizable.tsx     ✅ 크기 조절
/components/ui/scroll-area.tsx   ✅ 스크롤 영역
/components/ui/select.tsx        ✅ 셀렉트
/components/ui/separator.tsx     ✅ 구분선
/components/ui/sheet.tsx         ✅ 시트
/components/ui/sidebar.tsx       ✅ 사이드바
/components/ui/skeleton.tsx      ✅ 스켈레톤
/components/ui/slider.tsx        ✅ 슬라이더
/components/ui/sonner.tsx        ✅ 토스트
/components/ui/switch.tsx        ✅ 스위치
/components/ui/table.tsx         ✅ 테이블
/components/ui/tabs.tsx          ✅ 탭
/components/ui/textarea.tsx      ✅ 텍스트 영역
/components/ui/toggle-group.tsx  ✅ 토글 그룹
/components/ui/toggle.tsx        ✅ 토글
/components/ui/tooltip.tsx       ✅ 툴팁
/components/ui/use-mobile.ts     ✅ 모바일 감지 훅
/components/ui/utils.ts          ✅ UI 유틸리티
```

## ❌ 현재 사용되지 않는 파일들 (제거 권장)

### 백업 파일들
```
❌ /App-backup-v1.tsx
❌ /clean-app.tsx
❌ /components/SpreadDetail-backup-v1.tsx
❌ /components/SpreadDetail-fixed.tsx
❌ /components/SpreadDetail-new.tsx
❌ /components/SpreadDetail-updated.tsx
❌ /styles/globals-backup-v1.css
```

### React Native 관련 (웹 앱이므로 불필요)
```
❌ /babel.config.js
❌ /app.json
❌ /REACT_NATIVE_*.md (5개 파일)
❌ /TIMER_*_RN.md (2개 파일)
❌ /native-design-recommendations.md
❌ /scripts/ (전체 디렉토리)
```

### 테스트/데모 파일들
```
❌ /TestTimer.tsx
❌ /TimerScreen.tsx
❌ /Navigation.tsx
❌ /components/AnimationExamples.tsx
❌ /components/BaseComponentsDemo.tsx
❌ /components/CompositeDemo.tsx
❌ /components/TokenTest.tsx
❌ /components/SpreadDetailScreen.tsx
```

### 중복 디렉토리들
```
❌ /src/ (전체 - 다른 프로젝트 구조)
❌ /components/base/ (전체 - 사용되지 않음)
❌ /components/composite/ (전체 - 사용되지 않음)
❌ /components/screen-modules/ (전체 - 사용되지 않음)
❌ /documentation/ (전체 - 불필요한 문서들)
❌ /figma-design-specs/ (전체 - 불필요한 문서들)
❌ /guidelines/ (전체 - Guidelines.md는 루트로 이동됨)
```

### 사용되지 않는 컴포넌트들
```
❌ /components/Diary.tsx
❌ /components/Home.tsx
❌ /components/SacredGeometry.tsx
❌ /components/ReactNativeComponents.tsx
❌ /components/CSSTransitionReplacements.tsx
❌ /components/GuidelineComponents.tsx
```

### 불필요한 문서들
```
❌ /CLAUDE_CODE_PROMPT.md
❌ /CLEANUP_SUMMARY.md
❌ /CONVERSION_ROADMAP.md
❌ /TIMER_COMPLETE_IMPLEMENTATION.md
❌ /TIMER_IMPLEMENTATION_PROMPT.md
❌ /design-tokens.md
❌ /project-export.json
❌ /clean-project-structure.md
```

### 임시 파일들
```
❌ /temp-cleanup.txt
❌ /temp-delete-commands.txt
❌ /temp-files-to-remove.txt
❌ /components/cleanup-placeholder.txt
❌ /components/temp_delete_marker.txt
❌ /assets/README.md
❌ /assets/usage-examples.md
```

### 사용되지 않는 유틸리티들
```
❌ /utils/accessibility.tsx
❌ /utils/animations.tsx
❌ /utils/performance.tsx
❌ /utils/reactNativeStyles.ts
❌ /utils/responsive.tsx
❌ /utils/shadowsAndGradients.ts
❌ /utils/styleHelpers.ts
❌ /utils/touchStates.ts
```

## 📊 파일 의존성 트리

### App.tsx (최상위)
```
App.tsx
├── components/Timer.tsx
├── components/Spreads.tsx
│   └── components/SpreadMiniature.tsx
├── components/Journal.tsx
│   └── components/SpreadMiniatureForJournal.tsx
├── components/Settings.tsx
│   └── components/PremiumCard.tsx
├── components/SpreadDetail.tsx
│   └── components/SpreadLayouts.tsx
├── components/SavedSpreadViewer.tsx
├── components/DailyTarotViewer.tsx
├── components/mystical-ui/icons.tsx
├── components/AnimationComponents.tsx
├── utils/language.tsx
├── utils/tarot.ts
├── utils/webStyles.ts
├── components/mystical-ui/components.tsx (간접)
├── utils/tarot-cards.ts (간접)
├── utils/tarot-data.ts (간접)
├── utils/journal-constants.ts (간접)
├── utils/journal-helpers.ts (간접)
├── components/figma/ImageWithFallback.tsx (간접)
└── components/ui/* (shadcn - 간접)
```

## 🎯 최종 핵심 파일 수

### 실제 사용되는 파일들 (약 63개)
- **루트 설정 파일**: 11개
- **스타일**: 1개
- **핵심 컴포넌트**: 12개
- **UI 라이브러리**: 3개 (mystical-ui + figma)
- **shadcn/ui**: 약 30개
- **유틸리티**: 7개
- **에셋**: 31개 (아이콘 21개 + 이미지 10개)

### 제거 가능한 파일들 (약 60개)
- **백업 파일들**: 8개
- **React Native 관련**: 10개
- **테스트/데모**: 8개
- **중복 디렉토리**: 20개 이상
- **불필요한 문서**: 15개
- **임시 파일들**: 8개
- **사용되지 않는 유틸리티**: 8개

## 🔄 앱 실행 흐름

1. **진입점**: `/index.html` → `/App.tsx`
2. **언어 설정**: `LanguageProvider` from `/utils/language.tsx`
3. **메인 탭 렌더링**: 4개 메인 컴포넌트 중 하나
4. **상세 화면**: 필요시 SpreadDetail, SavedSpreadViewer, DailyTarotViewer
5. **스타일링**: `/styles/globals.css` + `/utils/webStyles.ts`
6. **데이터**: `/utils/tarot-cards.ts` + `/utils/tarot-data.ts`

이 구조를 통해 앱의 모든 기능이 완벽하게 작동하고 있습니다!