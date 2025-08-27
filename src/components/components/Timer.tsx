import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { ChevronLeft, ChevronRight } from './ui/icons';
import { ImageWithFallback } from './figma/ImageWithFallback';

const tarotCards = [
  { id: 0, name: "바보", meaning: "새로운 시작, 순수함, 자발성" },
  { id: 1, name: "마법사", meaning: "현실화, 수완, 힘" },
  { id: 2, name: "여사제", meaning: "직감, 신성한 지식, 신성한 여성성" },
  { id: 3, name: "여제", meaning: "여성성, 아름다움, 자연, 풍요로움" },
  { id: 4, name: "황제", meaning: "권위, 구조, 통제, 아버지다움" },
  { id: 5, name: "교황", meaning: "영적 지혜, 종교적 믿음, 순응" },
  { id: 6, name: "연인", meaning: "사랑, 조화, 관계, 가치관 일치" },
  { id: 7, name: "전차", meaning: "통제, 의지력, 성공, 결단력" },
  { id: 8, name: "힘", meaning: "내적 힘, 용기, 연민, 집중" },
  { id: 9, name: "은둔자", meaning: "영혼 탐구, 내성, 내적 안내" },
  { id: 10, name: "운명의 수레바퀴", meaning: "행운, 카르마, 인생 주기, 운명" },
  { id: 11, name: "정의", meaning: "정의, 공정성, 진실, 인과응보" },
  { id: 12, name: "매달린 남자", meaning: "정지, 제약, 포기" },
  { id: 13, name: "죽음", meaning: "끝, 시작, 변화, 변형" },
  { id: 14, name: "절제", meaning: "균형, 절제, 인내, 목적" },
  { id: 15, name: "악마", meaning: "그림자 자아, 집착, 중독, 제약" },
  { id: 16, name: "탑", meaning: "급작스런 변화, 격변, 혼란, 계시" },
  { id: 17, name: "별", meaning: "희망, 믿음, 목적, 새로운 시작, 영성" },
  { id: 18, name: "달", meaning: "환상, 두려움, 불안, 잠재의식, 직감" },
  { id: 19, name: "태양", meaning: "긍정, 재미, 따뜻함, 성공, 활력" },
  { id: 20, name: "심판", meaning: "심판, 재탄생, 내적 부름, 사면" },
  { id: 21, name: "세계", meaning: "완성, 성취, 여행, 성취감" },
  { id: 22, name: "컵 에이스", meaning: "새로운 관계, 연민, 창의성" },
  { id: 23, name: "컵 2", meaning: "통합된 사랑, 파트너십, 상호 끌림" }
];

export function Timer() {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [currentCard, setCurrentCard] = useState(tarotCards[currentHour % tarotCards.length]);
  const [hasDrawnToday, setHasDrawnToday] = useState(true);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [hourMemos, setHourMemos] = useState<Record<number, string>>({});
  const [currentMemo, setCurrentMemo] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      setCurrentHour(hour);
      setCurrentCard(tarotCards[hour % tarotCards.length]);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const getDateString = () => {
    const now = new Date();
    const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    return `${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')} ${weekdays[now.getDay()]}`;
  };

  const getTimeString = (hour: number) => {
    if (hour === 0) return '자정';
    if (hour === 12) return '정오';
    if (hour < 12) return `오전 ${hour}시`;
    return `오후 ${hour - 12}시`;
  };

  const openHourDetail = (hour: number) => {
    setSelectedHour(hour);
    setCurrentMemo(hourMemos[hour] || '');
  };

  const saveMemo = () => {
    if (selectedHour !== null) {
      setHourMemos(prev => ({
        ...prev,
        [selectedHour]: currentMemo
      }));
    }
    setSelectedHour(null);
  };

  const navigateHour = (direction: 'prev' | 'next') => {
    if (selectedHour === null) return;
    
    if (direction === 'prev' && selectedHour > 0) {
      setSelectedHour(selectedHour - 1);
      setCurrentMemo(hourMemos[selectedHour - 1] || '');
    } else if (direction === 'next' && selectedHour < 23) {
      setSelectedHour(selectedHour + 1);
      setCurrentMemo(hourMemos[selectedHour + 1] || '');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">오늘의 24시간 타로</h1>
        <p className="text-muted-foreground">{getDateString()}</p>
      </div>

      {/* Draw Button or Current Card */}
      {!hasDrawnToday ? (
        <Card className="p-6">
          <div className="text-center space-y-4">
            <div className="w-32 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">카드 뒷면</span>
            </div>
            <Button 
              onClick={() => setHasDrawnToday(true)}
              className="w-full"
            >
              오늘의 24시간 타로 뽑기
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-lg font-medium">현재 {getTimeString(currentHour)} 카드</h2>
            <div className="w-32 h-48 mx-auto rounded-lg overflow-hidden border border-border shadow-sm">
              <ImageWithFallback
                src={`/assets/tarot-cards/classic-tarot/${currentCard.id.toString().padStart(2, '0')}.jpg`}
                alt={currentCard.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">{currentCard.name}</h3>
              <p className="text-sm text-muted-foreground">{currentCard.meaning}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Memo Section */}
      {hasDrawnToday && (
        <Card className="p-4">
          <div className="space-y-3">
            <Textarea
              placeholder="이 시간에 일어난 일을 기록해보세요..."
              value={hourMemos[currentHour] || ''}
              onChange={(e) => setHourMemos(prev => ({ ...prev, [currentHour]: e.target.value }))}
              className="min-h-[80px] resize-none"
            />
            <Button size="sm" variant="outline" className="w-full">
              저장
            </Button>
          </div>
        </Card>
      )}

      {/* 24-Hour Scroll */}
      {hasDrawnToday && (
        <Card className="p-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">24시간 타로</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {Array.from({ length: 24 }, (_, i) => (
                <div
                  key={i}
                  onClick={() => openHourDetail(i)}
                  className={`relative flex-shrink-0 w-12 h-16 rounded border cursor-pointer transition-colors ${
                    i === currentHour
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:bg-muted'
                  }`}
                >
                  <div className="w-full h-full bg-muted rounded-sm flex items-center justify-center">
                    <span className="text-xs font-medium">{i}</span>
                  </div>
                  {hourMemos[i] && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Hour Detail Modal */}
      <Dialog open={selectedHour !== null} onOpenChange={() => setSelectedHour(null)}>
        <DialogContent className="w-full max-w-sm">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateHour('prev')}
                disabled={selectedHour === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <DialogTitle>{selectedHour !== null ? getTimeString(selectedHour) : ''} 카드</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateHour('next')}
                disabled={selectedHour === 23}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          {selectedHour !== null && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-40 h-60 mx-auto rounded-lg overflow-hidden border border-border">
                  <ImageWithFallback
                    src={`/assets/tarot-cards/classic-tarot/${tarotCards[selectedHour % tarotCards.length].id.toString().padStart(2, '0')}.jpg`}
                    alt={tarotCards[selectedHour % tarotCards.length].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="mt-3 font-medium">{tarotCards[selectedHour % tarotCards.length].name}</h3>
              </div>
              
              <div className="space-y-3">
                <Textarea
                  placeholder="메모를 입력하세요..."
                  value={currentMemo}
                  onChange={(e) => setCurrentMemo(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button onClick={saveMemo} className="flex-1">
                    저장
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedHour(null)}>
                    닫기
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}