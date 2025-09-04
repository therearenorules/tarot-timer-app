# 📚 타로 타이머 프로젝트 문서

> React Native + Expo 기반 신비로운 타로 타이머 앱의 종합 문서 가이드

## 🎯 문서 구조

### 📋 핵심 문서들
- **[개발 원칙](./DEVELOPMENT_PRINCIPLES.md)** - UI 우선, TypeScript 우수성, 컴포넌트 재사용성 등 5대 핵심 원칙
- **[프로젝트 구조 계획](./PROJECT_STRUCTURE_PLAN.md)** - 상세한 폴더 구조와 마이그레이션 전략
- **[아키텍처 가이드](./api/ARCHITECTURE.md)** - 시스템 아키텍처와 기술 결정사항
- **[컴포넌트 가이드](./components/COMPONENT_GUIDE.md)** - 디자인 시스템과 컴포넌트 사용법

### 📱 구현 가이드들
- **[화면별 구현 가이드](./guides/SCREEN_IMPLEMENTATION.md)** - TimerScreen, SpreadsScreen 등 구현 방법
- **[상태 관리 가이드](./guides/STATE_MANAGEMENT.md)** - Zustand 기반 상태 관리 패턴
- **[애니메이션 가이드](./guides/ANIMATION_GUIDE.md)** - React Native Reanimated 사용법
- **[국제화 가이드](./guides/I18N_GUIDE.md)** - 다국어 지원 구현

### 🔧 API 문서들
- **[타로 API](./api/TAROT_API.md)** - 타로 카드 생성 및 관리 API
- **[사용자 API](./api/USER_API.md)** - 사용자 관련 API 엔드포인트
- **[저널 API](./api/JOURNAL_API.md)** - 저널 및 리딩 기록 API

---

## 🚀 빠른 시작

### 1. 개발 환경 설정
```bash
# 프로젝트 클론 후
cd tarot-timer-app

# 의존성 설치
npm install

# 프로젝트 구조 초기화
node scripts/setup-project.js

# 개발 서버 시작
npm start
```

### 2. 개발 워크플로우
1. **[개발 원칙](./DEVELOPMENT_PRINCIPLES.md)** 숙지
2. **UI 우선** - 디자인 시스템으로 UI 컴포넌트 구현
3. **점진적 기능 추가** - Mock 데이터로 시작해서 실제 로직으로 발전
4. **TypeScript 엄격 모드** - 모든 타입 정의 및 검증

### 3. 컴포넌트 생성
```bash
# 새 컴포넌트 생성
node scripts/dev-tools.js component TarotCard composite

# 새 화면 생성  
node scripts/dev-tools.js screen Timer

# 새 훅 생성
node scripts/dev-tools.js hook useTimer common

# 프로젝트 통계
node scripts/dev-tools.js stats
```

---

## 📖 문서별 상세 안내

### 🎨 디자인 & UI 문서
| 문서 | 설명 | 주요 내용 |
|------|------|-----------|
| [개발 원칙](./DEVELOPMENT_PRINCIPLES.md) | 5대 핵심 개발 철학 | UI 우선, TypeScript, 재사용성, 호환성, 성능 |
| [컴포넌트 가이드](./components/) | 디자인 시스템 사용법 | Atomic Design, 토큰 시스템, 변형 패턴 |
| [애니메이션 가이드](./guides/ANIMATION_GUIDE.md) | Reanimated 패턴 | 타로 카드 플립, 신비로운 효과, 전환 애니메이션 |

### 🏗 아키텍처 문서
| 문서 | 설명 | 주요 내용 |
|------|------|-----------|
| [프로젝트 구조](./PROJECT_STRUCTURE_PLAN.md) | 폴더 구조와 조직 | 6단계 마이그레이션 계획, 체크리스트 |
| [API 아키텍처](./api/ARCHITECTURE.md) | 시스템 설계 | 마이크로서비스, 상태 관리, 데이터 플로우 |
| [상태 관리](./guides/STATE_MANAGEMENT.md) | Zustand 패턴 | 슬라이스 구조, 미들웨어, 영속화 |

