/**
 * 타로 카드 이미지 리소스 관리 시스템
 * Phase 4: 네이티브 최적화 - 실제 타로 카드 이미지 통합
 */

export interface TarotCardImage {
  id: string;
  name: string;
  suit?: 'major' | 'cups' | 'pentacles' | 'swords' | 'wands';
  number?: number;
  court?: 'ace' | 'page' | 'knight' | 'queen' | 'king';
  image: any; // require() 이미지
  description: string;
  upright: string[];
  reversed: string[];
}

// 메이저 아르카나 카드들
export const majorArcanaCards: TarotCardImage[] = [
  {
    id: 'major_00_fool',
    name: 'The Fool',
    suit: 'major',
    number: 0,
    image: require('../../../assets/tarot-cards/classic-tarot/major_00_fool.jpg'),
    description: '새로운 시작, 순수함, 모험',
    upright: ['새로운 시작', '순수함', '모험', '자유로운 영혼', '신뢰'],
    reversed: ['무모함', '성급함', '부주의', '위험', '미성숙'],
  },
  {
    id: 'major_01_magician',
    name: 'The Magician',
    suit: 'major',
    number: 1,
    image: require('../../../assets/tarot-cards/classic-tarot/major_01_magician.jpg'),
    description: '의지력, 창조력, 실현',
    upright: ['의지력', '창조력', '실현', '집중', '기술'],
    reversed: ['조작', '속임수', '환상', '남용', '약한 의지'],
  },
  {
    id: 'major_02_high_priestess',
    name: 'The High Priestess',
    suit: 'major',
    number: 2,
    image: require('../../../assets/tarot-cards/classic-tarot/major_02_high_priestess.jpg'),
    description: '직관, 신비로움, 내면의 지혜',
    upright: ['직관', '신비로움', '내면의 지혜', '무의식', '여성성'],
    reversed: ['비밀', '숨겨진 동기', '무시된 직감', '혼란'],
  },
  {
    id: 'major_03_empress',
    name: 'The Empress',
    suit: 'major',
    number: 3,
    image: require('../../../assets/tarot-cards/classic-tarot/major_03_empress.jpg'),
    description: '풍요로움, 모성, 창조성',
    upright: ['풍요로움', '모성', '창조성', '자연', '감성'],
    reversed: ['의존', '질투', '창조성 부족', '불임'],
  },
  {
    id: 'major_04_emperor',
    name: 'The Emperor',
    suit: 'major',
    number: 4,
    image: require('../../../assets/tarot-cards/classic-tarot/major_04_emperor.jpg'),
    description: '권위, 안정성, 체계',
    upright: ['권위', '안정성', '체계', '아버지상', '통제'],
    reversed: ['독재', '융통성 부족', '권력 남용', '불안정'],
  },
  {
    id: 'major_05_hierophant',
    name: 'The Hierophant',
    suit: 'major',
    number: 5,
    image: require('../../../assets/tarot-cards/classic-tarot/major_05_hierophant.jpg'),
    description: '전통, 영성, 가르침',
    upright: ['전통', '영성', '가르침', '지혜', '종교'],
    reversed: ['독단', '맹신', '반항', '비전통'],
  },
  {
    id: 'major_06_lovers',
    name: 'The Lovers',
    suit: 'major',
    number: 6,
    image: require('../../../assets/tarot-cards/classic-tarot/major_06_lovers.jpg'),
    description: '사랑, 선택, 조화',
    upright: ['사랑', '선택', '조화', '관계', '결합'],
    reversed: ['불화', '잘못된 선택', '유혹', '분리'],
  },
  {
    id: 'major_07_chariot',
    name: 'The Chariot',
    suit: 'major',
    number: 7,
    image: require('../../../assets/tarot-cards/classic-tarot/major_07_chariot.jpg'),
    description: '승리, 의지, 전진',
    upright: ['승리', '의지', '전진', '통제', '성공'],
    reversed: ['패배', '방향성 상실', '좌절', '무력감'],
  },
  {
    id: 'major_08_strength',
    name: 'Strength',
    suit: 'major',
    number: 8,
    image: require('../../../assets/tarot-cards/classic-tarot/major_08_strength.jpg'),
    description: '용기, 인내, 내적 힘',
    upright: ['용기', '인내', '내적 힘', '자제력', '온화함'],
    reversed: ['약함', '두려움', '자기 의심', '분노'],
  },
  {
    id: 'major_09_hermit',
    name: 'The Hermit',
    suit: 'major',
    number: 9,
    image: require('../../../assets/tarot-cards/classic-tarot/major_09_hermit.jpg'),
    description: '내적 탐구, 지혜, 고독',
    upright: ['내적 탐구', '지혜', '고독', '성찰', '인도'],
    reversed: ['고립', '외로움', '답답함', '미성숙'],
  },
  {
    id: 'major_10_wheel_of_fortune',
    name: 'Wheel of Fortune',
    suit: 'major',
    number: 10,
    image: require('../../../assets/tarot-cards/classic-tarot/major_10_wheel_of_fortune.jpg'),
    description: '운명, 변화, 순환',
    upright: ['운명', '변화', '순환', '행운', '기회'],
    reversed: ['불운', '통제 불능', '저항', '정체'],
  },
  // 나머지 메이저 아르카나 카드들...
  {
    id: 'major_21_world',
    name: 'The World',
    suit: 'major',
    number: 21,
    image: require('../../../assets/tarot-cards/classic-tarot/major_21_world.jpg'),
    description: '완성, 성취, 통합',
    upright: ['완성', '성취', '통합', '여행', '성공'],
    reversed: ['미완성', '지연', '부족함', '좌절'],
  },
];

