# 🎯 하이브리드 접근법 개발 계획

## 📅 작성일: 2025-01-07
## 🎨 전략: HTML 디자인 100% 보존 + React Native 점진적 전환

---

## 🎯 **개발 전략 개요**

### **핵심 컨셉**
- **HTML UI를 React Native Web으로 변환** → 디자인 100% 보존
- **기존 백엔드 로직 그대로 활용** → 개발 시간 단축
- **점진적 네이티브화** → 안전한 전환

### **예상 일정: 5-6주**
- 1-2주: HTML → React Native Web 변환
- 3주: 백엔드 연동 및 테스트
- 4-5주: 네이티브 컴포넌트 전환
- 6주: 모바일 최적화 및 배포

---

## 📋 **Phase별 상세 계획**

### **Phase 1: HTML → React Native Web 변환 (1-2주)**

#### **1.1 프로젝트 설정**
```bash
# React Native Web 의존성 추가 (이미 설치됨)
npm install react-native-web

# 웹 개발 도구 설정
npm run web
```

#### **1.2 HTML 구조 분석 및 변환**
```typescript
변환 대상: figma UI/full-app-demo.html

주요 섹션:
1. 홈 섹션 (24시간 타로 타이머)
2. 스프레드 섹션 (타로 스프레드 선택/진행)  
3. 일기 섹션 (과거 리딩 기록)
4. 설정 섹션 (덱 관리, 구독)

핵심 컴포넌트:
- TarotCard (다양한 크기/상태)
- TimeDisplay (현재 시간 표시)
- SpreadLayout (카드 배치)
- TabNavigation (하단 탭)
- MemoPad (메모 입력)
- CardPopup (카드 상세 팝업)
```

#### **1.3 CSS → StyleSheet 변환**
```typescript
우선순위 1: 디자인 토큰 추출
- 색상 팔레트 (그라디언트 포함)
- 타이포그래피 시스템
- 간격 시스템
- 애니메이션 키프레임

우선순위 2: 레이아웃 시스템
- Flexbox 레이아웃
- Grid 시스템 (RN 호환)
- 카드 스타일
- 반응형 크기
```

### **Phase 2: 백엔드 연동 (3주)**

#### **2.1 기존 Store 연결**
```typescript
연결할 주요 Store들:
- dailyTarotStore: 시간별 카드 생성/관리
- spreadStore: 스프레드 진행/저장
- diaryStore: 과거 기록 조회
- settingsStore: 앱 설정 관리
- deckStore: 카드 덱 관리

연동 방식:
- HTML 이벤트 → React Native 이벤트
- localStorage → AsyncStorage/MMKV
- fetch API → 기존 서비스 레이어 활용
```

#### **2.2 핵심 기능 연동**
```typescript
1. 홈 화면 연동:
   - 현재 시간 카드 표시
   - 24시간 스크롤 뷰
   - 메모 작성/저장

2. 스프레드 화면 연동:
   - 스프레드 선택
   - 카드 뽑기 애니메이션
   - 결과 저장

3. 일기 화면 연동:
   - 날짜별 기록 조회
   - 상세 모달
   - 이미지 캡처

4. 설정 화면 연동:
   - 덱 관리
   - 구독 상태
   - 알림 설정
```

#### **2.3 웹 환경 테스트**
```bash
# 웹에서 전체 기능 테스트
npm run web

# 주요 테스트 항목:
- 카드 생성 및 표시
- 스프레드 전체 플로우
- 데이터 저장/불러오기
- 디자인 일관성
```

### **Phase 3: 점진적 네이티브화 (4-5주)**

#### **3.1 컴포넌트별 네이티브 전환**
```typescript
전환 우선순위:
1. 기본 컴포넌트 (Text, View, TouchableOpacity)
2. 네비게이션 (React Navigation)
3. 카드 컴포넌트 (이미지, 애니메이션)
4. 복잡한 레이아웃 (Grid, Scroll)
5. 고급 애니메이션 (Reanimated)

네이티브 기능 추가:
- 푸시 알림 (expo-notifications)
- 위젯 (expo-widget)  
- 파일 시스템 (expo-file-system)
- 공유 기능 (expo-sharing)
```

