import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  Switch,
  Alert,
  Dimensions,
  ImageBackground,
  Animated,
  SafeAreaView,
  TextInput,
  Linking,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// 화면 크기 (반응형)
const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 360;
const isMediumScreen = width >= 360 && width < 400;
const isLargeScreen = width >= 400;

// 반응형 크기 계산
const getResponsiveSize = (small: number, medium: number, large: number) => {
  if (isSmallScreen) return small;
  if (isMediumScreen) return medium;
  return large;
};

// 타입 정의
interface MultiLanguageText {
  ko: string;
  en: string;
}

interface TarotCard {
  id: string;
  name: MultiLanguageText;
  keywords: MultiLanguageText[];
  description: MultiLanguageText;
  suit: string;
  number: number;
  type: 'major' | 'minor';
  element?: string;
  emoji: string;
  color: string;
  classicImage: string;
}

interface CardTheme {
  id: string;
  name: MultiLanguageText;
  description: MultiLanguageText;
  thumbnail: string;
  isPremium: boolean;
  price: number;
  previewCards: string[];
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
  title: MultiLanguageText;
  content: MultiLanguageText;
  date: string;
  isImportant: boolean;
}

interface InquiryPost {
  id: string;
  title: string;
  content: string;
  date: string;
  status: 'pending' | 'answered';
  answer?: string;
}

// 언어 타입
type Language = 'ko' | 'en';

// 상수
const LANGUAGES = [
  { code: 'ko' as Language, name: '한국어', flag: '🇰🇷' },
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' }
];

// 기본 타로카드 덱 (78장)
const CLASSIC_TAROT_DECK: TarotCard[] = [
  // 메이저 아르카나 (22장)
  {
    id: 'major_00',
    name: { ko: '바보', en: 'The Fool' },
    keywords: [
      { ko: '새로운 시작', en: 'New Beginning' },
      { ko: '순수함', en: 'Innocence' },
      { ko: '모험', en: 'Adventure' }
    ],
    description: { 
      ko: '새로운 여행의 시작을 알리는 카드입니다.',
      en: 'A card that signals the beginning of a new journey.'
    },
    suit: 'Major Arcana',
    number: 0,
    type: 'major',
    emoji: '🃏',
    color: '#FFD700',
    classicImage: 'assets/tarot-cards/classic-tarot/major_00_fool.jpg'
  },
  {
    id: 'major_01',
    name: { ko: '마법사', en: 'The Magician' },
    keywords: [
      { ko: '의지력', en: 'Willpower' },
      { ko: '창조', en: 'Creation' },
      { ko: '실현', en: 'Manifestation' }
    ],
    description: { 
      ko: '강한 의지와 창조력을 나타내는 카드입니다.',
      en: 'A card representing strong will and creativity.'
    },
    suit: 'Major Arcana',
    number: 1,
    type: 'major',
    emoji: '🪄',
    color: '#FF6B6B',
    classicImage: 'assets/tarot-cards/classic-tarot/major_01_magician.jpg'
  },
  {
    id: 'major_02',
    name: { ko: '여교황', en: 'The High Priestess' },
    keywords: [
      { ko: '직감', en: 'Intuition' },
      { ko: '신비', en: 'Mystery' },
      { ko: '내면의 지혜', en: 'Inner Wisdom' }
    ],
    description: { 
      ko: '직관과 내면의 지혜를 상징하는 카드입니다.',
      en: 'A card symbolizing intuition and inner wisdom.'
    },
    suit: 'Major Arcana',
    number: 2,
    type: 'major',
    emoji: '🌙',
    color: '#4ECDC4',
    classicImage: 'assets/tarot-cards/classic-tarot/major_02_high_priestess.jpg'
  },
  {
    id: 'major_03',
    name: { ko: '여황제', en: 'The Empress' },
    keywords: [
      { ko: '풍요', en: 'Abundance' },
      { ko: '모성', en: 'Motherhood' },
      { ko: '창조성', en: 'Creativity' }
    ],
    description: { 
      ko: '풍요로움과 모성적 사랑을 의미하는 카드입니다.',
      en: 'A card meaning abundance and maternal love.'
    },
    suit: 'Major Arcana',
    number: 3,
    type: 'major',
    emoji: '👑',
    color: '#98D8C8',
    classicImage: 'assets/tarot-cards/classic-tarot/major_03_empress.jpg'
  },
  {
    id: 'major_04',
    name: { ko: '황제', en: 'The Emperor' },
    keywords: [
      { ko: '권위', en: 'Authority' },
      { ko: '안정', en: 'Stability' },
      { ko: '리더십', en: 'Leadership' }
    ],
    description: { 
      ko: '강력한 리더십과 안정성을 나타내는 카드입니다.',
      en: 'A card representing strong leadership and stability.'
    },
    suit: 'Major Arcana',
    number: 4,
    type: 'major',
    emoji: '👨‍👑',
    color: '#FF8A80',
    classicImage: 'assets/tarot-cards/classic-tarot/major_04_emperor.jpg'
  },
  {
    id: 'major_05',
    name: { ko: '교황', en: 'The Hierophant' },
    keywords: [
      { ko: '전통', en: 'Tradition' },
      { ko: '영성', en: 'Spirituality' },
      { ko: '지도', en: 'Guidance' }
    ],
    description: { 
      ko: '전통적 가치와 영적 지도를 의미하는 카드입니다.',
      en: 'A card meaning traditional values and spiritual guidance.'
    },
    suit: 'Major Arcana',
    number: 5,
    type: 'major',
    emoji: '🕊️',
    color: '#B39DDB',
    classicImage: 'assets/tarot-cards/classic-tarot/major_05_hierophant.jpg'
  },
  {
    id: 'major_06',
    name: { ko: '연인', en: 'The Lovers' },
    keywords: [
      { ko: '사랑', en: 'Love' },
      { ko: '선택', en: 'Choice' },
      { ko: '조화', en: 'Harmony' }
    ],
    description: { 
      ko: '사랑과 중요한 선택을 상징하는 카드입니다.',
      en: 'A card symbolizing love and important choices.'
    },
    suit: 'Major Arcana',
    number: 6,
    type: 'major',
    emoji: '💕',
    color: '#F48FB1',
    classicImage: 'assets/tarot-cards/classic-tarot/major_06_lovers.jpg'
  },
  // 간단히 몇 개만 더 추가하고 나머지는 생성 함수로 처리
  ...generateRemainingMajorArcana(),
  ...generateMinorArcana()
];

