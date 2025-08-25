/**
 * Tarot Spread System - Type Definitions
 */

export interface SpreadPosition {
  index: number;
  label: string;
  x: number;           // Relative position (0-1)
  y: number;           // Relative position (0-1)
  width: number;       // Relative size (0-1)
  height: number;      // Relative size (0-1)
  rotation: number;    // Degrees (0, 90, 180, 270)
  description?: string;
}

export interface AdditionalCards {
  timeline?: {
    enabled: boolean;
    count: number;
    description: string;
  };
}

export interface SpreadLayout {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string; // "5-10 minutes"
  positions: SpreadPosition[];
  timelinePositions?: SpreadPosition[];
  additionalCards?: AdditionalCards;
  instructions?: string[];
  interpretation?: {
    overview: string;
    tips: string[];
  };
}

export interface SpreadCard {
  positionIndex: number;
  cardKey: string;
  cardName: string;
  isReversed: boolean;
  drawnAt: string;
  interpretation?: string;
  keywords: string[];
}

export interface SpreadData {
  id: string;
  spreadId: string;
  spreadName: string;
  cards: SpreadCard[];
  timelineCards?: SpreadCard[];
  createdAt: string;
  completedAt?: string;
  isComplete: boolean;
  title?: string;
  notes?: string;
  capturedImageUri?: string;
}

export interface AbsolutePosition {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface CardDimensions {
  width: number;
  height: number;
}

export interface SpreadSelectionCard {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  thumbnailImage?: string;
  isPopular?: boolean;
  tags: string[];
}

// Animation and interaction types
export interface CardDrawingState {
  isDrawing: boolean;
  position: SpreadPosition | null;
  animationProgress: number;
}

export interface GestureState {
  isLongPressing: boolean;
  isDragging: boolean;
  selectedCardIndex: number | null;
}

// Capture and sharing
export interface CaptureOptions {
  format: 'png' | 'jpg';
  quality: number;
  width?: number;
  height?: number;
}

export interface SpreadSaveOptions {
  title?: string;
  saveToGallery: boolean;
  shareAfterSave: boolean;
  includeInterpretation: boolean;
}

export interface SpreadStats {
  totalSpreads: number;
  completedSpreads: number;
  favoriteSpreadId: string;
  totalCardsDrawn: number;
  averageCompletionTime: number;
}