# Tarot Timer

타로 카드 리딩을 위한 신비로운 타이머 앱입니다. 25-45세 타겟 사용자를 위한 고급스러운 디자인과 완전한 타로 데이터 시스템을 제공합니다.

## 주요 기능

### 🕐 24시간 타로 타이머
- 하루 단위로 리셋되는 타로 타이머
- 매일 새로운 데일리 타로 카드 제공
- 읽기 완료 시 저널 자동 저장

### 🃏 스프레드 시스템
- **3장 카드**: 과거/현재/미래 스프레드
- **4장 카드**: 상황/감정/조언/결과 스프레드
- **5장 카드**: 역V자 형태의 복합 스프레드
- **A/B 선택**: 두 가지 선택지 비교 (7장)
- **관계 스프레드**: 복잡한 관계 분석 (11장)
- **켈틱 크로스**: 전통적인 10장 스프레드

### 📖 저널 기능
- 데일리 타로 카드 기록
- 스프레드 세션 저장 및 관리
- 타로 카드별 개인적 해석 메모
- 시간순 히스토리 보기

### ⚙️ 설정 시스템
- 한국어/영어 언어 지원
- 라이트/다크 모드
- 알림 설정
- 개인화 옵션

## 기술 스택

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4.0
- **Build Tool**: Vite
- **UI Components**: Custom mystical UI + shadcn/ui
- **Icons**: Lucide React
- **Design**: Premium mystical theme with gold accents

## 타로 카드 데이터

### 메이저 아르카나 (22장)
The Fool부터 The World까지 완전한 타로 카드 데이터

### 마이너 아르카나 (56장)
- Wands (지팡이) - 14장
- Cups (컵) - 14장  
- Swords (검) - 14장
- Pentacles (펜타클) - 14장

총 78장의 타로 카드 시스템으로 완전한 타로 리딩 경험 제공

## 디자인 시스템

### 컬러 팔레트
- **Deep Purple**: #4A1A4F (주요 색상)
- **Midnight Blue**: #1A1F3A (보조 색상)
- **Premium Gold**: #D4AF37 (액센트)
- **Pure White**: #FFFFFF (베이스)

### 디자인 원칙
- **Mystical but Accessible**: 신비로우면서도 접근하기 쉬운
- **Premium Feel**: 고급스러운 느낌
- **Calming**: 차분하고 안정감 있는
- **Intuitive**: 직관적인 사용성

## 프로젝트 구조

```
├── App.tsx                 # 메인 애플리케이션
├── components/
│   ├── Timer.tsx          # 타이머 컴포넌트
│   ├── Spreads.tsx        # 스프레드 목록
│   ├── Journal.tsx        # 저널 기능
│   ├── Settings.tsx       # 설정 화면
│   ├── SpreadDetail.tsx   # 스프레드 상세 뷰
│   ├── mystical-ui/       # 커스텀 UI 컴포넌트
│   └── ui/               # shadcn/ui 컴포넌트
├── utils/
│   ├── tarot.ts          # 타로 로직
│   ├── tarot-cards.ts    # 타로 카드 데이터
│   ├── language.tsx      # 다국어 지원
│   └── webStyles.ts      # 스타일 시스템
├── assets/               # 아이콘 및 이미지
└── styles/
    └── globals.css       # 글로벌 스타일
```

## 개발 환경 설정

### 요구사항
- Node.js 18+
- npm 또는 yarn

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 빌드
npm run build

# 프리뷰
npm run preview
```

## 브라우저 지원
- Chrome 90+
- Firefox 88+  
- Safari 14+
- Edge 90+

## 라이센스
MIT License

## 기여
이슈 및 풀 리퀘스트는 언제든지 환영합니다.