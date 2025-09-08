// 완전한 78장 타로 카드 데이터베이스
export const FULL_TAROT_DECK = {
  // 메이저 아르카나 (22장)
  major: [
    {
      id: 0,
      name: 'The Fool',
      nameKr: '바보',
      meaning: 'New beginnings, innocence, spontaneity',
      meaningKr: '새로운 시작과 순수한 마음',
      keywords: ['new beginnings', 'innocence', 'spontaneity', 'free spirit'],
      keywordsKr: ['새로운 시작', '순수함', '모험', '가능성'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/major_00_fool.jpg'),
      element: 'air',
      suit: 'major',
      type: 'Major Arcana'
    },
    {
      id: 1,
      name: 'The Magician',
      nameKr: '마법사',
      meaning: 'Manifestation, resourcefulness, power',
      meaningKr: '의지력과 창조적 능력',
      keywords: ['manifestation', 'resourcefulness', 'power', 'inspired action'],
      keywordsKr: ['의지력', '창조력', '집중', '기술'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/major_01_magician.jpg'),
      element: 'air',
      suit: 'major',
      type: 'Major Arcana'
    },
    {
      id: 2,
      name: 'The High Priestess',
      nameKr: '여사제',
      meaning: 'Intuition, sacred knowledge, divine feminine',
      meaningKr: '직관과 내면의 지혜',
      keywords: ['intuition', 'sacred knowledge', 'divine feminine', 'the subconscious mind'],
      keywordsKr: ['직관', '지혜', '내면', '신비'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/major_02_high_priestess.jpg'),
      element: 'water',
      suit: 'major',
      type: 'Major Arcana'
    },
    {
      id: 3,
      name: 'The Empress',
      nameKr: '여황제',
      meaning: 'Femininity, beauty, nature, abundance',
      meaningKr: '풍요로움과 어머니의 사랑',
      keywords: ['femininity', 'beauty', 'nature', 'abundance'],
      keywordsKr: ['풍요', '창조', '자연', '사랑'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/major_03_empress.jpg'),
      element: 'earth',
      suit: 'major',
      type: 'Major Arcana'
    },
    {
      id: 4,
      name: 'The Emperor',
      nameKr: '황제',
      meaning: 'Authority, establishment, structure, father figure',
      meaningKr: '권위와 안정적인 구조',
      keywords: ['authority', 'establishment', 'structure', 'father figure'],
      keywordsKr: ['권위', '질서', '안정', '리더십'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/major_04_emperor.jpg'),
      element: 'fire',
      suit: 'major',
      type: 'Major Arcana'
    },
    {
      id: 5,
      name: 'The Hierophant',
      nameKr: '교황',
      meaning: 'Spiritual wisdom, religious beliefs, conformity',
      meaningKr: '전통과 영적 지도',
      keywords: ['spiritual wisdom', 'religious beliefs', 'conformity', 'tradition'],
      keywordsKr: ['전통', '영성', '지도', '학습'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/major_05_hierophant.jpg'),
      element: 'earth',
      suit: 'major',
      type: 'Major Arcana'
    },
    {
      id: 6,
      name: 'The Lovers',
      nameKr: '연인',
      meaning: 'Love, harmony, relationships, values alignment',
      meaningKr: '사랑과 선택의 갈래',
      keywords: ['love', 'harmony', 'relationships', 'values alignment'],
      keywordsKr: ['사랑', '선택', '조화', '결합'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/major_06_lovers.jpg'),
      element: 'air',
      suit: 'major',
      type: 'Major Arcana'
    },
    {
      id: 7,
      name: 'The Chariot',
      nameKr: '전차',
      meaning: 'Control, willpower, success, determination',
      meaningKr: '의지력과 승리',
      keywords: ['control', 'willpower', 'success', 'determination'],
      keywordsKr: ['승리', '의지', '전진', '통제'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/major_07_chariot.jpg'),
      element: 'water',
      suit: 'major',
      type: 'Major Arcana'
    },
    {
      id: 8,
      name: 'Strength',
      nameKr: '힘',
      meaning: 'Strength, courage, persuasion, influence',
      meaningKr: '내면의 힘과 용기',
      keywords: ['strength', 'courage', 'persuasion', 'influence'],
      keywordsKr: ['힘', '용기', '인내', '극복'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/major_08_strength.jpg'),
      element: 'fire',
      suit: 'major',
      type: 'Major Arcana'
    },
    {
      id: 9,
      name: 'The Hermit',
      nameKr: '은자',
      meaning: 'Soul searching, introspection, inner guidance',
      meaningKr: '내적 성찰과 고독',
      keywords: ['soul searching', 'introspection', 'inner guidance', 'solitude'],
      keywordsKr: ['성찰', '고독', '내면', '깨달음'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/major_09_hermit.jpg'),
      element: 'earth',
      suit: 'major',
      type: 'Major Arcana'
    },
    {
      id: 10,
      name: 'Wheel of Fortune',
      nameKr: '운명의 바퀴',
      meaning: 'Good luck, karma, life cycles, destiny',
      meaningKr: '변화와 운명의 순환',
      keywords: ['good luck', 'karma', 'life cycles', 'destiny'],
      keywordsKr: ['변화', '운명', '기회', '순환'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/major_10_wheel_of_fortune.jpg'),
      element: 'fire',
      suit: 'major',
      type: 'Major Arcana'
    },
    {
      id: 11,
      name: 'Justice',
      nameKr: '정의',
      meaning: 'Justice, fairness, truth, cause and effect',
      meaningKr: '균형과 공정함',
      keywords: ['justice', 'fairness', 'truth', 'cause and effect'],
      keywordsKr: ['정의', '균형', '공정', '진실'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/major_11_justice.jpg'),
      element: 'air',
      suit: 'major',
      type: 'Major Arcana'
    },
    {
      id: 12,
      name: 'The Hanged Man',
      nameKr: '매달린 사람',
      meaning: 'Suspension, restriction, letting go',
      meaningKr: '희생과 새로운 관점',
      keywords: ['suspension', 'restriction', 'letting go', 'sacrifice'],
      keywordsKr: ['희생', '관점', '깨달음', '인내'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/major_12_hanged_man.jpg'),
      element: 'water',
      suit: 'major',
      type: 'Major Arcana'
    },
    {
      id: 13,
      name: 'Death',
      nameKr: '죽음',
      meaning: 'Endings, beginnings, change, transformation',
      meaningKr: '변화와 재생',
      keywords: ['endings', 'beginnings', 'change', 'transformation'],
      keywordsKr: ['변화', '재생', '끝', '새로운 시작'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/major_13_death.jpg'),
      element: 'water',
      suit: 'major',
      type: 'Major Arcana'
    },
    {
      id: 14,
      name: 'Temperance',
      nameKr: '절제',
      meaning: 'Balance, moderation, patience, purpose',
      meaningKr: '조화와 균형',
      keywords: ['balance', 'moderation', 'patience', 'purpose'],
      keywordsKr: ['절제', '조화', '균형', '평화'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/major_14_temperance.jpg'),
      element: 'fire',
      suit: 'major',
      type: 'Major Arcana'
    },
    {
      id: 15,
      name: 'The Devil',
      nameKr: '악마',
      meaning: 'Shadow self, attachment, addiction, restriction',
      meaningKr: '유혹과 속박',
      keywords: ['shadow self', 'attachment', 'addiction', 'restriction'],
      keywordsKr: ['유혹', '속박', '해방', '진실'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/major_15_devil.jpg'),
      element: 'earth',
      suit: 'major',
      type: 'Major Arcana'
    },
    {
      id: 16,
      name: 'The Tower',
      nameKr: '탑',
      meaning: 'Sudden change, upheaval, chaos, revelation',
      meaningKr: '충격과 깨달음',
      keywords: ['sudden change', 'upheaval', 'chaos', 'revelation'],
      keywordsKr: ['충격', '깨달음', '파괴', '각성'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/major_16_tower.jpg'),
      element: 'fire',
      suit: 'major',
      type: 'Major Arcana'
    },
    {
      id: 17,
      name: 'The Star',
      nameKr: '별',
      meaning: 'Hope, faith, purpose, renewal, spirituality',
      meaningKr: '희망과 영감',
      keywords: ['hope', 'faith', 'purpose', 'renewal', 'spirituality'],
      keywordsKr: ['희망', '영감', '치유', '꿈'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/major_17_star.jpg'),
      element: 'air',
      suit: 'major',
      type: 'Major Arcana'
    },
    {
      id: 18,
      name: 'The Moon',
      nameKr: '달',
      meaning: 'Illusion, fear, anxiety, subconscious, intuition',
      meaningKr: '환상과 무의식',
      keywords: ['illusion', 'fear', 'anxiety', 'subconscious', 'intuition'],
      keywordsKr: ['환상', '무의식', '직감', '신비'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/major_18_moon.jpg'),
      element: 'water',
      suit: 'major',
      type: 'Major Arcana'
    },
    {
      id: 19,
      name: 'The Sun',
      nameKr: '태양',
      meaning: 'Positivity, fun, warmth, success, vitality',
      meaningKr: '성공과 기쁨',
      keywords: ['positivity', 'fun', 'warmth', 'success', 'vitality'],
      keywordsKr: ['성공', '기쁨', '활력', '긍정'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/major_19_sun.jpg'),
      element: 'fire',
      suit: 'major',
      type: 'Major Arcana'
    },
    {
      id: 20,
      name: 'Judgement',
      nameKr: '심판',
      meaning: 'Judgement, rebirth, inner calling, absolution',
      meaningKr: '재생과 각성',
      keywords: ['judgement', 'rebirth', 'inner calling', 'absolution'],
      keywordsKr: ['심판', '재생', '각성', '구원'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/major_20_judgement.jpg'),
      element: 'fire',
      suit: 'major',
      type: 'Major Arcana'
    },
    {
      id: 21,
      name: 'The World',
      nameKr: '세계',
      meaning: 'Completion, accomplishment, travel, fulfillment',
      meaningKr: '완성과 성취',
      keywords: ['completion', 'accomplishment', 'travel', 'fulfillment'],
      keywordsKr: ['완성', '성취', '만족', '완결'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/major_21_world.jpg'),
      element: 'earth',
      suit: 'major',
      type: 'Major Arcana'
    }
  ],

  // 마이너 아르카나 - 완드 (불의 원소, 14장)
  wands: [
    {
      id: 22,
      name: 'Ace of Wands',
      nameKr: '완드 에이스',
      meaning: 'Inspiration, creative spark, new opportunity',
      meaningKr: '창조적 영감과 새로운 기회',
      keywords: ['inspiration', 'creative spark', 'new opportunity', 'growth potential'],
      keywordsKr: ['영감', '창조', '기회', '성장'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_wands_ace.jpg'),
      element: 'fire',
      suit: 'wands',
      type: 'Minor Arcana'
    },
    {
      id: 23,
      name: 'Two of Wands',
      nameKr: '완드 2',
      meaning: 'Future planning, making decisions, leaving comfort zone',
      meaningKr: '미래 계획과 결정',
      keywords: ['future planning', 'making decisions', 'leaving comfort zone', 'personal power'],
      keywordsKr: ['계획', '결정', '도전', '권력'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_wands_02.jpg'),
      element: 'fire',
      suit: 'wands',
      type: 'Minor Arcana'
    },
    {
      id: 24,
      name: 'Three of Wands',
      nameKr: '완드 3',
      meaning: 'Expansion, foresight, overseas opportunities',
      meaningKr: '확장과 해외 기회',
      keywords: ['expansion', 'foresight', 'overseas opportunities', 'looking ahead'],
      keywordsKr: ['확장', '예견', '기회', '전망'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_wands_03.jpg'),
      element: 'fire',
      suit: 'wands',
      type: 'Minor Arcana'
    },
    {
      id: 25,
      name: 'Four of Wands',
      nameKr: '완드 4',
      meaning: 'Celebration, harmony, home, community',
      meaningKr: '축하와 조화로운 가정',
      keywords: ['celebration', 'harmony', 'home', 'community'],
      keywordsKr: ['축하', '조화', '가정', '공동체'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_wands_04.jpg'),
      element: 'fire',
      suit: 'wands',
      type: 'Minor Arcana'
    },
    {
      id: 26,
      name: 'Five of Wands',
      nameKr: '완드 5',
      meaning: 'Conflict, disagreements, competition, tension',
      meaningKr: '갈등과 경쟁',
      keywords: ['conflict', 'disagreements', 'competition', 'tension'],
      keywordsKr: ['갈등', '경쟁', '긴장', '불일치'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_wands_05.jpg'),
      element: 'fire',
      suit: 'wands',
      type: 'Minor Arcana'
    },
    {
      id: 27,
      name: 'Six of Wands',
      nameKr: '완드 6',
      meaning: 'Success, public recognition, progress, self-confidence',
      meaningKr: '성공과 인정',
      keywords: ['success', 'public recognition', 'progress', 'self-confidence'],
      keywordsKr: ['성공', '인정', '진전', '자신감'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_wands_06.jpg'),
      element: 'fire',
      suit: 'wands',
      type: 'Minor Arcana'
    },
    {
      id: 28,
      name: 'Seven of Wands',
      nameKr: '완드 7',
      meaning: 'Challenge, competition, perseverance, defending position',
      meaningKr: '도전과 방어',
      keywords: ['challenge', 'competition', 'perseverance', 'defending position'],
      keywordsKr: ['도전', '경쟁', '인내', '방어'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_wands_07.jpg'),
      element: 'fire',
      suit: 'wands',
      type: 'Minor Arcana'
    },
    {
      id: 29,
      name: 'Eight of Wands',
      nameKr: '완드 8',
      meaning: 'Swiftness, speed, progress, quick decisions',
      meaningKr: '신속함과 빠른 진전',
      keywords: ['swiftness', 'speed', 'progress', 'quick decisions'],
      keywordsKr: ['신속', '속도', '진전', '결정'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_wands_08.jpg'),
      element: 'fire',
      suit: 'wands',
      type: 'Minor Arcana'
    },
    {
      id: 30,
      name: 'Nine of Wands',
      nameKr: '완드 9',
      meaning: 'Persistence, test of faith, resilience, boundaries',
      meaningKr: '지속성과 시험',
      keywords: ['persistence', 'test of faith', 'resilience', 'boundaries'],
      keywordsKr: ['지속', '시험', '회복력', '경계'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_wands_09.jpg'),
      element: 'fire',
      suit: 'wands',
      type: 'Minor Arcana'
    },
    {
      id: 31,
      name: 'Ten of Wands',
      nameKr: '완드 10',
      meaning: 'Burden, extra responsibility, hard work, completion',
      meaningKr: '부담과 책임의 완성',
      keywords: ['burden', 'extra responsibility', 'hard work', 'completion'],
      keywordsKr: ['부담', '책임', '노력', '완성'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_wands_10.jpg'),
      element: 'fire',
      suit: 'wands',
      type: 'Minor Arcana'
    },
    {
      id: 32,
      name: 'Page of Wands',
      nameKr: '완드 페이지',
      meaning: 'Inspiration, ideas, discovery, limitless potential',
      meaningKr: '영감과 무한한 가능성',
      keywords: ['inspiration', 'ideas', 'discovery', 'limitless potential'],
      keywordsKr: ['영감', '아이디어', '발견', '가능성'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_wands_page.jpg'),
      element: 'fire',
      suit: 'wands',
      type: 'Minor Arcana'
    },
    {
      id: 33,
      name: 'Knight of Wands',
      nameKr: '완드 기사',
      meaning: 'Energy, passion, inspired action, adventure',
      meaningKr: '에너지와 열정적 행동',
      keywords: ['energy', 'passion', 'inspired action', 'adventure'],
      keywordsKr: ['에너지', '열정', '행동', '모험'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_wands_knight.jpg'),
      element: 'fire',
      suit: 'wands',
      type: 'Minor Arcana'
    },
    {
      id: 34,
      name: 'Queen of Wands',
      nameKr: '완드 여왕',
      meaning: 'Courage, confidence, independence, social butterfly',
      meaningKr: '용기와 독립성',
      keywords: ['courage', 'confidence', 'independence', 'social butterfly'],
      keywordsKr: ['용기', '자신감', '독립', '사교성'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_wands_queen.jpg'),
      element: 'fire',
      suit: 'wands',
      type: 'Minor Arcana'
    },
    {
      id: 35,
      name: 'King of Wands',
      nameKr: '완드 왕',
      meaning: 'Leadership, vision, honour, big picture',
      meaningKr: '리더십과 비전',
      keywords: ['leadership', 'vision', 'honour', 'big picture'],
      keywordsKr: ['리더십', '비전', '명예', '큰 그림'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_wands_king.jpg'),
      element: 'fire',
      suit: 'wands',
      type: 'Minor Arcana'
    }
  ],

  // 마이너 아르카나 - 컵 (물의 원소, 14장)  
  cups: [
    {
      id: 36,
      name: 'Ace of Cups',
      nameKr: '컵 에이스',
      meaning: 'Love, compassion, creativity, new relationship',
      meaningKr: '사랑과 새로운 관계',
      keywords: ['love', 'compassion', 'creativity', 'new relationship'],
      keywordsKr: ['사랑', '연민', '창조', '관계'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_cups_ace.jpg'),
      element: 'water',
      suit: 'cups',
      type: 'Minor Arcana'
    },
    {
      id: 37,
      name: 'Two of Cups',
      nameKr: '컵 2',
      meaning: 'Unified love, partnership, mutual attraction',
      meaningKr: '통합된 사랑과 파트너십',
      keywords: ['unified love', 'partnership', 'mutual attraction', 'relationships'],
      keywordsKr: ['사랑', '파트너십', '끌림', '관계'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_cups_02.jpg'),
      element: 'water',
      suit: 'cups',
      type: 'Minor Arcana'
    },
    {
      id: 38,
      name: 'Three of Cups',
      nameKr: '컵 3',
      meaning: 'Celebration, friendship, creativity, community',
      meaningKr: '축하와 우정',
      keywords: ['celebration', 'friendship', 'creativity', 'community'],
      keywordsKr: ['축하', '우정', '창조', '공동체'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_cups_03.jpg'),
      element: 'water',
      suit: 'cups',
      type: 'Minor Arcana'
    },
    {
      id: 39,
      name: 'Four of Cups',
      nameKr: '컵 4',
      meaning: 'Meditation, contemplation, apathy, reevaluation',
      meaningKr: '명상과 재평가',
      keywords: ['meditation', 'contemplation', 'apathy', 'reevaluation'],
      keywordsKr: ['명상', '사고', '무관심', '재평가'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_cups_04.jpg'),
      element: 'water',
      suit: 'cups',
      type: 'Minor Arcana'
    },
    {
      id: 40,
      name: 'Five of Cups',
      nameKr: '컵 5',
      meaning: 'Regret, failure, disappointment, pessimism',
      meaningKr: '후회와 실망',
      keywords: ['regret', 'failure', 'disappointment', 'pessimism'],
      keywordsKr: ['후회', '실패', '실망', '비관'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_cups_05.jpg'),
      element: 'water',
      suit: 'cups',
      type: 'Minor Arcana'
    },
    {
      id: 41,
      name: 'Six of Cups',
      nameKr: '컵 6',
      meaning: 'Revisiting the past, childhood memories, innocence',
      meaningKr: '과거 회상과 순수함',
      keywords: ['revisiting the past', 'childhood memories', 'innocence', 'nostalgia'],
      keywordsKr: ['과거', '추억', '순수', '향수'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_cups_06.jpg'),
      element: 'water',
      suit: 'cups',
      type: 'Minor Arcana'
    },
    {
      id: 42,
      name: 'Seven of Cups',
      nameKr: '컵 7',
      meaning: 'Opportunities, choices, wishful thinking, illusion',
      meaningKr: '기회와 선택의 환상',
      keywords: ['opportunities', 'choices', 'wishful thinking', 'illusion'],
      keywordsKr: ['기회', '선택', '희망', '환상'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_cups_07.jpg'),
      element: 'water',
      suit: 'cups',
      type: 'Minor Arcana'
    },
    {
      id: 43,
      name: 'Eight of Cups',
      nameKr: '컵 8',
      meaning: 'Disappointment, abandonment, withdrawal, escapism',
      meaningKr: '실망과 포기',
      keywords: ['disappointment', 'abandonment', 'withdrawal', 'escapism'],
      keywordsKr: ['실망', '포기', '철수', '도피'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_cups_08.jpg'),
      element: 'water',
      suit: 'cups',
      type: 'Minor Arcana'
    },
    {
      id: 44,
      name: 'Nine of Cups',
      nameKr: '컵 9',
      meaning: 'Contentment, satisfaction, gratitude, wish come true',
      meaningKr: '만족과 소망 성취',
      keywords: ['contentment', 'satisfaction', 'gratitude', 'wish come true'],
      keywordsKr: ['만족', '감사', '성취', '소망'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_cups_09.jpg'),
      element: 'water',
      suit: 'cups',
      type: 'Minor Arcana'
    },
    {
      id: 45,
      name: 'Ten of Cups',
      nameKr: '컵 10',
      meaning: 'Harmony, marriage, happiness, alignment',
      meaningKr: '조화와 행복한 결혼',
      keywords: ['harmony', 'marriage', 'happiness', 'alignment'],
      keywordsKr: ['조화', '결혼', '행복', '일치'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_cups_10.jpg'),
      element: 'water',
      suit: 'cups',
      type: 'Minor Arcana'
    },
    {
      id: 46,
      name: 'Page of Cups',
      nameKr: '컵 페이지',
      meaning: 'Creative opportunities, intuitive messages, curiosity',
      meaningKr: '창조적 기회와 직감',
      keywords: ['creative opportunities', 'intuitive messages', 'curiosity', 'new ideas'],
      keywordsKr: ['창조', '직감', '호기심', '아이디어'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_cups_page.jpg'),
      element: 'water',
      suit: 'cups',
      type: 'Minor Arcana'
    },
    {
      id: 47,
      name: 'Knight of Cups',
      nameKr: '컵 기사',
      meaning: 'Romance, charm, knight in shining armor, imagination',
      meaningKr: '로맨스와 매력',
      keywords: ['romance', 'charm', 'knight in shining armor', 'imagination'],
      keywordsKr: ['로맨스', '매력', '기사', '상상력'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_cups_knight.jpg'),
      element: 'water',
      suit: 'cups',
      type: 'Minor Arcana'
    },
    {
      id: 48,
      name: 'Queen of Cups',
      nameKr: '컵 여왕',
      meaning: 'Compassion, care, emotional stability, intuitive',
      meaningKr: '연민과 감정적 안정',
      keywords: ['compassion', 'care', 'emotional stability', 'intuitive'],
      keywordsKr: ['연민', '보살핌', '안정', '직관적'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_cups_queen.jpg'),
      element: 'water',
      suit: 'cups',
      type: 'Minor Arcana'
    },
    {
      id: 49,
      name: 'King of Cups',
      nameKr: '컵 왕',
      meaning: 'Emotional balance, compassion, generosity, diplomatic',
      meaningKr: '감정적 균형과 관용',
      keywords: ['emotional balance', 'compassion', 'generosity', 'diplomatic'],
      keywordsKr: ['균형', '연민', '관대함', '외교적'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_cups_king.jpg'),
      element: 'water',
      suit: 'cups',
      type: 'Minor Arcana'
    }
  ],

  // 마이너 아르카나 - 검 (공기의 원소, 14장)
  swords: [
    {
      id: 50,
      name: 'Ace of Swords',
      nameKr: '검 에이스',
      meaning: 'Breakthrough, clarity, sharp mind, new ideas',
      meaningKr: '돌파구와 명확한 사고',
      keywords: ['breakthrough', 'clarity', 'sharp mind', 'new ideas'],
      keywordsKr: ['돌파', '명확', '날카로운 사고', '아이디어'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_swords_ace.jpg'),
      element: 'air',
      suit: 'swords',
      type: 'Minor Arcana'
    },
    {
      id: 51,
      name: 'Two of Swords',
      nameKr: '검 2',
      meaning: 'Difficult decisions, weighing options, indecision',
      meaningKr: '어려운 결정과 우유부단',
      keywords: ['difficult decisions', 'weighing options', 'indecision', 'blocked emotions'],
      keywordsKr: ['어려운 결정', '선택', '우유부단', '감정 차단'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_swords_02.jpg'),
      element: 'air',
      suit: 'swords',
      type: 'Minor Arcana'
    },
    {
      id: 52,
      name: 'Three of Swords',
      nameKr: '검 3',
      meaning: 'Heartbreak, betrayal, sorrow, pain',
      meaningKr: '상심과 배신',
      keywords: ['heartbreak', 'betrayal', 'sorrow', 'pain'],
      keywordsKr: ['상심', '배신', '슬픔', '고통'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_swords_03.jpg'),
      element: 'air',
      suit: 'swords',
      type: 'Minor Arcana'
    },
    {
      id: 53,
      name: 'Four of Swords',
      nameKr: '검 4',
      meaning: 'Rest, relaxation, meditation, contemplation',
      meaningKr: '휴식과 명상',
      keywords: ['rest', 'relaxation', 'meditation', 'contemplation'],
      keywordsKr: ['휴식', '이완', '명상', '사고'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_swords_04.jpg'),
      element: 'air',
      suit: 'swords',
      type: 'Minor Arcana'
    },
    {
      id: 54,
      name: 'Five of Swords',
      nameKr: '검 5',
      meaning: 'Conflict, disagreements, competition, defeat',
      meaningKr: '갈등과 패배',
      keywords: ['conflict', 'disagreements', 'competition', 'defeat'],
      keywordsKr: ['갈등', '불일치', '경쟁', '패배'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_swords_05.jpg'),
      element: 'air',
      suit: 'swords',
      type: 'Minor Arcana'
    },
    {
      id: 55,
      name: 'Six of Swords',
      nameKr: '검 6',
      meaning: 'Transition, change, rite of passage, releasing baggage',
      meaningKr: '전환과 변화',
      keywords: ['transition', 'change', 'rite of passage', 'releasing baggage'],
      keywordsKr: ['전환', '변화', '통과의례', '짐 내려놓기'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_swords_06.jpg'),
      element: 'air',
      suit: 'swords',
      type: 'Minor Arcana'
    },
    {
      id: 56,
      name: 'Seven of Swords',
      nameKr: '검 7',
      meaning: 'Betrayal, deception, getting away with something',
      meaningKr: '배신과 속임수',
      keywords: ['betrayal', 'deception', 'getting away with something', 'stealth'],
      keywordsKr: ['배신', '속임', '도망', '은밀함'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_swords_07.jpg'),
      element: 'air',
      suit: 'swords',
      type: 'Minor Arcana'
    },
    {
      id: 57,
      name: 'Eight of Swords',
      nameKr: '검 8',
      meaning: 'Isolation, restriction, self-imposed prison',
      meaningKr: '고립과 자가 감금',
      keywords: ['isolation', 'restriction', 'self-imposed prison', 'victim mentality'],
      keywordsKr: ['고립', '제한', '자가감금', '피해의식'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_swords_08.jpg'),
      element: 'air',
      suit: 'swords',
      type: 'Minor Arcana'
    },
    {
      id: 58,
      name: 'Nine of Swords',
      nameKr: '검 9',
      meaning: 'Anxiety, worry, fear, depression',
      meaningKr: '불안과 걱정',
      keywords: ['anxiety', 'worry', 'fear', 'depression'],
      keywordsKr: ['불안', '걱정', '두려움', '우울'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_swords_09.jpg'),
      element: 'air',
      suit: 'swords',
      type: 'Minor Arcana'
    },
    {
      id: 59,
      name: 'Ten of Swords',
      nameKr: '검 10',
      meaning: 'Painful endings, deep wounds, betrayal, rock bottom',
      meaningKr: '고통스러운 끝과 바닥',
      keywords: ['painful endings', 'deep wounds', 'betrayal', 'rock bottom'],
      keywordsKr: ['고통스러운 끝', '깊은 상처', '배신', '바닥'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_swords_10.jpg'),
      element: 'air',
      suit: 'swords',
      type: 'Minor Arcana'
    },
    {
      id: 60,
      name: 'Page of Swords',
      nameKr: '검 페이지',
      meaning: 'New ideas, curiosity, thirst for knowledge',
      meaningKr: '새로운 아이디어와 호기심',
      keywords: ['new ideas', 'curiosity', 'thirst for knowledge', 'vigilance'],
      keywordsKr: ['아이디어', '호기심', '지식욕', '경계심'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_swords_page.jpg'),
      element: 'air',
      suit: 'swords',
      type: 'Minor Arcana'
    },
    {
      id: 61,
      name: 'Knight of Swords',
      nameKr: '검 기사',
      meaning: 'Ambitious, action-oriented, driven to succeed',
      meaningKr: '야망과 행동 지향',
      keywords: ['ambitious', 'action-oriented', 'driven to succeed', 'fast thinking'],
      keywordsKr: ['야망', '행동지향', '성공욕구', '빠른사고'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_swords_knight.jpg'),
      element: 'air',
      suit: 'swords',
      type: 'Minor Arcana'
    },
    {
      id: 62,
      name: 'Queen of Swords',
      nameKr: '검 여왕',
      meaning: 'Independence, unbiased judgement, clear boundaries',
      meaningKr: '독립성과 명확한 판단',
      keywords: ['independence', 'unbiased judgement', 'clear boundaries', 'direct communication'],
      keywordsKr: ['독립성', '공정한 판단', '명확한 경계', '직접적 소통'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_swords_queen.jpg'),
      element: 'air',
      suit: 'swords',
      type: 'Minor Arcana'
    },
    {
      id: 63,
      name: 'King of Swords',
      nameKr: '검 왕',
      meaning: 'Mental clarity, intellectual power, authority',
      meaningKr: '정신적 명료함과 권위',
      keywords: ['mental clarity', 'intellectual power', 'authority', 'truth'],
      keywordsKr: ['정신적 명료함', '지적 권력', '권위', '진실'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_swords_king.jpg'),
      element: 'air',
      suit: 'swords',
      type: 'Minor Arcana'
    }
  ],

  // 마이너 아르카나 - 펜타클 (땅의 원소, 14장)
  pentacles: [
    {
      id: 64,
      name: 'Ace of Pentacles',
      nameKr: '펜타클 에이스',
      meaning: 'A new financial or career opportunity, manifestation',
      meaningKr: '새로운 재정적 기회',
      keywords: ['new financial opportunity', 'manifestation', 'abundance', 'new business'],
      keywordsKr: ['재정적 기회', '현실화', '풍요', '새사업'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_pentacles_ace.jpg'),
      element: 'earth',
      suit: 'pentacles',
      type: 'Minor Arcana'
    },
    {
      id: 65,
      name: 'Two of Pentacles',
      nameKr: '펜타클 2',
      meaning: 'Multiple priorities, time management, prioritisation',
      meaningKr: '다중 우선순위와 시간 관리',
      keywords: ['multiple priorities', 'time management', 'prioritisation', 'adaptability'],
      keywordsKr: ['다중 우선순위', '시간관리', '우선순위', '적응력'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_pentacles_02.jpg'),
      element: 'earth',
      suit: 'pentacles',
      type: 'Minor Arcana'
    },
    {
      id: 66,
      name: 'Three of Pentacles',
      nameKr: '펜타클 3',
      meaning: 'Teamwork, collaboration, learning, implementation',
      meaningKr: '팀워크와 협력',
      keywords: ['teamwork', 'collaboration', 'learning', 'implementation'],
      keywordsKr: ['팀워크', '협력', '학습', '실행'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_pentacles_03.jpg'),
      element: 'earth',
      suit: 'pentacles',
      type: 'Minor Arcana'
    },
    {
      id: 67,
      name: 'Four of Pentacles',
      nameKr: '펜타클 4',
      meaning: 'Saving money, security, conservatism, scarcity',
      meaningKr: '돈 저축과 보안',
      keywords: ['saving money', 'security', 'conservatism', 'scarcity'],
      keywordsKr: ['돈 저축', '보안', '보수주의', '부족함'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_pentacles_04.jpg'),
      element: 'earth',
      suit: 'pentacles',
      type: 'Minor Arcana'
    },
    {
      id: 68,
      name: 'Five of Pentacles',
      nameKr: '펜타클 5',
      meaning: 'Financial loss, poverty, lack mindset, isolation',
      meaningKr: '재정적 손실과 고립',
      keywords: ['financial loss', 'poverty', 'lack mindset', 'isolation'],
      keywordsKr: ['재정적 손실', '빈곤', '결핍사고', '고립'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_pentacles_05.jpg'),
      element: 'earth',
      suit: 'pentacles',
      type: 'Minor Arcana'
    },
    {
      id: 69,
      name: 'Six of Pentacles',
      nameKr: '펜타클 6',
      meaning: 'Sharing wealth, generosity, charity, fairness',
      meaningKr: '부의 나눔과 관대함',
      keywords: ['sharing wealth', 'generosity', 'charity', 'fairness'],
      keywordsKr: ['부의 나눔', '관대함', '자선', '공정함'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_pentacles_06.jpg'),
      element: 'earth',
      suit: 'pentacles',
      type: 'Minor Arcana'
    },
    {
      id: 70,
      name: 'Seven of Pentacles',
      nameKr: '펜타클 7',
      meaning: 'Long-term view, sustainable results, perseverance',
      meaningKr: '장기적 관점과 인내',
      keywords: ['long-term view', 'sustainable results', 'perseverance', 'investment'],
      keywordsKr: ['장기적 관점', '지속가능한 결과', '인내', '투자'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_pentacles_07.jpg'),
      element: 'earth',
      suit: 'pentacles',
      type: 'Minor Arcana'
    },
    {
      id: 71,
      name: 'Eight of Pentacles',
      nameKr: '펜타클 8',
      meaning: 'Apprenticeship, repetitive tasks, mastery, skill development',
      meaningKr: '견습과 기술 개발',
      keywords: ['apprenticeship', 'repetitive tasks', 'mastery', 'skill development'],
      keywordsKr: ['견습', '반복작업', '숙련', '기술개발'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_pentacles_08.jpg'),
      element: 'earth',
      suit: 'pentacles',
      type: 'Minor Arcana'
    },
    {
      id: 72,
      name: 'Nine of Pentacles',
      nameKr: '펜타클 9',
      meaning: 'Abundance, luxury, self-reliance, financial independence',
      meaningKr: '풍요와 재정적 독립',
      keywords: ['abundance', 'luxury', 'self-reliance', 'financial independence'],
      keywordsKr: ['풍요', '사치', '자립', '재정적 독립'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_pentacles_09.jpg'),
      element: 'earth',
      suit: 'pentacles',
      type: 'Minor Arcana'
    },
    {
      id: 73,
      name: 'Ten of Pentacles',
      nameKr: '펜타클 10',
      meaning: 'Wealth, financial security, family, long-term success',
      meaningKr: '부와 가족의 성공',
      keywords: ['wealth', 'financial security', 'family', 'long-term success'],
      keywordsKr: ['부', '재정적 안정', '가족', '장기적 성공'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_pentacles_10.jpg'),
      element: 'earth',
      suit: 'pentacles',
      type: 'Minor Arcana'
    },
    {
      id: 74,
      name: 'Page of Pentacles',
      nameKr: '펜타클 페이지',
      meaning: 'Learning, studying, new opportunities, hard work',
      meaningKr: '학습과 새로운 기회',
      keywords: ['learning', 'studying', 'new opportunities', 'hard work'],
      keywordsKr: ['학습', '공부', '새기회', '근면'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_pentacles_page.jpg'),
      element: 'earth',
      suit: 'pentacles',
      type: 'Minor Arcana'
    },
    {
      id: 75,
      name: 'Knight of Pentacles',
      nameKr: '펜타클 기사',
      meaning: 'Hard work, productivity, routine, conservatism',
      meaningKr: '근면과 생산성',
      keywords: ['hard work', 'productivity', 'routine', 'conservatism'],
      keywordsKr: ['근면', '생산성', '일상', '보수주의'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_pentacles_knight.jpg'),
      element: 'earth',
      suit: 'pentacles',
      type: 'Minor Arcana'
    },
    {
      id: 76,
      name: 'Queen of Pentacles',
      nameKr: '펜타클 여왕',
      meaning: 'Nurturing, practical, providing financially, down-to-earth',
      meaningKr: '보살핌과 실용성',
      keywords: ['nurturing', 'practical', 'providing financially', 'down-to-earth'],
      keywordsKr: ['보살핌', '실용적', '재정적 지원', '현실적'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_pentacles_queen.jpg'),
      element: 'earth',
      suit: 'pentacles',
      type: 'Minor Arcana'
    },
    {
      id: 77,
      name: 'King of Pentacles',
      nameKr: '펜타클 왕',
      meaning: 'Financial success, security, disciplined, abundant',
      meaningKr: '재정적 성공과 풍요',
      keywords: ['financial success', 'security', 'disciplined', 'abundant'],
      keywordsKr: ['재정적 성공', '안정', '절제된', '풍부한'],
      imageUrl: require('../../assets/tarot-cards/classic-tarot/minor_pentacles_king.jpg'),
      element: 'earth',
      suit: 'pentacles',
      type: 'Minor Arcana'
    }
  ]
};

// 모든 카드를 하나의 배열로 통합
export const ALL_TAROT_CARDS = [
  ...FULL_TAROT_DECK.major,
  ...FULL_TAROT_DECK.wands,
  ...FULL_TAROT_DECK.cups,
  ...FULL_TAROT_DECK.swords,
  ...FULL_TAROT_DECK.pentacles
];

// 24시간 시스템을 위한 랜덤 카드 생성
export const generateDailyCards = (date) => {
  const seed = date.toDateString();
  const cards = [...ALL_TAROT_CARDS];
  
  // 시드를 기반으로 한 의사 랜덤 함수
  const seededRandom = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32bit integer로 변환
    }
    return Math.abs(hash) / 2147483647;
  };

  // 날짜 기반으로 카드 섞기
  const shuffledCards = [...cards];
  for (let i = shuffledCards.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
  }

  return shuffledCards.slice(0, 24);
};

// 현재 시간 반환
export const getCurrentHour = () => {
  return new Date().getHours();
};

// 시간 포맷팅
export const formatHour = (hour) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${period}`;
};

// 날짜 포맷팅
export const formatDate = (date) => {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
};

// ID로 카드 찾기
export const getCardById = (id) => {
  return ALL_TAROT_CARDS.find(card => card.id === id);
};

// 랜덤 카드 선택
export const getRandomCard = () => {
  const randomIndex = Math.floor(Math.random() * ALL_TAROT_CARDS.length);
  return ALL_TAROT_CARDS[randomIndex];
};

// 수트별 카드 필터링
export const getCardsBySuit = (suit) => {
  return ALL_TAROT_CARDS.filter(card => card.suit === suit);
};