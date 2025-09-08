export interface SpreadSave {
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

export const MOCK_SAVED_SPREADS: SpreadSave[] = [
  {
    id: '1',
    spreadType: 'celtic-cross',
    title: 'Celtic Cross - 인생의 전환점',
    spreadName: 'Celtic Cross',
    spreadNameKr: '켈틱크로스',
    date: new Date(Date.now() - 86400000).toDateString(),
    cards: Array.from({ length: 10 }, (_, index) => ({
      id: `card-${index}`,
      nameKr: ['바보', '마법사', '여교황', '황제', '교황', '연인', '전차', '힘', '은둔자', '운명의 바퀴'][index],
      name: ['The Fool', 'The Magician', 'The High Priestess', 'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit', 'Wheel of Fortune'][index],
      imageUrl: `https://images.unsplash.com/photo-${1506905925346 + index}?w=300&h=500&fit=crop`,
      position: ['Present', 'Challenge', 'Distant Past', 'Recent Past', 'Crown', 'Near Future', 'Self', 'External', 'Hopes/Fears', 'Outcome'][index],
      positionKr: ['현재', '장애물', '과거', '최근 과거', '정점', '가까운 미래', '자아', '외부환경', '희망과 두려움', '결과'][index],
      isRevealed: true
    })),
    notes: '중요한 인생의 결정을 앞두고 진행한 켈틱크로스 스프레드입니다.',
    savedAt: new Date(Date.now() - 82800000).toISOString()
  },
  {
    id: '2',
    spreadType: 'love',
    title: 'Cup of Relationship - 연인과의 미래',
    spreadName: 'Cup of Relationship',
    spreadNameKr: '컵 오브 릴레이션십',
    date: new Date(Date.now() - 172800000).toDateString(),
    cards: Array.from({ length: 11 }, (_, index) => ({
      id: `rel-card-${index}`,
      nameKr: ['연인', '컵 2', '여황제', '컵 10', '펜타클 3', '소드 2', '완드 2', '컵 에이스', '별', '태양', '세계'][index],
      name: ['The Lovers', 'Two of Cups', 'The Empress', 'Ten of Cups', 'Three of Pentacles', 'Two of Swords', 'Two of Wands', 'Ace of Cups', 'The Star', 'The Sun', 'The World'][index],
      imageUrl: `https://images.unsplash.com/photo-${1570829460005 + index}?w=300&h=500&fit=crop`,
      position: ['You', 'Partner', 'Relationship', 'Past', 'Present', 'Obstacles', 'Your Heart', 'Partner Heart', 'Your Desires', 'Partner Desires', 'Outcome'][index],
      positionKr: ['나의 현재 상태', '상대의 현재 상태', '우리의 현재 상태', '과거', '현재', '방해물', '나의 마음', '상대의 마음', '내가 상대에게 바라는 점', '상대가 나에게 바라는 점', '결과'][index],
      isRevealed: true
    })),
    notes: '관계의 깊은 이해와 앞으로의 방향성을 탐색한 리딩입니다.',
    savedAt: new Date(Date.now() - 169200000).toISOString()
  },
  {
    id: '3',
    spreadType: 'career',
    title: 'AB Choice - 진로 선택',
    spreadName: 'AB Choice Spread',
    spreadNameKr: 'AB선택 스프레드',
    date: new Date(Date.now() - 259200000).toDateString(),
    cards: Array.from({ length: 7 }, (_, index) => ({
      id: `choice-card-${index}`,
      nameKr: ['펜타클 에이스', '완드 3', '소드 킹', '정의', '컵 퀸', '펜타클 10', '별'][index],
      name: ['Ace of Pentacles', 'Three of Wands', 'King of Swords', 'Justice', 'Queen of Cups', 'Ten of Pentacles', 'The Star'][index],
      imageUrl: `https://images.unsplash.com/photo-${1551731409043 + index}?w=300&h=500&fit=crop`,
      position: ['Option A1', 'Option A2', 'Option A3', 'Core Issue', 'Option B1', 'Option B2', 'Option B3'][index],
      positionKr: ['선택지 A1', '선택지 A2', '선택지 A3', '핵심 문제', '선택지 B1', '선택지 B2', '선택지 B3'][index],
      isRevealed: true
    })),
    notes: '두 가지 진로 선택지를 놓고 진행한 AB선택 스프레드입니다.',
    savedAt: new Date(Date.now() - 255600000).toISOString()
  },
  {
    id: '4',
    spreadType: 'three-card',
    title: '3카드 스프레드 - 일일 가이던스',
    spreadName: 'Three Card Spread',
    spreadNameKr: '3카드 스프레드',
    date: new Date(Date.now() - 345600000).toDateString(),
    cards: Array.from({ length: 3 }, (_, index) => ({
      id: `three-card-${index}`,
      nameKr: ['바보', '마법사', '여교황'][index],
      name: ['The Fool', 'The Magician', 'The High Priestess'][index],
      imageUrl: `https://images.unsplash.com/photo-${1506905925346 + index}?w=300&h=500&fit=crop`,
      position: ['Past', 'Present', 'Future'][index],
      positionKr: ['과거', '현재', '미래'][index],
      isRevealed: true
    })),
    notes: '하루의 시작과 함께 진행한 간단한 3카드 리딩입니다.',
    savedAt: new Date(Date.now() - 342000000).toISOString()
  },
  {
    id: '5',
    spreadType: 'five-card',
    title: '5카드 V자 - 종합 가이던스',
    spreadName: 'Five Card V-Shape',
    spreadNameKr: '5카드',
    date: new Date(Date.now() - 432000000).toDateString(),
    cards: Array.from({ length: 5 }, (_, index) => ({
      id: `five-card-${index}`,
      nameKr: ['별', '태양', '달', '세계', '심판'][index],
      name: ['The Star', 'The Sun', 'The Moon', 'The World', 'Judgement'][index],
      imageUrl: `https://images.unsplash.com/photo-${1506905925346 + index}?w=300&h=500&fit=crop`,
      position: ['Foundation', 'Challenge', 'Strength', 'Advice', 'Outcome'][index],
      positionKr: ['기반', '도전', '힘', '조언', '결과'][index],
      isRevealed: true
    })),
    notes: 'V자 형태로 진행한 종합적인 가이던스 리딩입니다.',
    savedAt: new Date(Date.now() - 428400000).toISOString()
  },
  {
    id: '6',
    spreadType: 'four-card',
    title: '4카드 - 균형과 조화',
    spreadName: 'Four Card Spread',
    spreadNameKr: '4카드',
    date: new Date(Date.now() - 518400000).toDateString(),
    cards: Array.from({ length: 4 }, (_, index) => ({
      id: `four-card-${index}`,
      nameKr: ['마법사', '여교황', '황제', '여황제'][index],
      name: ['The Magician', 'The High Priestess', 'The Emperor', 'The Empress'][index],
      imageUrl: `https://images.unsplash.com/photo-${1518709268805 + index}?w=300&h=500&fit=crop`,
      position: ['Mind', 'Body', 'Spirit', 'Action'][index],
      positionKr: ['마음', '몸', '영혼', '행동'][index],
      isRevealed: true
    })),
    notes: '네 가지 핵심 영역의 균형을 확인한 리딩입니다.',
    savedAt: new Date(Date.now() - 514800000).toISOString()
  }
];