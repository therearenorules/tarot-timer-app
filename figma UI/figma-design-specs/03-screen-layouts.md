# 타로 타이머 앱 - 화면 레이아웃 스펙

## 📱 기본 화면 구조

### Screen Template (화면 템플릿)
```
• 디바이스: iPhone 12 Pro (390x844)
• 안전 영역: 상단 47px, 하단 34px
• 콘텐츠 영역: 390x763
• 네비게이션 제외: 390x683
• 스크롤 영역: 390x603 (하단 네비 80px 제외)
```

### Container System (컨테이너 시스템)
```
• 최대 너비: 375px (중앙 정렬)
• 사이드 패딩: 16px
• 콘텐츠 너비: 343px
• 섹션 간격: 24px
• 카드 간격: 16px
```

## 🕐 Timer 화면 레이아웃

### Header Section (헤더 영역)
```
높이: 120px
위치: 상단 고정
구성:
- Mystical Icon (48x48px) + 글로우 효과
- 앱 타이틀: "오늘의 타로 타이머" (Display Medium)
- 날짜: "2024년 1월 15일 월요일" (Body Small)
- 현재 시간: "오후 3시" (Display Large) - 카드 뽑은 후만
```

### Main Card Section (메인 카드 영역)
```
높이: 가변 (카드 있을 때 480px)
구성:
- 카드 이미지: 200x300px (중앙 정렬)
- 카드 제목: Title Large
- 카드 키워드: Badge 나열 (가로 wrap)
- 카드 의미: Body Medium (최대 3줄)
- 현재 시간 Badge (우상단)
```

### 24-Hour Cards Scroll (24시간 카드 스크롤)
```
높이: 120px
구성:
- 섹션 제목: "24시간 에너지 흐름" + 다시뽑기 버튼
- 카드 스크롤: 가로 스크롤 (50x75px 카드들)
- 현재 시간 하이라이트: 골드 링
- 좌우 그라데이션 페이드
```

### Journal Section (저널 영역)
```
높이: 240px
구성:
- 섹션 제목: "신성한 일기" + 시간 Badge
- 텍스트 에리어: 120px 높이
- 글자수 카운터: "0/500 글자"
- 저장 버튼: Premium Button 스타일
```

### Draw Cards Section (카드 뽑기 영역)
```
높이: 200px (카드 뽑기 전에만 표시)
구성:
- 중앙 아이콘: Zap (48x48px) + 펄스 애니메이션
- 제목: "운명을 펼쳐보세요" (Title Large)
- 설명: Body Medium (2줄)
- 뽑기 버튼: Premium Button (전체 너비)
```

### Bottom Padding
```
높이: 100px (네비게이션 + 추가 여백)
```

## 🎯 Spreads 화면 레이아웃

### Header Section (헤더 영역)
```
높이: 120px
구성:
- Layout Icon (48x48px) + 글로우 효과
- 앱 타이틀: "타로 스프레드" (Display Medium)
- 부제목: "운명의 패턴을 선택하세요" (Body Small)
```

### Spread Cards List (스프레드 카드 리스트)
```
카드 높이: 180px
카드 간격: 16px
구성:
- 아이콘 + 제목 + Premium Badge
- 영어/한국어 제목
- 설명 텍스트 박스
- 시작하기 버튼 (전체 너비)
- Hover 효과: 골드 글로우
```

### Premium Highlight (프리미엄 하이라이트)
```
높이: 160px
구성:
- Crown Icon (48x48px) + 펄스 애니메이션
- 제목: "프리미엄 스프레드" (Title Large)
- 설명: Body Medium
- Premium Badge
```

## 🎴 Spread Detail 화면 레이아웃

### Header Bar (헤더 바)
```
높이: 56px
구성:
- 뒤로가기 버튼 (44x44px)
- 스프레드 이름: Title Medium
- Premium Badge (해당하는 경우)
```

### Title Input Section (제목 입력 영역)
```
높이: 80px
구성:
- 입력 필드 또는 제목 표시
- 편집 버튼 (Star Icon)
- 안내 텍스트
```

### Main Spread Area (메인 스프레드 영역)
```
높이: 가변 (최소 400px)
구성:
- 진행률 표시 (좌상단)
- 카드 배치 영역 (스프레드별 고유 레이아웃)
- 가이드라인 (골드 색상)

Celtic Cross:
- 전체 크기: 350x350px
- 중앙 십자가: 5장
- 오른쪽 스태프: 4장
- 위치별 라벨

Three Card:
- 가로 배치: 3장
- 카드 간격: 20px
- 하단 라벨

AB Choice:
- A 그룹: 3장 (왼쪽)
- 중앙 조언: 1장
- B 그룹: 3장 (오른쪽)
- 그룹 경계선

Relationship:
- 컵 모양: 11장 배치
- 연결선 표시
- 작은 카드 크기 (50x75px)
```

