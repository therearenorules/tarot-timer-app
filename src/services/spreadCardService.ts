/**
 * Spread Card Drawing Service - Manages card selection and randomization for spreads
 */

import seedrandom from 'seedrandom';
import { TarotCard, getDeckById, getDefaultDeck } from '@/assets/decks';
import { SpreadCard, SpreadData, SpreadLayout } from '@/assets/spreads';

export interface SpreadCardService {
  drawRandomCard: (excludeCards: string[], deckId: string) => Promise<TarotCard>;
  determineReversed: (seed?: string) => boolean;
  shuffleDeck: (deckId: string, excludeCards: string[]) => TarotCard[];
  validateSpreadCompletion: (spread: SpreadData) => boolean;
  generateSpreadSeed: (spreadId: string, timestamp?: string) => string;
  drawCardForPosition: (positionIndex: number, excludeCards: string[], deckId: string, seed?: string) => Promise<SpreadCard>;
  getAvailableCards: (deckId: string, excludeCards: string[]) => TarotCard[];
  calculateReversalProbability: (positionIndex: number, spreadId: string) => number;
}

/**
 * Generate a unique seed for spread card drawing
 */
export const generateSpreadSeed = (spreadId: string, timestamp?: string): string => {
  const time = timestamp || new Date().toISOString();
  const salt = 'spread-drawing-2024';
  return `${spreadId}-${time}-${salt}`;
};

/**
 * Calculate reversal probability based on position and spread type
 */
export const calculateReversalProbability = (positionIndex: number, spreadId: string): number => {
  // Base probability
  let probability = 0.25; // 25% base chance
  
  // Adjust based on spread type
  switch (spreadId) {
    case 'celtic_cross':
      // Celtic cross has more varied reversal rates
      if (positionIndex === 1) probability = 0.4; // Challenge card more likely reversed
      else if (positionIndex === 8) probability = 0.35; // Inner self card
      break;
    case 'cup_of_relationship':
      // Relationship spreads have balanced reversals
      probability = 0.3;
      break;
    case 'one_card':
      // Single card readings have lower reversal rate
      probability = 0.2;
      break;
    default:
      probability = 0.25;
  }
  
  return probability;
};

/**
 * Determine if a card should be reversed using seeded randomization
 */
export const determineReversed = (seed?: string, positionIndex: number = 0, spreadId: string = 'three_card'): boolean => {
  const cardSeed = seed ? `${seed}-reversed-${positionIndex}` : Math.random().toString();
  const rng = seedrandom(cardSeed);
  const probability = calculateReversalProbability(positionIndex, spreadId);
  return rng() < probability;
};

/**
 * Get available cards from deck, excluding already drawn cards
 */
export const getAvailableCards = (deckId: string = 'classic', excludeCards: string[] = []): TarotCard[] => {
  const deck = getDeckById(deckId) || getDefaultDeck();
  return deck.cards.filter(card => !excludeCards.includes(card.key));
};

/**
 * Shuffle deck with seeded randomization
 */
