/**
 * Spread Layout Calculator - Handles position calculations and card dimensions
 */

import { SpreadPosition, AbsolutePosition, CardDimensions, SpreadCard } from '@/assets/spreads';

export interface LayoutCalculator {
  calculateAbsolutePosition: (
    position: SpreadPosition,
    boardWidth: number,
    boardHeight: number
  ) => AbsolutePosition;
  
  calculateCardDimensions: (
    position: SpreadPosition,
    boardWidth: number,
    boardHeight: number
  ) => CardDimensions;
  
  isPositionOccupied: (
    positions: SpreadCard[],
    index: number
  ) => boolean;
  
  calculateOverlap: (
    pos1: SpreadPosition,
    pos2: SpreadPosition
  ) => boolean;
}

/**
 * Calculate absolute position from relative coordinates
 */
export const calculateAbsolutePosition = (
  position: SpreadPosition,
  boardWidth: number,
  boardHeight: number
): AbsolutePosition => {
  // Calculate center point
  const centerX = position.x * boardWidth;
  const centerY = position.y * boardHeight;
  
  // Calculate dimensions
  const cardWidth = position.width * boardWidth;
  const cardHeight = position.height * boardHeight;
  
  // Calculate top-left position (accounting for rotation)
  const x = centerX - (cardWidth / 2);
  const y = centerY - (cardHeight / 2);
  
  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(cardWidth),
    height: Math.round(cardHeight),
    rotation: position.rotation
  };
};

/**
 * Calculate card dimensions based on position
 */
export const calculateCardDimensions = (
  position: SpreadPosition,
  boardWidth: number,
  boardHeight: number
): CardDimensions => {
  const width = position.width * boardWidth;
  const height = position.height * boardHeight;
  
  return {
    width: Math.round(width),
    height: Math.round(height)
  };
};

/**
 * Check if a position is already occupied
 */
export const isPositionOccupied = (
  positions: SpreadCard[],
  index: number
): boolean => {
  return positions.some(card => card.positionIndex === index);
};

/**
 * Calculate if two positions overlap
 */
export const calculateOverlap = (
  pos1: SpreadPosition,
  pos2: SpreadPosition
): boolean => {
  // Calculate boundaries for position 1
  const pos1Left = pos1.x - (pos1.width / 2);
  const pos1Right = pos1.x + (pos1.width / 2);
  const pos1Top = pos1.y - (pos1.height / 2);
  const pos1Bottom = pos1.y + (pos1.height / 2);
  
  // Calculate boundaries for position 2
  const pos2Left = pos2.x - (pos2.width / 2);
  const pos2Right = pos2.x + (pos2.width / 2);
  const pos2Top = pos2.y - (pos2.height / 2);
  const pos2Bottom = pos2.y + (pos2.height / 2);
  
  // Check for overlap
  return !(pos1Right < pos2Left || 
           pos2Right < pos1Left || 
           pos1Bottom < pos2Top || 
           pos2Bottom < pos1Top);
};

/**
 * Get optimal board dimensions based on spread layout
 */
export const getOptimalBoardDimensions = (
  positions: SpreadPosition[],
  screenWidth: number,
  screenHeight: number,
  padding: number = 20
): { width: number; height: number; scale: number } => {
  if (positions.length === 0) {
    return { width: screenWidth - padding * 2, height: screenHeight - padding * 2, scale: 1 };
  }
  
  // Calculate bounds of all positions
  let minX = 1, maxX = 0, minY = 1, maxY = 0;
  
  positions.forEach(pos => {
    const left = pos.x - (pos.width / 2);
    const right = pos.x + (pos.width / 2);
    const top = pos.y - (pos.height / 2);
    const bottom = pos.y + (pos.height / 2);
    
    minX = Math.min(minX, left);
    maxX = Math.max(maxX, right);
    minY = Math.min(minY, top);
    maxY = Math.max(maxY, bottom);
  });
  
  // Calculate required dimensions
  const requiredWidth = maxX - minX;
  const requiredHeight = maxY - minY;
  
  // Calculate available space
  const availableWidth = screenWidth - padding * 2;
  const availableHeight = screenHeight - padding * 2;
  
  // Calculate scale to fit
  const scaleX = availableWidth / (requiredWidth * screenWidth);
  const scaleY = availableHeight / (requiredHeight * screenHeight);
  const scale = Math.min(scaleX, scaleY, 1); // Don't scale up
  
  // Calculate final dimensions
  const finalWidth = Math.min(availableWidth, requiredWidth * screenWidth * scale);
  const finalHeight = Math.min(availableHeight, requiredHeight * screenHeight * scale);
  
  return {
    width: Math.round(finalWidth),
    height: Math.round(finalHeight),
    scale
  };
};

