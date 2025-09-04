# 타로 타이머 앱 - 클로드코드 완전 적용 가이드

이 프롬프트는 완성된 타로 타이머 앱을 클로드코드에서 정확히 재현하기 위한 모든 지시사항을 포함합니다.

## 🎯 프로젝트 개요

**앱 이름**: 타로 타이머 (Tarot Timer)  
**타겟**: 25-45세 타로에 관심 있는 사용자  
**플랫폼**: 모바일 우선 반응형 웹 앱  
**언어**: 한국어/영어 지원  

### 핵심 기능
1. **Timer**: 24시간 타로 타이머 (매 시간마다 카드 뽑기)
2. **Spreads**: 다양한 타로 스프레드 시스템  
3. **Journal**: 일기 및 리딩 기록 저장
4. **Settings**: 언어 설정, 프리미엄 관리

---

## 🎨 브랜드 & 디자인 시스템

### 브랜드 아이덴티티
- **Mystical but Accessible**: 신비롭지만 접근하기 쉬운
- **Premium Feel**: 고급스럽고 세련된 느낌
- **Trustworthy**: 신뢰할 수 있는 디자인
- **Calming**: 평온하고 차분한 분위기
- **Intuitive**: 직관적인 사용성

### 색상 시스템
```css
/* 주요 브랜드 컬러 */
--deep-purple: #4A1A4F      /* 메인 퍼플 */
--midnight-blue: #1A1F3A    /* 다크 블루 */
--premium-gold: #D4AF37     /* 골드 액센트 */
--bright-gold: #F4D03F      /* 밝은 골드 (다크모드) */
--white: #FFFFFF            /* 기본 흰색 */

/* 라이트 모드 */
--background: #FFFFFF
--foreground: #1A1F3A
--text-secondary: #4A1A4F
--accent: #D4AF37

/* 다크 모드 (항상 활성화) */
--background: #0F0F1A
--foreground: #FFFFFF
--card-bg: #1A1F3A
--accent: #F4D03F
```

### 타이포그래피
- **주 폰트**: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans"
- **크기**: 기본 14px 베이스, 반응형 스케일링
- **무게**: Regular(400), Medium(500), Semi-bold(600), Bold(700)

### 스페이싱 시스템
8pt 기반 그리드 시스템:
- XXS: 2px, XS: 4px, S: 8px, M: 16px, L: 24px, XL: 32px, XXL: 40px

---

## 🏗️ 필수 설정

### 1. Tailwind CSS 설정
```css
/* globals.css에 다음 내용을 정확히 복사 */
@custom-variant dark (&:is(.dark *));

:root {
  --font-size: 14px;
  
  /* Light Mode Color Tokens */
  --background: #ffffff;
  --foreground: #1a1f3a;
  --card: #ffffff;
  --card-foreground: #1a1f3a;
  --primary: #4a1a4f;
  --primary-foreground: #ffffff;
  --secondary: #fafafa;
  --secondary-foreground: #4a1a4f;
  --accent: #d4af37;
  --accent-foreground: #1a1f3a;
  --border: #e8e1e8;
  --premium-gold: #d4af37;
  --deep-purple: #4a1a4f;
  --midnight-blue: #1a1f3a;
  --radius: 8px;
}

.dark {
  /* Dark Mode Color Tokens (항상 활성화) */
  --background: #0f0f1a;
  --foreground: #ffffff;
  --card: #1a1f3a;
  --card-foreground: #ffffff;
  --primary: #4a1a4f;
  --secondary: #1a1f3a;
  --secondary-foreground: #c8b8d4;
  --accent: #f4d03f;
  --accent-foreground: #0f0f1a;
  --border: #2a2f4a;
  --premium-gold: #f4d03f;
}

/* 신비로운 애니메이션 */
@keyframes mystical-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.02); }
}

.animate-mystical-pulse {
  animation: mystical-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.scrollbar-none::-webkit-scrollbar {
  display: none;
}
```

