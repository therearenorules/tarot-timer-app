/**
 * Debug Spread System Issues
 */

// Mock React Native modules
global.__DEV__ = true;

// Mock seedrandom
const seedrandom = (seed) => {
  let state = 0;
  for (let i = 0; i < seed.length; i++) {
    state = (state + seed.charCodeAt(i)) * 9301 + 49297;
  }
  return () => {
    state = state * 9301 + 49297;
    return (state % 233280) / 233280;
  };
};

console.log('🔍 DEBUGGING SPREAD CARD SERVICE');

// Mock deck structure
const mockDeck = {
  cards: Array.from({ length: 22 }, (_, i) => ({
    key: `card_${i}`,
    name: `Card ${i}`,
    upright: [`upright_${i}`],
    reversed: [`reversed_${i}`]
  }))
};

// Test individual functions
console.log('Testing getAvailableCards...');
const getAvailableCards = (deckId, excludeCards = []) => {
  return mockDeck.cards.filter(card => !excludeCards.includes(card.key));
};

const allCards = getAvailableCards('classic', []);
const filteredCards = getAvailableCards('classic', ['card_0', 'card_1']);
console.log(`All cards: ${allCards.length}, Filtered: ${filteredCards.length}`);

console.log('Testing shuffleDeck...');
const shuffleDeck = (deckId, excludeCards = [], seed) => {
  const availableCards = getAvailableCards(deckId, excludeCards);
  
  if (!seed) {
    return [...availableCards].sort(() => Math.random() - 0.5);
  }
  
  const rng = seedrandom(seed);
  const shuffled = [...availableCards];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

const seed = 'test-seed-123';
const shuffle1 = shuffleDeck('classic', [], seed);
const shuffle2 = shuffleDeck('classic', [], seed);
console.log(`Shuffle 1 length: ${shuffle1.length}, Shuffle 2 length: ${shuffle2.length}`);
console.log(`Shuffle consistent: ${JSON.stringify(shuffle1) === JSON.stringify(shuffle2)}`);

console.log('Testing drawRandomCard...');
const drawRandomCard = (excludeCards = [], deckId = 'classic', seed) => {
  const availableCards = getAvailableCards(deckId, excludeCards);
  
  if (availableCards.length === 0) {
    throw new Error('No cards available to draw');
  }
  
  let selectedCard;
  
  if (seed) {
    const rng = seedrandom(seed);
    const index = Math.floor(rng() * availableCards.length);
    selectedCard = availableCards[index];
  } else {
    const index = Math.floor(Math.random() * availableCards.length);
    selectedCard = availableCards[index];
  }
  
  return selectedCard;
};

try {
  const drawnCard = drawRandomCard(['card_0'], 'classic', seed);
  console.log(`Drawn card: ${JSON.stringify(drawnCard)}`);
  console.log(`Is valid card: ${drawnCard && typeof drawnCard.key === 'string'}`);
} catch (error) {
  console.log(`Error drawing card: ${error.message}`);
}

console.log('Testing determineReversed...');
const determineReversed = (seed, positionIndex = 0) => {
  const cardSeed = seed ? `${seed}-reversed-${positionIndex}` : Math.random().toString();
  const rng = seedrandom(cardSeed);
  return rng() < 0.25;
};

const reversed1 = determineReversed(seed, 0);
const reversed2 = determineReversed(seed, 0);
console.log(`Reversed 1: ${reversed1}, Reversed 2: ${reversed2}, Consistent: ${reversed1 === reversed2}`);

// Check all conditions
const correctFiltering = allCards.length === 22 && filteredCards.length === 20;
const shuffleConsistent = JSON.stringify(shuffle1) === JSON.stringify(shuffle2);
const drawnCard = drawRandomCard(['card_0'], 'classic', seed);
const isValidCard = drawnCard && typeof drawnCard.key === 'string';
const reversalConsistent = reversed1 === reversed2;

console.log('\n✅ TEST CONDITIONS:');
console.log(`correctFiltering: ${correctFiltering}`);
console.log(`shuffleConsistent: ${shuffleConsistent}`);
console.log(`isValidCard: ${isValidCard}`);
console.log(`reversalConsistent: ${reversalConsistent}`);
console.log(`OVERALL: ${correctFiltering && shuffleConsistent && isValidCard && reversalConsistent}`);

console.log('\n🔍 DEBUGGING SPREAD STORE');

// Mock spread store test
const createSpreadStore = () => {
  let state = {
    isLoading: false,
    error: null,
    isInitialized: false,
    currentLayout: null,
    currentSpreadData: null,
    drawnCards: [],
    timelineCards: [],
    isDrawingMode: true,
    selectedCardIndex: null,
    isTimelineMode: false,
    timelineEnabled: false
  };

  return {
    getState: () => state,
    
    initializeSpreadSystem: async () => {
      state.isLoading = true;
      state.error = null;
      
      await new Promise(resolve => setTimeout(resolve, 1));
      
      state.isLoading = false;
      state.isInitialized = true;
    },

    startNewSpread: async (spreadId, options = {}) => {
      state.isLoading = true;
      state.error = null;
      
      const layout = {
        id: spreadId,
        name: `Test ${spreadId}`,
        cardCount: 3,
        positions: [
          { x: 0.3, y: 0.5, width: 0.1, height: 0.15 },
          { x: 0.5, y: 0.5, width: 0.1, height: 0.15 },
          { x: 0.7, y: 0.5, width: 0.1, height: 0.15 }
        ]
      };

      const spreadData = {
        id: `spread_${Date.now()}`,
        spreadId,
        cards: [],
        timelineCards: [],
        isComplete: false,
        createdAt: new Date().toISOString(),
        completedAt: null
      };

      state = {
        ...state,
        currentLayout: layout,
        currentSpreadData: spreadData,
        drawnCards: [],
        timelineCards: [],
        isDrawingMode: true,
        selectedCardIndex: null,
        isTimelineMode: false,
        timelineEnabled: options.timelineEnabled || false,
        isLoading: false
      };
    },

    drawCardAtPosition: async (positionIndex) => {
      if (!state.currentLayout) {
        throw new Error('No active spread');
      }

      const card = {
        positionIndex,
        cardKey: `mock_card_${positionIndex}`,
        cardName: `Mock Card ${positionIndex}`,
        isReversed: false,
        drawnAt: new Date().toISOString(),
        keywords: ['mock', 'test']
      };
      
      state.drawnCards = [...state.drawnCards, card];
    },

    selectCard: (positionIndex) => {
      state.selectedCardIndex = positionIndex;
    },

    clearCurrentSpread: () => {
      state = {
        ...state,
        currentLayout: null,
        currentSpreadData: null,
        drawnCards: [],
        timelineCards: [],
        isDrawingMode: true,
        selectedCardIndex: null,
        isTimelineMode: false,
        timelineEnabled: false
      };
    }
  };
};

async function testSpreadStore() {
  const store = createSpreadStore();
  
  console.log('Initial state:', store.getState());
  
  await store.initializeSpreadSystem();
  const initialState = store.getState();
  console.log('After initialization:', { isInitialized: initialState.isInitialized });
  
  await store.startNewSpread('three_card', { timelineEnabled: true });
  const afterSpreadStart = store.getState();
  console.log('After spread start:', { 
    hasLayout: afterSpreadStart.currentLayout !== null,
    cardCount: afterSpreadStart.currentLayout?.cardCount,
    timelineEnabled: afterSpreadStart.timelineEnabled
  });
  
  await store.drawCardAtPosition(0);
  await store.drawCardAtPosition(1);
  const afterDrawing = store.getState();
  console.log('After drawing:', { 
    drawnCardsLength: afterDrawing.drawnCards.length,
    firstCardPosition: afterDrawing.drawnCards[0]?.positionIndex
  });
  
  store.selectCard(0);
  const afterSelection = store.getState();
  console.log('After selection:', { selectedCardIndex: afterSelection.selectedCardIndex });
  
  store.clearCurrentSpread();
  const afterClear = store.getState();
  console.log('After clear:', { 
    hasLayout: afterClear.currentLayout !== null,
    drawnCardsLength: afterClear.drawnCards.length
  });

  const finalResult = initialState.isInitialized === true &&
         afterSpreadStart.currentLayout !== null &&
         afterSpreadStart.currentLayout.cardCount === 3 &&
         afterSpreadStart.timelineEnabled === true &&
         afterDrawing.drawnCards.length === 2 &&
         afterDrawing.drawnCards[0].positionIndex === 0 &&
         afterSelection.selectedCardIndex === 0 &&
         afterClear.currentLayout === null &&
         afterClear.drawnCards.length === 0;

  console.log('\n✅ SPREAD STORE TEST CONDITIONS:');
  console.log(`initialState.isInitialized: ${initialState.isInitialized}`);
  console.log(`afterSpreadStart.currentLayout !== null: ${afterSpreadStart.currentLayout !== null}`);
  console.log(`afterSpreadStart.currentLayout.cardCount === 3: ${afterSpreadStart.currentLayout?.cardCount === 3}`);
  console.log(`afterSpreadStart.timelineEnabled: ${afterSpreadStart.timelineEnabled}`);
  console.log(`afterDrawing.drawnCards.length === 2: ${afterDrawing.drawnCards.length === 2}`);
  console.log(`afterDrawing.drawnCards[0].positionIndex === 0: ${afterDrawing.drawnCards[0]?.positionIndex === 0}`);
  console.log(`afterSelection.selectedCardIndex === 0: ${afterSelection.selectedCardIndex === 0}`);
  console.log(`afterClear.currentLayout === null: ${afterClear.currentLayout === null}`);
  console.log(`afterClear.drawnCards.length === 0: ${afterClear.drawnCards.length === 0}`);
  console.log(`FINAL RESULT: ${finalResult}`);
}

testSpreadStore();