### Bottom Action Bar (하단 액션 바)
```
높이: 140px + 80px (네비게이션)
구성:
- 전체 카드 뽑기 버튼 (전체 너비, Premium 스타일)
- 액션 버튼 그리드 (2열):
  - 다시 뽑기 (Secondary)
  - 스프레드 저장 (Success)
- 네비게이션을 위한 하단 패딩
```

## 📚 Journal 화면 레이아웃

### Header Section (헤더 영역)
```
높이: 120px
구성:
- BookOpen Icon (48x48px) + 글로우 효과
- 앱 타이틀: "신성한 일기" (Display Medium)
- 부제목: "당신의 타로 여정" (Body Small)
```

### Section Toggle (섹션 토글)
```
높이: 56px
구성:
- 토글 컨테이너: 라운드 배경
- 일일 타로 탭
- 스프레드 기록 탭
- 활성 탭: 골드 배경
```

### Section Header (섹션 헤더)
```
높이: 60px
구성:
- 섹션 제목 + 아이콘
- 기록 개수 Badge
```

### Daily Tarot List (일일 타로 리스트)
```
아이템 높이: 200px
구성:
- 날짜 헤더 + 저장됨 Badge
- 카드 미리보기 (8장, 32x48px)
- 인사이트 텍스트 박스
- 메모 개수 표시 + 보기 버튼
```

### Spread Records List (스프레드 기록 리스트)
```
아이템 높이: 240px
구성:
- 제목 + 날짜 헤더 + 저장됨 Badge
- 스프레드 미니어처 (중앙)
- 스프레드 타입 Badge
- 인사이트 텍스트 박스
- 보기 버튼 (전체 너비)
```

### Empty State (빈 상태)
```
높이: 200px
구성:
- 중앙 아이콘 (48x48px, 50% 투명도)
- 제목: Title Small
- 설명: Body Medium
- 안내 텍스트
```

## ⚙️ Settings 화면 레이아웃

### Header Section (헤더 영역)
```
높이: 120px
구성:
- Settings Icon (48x48px) + 글로우 효과
- 앱 타이틀: "설정" (Display Medium)
- 부제목: "개인화 및 환경설정" (Body Small)
```

### Premium Section (프리미엄 섹션)
```
높이: 160px
구성:
- Crown Icon + 제목 + Active Badge
- 기능 목록 (3개 항목)
- 관리 버튼 (전체 너비)
- 골드 테두리
```

### Settings Groups (설정 그룹들)
```
그룹당 높이: 가변
구성:
- 그룹 제목 + 아이콘
- 설정 항목들:
  - 텍스트 + 설명
  - Switch 또는 Button
  - 하단 구분선

그룹 종류:
1. 디스플레이 & 테마 (2항목)
2. 알림 (1항목)
3. 사운드 & 햅틱 (2항목)
4. 개인정보 & 보안 (2항목)
5. 지원 & 정보 (2항목)
```

### Version Info (버전 정보)
```
높이: 80px
구성:
- 버전 텍스트 (중앙 정렬)
- 저작권 텍스트 (중앙 정렬)
- 작은 폰트, 낮은 투명도
```

## 🎴 Card Modal 레이아웃

### Modal Container (모달 컨테이너)
```
크기: 최대 너비 400px
배경: 블러 오버레이
구성:
- 카드 제목 + 위치 정보
- 카드 이미지 (200x300px)
- 키워드 Badge 그리드
- 의미 설명 텍스트
- 닫기 영역 (모달 외부)
```

## 📐 반응형 고려사항

### iPhone SE (320px)
```
• 카드 크기: 15% 축소
• 마진: 12px로 축소
• 폰트 크기: 유지 (가독성)
• 버튼 높이: 유지 (터치 타겟)
```

### iPhone Plus (414px)
```
• 최대 너비: 375px 유지
• 중앙 정렬: 좌우 여백 증가
• 카드 크기: 유지
• 레이아웃: 기본과 동일
```

### iPad (768px+)
```
• 최대 너비: 500px
• 카드 크기: 20% 확대
• 2열 레이아웃: 일부 섹션
• 사이드바: 네비게이션 변경 고려
```

## 🎨 특수 레이아웃

### Loading States (로딩 상태)
```
• 스켈레톤: 실제 컴포넌트 크기와 동일
• 스피너: 중앙 정렬, 24px 크기
• 진행 바: 상단 고정, 4px 높이
• 오버레이: 반투명 배경 + 중앙 스피너
```

### Error States (오류 상태)
```
• 아이콘: 48px, 중앙 정렬
• 제목: Title Medium
• 설명: Body Medium, 최대 2줄
• 재시도 버튼: Secondary 스타일
• 전체 높이: 200px
```

### Animation Zones (애니메이션 영역)
```
• 카드 뒤집기: 300ms perspective transform
• 페이지 전환: 500ms slide transition
• 버튼 누름: 150ms scale + haptic
• 모달 등장: 300ms slide-up + fade
• 스크롤 효과: 패럴랙스 + blur 변화
```

이 레이아웃 스펙을 기반으로 Figma에서 모든 화면을 정확히 구현할 수 있습니다!