### 2. 언어 시스템 설정
`utils/language.tsx` 파일 생성:
```typescript
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'ko' | 'en';
  setLanguage: (lang: 'ko' | 'en') => void;
  t: (key: string) => string;
}

const translations = {
  ko: {
    // 네비게이션
    'nav.timer': '타이머',
    'nav.spreads': '스프레드',
    'nav.journal': '저널',
    'nav.settings': '설정',
    
    // 타이머 탭
    'timer.title': '타로 타이머',
    'timer.currentHour': '현재 시간',
    'timer.now': '지금',
    'timer.revealDestiny': '운명을 펼쳐보세요',
    'timer.cosmicMessage': '우주가 전하는 24시간의 신성한 메시지',
    'timer.drawCards': '24시간 카드 뽑기',
    'timer.drawingCards': '카드를 뽑는 중...',
    'timer.energyFlow': '시간의 흐름',
    'timer.redraw': '다시 뽑기',
    'timer.reshuffling': '재배치 중...',
    'timer.sacredJournal': '성스러운 저널',
    'timer.journalPlaceholder': '이 시간의 카드가 전하는 메시지를 기록해보세요...',
    'timer.saveReading': '일일 타로 저장하기',
    'timer.saved': '저장됨',
    'timer.quote': '"시간은 강물과 같다. 우리는 그 흐름 속에서 진실을 발견한다."',
    
    // 스프레드 탭
    'spreads.title': '타로 스프레드',
    'spreads.subtitle': '당신의 질문에 맞는 완벽한 스프레드',
    'spreads.beginReading': '리딩 시작하기',
    'spreads.premium': '프리미엄',
    'spreads.premiumTitle': '프리미엄 활성화됨',
    'spreads.premiumDesc': '모든 고급 스프레드와 기능을 자유롭게 이용하세요',
    'spreads.premiumActive': '프리미엄 활성',
    'spreads.quote': '"모든 카드에는 우주의 지혜가 담겨 있다."',
    
    // 저널 탭
    'journal.title': '신성한 저널',
    'journal.subtitle': '당신의 타로 여정을 기록하세요',
    'journal.dailyTarot': '일일 타로',
    'journal.spreadRecords': '스프레드 기록',
    'journal.dailyReadings': '일일 리딩',
    'journal.records': '개',
    'journal.saved': '저장됨',
    'journal.view': '보기',
    'journal.noReadings': '아직 저장된 리딩이 없습니다',
    'journal.noReadingsDesc': '타이머에서 24시간 카드를 뽑고 저장해보세요',
    'journal.noSpreads': '아직 저장된 스프레드가 없습니다',
    'journal.noSpreadsDesc': '스프레드 탭에서 리딩을 완료하고 저장해보세요',
    'journal.quote': '"기록된 지혜는 미래의 나침반이 된다."',
    
    // 설정 탭
    'settings.title': '설정',
    'settings.subtitle': '앱을 당신에게 맞게 설정하세요',
    'settings.premium': '프리미엄 멤버십',
    'settings.active': '활성화됨',
    'settings.premiumSpreads': '모든 프리미엄 스프레드 접근',
    'settings.adFree': '광고 없는 환경',
    'settings.unlimitedStorage': '무제한 저장 공간',
    'settings.managePremium': '프리미엄 관리',
    'settings.displayTheme': '화면 & 테마',
    'settings.darkMode': '다크 모드',
    'settings.language': '언어',
    'settings.korean': '한국어',
    'settings.english': '영어',
    'settings.notifications': '알림',
    'settings.spreadCompletion': '스프레드 완료 알림',
    'settings.spreadCompletionDesc': '리딩 완료 시 알림 받기',
    'settings.soundHaptics': '소리 & 햅틱',
    'settings.soundEffects': '효과음',
    'settings.hapticFeedback': '햅틱 피드백',
    'settings.hapticFeedbackDesc': '터치 시 진동 피드백',
    'settings.privacySecurity': '개인정보 & 보안',
    'settings.privacyPolicy': '개인정보 처리방침',
    'settings.dataManagement': '데이터 관리',
    'settings.support': '지원 & 정보',
    'settings.helpFaq': '도움말 & FAQ',
    'settings.supportDev': '개발자 지원',
    'settings.version': '버전 1.0.0',
    'settings.copyright': '© 2024 Tarot Timer',
    'settings.quote': '"설정된 의도는 명확한 답을 가져온다."',
    
    // 공통
    'common.characters': '자',
    'common.back': '뒤로',
    'common.close': '닫기',
    'common.save': '저장',
    'common.cancel': '취소',
    'common.confirm': '확인'
  },
  en: {
    // Navigation
    'nav.timer': 'Timer',
    'nav.spreads': 'Spreads', 
    'nav.journal': 'Journal',
    'nav.settings': 'Settings',
    
    // Timer Tab
    'timer.title': 'Tarot Timer',
    'timer.currentHour': 'Current Hour',
    'timer.now': 'Now',
    'timer.revealDestiny': 'Reveal Your Destiny',
    'timer.cosmicMessage': '24 sacred messages from the universe',
    'timer.drawCards': 'Draw 24-Hour Cards',
    'timer.drawingCards': 'Drawing cards...',
    'timer.energyFlow': 'Energy Flow',
    'timer.redraw': 'Redraw',
    'timer.reshuffling': 'Reshuffling...',
    'timer.sacredJournal': 'Sacred Journal',
    'timer.journalPlaceholder': 'Record the message this hour\'s card brings you...',
    'timer.saveReading': 'Save Daily Reading',
    'timer.saved': 'Saved',
    'timer.quote': '"Time flows like a river. We discover truth within its flow."',
    
    // Spreads Tab
    'spreads.title': 'Tarot Spreads',
    'spreads.subtitle': 'Perfect spreads for your questions',
    'spreads.beginReading': 'Begin Reading',
    'spreads.premium': 'Premium',
    'spreads.premiumTitle': 'Premium Activated',
    'spreads.premiumDesc': 'Enjoy all advanced spreads and features freely',
    'spreads.premiumActive': 'Premium Active',
    'spreads.quote': '"Every card contains the wisdom of the universe."',
    
    // Journal Tab
    'journal.title': 'Sacred Journal',
    'journal.subtitle': 'Record your tarot journey',
    'journal.dailyTarot': 'Daily Tarot',
    'journal.spreadRecords': 'Spread Records',
    'journal.dailyReadings': 'Daily Readings',
    'journal.records': 'records',
    'journal.saved': 'Saved',
    'journal.view': 'View',
    'journal.noReadings': 'No saved readings yet',
    'journal.noReadingsDesc': 'Draw and save 24-hour cards from the timer',
    'journal.noSpreads': 'No saved spreads yet', 
    'journal.noSpreadsDesc': 'Complete and save readings from the spreads tab',
    'journal.quote': '"Recorded wisdom becomes a compass for the future."',
    
    // Settings Tab
    'settings.title': 'Settings',
    'settings.subtitle': 'Customize the app for you',
    'settings.premium': 'Premium Membership',
    'settings.active': 'Active',
    'settings.premiumSpreads': 'Access to all premium spreads',
    'settings.adFree': 'Ad-free experience',
    'settings.unlimitedStorage': 'Unlimited storage',
    'settings.managePremium': 'Manage Premium',
    'settings.displayTheme': 'Display & Theme',
    'settings.darkMode': 'Dark Mode',
    'settings.language': 'Language',
    'settings.korean': 'Korean',
    'settings.english': 'English',
    'settings.notifications': 'Notifications',
    'settings.spreadCompletion': 'Spread completion',
    'settings.spreadCompletionDesc': 'Get notified when readings are complete',
    'settings.soundHaptics': 'Sound & Haptics',
    'settings.soundEffects': 'Sound Effects',
    'settings.hapticFeedback': 'Haptic Feedback',
    'settings.hapticFeedbackDesc': 'Vibration feedback on touch',
    'settings.privacySecurity': 'Privacy & Security',
    'settings.privacyPolicy': 'Privacy Policy',
    'settings.dataManagement': 'Data Management',
    'settings.support': 'Support & Info',
    'settings.helpFaq': 'Help & FAQ',
    'settings.supportDev': 'Support Developer',
    'settings.version': 'Version 1.0.0',
    'settings.copyright': '© 2024 Tarot Timer',
    'settings.quote': '"Intended settings bring clear answers."',
    
    // Common
    'common.characters': 'chars',
    'common.back': 'Back',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');
  
  const t = (key: string): string => {
    return translations[language][key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
```

