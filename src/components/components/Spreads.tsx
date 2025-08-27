import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { X, Camera, RotateCcw } from './ui/icons';
import { ImageWithFallback } from './figma/ImageWithFallback';

const spreadTypes = [
  {
    id: 'celtic-cross',
    name: '켈틱 크로스',
    description: '10장 + 시간선 4장',
    cards: 14,
    positions: ['현재 상황', '도전과제', '과거', '미래', '가능한 결과', '최근 과거', '당신의 접근법', '외부 영향', '희망과 두려움', '최종 결과', '시간선1', '시간선2', '시간선3', '시간선4']
  },
  {
    id: 'relationship',
    name: '관계의 컵',
    description: '7장',
    cards: 7,
    positions: ['당신', '상대방', '관계의 과거', '관계의 현재', '관계의 미래', '조언', '결과']
  },
  {
    id: 'five-card',
    name: '5카드 스프레드',
    description: '5장',
    cards: 5,
    positions: ['과거', '현재', '미래', '조언', '결과']
  },
  {
    id: 'timeline',
    name: '4카드 타임라인',
    description: '4장',
    cards: 4,
    positions: ['과거', '현재', '가까운 미래', '먼 미래']
  },
  {
    id: 'three-card',
    name: '3카드 스프레드',
    description: '3장',
    cards: 3,
    positions: ['과거', '현재', '미래']
  },
  {
    id: 'one-card',
    name: '1카드 스프레드',
    description: '1장',
    cards: 1,
    positions: ['오늘의 메시지']
  }
];

interface DrawnCard {
  cardId: number;
  reversed: boolean;
}

export function Spreads() {
  const [activeSpread, setActiveSpread] = useState<typeof spreadTypes[0] | null>(null);
  const [drawnCards, setDrawnCards] = useState<Record<number, DrawnCard>>({});
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [saveToGallery, setSaveToGallery] = useState(true);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const startSpread = (spread: typeof spreadTypes[0]) => {
    setActiveSpread(spread);
    setDrawnCards({});
  };

  const drawCard = (positionIndex: number) => {
    const randomCard = Math.floor(Math.random() * 78);
    const isReversed = Math.random() < 0.5;
    setDrawnCards(prev => ({
      ...prev,
      [positionIndex]: { cardId: randomCard, reversed: isReversed }
    }));
  };

  const toggleCardOrientation = (positionIndex: number) => {
    setDrawnCards(prev => ({
      ...prev,
      [positionIndex]: {
        ...prev[positionIndex],
        reversed: !prev[positionIndex].reversed
      }
    }));
  };

  const resetSpread = () => {
    setDrawnCards({});
  };

  const isSpreadComplete = activeSpread && Object.keys(drawnCards).length === activeSpread.cards;

  const exitSpread = () => {
    setActiveSpread(null);
    setDrawnCards({});
    setShowExitDialog(false);
  };

  const handleCardDoubleClick = (positionIndex: number) => {
    if (drawnCards[positionIndex]) {
      toggleCardOrientation(positionIndex);
    }
  };

  if (activeSpread) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">{activeSpread.name}</h1>
            <p className="text-sm text-muted-foreground">
              {Object.keys(drawnCards).length}/{activeSpread.cards}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowExitDialog(true)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Progress value={(Object.keys(drawnCards).length / activeSpread.cards) * 100} />

        {/* Spread Layout */}
        <Card className="p-6 min-h-[400px]">
          <div className="grid grid-cols-3 gap-4 place-items-center">
            {activeSpread.positions.map((position, index) => (
              <div key={index} className="text-center space-y-2">
                <div
                  className={`w-16 h-24 rounded border-2 border-dashed border-muted-foreground/30 flex items-center justify-center cursor-pointer transition-colors ${
                    drawnCards[index] ? 'border-solid border-primary' : 'hover:border-muted-foreground/50'
                  }`}
                  onClick={() => !drawnCards[index] && drawCard(index)}
                  onDoubleClick={() => handleCardDoubleClick(index)}
                >
                  {drawnCards[index] ? (
                    <div className={`w-full h-full rounded ${drawnCards[index].reversed ? 'rotate-180' : ''}`}>
                      <ImageWithFallback
                        src={`/assets/tarot-cards/classic-tarot/${drawnCards[index].cardId.toString().padStart(2, '0')}.jpg`}
                        alt="타로 카드"
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground text-center">탭하여<br/>카드 뽑기</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground max-w-16">{position}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={() => setShowSaveModal(true)}
            disabled={!isSpreadComplete}
            className="flex-1"
          >
            <Camera className="h-4 w-4 mr-2" />
            캡처 저장
          </Button>
          <Button variant="outline" onClick={resetSpread}>
            <RotateCcw className="h-4 w-4 mr-2" />
            스프레드 초기화
          </Button>
        </div>

        {/* Exit Confirmation Dialog */}
        <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>스프레드를 종료하시겠습니까?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">현재 진행 중인 스프레드가 삭제됩니다.</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowExitDialog(false)}>취소</Button>
              <Button onClick={exitSpread}>종료</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Save Modal */}
        <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>스프레드 저장</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">제목 (선택사항)</label>
                <Input
                  placeholder="스프레드 제목을 입력하세요"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={saveToGallery}
                  onCheckedChange={(checked) => setSaveToGallery(!!checked)}
                />
                <label className="text-sm">갤러리에 저장</label>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setShowSaveModal(false);
                    exitSpread();
                  }}
                  className="flex-1"
                >
                  저장
                </Button>
                <Button variant="outline" onClick={() => setShowSaveModal(false)}>
                  취소
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">타로 스프레드 선택</h1>
      </div>

      {/* Recent Spreads Preview */}
      <Card className="p-4">
        <div className="space-y-3">
          <h3 className="text-sm font-medium">최근 완료된 스프레드</h3>
          <div className="flex gap-2 overflow-x-auto">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex-shrink-0 w-20 h-24 bg-muted rounded border text-center flex items-center justify-center">
                <span className="text-xs text-muted-foreground">미리보기</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Spread Selection Grid */}
      <div className="grid grid-cols-2 gap-4">
        {spreadTypes.map((spread) => (
          <Card
            key={spread.id}
            className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => startSpread(spread)}
          >
            <div className="text-center space-y-2">
              <div className="w-full h-24 bg-muted rounded flex items-center justify-center">
                <span className="text-xs text-muted-foreground text-center">스프레드<br/>미리보기</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-sm">{spread.name}</h3>
                <p className="text-xs text-muted-foreground">{spread.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}