# React Native Project Structure Setup Plan

> 타로 타이머 앱을 위한 체계적인 폴더 구조 및 아키텍처 설계

## 🎯 Current State Analysis

### Existing `figma UI` Folder Assessment
- **완성도**: 95% (1,186줄의 메인 앱 + 완전한 컴포넌트 라이브러리)
- **아키텍처**: React Web 기반, Tailwind CSS + TypeScript
- **주요 자산**:
  - 78장 완전한 타로 카드 이미지
  - 6개 스프레드 타입 로직
  - 한/영 이중 언어 시스템
  - 완전한 UI 컴포넌트 라이브러리

### Migration Strategy
```
Web React (figma UI) → React Native + Expo
     ↓ 점진적 마이그레이션
[Assets] → [Utils] → [Types] → [Components] → [Screens]
```

---

## 📁 React Native Project Structure

### Root Level Organization
```
타로-timer-app/
├── 📁 src/                      # 메인 소스 코드
├── 📁 assets/                   # 정적 자산 (이미지, 폰트)
├── 📁 design-system/            # 디자인 시스템 (기존 완성)
├── 📁 docs/                     # 프로젝트 문서
├── 📁 scripts/                  # 빌드 및 개발 스크립트
├── 📁 figma UI/                 # 기존 웹 버전 (참조용 보관)
├── 📂 __tests__/                # 글로벌 테스트
├── 📄 app.json                  # Expo 설정
├── 📄 babel.config.js           # Babel 설정
├── 📄 metro.config.js           # Metro 번들러 설정
├── 📄 tsconfig.json             # TypeScript 설정
└── 📄 package.json              # 패키지 의존성
```

### Core `src/` Directory Structure
```
src/
├── 📁 app/                      # Expo Router 기반 화면들
│   ├── 📁 (tabs)/              # 탭 기반 내비게이션
│   │   ├── timer.tsx           # 타이머 화면
│   │   ├── spreads.tsx         # 스프레드 화면
│   │   ├── journal.tsx         # 저널 화면
│   │   └── settings.tsx        # 설정 화면
│   ├── _layout.tsx             # 루트 레이아웃
│   └── +not-found.tsx          # 404 페이지
├── 📁 components/              # 재사용 가능한 UI 컴포넌트
├── 📁 screens/                 # 화면별 컴포넌트 (복잡한 로직 포함)
├── 📁 services/                # API 및 외부 서비스 연동
├── 📁 utils/                   # 유틸리티 함수들
├── 📁 types/                   # TypeScript 타입 정의
├── 📁 constants/               # 앱 상수 및 설정
├── 📁 hooks/                   # 커스텀 React Hook들
├── 📁 store/                   # 상태 관리 (Zustand)
└── 📁 assets/                  # 소스 코드와 연관된 자산
```

---

## 🧩 Detailed Folder Structure

### 1. `src/components/` - UI 컴포넌트 라이브러리

```
components/
├── 📁 base/                    # 기본 원자 컴포넌트
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.stories.tsx
│   │   └── index.ts
│   ├── Card/
│   ├── Text/
│   ├── Icon/
│   └── index.ts               # 모든 base 컴포넌트 export
├── 📁 composite/              # 복합 컴포넌트 (molecules)
│   ├── TarotCard/
│   │   ├── TarotCard.tsx
│   │   ├── TarotCardFlip.tsx
│   │   ├── TarotCardModal.tsx
│   │   └── index.ts
│   ├── SpreadLayout/
│   ├── TimerDisplay/
│   ├── NavigationTab/
│   └── index.ts
├── 📁 forms/                  # 폼 관련 컴포넌트
│   ├── InputField/
│   ├── Switch/
│   ├── DatePicker/
│   └── index.ts
├── 📁 layout/                 # 레이아웃 컴포넌트
│   ├── SafeAreaLayout/
│   ├── ScreenContainer/
│   ├── Modal/
│   └── index.ts
└── index.ts                  # 모든 컴포넌트 통합 export
```

### 2. `src/screens/` - 화면별 컴포넌트

