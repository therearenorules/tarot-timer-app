// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface TarotCard {
  id: string;
  name: string;
  nameKr: string;
  suit: 'major' | 'cups' | 'pentacles' | 'swords' | 'wands';
  number?: number;
  imageUrl: string;
  keywords: string[];
  keywordsKr: string[];
  meaning: string;
  meaningKr: string;
  reversed: string;
  reversedKr: string;
}

export interface SpreadType {
  id: string;
  name: string;
  nameKr: string;
  description: string;
  descriptionKr: string;
  positions: string[];
  positionsKr: string[];
  isPremium?: boolean;
}

export interface SavedSpread {
  id: string;
  spreadType: string;
  title: string;
  spreadName: string;
  spreadNameKr: string;
  date: string;
  cards: Array<{
    id: string;
    nameKr: string;
    name: string;
    imageUrl: string;
    position: string;
    positionKr: string;
    isRevealed: boolean;
  }>;
  notes?: string;
  savedAt: string;
}

export interface DailyTarotSave {
  id: string;
  date: string;
  hourlyCards: TarotCard[];
  memos: { [hour: number]: string };
  insights: string;
  savedAt: string;
}

export type Language = 'ko' | 'en';
export type ViewType = 'tabs' | 'spreadDetail' | 'savedSpreadDetail' | 'dailyTarotDetail';

// ==========================================
// TAROT DATA
// ==========================================