// 나머지 메이저 아르카나 생성
function generateRemainingMajorArcana(): TarotCard[] {
  const remainingMajor = [
    { id: 'major_07', name: { ko: '전차', en: 'The Chariot' }, emoji: '🏺', color: '#81C784' },
    { id: 'major_08', name: { ko: '힘', en: 'Strength' }, emoji: '🦁', color: '#FFB74D' },
    { id: 'major_09', name: { ko: '은둔자', en: 'The Hermit' }, emoji: '🏮', color: '#90A4AE' },
    { id: 'major_10', name: { ko: '운명의 수레바퀴', en: 'Wheel of Fortune' }, emoji: '☸️', color: '#A1887F' },
    { id: 'major_11', name: { ko: '정의', en: 'Justice' }, emoji: '⚖️', color: '#7986CB' },
    { id: 'major_12', name: { ko: '매달린 남자', en: 'The Hanged Man' }, emoji: '🙃', color: '#4DD0E1' },
    { id: 'major_13', name: { ko: '죽음', en: 'Death' }, emoji: '💀', color: '#616161' },
    { id: 'major_14', name: { ko: '절제', en: 'Temperance' }, emoji: '⚗️', color: '#AED581' },
    { id: 'major_15', name: { ko: '악마', en: 'The Devil' }, emoji: '😈', color: '#E57373' },
    { id: 'major_16', name: { ko: '탑', en: 'The Tower' }, emoji: '🗼', color: '#FF7043' },
    { id: 'major_17', name: { ko: '별', en: 'The Star' }, emoji: '⭐', color: '#64B5F6' },
    { id: 'major_18', name: { ko: '달', en: 'The Moon' }, emoji: '🌙', color: '#9575CD' },
    { id: 'major_19', name: { ko: '태양', en: 'The Sun' }, emoji: '☀️', color: '#FFEB3B' },
    { id: 'major_20', name: { ko: '심판', en: 'Judgement' }, emoji: '📯', color: '#F06292' },
    { id: 'major_21', name: { ko: '세계', en: 'The World' }, emoji: '🌍', color: '#26A69A' }
  ];

  return remainingMajor.map((card, index) => ({
    ...card,
    keywords: [
      { ko: '키워드1', en: 'Keyword1' },
      { ko: '키워드2', en: 'Keyword2' },
      { ko: '키워드3', en: 'Keyword3' }
    ],
    description: { 
      ko: `${card.name.ko}의 의미를 나타내는 카드입니다.`,
      en: `A card representing the meaning of ${card.name.en}.`
    },
    suit: 'Major Arcana',
    number: index + 7,
    type: 'major' as const,
    classicImage: `assets/tarot-cards/classic-tarot/major_${String(index + 7).padStart(2, '0')}_${card.name.en.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z_]/g, '')}.jpg`
  }));
}

