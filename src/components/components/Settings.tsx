import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Palette, 
  Bell, 
  Info, 
  ChevronRight, 
  X,
  Check
} from './ui/icons';
import { ImageWithFallback } from './figma/ImageWithFallback';

const themeDecks = [
  {
    id: 'classic',
    name: '클래식 타로',
    description: '전통적인 라이더 웨이트 타로',
    price: null,
    current: true,
    samples: [0, 1, 2, 3]
  },
  {
    id: 'mystical',
    name: '미스티컬 드림',
    description: '신비로운 꿈의 세계를 담은 덱',
    price: 2900,
    current: false,
    samples: [4, 5, 6, 7]
  },
  {
    id: 'cosmic',
    name: '코스믹 에너지',
    description: '우주의 에너지를 표현한 현대적 덱',
    price: 3900,
    current: false,
    samples: [8, 9, 10, 11]
  },
  {
    id: 'nature',
    name: '자연의 속삭임',
    description: '자연과 계절의 아름다움',
    price: 2900,
    current: false,
    samples: [12, 13, 14, 15]
  }
];

export function Settings() {
  const [notifications, setNotifications] = useState({
    hourly: true,
    midnight: true,
    quietHours: false
  });
  const [showDeckStore, setShowDeckStore] = useState(false);
  const [currentDeck, setCurrentDeck] = useState('classic');

  const currentTheme = themeDecks.find(deck => deck.id === currentDeck);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">설정</h1>
      </div>

      {/* Theme Deck Management */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium">현재 테마: {currentTheme?.name}</h3>
              <p className="text-sm text-muted-foreground">{currentTheme?.description}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {currentTheme?.samples.map((cardId, index) => (
              <div key={index} className="w-12 h-16 bg-muted rounded border overflow-hidden">
                <ImageWithFallback
                  src={`/assets/tarot-cards/classic-tarot/${cardId.toString().padStart(2, '0')}.jpg`}
                  alt="샘플 카드"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowDeckStore(true)}
          >
            <Palette className="h-4 w-4 mr-2" />
            테마 덱 상점
          </Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Bell className="h-4 w-4" />
            알림
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm">시간별 알림</p>
                <p className="text-xs text-muted-foreground">매시간 새로운 카드 알림</p>
              </div>
              <Switch 
                checked={notifications.hourly}
                onCheckedChange={(checked) => setNotifications({...notifications, hourly: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm">자정 리셋 알림</p>
                <p className="text-xs text-muted-foreground">새로운 하루 시작 알림</p>
              </div>
              <Switch 
                checked={notifications.midnight}
                onCheckedChange={(checked) => setNotifications({...notifications, midnight: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm">무음 시간</p>
                <p className="text-xs text-muted-foreground">22:00 - 08:00 알림 끄기</p>
              </div>
              <Switch 
                checked={notifications.quietHours}
                onCheckedChange={(checked) => setNotifications({...notifications, quietHours: checked})}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Purchase Management */}
      <Card className="p-4">
        <div className="space-y-3">
          <h3 className="font-medium">구매 관리</h3>
          
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-between">
              광고 제거
              <span className="text-sm text-muted-foreground">₩1,200</span>
            </Button>
            
            <Button variant="outline" className="w-full">
              구매 복원
            </Button>
          </div>
        </div>
      </Card>

      {/* App Info */}
      <Card className="p-4">
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Info className="h-4 w-4" />
            앱 정보
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">버전</span>
              <span className="text-sm text-muted-foreground">1.0.0</span>
            </div>
            
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="text-sm">개인정보 처리방침</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="text-sm">문의하기</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Theme Deck Store Modal */}
      <Dialog open={showDeckStore} onOpenChange={setShowDeckStore}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>테마 덱 상점</DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowDeckStore(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            {themeDecks.map((deck) => (
              <Card key={deck.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{deck.name}</h4>
                      <p className="text-sm text-muted-foreground">{deck.description}</p>
                    </div>
                    {deck.current && (
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <Check className="h-3 w-3" />
                        현재 사용중
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {deck.samples.map((cardId, index) => (
                      <div key={index} className="w-12 h-16 bg-muted rounded border overflow-hidden">
                        <ImageWithFallback
                          src={`/assets/tarot-cards/classic-tarot/${cardId.toString().padStart(2, '0')}.jpg`}
                          alt="샘플 카드"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    {deck.price === null ? (
                      <Button 
                        variant={deck.current ? "default" : "outline"} 
                        className="flex-1"
                        disabled={deck.current}
                      >
                        {deck.current ? '현재 사용중' : '무료'}
                      </Button>
                    ) : (
                      <Button variant="outline" className="flex-1">
                        구매하기 ₩{deck.price.toLocaleString()}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}