### 🔧 구현 문서
| 문서 | 설명 | 주요 내용 |
|------|------|-----------|
| [화면 구현](./guides/SCREEN_IMPLEMENTATION.md) | 화면별 개발 가이드 | TimerScreen, SpreadsScreen, JournalScreen, SettingsScreen |
| [타로 API](./api/TAROT_API.md) | 타로 로직 API | 카드 생성 알고리즘, 스프레드 관리, 일일 카드 시스템 |
| [국제화](./guides/I18N_GUIDE.md) | 다국어 지원 | 한/영 번역, 컨텍스트 시스템, 지역화 |

---

## 🎯 개발 체크리스트

### ✅ 기초 설정
- [ ] 프로젝트 구조 생성 완료
- [ ] TypeScript 엄격 모드 설정
- [ ] Design System 통합
- [ ] Expo Router 라우팅 설정
- [ ] Zustand 상태 관리 구축

### ✅ 컴포넌트 개발
- [ ] Base 컴포넌트 (Button, Card, Text, Icon)
- [ ] Composite 컴포넌트 (TarotCard, TimerDisplay)
- [ ] Layout 컴포넌트 (SafeArea, Modal, Navigation)
- [ ] Form 컴포넌트 (Input, Switch, DatePicker)

### ✅ 화면 구현
- [ ] TimerScreen - 24시간 타로 시스템
- [ ] SpreadsScreen - 6개 스프레드 타입
- [ ] JournalScreen - 저널링 시스템  
- [ ] SettingsScreen - 앱 설정

### ✅ 기능 구현
- [ ] 타로 카드 생성 알고리즘
- [ ] 스프레드 레이아웃 시스템
- [ ] 저널 저장/로드 기능
- [ ] 다국어 번역 시스템
- [ ] 애니메이션 효과

### ✅ 품질 보증
- [ ] TypeScript 100% 커버리지
- [ ] 컴포넌트 테스트 작성
- [ ] 크로스 플랫폼 호환성 검증
- [ ] 성능 프로파일링
- [ ] 접근성 검증

---

## 🔍 참고 자료

### 📚 기술 스택 문서
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### 🎨 디자인 레퍼런스
- [figma UI/assets/design-reference/](../figma%20UI/assets/design-reference/) - 원본 디자인 파일들
- [design-system/](../design-system/) - 구현된 디자인 시스템
- [Material Design 3](https://m3.material.io/) - 접근성 가이드라인

### 🔮 도메인 지식
- [타로 카드 의미](https://en.wikipedia.org/wiki/Tarot_card_meanings)
- [타로 스프레드 가이드](https://labyrinthos.co/blogs/tarot-card-meanings-list/tarot-spreads-guide)
- [신비주의 UI 패턴](https://dribbble.com/tags/mystical)

---

## 💡 개발 팁

### 🚀 생산성 향상
1. **개발 도구 활용**: `scripts/dev-tools.js`로 컴포넌트/화면 자동 생성
2. **타입 먼저 정의**: 인터페이스를 먼저 설계한 후 구현
3. **Mock 데이터 사용**: UI 완성 후 실제 로직으로 교체
4. **Hot Reload**: Expo의 Fast Refresh로 빠른 반복 개발

### 🐛 디버깅 가이드
1. **React Native Debugger** 사용 권장
2. **Flipper** 네트워크/데이터 디버깅
3. **Reactotron** 상태 관리 디버깅
4. **Console.log** 대신 `__DEV__` 조건부 로깅

### ✨ 성능 최적화
1. **React.memo** 불필요한 리렌더링 방지
2. **useCallback/useMemo** 적절히 활용  
3. **Reanimated** UI 스레드에서 애니메이션 실행
4. **Image Optimization** 적절한 크기와 형식 사용

---

**🌟 Happy Coding!** 신비로운 타로 타이머 앱 개발을 즐겨보세요! ✨