# 🔮 Tarot Timer App

시간별 타로 카드와 함께하는 의미있는 하루

## 🚀 빠른 시작

### 개발 환경 실행
```bash
# 프로젝트 디렉토리로 이동
cd /Users/threebooks/tarot-timer-app/tarot-timer-app

# 패키지 설치 및 타입 체크
npm install && npm run typecheck

# 웹 개발 서버 실행
npm run web

# 모바일 개발 서버 (새 터미널)
npm start
```

### HTML 디자인 참고
```bash
# HTML 데모 파일 브라우저에서 열기
open "figma UI/full-app-demo.html"
```

## 📋 현재 개발 상황

### ✅ 완료된 것들
- React Native + Expo 앱 구조
- 핵심 기능 stores (zustand)
- 타로 카드 데이터 & 로직
- 데이터베이스 연동 (SQLite)
- 완성된 HTML UI 디자인

### 🔄 진행 중
**하이브리드 접근법 개발 전략**
- HTML 디자인 100% 보존
- React Native 점진적 전환
- 5-6주 개발 계획

## 📚 주요 문서

### 개발 계획서
```bash
# 상세 개발 계획 확인
cat HYBRID_DEVELOPMENT_PLAN.md
```

### 작업 기록
```bash
# 최근 작업 로그 확인
ls -la WORK_LOG_*.md | tail -1
cat WORK_LOG_2025_01_07.md
```

## 🛠️ 프로젝트 구조

```
src/
├── app/(tabs)/          # 메인 화면들
│   ├── index.tsx       # 홈 (타이머)
│   ├── spreads.tsx     # 스프레드
│   ├── diary.tsx       # 일기
│   └── settings.tsx    # 설정
├── components/         # 공통 컴포넌트
├── stores/            # 상태 관리 (Zustand)
├── services/          # 비즈니스 로직
└── types/            # TypeScript 타입

figma UI/
└── full-app-demo.html # 완성된 HTML UI 디자인
```

## 📱 개발 명령어

### 개발 서버
```bash
npm start          # Expo 개발 서버
npm run web       # 웹 개발 서버
npm run ios       # iOS 시뮬레이터
npm run android   # Android 에뮬레이터
```

### 빌드 & 배포
```bash
npm run typecheck # TypeScript 검사
expo build:ios    # iOS 빌드
expo build:android # Android 빌드
```

### 유틸리티
```bash
npm run clean     # 의존성 재설치
npm run prebuild  # 네이티브 코드 재생성
```

## 🎯 다음 작업 계획

### Phase 1: HTML → React Native Web 변환 (1-2주)
- HTML 구조 분석 및 컴포넌트화
- CSS → StyleSheet 변환
- 웹 환경에서 완전 재현

### Phase 2: 백엔드 연동 (3주)
- 기존 Store들과 연결
- 핵심 기능 통합 테스트
- 웹에서 완전 동작 확인

### Phase 3: 네이티브 전환 (4-5주)
- 컴포넌트별 네이티브화
- 모바일 최적화
- 네이티브 기능 추가

### Phase 4: 배포 준비 (6주)
- 앱스토어 빌드
- 최종 테스트
- 배포 완료

## ⚡ 작업 재시작 가이드

### 1. 환경 확인
```bash
# 프로젝트 상태 체크
git status && git log --oneline -3

# 패키지 및 타입 체크
npm install && npm run typecheck
```

### 2. 개발 계획 확인
```bash
# 현재 계획 및 진행상황 확인
cat HYBRID_DEVELOPMENT_PLAN.md | head -20
cat WORK_LOG_2025_01_07.md
```

### 3. 개발 서버 실행
```bash
# HTML 디자인 확인
open "figma UI/full-app-demo.html"

# 웹 개발 서버 시작
npm run web
```

## 🔧 문제 해결

### 자주 발생하는 이슈
1. **패키지 설치 오류**: `npm run clean` 실행
2. **타입스크립트 오류**: `npm run typecheck` 확인
3. **서버 실행 안됨**: 포트 확인 후 재시작
4. **캐시 문제**: `expo start --clear` 실행

### 도움이 필요한 경우
- `HYBRID_DEVELOPMENT_PLAN.md`: 상세 개발 가이드
- `WORK_LOG_*.md`: 작업 기록 및 해결 방법
- Git 커밋 히스토리: 변경 사항 추적

## 📞 연락처 & 리소스

- **GitHub Repository**: [tarot-timer-app](https://github.com/therearenorules/tarot-timer-app)
- **개발자**: therearenorules
- **최근 업데이트**: 2025년 1월 7일

---

**🎯 목표: HTML의 완벽한 디자인을 유지하면서 React Native의 모든 네이티브 기능을 활용하는 프로덕션 앱 완성**

**💝 하이브리드 접근법으로 디자인과 기능을 모두 완벽하게 구현합니다!**