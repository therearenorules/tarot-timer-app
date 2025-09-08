// 24시간 타로 카드 시스템
export const HOUR_TAROT_CARDS = {
  0: {
    name: '바보',
    meaning: '새로운 시작과 순수한 마음',
    description: '밤의 끝과 새 하루의 시작을 알리는 시간입니다. 순수한 마음으로 새로운 가능성을 받아들이세요.',
    keywords: ['새로운 시작', '순수함', '모험', '가능성'],
    advice: '오늘 하루를 새로운 마음으로 시작해보세요.',
    symbol: '🌟',
    element: 'air',
    energy: 'beginning'
  },
  1: {
    name: '마법사',
    meaning: '의지력과 창조적 능력',
    description: '깊은 밤, 의지력과 집중력이 필요한 시간입니다. 목표를 향한 강한 의지를 발휘하세요.',
    keywords: ['의지력', '창조력', '집중', '기술'],
    advice: '당신의 능력을 믿고 목표를 향해 나아가세요.',
    symbol: '🎭',
    element: 'air',
    energy: 'creative'
  },
  2: {
    name: '여사제',
    meaning: '직관과 내면의 지혜',
    description: '깊은 밤의 정적 속에서 내면의 목소리에 귀 기울이는 시간입니다.',
    keywords: ['직관', '지혜', '내면', '신비'],
    advice: '마음의 소리에 귀를 기울여보세요.',
    symbol: '🌙',
    element: 'water',
    energy: 'intuitive'
  },
  3: {
    name: '여황제',
    meaning: '풍요로움과 어머니의 사랑',
    description: '모든 것이 조용한 새벽, 자연의 풍요로움과 창조력을 느끼는 시간입니다.',
    keywords: ['풍요', '창조', '자연', '사랑'],
    advice: '주변의 풍요로움에 감사하며 사랑을 나누세요.',
    symbol: '👑',
    element: 'earth',
    energy: 'nurturing'
  },
  4: {
    name: '황제',
    meaning: '권위와 안정적인 구조',
    description: '새벽의 질서 속에서 안정감과 규율을 느끼는 시간입니다.',
    keywords: ['권위', '질서', '안정', '리더십'],
    advice: '질서를 세우고 책임감 있게 행동하세요.',
    symbol: '⚡',
    element: 'fire',
    energy: 'authoritative'
  },
  5: {
    name: '교황',
    meaning: '전통과 영적 지도',
    description: '새벽 예배 시간처럼 영적인 깨달음과 전통의 지혜를 구하는 시간입니다.',
    keywords: ['전통', '영성', '지도', '학습'],
    advice: '전통적인 지혜에서 답을 찾아보세요.',
    symbol: '🔮',
    element: 'earth',
    energy: 'spiritual'
  },
  6: {
    name: '연인',
    meaning: '사랑과 선택의 갈래',
    description: '해가 뜨는 시간, 사랑과 중요한 선택의 순간입니다.',
    keywords: ['사랑', '선택', '조화', '결합'],
    advice: '마음이 이끄는 방향으로 선택하세요.',
    symbol: '💖',
    element: 'air',
    energy: 'harmonious'
  },
  7: {
    name: '전차',
    meaning: '의지력과 승리',
    description: '아침의 활기찬 에너지로 목표를 향해 전진하는 시간입니다.',
    keywords: ['승리', '의지', '전진', '통제'],
    advice: '강한 의지로 목표를 향해 나아가세요.',
    symbol: '🏛️',
    element: 'water',
    energy: 'victorious'
  },
  8: {
    name: '힘',
    meaning: '내면의 힘과 용기',
    description: '하루를 시작하는 시간, 내면의 힘과 용기를 발견하는 순간입니다.',
    keywords: ['힘', '용기', '인내', '극복'],
    advice: '내면의 힘을 믿고 도전하세요.',
    symbol: '🦁',
    element: 'fire',
    energy: 'courageous'
  },
  9: {
    name: '은자',
    meaning: '내적 성찰과 고독',
    description: '오전의 조용한 시간, 내면을 들여다보며 성찰하는 순간입니다.',
    keywords: ['성찰', '고독', '내면', '깨달음'],
    advice: '혼자만의 시간을 갖고 깊이 생각해보세요.',
    symbol: '🕯️',
    element: 'earth',
    energy: 'reflective'
  },
  10: {
    name: '운명의 수레바퀴',
    meaning: '변화와 운명의 순환',
    description: '오전 중반, 운명의 변화와 새로운 기회가 찾아오는 시간입니다.',
    keywords: ['변화', '운명', '기회', '순환'],
    advice: '변화를 받아들이고 기회를 잡으세요.',
    symbol: '☸️',
    element: 'fire',
    energy: 'transformative'
  },
  11: {
    name: '정의',
    meaning: '균형과 공정함',
    description: '정오를 앞둔 시간, 공정함과 균형을 추구하는 순간입니다.',
    keywords: ['정의', '균형', '공정', '진실'],
    advice: '공정하고 균형잡힌 판단을 내리세요.',
    symbol: '⚖️',
    element: 'air',
    energy: 'balanced'
  },
  12: {
    name: '매달린 사람',
    meaning: '희생과 새로운 관점',
    description: '정오, 태양이 가장 높은 시간에 새로운 관점으로 세상을 바라보세요.',
    keywords: ['희생', '관점', '깨달음', '인내'],
    advice: '다른 각도에서 상황을 바라보세요.',
    symbol: '🕸️',
    element: 'water',
    energy: 'patient'
  },
  13: {
    name: '죽음',
    meaning: '변화와 재생',
    description: '오후의 시작, 낡은 것을 버리고 새롭게 태어나는 시간입니다.',
    keywords: ['변화', '재생', '끝', '새로운 시작'],
    advice: '변화를 두려워하지 말고 받아들이세요.',
    symbol: '💀',
    element: 'water',
    energy: 'transformative'
  },
  14: {
    name: '절제',
    meaning: '조화와 균형',
    description: '오후의 평화로운 시간, 절제와 조화를 통해 균형을 찾으세요.',
    keywords: ['절제', '조화', '균형', '평화'],
    advice: '모든 일에 절제하며 균형을 유지하세요.',
    symbol: '🏺',
    element: 'fire',
    energy: 'moderate'
  },
  15: {
    name: '악마',
    meaning: '유혹과 속박',
    description: '오후 중반, 유혹과 속박에서 벗어나 자유로워질 시간입니다.',
    keywords: ['유혹', '속박', '해방', '진실'],
    advice: '자신을 속박하는 것들로부터 자유로워지세요.',
    symbol: '😈',
    element: 'earth',
    energy: 'challenging'
  },
  16: {
    name: '탑',
    meaning: '충격과 깨달음',
    description: '오후의 갑작스러운 깨달음, 기존의 틀을 깨뜨리는 시간입니다.',
    keywords: ['충격', '깨달음', '파괴', '각성'],
    advice: '갑작스러운 변화에 당황하지 말고 수용하세요.',
    symbol: '🗼',
    element: 'fire',
    energy: 'shocking'
  },
  17: {
    name: '별',
    meaning: '희망과 영감',
    description: '석양이 시작되는 시간, 희망과 영감이 샘솟는 순간입니다.',
    keywords: ['희망', '영감', '치유', '꿈'],
    advice: '희망을 품고 꿈을 향해 나아가세요.',
    symbol: '⭐',
    element: 'air',
    energy: 'hopeful'
  },
  18: {
    name: '달',
    meaning: '환상과 무의식',
    description: '해가 지는 시간, 무의식과 환상의 세계로 들어가는 순간입니다.',
    keywords: ['환상', '무의식', '직감', '신비'],
    advice: '직감을 믿고 내면의 목소리를 들어보세요.',
    symbol: '🌙',
    element: 'water',
    energy: 'mystical'
  },
  19: {
    name: '태양',
    meaning: '성공과 기쁨',
    description: '저녁 시간, 하루의 성취와 기쁨을 만끽하는 순간입니다.',
    keywords: ['성공', '기쁨', '활력', '긍정'],
    advice: '긍정적인 에너지로 주변을 밝게 비추세요.',
    symbol: '☀️',
    element: 'fire',
    energy: 'joyful'
  },
  20: {
    name: '심판',
    meaning: '재생과 각성',
    description: '밤이 시작되는 시간, 하루를 돌아보며 새로운 각성을 경험하세요.',
    keywords: ['심판', '재생', '각성', '구원'],
    advice: '과거를 돌아보고 새로운 각성을 경험하세요.',
    symbol: '🎺',
    element: 'fire',
    energy: 'awakening'
  },
  21: {
    name: '세계',
    meaning: '완성과 성취',
    description: '밤의 시작, 하루의 완성과 성취를 축하하는 시간입니다.',
    keywords: ['완성', '성취', '만족', '완결'],
    advice: '오늘의 성취를 축하하며 내일을 준비하세요.',
    symbol: '🌍',
    element: 'earth',
    energy: 'complete'
  },
  22: {
    name: '물의 에이스',
    meaning: '감정의 새로운 시작',
    description: '깊은 밤, 감정의 정화와 새로운 시작을 맞이하는 시간입니다.',
    keywords: ['감정', '정화', '새로운 시작', '영감'],
    advice: '감정을 정화하고 새로운 마음으로 시작하세요.',
    symbol: '💧',
    element: 'water',
    energy: 'emotional'
  },
  23: {
    name: '검의 에이스',
    meaning: '정신적 명료함',
    description: '자정을 앞둔 시간, 명료한 사고와 새로운 아이디어가 떠오르는 순간입니다.',
    keywords: ['명료함', '진실', '지적', '날카로움'],
    advice: '명료한 사고로 진실을 찾아보세요.',
    symbol: '⚔️',
    element: 'air',
    energy: 'mental'
  }
};

