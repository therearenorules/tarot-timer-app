/**
 * Metadata System Usage Examples
 * Demonstrates how to use the metadata management system across different pages
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import MetadataManager from '../components/SEO/MetadataManager';
import { useMetadata } from '../hooks/useMetadata';
import { seoUtils } from '../utils/seoUtils';

// Example 1: Home Page with comprehensive metadata
export const HomePageExample: React.FC = () => {
  return (
    <MetadataManager config={seoUtils.generateHomeMetadata()}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
          🔮 타로 타이머 홈페이지
        </Text>
        <Text>홈페이지용 포괄적인 SEO 메타데이터가 적용되었습니다.</Text>
      </View>
    </MetadataManager>
  );
};

// Example 2: Tarot Card Detail Page
export const CardDetailExample: React.FC = () => {
  const cardData = {
    id: 0,
    name: 'The Fool',
    nameKo: '바보',
    type: 'major' as const,
    keywords: ['새로운 시작', '순수', '모험', '자유'],
    uprightMeaning: '새로운 시작과 순수한 마음으로 모험을 떠날 때',
    reversedMeaning: '무모함과 경솔한 행동을 조심해야 할 때',
    imageUrl: '/cards/major/00-fool.png'
  };

  return (
    <MetadataManager config={seoUtils.generateCardMetadata(cardData)}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
          {cardData.nameKo} ({cardData.name})
        </Text>
        <Text style={{ marginBottom: 10 }}>정방향: {cardData.uprightMeaning}</Text>
        <Text style={{ marginBottom: 10 }}>역방향: {cardData.reversedMeaning}</Text>
        <Text>키워드: {cardData.keywords.join(', ')}</Text>
      </View>
    </MetadataManager>
  );
};

// Example 3: Daily Reading Page
export const DailyReadingExample: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <MetadataManager config={seoUtils.generateDailyReadingMetadata(today)}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
          📅 오늘의 타로
        </Text>
        <Text>오늘의 타로 리딩을 위한 메타데이터가 적용되었습니다.</Text>
        <Text>날짜별 고유한 SEO 최적화가 포함됩니다.</Text>
      </View>
    </MetadataManager>
  );
};

// Example 4: Tarot Spread Page
export const SpreadDetailExample: React.FC = () => {
  const spreadData = {
    id: 'celtic-cross',
    name: 'Celtic Cross',
    nameKo: '켈틱 크로스',
    description: '가장 인기 있는 10장 카드 스프레드로, 현재 상황과 미래를 종합적으로 볼 수 있습니다.',
    positions: 10,
    difficulty: 'intermediate' as const
  };

  return (
    <MetadataManager config={seoUtils.generateSpreadMetadata(spreadData)}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
          {spreadData.nameKo} ({spreadData.name})
        </Text>
        <Text style={{ marginBottom: 10 }}>{spreadData.description}</Text>
        <Text>카드 수: {spreadData.positions}장</Text>
        <Text>난이도: {spreadData.difficulty}</Text>
      </View>
    </MetadataManager>
  );
};

// Example 5: Custom Article Page
export const ArticleExample: React.FC = () => {
  const articleMetadata = seoUtils.generateArticleMetadata({
    title: '타로 카드 입문자를 위한 완벽 가이드',
    description: '타로 카드를 처음 시작하는 분들을 위한 종합 가이드입니다. 카드의 의미부터 리딩 방법까지 모든 것을 알려드립니다.',
    keywords: ['타로입문', '타로가이드', '초보자타로', '타로배우기'],
    publishDate: '2024-01-15',
    section: 'Tarot Guide',
    tags: ['초보자', '가이드', '타로카드'],
    imageUrl: '/articles/tarot-beginner-guide.png',
    canonicalPath: '/articles/tarot-beginner-guide'
  });

  return (
    <MetadataManager config={articleMetadata}>
      <ScrollView style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20 }}>
          타로 카드 입문자를 위한 완벽 가이드
        </Text>
        <Text style={{ fontSize: 16, lineHeight: 24, marginBottom: 16 }}>
          타로 카드는 수 세기 동안 사람들이 자신의 내면을 탐색하고 미래에 대한 통찰을 얻기 위해 사용해온 도구입니다.
        </Text>
        <Text style={{ fontSize: 16, lineHeight: 24, marginBottom: 16 }}>
          이 가이드는 타로 카드를 처음 시작하는 분들을 위해 준비되었습니다.
        </Text>
      </ScrollView>
    </MetadataManager>
  );
};

// Example 6: Dynamic metadata updates with hooks
export const DynamicMetadataExample: React.FC = () => {
  const [currentCard, setCurrentCard] = React.useState('fool');
  
  const cardMetadata = React.useMemo(() => {
    const cards = {
      fool: {
        id: 0, name: 'The Fool', nameKo: '바보', type: 'major' as const,
        keywords: ['새로운 시작'], uprightMeaning: '새로운 시작', reversedMeaning: '무모함',
        imageUrl: '/cards/fool.png'
      },
      magician: {
        id: 1, name: 'The Magician', nameKo: '마법사', type: 'major' as const,
        keywords: ['의지력'], uprightMeaning: '의지력과 창조', reversedMeaning: '조작과 속임',
        imageUrl: '/cards/magician.png'
      }
    };
    return seoUtils.generateCardMetadata(cards[currentCard as keyof typeof cards]);
  }, [currentCard]);

  const { updateMetadata } = useMetadata(cardMetadata);

  const switchCard = (cardName: string) => {
    setCurrentCard(cardName);
    // 메타데이터도 동적으로 업데이트
    updateMetadata(seoUtils.generateCardMetadata({
      id: cardName === 'fool' ? 0 : 1,
      name: cardName === 'fool' ? 'The Fool' : 'The Magician',
      nameKo: cardName === 'fool' ? '바보' : '마법사',
      type: 'major',
      keywords: cardName === 'fool' ? ['새로운 시작'] : ['의지력'],
      uprightMeaning: cardName === 'fool' ? '새로운 시작' : '의지력과 창조',
      reversedMeaning: cardName === 'fool' ? '무모함' : '조작과 속임',
      imageUrl: `/cards/${cardName}.png`
    }));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        동적 메타데이터 업데이트 예시
      </Text>
      <Text style={{ marginBottom: 20 }}>
        버튼을 클릭하면 페이지의 메타데이터가 실시간으로 업데이트됩니다.
      </Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Text 
          style={{ 
            padding: 10, 
            backgroundColor: currentCard === 'fool' ? '#6366f1' : '#ccc',
            color: 'white',
            borderRadius: 8
          }}
          onPress={() => switchCard('fool')}
        >
          바보 카드
        </Text>
        <Text 
          style={{ 
            padding: 10, 
            backgroundColor: currentCard === 'magician' ? '#6366f1' : '#ccc',
            color: 'white',
            borderRadius: 8
          }}
          onPress={() => switchCard('magician')}
        >
          마법사 카드
        </Text>
      </View>
      <Text style={{ marginTop: 20 }}>
        현재 선택된 카드: {currentCard === 'fool' ? '바보' : '마법사'}
      </Text>
    </View>
  );
};

// Example 7: Settings page with noindex
export const SettingsPageExample: React.FC = () => {
  return (
    <MetadataManager config={seoUtils.generateSettingsMetadata()}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
          ⚙️ 설정
        </Text>
        <Text>이 페이지는 noindex 메타데이터가 적용되어 검색 엔진에 색인되지 않습니다.</Text>
      </View>
    </MetadataManager>
  );
};

// Combined example component
export const MetadataExamplesDemo: React.FC = () => {
  const [currentExample, setCurrentExample] = React.useState<string>('home');

  const examples = {
    home: HomePageExample,
    card: CardDetailExample,
    daily: DailyReadingExample,
    spread: SpreadDetailExample,
    article: ArticleExample,
    dynamic: DynamicMetadataExample,
    settings: SettingsPageExample
  };

  const ExampleComponent = examples[currentExample as keyof typeof examples];

  return (
    <View style={{ flex: 1 }}>
      {/* Navigation */}
      <ScrollView 
        horizontal 
        style={{ 
          maxHeight: 60, 
          backgroundColor: '#f8f9fa', 
          borderBottomWidth: 1, 
          borderBottomColor: '#dee2e6' 
        }}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {Object.keys(examples).map((key) => (
          <Text
            key={key}
            style={{
              padding: 12,
              marginRight: 8,
              backgroundColor: currentExample === key ? '#6366f1' : 'transparent',
              color: currentExample === key ? 'white' : '#333',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: '500'
            }}
            onPress={() => setCurrentExample(key)}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </Text>
        ))}
      </ScrollView>

      {/* Content */}
      <ExampleComponent />
      
      {/* Debug info in development */}
      {__DEV__ && (
        <View style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: 10,
          borderRadius: 8,
          maxWidth: 300
        }}>
          <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
            DEV: 메타데이터 예시 - {currentExample}
          </Text>
          <Text style={{ color: '#ccc', fontSize: 10, marginTop: 4 }}>
            브라우저 개발자 도구에서 head 태그의 메타데이터 변화를 확인하세요.
          </Text>
        </View>
      )}
    </View>
  );
};

export default MetadataExamplesDemo;