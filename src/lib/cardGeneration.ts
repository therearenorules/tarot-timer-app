/**
 * Seeded Card Generation System
 * Ensures same cards for same date using deterministic random generation
 */

import seedrandom from 'seedrandom';
import { getDeckById, getDefaultDeck, type TarotCard } from '@/assets/decks';

// Types
export interface DailyCard {
  hour: number;
  cardKey: string;
  cardName: string;
  reversed: boolean;
  keywords: string[];
  timestamp: string;
}

export interface DailyCardSet {
  date: string;
  deckId: string;
  cards: DailyCard[];
  generatedAt: string;
}

/**
 * Create a consistent seed from date string
 */
export const createDateSeed = (date: string): string => {
  // Combine date with a fixed salt for consistency
  const salt = 'tarot-timer-2024';
  return `${date}-${salt}`;
};

/**
 * Generate seeded random numbers for card selection
 */
export const generateSeededCards = (seed: string, count: number = 24): number[] => {
  const rng = seedrandom(seed);
  const cards: number[] = [];
  
  for (let i = 0; i < count; i++) {
    // Generate random card index
    cards.push(Math.floor(rng() * 22)); // 22 major arcana cards
  }
  
  return cards;
};

/**
 * Generate seeded reversed states
 */
export const generateSeededReversals = (seed: string, count: number = 24): boolean[] => {
  const rng = seedrandom(`${seed}-reversed`);
  const reversals: boolean[] = [];
  
  for (let i = 0; i < count; i++) {
    // 30% chance of reversal
    reversals.push(rng() < 0.3);
  }
  
  return reversals;
};

/**
 * Convert card index to card key
 */
const getCardKeyByIndex = (index: number, deckId: string = 'classic'): string => {
  const deck = getDeckById(deckId) || getDefaultDeck();
  const card = deck.cards[index];
  return card?.key || 'fool';
};

/**
 * Get card by key from deck
 */
const getCardByKey = (key: string, deckId: string = 'classic'): TarotCard | undefined => {
  const deck = getDeckById(deckId) || getDefaultDeck();
  return deck.cards.find(card => card.key === key);
};

/**
 * Generate complete daily card set for 24 hours
 */
export const generateDailyCards = (date: string, deckId: string = 'classic'): DailyCardSet => {
  const seed = createDateSeed(date);
  const cardIndices = generateSeededCards(seed, 24);
  const reversals = generateSeededReversals(seed, 24);
  
  const cards: DailyCard[] = [];
  
  for (let hour = 0; hour < 24; hour++) {
    const cardIndex = cardIndices[hour];
    const cardKey = getCardKeyByIndex(cardIndex, deckId);
    const card = getCardByKey(cardKey, deckId);
    const reversed = reversals[hour];
    
    if (card) {
      cards.push({
        hour,
        cardKey: card.key,
        cardName: card.name,
        reversed,
        keywords: reversed ? card.reversed : card.upright,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  return {
    date,
    deckId,
    cards,
    generatedAt: new Date().toISOString()
  };
};

/**
 * Get card for specific hour
 */
export const getHourlyCard = (date: string, hour: number, deckId: string = 'classic'): DailyCard | null => {
  if (hour < 0 || hour > 23) {
    return null;
  }
  
  const dailyCards = generateDailyCards(date, deckId);
  return dailyCards.cards[hour] || null;
};

/**
 * Get current hour's card
 */
export const getCurrentHourCard = (date: string, deckId: string = 'classic'): DailyCard | null => {
  const currentHour = new Date().getHours();
  return getHourlyCard(date, currentHour, deckId);
};

/**
 * Validate daily card set
 */
export const validateDailyCards = (cardSet: DailyCardSet): boolean => {
  try {
    // Check basic structure
    if (!cardSet.date || !cardSet.deckId || !Array.isArray(cardSet.cards)) {
      return false;
    }
    
    // Check we have 24 cards
    if (cardSet.cards.length !== 24) {
      return false;
    }
    
    // Check each card has required fields
    for (let i = 0; i < 24; i++) {
      const card = cardSet.cards[i];
      if (!card || card.hour !== i || !card.cardKey || !card.cardName) {
        return false;
      }
    }
    
    return true;
  } catch {
    return false;
  }
};

/**
 * Generate card preview (first 3 hours for testing)
 */
export const generateCardPreview = (date: string, deckId: string = 'classic'): DailyCard[] => {
  const dailyCards = generateDailyCards(date, deckId);
  return dailyCards.cards.slice(0, 3);
};

/**
 * Test seeded generation consistency
 */
export const testSeedConsistency = (date: string, iterations: number = 5): boolean => {
  const firstGeneration = generateDailyCards(date);
  
  for (let i = 1; i < iterations; i++) {
    const testGeneration = generateDailyCards(date);
    
    // Compare each card
    for (let hour = 0; hour < 24; hour++) {
      const firstCard = firstGeneration.cards[hour];
      const testCard = testGeneration.cards[hour];
      
      if (firstCard.cardKey !== testCard.cardKey || 
          firstCard.reversed !== testCard.reversed) {
        return false;
      }
    }
  }
  
  return true;
};