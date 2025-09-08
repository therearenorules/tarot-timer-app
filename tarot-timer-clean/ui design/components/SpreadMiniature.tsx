import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from '../utils/language';

interface SpreadCard {
  id: string;
  nameKr: string;
  name: string;
  imageUrl: string;
  position: string;
  positionKr: string;
  isRevealed: boolean;
}

interface SpreadSave {
  id: string;
  spreadType: string;
  title: string;
  spreadName: string;
  spreadNameKr: string;
  date: string;
  cards: SpreadCard[];
  notes?: string;
  savedAt: string;
}

interface SpreadMiniatureProps {
  spread: SpreadSave;
}

export function SpreadMiniature({ spread }: SpreadMiniatureProps) {
  const { language } = useLanguage();
  
  const renderSpreadLayout = () => {
    if (spread.spreadType === 'celtic-cross') {
      return (
        <div className="relative w-full h-32 bg-gradient-to-br from-deep-purple/20 via-midnight-blue/20 to-deep-purple/20 rounded-lg overflow-hidden">
          <style jsx>{`
            .mini-celtic-grid {
              position: relative;
              width: 100%;
              height: 100%;
              display: grid;
              grid-template-columns: repeat(100, 1fr);
              grid-template-rows: repeat(100, 1fr);
            }
            
            .mini-celtic-card {
              position: absolute;
              width: 8px;
              height: 12px;
              border-radius: 2px;
              overflow: hidden;
              border: 1px solid rgba(212, 175, 55, 0.4);
              transform: translate(-50%, -50%);
            }
            
            .mini-pos-1 { left: 42%; top: 45%; }
            .mini-pos-2 { left: 42%; top: 45%; transform: translate(-50%, -50%) rotate(90deg); z-index: 2; }
            .mini-pos-3 { left: 42%; top: 65%; }
            .mini-pos-4 { left: 20%; top: 45%; }
            .mini-pos-5 { left: 42%; top: 25%; }
            .mini-pos-6 { left: 64%; top: 45%; }
            .mini-pos-7 { left: 82%; top: 75%; }
            .mini-pos-8 { left: 82%; top: 55%; }
            .mini-pos-9 { left: 82%; top: 35%; }
            .mini-pos-10 { left: 82%; top: 15%; }
            
            .mini-revealed {
              border-color: var(--premium-gold);
              box-shadow: 0 1px 3px rgba(212, 175, 55, 0.3);
            }
            
            .mini-celtic-grid::before,
            .mini-celtic-grid::after {
              content: '';
              position: absolute;
              background: rgba(212, 175, 55, 0.1);
              pointer-events: none;
              z-index: 0;
            }
            
            .mini-celtic-grid::before {
              left: 42%;
              top: 20%;
              width: 1px;
              height: 60%;
              transform: translateX(-50%);
            }
            
            .mini-celtic-grid::after {
              left: 15%;
              top: 45%;
              width: 54%;
              height: 1px;
              transform: translateY(-50%);
            }
          `}</style>
          
          <div className="mini-celtic-grid">
            {spread.cards.slice(0, 10).map((card, index) => (
              <div 
                key={card.id}
                className={`mini-celtic-card mini-pos-${index + 1} ${card.isRevealed ? 'mini-revealed' : ''}`}
              >
                {card.isRevealed && (
                  <ImageWithFallback
                    src={card.imageUrl}
                    alt={language === 'ko' ? card.nameKr : card.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    } else if (spread.spreadType === 'career') {
      return (
        <div className="relative w-full h-32 bg-gradient-to-br from-deep-purple/20 via-midnight-blue/20 to-deep-purple/20 rounded-lg overflow-hidden">
          <style jsx>{`
            .mini-ab-grid {
              position: relative;
              width: 100%;
              height: 100%;
              display: grid;
              grid-template-columns: repeat(100, 1fr);
              grid-template-rows: repeat(100, 1fr);
            }
            
            .mini-ab-card {
              position: absolute;
              width: 10px;
              height: 15px;
              border-radius: 2px;
              overflow: hidden;
              border: 1px solid rgba(212, 175, 55, 0.4);
              transform: translate(-50%, -50%);
            }
            
            .mini-ab-1 { left: 25%; top: 25%; }
            .mini-ab-2 { left: 25%; top: 50%; }
            .mini-ab-3 { left: 25%; top: 75%; }
            .mini-ab-4 { left: 50%; top: 50%; }
            .mini-ab-5 { left: 75%; top: 25%; }
            .mini-ab-6 { left: 75%; top: 50%; }
            .mini-ab-7 { left: 75%; top: 75%; }
            
            .mini-ab-label {
              position: absolute;
              font-size: 8px;
              color: var(--premium-gold);
              font-weight: bold;
              top: -8px;
              left: 50%;
              transform: translateX(-50%);
            }
            
            .mini-ab-grid::before,
            .mini-ab-grid::after {
              content: '';
              position: absolute;
              width: 20%;
              height: 70%;
              border: 1px dashed rgba(212, 175, 55, 0.1);
              border-radius: 4px;
              background: rgba(212, 175, 55, 0.02);
              pointer-events: none;
              top: 15%;
            }
            
            .mini-ab-grid::before {
              left: 15%;
            }
            
            .mini-ab-grid::after {
              right: 15%;
            }
          `}</style>
          
          <div className="mini-ab-grid">
            {spread.cards.slice(0, 7).map((card, index) => {
              const abGroups = ['A', 'A', 'A', '', 'B', 'B', 'B'];
              return (
                <div 
                  key={card.id}
                  className={`mini-ab-card mini-ab-${index + 1} ${card.isRevealed ? 'mini-revealed' : ''}`}
                >
                  {abGroups[index] && (
                    <div className="mini-ab-label">{abGroups[index]}</div>
                  )}
                  {card.isRevealed && (
                    <ImageWithFallback
                      src={card.imageUrl}
                      alt={language === 'ko' ? card.nameKr : card.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    } else if (spread.spreadType === 'love') {
      return (
        <div className="relative w-full h-32 bg-gradient-to-br from-deep-purple/20 via-midnight-blue/20 to-deep-purple/20 rounded-lg overflow-hidden">
          <style jsx>{`
            .mini-rel-grid {
              position: relative;
              width: 100%;
              height: 100%;
              display: grid;
              grid-template-columns: repeat(100, 1fr);
              grid-template-rows: repeat(100, 1fr);
            }
            
            .mini-rel-card {
              position: absolute;
              width: 7px;
              height: 10px;
              border-radius: 1px;
              overflow: hidden;
              border: 1px solid rgba(212, 175, 55, 0.4);
              transform: translate(-50%, -50%);
            }
            
            .mini-rel-1 { left: 30%; top: 80%; }
            .mini-rel-2 { left: 70%; top: 80%; }
            .mini-rel-3 { left: 50%; top: 80%; }
            .mini-rel-4 { left: 50%; top: 65%; }
            .mini-rel-5 { left: 50%; top: 50%; }
            .mini-rel-6 { left: 70%; top: 55%; }
            .mini-rel-7 { left: 35%; top: 40%; }
            .mini-rel-8 { left: 65%; top: 40%; }
            .mini-rel-9 { left: 25%; top: 25%; }
            .mini-rel-10 { left: 75%; top: 25%; }
            .mini-rel-11 { left: 50%; top: 25%; }
            
            .mini-rel-grid::before,
            .mini-rel-grid::after {
              content: '';
              position: absolute;
              pointer-events: none;
              z-index: 0;
            }
            
            .mini-rel-grid::before {
              left: 25%;
              top: 25%;
              width: 50%;
              height: 55%;
              border: 1px dashed rgba(212, 175, 55, 0.1);
              border-radius: 6px;
            }
            
            .mini-rel-grid::after {
              left: 50%;
              top: 25%;
              width: 1px;
              height: 55%;
              background: linear-gradient(to bottom, 
                rgba(212, 175, 55, 0.2) 0%,
                rgba(212, 175, 55, 0.1) 50%,
                rgba(212, 175, 55, 0.2) 100%);
              transform: translateX(-50%);
            }
          `}</style>
          
          <div className="mini-rel-grid">
            {spread.cards.slice(0, 11).map((card, index) => (
              <div 
                key={card.id}
                className={`mini-rel-card mini-rel-${index + 1} ${card.isRevealed ? 'mini-revealed' : ''}`}
              >
                {card.isRevealed && (
                  <ImageWithFallback
                    src={card.imageUrl}
                    alt={language === 'ko' ? card.nameKr : card.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    } else if (spread.spreadType === 'five-card') {
      // 5카드 CSS Grid V자 형태 - 미니어처 버전
      return (
        <div className="relative w-full h-32 bg-gradient-to-br from-deep-purple/20 via-midnight-blue/20 to-deep-purple/20 rounded-lg overflow-hidden">
          <style jsx>{`
            .mini-five-card-grid {
              position: relative;
              width: 100%;
              height: 100%;
              display: grid;
              grid-template-columns: repeat(100, 1fr);
              grid-template-rows: repeat(100, 1fr);
            }
            
            .mini-five-card {
              position: absolute;
              width: 5px;
              height: 8px;
              border-radius: 1px;
              overflow: hidden;
              border: 1px solid rgba(212, 175, 55, 0.4);
              transform: translate(-50%, -50%);
            }
            
            /* 5카드 V자 형태 위치 - 미니어처 */
            .mini-five-1 { left: 50%; top: 75%; }
            .mini-five-2 { left: 25%; top: 55%; }
            .mini-five-3 { left: 75%; top: 55%; }
            .mini-five-4 { left: 20%; top: 25%; }
            .mini-five-5 { left: 80%; top: 25%; }
            
            /* V자 가이드라인 - 미니어처 */
            .mini-five-card-grid::before,
            .mini-five-card-grid::after {
              content: '';
              position: absolute;
              width: 1px;
              height: 30%;
              background: linear-gradient(to bottom, 
                rgba(212, 175, 55, 0.2) 0%,
                rgba(212, 175, 55, 0.1) 100%);
              pointer-events: none;
              z-index: 0;
              top: 35%;
            }
            
            .mini-five-card-grid::before {
              left: 35%;
              transform: rotate(-25deg);
              transform-origin: bottom;
            }
            
            .mini-five-card-grid::after {
              right: 35%;
              transform: rotate(25deg);
              transform-origin: bottom;
            }
          `}</style>
          
          <div className="mini-five-card-grid">
            {spread.cards.slice(0, 5).map((card, index) => (
              <div 
                key={card.id}
                className={`mini-five-card mini-five-${index + 1} ${card.isRevealed ? 'mini-revealed' : ''}`}
              >
                {card.isRevealed && (
                  <ImageWithFallback
                    src={card.imageUrl}
                    alt={language === 'ko' ? card.nameKr : card.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    } else if (spread.spreadType === 'four-card') {
      // 4카드 CSS Grid 수평 일렬 - 미니어처 버전
      return (
        <div className="relative w-full h-32 bg-gradient-to-br from-deep-purple/20 via-midnight-blue/20 to-deep-purple/20 rounded-lg overflow-hidden">
          <style jsx>{`
            .mini-four-card-grid {
              position: relative;
              width: 100%;
              height: 100%;
              display: grid;
              grid-template-columns: repeat(100, 1fr);
              grid-template-rows: repeat(100, 1fr);
            }
            
            .mini-four-card {
              position: absolute;
              width: 6px;
              height: 9px;
              border-radius: 1px;
              overflow: hidden;
              border: 1px solid rgba(212, 175, 55, 0.4);
              transform: translate(-50%, -50%);
            }
            
            /* 4카드 수평 일렬 위치 - 미니어처 */
            .mini-four-1 { left: 18%; top: 50%; }
            .mini-four-2 { left: 39%; top: 50%; }
            .mini-four-3 { left: 61%; top: 50%; }
            .mini-four-4 { left: 82%; top: 50%; }
            
            /* 연결선 가이드 - 미니어처 */
            .mini-four-card-grid::before {
              content: '';
              position: absolute;
              left: 15%;
              top: 50%;
              width: 70%;
              height: 1px;
              background: linear-gradient(to right, 
                transparent 0%,
                rgba(212, 175, 55, 0.2) 20%,
                rgba(212, 175, 55, 0.3) 50%,
                rgba(212, 175, 55, 0.2) 80%,
                transparent 100%);
              pointer-events: none;
              z-index: 0;
              transform: translateY(-50%);
            }
          `}</style>
          
          <div className="mini-four-card-grid">
            {spread.cards.slice(0, 4).map((card, index) => (
              <div 
                key={card.id}
                className={`mini-four-card mini-four-${index + 1} ${card.isRevealed ? 'mini-revealed' : ''}`}
              >
                {card.isRevealed && (
                  <ImageWithFallback
                    src={card.imageUrl}
                    alt={language === 'ko' ? card.nameKr : card.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    } else if (spread.spreadType === 'three-card') {
      // 3카드 CSS Grid 가로 일렬 - 미니어처 버전
      return (
        <div className="relative w-full h-32 bg-gradient-to-br from-deep-purple/20 via-midnight-blue/20 to-deep-purple/20 rounded-lg overflow-hidden">
          <style jsx>{`
            .mini-three-card-grid {
              position: relative;
              width: 100%;
              height: 100%;
              display: grid;
              grid-template-columns: repeat(100, 1fr);
              grid-template-rows: repeat(100, 1fr);
            }
            
            .mini-three-card {
              position: absolute;
              width: 7px;
              height: 10px;
              border-radius: 1px;
              overflow: hidden;
              border: 1px solid rgba(212, 175, 55, 0.4);
              transform: translate(-50%, -50%);
            }
            
            /* 3카드 가로 일렬 위치 - 미니어처 */
            .mini-three-1 { left: 25%; top: 50%; }
            .mini-three-2 { left: 50%; top: 50%; }
            .mini-three-3 { left: 75%; top: 50%; }
            
            /* 연결선 가이드 - 미니어처 */
            .mini-three-card-grid::before {
              content: '';
              position: absolute;
              left: 20%;
              top: 50%;
              width: 60%;
              height: 1px;
              background: linear-gradient(to right, 
                transparent 0%,
                rgba(212, 175, 55, 0.3) 20%,
                rgba(212, 175, 55, 0.4) 50%,
                rgba(212, 175, 55, 0.3) 80%,
                transparent 100%);
              pointer-events: none;
              z-index: 0;
              transform: translateY(-50%);
            }
          `}</style>
          
          <div className="mini-three-card-grid">
            {spread.cards.slice(0, 3).map((card, index) => (
              <div 
                key={card.id}
                className={`mini-three-card mini-three-${index + 1} ${card.isRevealed ? 'mini-revealed' : ''}`}
              >
                {card.isRevealed && (
                  <ImageWithFallback
                    src={card.imageUrl}
                    alt={language === 'ko' ? card.nameKr : card.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      // 일반 스프레드 (기타)
      return (
        <div className="relative w-full h-32 bg-gradient-to-br from-deep-purple/20 via-midnight-blue/20 to-deep-purple/20 rounded-lg overflow-hidden p-4">
          <div className="flex justify-center items-center h-full gap-2">
            {spread.cards.slice(0, 5).map((card, index) => (
              <div 
                key={card.id}
                className={`w-6 h-9 rounded border overflow-hidden ${
                  card.isRevealed 
                    ? 'border-premium-gold shadow-sm' 
                    : 'border-premium-gold/40'
                }`}
              >
                {card.isRevealed && (
                  <ImageWithFallback
                    src={card.imageUrl}
                    alt={language === 'ko' ? card.nameKr : card.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
  };
  
  return renderSpreadLayout();
}