// 마이너 아르카나 생성
function generateMinorArcana(): TarotCard[] {
  const suits = [
    { name: { ko: '컵', en: 'Cups' }, emoji: '🏆', color: '#2196F3', element: 'Water' },
    { name: { ko: '완드', en: 'Wands' }, emoji: '🪄', color: '#FF5722', element: 'Fire' },
    { name: { ko: '검', en: 'Swords' }, emoji: '⚔️', color: '#607D8B', element: 'Air' },
    { name: { ko: '펜타클', en: 'Pentacles' }, emoji: '🪙', color: '#FF9800', element: 'Earth' }
  ];

  const cards: TarotCard[] = [];

  suits.forEach((suit, suitIndex) => {
    for (let i = 1; i <= 14; i++) {
      let cardName: MultiLanguageText;
      if (i <= 10) {
        cardName = { ko: `${suit.name.ko} ${i}`, en: `${i} of ${suit.name.en}` };
      } else {
        const courtCards = [
          { ko: '잭', en: 'Jack' },
          { ko: '퀸', en: 'Queen' },
          { ko: '킹', en: 'King' },
          { ko: '에이스', en: 'Ace' }
        ];
        const courtIndex = i - 11;
        cardName = { ko: `${suit.name.ko} ${courtCards[courtIndex].ko}`, en: `${courtCards[courtIndex].en} of ${suit.name.en}` };
      }

      cards.push({
        id: `minor_${suitIndex}_${i}`,
        name: cardName,
        keywords: [
          { ko: '키워드1', en: 'Keyword1' },
          { ko: '키워드2', en: 'Keyword2' }
        ],
        description: { 
          ko: `${cardName.ko}의 의미를 나타내는 카드입니다.`,
          en: `A card representing the meaning of ${cardName.en}.`
        },
        suit: suit.name.en,
        number: i,
        type: 'minor',
        element: suit.element,
        emoji: suit.emoji,
        color: suit.color,
        classicImage: `assets/tarot-cards/classic-tarot/minor_${suit.name.en.toLowerCase()}_${String(i).padStart(2, '0')}.jpg`
      });
    }
  });

// 카드 테마들
const CARD_THEMES: CardTheme[] = [

// 공지사항 및 문의 데이터
const NOTICE_POSTS: NoticePost[] = [
  {
    id: 'notice_001',
    title: { ko: '타로 타이머 앱 출시!', en: 'Tarot Timer App Launch!' },
    content: { 
      ko: '24시간 타로 카드와 함께하는 의미있는 하루를 시작하세요. 새로운 기능들을 확인해보세요!',
      en: 'Start a meaningful day with 24-hour tarot cards. Check out the new features!'
    },
    date: '2025-01-15',
    isImportant: true
  },
  {
    id: 'notice_002',
    title: { ko: '타로 일기 기능 추가', en: 'Tarot Diary Feature Added' },
    content: { 
      ko: '이제 매일의 타로 카드를 일기로 저장하고 메모를 남길 수 있습니다.',
      en: 'Now you can save daily tarot cards as diary entries and leave memos.'
    },
    date: '2025-01-10',
    isImportant: false
  }
];

// 배너 설정
const BANNER_CONFIG = {
  imageUrl: 'https://via.placeholder.com/350x100/FF6B9D/FFFFFF?text=타로+타이머+배너',
  linkUrl: {
    ios: 'https://your-website.com/ios',
    android: 'https://your-website.com/android',
    web: 'https://your-website.com'
  },
  title: { ko: '특별 이벤트 진행중!', en: 'Special Event in Progress!' }
};
  {
    id: 'classic',
    name: { ko: '기본 타로카드', en: 'Classic Tarot' },
    description: { ko: '전통적인 타로카드 디자인', en: 'Traditional tarot card design' },
    thumbnail: 'assets/themes/classic_thumb.jpg',
    isPremium: false,
    price: 0,
    previewCards: ['major_00_fool.jpg', 'major_01_magician.jpg', 'major_02_high_priestess.jpg']
  },
  {
    id: 'cosmic',
    name: { ko: '코스믹 나이트', en: 'Cosmic Night' },
    description: { ko: '우주의 신비로운 에너지', en: 'Mysterious cosmic energy' },
    thumbnail: 'assets/themes/cosmic_thumb.jpg',
    isPremium: true,
    price: 2000,
    previewCards: ['cosmic_major_00.jpg', 'cosmic_major_01.jpg', 'cosmic_major_02.jpg']
  },
  {
    id: 'floral',
    name: { ko: '플로럴 드림', en: 'Floral Dream' },
    description: { ko: '꽃과 자연의 아름다움', en: 'Beauty of flowers and nature' },
    thumbnail: 'assets/themes/floral_thumb.jpg',
    isPremium: true,
    price: 1500,
    previewCards: ['floral_major_00.jpg', 'floral_major_01.jpg', 'floral_major_02.jpg']
  }
];

// 메인 앱 컴포넌트
export default function App() {
  // 상태 관리
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ko');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [zoomedCard, setZoomedCard] = useState<TarotCard | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showThemeStore, setShowThemeStore] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<CardTheme>(CARD_THEMES[0]);
  const [userPoints, setUserPoints] = useState(5000);
  const [lockScreenEnabled, setLockScreenEnabled] = useState(false);
  const [animationValue] = useState(new Animated.Value(0));
  
  // 새로운 상태들
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [showDiary, setShowDiary] = useState(false);
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ hour: number; memo: string } | null>(null);
  const [showNoticeBoard, setShowNoticeBoard] = useState(false);
  const [showInquiryBoard, setShowInquiryBoard] = useState(false);
  const [inquiries, setInquiries] = useState<InquiryPost[]>([]);
  const [inquiryTitle, setInquiryTitle] = useState('');
  const [inquiryContent, setInquiryContent] = useState('');

  // 고도M 폰트 스타일
  const godoFont = {
    fontFamily: 'GodoM', // 실제 앱에서는 폰트 파일 등록 필요
  };

  // 초기화
  useEffect(() => {
    initializeTimeSlots();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // 애니메이션 시작
    Animated.loop(
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => clearInterval(timer);
  }, []);

  // 24시간 슬롯 초기화
  const initializeTimeSlots = useCallback(() => {
    const slots: TimeSlot[] = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push({
        hour,
        card: null,
        isActive: false,
        isDrawn: false
      });
    }
    setTimeSlots(slots);
  }, []);

  // 모든 카드 뽑기
  const drawAllCards = useCallback(() => {
    const newSlots = timeSlots.map(slot => ({
      ...slot,
      card: CLASSIC_TAROT_DECK[Math.floor(Math.random() * CLASSIC_TAROT_DECK.length)],
      isDrawn: true
    }));
    setTimeSlots(newSlots);
  }, [timeSlots]);

  // 현재 시간 카드 가져오기
  const getCurrentCard = useMemo(() => {
    const currentHour = currentTime.getHours();
    const currentSlot = timeSlots.find(slot => slot.hour === currentHour);
    return currentSlot?.card || null;
  }, [currentTime, timeSlots]);

  // 언어별 텍스트 가져오기
  const getText = useCallback((text: MultiLanguageText) => {
    return text[currentLanguage];
  }, [currentLanguage]);

  // 시간 포맷팅
  const formatTime = useCallback((hour: number) => {
    if (currentLanguage === 'ko') {
      const period = hour < 12 ? '오전' : '오후';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${period} ${displayHour}시`;
    } else {
      const period = hour < 12 ? 'AM' : 'PM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour} ${period}`;
    }
  }, [currentLanguage]);

  // 오늘의 타로 일기 저장
  const saveTodayDiary = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const existingEntry = diaryEntries.find(entry => entry.date === today);
    
    if (existingEntry) {
      Alert.alert(
        getText({ ko: '이미 저장됨', en: 'Already Saved' }),
        getText({ ko: '오늘의 일기가 이미 저장되어 있습니다.', en: 'Today\'s diary is already saved.' })
      );
      return;
    }

    const drawnSlots = timeSlots.filter(slot => slot.card !== null);
    if (drawnSlots.length === 0) {
      Alert.alert(
        getText({ ko: '카드 없음', en: 'No Cards' }),
        getText({ ko: '저장할 카드가 없습니다. 먼저 카드를 뽑아주세요.', en: 'No cards to save. Please draw cards first.' })
      );
      return;
    }

    const newEntry: DiaryEntry = {
      id: `diary_${Date.now()}`,
      date: today,
      timeSlots: [...timeSlots],
      createdAt: new Date()
    };

    setDiaryEntries(prev => [newEntry, ...prev]);
    Alert.alert(
      getText({ ko: '저장 완료!', en: 'Saved!' }),
      getText({ ko: '오늘의 타로 일기가 저장되었습니다.', en: 'Today\'s tarot diary has been saved.' })
    );
  }, [timeSlots, diaryEntries, getText]);

  // 일기 삭제
  const deleteDiaryEntry = useCallback((entryId: string) => {
    Alert.alert(
      getText({ ko: '삭제 확인', en: 'Confirm Delete' }),
      getText({ ko: '정말로 삭제하시겠습니까?', en: 'Are you sure you want to delete?' }),
      [
        { text: getText({ ko: '취소', en: 'Cancel' }), style: 'cancel' },
        {
          text: getText({ ko: '삭제', en: 'Delete' }),
          style: 'destructive',
          onPress: () => {
            setDiaryEntries(prev => prev.filter(entry => entry.id !== entryId));
          }
        }
      ]
    );
  }, [getText]);

  // 메모 저장
  const saveMemo = useCallback((hour: number, memo: string) => {
    setTimeSlots(prev => prev.map(slot => 
      slot.hour === hour ? { ...slot, memo } : slot
    ));
    
    // 일기에도 반영
    setDiaryEntries(prev => prev.map(entry => {
      if (entry.date === new Date().toISOString().split('T')[0]) {
        return {
          ...entry,
          timeSlots: entry.timeSlots.map(slot => 
            slot.hour === hour ? { ...slot, memo } : slot
          )
        };
      }
      return entry;
    }));
  }, []);

  // 문의 제출
  const submitInquiry = useCallback(() => {
    if (!inquiryTitle.trim() || !inquiryContent.trim()) {
      Alert.alert(
        getText({ ko: '입력 오류', en: 'Input Error' }),
        getText({ ko: '제목과 내용을 모두 입력해주세요.', en: 'Please enter both title and content.' })
      );
      return;
    }

    const newInquiry: InquiryPost = {
      id: `inquiry_${Date.now()}`,
      title: inquiryTitle.trim(),
      content: inquiryContent.trim(),
      date: new Date().toLocaleDateString(),
      status: 'pending'
    };

    setInquiries(prev => [newInquiry, ...prev]);
    setInquiryTitle('');
    setInquiryContent('');
    
    Alert.alert(
      getText({ ko: '문의 완료!', en: 'Inquiry Submitted!' }),
      getText({ ko: '문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.', en: 'Your inquiry has been submitted. We will respond as soon as possible.' })
    );
  }, [inquiryTitle, inquiryContent, getText]);

  // 배너 클릭 처리
  const handleBannerPress = useCallback(() => {
    const url = Platform.OS === 'ios' 
      ? BANNER_CONFIG.linkUrl.ios 
      : Platform.OS === 'android' 
        ? BANNER_CONFIG.linkUrl.android 
        : BANNER_CONFIG.linkUrl.web;
    
    Linking.openURL(url).catch(() => {
      Alert.alert(
        getText({ ko: '링크 오류', en: 'Link Error' }),
        getText({ ko: '링크를 열 수 없습니다.', en: 'Cannot open the link.' })
      );
    });
  }, [getText]);
    if (userPoints >= theme.price) {
      setUserPoints(prev => prev - theme.price);
      setCurrentTheme(theme);
      Alert.alert(
        getText({ ko: '구매 완료!', en: 'Purchase Complete!' }),
        getText({ ko: '새 테마가 적용되었습니다.', en: 'New theme has been applied.' })
      );
    } else {
      Alert.alert(
        getText({ ko: '포인트 부족', en: 'Insufficient Points' }),
        getText({ ko: '포인트가 부족합니다.', en: 'You don\'t have enough points.' })
      );
    }
  // 테마 구매
  const purchaseTheme = useCallback((theme: CardTheme) => {

    if (userPoints >= theme.price) {
      setUserPoints(prev => prev - theme.price);
      setCurrentTheme(theme);
      Alert.alert(
        getText({ ko: '구매 완료!', en: 'Purchase Complete!' }),
        getText({ ko: '새 테마가 적용되었습니다.', en: 'New theme has been applied.' })
      );
    } else {
      Alert.alert(
        getText({ ko: '포인트 부족', en: 'Insufficient Points' }),
        getText({ ko: '포인트가 부족합니다.', en: 'You don\'t have enough points.' })
      );
    }
  }, [userPoints, getText]);
  const TarotCard = React.memo(({ 
    card, 
    size = 'medium', 
    onPress,
    isCurrentTime = false 
  }: {
    card: TarotCard;
    size?: 'small' | 'medium' | 'large';
    onPress?: () => void;
    isCurrentTime?: boolean;
  }) => {
    const cardSizes = {
      small: { width: 60, height: 90 },
      medium: { width: 80, height: 120 },
      large: { width: 120, height: 180 }
    };

    const cardSize = cardSizes[size];

    return (
      <TouchableOpacity
        style={[
          styles.tarotCard,
          cardSize,
          { backgroundColor: card.color + '20', borderColor: card.color },
          isCurrentTime && styles.currentTimeCard
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          <Text style={[styles.cardEmoji, { fontSize: size === 'small' ? 20 : size === 'medium' ? 24 : 32 }]}>
            {card.emoji}
          </Text>
          <Text style={[styles.cardName, godoFont, { fontSize: size === 'small' ? 10 : size === 'medium' ? 12 : 14 }]}>
            {getText(card.name)}
          </Text>
          <Text style={[styles.cardSuit, { fontSize: size === 'small' ? 8 : 10 }]}>
            {card.suit}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={(e) => {
            e.stopPropagation();
            setZoomedCard(card);
          }}
        >
          <Text style={styles.zoomIcon}>🔍</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  });

  // 카드 확대 모달
  const CardZoomModal = () => (
    <Modal
      visible={zoomedCard !== null}
      transparent
      animationType="fade"
      onRequestClose={() => setZoomedCard(null)}
    >
      <View style={styles.zoomModalOverlay}>
        <TouchableOpacity
          style={styles.zoomModalBackground}
          onPress={() => setZoomedCard(null)}
        >
          <View style={styles.zoomModalContent}>
            {zoomedCard && (
              <>
                <View style={[styles.zoomedCard, { backgroundColor: zoomedCard.color + '30', borderColor: zoomedCard.color }]}>
                  <Text style={[styles.zoomedCardEmoji]}>{zoomedCard.emoji}</Text>
                  <Text style={[styles.zoomedCardName, godoFont]}>{getText(zoomedCard.name)}</Text>
                  <Text style={styles.zoomedCardSuit}>{zoomedCard.suit}</Text>
                </View>
                <View style={styles.zoomedCardInfo}>
                  <Text style={[styles.zoomedCardDescription, godoFont]}>
                    {getText(zoomedCard.description)}
                  </Text>
                  <View style={styles.keywordsContainer}>
                    {zoomedCard.keywords.map((keyword, index) => (
                      <View key={index} style={[styles.keywordTag, { backgroundColor: zoomedCard.color + '20' }]}>
                        <Text style={[styles.keywordText, godoFont]}>{getText(keyword)}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  // 설정 모달
  const SettingsModal = () => (
    <Modal
      visible={showSettings}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSettings(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={[styles.modalTitle, godoFont]}>
            {getText({ ko: '설정', en: 'Settings' })}
          </Text>
          
          {/* 배너 */}
          <TouchableOpacity style={styles.banner} onPress={handleBannerPress}>
            <View style={styles.bannerContent}>
              <Text style={[styles.bannerTitle, godoFont]}>
                {getText(BANNER_CONFIG.title)}
              </Text>
              <Text style={styles.bannerSubtitle}>
                {getText({ ko: '터치하여 자세히 보기', en: 'Tap for more details' })}
              </Text>
            </View>
            <Text style={styles.bannerIcon}>🔗</Text>
          </TouchableOpacity>
          
          {/* 언어 설정 */}
          <View style={styles.settingSection}>
            <Text style={[styles.settingSectionTitle, godoFont]}>
              {getText({ ko: '언어 설정', en: 'Language Settings' })}
            </Text>
            <View style={styles.languageSelector}>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageButton,
                    currentLanguage === lang.code && styles.languageButtonActive
                  ]}
                  onPress={() => setCurrentLanguage(lang.code)}
                >
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text style={[styles.languageText, godoFont]}>{lang.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* 잠금화면 설정 */}
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, godoFont]}>
              {getText({ ko: '잠금화면 카드 표시', en: 'Lock Screen Card Display' })}
            </Text>
            <Switch
              value={lockScreenEnabled}
              onValueChange={setLockScreenEnabled}
              trackColor={{ false: '#767577', true: '#FF6B9D' }}
            />
          </View>

          {/* 게시판 버튼들 */}
          <View style={styles.boardButtons}>
            <TouchableOpacity
              style={styles.boardButton}
              onPress={() => setShowNoticeBoard(true)}
            >
              <Text style={[styles.boardButtonText, godoFont]}>
                📢 {getText({ ko: '공지사항', en: 'Notices' })}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.boardButton}
              onPress={() => setShowInquiryBoard(true)}
            >
              <Text style={[styles.boardButtonText, godoFont]}>
                💬 {getText({ ko: '문의하기', en: 'Inquiries' })}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowSettings(false)}
          >
            <Text style={[styles.closeButtonText, godoFont]}>
              {getText({ ko: '닫기', en: 'Close' })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  ); ko: '닫기', en: 'Close' })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // 타로 일기 모달
  const DiaryModal = () => (
    <Modal
      visible={showDiary}
      transparent
      animationType="slide"
      onRequestClose={() => setShowDiary(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={[styles.modalTitle, godoFont]}>
            📖 {getText({ ko: '타로 일기', en: 'Tarot Diary' })}
          </Text>
          
          <ScrollView style={styles.diaryList} showsVerticalScrollIndicator={false}>
            {diaryEntries.length === 0 ? (
              <View style={styles.emptyDiary}>
                <Text style={[styles.emptyDiaryText, godoFont]}>
                  {getText({ ko: '저장된 일기가 없습니다.', en: 'No diary entries saved.' })}
                </Text>
                <Text style={styles.emptyDiarySubtext}>
                  {getText({ ko: '카드를 뽑고 "오늘 일기 저장"을 눌러보세요!', en: 'Draw cards and tap "Save Today\'s Diary"!' })}
                </Text>
              </View>
            ) : (
              diaryEntries.map((entry) => (
                <View key={entry.id} style={styles.diaryEntry}>
                  <View style={styles.diaryEntryHeader}>
                    <Text style={[styles.diaryEntryDate, godoFont]}>
                      📅 {new Date(entry.date).toLocaleDateString(currentLanguage === 'ko' ? 'ko-KR' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long'
                      })}
                    </Text>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteDiaryEntry(entry.id)}
                    >
                      <Text style={styles.deleteButtonText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <ScrollView horizontal style={styles.diaryCards} showsHorizontalScrollIndicator={false}>
                    {entry.timeSlots.filter(slot => slot.card).map((slot) => (
                      <View key={slot.hour} style={styles.diaryCardItem}>
                        <Text style={styles.diaryCardTime}>{formatTime(slot.hour)}</Text>
                        <TarotCard 
                          card={slot.card!} 
                          size="small"
                          onPress={() => setZoomedCard(slot.card)}
                        />
                        {slot.memo && (
                          <Text style={styles.diaryCardMemo}>
                            📝 {slot.memo.substring(0, 15)}{slot.memo.length > 15 ? '...' : ''}
                          </Text>
                        )}
                      </View>
                    ))}
                  </ScrollView>
                </View>
              ))
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowDiary(false)}
          >
            <Text style={[styles.closeButtonText, godoFont]}>
              {getText({ ko: '닫기', en: 'Close' })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // 메모 작성 모달
  const MemoModal = () => (
    <Modal
      visible={showMemoModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowMemoModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.memoModalContent}>
          <Text style={[styles.modalTitle, godoFont]}>
            ✏️ {getText({ ko: '메모 작성', en: 'Write Memo' })}
          </Text>
          
          {selectedTimeSlot && (
            <>
              <Text style={[styles.memoTimeText, godoFont]}>
                {formatTime(selectedTimeSlot.hour)}
              </Text>
              
              <TextInput
                style={[styles.memoInput, godoFont]}
                placeholder={getText({ ko: '이 시간의 타로카드에 대한 메모를 작성해보세요...', en: 'Write a memo about this hour\'s tarot card...' })}
                placeholderTextColor="#888"
                value={selectedTimeSlot.memo}
                onChangeText={(text) => setSelectedTimeSlot(prev => prev ? {...prev, memo: text} : null)}
                multiline
                numberOfLines={4}
                maxLength={200}
              />
              
              <View style={styles.memoActions}>
                <TouchableOpacity
                  style={[styles.memoActionButton, styles.memoCancelButton]}
                  onPress={() => {
                    setShowMemoModal(false);
                    setSelectedTimeSlot(null);
                  }}
                >
                  <Text style={[styles.memoActionText, godoFont]}>
                    {getText({ ko: '취소', en: 'Cancel' })}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.memoActionButton, styles.memoSaveButton]}
                  onPress={() => {
                    if (selectedTimeSlot) {
                      saveMemo(selectedTimeSlot.hour, selectedTimeSlot.memo);
                      setShowMemoModal(false);
                      setSelectedTimeSlot(null);
                    }
                  }}
                >
                  <Text style={[styles.memoActionText, godoFont]}>
                    {getText({ ko: '저장', en: 'Save' })}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  // 공지사항 모달
  const NoticeBoardModal = () => (
    <Modal
      visible={showNoticeBoard}
      transparent
      animationType="slide"
      onRequestClose={() => setShowNoticeBoard(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={[styles.modalTitle, godoFont]}>
            📢 {getText({ ko: '공지사항', en: 'Notices' })}
          </Text>
          
          <ScrollView style={styles.noticeList} showsVerticalScrollIndicator={false}>
            {NOTICE_POSTS.map((notice) => (
              <View key={notice.id} style={[styles.noticeItem, notice.isImportant && styles.importantNotice]}>
                <View style={styles.noticeHeader}>
                  {notice.isImportant && <Text style={styles.importantBadge}>🔥 중요</Text>}
                  <Text style={styles.noticeDate}>{notice.date}</Text>
                </View>
                <Text style={[styles.noticeTitle, godoFont]}>
                  {getText(notice.title)}
                </Text>
                <Text style={styles.noticeContent}>
                  {getText(notice.content)}
                </Text>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowNoticeBoard(false)}
          >
            <Text style={[styles.closeButtonText, godoFont]}>
              {getText({ ko: '닫기', en: 'Close' })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // 문의 게시판 모달
  const InquiryBoardModal = () => (
    <Modal
      visible={showInquiryBoard}
      transparent
      animationType="slide"
      onRequestClose={() => setShowInquiryBoard(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={[styles.modalTitle, godoFont]}>
            💬 {getText({ ko: '문의하기', en: 'Inquiries' })}
          </Text>
          
          {/* 문의 작성 폼 */}
          <View style={styles.inquiryForm}>
            <TextInput
              style={[styles.inquiryTitleInput, godoFont]}
              placeholder={getText({ ko: '문의 제목을 입력하세요', en: 'Enter inquiry title' })}
              placeholderTextColor="#888"
              value={inquiryTitle}
              onChangeText={setInquiryTitle}
              maxLength={50}
            />
            
            <TextInput
              style={[styles.inquiryContentInput, godoFont]}
              placeholder={getText({ ko: '문의 내용을 자세히 작성해주세요...', en: 'Please write your inquiry in detail...' })}
              placeholderTextColor="#888"
              value={inquiryContent}
              onChangeText={setInquiryContent}
              multiline
              numberOfLines={5}
              maxLength={500}
            />
            
            <TouchableOpacity
              style={styles.submitInquiryButton}
              onPress={submitInquiry}
            >
              <Text style={[styles.submitInquiryText, godoFont]}>
                ✉️ {getText({ ko: '문의 접수', en: 'Submit Inquiry' })}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* 내 문의 목록 */}
          <View style={styles.myInquiries}>
            <Text style={[styles.myInquiriesTitle, godoFont]}>
              {getText({ ko: '내 문의 내역', en: 'My Inquiries' })}
            </Text>
            
            <ScrollView style={styles.inquiryList} showsVerticalScrollIndicator={false}>
              {inquiries.length === 0 ? (
                <Text style={styles.emptyInquiryText}>
                  {getText({ ko: '문의 내역이 없습니다.', en: 'No inquiries found.' })}
                </Text>
              ) : (
                inquiries.map((inquiry) => (
                  <View key={inquiry.id} style={styles.inquiryItem}>
                    <View style={styles.inquiryItemHeader}>
                      <Text style={[styles.inquiryItemTitle, godoFont]}>{inquiry.title}</Text>
                      <View style={[
                        styles.inquiryStatus,
                        inquiry.status === 'answered' ? styles.answeredStatus : styles.pendingStatus
                      ]}>
                        <Text style={styles.inquiryStatusText}>
                          {inquiry.status === 'answered' 
                            ? getText({ ko: '답변완료', en: 'Answered' })
                            : getText({ ko: '대기중', en: 'Pending' })
                          }
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.inquiryItemDate}>{inquiry.date}</Text>
                    <Text style={styles.inquiryItemContent}>{inquiry.content}</Text>
                    {inquiry.answer && (
                      <View style={styles.inquiryAnswer}>
                        <Text style={[styles.inquiryAnswerLabel, godoFont]}>
                          💬 {getText({ ko: '답변', en: 'Answer' })}:
                        </Text>
                        <Text style={styles.inquiryAnswerText}>{inquiry.answer}</Text>
                      </View>
                    )}
                  </View>
                ))
              )}
            </ScrollView>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowInquiryBoard(false)}
          >
            <Text style={[styles.closeButtonText, godoFont]}>
              {getText({ ko: '닫기', en: 'Close' })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
    <Modal
      visible={showThemeStore}
      transparent
      animationType="slide"
      onRequestClose={() => setShowThemeStore(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={[styles.modalTitle, godoFont]}>
            {getText({ ko: '테마 상점', en: 'Theme Store' })}
          </Text>
          
          <View style={styles.pointsDisplay}>
            <Text style={[styles.pointsText, godoFont]}>
              {getText({ ko: '보유 포인트', en: 'Your Points' })}: {userPoints}P
            </Text>
          </View>

          <ScrollView style={styles.themeList}>
            {CARD_THEMES.map((theme) => (
              <View key={theme.id} style={styles.themeItem}>
                <View style={styles.themeInfo}>
                  <Text style={[styles.themeName, godoFont]}>{getText(theme.name)}</Text>
                  <Text style={styles.themeDescription}>{getText(theme.description)}</Text>
                  <Text style={[styles.themePrice, godoFont]}>
                    {theme.isPremium ? `${theme.price}P` : getText({ ko: '무료', en: 'Free' })}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.themeButton,
                    currentTheme.id === theme.id && styles.themeButtonActive
                  ]}
                  onPress={() => theme.isPremium ? purchaseTheme(theme) : setCurrentTheme(theme)}
                >
                  <Text style={[styles.themeButtonText, godoFont]}>
                    {currentTheme.id === theme.id 
                      ? getText({ ko: '사용중', en: 'Using' })
                      : theme.isPremium 
                        ? getText({ ko: '구매', en: 'Buy' })
                        : getText({ ko: '사용', en: 'Use' })
                    }
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowThemeStore(false)}
          >
            <Text style={[styles.closeButtonText, godoFont]}>
              {getText({ ko: '닫기', en: 'Close' })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#1a1a2e" />
      
      {/* 배경 그라데이션 */}
      <View style={styles.backgroundGradient} />
      
      {/* 홀로그램 효과 */}
      <Animated.View
        style={[
          styles.hologramEffect,
          {
            opacity: animationValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.3],
            }),
          },
        ]}
      />

      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.languageSelector}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageButton,
                currentLanguage === lang.code && styles.languageButtonActive
              ]}
              onPress={() => setCurrentLanguage(lang.code)}
            >
              <Text style={styles.languageFlag}>{lang.flag}</Text>
              <Text style={[styles.languageText, godoFont]}>{lang.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.appTitle, godoFont]}>
          🔮 {getText({ ko: '타로 타이머', en: 'Tarot Timer' })}
        </Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowThemeStore(true)}
          >
            <Text style={styles.headerButtonText}>🎨</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowSettings(true)}
          >
            <Text style={styles.headerButtonText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 현재 시간 및 카드 */}
      <View style={styles.currentTimeSection}>
        <Text style={[styles.currentTimeText, godoFont]}>
          {formatTime(currentTime.getHours())}
        </Text>
        <Text style={[styles.currentDateText, godoFont]}>
          {currentTime.toLocaleDateString(currentLanguage === 'ko' ? 'ko-KR' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          })}
        </Text>
        
        {getCurrentCard ? (
          <View style={styles.currentCardContainer}>
            <Text style={[styles.currentCardLabel, godoFont]}>
              {getText({ ko: '현재 시간의 카드', en: 'Current Time Card' })}
            </Text>
            <TarotCard 
              card={getCurrentCard} 
              size="large" 
              isCurrentTime={true}
              onPress={() => setZoomedCard(getCurrentCard)}
            />
            <View style={styles.currentCardInfo}>
              <Text style={[styles.currentCardName, godoFont]}>
                {getText(getCurrentCard.name)}
              </Text>
              <View style={styles.currentCardKeywords}>
                {getCurrentCard.keywords.slice(0, 2).map((keyword, index) => (
                  <Text key={index} style={[styles.currentCardKeyword, godoFont]}>
                    {getText(keyword)}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.noCardContainer}>
            <Text style={[styles.noCardText, godoFont]}>
              {getText({ ko: '카드를 뽑아주세요', en: 'Please draw cards' })}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.controlButtons}>
        <TouchableOpacity
          style={[styles.controlButton, styles.drawAllButton]}
          onPress={drawAllCards}
        >
          <Text style={[styles.controlButtonText, godoFont]}>
            🎴 {getText({ ko: '24시간 카드 뽑기', en: 'Draw 24 Hour Cards' })}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, styles.saveButton]}
          onPress={saveTodayDiary}
        >
          <Text style={[styles.controlButtonText, godoFont]}>
            💾 {getText({ ko: '오늘 일기 저장', en: 'Save Today\'s Diary' })}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, styles.diaryButton]}
          onPress={() => setShowDiary(true)}
        >
          <Text style={[styles.controlButtonText, godoFont]}>
            📖 {getText({ ko: '일기 보기', en: 'View Diary' })}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 24시간 타임라인 */}
      <ScrollView style={styles.timelineContainer} showsVerticalScrollIndicator={false}>
        <Text style={[styles.timelineTitle, godoFont]}>
          {getText({ ko: '24시간 타로 타임라인', en: '24-Hour Tarot Timeline' })}
        </Text>
        
        <View style={styles.timeline}>
          {timeSlots.map((slot) => {
            const isCurrentHour = slot.hour === currentTime.getHours();
            const isPastHour = slot.hour < currentTime.getHours();
            const isFutureHour = slot.hour > currentTime.getHours();
            
            return (
              <View 
                key={slot.hour} 
                style={[
                  styles.timeSlot,
                  isCurrentHour && styles.currentTimeSlot,
                  isPastHour && styles.pastTimeSlot,
                  isFutureHour && styles.futureTimeSlot
                ]}
              >
                <View style={styles.timeSlotHeader}>
                  <Text style={[styles.timeSlotTime, godoFont]}>
                    {formatTime(slot.hour)}
                  </Text>
                  <View style={[
                    styles.timeSlotIndicator,
                    isCurrentHour && styles.currentTimeIndicator,
                    isPastHour && styles.pastTimeIndicator,
                    isFutureHour && styles.futureTimeIndicator
                  ]} />
                </View>
                
                {slot.card ? (
                  <View style={styles.timeSlotCard}>
                    <TarotCard 
                      card={slot.card} 
                      size="small"
                      hour={slot.hour}
                      showMemoButton={true}
                      onPress={() => setZoomedCard(slot.card)}
                    />
                    <View style={styles.timeSlotCardInfo}>
                      <Text style={[styles.timeSlotCardName, godoFont]}>
                        {getText(slot.card.name)}
                      </Text>
                      <Text style={styles.timeSlotCardKeyword}>
                        {getText(slot.card.keywords[0])}
                      </Text>
                      {slot.memo && (
                        <Text style={styles.timeSlotMemo}>
                          📝 {slot.memo.substring(0, 20)}{slot.memo.length > 20 ? '...' : ''}
                        </Text>
                      )}
                    </View>
                  </View>
                ) : (
                  <View style={styles.emptyTimeSlot}>
                    <Text style={styles.emptySlotText}>
                      {isFutureHour 
                        ? getText({ ko: '미래', en: 'Future' })
                        : getText({ ko: '카드 없음', en: 'No Card' })
                      }
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* 잠금화면 미리보기 (설정이 켜져있을 때) */}
      {lockScreenEnabled && getCurrentCard && (
        <View style={styles.lockScreenPreview}>
          <Text style={[styles.lockScreenTitle, godoFont]}>
            {getText({ ko: '잠금화면 미리보기', en: 'Lock Screen Preview' })}
          </Text>
          <View style={styles.lockScreenCard}>
            <Text style={[styles.lockScreenCardName, godoFont]}>
              🔮 {getText(getCurrentCard.name)}
            </Text>
            <Text style={styles.lockScreenCardTime}>
              {formatTime(currentTime.getHours())}
            </Text>
          </View>
        </View>
      )}

      {/* 모달들 */}
      <CardZoomModal />
      <SettingsModal />
      <ThemeStoreModal />
      <DiaryModal />
      <MemoModal />
      <NoticeBoardModal />
      <InquiryBoardModal />
    </SafeAreaView>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    opacity: 0.1,
  },
  
  hologramEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, transparent, rgba(255, 107, 157, 0.1), transparent)',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
  },

  appTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 107, 157, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    flex: 1,
  },

  headerActions: {
    flexDirection: 'row',
  },

  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  headerButtonText: {
    fontSize: 20,
  },

  currentTimeSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    margin: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.2)',
  },

  currentTimeText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 5,
    textShadowColor: 'rgba(255, 107, 157, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
  },

  currentDateText: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 20,
  },

  currentCardContainer: {
    alignItems: 'center',
  },

  currentCardLabel: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 15,
    fontWeight: '600',
  },

  currentCardInfo: {
    alignItems: 'center',
    marginTop: 15,
  },

  currentCardName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  currentCardKeywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  currentCardKeyword: {
    color: '#FF6B9D',
    fontSize: 14,
    marginHorizontal: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    borderRadius: 15,
    overflow: 'hidden',
  },

  noCardContainer: {
    paddingVertical: 40,
  },

  noCardText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },

  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: getResponsiveSize(10, 15, 20),
    marginBottom: 20,
    flexWrap: 'wrap',
  },

  controlButton: {
    flex: 1,
    paddingVertical: getResponsiveSize(12, 15, 18),
    borderRadius: 25,
    marginHorizontal: getResponsiveSize(5, 8, 10),
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    minWidth: getResponsiveSize(100, 120, 140),
  },

  drawAllButton: {
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    borderColor: '#FF6B9D',
  },

  saveButton: {
    backgroundColor: 'rgba(103, 126, 234, 0.2)',
    borderColor: '#677EEA',
  },

  diaryButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4CAF50',
  },

  controlButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  timelineContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  timelineTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  timeline: {
    paddingBottom: 50,
  },

  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  currentTimeSlot: {
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderColor: '#FF6B9D',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },

  pastTimeSlot: {
    backgroundColor: 'rgba(103, 126, 234, 0.1)',
    borderColor: 'rgba(103, 126, 234, 0.3)',
  },

  futureTimeSlot: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  timeSlotHeader: {
    alignItems: 'center',
    marginRight: 15,
    minWidth: 80,
  },

  timeSlotTime: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  timeSlotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },

  currentTimeIndicator: {
    backgroundColor: '#FF6B9D',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },

  pastTimeIndicator: {
    backgroundColor: '#677EEA',
  },

  futureTimeIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },

  timeSlotCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  timeSlotCardInfo: {
    marginLeft: 15,
    flex: 1,
  },

  timeSlotCardName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },

  timeSlotCardKeyword: {
    color: '#ccc',
    fontSize: 12,
  },

  emptyTimeSlot: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },

  emptySlotText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  tarotCard: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  currentTimeCard: {
    shadowColor: '#FF6B9D',
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },

  cardContent: {
    alignItems: 'center',
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

  cardSuit: {
    color: '#ccc',
    textAlign: 'center',
  },

  zoomButton: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  zoomIcon: {
    fontSize: 10,
  },

  lockScreenPreview: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    margin: 20,
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.3)',
  },

  lockScreenTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  lockScreenCard: {
    alignItems: 'center',
  },

  lockScreenCardName: {
    color: '#FF6B9D',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  lockScreenCardTime: {
    color: '#ccc',
    fontSize: 14,
  },

  // 모달 스타일들
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
    maxHeight: height * 0.8,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 157, 0.3)',
  },

  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  settingSection: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },

  settingSectionTitle: {
    color: '#FF6B9D',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  languageSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 5,
  },

  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    flex: 1,
    justifyContent: 'center',
  },

  languageButtonActive: {
    backgroundColor: 'rgba(255, 107, 157, 0.3)',
  },

  languageFlag: {
    fontSize: 16,
    marginRight: 5,
  },

  languageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },

  settingLabel: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },

  pointsText: {
    color: '#FF6B9D',
    fontSize: 18,
    fontWeight: 'bold',
  },

  themeList: {
    maxHeight: 300,
  },

  themeItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },

  themeInfo: {
    flex: 1,
  },

  themeName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  themeDescription: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
  },

  themePrice: {
    color: '#FF6B9D',
    fontSize: 14,
    fontWeight: 'bold',
  },

  themeButton: {
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#FF6B9D',
  },

  themeButtonActive: {
    backgroundColor: 'rgba(103, 126, 234, 0.2)',
    borderColor: '#677EEA',
  },

  themeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  closeButton: {
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    borderRadius: 25,
    paddingVertical: 15,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },

  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // 카드 확대 모달 스타일들
  zoomModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  zoomModalBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  zoomModalContent: {
    alignItems: 'center',
    padding: 20,
  },

  zoomedCard: {
    width: 280,
    height: 420,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },

  zoomedCardEmoji: {
    fontSize: 60,
    marginBottom: 15,
  },

  zoomedCardName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },

  zoomedCardSuit: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
  },

  zoomedCardInfo: {
    width: width * 0.8,
    alignItems: 'center',
  },

  zoomedCardDescription: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },

  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  keywordTag: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    margin: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  timeSlotMemo: {
    color: '#4CAF50',
    fontSize: getResponsiveSize(10, 11, 12),
    fontStyle: 'italic',
    marginTop: 2,
  },

  cardContainer: {
    alignItems: 'center',
    position: 'relative',
  },

  memoButton: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: getResponsiveSize(24, 28, 32),
    height: getResponsiveSize(24, 28, 32),
    borderRadius: getResponsiveSize(12, 14, 16),
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  memoIcon: {
    fontSize: getResponsiveSize(12, 14, 16),
  },

  // 배너 스타일
  banner: {
    backgroundColor: 'linear-gradient(135deg, #FF6B9D, #677EEA)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.3)',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  bannerContent: {
    flex: 1,
  },

  bannerTitle: {
    color: '#fff',
    fontSize: getResponsiveSize(16, 18, 20),
    fontWeight: 'bold',
    marginBottom: 5,
  },

  bannerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: getResponsiveSize(12, 14, 16),
  },

  bannerIcon: {
    fontSize: getResponsiveSize(24, 28, 32),
    marginLeft: 10,
  },

  // 게시판 버튼들
  boardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },

  boardButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.3)',
  },

  boardButtonText: {
    color: '#fff',
    fontSize: getResponsiveSize(14, 16, 18),
    fontWeight: '600',
  },

  // 일기 모달 스타일
  diaryList: {
    maxHeight: height * 0.6,
    marginBottom: 20,
  },

  emptyDiary: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyDiaryText: {
    color: '#fff',
    fontSize: getResponsiveSize(16, 18, 20),
    textAlign: 'center',
    marginBottom: 10,
  },

  emptyDiarySubtext: {
    color: '#888',
    fontSize: getResponsiveSize(12, 14, 16),
    textAlign: 'center',
  },

  diaryEntry: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  diaryEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  diaryEntryDate: {
    color: '#FF6B9D',
    fontSize: getResponsiveSize(14, 16, 18),
    fontWeight: 'bold',
  },

  deleteButton: {
    padding: 5,
  },

  deleteButtonText: {
    fontSize: getResponsiveSize(18, 20, 22),
  },

  diaryCards: {
    flexDirection: 'row',
  },

  diaryCardItem: {
    alignItems: 'center',
    marginRight: 15,
    minWidth: getResponsiveSize(70, 80, 90),
  },

  diaryCardTime: {
    color: '#ccc',
    fontSize: getResponsiveSize(10, 12, 14),
    marginBottom: 5,
    textAlign: 'center',
  },

  diaryCardMemo: {
    color: '#4CAF50',
    fontSize: getResponsiveSize(8, 10, 12),
    textAlign: 'center',
    marginTop: 5,
    maxWidth: getResponsiveSize(60, 70, 80),
  },

  // 메모 모달 스타일
  memoModalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
    maxWidth: 400,
    borderWidth: 2,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },

  memoTimeText: {
    color: '#4CAF50',
    fontSize: getResponsiveSize(18, 20, 22),
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
  },

  memoInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    color: '#fff',
    fontSize: getResponsiveSize(14, 16, 18),
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  memoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  memoActionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },

  memoCancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  memoSaveButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },

  memoActionText: {
    color: '#fff',
    fontSize: getResponsiveSize(14, 16, 18),
    fontWeight: 'bold',
  },

  // 공지사항 스타일
  noticeList: {
    maxHeight: height * 0.6,
    marginBottom: 20,
  },

  noticeItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  importantNotice: {
    borderColor: '#FF6B9D',
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
  },

  noticeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  importantBadge: {
    backgroundColor: '#FF6B9D',
    color: '#fff',
    fontSize: getResponsiveSize(10, 12, 14),
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontWeight: 'bold',
  },

  noticeDate: {
    color: '#888',
    fontSize: getResponsiveSize(10, 12, 14),
  },

  noticeTitle: {
    color: '#fff',
    fontSize: getResponsiveSize(16, 18, 20),
    fontWeight: 'bold',
    marginBottom: 8,
  },

  noticeContent: {
    color: '#ccc',
    fontSize: getResponsiveSize(12, 14, 16),
    lineHeight: getResponsiveSize(18, 20, 22),
  },

  // 문의 게시판 스타일
  inquiryForm: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },

  inquiryTitleInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    color: '#fff',
    fontSize: getResponsiveSize(14, 16, 18),
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  inquiryContentInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    color: '#fff',
    fontSize: getResponsiveSize(14, 16, 18),
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  submitInquiryButton: {
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B9D',
  },

  submitInquiryText: {
    color: '#fff',
    fontSize: getResponsiveSize(14, 16, 18),
    fontWeight: 'bold',
  },

  myInquiries: {
    flex: 1,
  },

  myInquiriesTitle: {
    color: '#FF6B9D',
    fontSize: getResponsiveSize(16, 18, 20),
    fontWeight: 'bold',
    marginBottom: 15,
  },

  inquiryList: {
    maxHeight: height * 0.3,
  },

  emptyInquiryText: {
    color: '#888',
    fontSize: getResponsiveSize(12, 14, 16),
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },

  inquiryItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
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
    fontSize: getResponsiveSize(14, 16, 18),
    fontWeight: 'bold',
    flex: 1,
  },

  inquiryStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 10,
  },

  pendingStatus: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    borderWidth: 1,
    borderColor: '#FFC107',
  },

  answeredStatus: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },

  inquiryStatusText: {
    color: '#fff',
    fontSize: getResponsiveSize(10, 12, 14),
    fontWeight: 'bold',
  },

  inquiryItemDate: {
    color: '#888',
    fontSize: getResponsiveSize(10, 12, 14),
    marginBottom: 8,
  },

  inquiryItemContent: {
    color: '#ccc',
    fontSize: getResponsiveSize(12, 14, 16),
    lineHeight: getResponsiveSize(16, 18, 20),
    marginBottom: 10,
  },

  inquiryAnswer: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },

  inquiryAnswerLabel: {
    color: '#4CAF50',
    fontSize: getResponsiveSize(12, 14, 16),
    fontWeight: 'bold',
    marginBottom: 5,
  },

  keywordText: {
    color: '#fff',
    fontSize: getResponsiveSize(12, 14, 16),
    fontWeight: '600',
  },
});