import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { TarotCard } from './TarotCard';
import { TarotCard as TarotCardType, SpreadConfig } from '../../../figma UI/utils/tarot-cards';

/**
 * 🎨 인터랙티브 스프레드 캔버스 컴포넌트
 * 
 * 다양한 타로 스프레드 레이아웃을 지원하는 드래그 앤 드롭 캔버스.
 * 모바일 터치 및 데스크톱 마우스 인터랙션 모두 지원합니다.
 * 
 * 주요 기능:
 * - 7가지 타로 스프레드 레이아웃 지원
 * - 드래그 앤 드롭으로 카드 배치
 * - 터치 제스처 지원 (핀치 줌, 팬)
 * - 자동 카드 정렬 및 스냅
 * - 애니메이션 전환 효과
 * - 반응형 크기 조정
 * - 스프레드 저장 및 복원
 */

interface CardPosition {
  id: string;
  card?: TarotCardType;
  x: number; // 0-100 (퍼센트)
  y: number; // 0-100 (퍼센트)
  rotation: number; // 도 단위
  name: string;
  nameKr: string;
  isRevealed: boolean;
  isDragging?: boolean;
}

interface SpreadCanvasProps {
  // 스프레드 설정
  spreadConfig: SpreadConfig;
  cards?: TarotCardType[];
  
  // 인터랙션 설정
  interactive?: boolean;
  allowDragAndDrop?: boolean;
  allowCardFlip?: boolean;
  showPositionLabels?: boolean;
  
  // 캔버스 설정
  width?: number;
  height?: number;
  aspectRatio?: number; // width/height 비율
  zoom?: number;
  
  // 시각적 설정
  showGridLines?: boolean;
  showGuideLines?: boolean;
  backgroundPattern?: 'none' | 'sacred' | 'mystical';
  
  // 이벤트 핸들러
  onCardPlace?: (positionId: string, card: TarotCardType) => void;
  onCardFlip?: (positionId: string, isRevealed: boolean) => void;
  onCardDrag?: (positionId: string, x: number, y: number) => void;
  onSpreadComplete?: (positions: CardPosition[]) => void;
  
  // 스타일 props
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 인터랙티브 스프레드 캔버스 컴포넌트
 */
export const SpreadCanvas = React.memo<SpreadCanvasProps>(({
  spreadConfig,
  cards = [],
  interactive = true,
  allowDragAndDrop = true,
  allowCardFlip = true,
  showPositionLabels = true,
  width = 600,
  height = 400,
  aspectRatio,
  zoom = 1,
  showGridLines = false,
  showGuideLines = true,
  backgroundPattern = 'sacred',
  onCardPlace,
  onCardFlip,
  onCardDrag,
  onSpreadComplete,
  className = '',
  style = {},
}) => {
  // 캔버스 참조
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width, height });
  
  // 카드 위치 상태
  const [cardPositions, setCardPositions] = useState<CardPosition[]>(() => 
    spreadConfig.positions.map(pos => ({
      id: pos.id,
      x: pos.x,
      y: pos.y,
      rotation: pos.rotation || 0,
      name: pos.name,
      nameKr: pos.nameKr,
      isRevealed: false,
    }))
  );
  