```
screens/
├── 📁 TimerScreen/
│   ├── TimerScreen.tsx        # 메인 화면 컴포넌트
│   ├── components/            # 화면별 전용 컴포넌트
│   │   ├── HourlyCardDisplay.tsx
│   │   ├── TimerControls.tsx
│   │   └── DailyProgressBar.tsx
│   ├── hooks/                 # 화면별 커스텀 훅
│   │   ├── useTimer.ts
│   │   ├── useDailyCards.ts
│   │   └── useCardGeneration.ts
│   ├── utils/                 # 화면별 유틸리티
│   │   └── timerCalculations.ts
│   └── index.ts
├── 📁 SpreadsScreen/
│   ├── SpreadsScreen.tsx
│   ├── components/
│   │   ├── SpreadGrid.tsx
│   │   ├── SpreadDetail.tsx
│   │   └── SpreadProgress.tsx
│   ├── hooks/
│   │   ├── useSpread.ts
│   │   └── useSpreadLogic.ts
│   └── index.ts
├── 📁 JournalScreen/
├── 📁 SettingsScreen/
└── index.ts
```

### 3. `src/services/` - 외부 서비스 연동

```
services/
├── 📁 api/                    # REST API 클라이언트
│   ├── base/
│   │   ├── apiClient.ts       # Axios 기본 설정
│   │   ├── apiTypes.ts        # API 응답 타입
│   │   └── apiUtils.ts        # API 유틸리티
│   ├── endpoints/
│   │   ├── tarotApi.ts        # 타로 관련 API
│   │   ├── userApi.ts         # 사용자 관련 API
│   │   ├── journalApi.ts      # 저널 관련 API
│   │   └── settingsApi.ts     # 설정 관련 API
│   └── index.ts
├── 📁 storage/                # 로컬 스토리지 관리
│   ├── mmkvStorage.ts         # MMKV 기반 스토리지
│   ├── secureStorage.ts       # 보안 저장소
│   ├── cacheManager.ts        # 캐시 관리
│   └── index.ts
├── 📁 notifications/          # 푸시 알림 서비스
│   ├── notificationService.ts
│   ├── notificationTypes.ts
│   └── index.ts
├── 📁 analytics/              # 분석 서비스
│   ├── analyticsService.ts
│   ├── trackingEvents.ts
│   └── index.ts
└── index.ts
```

### 4. `src/utils/` - 유틸리티 함수들

```
utils/
├── 📁 tarot/                  # 타로 관련 유틸리티
│   ├── cardGeneration.ts      # 카드 생성 로직
│   ├── spreadLayouts.ts       # 스프레드 레이아웃
│   ├── cardData.ts            # 카드 데이터 관리
│   └── tarotAlgorithms.ts     # 타로 알고리즘
├── 📁 platform/               # 플랫폼 감지 및 호환성
│   ├── platformUtils.ts       # 플랫폼 유틸리티
│   ├── dimensions.ts          # 화면 크기 관리
│   ├── deviceInfo.ts          # 디바이스 정보
│   └── accessibility.ts       # 접근성 유틸리티
├── 📁 date/                   # 날짜 및 시간 관리
│   ├── dateUtils.ts           # 날짜 유틸리티
│   ├── timerUtils.ts          # 타이머 관련
│   └── timezone.ts            # 시간대 관리
├── 📁 validation/             # 데이터 검증
│   ├── schemas.ts             # Zod 스키마
│   ├── validators.ts          # 검증 함수
│   └── sanitizers.ts          # 데이터 정제
├── 📁 i18n/                   # 국제화
│   ├── translations/
│   │   ├── ko.json
│   │   └── en.json
│   ├── i18nConfig.ts          # i18n 설정
│   └── useTranslation.ts      # 번역 훅
├── 📁 animations/             # 애니메이션 유틸리티
│   ├── animationConfigs.ts    # Reanimated 설정
│   ├── customAnimations.ts    # 커스텀 애니메이션
│   └── transitions.ts         # 화면 전환
└── index.ts
```

### 5. `src/types/` - TypeScript 타입 정의