/**
 * Adjust positions for small screens
 */
export const adjustPositionsForScreen = (
  positions: SpreadPosition[],
  screenWidth: number,
  screenHeight: number
): SpreadPosition[] => {
  // Mobile optimization
  const isMobile = screenWidth < 768;
  
  if (!isMobile) return positions;
  
  return positions.map(pos => ({
    ...pos,
    width: Math.max(pos.width, 0.12), // Minimum card width on mobile
    height: Math.max(pos.height, 0.18), // Minimum card height on mobile
  }));
};

/**
 * Calculate touch target size for positions
 */
export const calculateTouchTarget = (
  position: AbsolutePosition,
  minimumSize: number = 44
): AbsolutePosition => {
  const targetWidth = Math.max(position.width, minimumSize);
  const targetHeight = Math.max(position.height, minimumSize);
  
  // Center the touch target on the original position
  const offsetX = (targetWidth - position.width) / 2;
  const offsetY = (targetHeight - position.height) / 2;
  
  return {
    x: position.x - offsetX,
    y: position.y - offsetY,
    width: targetWidth,
    height: targetHeight,
    rotation: position.rotation
  };
};

/**
 * Calculate animation path from deck to position
 */
export const calculateAnimationPath = (
  startX: number,
  startY: number,
  endPosition: AbsolutePosition,
  bezierControl: number = 0.5
): { x: number; y: number }[] => {
  const steps = 20; // Number of animation steps
  const path: { x: number; y: number }[] = [];
  
  // Calculate control points for bezier curve
  const controlX = (startX + endPosition.x) / 2;
  const controlY = Math.min(startY, endPosition.y) - 100; // Arc upward
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    
    // Quadratic bezier curve
    const x = (1 - t) * (1 - t) * startX + 
              2 * (1 - t) * t * controlX + 
              t * t * (endPosition.x + endPosition.width / 2);
              
    const y = (1 - t) * (1 - t) * startY + 
              2 * (1 - t) * t * controlY + 
              t * t * (endPosition.y + endPosition.height / 2);
    
    path.push({ x: Math.round(x), y: Math.round(y) });
  }
  
  return path;
};

/**
 * Get next empty position index
 */
export const getNextEmptyPosition = (
  drawnCards: SpreadCard[],
  totalPositions: number
): number | null => {
  for (let i = 0; i < totalPositions; i++) {
    if (!isPositionOccupied(drawnCards, i)) {
      return i;
    }
  }
  return null;
};

/**
 * Calculate card rotation transform
 */
export const getRotationTransform = (rotation: number): string => {
  return `rotate(${rotation}deg)`;
};

/**
 * Check if position is valid for board dimensions
 */
export const isPositionValid = (
  position: SpreadPosition,
  boardWidth: number,
  boardHeight: number
): boolean => {
  const absolute = calculateAbsolutePosition(position, boardWidth, boardHeight);
  
  return absolute.x >= 0 && 
         absolute.y >= 0 && 
         absolute.x + absolute.width <= boardWidth &&
         absolute.y + absolute.height <= boardHeight;
};

/**
 * Create layout calculator instance
 */
export const layoutCalculator: LayoutCalculator = {
  calculateAbsolutePosition,
  calculateCardDimensions,
  isPositionOccupied,
  calculateOverlap
};

export default {
  calculateAbsolutePosition,
  calculateCardDimensions,
  isPositionOccupied,
  calculateOverlap,
  getOptimalBoardDimensions,
  adjustPositionsForScreen,
  calculateTouchTarget,
  calculateAnimationPath,
  getNextEmptyPosition,
  getRotationTransform,
  isPositionValid,
  layoutCalculator
};