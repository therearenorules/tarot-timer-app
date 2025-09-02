/**
 * Classic Tarot Deck - Main Deck Definition
 */

import deckMeta from './meta.json';

// Re-export metadata
export { default as classicMeta } from './meta.json';

// Core interfaces
export interface TarotCard {
  key: string;
  name: string;
  number: string;
  suit: string;
  upright: string[];
  reversed: string[];
  image: string;
  description: string;
}

export interface TarotDeck {
  id: string;
  name: string;
  description: string;
  version: string;
  type: string;
  cardCount: number;
  cards: TarotCard[];
}

// Main deck export
export const classicDeck: TarotDeck = deckMeta as TarotDeck;

// Helper functions
export const getCardByKey = (key: string): TarotCard | undefined => {
  return classicDeck.cards.find(card => card.key === key);
};

export const getCardByIndex = (index: number): TarotCard | undefined => {
  if (index >= 0 && index < classicDeck.cards.length) {
    return classicDeck.cards[index];
  }
  return undefined;
};

export const getAllCards = (): TarotCard[] => {
  return [...classicDeck.cards];
};

export const getRandomCard = (): TarotCard => {
  const randomIndex = Math.floor(Math.random() * classicDeck.cards.length);
  return classicDeck.cards[randomIndex]!;
};

// Card display helpers
export const getCardKeywords = (card: TarotCard, reversed: boolean = false): string[] => {
  return reversed ? card.reversed : card.upright;
};

export const getCardImagePath = (card: TarotCard): string => {
  return `/assets/tarot-cards/classic-tarot/${card.image}`;
};

// Deck validation
export const validateDeck = (): boolean => {
  try {
    // Check basic structure
    if (!classicDeck.id || !classicDeck.name || !Array.isArray(classicDeck.cards)) {
      return false;
    }

    // Check card count matches
    if (classicDeck.cards.length !== classicDeck.cardCount) {
      return false;
    }

    // Validate each card
    for (const card of classicDeck.cards) {
      if (!card.key || !card.name || !Array.isArray(card.upright) || !Array.isArray(card.reversed)) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
};

export default classicDeck;