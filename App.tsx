import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

// 화면 크기 및 반응형 설정
const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 360;
const isMediumScreen = width >= 360 && width < 400;
const isLargeScreen = width >= 400;
const isTablet = width >= 768;

// 반응형 유틸
const getResponsiveSize = (small: number, medium: number, large: number, tablet?: number) => {
  if (isTablet && tablet) return tablet;
  if (isLargeScreen) return large;
  if (isMediumScreen) return medium;
  return small;
};

const getResponsiveFontSize = (base: number) => {
  if (isTablet) return base * 1.2;
  if (isLargeScreen) return base * 1.1;
  if (isMediumScreen) return base;
  return base * 0.9;
};

const getResponsiveSpacing = (base: number) => {
  return getResponsiveSize(base * 0.8, base, base * 1.2, base * 1.5);
};

// 타입 정의
type Language = 'ko' | 'en';

interface TarotCard {
  id: string;
  name: { ko: string; en: string };
  keywords: { ko: string; en: string }[];
  emoji: string;
  color: string;
  imagePath?: string;
}

interface CardTheme {
  id: string;
  name: { ko: string; en: string };
  description: { ko: string; en: string };
  price: number;
  preview: string;
  folderPath: string;
  isPurchased: boolean;
  isDefault: boolean;
}

interface TimeSlot {
  hour: number;
  card: TarotCard | null;
  isActive: boolean;
  isDrawn: boolean;
  memo?: string;
}

interface DiaryEntry {
  id: string;
  date: string;
  timeSlots: TimeSlot[];
  createdAt: Date;
}

interface NoticePost {
  id: string;
  title: { ko: string; en: string };
  content: { ko: string; en: string };
  date: string;
  isImportant: boolean;
}

interface InquiryPost {
  id: string;
  title: string;
  content: string;
  date: string;
  status: 'waiting' | 'answered';
  answer?: string;
}

// 스프레드 관련 타입 정의
interface SpreadCard {
  position: number;
  card: TarotCard | null;
  x: number; // 상대적 위치 (0-1)
  y: number; // 상대적 위치 (0-1)
  meaning?: { ko: string; en: string };
}

interface SpreadLayout {
  id: string;
  name: { ko: string; en: string };
  description: { ko: string; en: string };
  cards: SpreadCard[];
  hasTimeline?: boolean;
  timelineCards?: TarotCard[];
}

interface SavedSpread {
  id: string;
  spreadId: string;
  title: string;
  cards: SpreadCard[];
  timelineCards?: TarotCard[];
  date: string;
  createdAt: Date;
}

// 타로 카드 데이터(일부 샘플)
const TAROT_CARDS: TarotCard[] = [
  {
    id: 'major_00',
    name: { ko: '바보', en: 'The Fool' },
    keywords: [
      { ko: '새로운 시작', en: 'New Beginning' },
      { ko: '순수함', en: 'Innocence' },
    ],
    emoji: '🃏',
    color: '#FF6B6B',
    imagePath: 'major_00_fool',
  },
  {
    id: 'major_01',
    name: { ko: '마법사', en: 'The Magician' },
    keywords: [
      { ko: '의지력', en: 'Willpower' },
      { ko: '창조', en: 'Creation' },
    ],
    emoji: '🎩',
    color: '#4ECDC4',
    imagePath: 'major_01_magician',
  },
  {
    id: 'major_02',
    name: { ko: '여사제', en: 'The High Priestess' },
    keywords: [
      { ko: '직관', en: 'Intuition' },
      { ko: '신비', en: 'Mystery' },
    ],
    emoji: '🌙',
    color: '#45B7D1',
    imagePath: 'major_02_high_priestess',
  },
  {
    id: 'major_03',
    name: { ko: '여황제', en: 'The Empress' },
    keywords: [
      { ko: '풍요', en: 'Abundance' },
      { ko: '모성', en: 'Motherhood' },
    ],
    emoji: '👑',
    color: '#F7DC6F',
    imagePath: 'major_03_empress',
  },
  {
    id: 'major_04',
    name: { ko: '황제', en: 'The Emperor' },
    keywords: [
      { ko: '권위', en: 'Authority' },
      { ko: '안정', en: 'Stability' },
    ],
    emoji: '🛡️',
    color: '#E74C3C',
    imagePath: 'major_04_emperor',
  },
  {
    id: 'major_05',
    name: { ko: '교황', en: 'The Hierophant' },
    keywords: [
      { ko: '전통', en: 'Tradition' },
      { ko: '지혜', en: 'Wisdom' },
    ],
    emoji: '⛪',
    color: '#9B59B6',
    imagePath: 'major_05_hierophant',
  },
  {
    id: 'major_06',
    name: { ko: '연인들', en: 'The Lovers' },
    keywords: [
      { ko: '사랑', en: 'Love' },
      { ko: '선택', en: 'Choice' },
    ],
    emoji: '💕',
    color: '#FF69B4',
    imagePath: 'major_06_lovers',
  },
  {
    id: 'major_07',
    name: { ko: '전차', en: 'The Chariot' },
    keywords: [
      { ko: '승리', en: 'Victory' },
      { ko: '의지', en: 'Determination' },
    ],
    emoji: '🎯',
    color: '#32CD32',
    imagePath: 'major_07_chariot',
  },
  {
    id: 'major_08',
    name: { ko: '은둔자', en: 'The Hermit' },
    keywords: [
      { ko: '성찰', en: 'Reflection' },
      { ko: '지혜', en: 'Wisdom' },
    ],
    emoji: '🕯️',
    color: '#90A4AE',
    imagePath: 'major_08_hermit',
  },
  {
    id: 'major_09',
    name: { ko: '운명의 수레바퀴', en: 'Wheel of Fortune' },
    keywords: [
      { ko: '변화', en: 'Change' },
      { ko: '운명', en: 'Destiny' },
    ],
    emoji: '🎡',
    color: '#FF9800',
    imagePath: 'major_09_wheel_of_fortune',
  },
];

// 로컬 이미지 정적 매핑 (Expo/Metro는 동적 require를 지원하지 않으므로 사전 매핑 필요)
const CARD_IMAGE_MAP: Record<string, any> = {
  major_00_fool: require('./assets/tarot-cards/classic-tarot/major_00_fool.jpg'),
  major_01_magician: require('./assets/tarot-cards/classic-tarot/major_01_magician.jpg'),
  major_02_high_priestess: require('./assets/tarot-cards/classic-tarot/major_02_high_priestess.jpg'),
  major_03_empress: require('./assets/tarot-cards/classic-tarot/major_03_empress.jpg'),
  major_04_emperor: require('./assets/tarot-cards/classic-tarot/major_04_emperor.jpg'),
  major_05_hierophant: require('./assets/tarot-cards/classic-tarot/major_05_hierophant.jpg'),
  major_06_lovers: require('./assets/tarot-cards/classic-tarot/major_06_lovers.jpg'),
  major_07_chariot: require('./assets/tarot-cards/classic-tarot/major_07_chariot.jpg'),
  // 실제 파일명은 major_09_hermit.jpg 이므로 여기에 매핑
  major_08_hermit: require('./assets/tarot-cards/classic-tarot/major_09_hermit.jpg'),
  major_09_wheel_of_fortune: require('./assets/tarot-cards/classic-tarot/major_10_wheel_of_fortune.jpg'),
  // 필요 시 더 추가 가능 (major_10~21, minor_* 등)
};

// 카드 테마 시스템
const CARD_THEMES: CardTheme[] = [
  {
    id: 'classic',
    name: { ko: '클래식 타로', en: 'Classic Tarot' },
    description: { ko: '전통적인 타로카드 디자인', en: 'Traditional tarot card design' },
    price: 0,
    preview: 'classic-preview.png',
    folderPath: 'classic-tarot',
    isPurchased: true,
    isDefault: true,
  },
  {
    id: 'neon',
    name: { ko: '네온 타로', en: 'Neon Tarot' },
    description: { ko: '사이버펑크 스타일의 네온 카드', en: 'Cyberpunk style neon cards' },
    price: 2000,
    preview: 'neon-preview.png',
    folderPath: 'neon-tarot',
    isPurchased: false,
    isDefault: false,
  },
  {
    id: 'vintage',
    name: { ko: '빈티지 타로', en: 'Vintage Tarot' },
    description: { ko: '고풍스러운 빈티지 스타일', en: 'Elegant vintage style' },
    price: 1500,
    preview: 'vintage-preview.png',
    folderPath: 'vintage-tarot',
    isPurchased: false,
    isDefault: false,
  },
  {
    id: 'watercolor',
    name: { ko: '수채화 타로', en: 'Watercolor Tarot' },
    description: { ko: '부드러운 수채화 느낌', en: 'Soft watercolor feeling' },
    price: 2500,
    preview: 'watercolor-preview.png',
    folderPath: 'watercolor-tarot',
    isPurchased: false,
    isDefault: false,
  },
];