---

## 🎨 에셋 사용 가이드

### 1. 아이콘 시스템
`components/mystical-ui/icons.tsx` 파일 생성하여 25개 아이콘 정의:
```typescript
// Clock, Layout, BookOpen, Settings, Moon, TarotCards, Star, Sparkles, Zap, 
// RotateCcw, Save, Crown, Calendar, Sun, Globe, Volume2, Bell, Lock, Shield, 
// HelpCircle, Eye, Shuffle, ChevronLeft, Check, X
```

### 2. 이미지 에셋 활용
```typescript
// 타로 카드 백면: tarot-card-back.svg
// 앱 로고: app-logo-main.svg, app-logo-icon.svg  
// 배경 텍스처: mystical-texture-dark.svg, mystical-texture-light.svg
// Sacred Geometry: sacred-geometry-pattern.svg
// 효과: sparkle-effect.svg
// 플레이스홀더: card-placeholder.svg
```

---

## 🏗️ 컴포넌트 구조

### 1. 메인 앱 구조
```typescript
export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewType>('tabs');
  const [activeTab, setActiveTab] = useState('timer');
  
  // 4개 메인 탭: Timer, Spreads, Journal, Settings
  // 네비게이션: 하단 고정 탭바
}
```

### 2. 배경 스타일링 (모든 화면 공통)
```css
background: linear-gradient(135deg, #1a1f3a 0%, #4a1a4f 50%, #1a1f3a 100%)
```