```
types/
├── 📁 api/                    # API 관련 타입
│   ├── requests.ts            # API 요청 타입
│   ├── responses.ts           # API 응답 타입
│   └── index.ts
├── 📁 domain/                 # 도메인 모델 타입
│   ├── tarot.ts               # 타로 관련 타입
│   ├── user.ts                # 사용자 타입
│   ├── journal.ts             # 저널 타입
│   └── settings.ts            # 설정 타입
├── 📁 ui/                     # UI 컴포넌트 타입
│   ├── components.ts          # 컴포넌트 Props 타입
│   ├── navigation.ts          # 내비게이션 타입
│   └── theme.ts               # 테마 타입
├── 📁 utils/                  # 유틸리티 타입
│   ├── common.ts              # 공통 유틸리티 타입
│   ├── platform.ts            # 플랫폼 관련 타입
│   └── validation.ts          # 검증 관련 타입
├── global.ts                  # 전역 타입 선언
└── index.ts
```

### 6. `src/store/` - 상태 관리 (Zustand)

```
store/
├── 📁 slices/                 # 상태 슬라이스
│   ├── timerSlice.ts          # 타이머 상태
│   ├── tarotSlice.ts          # 타로 카드 상태
│   ├── journalSlice.ts        # 저널 상태
│   ├── settingsSlice.ts       # 설정 상태
│   └── uiSlice.ts             # UI 상태
├── 📁 middleware/             # 미들웨어
│   ├── persistMiddleware.ts   # 영속화 미들웨어
│   ├── loggerMiddleware.ts    # 로깅 미들웨어
│   └── devtoolsMiddleware.ts  # 개발자 도구
├── 📁 selectors/              # 상태 선택자
│   ├── timerSelectors.ts
│   ├── tarotSelectors.ts
│   └── index.ts
├── store.ts                   # 메인 스토어 설정
├── types.ts                   # 스토어 타입 정의
└── index.ts
```

### 7. `src/hooks/` - 커스텀 React Hook들

```
hooks/
├── 📁 common/                 # 공통 훅
│   ├── useAsyncState.ts       # 비동기 상태 관리
│   ├── useDebounce.ts         # 디바운싱
│   ├── useThrottle.ts         # 스로틀링
│   └── usePrevious.ts         # 이전 값 추적
├── 📁 platform/               # 플랫폼 관련 훅
│   ├── useDeviceInfo.ts       # 디바이스 정보
│   ├── useDimensions.ts       # 화면 크기
│   ├── useOrientation.ts      # 화면 회전
│   └── useAppState.ts         # 앱 상태 (foreground/background)
├── 📁 api/                    # API 관련 훅
│   ├── useApi.ts              # 범용 API 훅
│   ├── useTarotApi.ts         # 타로 API 훅
│   └── useInfiniteQuery.ts    # 무한 스크롤
├── 📁 storage/                # 스토리지 관련 훅
│   ├── useStorage.ts          # 로컬 스토리지
│   ├── useSecureStorage.ts    # 보안 스토리지
│   └── useCache.ts            # 캐시 관리
├── 📁 animations/             # 애니메이션 훅
│   ├── useAnimatedValue.ts    # Reanimated 값
│   ├── useSpringAnimation.ts  # 스프링 애니메이션
│   └── useGesture.ts          # 제스처 처리
└── index.ts
```

---

## 🔄 Migration Strategy

### Phase 1: Foundation Setup (2-3 days)
```
1. React Native + Expo 프로젝트 초기화
2. 기본 폴더 구조 생성
3. TypeScript 설정 및 기본 타입 정의
4. Design System 통합
5. 기본 라우팅 설정 (Expo Router)
```

### Phase 2: Asset Migration (1-2 days)
```
1. 타로 카드 이미지 최적화 및 이관 (78장)
2. 아이콘 및 기타 자산 React Native 호환 변환
3. 폰트 설정 및 다국어 리소스 이관
4. 사운드 및 햅틱 피드백 자산 추가
```

