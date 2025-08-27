import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Calendar, Share2, Trash2, Download, ZoomIn } from './ui/icons';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DailyCard {
  hour: number;
  cardName: string;
  memo: string;
}

interface DailyTarotData {
  date: string;
  cards: DailyCard[];
  memoCount: number;
}

interface SavedSpread {
  id: number;
  title: string;
  date: string;
  type: string;
  thumbnail: string;
}

const dailyTarotData: DailyTarotData[] = [
  {
    date: '2025.01.15 수요일',
    cards: [
      { hour: 9, cardName: '마법사', memo: '새로운 프로젝트 시작' },
      { hour: 12, cardName: '여제', memo: '점심 시간의 평온함' },
      { hour: 15, cardName: '전차', memo: '회의에서 의견 관철' },
      { hour: 18, cardName: '별', memo: '퇴근 후 희망적인 기분' }
    ],
    memoCount: 4
  },
  {
    date: '2025.01.14 화요일',
    cards: [
      { hour: 8, cardName: '태양', memo: '상쾌한 아침' },
      { hour: 14, cardName: '힘', memo: '어려운 일 극복' },
      { hour: 20, cardName: '달', memo: '저녁 산책' }
    ],
    memoCount: 3
  },
  {
    date: '2025.01.13 월요일',
    cards: [
      { hour: 7, cardName: '바보', memo: '' },
      { hour: 13, cardName: '은둔자', memo: '혼자만의 시간' }
    ],
    memoCount: 1
  }
];

const savedSpreads: SavedSpread[] = [
  {
    id: 1,
    title: '새해 운세',
    date: '2025.01.01',
    type: '켈틱 크로스',
    thumbnail: '/placeholder-spread.jpg'
  },
  {
    id: 2,
    title: '연애운 점검',
    date: '2025.01.10',
    type: '관계의 컵',
    thumbnail: '/placeholder-spread.jpg'
  },
  {
    id: 3,
    title: '',
    date: '2025.01.12',
    type: '3카드 스프레드',
    thumbnail: '/placeholder-spread.jpg'
  },
  {
    id: 4,
    title: '진로 고민',
    date: '2025.01.14',
    type: '5카드 스프레드',
    thumbnail: '/placeholder-spread.jpg'
  }
];

export function Journal() {
  const [selectedDaily, setSelectedDaily] = useState<DailyTarotData | null>(null);
  const [selectedSpread, setSelectedSpread] = useState<SavedSpread | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteSpread = () => {
    setShowDeleteDialog(false);
    setSelectedSpread(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">일기</h1>
      </div>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="daily">데일리 타로</TabsTrigger>
          <TabsTrigger value="spreads">저장된 스프레드</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          {/* Daily Tarot Section */}
          {dailyTarotData.map((day, index) => (
            <Card
              key={index}
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setSelectedDaily(day)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{day.date}</h3>
                  <span className="text-sm text-muted-foreground">메모 {day.memoCount}개</span>
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {day.cards.slice(0, 4).map((card, cardIndex) => (
                    <div key={cardIndex} className="flex-shrink-0 text-center space-y-1">
                      <div className="w-12 h-16 bg-muted rounded border">
                        <ImageWithFallback
                          src={`/assets/tarot-cards/classic-tarot/${cardIndex.toString().padStart(2, '0')}.jpg`}
                          alt={card.cardName}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{card.hour}시</span>
                    </div>
                  ))}
                  {day.cards.length > 4 && (
                    <div className="flex-shrink-0 w-12 h-16 bg-muted rounded border flex items-center justify-center">
                      <span className="text-xs">+{day.cards.length - 4}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}

          <Button variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            전체 내보내기
          </Button>
        </TabsContent>

        <TabsContent value="spreads" className="space-y-4">
          {/* Saved Spreads Section */}
          <div className="grid grid-cols-2 gap-4">
            {savedSpreads.map((spread) => (
              <Card
                key={spread.id}
                className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedSpread(spread)}
              >
                <div className="space-y-2">
                  <div className="aspect-[3/4] bg-muted rounded border">
                    <ImageWithFallback
                      src={spread.thumbnail}
                      alt="스프레드 미리보기"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium truncate">
                      {spread.title || '제목 없음'}
                    </h4>
                    <p className="text-xs text-muted-foreground">{spread.date}</p>
                    <p className="text-xs text-muted-foreground">{spread.type}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Daily Tarot Detail Modal */}
      <Dialog open={selectedDaily !== null} onOpenChange={() => setSelectedDaily(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{selectedDaily?.date}</DialogTitle>
          </DialogHeader>
          
          {selectedDaily && (
            <div className="space-y-4">
              <div className="space-y-3">
                {selectedDaily.cards.map((card, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded">
                    <div className="w-10 h-14 bg-muted rounded">
                      <ImageWithFallback
                        src={`/assets/tarot-cards/classic-tarot/${index.toString().padStart(2, '0')}.jpg`}
                        alt={card.cardName}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{card.hour}시</span>
                        <span className="text-sm">{card.cardName}</span>
                      </div>
                      {card.memo && (
                        <p className="text-xs text-muted-foreground">{card.memo}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                전체 내보내기
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Spread Detail Modal */}
      <Dialog open={selectedSpread !== null} onOpenChange={() => setSelectedSpread(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="space-y-1">
              <DialogTitle>{selectedSpread?.title || '제목 없음'}</DialogTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{selectedSpread?.date}</span>
                <span>•</span>
                <span>{selectedSpread?.type}</span>
              </div>
            </div>
          </DialogHeader>
          
          {selectedSpread && (
            <div className="space-y-4">
              <div className="relative group">
                <div className="aspect-[3/4] bg-muted rounded border overflow-hidden">
                  <ImageWithFallback
                    src={selectedSpread.thumbnail}
                    alt="스프레드 이미지"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  공유
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  삭제
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>스프레드를 삭제하시겠습니까?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">이 작업은 되돌릴 수 없습니다.</p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>취소</Button>
            <Button onClick={handleDeleteSpread}>삭제</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}