const TAROT_DECK: TarotCard[] = [
  {
    id: 'fool',
    name: 'The Fool',
    nameKr: '바보',
    suit: 'major',
    number: 0,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=500&fit=crop',
    keywords: ['new beginnings', 'innocence', 'spontaneity'],
    keywordsKr: ['새로운 시작', '순수함', '자발성'],
    meaning: 'New beginnings, having faith in the future, being inexperienced, not knowing what to expect.',
    meaningKr: '새로운 시작, 미래에 대한 믿음, 경험 부족, 무엇을 기대해야 할지 모름.',
    reversed: 'Recklessness, taken advantage of, inconsideration, stupidity.',
    reversedKr: '무모함, 이용당함, 배려 부족, 어리석음.'
  },
  {
    id: 'magician',
    name: 'The Magician',
    nameKr: '마법사',
    suit: 'major',
    number: 1,
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=500&fit=crop',
    keywords: ['manifestation', 'resourcefulness', 'power'],
    keywordsKr: ['현실화', '수완', '힘'],
    meaning: 'Having the tools and resources you need to accomplish your goals.',
    meaningKr: '목표를 달성하는 데 필요한 도구와 자원을 갖고 있음.',
    reversed: 'Manipulation, poor planning, untapped talents.',
    reversedKr: '조작, 열악한 계획, 개발되지 않은 재능.'
  },
  {
    id: 'high-priestess',
    name: 'The High Priestess',
    nameKr: '여교황',
    suit: 'major',
    number: 2,
    imageUrl: 'https://images.unsplash.com/photo-1551731409-43eb3e517a1a?w=300&h=500&fit=crop',
    keywords: ['intuition', 'sacred knowledge', 'divine feminine'],
    keywordsKr: ['직감', '신성한 지식', '신성한 여성성'],
    meaning: 'Intuition, higher powers, mystery, subconscious mind.',
    meaningKr: '직관, 고차원의 힘, 신비, 잠재의식.',
    reversed: 'Lack of center, lost inner voice, repressed feelings.',
    reversedKr: '중심 부족, 잃어버린 내면의 목소리, 억압된 감정.'
  },
  {
    id: 'empress',
    name: 'The Empress',
    nameKr: '여황제',
    suit: 'major',
    number: 3,
    imageUrl: 'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?w=300&h=500&fit=crop',
    keywords: ['fertility', 'femininity', 'beauty'],
    keywordsKr: ['풍요', '여성성', '아름다움'],
    meaning: 'Fertility, femininity, beauty, nature, abundance.',
    meaningKr: '풍요로움, 여성성, 아름다움, 자연, 풍부함.',
    reversed: 'Creative block, dependence on others.',
    reversedKr: '창조적 막힘, 타인에 대한 의존.'
  },
  {
    id: 'emperor',
    name: 'The Emperor',
    nameKr: '황제',
    suit: 'major',
    number: 4,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=500&fit=crop',
    keywords: ['authority', 'structure', 'control'],
    keywordsKr: ['권위', '구조', '통제'],
    meaning: 'Authority, structure, control, fatherhood.',
    meaningKr: '권위, 구조, 통제, 아버지 역할.',
    reversed: 'Tyranny, rigidity, coldness.',
    reversedKr: '독재, 경직성, 냉정함.'
  },
  {
    id: 'hierophant',
    name: 'The Hierophant',
    nameKr: '교황',
    suit: 'major',
    number: 5,
    imageUrl: 'https://images.unsplash.com/photo-1544306094-57b6e5e6a4e9?w=300&h=500&fit=crop',
    keywords: ['tradition', 'conformity', 'morality'],
    keywordsKr: ['전통', '순응', '도덕성'],
    meaning: 'Traditional values, conventional methods, spiritual guidance.',
    meaningKr: '전통적 가치, 관습적 방법, 영적 지도.',
    reversed: 'Personal beliefs, freedom, challenging the status quo.',
    reversedKr: '개인적 신념, 자유, 현상 유지에 대한 도전.'
  },
  {
    id: 'lovers',
    name: 'The Lovers',
    nameKr: '연인',
    suit: 'major',
    number: 6,
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&h=500&fit=crop',
    keywords: ['love', 'harmony', 'relationships'],
    keywordsKr: ['사랑', '조화', '관계'],
    meaning: 'Love, harmony, relationships, values alignment.',
    meaningKr: '사랑, 조화, 관계, 가치관의 일치.',
    reversed: 'Disharmony, imbalance, misalignment of values.',
    reversedKr: '불화, 불균형, 가치관의 불일치.'
  },
  {
    id: 'chariot',
    name: 'The Chariot',
    nameKr: '전차',
    suit: 'major',
    number: 7,
    imageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&h=500&fit=crop',
    keywords: ['control', 'willpower', 'success'],
    keywordsKr: ['통제', '의지력', '성공'],
    meaning: 'Control, willpower, success, determination.',
    meaningKr: '통제, 의지력, 성공, 결단력.',
    reversed: 'Lack of control, lack of direction, aggression.',
    reversedKr: '통제력 부족, 방향성 부족, 공격성.'
  },
  {
    id: 'strength',
    name: 'Strength',
    nameKr: '힘',
    suit: 'major',
    number: 8,
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=500&fit=crop',
    keywords: ['strength', 'courage', 'persuasion'],
    keywordsKr: ['힘', '용기', '설득'],
    meaning: 'Strength, courage, persuasion, influence, compassion.',
    meaningKr: '힘, 용기, 설득, 영향력, 연민.',
    reversed: 'Self doubt, lack of confidence, low energy.',
    reversedKr: '자기 의심, 자신감 부족, 낮은 에너지.'
  },
  {
    id: 'hermit',
    name: 'The Hermit',
    nameKr: '은둔자',
    suit: 'major',
    number: 9,
    imageUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=300&h=500&fit=crop',
    keywords: ['introspection', 'seeking truth', 'inner guidance'],
    keywordsKr: ['성찰', '진실 추구', '내면의 지도'],
    meaning: 'Introspection, seeking truth, inner guidance.',
    meaningKr: '성찰, 진실 추구, 내면의 지도.',
    reversed: 'Isolation, loneliness, withdrawal.',
    reversedKr: '고립, 외로움, 철수.'
  },
  {
    id: 'wheel-of-fortune',
    name: 'Wheel of Fortune',
    nameKr: '운명의 수레바퀴',
    suit: 'major',
    number: 10,
    imageUrl: 'https://images.unsplash.com/photo-1573167243872-43c6433b9d40?w=300&h=500&fit=crop',
    keywords: ['good luck', 'karma', 'life cycles'],
    keywordsKr: ['행운', '카르마', '인생 주기'],
    meaning: 'Good luck, karma, life cycles, destiny, turning point.',
    meaningKr: '행운, 카르마, 인생 주기, 운명, 전환점.',
    reversed: 'Bad luck, lack of control, clinging to control.',
    reversedKr: '불운, 통제력 부족, 통제에 대한 집착.'
  },
  {
    id: 'justice',
    name: 'Justice',
    nameKr: '정의',
    suit: 'major',
    number: 11,
    imageUrl: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=300&h=500&fit=crop',
    keywords: ['justice', 'fairness', 'truth'],
    keywordsKr: ['정의', '공정성', '진실'],
    meaning: 'Justice, fairness, truth, cause and effect, law.',
    meaningKr: '정의, 공정성, 진실, 원인과 결과, 법.',
    reversed: 'Unfairness, lack of accountability, dishonesty.',
    reversedKr: '불공정, 책임감 부족, 부정직.'
  },
  {
    id: 'hanged-man',
    name: 'The Hanged Man',
    nameKr: '교수형자',
    suit: 'major',
    number: 12,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=500&fit=crop',
    keywords: ['suspension', 'restriction', 'letting go'],
    keywordsKr: ['중단', '제한', '놓아버리기'],
    meaning: 'Suspension, restriction, letting go, sacrifice.',
    meaningKr: '중단, 제한, 놓아버리기, 희생.',
    reversed: 'Delays, resistance, stalling, indecision.',
    reversedKr: '지연, 저항, 지체, 우유부단.'
  },
  {
    id: 'death',
    name: 'Death',
    nameKr: '죽음',
    suit: 'major',
    number: 13,
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=500&fit=crop',
    keywords: ['endings', 'transformation', 'transition'],
    keywordsKr: ['끝', '변화', '전환'],
    meaning: 'Endings, transformation, transition, letting go.',
    meaningKr: '끝, 변화, 전환, 놓아버리기.',
    reversed: 'Resistance to change, personal transformation, inner purging.',
    reversedKr: '변화에 대한 저항, 개인적 변화, 내면의 정화.'
  },
  {
    id: 'temperance',
    name: 'Temperance',
    nameKr: '절제',
    suit: 'major',
    number: 14,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=500&fit=crop',
    keywords: ['balance', 'moderation', 'patience'],
    keywordsKr: ['균형', '절제', '인내'],
    meaning: 'Balance, moderation, patience, purpose, meaning.',
    meaningKr: '균형, 절제, 인내, 목적, 의미.',
    reversed: 'Imbalance, excess, self-healing, re-alignment.',
    reversedKr: '불균형, 과도함, 자기치유, 재정렬.'
  },
  {
    id: 'devil',
    name: 'The Devil',
    nameKr: '악마',
    suit: 'major',
    number: 15,
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=500&fit=crop',
    keywords: ['bondage', 'addiction', 'sexuality'],
    keywordsKr: ['속박', '중독', '성적 욕망'],
    meaning: 'Bondage, addiction, sexuality, materialism.',
    meaningKr: '속박, 중독, 성적 욕망, 물질주의.',
    reversed: 'Releasing limiting beliefs, exploring dark thoughts, detachment.',
    reversedKr: '제한적 신념 해제, 어둠 탐구, 분리.'
  },
  {
    id: 'tower',
    name: 'The Tower',
    nameKr: '탑',
    suit: 'major',
    number: 16,
    imageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&h=500&fit=crop',
    keywords: ['sudden change', 'upheaval', 'chaos'],
    keywordsKr: ['급작스런 변화', '격변', '혼돈'],
    meaning: 'Sudden change, upheaval, chaos, revelation, awakening.',
    meaningKr: '급작스런 변화, 격변, 혼돈, 계시, 각성.',
    reversed: 'Personal transformation, fear of change, averting disaster.',
    reversedKr: '개인적 변화, 변화에 대한 두려움, 재해 회피.'
  },
  {
    id: 'star',
    name: 'The Star',
    nameKr: '별',
    suit: 'major',
    number: 17,
    imageUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=300&h=500&fit=crop',
    keywords: ['hope', 'faith', 'purpose'],
    keywordsKr: ['희망', '믿음', '목적'],
    meaning: 'Hope, faith, purpose, renewal, spirituality.',
    meaningKr: '희망, 믿음, 목적, 갱신, 영성.',
    reversed: 'Lack of faith, despair, self-trust, disconnection.',
    reversedKr: '믿음 부족, 절망, 자신에 대한 믿음, 단절.'
  },
  {
    id: 'moon',
    name: 'The Moon',
    nameKr: '달',
    suit: 'major',
    number: 18,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=500&fit=crop',
    keywords: ['illusion', 'fear', 'anxiety'],
    keywordsKr: ['착각', '두려움', '불안'],
    meaning: 'Illusion, fear, anxiety, subconscious, intuition.',
    meaningKr: '착각, 두려움, 불안, 잠재의식, 직관.',
    reversed: 'Release of fear, repressed emotion, inner confusion.',
    reversedKr: '두려움의 해제, 억압된 감정, 내면의 혼란.'
  },
  {
    id: 'sun',
    name: 'The Sun',
    nameKr: '태양',
    suit: 'major',
    number: 19,
    imageUrl: 'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?w=300&h=500&fit=crop',
    keywords: ['happiness', 'joy', 'success'],
    keywordsKr: ['행복', '기쁨', '성공'],
    meaning: 'Happiness, joy, success, celebration, positivity.',
    meaningKr: '행복, 기쁨, 성공, 축하, 긍정성.',
    reversed: 'Inner child, feeling down, overly optimistic.',
    reversedKr: '내면의 아이, 우울함, 지나친 낙관.'
  },
  {
    id: 'judgement',
    name: 'Judgement',
    nameKr: '심판',
    suit: 'major',
    number: 20,
    imageUrl: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=300&h=500&fit=crop',
    keywords: ['judgement', 'rebirth', 'inner calling'],
    keywordsKr: ['심판', '재생', '내면의 소명'],
    meaning: 'Judgement, rebirth, inner calling, forgiveness.',
    meaningKr: '심판, 재생, 내면의 소명, 용서.',
    reversed: 'Self-doubt, inner critic, ignoring the call.',
    reversedKr: '자기 의심, 내면의 비판자, 소명 무시.'
  },
  {
    id: 'world',
    name: 'The World',
    nameKr: '세계',
    suit: 'major',
    number: 21,
    imageUrl: 'https://images.unsplash.com/photo-1573167243872-43c6433b9d40?w=300&h=500&fit=crop',
    keywords: ['completion', 'accomplishment', 'travel'],
    keywordsKr: ['완성', '성취', '여행'],
    meaning: 'Completion, accomplishment, travel, fulfillment.',
    meaningKr: '완성, 성취, 여행, 성취감.',
    reversed: 'Seeking personal closure, stagnation, lack of achievement.',
    reversedKr: '개인적 마무리 추구, 정체, 성취 부족.'
  }
];

