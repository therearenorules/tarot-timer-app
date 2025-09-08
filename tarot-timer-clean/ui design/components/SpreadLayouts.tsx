import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { type TarotCard } from '../utils/tarot-data';
import { useLanguage } from '../utils/language';
import { MysticalPulse, ScaleHover } from './AnimationComponents';

interface SpreadPosition {
  id: string;
  name: string;
  nameKr: string;
  card: TarotCard | null;
  isRevealed: boolean;
}

interface SpreadLayoutProps {
  positions: SpreadPosition[];
  onCardClick: (position: SpreadPosition, index: number) => void;
}

// React Native 호환 Celtic Cross Layout
export function CelticCrossLayout({ positions, onCardClick }: SpreadLayoutProps) {
  const { language } = useLanguage();

  return (
    <div className="w-full h-full flex items-center justify-center p-4" style={{ minHeight: '500px' }}>
      <div className="relative w-full max-w-lg" style={{ aspectRatio: '4/3' }}>
        
        {/* 배경 가이드라인 */}
        <div className="absolute inset-0 pointer-events-none">
          {/* 세로선 */}
          <div 
            className="absolute bg-premium-gold/20" 
            style={{
              left: '42%',
              top: '20%',
              width: '1px',
              height: '60%',
              transform: 'translateX(-50%)'
            }}
          />
          {/* 가로선 */}
          <div 
            className="absolute bg-premium-gold/20"
            style={{
              left: '15%',
              top: '45%',
              width: '54%',
              height: '1px',
              transform: 'translateY(-50%)'
            }}
          />
        </div>

        {/* 카드들 - Flexbox로 절대 위치 대신 상대적 배치 */}
        <div className="relative w-full h-full">
          {positions.map((position, index) => {
            const cardStyles = getCelticCardStyles(index);
            
            return (
              <div
                key={position.id}
                className="absolute flex items-center justify-center cursor-pointer transition-all duration-300"
                style={{
                  left: cardStyles.left,
                  top: cardStyles.top,
                  transform: cardStyles.transform,
                  width: '60px',
                  height: '90px',
                  zIndex: cardStyles.zIndex || 1
                }}
                onClick={() => onCardClick(position, index)}
              >
                <div 
                  className={`w-full h-full rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    position.card && position.isRevealed
                      ? 'border-premium-gold shadow-premium'
                      : position.card
                      ? 'border-premium-gold/60 shadow-card'
                      : 'border-premium-gold/50 border-dashed bg-white/15 shadow-empty'
                  }`}
                  style={{
                    boxShadow: position.card && position.isRevealed
                      ? '0 8px 32px rgba(212, 175, 55, 0.4)'
                      : position.card
                      ? '0 4px 20px rgba(0,0,0,0.3)'
                      : '0 2px 12px rgba(74, 26, 79, 0.08)'
                  }}
                >
                  {position.card && position.isRevealed ? (
                    <ImageWithFallback
                      src={position.card.imageUrl}
                      alt={language === 'ko' ? position.card.nameKr : position.card.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-deep-purple/20 to-midnight-blue/20 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-premium-gold/40 rounded-full animate-mystical-pulse" />
                    </div>
                  )}
                </div>
                
                {/* 카드 라벨 */}
                <div 
                  className="absolute text-xs font-medium text-premium-gold text-center whitespace-nowrap max-w-20"
                  style={{
                    top: '100%',
                    left: '50%',
                    transform: index === 1 ? 'translateX(-50%) translateY(4px) rotate(-90deg)' : 'translateX(-50%) translateY(4px)',
                    transformOrigin: index === 1 ? 'center top' : 'center',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                  }}
                >
                  {language === 'ko' ? position.nameKr : position.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Celtic Cross 카드 위치 정보
function getCelticCardStyles(index: number) {
  const positions = [
    { left: '42%', top: '45%', transform: 'translate(-50%, -50%)' },       // pos-1
    { left: '42%', top: '45%', transform: 'translate(-50%, -50%) rotate(90deg)', zIndex: 2 }, // pos-2
    { left: '42%', top: '65%', transform: 'translate(-50%, -50%)' },       // pos-3
    { left: '20%', top: '45%', transform: 'translate(-50%, -50%)' },       // pos-4
    { left: '42%', top: '25%', transform: 'translate(-50%, -50%)' },       // pos-5
    { left: '64%', top: '45%', transform: 'translate(-50%, -50%)' },       // pos-6
    { left: '82%', top: '75%', transform: 'translate(-50%, -50%)' },       // pos-7
    { left: '82%', top: '55%', transform: 'translate(-50%, -50%)' },       // pos-8
    { left: '82%', top: '35%', transform: 'translate(-50%, -50%)' },       // pos-9
    { left: '82%', top: '15%', transform: 'translate(-50%, -50%)' },       // pos-10
  ];
  
  return positions[index] || { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' };
}

// React Native 호환 Three Card Layout
export function ThreeCardLayout({ positions, onCardClick }: SpreadLayoutProps) {
  const { language } = useLanguage();

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="flex items-center justify-center gap-6 max-w-md w-full">
        {positions.map((position, index) => (
          <div key={position.id} className="flex flex-col items-center space-y-3">
            <div
              className="relative cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() => onCardClick(position, index)}
              style={{ width: '85px', height: '127px' }}
            >
              <div 
                className={`w-full h-full rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  position.card && position.isRevealed
                    ? 'border-premium-gold'
                    : position.card
                    ? 'border-premium-gold/60'
                    : 'border-premium-gold/50 border-dashed bg-white/15'
                }`}
                style={{
                  boxShadow: position.card && position.isRevealed
                    ? '0 12px 48px rgba(212, 175, 55, 0.4)'
                    : position.card
                    ? '0 8px 32px rgba(74, 26, 79, 0.2), 0 4px 16px rgba(0, 0, 0, 0.15)'
                    : '0 2px 8px rgba(74, 26, 79, 0.08)'
                }}
              >
                {position.card && position.isRevealed ? (
                  <ImageWithFallback
                    src={position.card.imageUrl}
                    alt={language === 'ko' ? position.card.nameKr : position.card.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-deep-purple/20 to-midnight-blue/20 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-premium-gold/40 rounded-full animate-mystical-pulse" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-xs font-medium text-premium-gold">
                {language === 'ko' ? position.nameKr : position.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// React Native 호환 Four Card Layout
export function FourCardLayout({ positions, onCardClick }: SpreadLayoutProps) {
  const { language } = useLanguage();

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="flex items-center justify-center gap-4 max-w-lg w-full">
        {positions.map((position, index) => (
          <div key={position.id} className="flex flex-col items-center space-y-3 flex-1">
            <div
              className="relative cursor-pointer transition-transform duration-300 hover:scale-105 w-full max-w-20"
              onClick={() => onCardClick(position, index)}
            >
              <div 
                className={`w-full rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  position.card && position.isRevealed
                    ? 'border-premium-gold'
                    : position.card
                    ? 'border-premium-gold/60'
                    : 'border-premium-gold/50 border-dashed bg-white/15'
                }`}
                style={{ 
                  aspectRatio: '2/3',
                  boxShadow: position.card && position.isRevealed
                    ? '0 12px 48px rgba(212, 175, 55, 0.4)'
                    : position.card
                    ? '0 8px 32px rgba(74, 26, 79, 0.2), 0 4px 16px rgba(0, 0, 0, 0.15)'
                    : '0 2px 8px rgba(74, 26, 79, 0.08)'
                }}
              >
                {position.card && position.isRevealed ? (
                  <ImageWithFallback
                    src={position.card.imageUrl}
                    alt={language === 'ko' ? position.card.nameKr : position.card.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-deep-purple/20 to-midnight-blue/20 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-premium-gold/40 rounded-full animate-mystical-pulse" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-xs font-medium text-premium-gold line-clamp-2">
                {language === 'ko' ? position.nameKr : position.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// React Native 호환 Five Card V Layout
export function FiveCardVLayout({ positions, onCardClick }: SpreadLayoutProps) {
  const { language } = useLanguage();

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-8 max-w-md w-full" style={{ minHeight: '350px' }}>
        {/* 첫 번째 행: 2장 */}
        <div className="flex items-center justify-between w-full max-w-xs">
          {[0, 1].map((index) => {
            const position = positions[index];
            if (!position) return null;
            
            return (
              <div key={position.id} className="flex flex-col items-center space-y-2">
                <div
                  className="relative cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => onCardClick(position, index)}
                  style={{ width: '70px', height: '105px' }}
                >
                  <div 
                    className={`w-full h-full rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      position.card && position.isRevealed
                        ? 'border-premium-gold'
                        : position.card
                        ? 'border-premium-gold/60'
                        : 'border-premium-gold/50 border-dashed bg-white/15'
                    }`}
                    style={{
                      boxShadow: position.card && position.isRevealed
                        ? '0 12px 48px rgba(212, 175, 55, 0.4)'
                        : position.card
                        ? '0 8px 32px rgba(74, 26, 79, 0.2), 0 4px 16px rgba(0, 0, 0, 0.15)'
                        : '0 2px 8px rgba(74, 26, 79, 0.08)'
                    }}
                  >
                    {position.card && position.isRevealed ? (
                      <ImageWithFallback
                        src={position.card.imageUrl}
                        alt={language === 'ko' ? position.card.nameKr : position.card.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-deep-purple/20 to-midnight-blue/20 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-premium-gold/40 rounded-full animate-mystical-pulse" />
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-xs font-medium text-premium-gold text-center">
                  {language === 'ko' ? position.nameKr : position.name}
                </p>
              </div>
            );
          })}
        </div>

        {/* 두 번째 행: 2장 */}
        <div className="flex items-center justify-center gap-12">
          {[2, 3].map((index) => {
            const position = positions[index];
            if (!position) return null;
            
            return (
              <div key={position.id} className="flex flex-col items-center space-y-2">
                <div
                  className="relative cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => onCardClick(position, index)}
                  style={{ width: '70px', height: '105px' }}
                >
                  <div 
                    className={`w-full h-full rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      position.card && position.isRevealed
                        ? 'border-premium-gold'
                        : position.card
                        ? 'border-premium-gold/60'
                        : 'border-premium-gold/50 border-dashed bg-white/15'
                    }`}
                    style={{
                      boxShadow: position.card && position.isRevealed
                        ? '0 12px 48px rgba(212, 175, 55, 0.4)'
                        : position.card
                        ? '0 8px 32px rgba(74, 26, 79, 0.2), 0 4px 16px rgba(0, 0, 0, 0.15)'
                        : '0 2px 8px rgba(74, 26, 79, 0.08)'
                    }}
                  >
                    {position.card && position.isRevealed ? (
                      <ImageWithFallback
                        src={position.card.imageUrl}
                        alt={language === 'ko' ? position.card.nameKr : position.card.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-deep-purple/20 to-midnight-blue/20 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-premium-gold/40 rounded-full animate-mystical-pulse" />
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-xs font-medium text-premium-gold text-center">
                  {language === 'ko' ? position.nameKr : position.name}
                </p>
              </div>
            );
          })}
        </div>

        {/* 세 번째 행: 1장 (중앙) */}
        {positions[4] && (
          <div className="flex flex-col items-center space-y-2">
            <div
              className="relative cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() => onCardClick(positions[4], 4)}
              style={{ width: '70px', height: '105px' }}
            >
              <div 
                className={`w-full h-full rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  positions[4].card && positions[4].isRevealed
                    ? 'border-premium-gold'
                    : positions[4].card
                    ? 'border-premium-gold/60'
                    : 'border-premium-gold/50 border-dashed bg-white/15'
                }`}
                style={{
                  boxShadow: positions[4].card && positions[4].isRevealed
                    ? '0 12px 48px rgba(212, 175, 55, 0.4)'
                    : positions[4].card
                    ? '0 8px 32px rgba(74, 26, 79, 0.2), 0 4px 16px rgba(0, 0, 0, 0.15)'
                    : '0 2px 8px rgba(74, 26, 79, 0.08)'
                }}
              >
                {positions[4].card && positions[4].isRevealed ? (
                  <ImageWithFallback
                    src={positions[4].card.imageUrl}
                    alt={language === 'ko' ? positions[4].card.nameKr : positions[4].card.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-deep-purple/20 to-midnight-blue/20 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-premium-gold/40 rounded-full animate-mystical-pulse" />
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-xs font-medium text-premium-gold text-center">
              {language === 'ko' ? positions[4].nameKr : positions[4].name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// React Native 호환 AB Choice Layout
export function ABChoiceLayout({ positions, onCardClick }: SpreadLayoutProps) {
  const { language } = useLanguage();

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl" style={{ minHeight: '400px' }}>
        
        {/* 배경 그룹 영역 표시 */}
        <div className="absolute inset-0 flex items-center justify-between px-8">
          {/* A 그룹 배경 */}
          <div 
            className="border-2 border-dashed border-premium-gold/20 bg-premium-gold/5 rounded-xl"
            style={{ width: '30%', height: '70%' }}
          />
          {/* B 그룹 배경 */}
          <div 
            className="border-2 border-dashed border-premium-gold/20 bg-premium-gold/5 rounded-xl"
            style={{ width: '30%', height: '70%' }}
          />
        </div>

        {/* 레이아웃 */}
        <div className="relative flex items-center justify-between h-full px-4">
          
          {/* A 그룹 (왼쪽) */}
          <div className="flex flex-col items-center space-y-6 flex-1">
            <div className="text-lg font-bold text-premium-gold mb-4">A</div>
            {[0, 1, 2].map((index) => {
              const position = positions[index];
              if (!position) return null;
              
              return (
                <div key={position.id} className="flex flex-col items-center space-y-2">
                  <div
                    className="relative cursor-pointer transition-transform duration-300 hover:scale-105"
                    onClick={() => onCardClick(position, index)}
                    style={{ width: '65px', height: '97px' }}
                  >
                    <div 
                      className={`w-full h-full rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        position.card && position.isRevealed
                          ? 'border-premium-gold'
                          : position.card
                          ? 'border-premium-gold/60'
                          : 'border-premium-gold/50 border-dashed bg-white/15'
                      }`}
                      style={{
                        boxShadow: position.card && position.isRevealed
                          ? '0 8px 32px rgba(212, 175, 55, 0.4)'
                          : '0 4px 16px rgba(74, 26, 79, 0.1)'
                      }}
                    >
                      {position.card && position.isRevealed ? (
                        <ImageWithFallback
                          src={position.card.imageUrl}
                          alt={language === 'ko' ? position.card.nameKr : position.card.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-deep-purple/20 to-midnight-blue/20 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-premium-gold/40 rounded-full animate-mystical-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs font-medium text-premium-gold text-center line-clamp-2">
                    {language === 'ko' ? position.nameKr : position.name}
                  </p>
                </div>
              );
            })}
          </div>

          {/* 중앙 조언 카드 */}
          {positions[3] && (
            <div className="flex flex-col items-center space-y-3 mx-6">
              <div className="text-sm font-bold text-premium-gold mb-2">
                {language === 'ko' ? '조언' : 'Advice'}
              </div>
              <div
                className="relative cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => onCardClick(positions[3], 3)}
                style={{ width: '70px', height: '105px' }}
              >
                <div 
                  className={`w-full h-full rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    positions[3].card && positions[3].isRevealed
                      ? 'border-premium-gold'
                      : positions[3].card
                      ? 'border-premium-gold/60'
                      : 'border-premium-gold/50 border-dashed bg-white/15'
                  }`}
                  style={{
                    boxShadow: positions[3].card && positions[3].isRevealed
                      ? '0 12px 48px rgba(212, 175, 55, 0.4)'
                      : '0 6px 24px rgba(74, 26, 79, 0.15)'
                  }}
                >
                  {positions[3].card && positions[3].isRevealed ? (
                    <ImageWithFallback
                      src={positions[3].card.imageUrl}
                      alt={language === 'ko' ? positions[3].card.nameKr : positions[3].card.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-deep-purple/20 to-midnight-blue/20 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-premium-gold/40 rounded-full animate-mystical-pulse" />
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-xs font-medium text-premium-gold text-center">
                {language === 'ko' ? positions[3].nameKr : positions[3].name}
              </p>
            </div>
          )}

          {/* B 그룹 (오른쪽) */}
          <div className="flex flex-col items-center space-y-6 flex-1">
            <div className="text-lg font-bold text-premium-gold mb-4">B</div>
            {[4, 5, 6].map((index) => {
              const position = positions[index];
              if (!position) return null;
              
              return (
                <div key={position.id} className="flex flex-col items-center space-y-2">
                  <div
                    className="relative cursor-pointer transition-transform duration-300 hover:scale-105"
                    onClick={() => onCardClick(position, index)}
                    style={{ width: '65px', height: '97px' }}
                  >
                    <div 
                      className={`w-full h-full rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        position.card && position.isRevealed
                          ? 'border-premium-gold'
                          : position.card
                          ? 'border-premium-gold/60'
                          : 'border-premium-gold/50 border-dashed bg-white/15'
                      }`}
                      style={{
                        boxShadow: position.card && position.isRevealed
                          ? '0 8px 32px rgba(212, 175, 55, 0.4)'
                          : '0 4px 16px rgba(74, 26, 79, 0.1)'
                      }}
                    >
                      {position.card && position.isRevealed ? (
                        <ImageWithFallback
                          src={position.card.imageUrl}
                          alt={language === 'ko' ? position.card.nameKr : position.card.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-deep-purple/20 to-midnight-blue/20 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-premium-gold/40 rounded-full animate-mystical-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs font-medium text-premium-gold text-center line-clamp-2">
                    {language === 'ko' ? position.nameKr : position.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// React Native 호환 Relationship Layout
export function RelationshipLayout({ positions, onCardClick }: SpreadLayoutProps) {
  const { language } = useLanguage();

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm" style={{ minHeight: '450px' }}>
        
        {/* 배경 가이드라인 */}
        <div className="absolute inset-0 pointer-events-none">
          {/* 상단 가로선 */}
          <div 
            className="absolute bg-premium-gold/20"
            style={{
              left: '20%',
              top: '5%',
              width: '60%',
              height: '1px'
            }}
          />
          {/* 중앙 세로선 */}
          <div 
            className="absolute bg-premium-gold/20"
            style={{
              left: '50%',
              top: '35%',
              width: '1px',
              height: '40%',
              transform: 'translateX(-50%)'
            }}
          />
        </div>

        {/* Flexbox 기반 카드 배치 */}
        <div className="relative w-full h-full flex flex-col justify-between">
          
          {/* 상단 행: 카드 9, 11, 10 */}
          <div className="flex justify-between items-start px-2">
            {[8, 10, 9].map((index) => { // positions 배열 인덱스는 0부터 시작
              const position = positions[index];
              if (!position) return <div key={index} style={{ width: '45px' }} />;
              
              return (
                <div key={position.id} className="flex flex-col items-center space-y-1">
                  <div
                    className="relative cursor-pointer transition-transform duration-300 hover:scale-105"
                    onClick={() => onCardClick(position, index)}
                    style={{ width: '45px', height: '67px' }}
                  >
                    <div 
                      className={`w-full h-full rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        position.card && position.isRevealed
                          ? 'border-premium-gold'
                          : position.card
                          ? 'border-premium-gold/60'
                          : 'border-premium-gold/50 border-dashed bg-white/15'
                      }`}
                      style={{
                        boxShadow: position.card && position.isRevealed
                          ? '0 8px 32px rgba(212, 175, 55, 0.4)'
                          : '0 4px 16px rgba(74, 26, 79, 0.1)'
                      }}
                    >
                      {position.card && position.isRevealed ? (
                        <ImageWithFallback
                          src={position.card.imageUrl}
                          alt={language === 'ko' ? position.card.nameKr : position.card.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-deep-purple/20 to-midnight-blue/20 flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-premium-gold/40 rounded-full animate-mystical-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs font-medium text-premium-gold text-center line-clamp-2 max-w-12">
                    {language === 'ko' ? position.nameKr : position.name}
                  </p>
                </div>
              );
            })}
          </div>

          {/* 중상단 행: 카드 7, 8 */}
          <div className="flex justify-center space-x-16 px-4">
            {[6, 7].map((index) => {
              const position = positions[index];
              if (!position) return null;
              
              return (
                <div key={position.id} className="flex flex-col items-center space-y-1">
                  <div
                    className="relative cursor-pointer transition-transform duration-300 hover:scale-105"
                    onClick={() => onCardClick(position, index)}
                    style={{ width: '50px', height: '75px' }}
                  >
                    <div 
                      className={`w-full h-full rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        position.card && position.isRevealed
                          ? 'border-premium-gold'
                          : position.card
                          ? 'border-premium-gold/60'
                          : 'border-premium-gold/50 border-dashed bg-white/15'
                      }`}
                      style={{
                        boxShadow: position.card && position.isRevealed
                          ? '0 8px 32px rgba(212, 175, 55, 0.4)'
                          : '0 4px 16px rgba(74, 26, 79, 0.1)'
                      }}
                    >
                      {position.card && position.isRevealed ? (
                        <ImageWithFallback
                          src={position.card.imageUrl}
                          alt={language === 'ko' ? position.card.nameKr : position.card.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-deep-purple/20 to-midnight-blue/20 flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-premium-gold/40 rounded-full animate-mystical-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs font-medium text-premium-gold text-center line-clamp-2 max-w-14">
                    {language === 'ko' ? position.nameKr : position.name}
                  </p>
                </div>
              );
            })}
          </div>

          {/* 중앙, 중하단, 하단 중앙 배치 */}
          <div className="flex flex-col items-center space-y-6">
            {/* 중앙: 카드 5 */}
            {positions[4] && (
              <div className="flex flex-col items-center space-y-1">
                <div
                  className="relative cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => onCardClick(positions[4], 4)}
                  style={{ width: '50px', height: '75px' }}
                >
                  <div 
                    className={`w-full h-full rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      positions[4].card && positions[4].isRevealed
                        ? 'border-premium-gold'
                        : positions[4].card
                        ? 'border-premium-gold/60'
                        : 'border-premium-gold/50 border-dashed bg-white/15'
                    }`}
                    style={{
                      boxShadow: positions[4].card && positions[4].isRevealed
                        ? '0 8px 32px rgba(212, 175, 55, 0.4)'
                        : '0 4px 16px rgba(74, 26, 79, 0.1)'
                    }}
                  >
                    {positions[4].card && positions[4].isRevealed ? (
                      <ImageWithFallback
                        src={positions[4].card.imageUrl}
                        alt={language === 'ko' ? positions[4].card.nameKr : positions[4].card.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-deep-purple/20 to-midnight-blue/20 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-premium-gold/40 rounded-full animate-mystical-pulse" />
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-xs font-medium text-premium-gold text-center line-clamp-2 max-w-14">
                  {language === 'ko' ? positions[4].nameKr : positions[4].name}
                </p>
              </div>
            )}

            {/* 중하단: 카드 6 (오른쪽으로 약간 이동) */}
            {positions[5] && (
              <div className="flex flex-col items-center space-y-1 ml-8">
                <div
                  className="relative cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => onCardClick(positions[5], 5)}
                  style={{ width: '50px', height: '75px' }}
                >
                  <div 
                    className={`w-full h-full rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      positions[5].card && positions[5].isRevealed
                        ? 'border-premium-gold'
                        : positions[5].card
                        ? 'border-premium-gold/60'
                        : 'border-premium-gold/50 border-dashed bg-white/15'
                    }`}
                    style={{
                      boxShadow: positions[5].card && positions[5].isRevealed
                        ? '0 8px 32px rgba(212, 175, 55, 0.4)'
                        : '0 4px 16px rgba(74, 26, 79, 0.1)'
                    }}
                  >
                    {positions[5].card && positions[5].isRevealed ? (
                      <ImageWithFallback
                        src={positions[5].card.imageUrl}
                        alt={language === 'ko' ? positions[5].card.nameKr : positions[5].card.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-deep-purple/20 to-midnight-blue/20 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-premium-gold/40 rounded-full animate-mystical-pulse" />
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-xs font-medium text-premium-gold text-center line-clamp-2 max-w-14">
                  {language === 'ko' ? positions[5].nameKr : positions[5].name}
                </p>
              </div>
            )}

            {/* 하단 중앙: 카드 4 */}
            {positions[3] && (
              <div className="flex flex-col items-center space-y-1">
                <div
                  className="relative cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => onCardClick(positions[3], 3)}
                  style={{ width: '50px', height: '75px' }}
                >
                  <div 
                    className={`w-full h-full rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      positions[3].card && positions[3].isRevealed
                        ? 'border-premium-gold'
                        : positions[3].card
                        ? 'border-premium-gold/60'
                        : 'border-premium-gold/50 border-dashed bg-white/15'
                    }`}
                    style={{
                      boxShadow: positions[3].card && positions[3].isRevealed
                        ? '0 8px 32px rgba(212, 175, 55, 0.4)'
                        : '0 4px 16px rgba(74, 26, 79, 0.1)'
                    }}
                  >
                    {positions[3].card && positions[3].isRevealed ? (
                      <ImageWithFallback
                        src={positions[3].card.imageUrl}
                        alt={language === 'ko' ? positions[3].card.nameKr : positions[3].card.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-deep-purple/20 to-midnight-blue/20 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-premium-gold/40 rounded-full animate-mystical-pulse" />
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-xs font-medium text-premium-gold text-center line-clamp-2 max-w-14">
                  {language === 'ko' ? positions[3].nameKr : positions[3].name}
                </p>
              </div>
            )}
          </div>

          {/* 최하단 행: 카드 1, 3, 2 */}
          <div className="flex justify-between items-end px-2">
            {[0, 2, 1].map((index) => {
              const position = positions[index];
              if (!position) return <div key={index} style={{ width: '45px' }} />;
              
              return (
                <div key={position.id} className="flex flex-col items-center space-y-1">
                  <div
                    className="relative cursor-pointer transition-transform duration-300 hover:scale-105"
                    onClick={() => onCardClick(position, index)}
                    style={{ width: '45px', height: '67px' }}
                  >
                    <div 
                      className={`w-full h-full rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        position.card && position.isRevealed
                          ? 'border-premium-gold'
                          : position.card
                          ? 'border-premium-gold/60'
                          : 'border-premium-gold/50 border-dashed bg-white/15'
                      }`}
                      style={{
                        boxShadow: position.card && position.isRevealed
                          ? '0 8px 32px rgba(212, 175, 55, 0.4)'
                          : '0 4px 16px rgba(74, 26, 79, 0.1)'
                      }}
                    >
                      {position.card && position.isRevealed ? (
                        <ImageWithFallback
                          src={position.card.imageUrl}
                          alt={language === 'ko' ? position.card.nameKr : position.card.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-deep-purple/20 to-midnight-blue/20 flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-premium-gold/40 rounded-full animate-mystical-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs font-medium text-premium-gold text-center line-clamp-2 max-w-12">
                    {language === 'ko' ? position.nameKr : position.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}