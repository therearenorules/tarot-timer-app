import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { MysticalLayout, MysticalSection, MysticalContainer } from '../Layout/MysticalLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../Card/Card';
import { Button } from '../Button/Button';
import { TarotCard } from '../TarotCard/TarotCard';
import { colorTokens, typographyTokens } from '../../tokens';

// Types  
interface TimerScreenProps {
  currentHour?: number;
  currentCard?: any;
  dailyCards?: any[];
  isDrawing?: boolean;
  onDrawCards?: () => void;
  onSaveReading?: () => void;
  language?: 'ko' | 'en';
}

/**
 * 타이머 화면 컴포넌트
 * 레퍼런스 timer01.png, timer02.png 디자인을 정확히 구현
 */
export const TimerScreen: React.FC<TimerScreenProps> = ({
  currentHour = new Date().getHours(),
  currentCard,
  dailyCards = [],
  isDrawing = false,
  onDrawCards,
  onSaveReading,
  language = 'ko',
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // 시간 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 시간 포맷터
  const formatTime = (hour: number) => {
    const period = hour >= 12 ? '오후' : '오전';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${period} ${displayHour}시`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  // 헤더 렌더링 (레퍼런스 상단 부분)
  const renderHeader = () => (
    <MysticalSection centered spacing="lg">
      {/* 타로 아이콘 */}
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
        <Text style={{ fontSize: 28, color: colorTokens.background.primary }}>👑</Text>
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
        Tarot Timer
      </Text>

      {/* 날짜 */}
      <Text
        style={{
          fontSize: 16,
          color: colorTokens.text.secondary,
          textAlign: 'center',
        }}
      >
        {formatDate(currentTime)}
      </Text>
    </MysticalSection>
  );

  // 메인 카드 영역 (레퍼런스 중앙 카드)
  const renderMainCard = () => {
    if (!currentCard) {
      // 카드를 뽑기 전 상태 (timer01.png 스타일)
      return (
        <MysticalSection centered>
          <Card size="lg" variant="glass">
            <CardContent>
              <View style={{ alignItems: 'center', paddingVertical: 24 }}>
                {/* 번개 아이콘 */}
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: colorTokens.brand.secondary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20,
                  }}
                >
                  <Text style={{ fontSize: 24, color: colorTokens.background.primary }}>⚡</Text>
                </View>

                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: '700',
                    color: colorTokens.text.primary,
                    textAlign: 'center',
                    marginBottom: 12,
                  }}
                >
                  운명을 밝혀보세요
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    color: colorTokens.text.secondary,
                    textAlign: 'center',
                    lineHeight: 24,
                    marginBottom: 24,
                  }}
                >
                  오늘 하루 각 시간마다 호르는 우주의 에너지를 발견해보세요
                </Text>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onPress={onDrawCards}
                  loading={isDrawing}
                  leftIcon={<Text>⚡</Text>}
                >
                  24시간 타로 뽑기
                </Button>
              </View>
            </CardContent>
          </Card>
        </MysticalSection>
      );
    }

    // 카드를 뽑은 후 상태 (timer02.png 스타일)
    return (
      <MysticalSection centered>
        {/* 현재 시간 표시 */}
        <Text
          style={{
            fontSize: 18,
            color: colorTokens.brand.secondary,
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          현재 시간
        </Text>
        
        <Text
          style={{
            fontSize: 36,
            fontWeight: '700',
            color: colorTokens.text.primary,
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          {formatTime(currentHour)}
        </Text>

        {/* 현재 시간 카드 */}
        <TarotCard
          card={currentCard}
          size="xl"
          isRevealed={true}
          showInfo={true}
          language={language}
          style={{ marginBottom: 24 }}
        />

        {/* 카드 정보 */}
        <Card variant="glass" size="md" style={{ width: '100%' }}>
          <CardContent>
            <View style={{ alignItems: 'center', paddingVertical: 12 }}>
              {/* 키워드 배지들 */}
              {currentCard.keywordsKr && (
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginBottom: 16,
                    gap: 8,
                  }}
                >
                  {currentCard.keywordsKr.slice(0, 3).map((keyword: string, index: number) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: 'rgba(212, 175, 55, 0.2)',
                        borderColor: colorTokens.brand.secondary,
                        borderWidth: 1,
                        borderRadius: 16,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: colorTokens.brand.secondary,
                          fontWeight: '500',
                        }}
                      >
                        {keyword}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <Text
                style={{
                  fontSize: 16,
                  color: colorTokens.text.secondary,
                  textAlign: 'center',
                  lineHeight: 24,
                }}
              >
                {currentCard.meaningKr}
              </Text>
            </View>
          </CardContent>
        </Card>
      </MysticalSection>
    );
  };

  // 하단 인용구 (레퍼런스 하단)
  const renderQuote = () => (
    <MysticalSection centered spacing="sm">
      <Card variant="outline" size="sm">
        <CardContent>
          <Text
            style={{
              fontSize: 14,
              color: colorTokens.text.tertiary,
              fontStyle: 'italic',
              textAlign: 'center',
              lineHeight: 20,
            }}
          >
            "매 순간마다 우주의 메시지가 와닿니다. 마음을 열고 지혜를 받아들이세요."
          </Text>
        </CardContent>
      </Card>
    </MysticalSection>
  );

  return (
    <MysticalLayout
      safeArea={true}
      scrollable={true}
      backgroundVariant="primary"
      padding={true}
    >
      <MysticalContainer maxWidth={400} centered>
        {renderHeader()}
        {renderMainCard()}
        {renderQuote()}
      </MysticalContainer>
    </MysticalLayout>
  );
};

// Export types
export type { TimerScreenProps };