// Generate minor arcana cards
const generateMinorArcana = (): TarotCard[] => {
  const suits: Array<{name: 'cups' | 'pentacles' | 'swords' | 'wands', nameKr: string, baseUrl: string}> = [
    { name: 'cups', nameKr: '컵', baseUrl: 'https://images.unsplash.com/photo-1719937075989-795943caad2a?w=300&h=500&fit=crop' },
    { name: 'pentacles', nameKr: '펜타클', baseUrl: 'https://images.unsplash.com/photo-1628860948883-05389e02adf6?w=300&h=500&fit=crop' },
    { name: 'swords', nameKr: '검', baseUrl: 'https://images.unsplash.com/photo-1672346105222-35816505cff2?w=300&h=500&fit=crop' },
    { name: 'wands', nameKr: '지팡이', baseUrl: 'https://images.unsplash.com/photo-1681689378693-5b1ade0a6828?w=300&h=500&fit=crop' }
  ];

  const cards: TarotCard[] = [];
  
  suits.forEach(suit => {
    for (let i = 1; i <= 10; i++) {
      cards.push({
        id: `${suit.name}-${i}`,
        name: `${i} of ${suit.name.charAt(0).toUpperCase() + suit.name.slice(1)}`,
        nameKr: `${suit.nameKr} ${i}`,
        suit: suit.name,
        number: i,
        imageUrl: suit.baseUrl,
        keywords: ['energy', 'movement', 'progress'],
        keywordsKr: ['에너지', '움직임', '진보'],
        meaning: `The ${i} of ${suit.name} represents progress and development in the realm of ${suit.name}.`,
        meaningKr: `${suit.nameKr} ${i}은 ${suit.nameKr} 영역에서의 진보와 발전을 나타냅니다.`,
        reversed: 'Blocked energy, delays, frustration in this area.',
        reversedKr: '이 영역에서 막힌 에너지, 지연, 좌절.'
      });
    }
    
    // Add court cards
    const courtCards = [
      { name: 'Page', nameKr: '시종', keywords: ['messenger', 'student', 'new beginning'], keywordsKr: ['전령', '학생', '새로운 시작'] },
      { name: 'Knight', nameKr: '기사', keywords: ['action', 'adventure', 'impulsiveness'], keywordsKr: ['행동', '모험', '충동성'] },
      { name: 'Queen', nameKr: '여왕', keywords: ['nurturing', 'intuition', 'care'], keywordsKr: ['양육', '직관', '돌봄'] },
      { name: 'King', nameKr: '왕', keywords: ['mastery', 'leadership', 'control'], keywordsKr: ['숙련', '리더십', '통제'] }
    ];
    
    courtCards.forEach((court, index) => {
      cards.push({
        id: `${suit.name}-${court.name.toLowerCase()}`,
        name: `${court.name} of ${suit.name.charAt(0).toUpperCase() + suit.name.slice(1)}`,
        nameKr: `${suit.nameKr}의 ${court.nameKr}`,
        suit: suit.name,
        number: 11 + index,
        imageUrl: suit.baseUrl,
        keywords: court.keywords,
        keywordsKr: court.keywordsKr,
        meaning: `The ${court.name} of ${suit.name} represents ${court.keywords.join(', ')}.`,
        meaningKr: `${suit.nameKr}의 ${court.nameKr}은 ${court.keywordsKr.join(', ')}을 나타냅니다.`,
        reversed: 'Imbalance in these qualities, potential negative expression.',
        reversedKr: '이러한 자질의 불균형, 잠재적 부정적 표현.'
      });
    });
  });
  
  return cards;
};