// 타로 카드 요소별 분류
export const ELEMENTS = {
  air: {
    name: '바람',
    description: '지적, 소통, 아이디어',
    color: '#87CEEB',
    cards: [0, 1, 6, 11, 17, 23]
  },
  fire: {
    name: '불',
    description: '열정, 에너지, 창조',
    color: '#FF6B6B',
    cards: [4, 8, 10, 14, 16, 19, 20]
  },
  water: {
    name: '물',
    description: '감정, 직관, 영성',
    color: '#4ECDC4',
    cards: [2, 7, 12, 13, 18, 22]
  },
  earth: {
    name: '땅',
    description: '안정, 실용성, 물질',
    color: '#95E1D3',
    cards: [3, 5, 9, 15, 21]
  }
};

// 에너지별 분류
export const ENERGIES = {
  beginning: { name: '시작', description: '새로운 출발점' },
  creative: { name: '창조', description: '창조적 에너지' },
  intuitive: { name: '직관', description: '내면의 지혜' },
  nurturing: { name: '보살핌', description: '사랑과 돌봄' },
  authoritative: { name: '권위', description: '리더십과 질서' },
  spiritual: { name: '영적', description: '영적 성장' },
  harmonious: { name: '조화', description: '균형과 화합' },
  victorious: { name: '승리', description: '성취와 승리' },
  courageous: { name: '용기', description: '내면의 힘' },
  reflective: { name: '성찰', description: '깊은 사고' },
  transformative: { name: '변화', description: '변화와 성장' },
  balanced: { name: '균형', description: '공정과 조화' },
  patient: { name: '인내', description: '기다림과 수용' },
  moderate: { name: '절제', description: '균형과 절제' },
  challenging: { name: '도전', description: '어려움과 시련' },
  shocking: { name: '충격', description: '갑작스러운 변화' },
  hopeful: { name: '희망', description: '밝은 미래' },
  mystical: { name: '신비', description: '신비로운 힘' },
  joyful: { name: '기쁨', description: '행복과 즐거움' },
  awakening: { name: '각성', description: '깨달음과 성장' },
  complete: { name: '완성', description: '성취와 만족' },
  emotional: { name: '감정', description: '감정의 흐름' },
  mental: { name: '지성', description: '명료한 사고' }
};

// 현재 시간에 맞는 타로 카드 가져오기
export const getCurrentHourCard = () => {
  const currentHour = new Date().getHours();
  return HOUR_TAROT_CARDS[currentHour];
};

// 특정 시간의 타로 카드 가져오기
export const getCardByHour = (hour) => {
  return HOUR_TAROT_CARDS[hour] || HOUR_TAROT_CARDS[0];
};

// 랜덤 타로 카드 가져오기
export const getRandomCard = () => {
  const randomHour = Math.floor(Math.random() * 24);
  return HOUR_TAROT_CARDS[randomHour];
};

// 여러 카드 가져오기 (스프레드용)
export const getMultipleCards = (count) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const shuffled = hours.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(hour => ({ 
    ...HOUR_TAROT_CARDS[hour], 
    hour 
  }));
};

// 요소별 카드 필터링
export const getCardsByElement = (element) => {
  return ELEMENTS[element]?.cards.map(hour => HOUR_TAROT_CARDS[hour]) || [];
};

// 에너지별 카드 필터링
export const getCardsByEnergy = (energy) => {
  return Object.values(HOUR_TAROT_CARDS).filter(card => card.energy === energy);
};