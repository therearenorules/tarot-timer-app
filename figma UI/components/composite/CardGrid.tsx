import React from 'react';
import { Card } from '../base/Card';
import { Text } from '../base/Text';

/**
 * 🎴 Composite Card Grid Component
 * 
 * Card grid layout assembled from base components.
 * Uses only base components and design tokens.
 * 
 * Features:
 * - Layout variants (grid-2x3, grid-2xN, grid-1xN, horizontal-scroll)
 * - Content variants (spread-grid, daily-grid, theme-grid, generic-grid)
 * - Responsive grid system
 * - Smooth scrolling
 * - Loading states
 * - Full independence from other composites
 */

// Grid layout variants
type GridLayout = 'grid-2x3' | 'grid-2xN' | 'grid-1xN' | 'horizontal-scroll';

// Grid content variants
type GridContent = 'spread-grid' | 'daily-grid' | 'theme-grid' | 'generic-grid' | 'custom';

interface GridItemData {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  badge?: string;
  premium?: boolean;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

interface CardGridProps {
  layout?: GridLayout;
  content?: GridContent;
  items: GridItemData[];
  loading?: boolean;
  emptyText?: string;
  emptySubtext?: string;
  onItemClick?: (item: GridItemData) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Grid Item Component - Internal composite
 */
function GridItem({ 
  item, 
  size, 
  onClick 
}: { 
  item: GridItemData; 
  size: 'small' | 'medium' | 'large';
  onClick?: () => void;
}) {
  
  const handleClick = () => {
    if (!item.disabled && !item.loading) {
      onClick?.();
      item.onClick?.();
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <Card
        size={size}
        state={item.loading ? 'loading' : item.disabled ? 'disabled' : 'default'}
        content={item.imageUrl ? 'filled' : 'text-only'}
        title={item.title}
        description={item.subtitle || item.description}
        imageUrl={item.imageUrl}
        onClick={handleClick}
        style={{
          cursor: (!item.disabled && !item.loading) ? 'pointer' : 'default',
        }}
      />
      
      {/* Premium badge overlay */}
      {item.premium && (
        <div style={{
          position: 'absolute',
          top: 'var(--space-s)',
          right: 'var(--space-s)',
          zIndex: 1,
        }}>
          <div style={{
            backgroundColor: 'var(--brand-accent)',
            color: 'var(--brand-primary)',
            fontSize: 'var(--text-caption)',
            fontWeight: 'var(--font-weight-medium)',
            padding: 'var(--space-xxs) var(--space-xs)',
            borderRadius: 'var(--radius-small)',
            boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
          }}>
            {item.badge || '프리미엄'}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Loading Grid Component - Internal composite
 */
function LoadingGrid({ layout, count = 6 }: { layout: GridLayout; count?: number }) {
  const loadingItems = Array.from({ length: count }, (_, index) => ({
    id: `loading-${index}`,
    title: '',
    loading: true,
  }));

  return (
    <CardGrid
      layout={layout}
      items={loadingItems}
      loading={true}
    />
  );
}

/**
 * Empty State Component - Internal composite
 */
function EmptyState({ 
  text = '항목이 없습니다',
  subtext = '새로운 항목을 추가해보세요'
}: { 
  text?: string;
  subtext?: string;
}) {
  const emptyStateStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--space-xl)',
    textAlign: 'center',
    minHeight: '200px',
  };

  return (
    <div style={emptyStateStyles}>
      <Text
        variant="title-small"
        semantic="tertiary"
        style={{ marginBottom: 'var(--space-s)' }}
      >
        {text}
      </Text>
      <Text
        variant="body-medium"
        semantic="tertiary"
      >
        {subtext}
      </Text>
    </div>
  );
}

/**
 * Main Card Grid Component
 */
export function CardGrid({
  layout = 'grid-2xN',
  content = 'custom',
  items,
  loading = false,
  emptyText,
  emptySubtext,
  onItemClick,
  className = '',
  style = {},
}: CardGridProps) {

  // Container styles using design tokens only
  const containerStyles: React.CSSProperties = {
    width: '100%',
    padding: 'var(--space-m)',
    ...style,
  };

  // Grid layout configurations
  const layoutConfigs = {
    'grid-2x3': {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridTemplateRows: 'repeat(3, auto)',
      gap: 'var(--space-m)',
      cardSize: 'medium' as const,
    },
    'grid-2xN': {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'var(--space-m)',
      cardSize: 'medium' as const,
    },
    'grid-1xN': {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-s)',
      cardSize: 'small' as const,
    },
    'horizontal-scroll': {
      display: 'flex',
      gap: 'var(--space-m)',
      overflowX: 'auto',
      paddingBottom: 'var(--space-s)',
      scrollSnapType: 'x mandatory',
      cardSize: 'medium' as const,
    },
  };

  const currentLayoutConfig = layoutConfigs[layout];

  // Grid styles
  const gridStyles: React.CSSProperties = {
    ...currentLayoutConfig,
    // Hide scrollbar for horizontal scroll
    ...(layout === 'horizontal-scroll' && {
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
      WebkitOverflowScrolling: 'touch',
    }),
  };

  // Card size based on layout
  const getCardSize = (): 'small' | 'medium' | 'large' => {
    return currentLayoutConfig.cardSize;
  };

  // Content-specific configurations
  const getContentConfig = () => {
    switch (content) {
      case 'spread-grid':
        return {
          emptyText: emptyText || '스프레드가 없습니다',
          emptySubtext: emptySubtext || '새로운 스프레드를 선택해보세요',
        };
      case 'daily-grid':
        return {
          emptyText: emptyText || '저장된 일기가 없습니다',
          emptySubtext: emptySubtext || '타로 리딩을 저장해보세요',
        };
      case 'theme-grid':
        return {
          emptyText: emptyText || '테마가 없습니다',
          emptySubtext: emptySubtext || '새로운 테마를 확인해보세요',
        };
      case 'generic-grid':
        return {
          emptyText: emptyText || '항목이 없습니다',
          emptySubtext: emptySubtext || '새로운 항목을 추가해보세요',
        };
      default:
        return {
          emptyText: emptyText || '항목이 없습니다',
          emptySubtext: emptySubtext || '새로운 항목을 추가해보세요',
        };
    }
  };

  const contentConfig = getContentConfig();

  // Handle item click
  const handleItemClick = (item: GridItemData) => {
    onItemClick?.(item);
  };

  // Show loading state
  if (loading) {
    return (
      <div className={className} style={containerStyles}>
        <LoadingGrid layout={layout} />
      </div>
    );
  }

  // Show empty state
  if (items.length === 0) {
    return (
      <div className={className} style={containerStyles}>
        <EmptyState 
          text={contentConfig.emptyText}
          subtext={contentConfig.emptySubtext}
        />
      </div>
    );
  }

  return (
    <div className={className} style={containerStyles}>
      <div style={gridStyles} className={layout === 'horizontal-scroll' ? 'scrollbar-none' : ''}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              ...(layout === 'horizontal-scroll' && {
                flexShrink: 0,
                scrollSnapAlign: 'start',
              }),
            }}
          >
            <GridItem
              item={item}
              size={getCardSize()}
              onClick={() => handleItemClick(item)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Convenience components for specific use cases
export function SpreadGrid(props: Omit<CardGridProps, 'content' | 'layout'>) {
  return <CardGrid content="spread-grid" layout="grid-2x3" {...props} />;
}

export function DailyGrid(props: Omit<CardGridProps, 'content' | 'layout'>) {
  return <CardGrid content="daily-grid" layout="grid-2xN" {...props} />;
}

export function ThemeGrid(props: Omit<CardGridProps, 'content' | 'layout'>) {
  return <CardGrid content="theme-grid" layout="grid-1xN" {...props} />;
}

export function HorizontalCardScroll(props: Omit<CardGridProps, 'layout'>) {
  return <CardGrid layout="horizontal-scroll" {...props} />;
}

// Special grid for spread selection
export function SpreadSelectionGrid({ 
  spreads,
  onSpreadSelect,
  ...props 
}: Omit<CardGridProps, 'items' | 'onItemClick'> & {
  spreads: Array<{
    id: string;
    name: string;
    nameKr: string;
    description: string;
    isPremium: boolean;
    imageUrl?: string;
  }>;
  onSpreadSelect: (spreadId: string) => void;
}) {
  const gridItems: GridItemData[] = spreads.map(spread => ({
    id: spread.id,
    title: spread.nameKr,
    subtitle: spread.description,
    imageUrl: spread.imageUrl,
    premium: spread.isPremium,
    onClick: () => onSpreadSelect(spread.id),
  }));

  return (
    <SpreadGrid
      items={gridItems}
      {...props}
    />
  );
}