### 3. 신비로운 배경 효과 (모든 화면에 추가)
```jsx
{/* Mystical Background Effects */}
<div className="absolute inset-0 opacity-50 animate-pulse pointer-events-none" style={{
  background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.05), transparent)'
}}></div>
<div className="absolute top-10 left-10 w-2 h-2 rounded-full animate-ping" style={{
  backgroundColor: '#d4af37',
  animationDelay: '1000ms'
}}></div>
<div className="absolute top-32 right-16 w-1 h-1 bg-white rounded-full animate-pulse" style={{
  animationDelay: '2000ms'
}}></div>
{/* 더 많은 파티클 효과들... */}
```

---

## 📱 화면별 상세 구현

### 1. Timer 화면
**핵심 기능:**
- 24시간 카드 뽑기 버튼
- 현재 시간 카드 표시
- 시간별 카드 스크롤
- 시간별 메모 작성
- 일일 타로 저장

**주요 스타일:**
```jsx
{/* 헤더 */}
<h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-white to-yellow-400 bg-clip-text text-transparent">
  {t('timer.title')}
</h1>

{/* 카드 표시 */}
<Card className="relative bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
  {/* 카드 이미지 */}
  <div className="relative w-64 h-96 rounded-2xl overflow-hidden shadow-2xl border-2 border-yellow-400/50">
    <ImageWithFallback
      src={selectedCard.imageUrl}
      alt={language === 'ko' ? selectedCard.nameKr : selectedCard.name}
      className="w-full h-full object-cover"
    />
  </div>
</Card>

{/* 24시간 뽑기 버튼 */}
<Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-4 text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-500 shadow-2xl">
  <Zap className="h-5 w-5 mr-2" />
  {t('timer.drawCards')}
</Button>
```

### 2. Spreads 화면
**핵심 기능:**
- 스프레드 타입 목록
- 프리미엄 배지
- 스프레드 선택 시 상세 화면 이동

**주요 스타일:**
```jsx
{/* 스프레드 카드 */}
<Card className="relative bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-400/10 hover:scale-[1.02] hover:border-yellow-400/30">
  {/* 프리미엄 배지 */}
  {spread.isPremium && (
    <Badge className="gap-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black border-none shadow-lg">
      <Crown className="h-3 w-3" />
      {t('spreads.premium')}
    </Badge>
  )}
  
  {/* 시작하기 버튼 */}
  <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-3 text-base hover:from-yellow-500 hover:to-yellow-600 transition-all duration-500 shadow-2xl shadow-yellow-400/20">
    <Zap className="h-4 w-4 mr-2" />
    {t('spreads.beginReading')}
  </Button>
</Card>
```