#### **3.2 모바일 최적화**
```typescript
최적화 항목:
- 터치 인터랙션 개선
- 스크롤 성능 최적화
- 이미지 로딩 최적화
- 메모리 사용량 개선
- 배터리 효율성
```

### **Phase 4: 배포 준비 (6주)**

#### **4.1 앱 빌드 및 테스트**
```bash
# iOS 빌드
npm run ios

# Android 빌드  
npm run android

# 프로덕션 빌드
expo build:ios
expo build:android
```

#### **4.2 앱스토어 준비**
- 앱 아이콘, 스플래시 스크린
- 스크린샷, 앱 설명
- 개인정보 처리방침
- 앱 심사 준비

---

## 🛠️ **개발 환경 설정**

### **필요 도구**
```bash
# 이미 설치된 도구들 확인
node --version  # Node.js
npm --version   # npm
expo --version  # Expo CLI

# React Native Web 설정 확인
cat package.json | grep "react-native-web"
```

### **개발 서버 실행**
```bash
# 웹 개발 서버 (디자인 확인용)
npm run web

# 모바일 개발 서버
npm start

# iOS 시뮬레이터
npm run ios

# Android 에뮬레이터
npm run android
```

---

## 📁 **프로젝트 구조 계획**

### **새로 생성할 폴더/파일**
```
src/
├── web/                    # 웹 전용 컴포넌트
│   ├── layouts/           # HTML 레이아웃 변환
│   ├── styles/            # CSS → StyleSheet 변환
│   └── components/        # 웹 최적화 컴포넌트
│
├── native/                 # 네이티브 전용 컴포넌트
│   ├── animations/        # 네이티브 애니메이션
│   ├── widgets/          # 위젯 컴포넌트
│   └── notifications/     # 푸시 알림
│
└── shared/                 # 공통 컴포넌트
    ├── TarotCard/         # 핵심 타로 카드
    ├── TimeDisplay/       # 시간 표시
    └── SpreadLayout/      # 스프레드 레이아웃
```

---

## 🚀 **시작 명령어 가이드**

### **프로젝트 재개할 때 실행할 명령어**

#### **1. 프로젝트 상태 확인**
```bash
# 프로젝트 디렉토리로 이동
cd /Users/threebooks/tarot-timer-app/tarot-timer-app

# Git 상태 확인
git status
git log --oneline -5

# 패키지 설치 확인
npm install

# 타입스크립트 오류 확인
npm run typecheck
```

#### **2. 현재 진행 상황 확인**
```bash
# 개발 계획 문서 읽기
cat HYBRID_DEVELOPMENT_PLAN.md

# 작업 로그 확인
ls -la WORK_LOG_*.md
cat WORK_LOG_$(date +%Y_%m_%d).md 2>/dev/null || echo "오늘 로그 없음"

# HTML 데모 파일 확인
ls -la "figma UI/"
open "figma UI/full-app-demo.html"  # 브라우저에서 열기
```

#### **3. 개발 서버 실행**
```bash
# 웹 버전 실행 (디자인 참고용)
npm run web

# 새 터미널에서 모바일 개발 서버
npm start

# iOS 시뮬레이터 (Mac에서만)
npm run ios

# Android 에뮬레이터
npm run android
```

#### **4. 현재 작업 상태 파악**
```bash
# 최근 수정된 파일들 확인
find src -name "*.tsx" -newermt "1 week ago" -ls

# 현재 브랜치 및 커밋 확인
git branch -v
git diff HEAD~1 --name-only

# 패키지 의존성 확인
npm list --depth=0
```

---

## 📝 **작업 기록 템플릿**

### **매일 작업 시작할 때 기록할 내용**
```markdown
# 작업 기록 - YYYY-MM-DD

## 📋 오늘의 목표
- [ ] 구체적인 작업 1
- [ ] 구체적인 작업 2  
- [ ] 구체적인 작업 3

## 🔧 수행한 작업
1. 작업 내용 상세 기록
2. 변경된 파일들
3. 해결한 문제들

## 🐛 발견한 이슈
- 이슈 1: 문제 설명 및 해결 방안
- 이슈 2: 문제 설명 및 해결 방안

## 📚 다음 작업 계획
- [ ] 내일 할 작업 1
- [ ] 내일 할 작업 2

## 💡 메모
- 중요한 발견사항
- 참고 링크
- 아이디어
```

