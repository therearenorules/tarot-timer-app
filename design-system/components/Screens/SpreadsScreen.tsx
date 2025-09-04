import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { MysticalLayout, MysticalSection, MysticalContainer } from '../Layout/MysticalLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../Card/Card';
import { Button } from '../Button/Button';
import { colorTokens } from '../../tokens';

// Types
interface SpreadType {
  id: string;
  name: string;
  nameKr: string;
  description: string;
  descriptionKr: string;
  positions: string[];
  positionsKr: string[];
  isPremium?: boolean;
}

interface SpreadsScreenProps {
  spreads?: SpreadType[];
  onStartSpread?: (spread: SpreadType) => void;
  language?: 'ko' | 'en';
}

/**
 * 스프레드 화면 컴포넌트  
 * 레퍼런스 spread01.png 디자인을 정확히 구현
 */
export const SpreadsScreen: React.FC<SpreadsScreenProps> = ({
  spreads = [],
  onStartSpread,
  language = 'ko',
}) => {
  // 기본 스프레드 데이터
  const defaultSpreads: SpreadType[] = [
    {
      id: 'three-card',
      name: 'Three Card Spread',
      nameKr: '3카드',
      description: 'Past, Present, Future',
      descriptionKr: '과거, 현재, 미래',
      positions: ['Past', 'Present', 'Future'],
      positionsKr: ['과거', '현재', '미래'],
    },
    {
      id: 'four-card',
      name: 'Four Card Spread', 
      nameKr: '4카드',
      description: 'Balance and harmony in four key areas',
      descriptionKr: '네 가지 핵심 영역의 균형과 조화',
      positions: ['Mind', 'Body', 'Spirit', 'Action'],
      positionsKr: ['마음', '몸', '영혼', '행동'],
    },
    {
      id: 'five-card',
      name: 'Five Card V-Shape',
      nameKr: '5카드',
      description: 'V-shaped spread for comprehensive guidance',
      descriptionKr: 'V자 형태로 보는 종합적인 안내',
      positions: ['Foundation', 'Challenge', 'Strength', 'Advice', 'Outcome'],
      positionsKr: ['기반', '도전', '힘', '조언', '결과'],
      isPremium: true,
    },
  ];

  const spreadList = spreads.length > 0 ? spreads : defaultSpreads;

  // 헤더 렌더링
  const renderHeader = () => (
    <MysticalSection centered spacing="lg">
      {/* 스프레드 아이콘 */}
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: colorTokens.brand.secondary,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 28, color: colorTokens.background.primary }}>📑</Text>
      </View>

      {/* 타이틀 */}
      <Text
        style={{
          fontSize: 32,
          fontWeight: '700',
          color: colorTokens.text.primary,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        Tarot Spreads
      </Text>

      {/* 서브타이틀 */}
      <Text
        style={{
          fontSize: 16,
          color: colorTokens.text.secondary,
          textAlign: 'center',
        }}
      >
        우주 지혜로 찾아는 길을 선택하세요
      </Text>
    </MysticalSection>
  );

  // 스프레드 카드 렌더링
  const renderSpreadCard = ({ item: spread }: { item: SpreadType }) => (
    <Card 
      variant="glass" 
      size="md" 
      style={{ 
        marginBottom: 16,
        width: '100%',
      }}
      onPress={() => onStartSpread?.(spread)}
    >
      <CardContent>
        <View style={{ paddingVertical: 8 }}>
          {/* 스프레드 헤더 */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: colorTokens.brand.secondary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}
              >
                <Text style={{ fontSize: 16, color: colorTokens.background.primary }}>📑</Text>
              </View>
              
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '600',
                  color: colorTokens.text.primary,
                }}
              >
                {spread.nameKr}
              </Text>
            </View>

            {/* 프리미엄 배지 */}
            {spread.isPremium && (
              <View
                style={{
                  backgroundColor: colorTokens.brand.secondary,
                  borderRadius: 12,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: colorTokens.background.primary,
                  }}
                >
                  프리미엄
                </Text>
              </View>
            )}
          </View>

          {/* 영문 이름 */}
          <Text
            style={{
              fontSize: 14,
              color: colorTokens.brand.secondary,
              marginBottom: 12,
            }}
          >
            {spread.name}
          </Text>

          {/* 설명 */}
          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: colorTokens.text.secondary,
                lineHeight: 20,
              }}
            >
              {spread.descriptionKr}
            </Text>
          </View>

          {/* 시작하기 버튼 */}
          <Button
            variant="primary"
            size="md"
            fullWidth
            onPress={() => onStartSpread?.(spread)}
            leftIcon={<Text>⚡</Text>}
          >
            리딩 시작하기
          </Button>
        </View>
      </CardContent>
    </Card>
  );

  return (
    <MysticalLayout
      safeArea={true}
      scrollable={false}
      backgroundVariant="primary" 
      padding={true}
    >
      <MysticalContainer maxWidth={400} centered>
        {renderHeader()}
        
        <MysticalSection spacing="md">
          <FlatList
            data={spreadList}
            renderItem={renderSpreadCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 100, // 탭바 여백
            }}
          />
        </MysticalSection>
      </MysticalContainer>
    </MysticalLayout>
  );
};

// Export types
export type { SpreadsScreenProps, SpreadType };