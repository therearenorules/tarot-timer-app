import React, { useState, useCallback } from 'react';
import { Button } from '../base/Button';
import { Text } from '../base/Text';
import { Badge } from '../base/Badge';
import { Icon } from '../base/Icon';
import { Modal } from '../composite/Modal';

/**
 * 📖 Journal Screen Module - Mobile App Style
 * 
 * Clean mobile-first journal screen with professional design.
 * Features daily tarot entries and saved spreads in a simple, elegant layout.
 */

interface DailyEntry {
  id: string;
  date: string;
  dateKr: string;
  dayName: string;
  totalCards: number;
  memoCount: number;
  completionRate: number;
  highlights: string[];
}

interface SavedSpread {
  id: string;
  title: string;
  spreadNameKr: string;
  dateKr: string;
  cardCount: number;
  isPremium: boolean;
  tags: string[];
}

interface JournalScreenProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Mobile Header Component
 */
function JournalHeader() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-midnight-blue to-deep-purple">
      {/* Mystical Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-premium-gold/5 to-transparent animate-pulse"></div>
      <div className="absolute top-4 left-1/4 w-1 h-1 bg-premium-gold rounded-full animate-ping delay-1000"></div>
      <div className="absolute top-8 right-1/3 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-2000"></div>
      
      <div className="relative z-10 p-6 text-center">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-premium-gold to-yellow-500 rounded-full mb-3 shadow-lg">
            <Icon name="book-open" size={20} className="text-midnight-blue" />
          </div>
        </div>
        
        <Text className="text-xs font-medium text-white/80 mb-2 uppercase tracking-wider">
          신성한 기록의 전당
        </Text>
        <Text className="text-xl font-bold text-white mb-2">
          나만의 타로 일기
        </Text>
        <Text className="text-sm text-white/70 leading-relaxed max-w-xs mx-auto">
          타로의 지혜가 기록된 신비로운 여정
        </Text>
        
        <div className="flex justify-center mt-3">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-premium-gold to-transparent rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Tab Navigation Component
 */
function TabNavigation({ 
  activeTab, 
  onTabChange 
}: { 
  activeTab: 'daily' | 'spreads';
  onTabChange: (tab: 'daily' | 'spreads') => void;
}) {
  return (
    <div className="relative bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="flex">
        <button
          onClick={() => onTabChange('daily')}
          className={`
            flex-1 py-4 px-4 text-center transition-all duration-300 relative group touch-target
            ${activeTab === 'daily' 
              ? 'text-premium-gold' 
              : 'text-white/60 hover:text-white/80'
            }
          `}
        >
          {activeTab === 'daily' && (
            <div className="absolute inset-0 bg-premium-gold/10 rounded-t-lg"></div>
          )}
          
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`p-2 rounded-lg transition-all duration-300 ${
              activeTab === 'daily' 
                ? 'bg-premium-gold/20' 
                : 'group-hover:bg-white/10'
            }`}>
              <Icon name="calendar" size={18} />
            </div>
            <Text className="font-semibold text-sm">데일리 타로</Text>
          </div>
          
          {activeTab === 'daily' && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-premium-gold rounded-full"></div>
          )}
        </button>
        
        <button
          onClick={() => onTabChange('spreads')}
          className={`
            flex-1 py-4 px-4 text-center transition-all duration-300 relative group touch-target
            ${activeTab === 'spreads' 
              ? 'text-premium-gold' 
              : 'text-white/60 hover:text-white/80'
            }
          `}
        >
          {activeTab === 'spreads' && (
            <div className="absolute inset-0 bg-premium-gold/10 rounded-t-lg"></div>
          )}
          
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`p-2 rounded-lg transition-all duration-300 ${
              activeTab === 'spreads' 
                ? 'bg-premium-gold/20' 
                : 'group-hover:bg-white/10'
            }`}>
              <Icon name="bookmark" size={18} />
            </div>
            <Text className="font-semibold text-sm">저장된 스프레드</Text>
          </div>
          
          {activeTab === 'spreads' && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-premium-gold rounded-full"></div>
          )}
        </button>
      </div>
    </div>
  );
}

/**
 * Daily Entry Card Component
 */