---

## 🎯 **핵심 성공 지표**

### **Phase 1 완료 기준**
- [ ] HTML의 모든 UI가 React Native Web에서 정확히 표시됨
- [ ] 웹에서 모든 인터랙션이 작동함
- [ ] 디자인 일치도 95% 이상

### **Phase 2 완료 기준**  
- [ ] 모든 기존 기능이 웹에서 정상 작동
- [ ] 데이터 저장/불러오기 정상
- [ ] 24시간 타로 시스템 완전 작동

### **Phase 3 완료 기준**
- [ ] iOS/Android에서 앱 실행
- [ ] 네이티브 기능 정상 작동
- [ ] 성능 최적화 완료

### **Phase 4 완료 기준**
- [ ] 앱스토어 배포 준비 완료
- [ ] 모든 테스트 통과
- [ ] 사용자 테스트 완료

---

## 📞 **문제 해결 가이드**

### **자주 발생할 수 있는 문제들**

#### **1. CSS → StyleSheet 변환 문제**
```bash
# 문제: CSS 스타일이 React Native에서 다르게 보임
# 해결: 웹과 네이티브용 조건부 스타일링

# 참고 파일: src/constants/theme.ts
# 웹용 스타일: src/web/styles/
# 네이티브용 스타일: src/native/styles/
```

#### **2. 애니메이션 호환성 문제**
```bash
# 문제: CSS 애니메이션이 React Native에서 작동 안함
# 해결: react-native-reanimated로 재구현

# 참고: HTML의 @keyframes → Reanimated.withTiming()
```

#### **3. 레이아웃 차이 문제**
```bash
# 문제: Flexbox 동작이 웹과 네이티브에서 다름
# 해결: Platform.select()로 플랫폼별 스타일

# 예시:
# paddingTop: Platform.select({
#   web: 20,
#   ios: 40,
#   android: 30
# })
```

---

## 🔄 **재시작 체크리스트**

### **작업 재개 시 반드시 확인할 것들**

#### **✅ 환경 설정 확인**
- [ ] Node.js 버전 호환성
- [ ] npm 패키지 설치 상태  
- [ ] 개발 서버 정상 실행
- [ ] Git 상태 정상

#### **✅ 프로젝트 상태 확인**  
- [ ] 최신 커밋 확인
- [ ] 작업 중이던 브랜치 확인
- [ ] 미완료 작업 파악
- [ ] 테스트 상태 확인

#### **✅ 개발 계획 리뷰**
- [ ] 현재 Phase 파악
- [ ] 다음 작업 우선순위 확인
- [ ] 일정 재검토
- [ ] 이슈 목록 검토

---

## 📱 **빠른 시작 명령어 모음**

```bash
# ⚡ 원클릭 개발 환경 시작
cd /Users/threebooks/tarot-timer-app/tarot-timer-app && \
npm install && \
npm run typecheck && \
npm run web

# ⚡ 현재 상태 빠른 체크
git status && git log --oneline -3 && \
ls -la WORK_LOG_*.md | tail -1

# ⚡ HTML 디자인 참고 열기
open "figma UI/full-app-demo.html"

# ⚡ 개발 계획 재확인
cat HYBRID_DEVELOPMENT_PLAN.md | grep -A 5 "Phase"
```

---

## 🏆 **최종 목표 재확인**

**목표**: HTML의 완벽한 디자인을 유지하면서 React Native의 모든 네이티브 기능을 활용하는 프로덕션 앱 완성

**성공 기준**:
- ✅ 디자인 일치도 95% 이상
- ✅ 모든 기존 기능 정상 작동  
- ✅ iOS/Android 앱스토어 배포 가능
- ✅ 네이티브 기능 완전 활용

**예상 완료일**: 2025년 2월 중순

---

**💝 이 계획서를 통해 언제든지 작업을 재개하고 이어갈 수 있습니다!**