/**
 * Deck Registry - All Available Tarot Decks
 */

import { classicDeck, type TarotDeck } from './classic';

// Available decks registry
export const AVAILABLE_DECKS: Record<string, TarotDeck> = {
  classic: classicDeck,
};

// Default deck
export const DEFAULT_DECK_ID = 'classic';

// Helper functions
export const getDeckById = (deckId: string): TarotDeck | undefined => {
  return AVAILABLE_DECKS[deckId];
};

export const getDefaultDeck = (): TarotDeck => {
  return AVAILABLE_DECKS[DEFAULT_DECK_ID]!;
};

export const getAllDecks = (): TarotDeck[] => {
  return Object.values(AVAILABLE_DECKS);
};

export const getDeckIds = (): string[] => {
  return Object.keys(AVAILABLE_DECKS);
};

// Deck validation
export const isDeckAvailable = (deckId: string): boolean => {
  return deckId in AVAILABLE_DECKS;
};

// Re-export types
export type { TarotCard, TarotDeck } from './classic';