function DailyEntryCard({ 
  entry, 
  onClick 
}: { 
  entry: DailyEntry;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="mobile-card cursor-pointer group relative touch-target"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-premium-gold/20 to-premium-gold/10 rounded-xl blur opacity-0 group-active:opacity-100 transition duration-200"></div>
      
      <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all duration-200 group-active:scale-95">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="space-y-1">
            <Text className="font-bold text-white">
              {entry.dateKr}
            </Text>
            <Text className="text-sm text-premium-gold font-medium">
              {entry.dayName}
            </Text>
          </div>
          
          {/* Completion Circle */}
          <div className="relative w-10 h-10">
            <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center">
              <Text className="text-xs font-bold text-premium-gold">
                {entry.completionRate}%
              </Text>
            </div>
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(212, 175, 55, 0.3)"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="2"
                strokeDasharray={`${entry.completionRate}, 100`}
                className="transition-all duration-500"
              />
            </svg>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Icon name="layers" size={14} className="text-premium-gold" />
            <Text className="text-sm text-white/70">
              카드 {entry.totalCards}장
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="edit" size={14} className="text-premium-gold" />
            <Text className="text-sm text-white/70">
              메모 {entry.memoCount}개
            </Text>
          </div>
        </div>
        
        {/* Highlights */}
        <div className="space-y-2">
          <Text className="text-xs font-medium text-premium-gold">
            주요 인사이트
          </Text>
          <div className="flex flex-wrap gap-2">
            {entry.highlights.slice(0, 2).map((highlight, index) => (
              <Badge 
                key={index}
                className="text-xs bg-premium-gold/20 text-premium-gold border border-premium-gold/30"
              >
                {highlight}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Saved Spread Card Component
 */
function SavedSpreadCard({ 
  spread, 
  onClick 
}: { 
  spread: SavedSpread;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="mobile-card cursor-pointer group relative touch-target"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-premium-gold/20 to-premium-gold/10 rounded-xl blur opacity-0 group-active:opacity-100 transition duration-200"></div>
      
      <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all duration-200 group-active:scale-95">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Text className="font-bold text-white">
                {spread.title}
              </Text>
              {spread.isPremium && (
                <Badge className="text-xs font-bold bg-gradient-to-r from-premium-gold to-yellow-500 text-midnight-blue border-0">
                  프리미엄
                </Badge>
              )}
            </div>
            
            <Text className="text-sm text-premium-gold font-medium">
              {spread.spreadNameKr}
            </Text>
            
            <Text className="text-xs text-white/60">
              {spread.dateKr}
            </Text>
          </div>
          
          {/* Card Count */}
          <div className="ml-4 text-right">
            <div className="w-12 h-16 bg-premium-gold/20 rounded-lg border border-premium-gold/30 flex items-center justify-center">
              <Text className="text-xs font-bold text-premium-gold">
                {spread.cardCount}
              </Text>
            </div>
          </div>
        </div>
        
        {/* Tags */}
        <div className="space-y-2">
          <Text className="text-xs font-medium text-premium-gold">
            태그
          </Text>
          <div className="flex flex-wrap gap-2">
            {spread.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index}
                className="text-xs bg-premium-gold/10 text-premium-gold border border-premium-gold/20"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Action Indicator */}
        <div className="absolute bottom-3 right-3">
          <Icon name="external-link" size={14} className="text-premium-gold/60 group-active:text-premium-gold transition-colors" />
        </div>
      </div>
    </div>
  );
}

/**
 * Empty State Component
 */
function EmptyState({ type }: { type: 'daily' | 'spreads' }) {
  const messages = {
    daily: {
      icon: 'clock',
      title: '아직 저장된 일기가 없습니다',
      subtitle: '타이머에서 24시간 카드를 뽑고\n특별한 순간들을 기록해보세요',
    },
    spreads: {
      icon: 'bookmark',
      title: '아직 저장된 스프레드가 없습니다',
      subtitle: '스프레드에서 완성한 카드 배치를\n소중한 컬렉션으로 저장해보세요',
    },
  };

  const message = messages[type];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
      <div className="relative">
        <div className="absolute -inset-3 bg-premium-gold/20 rounded-full blur-xl opacity-50"></div>
        <div className="relative w-16 h-16 bg-premium-gold/20 rounded-full flex items-center justify-center border border-premium-gold/30">
          <Icon name={message.icon} size={24} className="text-premium-gold/60" />
        </div>
      </div>
      
      <div className="space-y-2 max-w-xs">
        <Text className="font-bold text-white">
          {message.title}
        </Text>
        <Text className="text-sm text-white/70 leading-relaxed">
          {message.subtitle}
        </Text>
      </div>
      
      <div className="flex items-center gap-1">
        <div className="w-1 h-1 bg-premium-gold/40 rounded-full"></div>
        <div className="w-1 h-1 bg-premium-gold/60 rounded-full"></div>
        <div className="w-1 h-1 bg-premium-gold/40 rounded-full"></div>
      </div>
    </div>
  );
}

/**
 * Main Journal Screen Component
 */
export function JournalScreen({ 
  className = '', 
  style = {} 
}: JournalScreenProps) {
  
  const [activeTab, setActiveTab] = useState<'daily' | 'spreads'>('daily');
  const [showDailyDetail, setShowDailyDetail] = useState(false);
  const [selectedDailyEntry, setSelectedDailyEntry] = useState<DailyEntry | null>(null);

  // Sample data
  const [dailyEntries] = useState<DailyEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      dateKr: '2024년 1월 15일',
      dayName: '월요일',
      totalCards: 24,
      memoCount: 12,
      completionRate: 95,
      highlights: ['중요한 깨달음', '새로운 시작'],
    },
    {
      id: '2',
      date: '2024-01-14',
      dateKr: '2024년 1월 14일',
      dayName: '일요일',
      totalCards: 24,
      memoCount: 8,
      completionRate: 67,
      highlights: ['내적 평화', '휴식의 시간'],
    }
  ]);

  const [savedSpreads] = useState<SavedSpread[]>([
    {
      id: '1',
      title: '새해의 운명 로드맵',
      spreadNameKr: '3카드 스프레드',
      dateKr: '2025년 1월 10일',
      cardCount: 3,
      isPremium: false,
      tags: ['새해', '계획', '미래'],
    },
    {
      id: '2',
      title: '사랑의 에너지 리딩',
      spreadNameKr: '사랑의 성배',
      dateKr: '2025년 1월 8일',
      cardCount: 5,
      isPremium: true,
      tags: ['연애', '관계', '감정'],
    }
  ]);

  // Handlers
  const handleDailyEntryClick = useCallback((entry: DailyEntry) => {
    setSelectedDailyEntry(entry);
    setShowDailyDetail(true);
  }, []);

  const handleSpreadClick = useCallback((spread: SavedSpread) => {
    console.log('스프레드 상세보기:', spread.title);
  }, []);

  const handleExport = () => {
    console.log('Export journal data');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-midnight-blue via-deep-purple to-midnight-blue relative mobile-optimized ${className}`} style={style}>
      <div className="h-full overflow-auto pb-20 custom-scrollbar">
        
        {/* Header */}
        <JournalHeader />

        {/* Tab Navigation */}
        <TabNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Content */}
        <div className="p-4 space-y-4">
          
          {activeTab === 'daily' ? (
            <>
              {/* Daily Entries Section */}
              <div className="space-y-4">
                {/* Section Header */}
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <Text className="font-bold text-white">
                      데일리 타로 여정
                    </Text>
                    <Text className="text-sm text-white/70">
                      매일의 신비로운 메시지를 되돌아보세요
                    </Text>
                  </div>
                  
                  <Button
                    onClick={handleExport}
                    variant="outline"
                    size="sm"
                    className="mobile-button border-premium-gold/30 text-premium-gold hover:bg-premium-gold/20 touch-target"
                  >
                    <Icon name="share" className="mr-2 h-4 w-4" />
                    내보내기
                  </Button>
                </div>

                {/* Entries List */}
                {dailyEntries.length === 0 ? (
                  <EmptyState type="daily" />
                ) : (
                  <div className="space-y-3">
                    {dailyEntries.map((entry) => (
                      <DailyEntryCard
                        key={entry.id}
                        entry={entry}
                        onClick={() => handleDailyEntryClick(entry)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Saved Spreads Section */}
              <div className="space-y-4">
                {/* Section Header */}
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <Text className="font-bold text-white">
                      신성한 스프레드 컬렉션
                    </Text>
                    <Text className="text-sm text-white/70">
                      특별한 순간의 카드 배치를 보관하세요
                    </Text>
                  </div>
                  
                  <Badge className="bg-premium-gold/20 text-premium-gold border border-premium-gold/30">
                    {savedSpreads.length}개 저장됨
                  </Badge>
                </div>

                {/* Spreads List */}
                {savedSpreads.length === 0 ? (
                  <EmptyState type="spreads" />
                ) : (
                  <div className="space-y-3">
                    {savedSpreads.map((spread) => (
                      <SavedSpreadCard
                        key={spread.id}
                        spread={spread}
                        onClick={() => handleSpreadClick(spread)}
                      />
                    ))}
                    
                    {/* Inspirational Message */}
                    <div className="text-center py-6 space-y-2">
                      <div className="flex justify-center mb-2">
                        <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-premium-gold to-transparent rounded-full"></div>
                      </div>
                      <Text className="text-sm text-premium-gold italic font-medium">
                        "기록된 지혜는 미래의 나에게 전하는 소중한 선물입니다"
                      </Text>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDailyDetail && selectedDailyEntry && (
        <Modal
          isOpen={showDailyDetail}
          onClose={() => setShowDailyDetail(false)}
          title={selectedDailyEntry.dateKr}
          subtitle="24시간 타로 기록"
          size="large"
          actions={[
            {
              label: '닫기',
              variant: 'ghost',
              onClick: () => setShowDailyDetail(false),
            },
          ]}
        >
          <div className="p-4 text-center">
            <Text className="text-white/70">
              일기 상세 내용이 여기에 표시됩니다
            </Text>
          </div>
        </Modal>
      )}
    </div>
  );
}