// Generate the full tarot deck
const MINOR_ARCANA = generateMinorArcana();
export const FULL_TAROT_DECK = [...TAROT_DECK, ...MINOR_ARCANA];

// Debug log to check deck size
console.log('Full Tarot Deck Size:', FULL_TAROT_DECK.length);
console.log('Major Arcana:', TAROT_DECK.length);
console.log('Minor Arcana:', MINOR_ARCANA.length);

export const SPREAD_TYPES: SpreadType[] = [
  {
    id: 'three-card',
    name: 'Three Card Spread',
    nameKr: '3카드',
    description: 'Past, Present, Future',
    descriptionKr: '과거, 현재, 미래',
    positions: ['Past', 'Present', 'Future'],
    positionsKr: ['과거', '현재', '미래']
  },
  {
    id: 'four-card',
    name: 'Four Card Spread',
    nameKr: '4카드',
    description: 'Balance and harmony in four key areas',
    descriptionKr: '네 가지 핵심 영역의 균형과 조화',
    positions: ['Mind', 'Body', 'Spirit', 'Action'],
    positionsKr: ['마음', '몸', '영혼', '행동']
  },
  {
    id: 'five-card',
    name: 'Five Card V-Shape',
    nameKr: '5카드',
    description: 'V-shaped spread for comprehensive guidance',
    descriptionKr: 'V자 형태로 보는 종합적인 안내',
    positions: ['Foundation', 'Challenge', 'Strength', 'Advice', 'Outcome'],
    positionsKr: ['기반', '도전', '힘', '조언', '결과']
  },
  {
    id: 'celtic-cross',
    name: 'Celtic Cross',
    nameKr: '켈틱 크로스',
    description: 'Complete life reading with 10 cards',
    descriptionKr: '10장으로 보는 완전한 인생 리딩',
    positions: ['Current Situation', 'Challenge', 'Distant Past', 'Recent Past', 'Possible Outcome', 'Immediate Future', 'Your Approach', 'External Influences', 'Hopes and Fears', 'Final Outcome'],
    positionsKr: ['현재 상황', '도전', '먼 과거', '최근 과거', '가능한 결과', '가까운 미래', '당신의 접근법', '외부 영향', '희망과 두려움', '최종 결과'],
    isPremium: true
  },
  {
    id: 'love',
    name: 'Cup of Relationship',
    nameKr: '컵 오브 릴레이션십',
    description: 'Deep insights into your relationship dynamics with 11 cards',
    descriptionKr: '11장의 카드로 보는 깊은 관계 역학 통찰',
    positions: [
      'Your Current State',
      'Partner\'s Current State', 
      'Our Current State',
      'Past',
      'Present',
      'Obstacles',
      'Your Heart',
      'Partner\'s Heart',
      'What You Want from Partner',
      'What Partner Wants from You',
      'Outcome'
    ],
    positionsKr: [
      '나의 현재 상태',
      '상대의 현재 상태',
      '우리의 현재 상태', 
      '과거',
      '현재',
      '방해물',
      '나의 마음',
      '상대의 마음',
      '내가 상대에게 바라는 점',
      '상대가 나에게 바라는 점',
      '결과'
    ],
    isPremium: true
  },
  {
    id: 'career',
    name: 'AB Choice Tarot',
    nameKr: 'AB 선택 타로',
    description: 'Choose between two important options with 7 cards',
    descriptionKr: '7장의 카드로 보는 두 가지 선택지 분석',
    positions: [
      'Choice A Option 1',
      'Choice A Option 2', 
      'Choice A Option 3',
      'Current Situation',
      'Choice B Option 1',
      'Choice B Option 2',
      'Choice B Option 3'
    ],
    positionsKr: [
      'A 선택지 1',
      'A 선택지 2',
      'A 선택지 3',
      '현재 상황',
      'B 선택지 1',
      'B 선택지 2',
      'B 선택지 3'
    ],
    isPremium: true
  }
];

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export const generateDailyCards = (date?: Date): TarotCard[] => {
  const targetDate = date || new Date();
  const seed = targetDate.getTime().toString();
  
  // Ensure we have enough cards
  if (FULL_TAROT_DECK.length < 24) {
    console.error('Not enough cards in deck:', FULL_TAROT_DECK.length);
    return [];
  }
  
  // Simple pseudo-random based on date with better distribution
  const random = (seed: string, index: number) => {
    let hash = 0;
    const str = seed + index.toString();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };
  
  // Create a shuffled copy of the deck
  const availableCards = [...FULL_TAROT_DECK];
  const cards: TarotCard[] = [];
  
  // Use Fisher-Yates shuffle algorithm with seeded random
  for (let hour = 0; hour < 24; hour++) {
    if (availableCards.length === 0) {
      console.error('Ran out of cards during generation');
      break;
    }
    
    const randomValue = random(seed, hour);
    const cardIndex = randomValue % availableCards.length;
    
    // Remove the selected card and add it to results
    const selectedCard = availableCards.splice(cardIndex, 1)[0];
    if (selectedCard) {
      cards.push(selectedCard);
    }
  }
  
  return cards;
};