### 3. Journal 화면  
**핵심 기능:**
- 일일 타로 / 스프레드 기록 토글
- 저장된 리딩 목록
- 카드 미리보기
- 상세 보기

**주요 스타일:**
```jsx
{/* 섹션 토글 */}
<div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
  <button className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
    activeSection === 'daily' ? 'bg-yellow-400 text-black shadow-lg' : 'text-white/70'
  }`}>
    {t('journal.dailyTarot')}
  </button>
</div>

{/* 저장된 기록 카드 */}
<Card className="bg-white/5 border border-white/10 hover:border-yellow-400/30 transition-all duration-300 cursor-pointer">
  {/* 카드 미리보기 */}
  <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none">
    {save.hourlyCards.slice(0, 8).map((card, index) => (
      <div key={index} className="flex-shrink-0 w-8 h-12 rounded overflow-hidden border border-yellow-400/30 shadow-lg">
        <ImageWithFallback src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
      </div>
    ))}
  </div>
</Card>
```

### 4. Settings 화면
**핵심 기능:**
- 프리미엄 상태 표시  
- 언어 변경
- 알림/소리 설정
- 개인정보/지원 링크

**주요 스타일:**
```jsx
{/* 프리미엄 카드 */}
<Card className="bg-white/5 border border-yellow-400/30">
  <div className="flex items-center gap-3">
    <Crown className="h-6 w-6 text-yellow-400" />
    <div>
      <h3 className="text-white font-medium">{t('settings.premium')}</h3>
      <p className="text-white/60 text-sm">{t('settings.active')}</p>
    </div>
  </div>
  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
    {t('settings.active')}
  </Badge>
</Card>

{/* 언어 변경 버튼 */}
<Button
  variant="outline"
  size="sm"
  onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
  className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
>
  <Globe className="h-4 w-4 mr-1" />
  {language === 'ko' ? 'EN' : '한'}
</Button>
```

---

## 🧭 네비게이션 시스템

### 하단 탭바 (고정)
```jsx
<div className="fixed bottom-0 left-0 right-0 z-50">
  <div className="backdrop-blur-xl border-t shadow-2xl" style={{
    background: 'rgba(26, 31, 58, 0.95)',
    borderTopColor: 'rgba(212, 175, 55, 0.2)'
  }}>
    <div className="grid w-full grid-cols-4 bg-transparent">
      {/* 4개 탭: Timer, Spreads, Journal, Settings */}
      <button className={`flex flex-col items-center gap-2 p-4 transition-all duration-300 ${
        activeTab === 'timer' ? 'text-yellow-400 bg-yellow-400/10' : 'text-white/60'
      }`}>
        <div className="relative">
          <Clock className="h-6 w-6" />
          {/* 활성 상태 글로우 효과 */}
          {activeTab === 'timer' && (
            <div className="absolute -inset-2 rounded-full opacity-100 blur-sm -z-10" style={{
              backgroundColor: 'rgba(212, 175, 55, 0.2)'
            }} />
          )}
        </div>
        <span className="text-xs font-medium">{t('nav.timer')}</span>
        {/* 활성 인디케이터 */}
        {activeTab === 'timer' && (
          <div className="h-0.5 w-8 rounded-full shadow-lg" style={{
            backgroundColor: '#d4af37',
            boxShadow: '0 0 12px rgba(212, 175, 55, 0.5)'
          }} />
        )}
      </button>
      {/* 나머지 3개 탭도 동일한 구조 */}
    </div>
  </div>
</div>
```

---

## 🎭 상호작용 & 애니메이션

### 1. 호버 효과
```jsx
{/* 카드 호버 */}
className="transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-400/10 hover:scale-[1.02] hover:border-yellow-400/30"

{/* 버튼 호버 */}
className="hover:from-yellow-500 hover:to-yellow-600 transition-all duration-500"

{/* 글로우 효과 */}
<div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
```

### 2. 로딩 상태
```jsx
{/* 로딩 버튼 */}
{isDrawingAll ? (
  <div className="flex items-center gap-3">
    <Sparkles className="h-5 w-5 animate-spin" />
    {t('timer.drawingCards')}
  </div>
) : (
  <div className="flex items-center gap-3">
    <Zap className="h-5 w-5" />
    {t('timer.drawCards')}
  </div>
)}
```

### 3. 신비로운 효과
```jsx
{/* 아이콘 애니메이션 */}
<TarotCards className="h-14 w-14 text-yellow-400 animate-mystical-pulse" />

