// src/lib/lazyComponents.ts - 향상된 lazy 로딩 시스템
import React, { lazy, ComponentType } from 'react';

// 에러 처리가 포함된 lazy 래퍼 함수
const createLazyComponent = <T extends ComponentType<any>>(
  importFunction: () => Promise<{ default: T }>,
  fallbackName: string = 'Component'
) => {
  return lazy(async () => {
    try {
      const module = await importFunction();
      return module;
    } catch (error) {
      console.warn(`Failed to load ${fallbackName}:`, error);
      // 폴백 컴포넌트 반환
      return {
        default: (() => React.createElement('div', {
          style: { 
            padding: '20px', 
            textAlign: 'center',
            color: '#d4af37',
            backgroundColor: '#1a1f3a',
            borderRadius: '8px',
            border: '1px solid #4a1a4f'
          }
        }, [
          React.createElement('p', { key: 'warning' }, `⚠️ ${fallbackName} 로딩에 실패했습니다`),
          React.createElement('p', { key: 'refresh' }, '페이지를 새로고침해 보세요.')
        ])) as T
      };
    }
  });
};

// 타로 앱 전용 lazy 컴포넌트들
export const SpreadBoard = createLazyComponent(
  () => import('@/features/spreads/SpreadBoard'),
  'SpreadBoard'
);

export const DeckShop = createLazyComponent(
  () => import('@/features/shop/DeckShop'), 
  'DeckShop'
);

// 추가 lazy 컴포넌트들
export const TarotCardDetail = createLazyComponent(
  () => import('@/components/cards/TarotCardDetail'),
  'TarotCardDetail'
);

export const ReadingHistory = createLazyComponent(
  () => import('@/features/history/ReadingHistory'),
  'ReadingHistory'
);

export const SettingsPanel = createLazyComponent(
  () => import('@/features/settings/SettingsPanel'),
  'SettingsPanel'
);

export const CardDatabase = createLazyComponent(
  () => import('@/features/database/CardDatabase'),
  'CardDatabase'
);

export const ThemeCustomizer = createLazyComponent(
  () => import('@/features/themes/ThemeCustomizer'),
  'ThemeCustomizer'
);

export const NotificationCenter = createLazyComponent(
  () => import('@/features/notifications/NotificationCenter'),
  'NotificationCenter'
);

// 성능 모니터링을 위한 lazy 로딩 유틸리티
export const preloadComponent = (component: any) => {
  if (typeof component === 'function') {
    // preload 메서드가 있으면 호출
    component.preload?.();
  }
};

// 여러 컴포넌트를 미리 로드하는 함수
export const preloadComponents = (...components: any[]) => {
  components.forEach(preloadComponent);
};

// 라우트별 프리로드 설정
export const preloadForRoute = (routeName: string) => {
  switch (routeName) {
    case 'spreads':
      preloadComponents(SpreadBoard, TarotCardDetail);
      break;
    case 'shop':
      preloadComponents(DeckShop);
      break;
    case 'history':
      preloadComponents(ReadingHistory, TarotCardDetail);
      break;
    case 'settings':
      preloadComponents(SettingsPanel, ThemeCustomizer, NotificationCenter);
      break;
    default:
      break;
  }
};