### Phase 3: Core Logic Migration (3-4 days)
```
1. 타로 데이터 및 알고리즘 이관 (utils/tarot/)
2. 언어 시스템 React Native 호환 변환 (utils/i18n/)
3. 로컬 스토리지 MMKV로 마이그레이션 (services/storage/)
4. 기본 상태 관리 Zustand로 설정 (store/)
```

### Phase 4: Component Migration (4-5 days)
```
1. Base 컴포넌트 React Native 변환 (components/base/)
2. Composite 컴포넌트 마이그레이션 (components/composite/)
3. 화면별 컴포넌트 구조 재설계 (screens/)
4. 애니메이션 Reanimated로 변환 (utils/animations/)
```

### Phase 5: Screen Implementation (3-4 days)
```
1. TimerScreen 구현 (screens/TimerScreen/)
2. SpreadsScreen 구현 (screens/SpreadsScreen/)
3. JournalScreen 구현 (screens/JournalScreen/)
4. SettingsScreen 구현 (screens/SettingsScreen/)
```

### Phase 6: Integration & Polish (2-3 days)
```
1. 내비게이션 연결 및 상태 동기화
2. 성능 최적화 및 메모리 관리
3. 크로스 플랫폼 테스트 (iOS/Android)
4. 접근성 검증 및 최종 품질 점검
```

---

## 📋 Implementation Checklist

### ✅ Foundation Requirements
- [ ] React Native + Expo 프로젝트 초기화
- [ ] TypeScript strict 모드 설정
- [ ] ESLint + Prettier 설정
- [ ] 폴더 구조 생성 스크립트
- [ ] 기본 라우팅 설정
- [ ] Design System 통합

### ✅ Core Infrastructure
- [ ] MMKV 로컬 스토리지 설정
- [ ] Zustand 상태 관리 구조
- [ ] i18n 다국어 지원 시스템
- [ ] Reanimated 애니메이션 기반 구축
- [ ] 타로 카드 데이터 모델 정의
- [ ] API 클라이언트 기본 구조

### ✅ Component Library
- [ ] Base 컴포넌트 (Button, Card, Text, Icon)
- [ ] Composite 컴포넌트 (TarotCard, TimerDisplay)
- [ ] Layout 컴포넌트 (SafeArea, Modal, Navigation)
- [ ] Form 컴포넌트 (Input, Switch, DatePicker)
- [ ] 컴포넌트 스토리북/문서화

### ✅ Screen Implementation
- [ ] TimerScreen (24시간 타로 시스템)
- [ ] SpreadsScreen (6개 스프레드 타입)
- [ ] JournalScreen (저널 시스템)
- [ ] SettingsScreen (설정 관리)
- [ ] 화면간 내비게이션 연결

### ✅ Integration & Testing
- [ ] 크로스 플랫폼 호환성 테스트
- [ ] 성능 프로파일링 및 최적화
- [ ] 접근성 검증
- [ ] 에러 처리 및 예외 상황 대응
- [ ] 프로덕션 빌드 검증

---

## 🎯 Success Criteria

### 기능적 요구사항 달성
- **타로 시스템**: 24시간 일관된 카드 생성 ✓
- **스프레드**: 6개 타입 완전 구현 ✓
- **저널**: 완전한 기록 및 관리 시스템 ✓
- **다국어**: 한/영 완벽 지원 ✓

### 기술적 요구사항 달성
- **성능**: 60fps 애니메이션, 2초 이내 앱 시작
- **호환성**: iOS 13+, Android API 26+ 지원
- **품질**: TypeScript 100% 커버리지, 테스트 80%+
- **유지보수성**: 모듈화된 구조, 문서화 완료

### 사용자 경험 달성
- **직관성**: 3번의 탭으로 모든 기능 접근
- **반응성**: 300ms 이내 모든 상호작용 피드백
- **접근성**: WCAG 2.1 AA 수준 준수
- **안정성**: 크래시율 0.1% 미만 달성

---

**🌟 Next Action**: 이 구조 계획을 바탕으로 실제 React Native 프로젝트 폴더 생성 및 기본 설정을 시작할 준비가 완료되었습니다!