{/* 파티클 효과 */}
<div className="absolute top-10 left-10 w-2 h-2 rounded-full animate-ping" style={{
  backgroundColor: '#d4af37',
  animationDelay: '1000ms'
}}></div>
```

---

## 📱 반응형 디자인

### 모바일 우선 설계
```jsx
{/* 컨테이너 */}
<div className="container mx-auto px-6 py-8 max-w-md space-y-8">

{/* 카드 크기 조정 */}
<div className="w-64 h-96"> {/* 데스크톱 */}
<div className="w-16 h-24"> {/* 미니 카드 */}
```

### 터치 최적화
```jsx
{/* 스크롤 */}
<div className="overflow-x-auto pb-2 scrollbar-none">
  <div className="flex gap-3 px-4" style={{ width: 'max-content' }}>
    {/* 카드들 */}
  </div>
</div>

{/* 터치 타겟 크기 */}
className="p-4" {/* 최소 44px 터치 영역 */}
```

---

## 🗂️ 데이터 구조

### 1. 타로 카드 데이터
```typescript
interface TarotCard {
  id: number;
  name: string;
  nameKr: string;
  meaning: string;
  meaningKr: string;
  keywords: string[];
  keywordsKr: string[];
  imageUrl: string;
  element: string;
  suit: string;
  type: string;
}
```

### 2. 스프레드 타입
```typescript
interface SpreadType {
  id: string;
  name: string;
  nameKr: string;
  description: string;
  descriptionKr: string;
  cards: number;
  isPremium: boolean;
}
```

### 3. 저장 데이터
```typescript
interface DailyTarotSave {
  id: string;
  date: string;
  hourlyCards: TarotCard[];
  memos: { [hour: number]: string };
  insights: string;
  savedAt: string;
}
```

---

## ✅ 필수 확인사항

### 1. 시각적 일관성
- [ ] 모든 화면에 동일한 배경 그라데이션 적용
- [ ] 신비로운 파티클 효과 모든 화면에 추가
- [ ] 골드 액센트 색상 (#d4af37) 일관성 있게 사용
- [ ] 카드 스타일링 통일 (border, shadow, border-radius)

### 2. 상호작용
- [ ] 모든 버튼에 호버 효과 적용
- [ ] 카드 클릭 시 확대/글로우 효과
- [ ] 로딩 상태 애니메이션
- [ ] 네비게이션 탭 전환 효과

### 3. 텍스트 & 언어
- [ ] 모든 텍스트를 t() 함수로 다국어 처리
- [ ] 한국어/영어 토글 기능 작동
- [ ] 폰트 크기/weight 가이드라인 준수

### 4. 레이아웃
- [ ] 모바일 우선 반응형 디자인
- [ ] 하단 네비게이션 고정 (z-50)
- [ ] 콘텐츠 영역 하단 여백 (h-20)
- [ ] 최대 너비 제한 (max-w-md)

### 5. 성능
- [ ] 이미지 최적화 (ImageWithFallback 사용)
- [ ] 스크롤 성능 (scrollbar-none)
- [ ] 애니메이션 최적화 (GPU 가속)

---

## 🚀 시작하기

1. **프로젝트 생성**: 새로운 React 프로젝트 생성
2. **Tailwind 설정**: globals.css에 제공된 스타일 복사
3. **언어 시스템**: language.tsx 파일 생성 및 설정
4. **아이콘 생성**: mystical-ui/icons.tsx 파일 생성
5. **메인 앱**: App.tsx에 제공된 구조 구현
6. **에셋 추가**: 필요한 이미지 파일들 추가
7. **테스트**: 모든 기능과 스타일 확인

이 가이드를 따라하면 완성된 타로 타이머 앱을 정확히 재현할 수 있습니다. 각 단계별로 꼼꼼히 확인하며 진행하세요.

---

**💫 Mystical Design, Perfect Implementation ✨**