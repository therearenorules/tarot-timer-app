# 실제 사용되는 파일들 분석

## App.tsx에서 직접 임포트하는 파일들
```
✅ components/Timer.tsx
✅ components/Spreads.tsx  
✅ components/Journal.tsx
✅ components/Settings.tsx
✅ components/SpreadDetail.tsx
✅ components/SavedSpreadViewer.tsx
✅ components/DailyTarotViewer.tsx
✅ components/mystical-ui/icons.tsx
✅ components/AnimationComponents.tsx
✅ utils/language.tsx
✅ utils/tarot.ts
✅ utils/webStyles.ts
```

## 간접적으로 사용되는 파일들 (다른 컴포넌트에서 임포트)

### SpreadDetail.tsx에서 사용:
✅ components/SpreadLayouts.tsx

### Journal.tsx에서 사용:
✅ components/SpreadMiniatureForJournal.tsx

### Spreads.tsx에서 사용:
✅ components/SpreadMiniature.tsx

### Settings.tsx에서 사용:
✅ components/PremiumCard.tsx

### 유틸리티 파일들:
✅ utils/tarot-cards.ts
✅ utils/tarot-data.ts
✅ utils/journal-constants.ts
✅ utils/journal-helpers.ts

### UI 라이브러리:
✅ components/mystical-ui/components.tsx
✅ components/figma/ImageWithFallback.tsx
✅ components/ui/ (shadcn 전체)

## ❌ 사용되지 않는 파일들 (제거 대상)

### 백업/중복 파일들:
❌ SpreadDetail-backup-v1.tsx
❌ SpreadDetail-fixed.tsx
❌ SpreadDetail-new.tsx
❌ SpreadDetail-updated.tsx

### 테스트/데모 파일들:
❌ AnimationExamples.tsx
❌ BaseComponentsDemo.tsx
❌ CompositeDemo.tsx
❌ TokenTest.tsx
❌ SpreadDetailScreen.tsx

### 사용되지 않는 컴포넌트들:
❌ Diary.tsx
❌ Home.tsx
❌ SacredGeometry.tsx
❌ ReactNativeComponents.tsx
❌ CSSTransitionReplacements.tsx
❌ GuidelineComponents.tsx

### 임시 파일들:
❌ cleanup-placeholder.txt
❌ temp_delete_marker.txt

## ❌ 루트의 불필요한 파일들

### 백업 파일들:
❌ App-backup-v1.tsx
❌ clean-app.tsx

### React Native 관련:
❌ TestTimer.tsx
❌ TimerScreen.tsx
❌ Navigation.tsx
❌ babel.config.js
❌ app.json

### 문서 파일들:
❌ CLAUDE_CODE_PROMPT.md
❌ CLEANUP_SUMMARY.md
❌ CONVERSION_ROADMAP.md
❌ TIMER_COMPLETE_IMPLEMENTATION.md
❌ TIMER_COMPLETE_IMPLEMENTATION_RN.md
❌ TIMER_IMPLEMENTATION_PROMPT.md
❌ TIMER_IMPLEMENTATION_PROMPT_RN.md
❌ REACT_NATIVE_*.md (전체)
❌ design-tokens.md
❌ project-export.json
❌ native-design-recommendations.md
❌ clean-project-structure.md

### 임시 파일들:
❌ temp-cleanup.txt
❌ temp-files-to-remove.txt
❌ temp-delete-commands.txt

## ❌ 불필요한 디렉토리들

### 전체 제거 대상:
❌ src/ (전체)
❌ components/base/ (전체)
❌ components/composite/ (전체)
❌ components/screen-modules/ (전체)
❌ documentation/ (전체)
❌ figma-design-specs/ (전체)
❌ guidelines/ (전체) - Guidelines.md는 루트로 이미 이동됨
❌ scripts/ (전체)

### 불필요한 유틸리티들:
❌ utils/accessibility.tsx
❌ utils/animations.tsx
❌ utils/performance.tsx
❌ utils/reactNativeStyles.ts
❌ utils/responsive.tsx
❌ utils/shadowsAndGradients.ts
❌ utils/styleHelpers.ts
❌ utils/touchStates.ts

### 백업 스타일:
❌ styles/globals-backup-v1.css

## 최종 정리 후 구조 (핵심만)

```
타로-타이머/
├── App.tsx                     ✅
├── index.html                  ✅
├── package.json                ✅
├── tsconfig.json               ✅
├── vite.config.ts              ✅
├── postcss.config.js           ✅
├── tailwind.config.js          ✅
├── .gitignore                  ✅
├── README.md                   ✅
├── Guidelines.md               ✅
├── Attributions.md             ✅
├── styles/
│   └── globals.css             ✅
├── components/
│   ├── Timer.tsx               ✅
│   ├── Spreads.tsx             ✅
│   ├── Journal.tsx             ✅
│   ├── Settings.tsx            ✅
│   ├── SpreadDetail.tsx        ✅
│   ├── SavedSpreadViewer.tsx   ✅
│   ├── DailyTarotViewer.tsx    ✅
│   ├── SpreadLayouts.tsx       ✅
│   ├── SpreadMiniature.tsx     ✅
│   ├── SpreadMiniatureForJournal.tsx ✅
│   ├── PremiumCard.tsx         ✅
│   ├── AnimationComponents.tsx ✅
│   ├── mystical-ui/
│   │   ├── icons.tsx           ✅
│   │   └── components.tsx      ✅
│   ├── figma/
│   │   └── ImageWithFallback.tsx ✅
│   └── ui/                     ✅ (shadcn 전체)
├── utils/
│   ├── language.tsx            ✅
│   ├── tarot.ts                ✅
│   ├── tarot-cards.ts          ✅
│   ├── tarot-data.ts           ✅
│   ├── webStyles.ts            ✅
│   ├── journal-constants.ts    ✅
│   └── journal-helpers.ts      ✅
└── assets/
    ├── icons/                  ✅ (21개)
    └── images/                 ✅ (10개)
```

이 구조로 정리하면 모든 기능은 그대로 유지하면서 파일 수를 120+개에서 약 60개로 줄일 수 있습니다.