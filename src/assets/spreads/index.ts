/**
 * Tarot Spreads Registry - All Available Spread Layouts
 */

import { SpreadLayout, SpreadSelectionCard } from './types';

// Import spread layouts
import oneCardLayout from './layouts/one-card.json';
import threeCardLayout from './layouts/three-card.json';
import fiveCardLayout from './layouts/five-card.json';
import fourCardTimelineLayout from './layouts/four-card-timeline.json';
import cupOfRelationshipLayout from './layouts/cup-of-relationship.json';
import celticCrossLayout from './layouts/celtic-cross.json';

// Available spreads registry
export const AVAILABLE_SPREADS: Record<string, SpreadLayout> = {
  one_card: oneCardLayout as SpreadLayout,
  three_card: threeCardLayout as SpreadLayout,
  five_card: fiveCardLayout as SpreadLayout,
  four_card_timeline: fourCardTimelineLayout as SpreadLayout,
  cup_of_relationship: cupOfRelationshipLayout as SpreadLayout,
  celtic_cross: celticCrossLayout as SpreadLayout,
};

// Default spread
export const DEFAULT_SPREAD_ID = 'three_card';

// Spread selection cards with additional metadata
export const SPREAD_SELECTION_CARDS: SpreadSelectionCard[] = [
  {
    id: 'one_card',
    name: 'Daily Guidance',
    description: 'Quick single card for daily insight',
    cardCount: 1,
    difficulty: 'beginner',
    estimatedTime: '2-5 minutes',
    isPopular: true,
    tags: ['daily', 'quick', 'guidance', 'simple']
  },
  {
    id: 'three_card',
    name: 'Past, Present, Future',
    description: 'Classic timeline reading',
    cardCount: 3,
    difficulty: 'beginner',
    estimatedTime: '5-10 minutes',
    isPopular: true,
    tags: ['timeline', 'classic', 'beginner', 'popular']
  },
  {
    id: 'five_card',
    name: 'Situation Analysis', 
    description: 'Comprehensive situation breakdown',
    cardCount: 5,
    difficulty: 'intermediate',
    estimatedTime: '10-15 minutes',
    isPopular: false,
    tags: ['analysis', 'comprehensive', 'situation', 'guidance']
  },
  {
    id: 'four_card_timeline',
    name: 'Timeline Reading',
    description: 'Extended timeline with multiple periods',
    cardCount: 4,
    difficulty: 'intermediate', 
    estimatedTime: '8-12 minutes',
    isPopular: false,
    tags: ['timeline', 'planning', 'future', 'progression']
  },
  {
    id: 'cup_of_relationship',
    name: 'Cup of Relationship',
    description: 'Deep insight into any relationship',
    cardCount: 7,
    difficulty: 'intermediate',
    estimatedTime: '15-20 minutes',
    isPopular: true,
    tags: ['relationship', 'love', 'connection', 'perspective']
  },
  {
    id: 'celtic_cross',
    name: 'Celtic Cross',
    description: 'The ultimate comprehensive reading',
    cardCount: 10,
    difficulty: 'advanced',
    estimatedTime: '25-40 minutes',
    isPopular: true,
    tags: ['comprehensive', 'advanced', 'classic', 'detailed']
  }
];

// Helper functions
export const getSpreadById = (spreadId: string): SpreadLayout | undefined => {
  return AVAILABLE_SPREADS[spreadId];
};

export const getDefaultSpread = (): SpreadLayout => {
  return AVAILABLE_SPREADS[DEFAULT_SPREAD_ID]!;
};

export const getAllSpreads = (): SpreadLayout[] => {
  return Object.values(AVAILABLE_SPREADS);
};

export const getSpreadIds = (): string[] => {
  return Object.keys(AVAILABLE_SPREADS);
};

export const getSpreadsByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): SpreadLayout[] => {
  return getAllSpreads().filter(spread => spread.difficulty === difficulty);
};

export const getPopularSpreads = (): SpreadSelectionCard[] => {
  return SPREAD_SELECTION_CARDS.filter(card => card.isPopular);
};

export const getSpreadsByTags = (tags: string[]): SpreadSelectionCard[] => {
  return SPREAD_SELECTION_CARDS.filter(card => 
    tags.some(tag => card.tags.includes(tag))
  );
};

export const searchSpreads = (query: string): SpreadSelectionCard[] => {
  const lowerQuery = query.toLowerCase();
  return SPREAD_SELECTION_CARDS.filter(card =>
    card.name.toLowerCase().includes(lowerQuery) ||
    card.description.toLowerCase().includes(lowerQuery) ||
    card.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// Validation
export const isSpreadAvailable = (spreadId: string): boolean => {
  return spreadId in AVAILABLE_SPREADS;
};

export const validateSpreadLayout = (spread: SpreadLayout): boolean => {
  try {
    // Basic structure validation
    if (!spread.id || !spread.name || !Array.isArray(spread.positions)) {
      return false;
    }

    // Position count validation
    if (spread.positions.length !== spread.cardCount) {
      return false;
    }

    // Position validation
    for (const position of spread.positions) {
      if (position.index < 0 || 
          position.x < 0 || position.x > 1 ||
          position.y < 0 || position.y > 1 ||
          position.width <= 0 || position.width > 1 ||
          position.height <= 0 || position.height > 1) {
        return false;
      }
    }

    // Timeline validation if present
    if (spread.timelinePositions) {
      for (const position of spread.timelinePositions) {
        if (position.x < 0 || position.x > 1 ||
            position.y < 0 || position.y > 1) {
          return false;
        }
      }
    }

    return true;
  } catch {
    return false;
  }
};

// Re-export types
export type { 
  SpreadLayout, 
  SpreadPosition, 
  SpreadCard, 
  SpreadData, 
  SpreadSelectionCard,
  AbsolutePosition,
  CardDimensions,
  SpreadStats,
  CaptureOptions,
  SpreadSaveOptions
} from './types';