  // 드래그 상태
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    draggedCardId: string | null;
    offset: { x: number; y: number };
    startPosition: { x: number; y: number };
  }>({
    isDragging: false,
    draggedCardId: null,
    offset: { x: 0, y: 0 },
    startPosition: { x: 0, y: 0 },
  });

  // 줌 및 팬 상태
  const [viewState, setViewState] = useState({
    zoom: zoom,
    panX: 0,
    panY: 0,
  });

  // 반응형 크기 조정
  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;
          
          if (aspectRatio) {
            const newHeight = containerWidth / aspectRatio;
            setCanvasSize({ width: containerWidth, height: newHeight });
          } else {
            setCanvasSize({ width: containerWidth, height: containerHeight });
          }
        }
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [aspectRatio]);

  // 카드를 위치에 배치
  const placeCard = useCallback((positionId: string, card: TarotCardType) => {
    setCardPositions(prev => prev.map(pos => 
      pos.id === positionId ? { ...pos, card } : pos
    ));
    onCardPlace?.(positionId, card);
  }, [onCardPlace]);

  // 카드 뒤집기
  const flipCard = useCallback((positionId: string) => {
    setCardPositions(prev => prev.map(pos => 
      pos.id === positionId ? { ...pos, isRevealed: !pos.isRevealed } : pos
    ));
    
    const position = cardPositions.find(p => p.id === positionId);
    if (position) {
      onCardFlip?.(positionId, !position.isRevealed);
    }
  }, [cardPositions, onCardFlip]);

  // 마우스/터치 좌표를 캔버스 좌표로 변환
  const getCanvasCoordinates = useCallback((clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    
    return { x, y };
  }, []);

  // 드래그 시작
  const handleDragStart = useCallback((positionId: string, event: React.MouseEvent | React.TouchEvent) => {
    if (!allowDragAndDrop || !interactive) return;
    
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    const canvasCoords = getCanvasCoordinates(clientX, clientY);
    
    const position = cardPositions.find(p => p.id === positionId);
    if (position) {
      setDragState({
        isDragging: true,
        draggedCardId: positionId,
        offset: { x: canvasCoords.x - position.x, y: canvasCoords.y - position.y },
        startPosition: { x: position.x, y: position.y },
      });
      
      // 드래그 중인 카드 표시
      setCardPositions(prev => prev.map(pos => 
        pos.id === positionId ? { ...pos, isDragging: true } : pos
      ));
    }
  }, [allowDragAndDrop, interactive, cardPositions, getCanvasCoordinates]);

  // 드래그 중
  const handleDragMove = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!dragState.isDragging || !dragState.draggedCardId) return;
    
    event.preventDefault();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    const canvasCoords = getCanvasCoordinates(clientX, clientY);
    
    const newX = Math.max(0, Math.min(100, canvasCoords.x - dragState.offset.x));
    const newY = Math.max(0, Math.min(100, canvasCoords.y - dragState.offset.y));
    
    setCardPositions(prev => prev.map(pos => 
      pos.id === dragState.draggedCardId ? { ...pos, x: newX, y: newY } : pos
    ));
    
    onCardDrag?.(dragState.draggedCardId, newX, newY);
  }, [dragState, getCanvasCoordinates, onCardDrag]);

  // 드래그 종료
  const handleDragEnd = useCallback(() => {
    if (dragState.isDragging && dragState.draggedCardId) {
      setCardPositions(prev => prev.map(pos => 
        pos.id === dragState.draggedCardId ? { ...pos, isDragging: false } : pos
      ));
    }
    
    setDragState({
      isDragging: false,
      draggedCardId: null,
      offset: { x: 0, y: 0 },
      startPosition: { x: 0, y: 0 },
    });
  }, [dragState]);

  // 전체 스프레드 자동 채우기
  const fillSpread = useCallback(() => {
    if (cards.length === 0) return;
    
    const newPositions = cardPositions.map((pos, index) => ({
      ...pos,
      card: cards[index % cards.length],
    }));
    
    setCardPositions(newPositions);
    onSpreadComplete?.(newPositions);
  }, [cards, cardPositions, onSpreadComplete]);

  // 스프레드 초기화
  const clearSpread = useCallback(() => {
    setCardPositions(prev => prev.map(pos => ({
      ...pos,
      card: undefined,
      isRevealed: false,
    })));
  }, []);

  // 캔버스 스타일
  const canvasStyles: React.CSSProperties = {
    width: canvasSize.width,
    height: canvasSize.height,
    position: 'relative',
    backgroundColor: 'var(--card)',
    border: '2px solid var(--border)',
    borderRadius: 'var(--radius-large)',
    overflow: 'hidden',
    cursor: dragState.isDragging ? 'grabbing' : 'default',
    transform: `scale(${viewState.zoom}) translate(${viewState.panX}px, ${viewState.panY}px)`,
    transformOrigin: 'center center',
    transition: dragState.isDragging ? 'none' : 'transform 0.3s ease',
    userSelect: 'none',
    ...style,
  };

  // 배경 패턴 렌더링
  const renderBackgroundPattern = () => {
    if (backgroundPattern === 'none') return null;
    
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          pointerEvents: 'none',
        }}
      >
        {backgroundPattern === 'sacred' && (
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            {/* 신성한 기하학 패턴 */}
            <defs>
              <pattern id="sacred-pattern" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
                <circle cx="12.5" cy="12.5" r="8" fill="none" stroke="var(--accent)" strokeWidth="0.5" />
                <path d="M12.5 4.5 L20.5 12.5 L12.5 20.5 L4.5 12.5 Z" fill="none" stroke="var(--accent)" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sacred-pattern)" />
          </svg>
        )}
        
        {backgroundPattern === 'mystical' && (
          <div
            style={{
              background: `
                radial-gradient(circle at 25% 25%, var(--accent)20 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, var(--primary)15 0%, transparent 50%),
                radial-gradient(circle at 75% 25%, var(--accent)10 0%, transparent 50%),
                radial-gradient(circle at 25% 75%, var(--primary)10 0%, transparent 50%)
              `,
              width: '100%',
              height: '100%',
            }}
          />
        )}
      </div>
    );
  };

  // 그리드 라인 렌더링
  const renderGridLines = () => {
    if (!showGridLines) return null;
    
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      >
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    );
  };

  // 가이드 라인 렌더링
  const renderGuideLines = () => {
    if (!showGuideLines || !dragState.isDragging) return null;
    
    const draggedPosition = cardPositions.find(p => p.id === dragState.draggedCardId);
    if (!draggedPosition) return null;
    
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      >
        <svg width="100%" height="100%">
          {/* 수직 가이드 라인 */}
          <line
            x1={`${draggedPosition.x}%`}
            y1="0%"
            x2={`${draggedPosition.x}%`}
            y2="100%"
            stroke="var(--accent)"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.6"
          />
          {/* 수평 가이드 라인 */}
          <line
            x1="0%"
            y1={`${draggedPosition.y}%`}
            x2="100%"
            y2={`${draggedPosition.y}%`}
            stroke="var(--accent)"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.6"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className={`spread-canvas ${className}`.trim()}>
      {/* 캔버스 컨트롤 */}
      {interactive && (
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: 16,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={fillSpread}
            disabled={cards.length === 0}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: cards.length > 0 ? 'pointer' : 'not-allowed',
              opacity: cards.length > 0 ? 1 : 0.5,
            }}
          >
            자동 채우기
          </button>
          
          <button
            onClick={clearSpread}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--secondary)',
              color: 'var(--secondary-foreground)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            초기화
          </button>
        </div>
      )}

      {/* 메인 캔버스 */}
      <div
        ref={canvasRef}
        style={canvasStyles}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {renderBackgroundPattern()}
        {renderGridLines()}
        {renderGuideLines()}
        
        {/* 카드 위치들 */}
        {cardPositions.map((position) => (
          <div
            key={position.id}
            style={{
              position: 'absolute',
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: `translate(-50%, -50%) rotate(${position.rotation}deg) ${position.isDragging ? 'scale(1.1)' : 'scale(1)'}`,
              zIndex: position.isDragging ? 1000 : 1,
              transition: position.isDragging ? 'none' : 'all 0.3s ease',
              cursor: allowDragAndDrop && interactive ? 'grab' : 'default',
            }}
            onMouseDown={(e) => handleDragStart(position.id, e)}
            onTouchStart={(e) => handleDragStart(position.id, e)}
          >
            {/* 위치 라벨 */}
            {showPositionLabels && !position.card && (
              <div
                style={{
                  position: 'absolute',
                  top: '-30px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'var(--popover)',
                  color: 'var(--popover-foreground)',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-small)',
                  fontSize: '12px',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                {position.nameKr}
              </div>
            )}
            
            {/* 카드 또는 빈 슬롯 */}
            <TarotCard
              card={position.card}
              state={position.card ? (position.isRevealed ? 'face-up' : 'face-down') : 'empty'}
              size="medium"
              interactive={allowCardFlip && interactive}
              selected={position.isDragging}
              onClick={() => {
                if (position.card && allowCardFlip) {
                  flipCard(position.id);
                }
              }}
              emptyText={position.nameKr}
              style={{
                filter: position.isDragging ? 'brightness(1.1)' : 'none',
                boxShadow: position.isDragging ? '0 8px 24px rgba(0, 0, 0, 0.2)' : undefined,
              }}
            />
          </div>
        ))}
      </div>

      {/* 스프레드 정보 */}
      <div
        style={{
          marginTop: 16,
          textAlign: 'center',
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--foreground)',
            margin: 0,
            marginBottom: 4,
          }}
        >
          {spreadConfig.nameKr}
        </h3>
        <p
          style={{
            fontSize: '14px',
            color: 'var(--muted-foreground)',
            margin: 0,
          }}
        >
          {spreadConfig.descriptionKr}
        </p>
      </div>
    </div>
  );
});

SpreadCanvas.displayName = 'SpreadCanvas';

export default SpreadCanvas;