export const getCurrentHour = (): number => {
  return new Date().getHours();
};

export const formatHour = (hour: number): string => {
  const period = hour >= 12 ? '오후' : '오전';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${period} ${displayHour}시`;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
};

export const getRandomCard = (): TarotCard => {
  const randomIndex = Math.floor(Math.random() * FULL_TAROT_DECK.length);
  return FULL_TAROT_DECK[randomIndex];
};

export const saveDailyTarot = (dailyReading: DailyTarotSave): void => {
  const saved = localStorage.getItem('dailyTarotSaves');
  const savedReadings: DailyTarotSave[] = saved ? JSON.parse(saved) : [];
  
  // 같은 날짜의 기존 저장을 찾아서 덮어쓰기 또는 새로 추가
  const existingIndex = savedReadings.findIndex(reading => reading.date === dailyReading.date);
  
  if (existingIndex >= 0) {
    // 기존 데이터 덮어쓰기
    savedReadings[existingIndex] = dailyReading;
  } else {
    // 새 데이터 추가
    savedReadings.unshift(dailyReading);
  }
  
  localStorage.setItem('dailyTarotSaves', JSON.stringify(savedReadings));
};

export const loadDailyTarotSaves = (): DailyTarotSave[] => {
  const saved = localStorage.getItem('dailyTarotSaves');
  return saved ? JSON.parse(saved) : [];
};

export const getTodaysSave = (): DailyTarotSave | null => {
  const today = new Date().toDateString();
  const saves = loadDailyTarotSaves();
  return saves.find(save => save.date === today) || null;
};