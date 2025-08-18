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
  SafeAreaView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// 화면 크기
const { width, height } = Dimensions.get('window');

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

  return cards;
}

// 카드 테마들
const CARD_THEMES: CardTheme[] = [
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

  // 타로카드 컴포넌트
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
  );

  // 테마 상점 모달
  const ThemeStoreModal = () => (
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

      {/* 메인 컨트롤 버튼들 */}
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
          style={[styles.controlButton, styles.resetButton]}
          onPress={initializeTimeSlots}
        >
          <Text style={[styles.controlButtonText, godoFont]}>
            🔄 {getText({ ko: '리셋', en: 'Reset' })}
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
                      onPress={() => setZoomedCard(slot.card)}
                    />
                    <View style={styles.timeSlotCardInfo}>
                      <Text style={[styles.timeSlotCardName, godoFont]}>
                        {getText(slot.card.name)}
                      </Text>
                      <Text style={styles.timeSlotCardKeyword}>
                        {getText(slot.card.keywords[0])}
                      </Text>
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
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  controlButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 25,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },

  drawAllButton: {
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    borderColor: '#FF6B9D',
  },

  resetButton: {
    backgroundColor: 'rgba(103, 126, 234, 0.2)',
    borderColor: '#677EEA',
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

  keywordText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});