// 공지사항 데이터
const NOTICE_POSTS: NoticePost[] = [
  {
    id: 'notice_001',
    title: { ko: '🎉 타로 타이머 앱 정식 출시!', en: '🎉 Tarot Timer App Official Launch!' },
    content: {
      ko: '24시간 타로 카드와 함께하는 의미있는 하루를 시작하세요. 반응형 디자인으로 모든 기기에서 완벽한 경험을 제공합니다!',
      en: 'Start a meaningful day with 24-hour tarot cards. Experience perfect performance on all devices with responsive design!',
    },
    date: '2024-01-15',
    isImportant: true,
  },
  {
    id: 'notice_002',
    title: { ko: '📖 타로 일기 기능 대폭 개선!', en: '📖 Tarot Diary Feature Major Update!' },
    content: {
      ko: '이제 매일의 타로 카드를 일기로 저장하고, 메모와 함께 관리할 수 있습니다. 개인적인 해석과 느낌을 기록해보세요.',
      en: 'Now you can save daily tarot cards as a diary and manage them with memos. Record your personal interpretations and feelings.',
    },
    date: '2024-01-12',
    isImportant: false,
  },
];

// 스프레드 레이아웃 정의
const SPREAD_LAYOUTS: SpreadLayout[] = [
  {
    id: 'single_card',
    name: { ko: '원카드', en: 'Single Card' },
    description: { ko: '하나의 카드로 현재 상황을 알아보세요', en: 'Discover your current situation with one card' },
    cards: [
      { position: 1, card: null, x: 0.5, y: 0.5, meaning: { ko: '현재 상황', en: 'Current Situation' } }
    ]
  },
  {
    id: 'three_card',
    name: { ko: '쓰리카드', en: 'Three Card' },
    description: { ko: '과거, 현재, 미래를 알아보세요', en: 'Explore past, present, and future' },
    cards: [
      { position: 1, card: null, x: 0.2, y: 0.5, meaning: { ko: '과거', en: 'Past' } },
      { position: 2, card: null, x: 0.5, y: 0.5, meaning: { ko: '현재', en: 'Present' } },
      { position: 3, card: null, x: 0.8, y: 0.5, meaning: { ko: '미래', en: 'Future' } }
    ]
  },
  {
    id: 'five_card',
    name: { ko: '파이브카드', en: 'Five Card' },
    description: { ko: '5장의 카드로 상세한 운세를 확인하세요', en: 'Get detailed fortune with 5 cards' },
    cards: [
      { position: 1, card: null, x: 0.3, y: 0.7, meaning: { ko: '선택A 결과', en: 'Choice A Result' } },
      { position: 2, card: null, x: 0.5, y: 0.3, meaning: { ko: '선택B 결과', en: 'Choice B Result' } },
      { position: 3, card: null, x: 0.5, y: 0.9, meaning: { ko: '질문자 태도', en: 'Querent Attitude' } },
      { position: 4, card: null, x: 0.1, y: 0.5, meaning: { ko: '선택A 결과', en: 'Choice A Result' } },
      { position: 5, card: null, x: 0.9, y: 0.5, meaning: { ko: '선택B 결과', en: 'Choice B Result' } }
    ],
    hasTimeline: true
  },
  {
    id: 'celtic_cross',
    name: { ko: '캘틱크로스', en: 'Celtic Cross' },
    description: { ko: '가장 상세한 10장 스프레드', en: 'Most detailed 10-card spread' },
    cards: [
      { position: 1, card: null, x: 0.3, y: 0.6, meaning: { ko: '나의 현재 상태', en: 'My Current State' } },
      { position: 2, card: null, x: 0.3, y: 0.4, meaning: { ko: '방해물', en: 'Obstacle' } },
      { position: 3, card: null, x: 0.3, y: 0.2, meaning: { ko: '문제의 핵심', en: 'Core Issue' } },
      { position: 4, card: null, x: 0.1, y: 0.6, meaning: { ko: '과거', en: 'Past' } },
      { position: 5, card: null, x: 0.3, y: 0.05, meaning: { ko: '현재', en: 'Present' } },
      { position: 6, card: null, x: 0.5, y: 0.6, meaning: { ko: '미래', en: 'Future' } },
      { position: 7, card: null, x: 0.75, y: 0.8, meaning: { ko: '질문자 관점', en: 'Querent Perspective' } },
      { position: 8, card: null, x: 0.75, y: 0.6, meaning: { ko: '외부 상황', en: 'External Situation' } },
      { position: 9, card: null, x: 0.75, y: 0.4, meaning: { ko: '질문자 바람, 두려움', en: 'Hopes and Fears' } },
      { position: 10, card: null, x: 0.75, y: 0.2, meaning: { ko: '상대가 나에게 바라는 점', en: 'Final Outcome' } }
    ],
    hasTimeline: true
  },
  {
    id: 'cross_spread',
    name: { ko: '크로스 스프레드', en: 'Cross Spread' },
    description: { ko: '십자가 모양의 5장 스프레드', en: 'Cross-shaped 5-card spread' },
    cards: [
      { position: 1, card: null, x: 0.3, y: 0.7, meaning: { ko: '현상황', en: 'Current Situation' } },
      { position: 2, card: null, x: 0.1, y: 0.5, meaning: { ko: '방해물', en: 'Obstacle' } },
      { position: 3, card: null, x: 0.3, y: 0.5, meaning: { ko: '질문자', en: 'Querent' } },
      { position: 4, card: null, x: 0.5, y: 0.5, meaning: { ko: '과거', en: 'Past' } },
      { position: 5, card: null, x: 0.3, y: 0.3, meaning: { ko: '미래', en: 'Future' } }
    ]
  },
  {
    id: 'horseshoe_spread',
    name: { ko: '호스슈 스프레드', en: 'Horseshoe Spread' },
    description: { ko: '말굽 모양의 7장 스프레드', en: 'Horseshoe-shaped 7-card spread' },
    cards: [
      { position: 1, card: null, x: 0.1, y: 0.8, meaning: { ko: '나의 현재 상태', en: 'Current State' } },
      { position: 2, card: null, x: 0.2, y: 0.5, meaning: { ko: '우리의 현재 상태', en: 'Our Current State' } },
      { position: 3, card: null, x: 0.35, y: 0.3, meaning: { ko: '상대의 현재 상태', en: 'Their Current State' } },
      { position: 4, card: null, x: 0.5, y: 0.2, meaning: { ko: '과거', en: 'Past' } },
      { position: 5, card: null, x: 0.65, y: 0.3, meaning: { ko: '방해물', en: 'Obstacle' } },
      { position: 6, card: null, x: 0.8, y: 0.5, meaning: { ko: '미래', en: 'Future' } },
      { position: 7, card: null, x: 0.9, y: 0.8, meaning: { ko: '질문자 관점', en: 'Querent Perspective' } }
    ]
  }
];

