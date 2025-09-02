// src/examples/LazyComponentUsage.tsx - lazy 컴포넌트 사용 예시
import React from 'react';
import { View } from 'react-native';
import { 
  SpreadBoard, 
  DeckShop, 
  TarotCardDetail,
  preloadForRoute 
} from '@/lib/lazyComponents';
import { 
  TarotLazyWrapper, 
  SpreadLazyWrapper, 
  ShopLazyWrapper 
} from '@/components/ui/LazyWrapper';

// 스프레드 페이지 예시
export function SpreadsPageExample() {
  React.useEffect(() => {
    // 페이지 진입시 관련 컴포넌트 미리 로드
    preloadForRoute('spreads');
  }, []);

  return (
    <SpreadLazyWrapper>
      <SpreadBoard />
    </SpreadLazyWrapper>
  );
}

// 상점 페이지 예시
export function ShopPageExample() {
  React.useEffect(() => {
    preloadForRoute('shop');
  }, []);

  return (
    <ShopLazyWrapper>
      <DeckShop />
    </ShopLazyWrapper>
  );
}

// 카드 상세 보기 예시
export function CardDetailExample({ cardId }: { cardId: string }) {
  return (
    <TarotLazyWrapper loadingMessage="카드의 비밀을 찾고 있어요...">
      <TarotCardDetail cardId={cardId} />
    </TarotLazyWrapper>
  );
}

// 중첩된 lazy 컴포넌트 예시
export function NestedLazyExample() {
  return (
    <View>
      <TarotLazyWrapper loadingMessage="메인 콘텐츠 로딩 중...">
        <View>
          <SpreadLazyWrapper>
            <SpreadBoard />
          </SpreadLazyWrapper>
          
          <ShopLazyWrapper>
            <DeckShop />
          </ShopLazyWrapper>
        </View>
      </TarotLazyWrapper>
    </View>
  );
}