export const shuffleDeck = (deckId: string = 'classic', excludeCards: string[] = [], seed?: string): TarotCard[] => {
  const availableCards = getAvailableCards(deckId, excludeCards);
  
  if (!seed) {
    // Use Math.random for non-seeded shuffling
    return [...availableCards].sort(() => Math.random() - 0.5);
  }
  
  // Use seeded randomization for consistent results
  const rng = seedrandom(seed);
  const shuffled = [...availableCards];
  
  // Fisher-Yates shuffle with seeded random
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

/**
 * Draw a random card from available cards
 */
export const drawRandomCard = async (excludeCards: string[] = [], deckId: string = 'classic', seed?: string): Promise<TarotCard> => {
  const availableCards = getAvailableCards(deckId, excludeCards);
  
  if (availableCards.length === 0) {
    throw new Error('No cards available to draw');
  }
  
  let selectedCard: TarotCard;
  
  if (seed) {
    // Use seeded selection
    const rng = seedrandom(seed);
    const index = Math.floor(rng() * availableCards.length);
    selectedCard = availableCards[index];
  } else {
    // Use random selection
    const index = Math.floor(Math.random() * availableCards.length);
    selectedCard = availableCards[index];
  }
  
  return selectedCard;
};

/**
 * Draw a card specifically for a spread position
 */
export const drawCardForPosition = async (
  positionIndex: number,
  excludeCards: string[] = [],
  deckId: string = 'classic',
  seed?: string,
  spreadId: string = 'three_card'
): Promise<SpreadCard> => {
  // Generate position-specific seed if provided
  const positionSeed = seed ? `${seed}-pos-${positionIndex}` : undefined;
  
  // Draw the card
  const card = await drawRandomCard(excludeCards, deckId, positionSeed);
  
  // Determine if reversed
  const isReversed = determineReversed(seed, positionIndex, spreadId);
  
  // Get keywords based on reversal
  const keywords = isReversed ? card.reversed : card.upright;
  
  return {
    positionIndex,
    cardKey: card.key,
    cardName: card.name,
    isReversed,
    drawnAt: new Date().toISOString(),
    keywords
  };
};

/**
 * Draw multiple cards for a complete spread
 */
export const drawCompleteSpread = async (
  layout: SpreadLayout,
  deckId: string = 'classic',
  seed?: string
): Promise<SpreadCard[]> => {
  const drawnCards: SpreadCard[] = [];
  const excludeCards: string[] = [];
  
  // Draw cards for each position
  for (let i = 0; i < layout.cardCount; i++) {
    const spreadCard = await drawCardForPosition(
      i,
      excludeCards,
      deckId,
      seed,
      layout.id
    );
    
    drawnCards.push(spreadCard);
    excludeCards.push(spreadCard.cardKey);
  }
  
  return drawnCards;
};

/**
 * Draw timeline cards for Celtic Cross
 */
export const drawTimelineCards = async (
  excludeCards: string[] = [],
  deckId: string = 'classic',
  seed?: string,
  count: number = 4
): Promise<SpreadCard[]> => {
  const timelineCards: SpreadCard[] = [];
  const currentExcluded = [...excludeCards];
  
  for (let i = 0; i < count; i++) {
    const positionIndex = 10 + i; // Timeline starts at position 10
    
    const spreadCard = await drawCardForPosition(
      positionIndex,
      currentExcluded,
      deckId,
      seed ? `${seed}-timeline` : undefined,
      'celtic_cross'
    );
    
    timelineCards.push(spreadCard);
    currentExcluded.push(spreadCard.cardKey);
  }
  
  return timelineCards;
};

/**
 * Validate spread completion
 */
export const validateSpreadCompletion = (spread: SpreadData): boolean => {
  try {
    // Check basic structure
    if (!spread.spreadId || !Array.isArray(spread.cards)) {
      return false;
    }
    
    // Get the spread layout
    const { getSpreadById } = require('@/assets/spreads');
    const layout = getSpreadById(spread.spreadId);
    if (!layout) return false;
    
    // Check card count
    if (spread.cards.length !== layout.cardCount) {
      return false;
    }
    
    // Check all positions are filled
    const positions = spread.cards.map(card => card.positionIndex).sort();
    const expectedPositions = Array.from({ length: layout.cardCount }, (_, i) => i);
    
    if (JSON.stringify(positions) !== JSON.stringify(expectedPositions)) {
      return false;
    }
    
    // Check for duplicate cards
    const cardKeys = spread.cards.map(card => card.cardKey);
    const uniqueKeys = new Set(cardKeys);
    if (uniqueKeys.size !== cardKeys.length) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

/**
 * Replace a card in an existing spread
 */
export const replaceCardAtPosition = async (
  positionIndex: number,
  currentCards: SpreadCard[],
  deckId: string = 'classic',
  seed?: string,
  spreadId: string = 'three_card'
): Promise<SpreadCard> => {
  // Get excluded cards (all current cards except the one being replaced)
  const excludeCards = currentCards
    .filter(card => card.positionIndex !== positionIndex)
    .map(card => card.cardKey);
  
  // Draw new card for the position
  return await drawCardForPosition(
    positionIndex,
    excludeCards,
    deckId,
    seed ? `${seed}-replace-${positionIndex}` : undefined,
    spreadId
  );
};

/**
 * Get spread statistics
 */
export const getSpreadStatistics = (spreads: SpreadData[]): {
  totalSpreads: number;
  completedSpreads: number;
  mostUsedSpreadId: string;
  averageCompletionTime: number;
  totalCardsDrawn: number;
} => {
  const completed = spreads.filter(spread => spread.isComplete);
  
  // Calculate most used spread
  const spreadCounts = spreads.reduce((acc, spread) => {
    acc[spread.spreadId] = (acc[spread.spreadId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostUsedSpreadId = Object.keys(spreadCounts).reduce((a, b) => 
    spreadCounts[a] > spreadCounts[b] ? a : b, 'three_card'
  );
  
  // Calculate average completion time
  const completionTimes = completed
    .filter(spread => spread.completedAt && spread.createdAt)
    .map(spread => {
      const created = new Date(spread.createdAt).getTime();
      const completed = new Date(spread.completedAt!).getTime();
      return completed - created;
    });
  
  const averageCompletionTime = completionTimes.length > 0
    ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
    : 0;
  
  return {
    totalSpreads: spreads.length,
    completedSpreads: completed.length,
    mostUsedSpreadId,
    averageCompletionTime,
    totalCardsDrawn: spreads.reduce((total, spread) => 
      total + spread.cards.length + (spread.timelineCards?.length || 0), 0
    )
  };
};

/**
 * Create spread card service instance
 */
export const spreadCardService: SpreadCardService = {
  drawRandomCard,
  determineReversed: (seed?: string) => determineReversed(seed),
  shuffleDeck,
  validateSpreadCompletion,
  generateSpreadSeed,
  drawCardForPosition: (positionIndex, excludeCards, deckId, seed) => 
    drawCardForPosition(positionIndex, excludeCards, deckId, seed),
  getAvailableCards,
  calculateReversalProbability
};

export default spreadCardService;