export default function App() {
  // 상태 관리
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ko');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [inquiries, setInquiries] = useState<InquiryPost[]>([]);
  const [currentTab, setCurrentTab] = useState<'main' | 'spread' | 'timeline' | 'diary' | 'settings'>('main');

  // 테마/포인트 상태
  const [themes, setThemes] = useState<CardTheme[]>(CARD_THEMES);
  const [currentTheme, setCurrentTheme] = useState<CardTheme>(CARD_THEMES[0]);
  const [userPoints, setUserPoints] = useState(5000);
  const [showThemeStore, setShowThemeStore] = useState(false);

  // 모달 상태
  const [showMemo, setShowMemo] = useState(false);
  const [showNoticeBoard, setShowNoticeBoard] = useState(false);
  const [showInquiryBoard, setShowInquiryBoard] = useState(false);

  // 메모 관련 상태
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [memoText, setMemoText] = useState('');

  // 문의 관련 상태
  const [inquiryTitle, setInquiryTitle] = useState('');
  const [inquiryContent, setInquiryContent] = useState('');

  // 스프레드 관련 상태
  const [spreads] = useState<SpreadLayout[]>(SPREAD_LAYOUTS);
  const [currentSpread, setCurrentSpread] = useState<SpreadLayout | null>(null);
  const [savedSpreads, setSavedSpreads] = useState<SavedSpread[]>([]);
  const [spreadTitle, setSpreadTitle] = useState('');
  const [showTimelineDraw, setShowTimelineDraw] = useState(false);

  // 스프레드 캡처를 위한 ref
  const spreadViewRef = useRef<View>(null);

  // 화면 크기 변경 감지(필요 시 사용)
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  
  // 스크롤 위치 유지를 위한 상태
  const [scrollPositions, setScrollPositions] = useState<{[key: string]: number}>({});
  
  useEffect(() => {
    const onChange = (result: any) => {
      setScreenData(result.window);
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  // 현재 시간 틱업데이트
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 초기 타임슬롯 생성
  useEffect(() => {
    const initialSlots: TimeSlot[] = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      card: null,
      isActive: i === currentTime.getHours(),
      isDrawn: false,
      memo: '',
    }));
    setTimeSlots(initialSlots);
  }, []);

  // 현재 시간에 따른 활성화 슬랏 업데이트 (시간만 변경될 때만)
  useEffect(() => {
    const currentHour = currentTime.getHours();
    setTimeSlots(prev => prev.map(slot => ({
      ...slot,
      isActive: slot.hour === currentHour,
    })));
  }, [currentTime.getHours()]); // 시간만 변경될 때만 업데이트

  // 다국어 헬퍼
  const getText = (text: { ko: string; en: string }) => text[currentLanguage];

  // 스크롤 위치 관리 함수들
  const saveScrollPosition = useCallback((key: string, position: number) => {
    setScrollPositions(prev => ({ ...prev, [key]: position }));
  }, []);

  const getScrollPosition = useCallback((key: string) => scrollPositions[key] || 0, [scrollPositions]);

  // 랜덤 카드
  const getRandomCard = () => TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];

  // 현재 시간 카드 뽑기
  const drawCurrentCard = () => {
    const currentHour = currentTime.getHours();
    const newCard = getRandomCard();
    setTimeSlots(prev => prev.map(slot => (slot.hour === currentHour ? { ...slot, card: newCard, isDrawn: true } : slot)));
  };

  // 24시간 카드 일괄 뽑기
  const drawAllCards = () => {
    setTimeSlots(prev => prev.map(slot => ({ ...slot, card: getRandomCard(), isDrawn: true })));
    Alert.alert(getText({ ko: '✨ 카드 뽑기 완료!', en: '✨ Cards Drawn!' }), getText({ ko: '24시간 모든 카드가 뽑아졌습니다.', en: 'All 24-hour cards have been drawn.' }));
  };

  // 일기 저장
  const saveTodayDiary = () => {
    const today = new Date().toISOString().split('T')[0];
    const drawnSlots = timeSlots.filter(s => s.isDrawn);
    if (drawnSlots.length === 0) {
      Alert.alert(getText({ ko: '카드가 없습니다', en: 'No Cards' }), getText({ ko: '먼저 카드를 뽑아주세요.', en: 'Please draw cards first.' }));
      return;
    }
    const newEntry: DiaryEntry = {
      id: `diary_${Date.now()}`,
      date: today,
      timeSlots: drawnSlots,
      createdAt: new Date(),
    };
    setDiaryEntries(prev => [newEntry, ...prev]);
    Alert.alert(getText({ ko: '💾 저장 완료!', en: '💾 Saved!' }), getText({ ko: "오늘의 타로 일기가 저장되었습니다.", en: "Today's tarot diary has been saved." }));
  };

  // 일기 삭제
  const deleteDiaryEntry = (entryId: string) => {
    Alert.alert(
      getText({ ko: '일기 삭제', en: 'Delete Diary' }),
      getText({ ko: '정말로 이 일기를 삭제하시겠습니까?', en: 'Are you sure you want to delete this diary?' }),
      [
        { text: getText({ ko: '취소', en: 'Cancel' }), style: 'cancel' },
        { text: getText({ ko: '삭제', en: 'Delete' }), style: 'destructive', onPress: () => setDiaryEntries(prev => prev.filter(e => e.id !== entryId)) },
      ],
    );
  };

  // 메모 저장
  const saveMemo = () => {
    if (!selectedTimeSlot) return;
    setTimeSlots(prev => prev.map(slot => (slot.hour === selectedTimeSlot.hour ? { ...slot, memo: memoText.trim() } : slot)));
    setShowMemo(false);
    setMemoText('');
    setSelectedTimeSlot(null);
  };

  // 메모 열기
  const openMemo = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    setMemoText(slot.memo || '');
    setShowMemo(true);
  };

  // 스프레드 카드 뽑기
  const drawSpreadCards = (spread: SpreadLayout) => {
    const updatedCards = spread.cards.map(card => ({
      ...card,
      card: getRandomCard()
    }));
    
    const updatedSpread = {
      ...spread,
      cards: updatedCards,
      timelineCards: []
    };
    
    setCurrentSpread(updatedSpread);
    setShowTimelineDraw(spread.hasTimeline || false);
  };

  // 시간선 카드 뽑기
  const drawTimelineCards = () => {
    if (!currentSpread) return;
    
    const timelineCards = Array.from({ length: 4 }, () => getRandomCard());
    setCurrentSpread(prev => prev ? { ...prev, timelineCards } : null);
    setShowTimelineDraw(false);
  };

  // 스프레드 다시 뽑기
  const redrawSpread = () => {
    if (!currentSpread) return;
    drawSpreadCards(currentSpread);
  };

  // 스프레드 저장
  const saveSpread = async () => {
    if (!currentSpread) return;
    
    try {
      // 미디어 라이브러리 권한 요청
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(getText({ ko: '권한 필요', en: 'Permission Required' }), getText({ ko: '이미지를 저장하려면 갤러리 접근 권한이 필요합니다.', en: 'Gallery access permission is required to save images.' }));
        return;
      }

      if (spreadViewRef.current) {
        const uri = await captureRef(spreadViewRef.current, {
          format: 'png',
          quality: 0.8,
        });
        
        await MediaLibrary.saveToLibraryAsync(uri);
        
        // 내부 저장소에도 저장
        const savedSpread: SavedSpread = {
          id: `spread_${Date.now()}`,
          spreadId: currentSpread.id,
          title: spreadTitle || getText(currentSpread.name),
          cards: currentSpread.cards,
          timelineCards: currentSpread.timelineCards,
          date: new Date().toLocaleDateString(),
          createdAt: new Date()
        };
        
        setSavedSpreads(prev => [savedSpread, ...prev]);
        
        Alert.alert(
          getText({ ko: '저장 완료!', en: 'Saved!' }), 
          getText({ ko: '스프레드가 갤러리에 저장되었습니다.', en: 'Spread has been saved to gallery.' })
        );
      }
    } catch (error) {
      Alert.alert(getText({ ko: '저장 실패', en: 'Save Failed' }), getText({ ko: '이미지 저장 중 오류가 발생했습니다.', en: 'An error occurred while saving the image.' }));
    }
  };

  // 문의 제출
  const submitInquiry = () => {
    if (!inquiryTitle.trim() || !inquiryContent.trim()) {
      Alert.alert(getText({ ko: '입력 오류', en: 'Input Error' }), getText({ ko: '제목과 내용을 모두 입력해주세요.', en: 'Please enter both title and content.' }));
      return;
    }
    const newInquiry: InquiryPost = {
      id: `inquiry_${Date.now()}`,
      title: inquiryTitle.trim(),
      content: inquiryContent.trim(),
      date: new Date().toLocaleDateString(),
      status: 'waiting',
    };
    setInquiries(prev => [newInquiry, ...prev]);
    setInquiryTitle('');
    setInquiryContent('');
    Alert.alert(getText({ ko: '💬 문의 접수', en: '💬 Inquiry Submitted' }), getText({ ko: '문의가 접수되었습니다.', en: 'Your inquiry has been submitted.' }));
  };

  // 테마 구매
  const purchaseTheme = (theme: CardTheme) => {
    if (userPoints < theme.price) {
      Alert.alert(getText({ ko: '포인트 부족', en: 'Insufficient Points' }), getText({ ko: '포인트가 부족합니다.', en: "You don't have enough points." }));
      return;
    }
    setUserPoints(prev => prev - theme.price);
    setThemes(prev => prev.map(t => (t.id === theme.id ? { ...t, isPurchased: true } : t)));
    setCurrentTheme(theme);
    Alert.alert(getText({ ko: '구매 완료!', en: 'Purchase Complete!' }), getText({ ko: '새 테마가 적용되었습니다.', en: 'New theme has been applied.' }));
  };

  // 카드 이미지 소스 (정적 require 매핑)
  const getCardImageSource = (card: TarotCard) => {
    if (!card.imagePath) return null;
    // 현재는 classic 테마 자산만 제공되므로 classic 매핑 사용
    return CARD_IMAGE_MAP[card.imagePath] || null;
  };

  // 외부 링크 배너
  const handleBannerPress = () => {
    const url = 'https://tarot-timer.vercel.app';
    Linking.openURL(url).catch(() => {
      Alert.alert(getText({ ko: '링크 오류', en: 'Link Error' }), getText({ ko: '링크를 열 수 없습니다.', en: 'Cannot open the link.' }));
    });
  };

  // 현재 시간 카드 가져오기
  const getCurrentCard = () => {
    const currentHour = currentTime.getHours();
    const currentSlot = timeSlots.find(s => s.hour === currentHour);
    return currentSlot?.card || null;
  };

  // 스프레드 카드 슬롯 컴포넌트
  const SpreadCardSlot = ({ spreadCard, containerWidth, containerHeight }: { 
    spreadCard: SpreadCard; 
    containerWidth: number; 
    containerHeight: number; 
  }) => {
    const cardSize = getResponsiveSize(60, 70, 80, 90);
    const left = spreadCard.x * containerWidth - cardSize / 2;
    const top = spreadCard.y * containerHeight - cardSize * 1.5 / 2;

    return (
      <View
        style={[
          styles.spreadCardSlot,
          {
            position: 'absolute',
            left: Math.max(0, Math.min(left, containerWidth - cardSize)),
            top: Math.max(0, Math.min(top, containerHeight - cardSize * 1.5)),
            alignItems: 'center',
          },
        ]}
      >
        <Text style={[styles.spreadCardPosition, { fontSize: getResponsiveFontSize(12), marginBottom: 5 }]}>
          {spreadCard.position}
        </Text>
        {spreadCard.card ? (
          <TarotCardView card={spreadCard.card} hour={0} size="small" />
        ) : (
          <View
            style={[
              styles.emptySpreadCard,
              {
                width: cardSize,
                height: cardSize * 1.5,
                borderRadius: getResponsiveSpacing(8),
              },
            ]}
          >
            <Text style={[styles.emptySpreadCardText, { fontSize: getResponsiveFontSize(14) }]}>?</Text>
          </View>
        )}
        {spreadCard.meaning && (
          <Text style={[styles.spreadCardMeaning, { fontSize: getResponsiveFontSize(10), marginTop: 5, width: cardSize + 20 }]}>
            {getText(spreadCard.meaning)}
          </Text>
        )}
      </View>
    );
  };

  // 타로 카드 컴포넌트
  const TarotCardView = ({ card, hour, slot, size = 'medium', scale = 1 }: { card: TarotCard; hour: number; slot?: TimeSlot; size?: 'small' | 'medium' | 'large' | 'xlarge'; scale?: number }) => {
    // 가로 폭에 맞춘 유연한 카드 크기
    const baseWidth =
      size === 'small'
        ? getResponsiveSize(52, 60, 68, 80)
        : size === 'large'
        ? getResponsiveSize(110, 128, 144, 168)
        : size === 'xlarge'
        ? getResponsiveSize(140, 160, 180, 200)
        : getResponsiveSize(76, 88, 100, 112);
    const maxWidth = Math.min(width * 0.85, 420);
    const cardWidth = Math.min(baseWidth * scale, maxWidth);
    const cardHeight = Math.round(cardWidth * 1.5);
    const imageSource = getCardImageSource(card);

    return (
      <View style={styles.cardContainer}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: imageSource ? 'transparent' : card.color,
              width: cardWidth,
              height: cardHeight,
              borderRadius: getResponsiveSpacing(12),
              padding: getResponsiveSpacing(8),
              overflow: 'hidden',
            },
          ]}
        >
          {imageSource ? (
            <>
              <Image
                source={imageSource}
                style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, borderRadius: getResponsiveSpacing(12) }}
                resizeMode="cover"
                onError={() => {
                  // 로컬 이미지 동적 로딩 실패 시 이모지로 폴백
                }}
              />
              <View style={styles.cardImageOverlay}>
                <Text
                  style={[
                    styles.cardName,
                    {
                      fontSize: getResponsiveFontSize(size === 'small' ? 8 : size === 'large' ? 14 : size === 'xlarge' ? 16 : 10),
                      color: '#fff',
                      textShadowColor: 'rgba(0, 0, 0, 0.8)',
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    },
                  ]}
                >
                  {getText(card.name)}
                </Text>
              </View>
            </>
          ) : (
            <>
              <Text style={[styles.cardEmoji, { fontSize: getResponsiveFontSize(size === 'small' ? 18 : size === 'large' ? 32 : size === 'xlarge' ? 40 : 24) }]}>{card.emoji}</Text>
              <Text style={[styles.cardName, { fontSize: getResponsiveFontSize(size === 'small' ? 8 : size === 'large' ? 14 : size === 'xlarge' ? 16 : 10) }]}>{getText(card.name)}</Text>
            </>
          )}
        </View>
        {slot && (
          <TouchableOpacity
            style={[
              styles.memoButton,
              {
                width: getResponsiveSize(20, 24, 28, 32),
                height: getResponsiveSize(20, 24, 28, 32),
                borderRadius: getResponsiveSize(10, 12, 14, 16),
              },
            ]}
            onPress={() => openMemo(slot)}
          >
            <Text style={[styles.memoButtonText, { fontSize: getResponsiveFontSize(slot.memo ? 14 : 12) }]}>{slot.memo ? '📝' : '✏️'}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // 시간 표시 컴포넌트 (별도로 분리하여 시간 업데이트가 전체 리렌더링을 유발하지 않도록)
  const TimeDisplay = React.memo(() => {
    const [time, setTime] = useState(new Date());
    
    useEffect(() => {
      const timer = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);
    
    return (
      <View style={styles.timeDisplay}>
        <Text style={[styles.currentTime, { fontSize: getResponsiveFontSize(36) }]}>
          {time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </Text>
        <Text style={[styles.currentDate, { fontSize: getResponsiveFontSize(16) }]}>
          {time.toLocaleDateString(currentLanguage === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </Text>
      </View>
    );
  });

  // 현재 시간 카드 섹션 컴포넌트 (시간 업데이트로 인한 리렌더링 방지)
  const CurrentCardSection = React.memo(() => {
    const currentHour = currentTime.getHours();
    const currentSlot = timeSlots.find(s => s.hour === currentHour);
    const currentCard = currentSlot?.card;
    
    return (
      <View style={styles.currentCardSection}>
        <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(18) }]}>✨ {getText({ ko: '현재 시간 카드', en: 'Current Hour Card' })}</Text>
        {currentCard ? (
          <TarotCardView card={currentCard} hour={currentHour} slot={currentSlot} size="xlarge" scale={1.5} />
        ) : (
          <View
            style={[
              styles.noCardContainer,
              { width: getResponsiveSize(140, 160, 180, 200), height: getResponsiveSize(210, 240, 270, 300) },
            ]}
          >
            <Text style={[styles.noCardText, { fontSize: getResponsiveFontSize(14) }]}>{getText({ ko: '카드를 뽑아보세요!', en: 'Draw a card!' })}</Text>
            <TouchableOpacity
              style={[styles.drawCardButton, { paddingHorizontal: getResponsiveSpacing(20), paddingVertical: getResponsiveSpacing(10), borderRadius: getResponsiveSpacing(20) }]}
              onPress={drawCurrentCard}
            >
              <Text style={[styles.drawCardButtonText, { fontSize: getResponsiveFontSize(14) }]}>✨ {getText({ ko: '카드 뽑기', en: 'Draw Card' })}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  });

  // 메인 페이지
  const MainPage = () => {
    const handleMainScroll = useCallback((event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      saveScrollPosition('main', offsetY);
    }, [saveScrollPosition]);

    return (
      <ScrollView 
        style={styles.pageContainer}
        onScroll={handleMainScroll}
        scrollEventThrottle={16}
        contentOffset={{ x: 0, y: getScrollPosition('main') }}
      >
      <TimeDisplay />
      <CurrentCardSection />

      <View style={[styles.controlButtons, { paddingHorizontal: getResponsiveSpacing(15), marginBottom: getResponsiveSpacing(20) }]}>
        <TouchableOpacity
          style={[styles.controlButton, styles.currentCardButton, { paddingVertical: getResponsiveSpacing(12), paddingHorizontal: getResponsiveSpacing(16), borderRadius: getResponsiveSpacing(20), minWidth: width * (isTablet ? 0.2 : 0.4) }]}
          onPress={drawCurrentCard}
        >
          <Text style={[styles.controlButtonText, { fontSize: getResponsiveFontSize(14) }]}>✨ {getText({ ko: '현재 카드', en: 'Current Card' })}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.allCardsButton, { paddingVertical: getResponsiveSpacing(12), paddingHorizontal: getResponsiveSpacing(16), borderRadius: getResponsiveSpacing(20), minWidth: width * (isTablet ? 0.2 : 0.4) }]}
          onPress={drawAllCards}
        >
          <Text style={[styles.controlButtonText, { fontSize: getResponsiveFontSize(14) }]}>🎴 {getText({ ko: '24시간', en: '24 Hours' })}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.horizontalTimelineSection, { paddingHorizontal: getResponsiveSpacing(20) }]}>
        <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(18), marginBottom: getResponsiveSpacing(15) }]}>🕐 {getText({ ko: '24시간 타임라인', en: '24-Hour Timeline' })}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: getResponsiveSpacing(10) }}>
          {timeSlots.map(slot => (
            <View
              key={slot.hour}
              style={[
                styles.horizontalTimeSlot,
                {
                  padding: getResponsiveSpacing(10),
                  marginHorizontal: getResponsiveSpacing(5),
                  minWidth: getResponsiveSize(70, 80, 90, 100),
                  borderRadius: getResponsiveSpacing(12),
                },
                slot.isActive && styles.currentHorizontalTimeSlot,
              ]}
            >
              <Text style={[styles.horizontalTimeSlotHour, { fontSize: getResponsiveFontSize(12), marginBottom: getResponsiveSpacing(8) }, slot.isActive && styles.currentTimeSlotText]}>
                {slot.hour.toString().padStart(2, '0')}:00
              </Text>
              {slot.card ? (
                <TarotCardView card={slot.card} hour={slot.hour} slot={slot} size="small" />
              ) : (
                <View
                  style={[
                    styles.horizontalEmptyCard,
                    { width: getResponsiveSize(40, 50, 60, 70), height: getResponsiveSize(60, 75, 90, 105), borderRadius: getResponsiveSpacing(8) },
                  ]}
                >
                  <Text style={[styles.horizontalEmptyCardText, { fontSize: getResponsiveFontSize(18) }]}>?</Text>
                </View>
              )}
              {slot.memo && <Text style={[styles.horizontalMemoIndicator, { fontSize: getResponsiveFontSize(10), marginTop: getResponsiveSpacing(4) }]}>📝</Text>}
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
    );
  };

  // 스프레드 목록 페이지
  const SpreadListPage = () => (
    <ScrollView 
      style={styles.pageContainer}
      onScroll={(event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        saveScrollPosition('spread', offsetY);
      }}
      scrollEventThrottle={16}
      contentOffset={{ x: 0, y: getScrollPosition('spread') }}
    >
      <Text style={styles.pageTitle}>🔮 {getText({ ko: '스프레드', en: 'Spreads' })}</Text>
      
      {spreads.map(spread => (
        <TouchableOpacity
          key={spread.id}
          style={styles.spreadListItem}
          onPress={() => setCurrentSpread(spread)}
        >
          <View style={styles.spreadListItemContent}>
            <Text style={styles.spreadListItemTitle}>{getText(spread.name)}</Text>
            <Text style={styles.spreadListItemDescription}>{getText(spread.description)}</Text>
            <Text style={styles.spreadListItemInfo}>
              {spread.cards.length}장 {spread.hasTimeline ? '+4장 시간선' : ''}
            </Text>
          </View>
          <Text style={styles.spreadListItemArrow}>▶</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // 스프레드 상세 페이지
  const SpreadDetailPage = () => {
    if (!currentSpread) return <SpreadListPage />;

    const containerWidth = width - getResponsiveSpacing(40);
    const containerHeight = height * 0.5;

    return (
      <ScrollView style={styles.pageContainer}>
        <View style={styles.spreadDetailHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setCurrentSpread(null)}
          >
            <Text style={styles.backButtonText}>← {getText({ ko: '목록으로', en: 'Back to List' })}</Text>
          </TouchableOpacity>
          <Text style={styles.spreadDetailTitle}>{getText(currentSpread.name)}</Text>
        </View>

        <View style={styles.spreadTitleInput}>
          <TextInput
            style={styles.spreadTitleInputField}
            value={spreadTitle}
            onChangeText={setSpreadTitle}
            placeholder={getText({ ko: '스프레드 제목 입력...', en: 'Enter spread title...' })}
            placeholderTextColor="#999"
          />
        </View>

        <View 
          ref={spreadViewRef}
          style={[
            styles.spreadContainer,
            {
              width: containerWidth,
              height: containerHeight,
              alignSelf: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: getResponsiveSpacing(15),
              marginVertical: getResponsiveSpacing(20),
            },
          ]}
        >
          {currentSpread.cards.map(card => (
            <SpreadCardSlot
              key={card.position}
              spreadCard={card}
              containerWidth={containerWidth}
              containerHeight={containerHeight}
            />
          ))}
        </View>

        {/* 시간선 카드 표시 */}
        {currentSpread.timelineCards && currentSpread.timelineCards.length > 0 && (
          <View style={styles.timelineCardsContainer}>
            <Text style={styles.timelineTitle}>⏰ {getText({ ko: '시간선 카드', en: 'Timeline Cards' })}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {currentSpread.timelineCards.map((card, index) => (
                <View key={index} style={styles.timelineCard}>
                  <Text style={styles.timelineCardLabel}>{index + 1}</Text>
                  <TarotCardView card={card} hour={0} size="small" />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.spreadControls}>
          {!currentSpread.cards.some(c => c.card) ? (
            <TouchableOpacity
              style={[styles.controlButton, styles.drawSpreadButton]}
              onPress={() => drawSpreadCards(currentSpread)}
            >
              <Text style={styles.controlButtonText}>🎴 {getText({ ko: '카드 뽑기', en: 'Draw Cards' })}</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.controlButton, styles.redrawButton]}
                onPress={redrawSpread}
              >
                <Text style={styles.controlButtonText}>🔄 {getText({ ko: '다시 뽑기', en: 'Redraw' })}</Text>
              </TouchableOpacity>

              {showTimelineDraw && (
                <TouchableOpacity
                  style={[styles.controlButton, styles.timelineButton]}
                  onPress={drawTimelineCards}
                >
                  <Text style={styles.controlButtonText}>⏰ {getText({ ko: '시간선 뽑기', en: 'Draw Timeline' })}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.controlButton, styles.saveSpreadButton]}
                onPress={saveSpread}
              >
                <Text style={styles.controlButtonText}>💾 {getText({ ko: '저장하기', en: 'Save' })}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    );
  };

  // 스프레드 페이지 (목록 또는 상세)
  const SpreadPage = () => {
    return currentSpread ? <SpreadDetailPage /> : <SpreadListPage />;
  };

  // 타임라인 페이지
  const TimelinePage = () => (
    <ScrollView 
      style={styles.pageContainer}
      onScroll={(event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        saveScrollPosition('timeline', offsetY);
      }}
      scrollEventThrottle={16}
      contentOffset={{ x: 0, y: getScrollPosition('timeline') }}
    >
      <Text style={styles.pageTitle}>🕐 {getText({ ko: '24시간 타로 타임라인', en: '24-Hour Tarot Timeline' })}</Text>
      <View style={styles.controlButtons}>
        <TouchableOpacity style={[styles.controlButton, styles.currentCardButton]} onPress={drawCurrentCard}>
          <Text style={styles.controlButtonText}>✨ {getText({ ko: '현재 카드', en: 'Current Card' })}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlButton, styles.allCardsButton]} onPress={drawAllCards}>
          <Text style={styles.controlButtonText}>🎴 {getText({ ko: '24시간', en: '24 Hours' })}</Text>
        </TouchableOpacity>
      </View>
      {timeSlots.map(slot => (
        <View key={slot.hour} style={[styles.timeSlot, slot.isActive && styles.currentTimeSlot]}>
          <Text style={[styles.timeSlotHour, slot.isActive && styles.currentTimeSlotText]}>{slot.hour.toString().padStart(2, '0')}:00</Text>
          <View style={styles.timeSlotContent}>
            {slot.card ? (
              <TarotCardView card={slot.card} hour={slot.hour} slot={slot} size="small" />
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyCardText}>?</Text>
              </View>
            )}
            {slot.memo && (
              <Text style={styles.timeSlotMemo} numberOfLines={1}>
                📝 {slot.memo}
              </Text>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );

  // 일기 페이지
  const DiaryPage = () => (
    <ScrollView 
      style={styles.pageContainer}
      onScroll={(event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        saveScrollPosition('diary', offsetY);
      }}
      scrollEventThrottle={16}
      contentOffset={{ x: 0, y: getScrollPosition('diary') }}
    >
      <Text style={styles.pageTitle}>📖 {getText({ ko: '타로 일기', en: 'Tarot Diary' })}</Text>
      <TouchableOpacity style={[styles.controlButton, styles.saveButton]} onPress={saveTodayDiary}>
        <Text style={styles.controlButtonText}>💾 {getText({ ko: "오늘 일기 저장", en: "Save Today's Diary" })}</Text>
      </TouchableOpacity>
      {diaryEntries.length === 0 ? (
        <Text style={styles.emptyText}>{getText({ ko: '저장된 일기가 없습니다.\n카드를 뽑고 일기를 저장해보세요!', en: 'No saved diary entries.\nDraw cards and save your diary!' })}</Text>
      ) : (
        diaryEntries.map(entry => (
          <View key={entry.id} style={styles.diaryItem}>
            <View style={styles.diaryItemHeader}>
              <Text style={styles.diaryDate}>{entry.date}</Text>
              <TouchableOpacity onPress={() => deleteDiaryEntry(entry.id)}>
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {entry.timeSlots.map(slot => (
                <View key={slot.hour} style={styles.diaryCardItem}>
                  <Text style={styles.diaryCardTime}>{slot.hour.toString().padStart(2, '0')}:00</Text>
                  {slot.card && <TarotCardView card={slot.card} hour={slot.hour} size="small" />}
                  {slot.memo && (
                    <Text style={styles.diaryMemo} numberOfLines={2}>
                      📝 {slot.memo}
                    </Text>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        ))
      )}
    </ScrollView>
  );

  // 설정 페이지
  const SettingsPage = () => (
    <ScrollView 
      style={styles.pageContainer}
      onScroll={(event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        saveScrollPosition('settings', offsetY);
      }}
      scrollEventThrottle={16}
      contentOffset={{ x: 0, y: getScrollPosition('settings') }}
    >
      <Text style={styles.pageTitle}>⚙️ {getText({ ko: '설정', en: 'Settings' })}</Text>
      {/* 포인트 표시 */}
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>💎 {getText({ ko: '보유 포인트', en: 'Points' })} : {userPoints.toLocaleString()}</Text>
      </View>

      <TouchableOpacity style={styles.banner} onPress={handleBannerPress}>
        <Text style={styles.bannerText}>🎨 {getText({ ko: '앱스토어에서 더 많은 테마 확인하기', en: 'Check more themes in App Store' })}</Text>
      </TouchableOpacity>
      <View style={styles.settingSection}>
        <Text style={styles.settingSectionTitle}>🎨 {getText({ ko: '테마 상점', en: 'Theme Store' })}</Text>
        <TouchableOpacity style={styles.settingButton} onPress={() => setShowThemeStore(true)}>
          <Text style={styles.settingButtonText}>🛍️ {getText({ ko: '테마 상점 열기', en: 'Open Theme Store' })}</Text>
        </TouchableOpacity>
        <View style={styles.currentThemeInfo}>
          <Text style={styles.currentThemeLabel}>{getText({ ko: '현재 테마:', en: 'Current Theme:' })}</Text>
          <Text style={styles.currentThemeName}>{getText(currentTheme.name)}</Text>
        </View>
      </View>
      <View style={styles.settingSection}>
        <Text style={styles.settingSectionTitle}>🌍 {getText({ ko: '언어 설정', en: 'Language Settings' })}</Text>
        <View style={styles.languageButtons}>
          <TouchableOpacity style={[styles.languageButton, currentLanguage === 'ko' && styles.activeLanguageButton]} onPress={() => setCurrentLanguage('ko')}>
            <Text style={styles.languageButtonText}>🇰🇷 한국어</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.languageButton, currentLanguage === 'en' && styles.activeLanguageButton]} onPress={() => setCurrentLanguage('en')}>
            <Text style={styles.languageButtonText}>🇺🇸 English</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.settingSection}>
        <Text style={styles.settingSectionTitle}>📋 {getText({ ko: '게시판', en: 'Board' })}</Text>
        <TouchableOpacity style={styles.settingButton} onPress={() => setShowNoticeBoard(true)}>
          <Text style={styles.settingButtonText}>📢 {getText({ ko: '공지사항', en: 'Notice' })}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingButton} onPress={() => setShowInquiryBoard(true)}>
          <Text style={styles.settingButtonText}>💬 {getText({ ko: '문의하기', en: 'Inquiry' })}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // 현재 탭 페이지 렌더링
  const renderCurrentPage = () => {
    switch (currentTab) {
      case 'main':
        return <MainPage />;
      case 'spread':
        return <SpreadPage />;
      case 'timeline':
        return <TimelinePage />;
      case 'diary':
        return <DiaryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <MainPage />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 50 : 25 }]}>
        <Text style={styles.appTitle}>🔮 타로 타이머</Text>
      </View>
      <View style={styles.pageContent}>{renderCurrentPage()}</View>
      <View style={[styles.tabBar, { minHeight: Platform.OS === 'ios' ? 85 : 65 }]}>
        <TouchableOpacity style={[styles.tabButton, currentTab === 'spread' && styles.activeTab]} onPress={() => setCurrentTab('spread')}>
          <Text style={[styles.tabButtonText, currentTab === 'spread' && styles.activeTabText]}>{getText({ ko: '스프\n레드', en: 'Sprea\nd' })}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, currentTab === 'timeline' && styles.activeTab]} onPress={() => setCurrentTab('timeline')}>
          <Text style={[styles.tabButtonText, currentTab === 'timeline' && styles.activeTabText]}>{getText({ ko: '타임\n라인', en: 'Time\nline' })}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, currentTab === 'main' && styles.activeTab]} onPress={() => setCurrentTab('main')}>
          <Text style={[styles.tabButtonText, currentTab === 'main' && styles.activeTabText]}>{getText({ ko: '홈\n(메인)', en: 'Home\n(Main)' })}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, currentTab === 'diary' && styles.activeTab]} onPress={() => setCurrentTab('diary')}>
          <Text style={[styles.tabButtonText, currentTab === 'diary' && styles.activeTabText]}>{getText({ ko: '타로\n일기', en: 'Tarot\nDiary' })}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, currentTab === 'settings' && styles.activeTab]} onPress={() => setCurrentTab('settings')}>
          <Text style={[styles.tabButtonText, currentTab === 'settings' && styles.activeTabText]}>{getText({ ko: '타로\n설정', en: 'Tarot\nSettings' })}</Text>
        </TouchableOpacity>
      </View>

      {/* 메모 모달 */}
      {showMemo && (
        <Modal visible={showMemo} transparent animationType="slide" onRequestClose={() => setShowMemo(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>✏️ {selectedTimeSlot?.hour.toString().padStart(2, '0')}:00 {getText({ ko: '메모', en: 'Memo' })}</Text>
              <TextInput
                style={styles.memoInput}
                value={memoText}
                onChangeText={setMemoText}
                placeholder={getText({ ko: '이 시간의 카드에 대한 메모를 작성하세요...', en: "Write a memo about this hour's card..." })}
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity style={[styles.modalActionButton, styles.cancelButton]} onPress={() => setShowMemo(false)}>
                  <Text style={styles.memoActionText}>{getText({ ko: '취소', en: 'Cancel' })}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalActionButton, styles.saveButton]} onPress={saveMemo}>
                  <Text style={styles.memoActionText}>{getText({ ko: '저장', en: 'Save' })}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* 공지사항 모달 */}
      {showNoticeBoard && (
        <Modal visible={showNoticeBoard} transparent animationType="slide" onRequestClose={() => setShowNoticeBoard(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>📢 {getText({ ko: '공지사항', en: 'Notice' })}</Text>
              <ScrollView style={styles.noticeList}>
                {NOTICE_POSTS.map(notice => (
                  <View key={notice.id} style={[styles.noticeItem, notice.isImportant && styles.importantNotice]}>
                    <View style={styles.noticeHeader}>
                      <Text style={[styles.noticeTitle, notice.isImportant && styles.importantNoticeTitle]}>{notice.isImportant && '🔥 '} {getText(notice.title)}</Text>
                      <Text style={styles.noticeDate}>{notice.date}</Text>
                    </View>
                    <Text style={styles.noticeContent}>{getText(notice.content)}</Text>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowNoticeBoard(false)}>
                <Text style={styles.closeButtonText}>{getText({ ko: '닫기', en: 'Close' })}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* 테마 상점 모달 */}
      {showThemeStore && (
        <Modal visible={showThemeStore} transparent animationType="slide" onRequestClose={() => setShowThemeStore(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>🛍️ {getText({ ko: '테마 상점', en: 'Theme Store' })}</Text>
              <View style={styles.pointsDisplay}>
                <Text style={styles.pointsDisplayText}>💎 {userPoints.toLocaleString()} {getText({ ko: '포인트', en: 'Points' })}</Text>
              </View>
              <ScrollView style={styles.themeList}>
                {themes.map(theme => (
                  <View key={theme.id} style={[styles.themeItem, currentTheme.id === theme.id && styles.currentThemeItem]}>
                    <View style={styles.themeInfo}>
                      <Text style={styles.themeName}>
                        {getText(theme.name)}
                        {theme.isDefault ? ' (기본)' : ''}
                        {currentTheme.id === theme.id ? ' ✓' : ''}
                      </Text>
                      <Text style={styles.themeDescription}>{getText(theme.description)}</Text>
                      <Text style={styles.themePrice}>
                        {theme.price === 0 ? getText({ ko: '무료', en: 'Free' }) : `${theme.price.toLocaleString()} ${getText({ ko: '포인트', en: 'pts' })}`}
                      </Text>
                    </View>
                    {theme.isPurchased ? (
                      currentTheme.id === theme.id ? (
                        <View style={[styles.themeButton, styles.currentThemeButton]}>
                          <Text style={styles.themeButtonText}>{getText({ ko: '사용 중', en: 'In Use' })}</Text>
                        </View>
                      ) : (
                        <TouchableOpacity style={[styles.themeButton, styles.useThemeButton]} onPress={() => setCurrentTheme(theme)}>
                          <Text style={styles.themeButtonText}>{getText({ ko: '사용하기', en: 'Use' })}</Text>
                        </TouchableOpacity>
                      )
                    ) : (
                      <TouchableOpacity style={[styles.themeButton, styles.buyThemeButton]} onPress={() => purchaseTheme(theme)}>
                        <Text style={styles.themeButtonText}>{getText({ ko: '구매하기', en: 'Buy' })}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowThemeStore(false)}>
                <Text style={styles.closeButtonText}>{getText({ ko: '닫기', en: 'Close' })}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* 문의 모달 */}
      {showInquiryBoard && (
        <Modal visible={showInquiryBoard} transparent animationType="slide" onRequestClose={() => setShowInquiryBoard(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>💬 {getText({ ko: '문의하기', en: 'Inquiry' })}</Text>
              <ScrollView>
                <View style={styles.inquiryForm}>
                  <TextInput
                    style={styles.inquiryTitleInput}
                    value={inquiryTitle}
                    onChangeText={setInquiryTitle}
                    placeholder={getText({ ko: '문의 제목을 입력하세요', en: 'Enter inquiry title' })}
                    placeholderTextColor="#999"
                  />
                  <TextInput
                    style={styles.inquiryContentInput}
                    value={inquiryContent}
                    onChangeText={setInquiryContent}
                    placeholder={getText({ ko: '문의 내용을 입력하세요', en: 'Enter inquiry content' })}
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={4}
                  />
                  <TouchableOpacity style={styles.submitButton} onPress={submitInquiry}>
                    <Text style={styles.submitButtonText}>{getText({ ko: '문의 제출', en: 'Submit Inquiry' })}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.inquiryListTitle}>{getText({ ko: '내 문의 내역', en: 'My Inquiries' })}</Text>
                {inquiries.length === 0 ? (
                  <Text style={styles.emptyText}>{getText({ ko: '문의 내역이 없습니다.', en: 'No inquiry history.' })}</Text>
                ) : (
                  inquiries.map(inquiry => (
                    <View key={inquiry.id} style={styles.inquiryItem}>
                      <View style={styles.inquiryItemHeader}>
                        <Text style={styles.inquiryItemTitle}>{inquiry.title}</Text>
                        <Text style={[styles.inquiryStatus, inquiry.status === 'answered' ? styles.answeredStatus : styles.waitingStatus]}>
                          {inquiry.status === 'answered' ? getText({ ko: '답변완료', en: 'Answered' }) : getText({ ko: '대기중', en: 'Waiting' })}
                        </Text>
                      </View>
                      <Text style={styles.inquiryItemContent}>{inquiry.content}</Text>
                      <Text style={styles.inquiryItemDate}>{inquiry.date}</Text>
                    </View>
                  ))
                )}
              </ScrollView>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowInquiryBoard(false)}>
                <Text style={styles.closeButtonText}>{getText({ ko: '닫기', en: 'Close' })}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

// 스타일
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  appTitle: {
    color: '#fff',
    fontSize: getResponsiveFontSize(24),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pageContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  pageContent: {
    flex: 1,
  },
  pageTitle: {
    color: '#fff',
    fontSize: getResponsiveFontSize(24),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: getResponsiveSpacing(20),
    marginTop: getResponsiveSpacing(20),
    paddingHorizontal: getResponsiveSpacing(20),
  },
  timeDisplay: {
    alignItems: 'center',
    paddingVertical: getResponsiveSpacing(20),
  },
  currentTime: {
    color: '#FF6B9D',
    fontSize: getResponsiveFontSize(36),
    fontWeight: 'bold',
    marginBottom: 5,
  },
  currentDate: {
    color: '#ccc',
    fontSize: getResponsiveFontSize(16),
    textAlign: 'center',
    paddingHorizontal: getResponsiveSpacing(20),
  },
  currentCardSection: {
    alignItems: 'center',
    paddingHorizontal: getResponsiveSpacing(20),
    marginBottom: getResponsiveSpacing(20),
  },
  sectionTitle: {
    color: '#fff',
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: getResponsiveSpacing(15),
  },
  noCardContainer: {
    width: getResponsiveSize(140, 160, 180, 200),
    height: getResponsiveSize(210, 240, 270, 300),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: getResponsiveSpacing(15),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
  },
  noCardText: {
    color: '#999',
    fontSize: getResponsiveFontSize(14),
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: getResponsiveSpacing(10),
  },
  drawCardButton: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: getResponsiveSpacing(20),
    paddingVertical: getResponsiveSpacing(10),
    borderRadius: getResponsiveSpacing(20),
  },
  drawCardButtonText: {
    color: '#fff',
    fontSize: getResponsiveFontSize(14),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  horizontalTimelineSection: {
    paddingHorizontal: getResponsiveSpacing(20),
    paddingBottom: getResponsiveSpacing(20),
  },
  horizontalTimeSlot: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: getResponsiveSpacing(12),
    padding: getResponsiveSpacing(10),
    marginHorizontal: getResponsiveSpacing(5),
    minWidth: getResponsiveSize(70, 80, 90, 100),
  },
  currentHorizontalTimeSlot: {
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },
  horizontalTimeSlotHour: {
    color: '#fff',
    fontSize: getResponsiveFontSize(12),
    fontWeight: 'bold',
    marginBottom: getResponsiveSpacing(8),
    textAlign: 'center',
  },
  horizontalEmptyCard: {
    width: getResponsiveSize(40, 50, 60, 70),
    height: getResponsiveSize(60, 75, 90, 105),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: getResponsiveSpacing(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
  },
  horizontalEmptyCardText: {
    color: '#999',
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
  },
  horizontalMemoIndicator: {
    fontSize: getResponsiveFontSize(10),
    marginTop: getResponsiveSpacing(4),
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: getResponsiveSpacing(40),
  },
  comingSoonTitle: {
    color: '#FF6B9D',
    fontSize: getResponsiveFontSize(32),
    fontWeight: 'bold',
    marginBottom: getResponsiveSpacing(20),
    textAlign: 'center',
  },
  comingSoonText: {
    color: '#ccc',
    fontSize: getResponsiveFontSize(18),
    textAlign: 'center',
    lineHeight: 24,
  },
  controlButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: getResponsiveSpacing(15),
    marginBottom: getResponsiveSpacing(20),
    gap: getResponsiveSpacing(10),
  },
  controlButton: {
    paddingVertical: getResponsiveSpacing(12),
    paddingHorizontal: getResponsiveSpacing(16),
    borderRadius: getResponsiveSpacing(20),
    marginVertical: 5,
    minWidth: width * 0.4,
    maxWidth: width * 0.45,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  currentCardButton: {
    backgroundColor: '#FF6B9D',
  },
  allCardsButton: {
    backgroundColor: '#4ECDC4',
  },
  saveButton: {
    backgroundColor: '#45B7D1',
    alignSelf: 'center',
    marginHorizontal: getResponsiveSpacing(20),
    marginBottom: getResponsiveSpacing(20),
  },
  controlButtonText: {
    color: '#fff',
    fontSize: getResponsiveFontSize(14),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: getResponsiveSpacing(15),
    padding: getResponsiveSpacing(15),
    marginBottom: getResponsiveSpacing(10),
    marginHorizontal: getResponsiveSpacing(20),
  },
  currentTimeSlot: {
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },
  timeSlotHour: {
    color: '#fff',
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    width: getResponsiveSize(60, 70, 80, 90),
  },
  currentTimeSlotText: {
    color: '#FF6B9D',
  },
  timeSlotContent: {
    flex: 1,
    marginLeft: getResponsiveSpacing(15),
  },
  timeSlotMemo: {
    color: '#4CAF50',
    fontSize: getResponsiveFontSize(12),
    fontStyle: 'italic',
    marginTop: 5,
  },
  cardContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  card: {
    borderRadius: getResponsiveSpacing(12),
    padding: getResponsiveSpacing(8),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  cardEmoji: {
    marginBottom: 4,
  },
  cardName: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  cardImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 4,
    borderBottomLeftRadius: getResponsiveSpacing(12),
    borderBottomRightRadius: getResponsiveSpacing(12),
  },
  memoButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: getResponsiveSize(10, 12, 14, 16),
    width: getResponsiveSize(20, 24, 28, 32),
    height: getResponsiveSize(20, 24, 28, 32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  memoButtonText: {
    fontSize: getResponsiveFontSize(12),
    color: '#fff',
  },
  emptyCard: {
    width: getResponsiveSize(50, 60, 70, 80),
    height: getResponsiveSize(75, 90, 105, 120),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: getResponsiveSpacing(12),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
  },
  emptyCardText: {
    color: '#999',
    fontSize: getResponsiveFontSize(24),
    fontWeight: 'bold',
  },
  diaryItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: getResponsiveSpacing(15),
    padding: getResponsiveSpacing(15),
    marginBottom: getResponsiveSpacing(15),
    marginHorizontal: getResponsiveSpacing(20),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  diaryItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getResponsiveSpacing(10),
  },
  diaryDate: {
    color: '#FF6B9D',
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
  },
  deleteButtonText: {
    fontSize: getResponsiveFontSize(18),
    opacity: 0.7,
  },
  diaryCardItem: {
    alignItems: 'center',
    marginRight: getResponsiveSpacing(15),
  },
  diaryCardTime: {
    color: '#fff',
    fontSize: getResponsiveFontSize(12),
    marginBottom: 5,
    textAlign: 'center',
  },
  diaryMemo: {
    color: '#4CAF50',
    fontSize: getResponsiveFontSize(10),
    textAlign: 'center',
    marginTop: 5,
    width: getResponsiveSize(60, 70, 80, 90),
  },
  emptyText: {
    color: '#999',
    fontSize: getResponsiveFontSize(16),
    textAlign: 'center',
    marginVertical: getResponsiveSpacing(20),
    lineHeight: 24,
    marginHorizontal: getResponsiveSpacing(20),
  },
  banner: {
    backgroundColor: '#FF6B9D',
    borderRadius: getResponsiveSpacing(15),
    padding: getResponsiveSpacing(15),
    marginBottom: getResponsiveSpacing(20),
    marginHorizontal: getResponsiveSpacing(20),
    alignItems: 'center',
  },
  bannerText: {
    color: '#fff',
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  settingSection: {
    marginBottom: getResponsiveSpacing(20),
    paddingBottom: getResponsiveSpacing(15),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: getResponsiveSpacing(20),
  },
  settingSectionTitle: {
    color: '#FF6B9D',
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    marginBottom: getResponsiveSpacing(15),
  },
  languageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: getResponsiveSpacing(10),
  },
  languageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flex: 1,
    alignItems: 'center',
    paddingVertical: getResponsiveSpacing(10),
    paddingHorizontal: getResponsiveSpacing(20),
    borderRadius: getResponsiveSpacing(15),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeLanguageButton: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  languageButtonText: {
    color: '#fff',
    fontSize: getResponsiveFontSize(14),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  settingButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: getResponsiveSpacing(15),
    paddingHorizontal: getResponsiveSpacing(20),
    borderRadius: getResponsiveSpacing(15),
    marginBottom: getResponsiveSpacing(10),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  settingButtonText: {
    color: '#fff',
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
  },
  // 포인트/테마 관련
  pointsContainer: {
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: getResponsiveSpacing(20),
    marginBottom: getResponsiveSpacing(20),
    borderWidth: 1,
    borderColor: '#FF6B9D',
    alignItems: 'center',
  },
  pointsText: {
    color: '#FF6B9D',
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
  },
  pointsDisplay: {
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  pointsDisplayText: {
    color: '#FF6B9D',
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
  },
  currentThemeInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  currentThemeLabel: {
    color: '#ccc',
    fontSize: getResponsiveFontSize(14),
    marginBottom: 5,
  },
  currentThemeName: {
    color: '#FF6B9D',
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
  },
  // 테마 상점 스타일
  themeList: {
    maxHeight: height * 0.5,
  },
  themeItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  currentThemeItem: {
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderColor: '#FF6B9D',
  },
  themeInfo: {
    flex: 1,
    marginRight: 15,
  },
  themeName: {
    color: '#fff',
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    marginBottom: 5,
  },
  themeDescription: {
    color: '#ccc',
    fontSize: getResponsiveFontSize(14),
    marginBottom: 8,
    lineHeight: 18,
  },
  themePrice: {
    color: '#FF6B9D',
    fontSize: getResponsiveFontSize(14),
    fontWeight: 'bold',
  },
  themeButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
    height: 36,
  },
  buyThemeButton: {
    backgroundColor: '#4CAF50',
  },
  useThemeButton: {
    backgroundColor: '#2196F3',
  },
  currentThemeButton: {
    backgroundColor: '#999',
  },
  themeButtonText: {
    color: '#fff',
    fontSize: getResponsiveFontSize(14),
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#2a2a4a',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    paddingTop: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: getResponsiveSpacing(8),
    paddingHorizontal: getResponsiveSpacing(4),
  },
  activeTab: {
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
  },
  tabButtonText: {
    color: '#999',
    fontSize: getResponsiveFontSize(12),
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 14,
  },
  activeTabText: {
    color: '#FF6B9D',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2a2a4a',
    borderRadius: getResponsiveSpacing(20),
    padding: getResponsiveSpacing(20),
    width: getResponsiveSize(width * 0.85, width * 0.9, width * 0.9, width * 0.8),
    maxHeight: height * 0.8,
    marginHorizontal: getResponsiveSpacing(10),
  },
  modalTitle: {
    color: '#fff',
    fontSize: getResponsiveFontSize(20),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: getResponsiveSpacing(20),
  },
  closeButton: {
    backgroundColor: '#FF6B9D',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 15,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memoInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: getResponsiveSpacing(15),
    color: '#fff',
    fontSize: getResponsiveFontSize(16),
    minHeight: getResponsiveSize(80, 100, 120, 140),
    maxHeight: getResponsiveSize(200, 250, 300, 350),
    textAlignVertical: 'top',
    marginBottom: getResponsiveSpacing(20),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: getResponsiveSpacing(10),
  },
  modalActionButton: {
    paddingVertical: getResponsiveSpacing(12),
    paddingHorizontal: getResponsiveSpacing(20),
    borderRadius: getResponsiveSpacing(15),
    minWidth: getResponsiveSize(70, 80, 90, 100),
    alignItems: 'center',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  memoActionText: {
    color: '#fff',
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
  },
  noticeList: {
    maxHeight: height * 0.5,
  },
  noticeItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  importantNotice: {
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderWidth: 1,
    borderColor: '#FF6B9D',
  },
  noticeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  noticeTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  importantNoticeTitle: {
    color: '#FF6B9D',
  },
  noticeDate: {
    color: '#999',
    fontSize: 12,
  },
  noticeContent: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  inquiryForm: {
    marginBottom: 20,
  },
  inquiryTitleInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inquiryContentInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inquiryListTitle: {
    color: '#FF6B9D',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inquiryItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inquiryItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  inquiryItemTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  inquiryStatus: {
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    fontWeight: 'bold',
  },
  waitingStatus: {
    backgroundColor: '#FF9800',
    color: '#fff',
  },
  answeredStatus: {
    backgroundColor: '#4CAF50',
    color: '#fff',
  },
  inquiryItemContent: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 5,
  },
  inquiryItemDate: {
    color: '#999',
    fontSize: 10,
  },
  
  // 스프레드 관련 스타일
  spreadListItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: getResponsiveSpacing(15),
    padding: getResponsiveSpacing(20),
    marginBottom: getResponsiveSpacing(15),
    marginHorizontal: getResponsiveSpacing(20),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  spreadListItemContent: {
    flex: 1,
  },
  spreadListItemTitle: {
    color: '#FF6B9D',
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    marginBottom: 5,
  },
  spreadListItemDescription: {
    color: '#ccc',
    fontSize: getResponsiveFontSize(14),
    marginBottom: 5,
    lineHeight: 20,
  },
  spreadListItemInfo: {
    color: '#999',
    fontSize: getResponsiveFontSize(12),
  },
  spreadListItemArrow: {
    color: '#FF6B9D',
    fontSize: getResponsiveFontSize(20),
    marginLeft: 10,
  },
  
  // 스프레드 상세 페이지 스타일
  spreadDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getResponsiveSpacing(20),
    paddingVertical: getResponsiveSpacing(15),
  },
  backButton: {
    paddingVertical: 5,
    paddingRight: 15,
  },
  backButtonText: {
    color: '#FF6B9D',
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
  },
  spreadDetailTitle: {
    color: '#fff',
    fontSize: getResponsiveFontSize(20),
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 60, // 뒤로가기 버튼 공간 확보
  },
  spreadTitleInput: {
    paddingHorizontal: getResponsiveSpacing(20),
    marginBottom: getResponsiveSpacing(15),
  },
  spreadTitleInputField: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: getResponsiveSpacing(12),
    padding: getResponsiveSpacing(15),
    color: '#fff',
    fontSize: getResponsiveFontSize(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  spreadContainer: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: getResponsiveSpacing(15),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  spreadCardSlot: {
    alignItems: 'center',
  },
  spreadCardPosition: {
    color: '#FF6B9D',
    fontSize: getResponsiveFontSize(12),
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    textAlign: 'center',
    minWidth: 20,
  },
  emptySpreadCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
  },
  emptySpreadCardText: {
    color: '#999',
    fontSize: getResponsiveFontSize(14),
    fontWeight: 'bold',
  },
  spreadCardMeaning: {
    color: '#ccc',
    fontSize: getResponsiveFontSize(10),
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  
  // 시간선 카드 스타일
  timelineCardsContainer: {
    paddingHorizontal: getResponsiveSpacing(20),
    marginVertical: getResponsiveSpacing(20),
  },
  timelineTitle: {
    color: '#FF6B9D',
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    marginBottom: getResponsiveSpacing(15),
    textAlign: 'center',
  },
  timelineCard: {
    alignItems: 'center',
    marginRight: getResponsiveSpacing(15),
  },
  timelineCardLabel: {
    color: '#fff',
    fontSize: getResponsiveFontSize(12),
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 107, 157, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 5,
    textAlign: 'center',
    minWidth: 24,
  },
  
  // 스프레드 컨트롤 버튼들
  spreadControls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: getResponsiveSpacing(20),
    paddingBottom: getResponsiveSpacing(30),
    gap: getResponsiveSpacing(10),
  },
  drawSpreadButton: {
    backgroundColor: '#4ECDC4',
    flex: 1,
    minWidth: width * 0.8,
  },
  redrawButton: {
    backgroundColor: '#FF9500',
    minWidth: width * 0.25,
  },
  timelineButton: {
    backgroundColor: '#9B59B6',
    minWidth: width * 0.25,
  },
  saveSpreadButton: {
    backgroundColor: '#4CAF50',
    minWidth: width * 0.25,
  },
});