// 마이너 아르카나 - 컵 수트
export const cupsCards: TarotCardImage[] = [
  {
    id: 'minor_cups_ace',
    name: 'Ace of Cups',
    suit: 'cups',
    court: 'ace',
    image: require('../../../assets/tarot-cards/classic-tarot/minor_cups_ace.jpg'),
    description: '새로운 감정, 사랑의 시작',
    upright: ['새로운 감정', '사랑의 시작', '영감', '창조성'],
    reversed: ['감정적 혼란', '실망', '창조성 부족'],
  },
  {
    id: 'minor_cups_02',
    name: 'Two of Cups',
    suit: 'cups',
    number: 2,
    image: require('../../../assets/tarot-cards/classic-tarot/minor_cups_02.jpg'),
    description: '파트너십, 사랑, 연결',
    upright: ['파트너십', '사랑', '연결', '조화', '상호 존중'],
    reversed: ['불화', '오해', '관계 문제', '분리'],
  },
  // 더 많은 컵 카드들...
];

// 전체 카드 컬렉션
export const allTarotCards: TarotCardImage[] = [
  ...majorArcanaCards,
  ...cupsCards,
  // 다른 수트들도 추가 예정
];

// 카드 검색 유틸리티
export const getTarotCardById = (id: string): TarotCardImage | undefined => {
  return allTarotCards.find(card => card.id === id);
};

export const getTarotCardsBysuit = (suit: TarotCardImage['suit']): TarotCardImage[] => {
  return allTarotCards.filter(card => card.suit === suit);
};

export const getRandomTarotCard = (): TarotCardImage => {
  const randomIndex = Math.floor(Math.random() * allTarotCards.length);
  return allTarotCards[randomIndex];
};

// 카드팩 시스템
export interface TarotDeck {
  id: string;
  name: string;
  description: string;
  cards: TarotCardImage[];
  isPremium: boolean;
  previewImage: any;
}

export const classicTarotDeck: TarotDeck = {
  id: 'classic-tarot',
  name: '클래식 타로',
  description: '전통적인 라이더-웨이트 타로 덱',
  cards: allTarotCards,
  isPremium: false,
  previewImage: require('../../../assets/tarot-cards/classic-tarot/major_00_fool.jpg'),
};

export const availableDecks: TarotDeck[] = [
  classicTarotDeck,
  // 미래에 추가될 프리미엄 덱들
];

export default {
  allTarotCards,
  majorArcanaCards,
  cupsCards,
  getTarotCardById,
  getTarotCardsBysuit: getTarotCardsBysuit,
  getRandomTarotCard,
  classicTarotDeck,
  availableDecks,
};