import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SpreadMiniature } from './SpreadMiniature';
import { loadDailyTarotSaves, type DailyTarotSave } from '../utils/tarot';
import { MOCK_SAVED_SPREADS, type SpreadSave } from '../utils/journal-constants';
import { formatDate, formatHour } from '../utils/journal-helpers';
import { useLanguage } from '../utils/language';
import { BookOpen, Calendar, Eye, Layout, Clock } from './ui/icons';

interface JournalProps {
  onSavedSpreadView: (spread: any) => void;
  onDailyTarotView: (dailyTarot: DailyTarotSave) => void;
}

export function Journal({ onSavedSpreadView, onDailyTarotView }: JournalProps) {
  const { t, language } = useLanguage();
  const [activeJournalTab, setActiveJournalTab] = useState('daily');
  const [savedReadings, setSavedReadings] = useState<DailyTarotSave[]>([]);
  const [savedSpreads, setSavedSpreads] = useState<SpreadSave[]>([]);
  const [selectedReading, setSelectedReading] = useState<DailyTarotSave | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    const readings = loadDailyTarotSaves();
    setSavedReadings(readings);
    setSavedSpreads(MOCK_SAVED_SPREADS);
  }, []);
  
  const handleReadingClick = (reading: DailyTarotSave) => {
    setSelectedReading(reading);
    setIsDialogOpen(true);
  };
  
  const handleSpreadClick = (spread: SpreadSave) => {
    onSavedSpreadView(spread);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-blue via-deep-purple to-midnight-blue relative">
      {/* Mystical Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-premium-gold/5 to-transparent animate-pulse"></div>
      <div className="absolute top-16 left-12 w-1 h-1 bg-premium-gold rounded-full animate-ping delay-1000"></div>
      <div className="absolute top-32 right-8 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-2000"></div>
      <div className="absolute bottom-48 left-20 w-1.5 h-1.5 bg-premium-gold rounded-full animate-ping delay-500"></div>
      <div className="absolute top-64 right-16 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-3000"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-md space-y-6">
        
        {/* Mystical Header */}
        <div className="text-center space-y-6 pt-8">
          <div className="relative">
            <div className="absolute inset-0 bg-premium-gold/20 blur-3xl rounded-full"></div>
            <div className="relative space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <BookOpen className="h-12 w-12 text-premium-gold animate-mystical-pulse" />
                  <div className="absolute inset-0 bg-premium-gold/30 blur-lg rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold bg-gradient-to-r from-premium-gold via-white to-premium-gold bg-clip-text text-transparent">
                {t('journal.title')}
              </h1>
              
              <p className="text-white/70 text-sm font-medium tracking-wide">
                {t('journal.subtitle')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Journal Tabs */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-premium-gold/20 to-transparent blur-lg rounded-xl"></div>
          <Tabs value={activeJournalTab} onValueChange={setActiveJournalTab} className="relative w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-1">
              <TabsTrigger 
                value="daily" 
                className="gap-2 data-[state=active]:bg-premium-gold data-[state=active]:text-midnight-blue text-white/70 rounded-lg transition-all duration-300"
              >
                <Clock className="h-4 w-4" />
                {t('journal.dailyTarot')}
              </TabsTrigger>
              <TabsTrigger 
                value="spreads" 
                className="gap-2 data-[state=active]:bg-premium-gold data-[state=active]:text-midnight-blue text-white/70 rounded-lg transition-all duration-300"
              >
                <Layout className="h-4 w-4" />
                {t('journal.spreadRecords')}
              </TabsTrigger>
            </TabsList>
            
            {/* Daily Tarot Tab */}
            <TabsContent value="daily" className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-premium-gold" />
                  {t('journal.dailyReadings')}
                </h2>
                <Badge variant="outline" className="border-premium-gold/30 text-premium-gold bg-premium-gold/10">
                  {savedReadings.length} {t('journal.records')}
                </Badge>
              </div>
              
              {savedReadings.length === 0 ? (
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-premium-gold/20 to-transparent blur-xl rounded-2xl"></div>
                  <Card className="relative bg-white/10 backdrop-blur-lg border border-white/20">
                    <CardContent className="p-8 text-center space-y-4">
                      <div className="relative">
                        <Clock className="h-16 w-16 text-premium-gold mx-auto animate-mystical-pulse" />
                        <div className="absolute inset-0 bg-premium-gold/20 blur-lg rounded-full"></div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-white text-lg">{t('journal.noReadings')}</h3>
                        <p className="text-white/70 leading-relaxed">
                          {t('journal.noReadingsDesc')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedReadings.map((reading) => (
                    <div key={reading.id} className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-premium-gold/20 via-transparent to-premium-gold/20 blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <Card 
                        className="relative bg-white/10 backdrop-blur-lg border border-white/20 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-premium-gold/10 hover:border-premium-gold/30"
                        onClick={() => handleReadingClick(reading)}
                      >
                        <CardContent className="p-5 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-white group-hover:text-premium-gold transition-colors">
                                  {formatDate(reading.date, language)}
                                </h3>
                                <Badge variant="outline" className="text-xs border-premium-gold/30 text-premium-gold bg-premium-gold/10">
                                  24-Hour Reading
                                </Badge>
                              </div>
                              <p className="text-sm text-white/70 line-clamp-2 leading-relaxed">
                                {reading.insights || 'A precious day\'s tarot reading'}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-white/50">
                                <span>{reading.hourlyCards.length} {t('spreads.cards')}</span>
                                <span>•</span>
                                <span>{new Date(reading.savedAt).toLocaleTimeString(language === 'ko' ? 'ko-KR' : 'en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })} {t('journal.saved')}</span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 border-premium-gold/30 text-premium-gold bg-premium-gold/10 hover:bg-premium-gold/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReadingClick(reading);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                              {t('journal.view')}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Spread Records Tab */}
            <TabsContent value="spreads" className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Layout className="h-5 w-5 text-premium-gold" />
                  {t('journal.spreadRecords')}
                </h2>
                <Badge variant="outline" className="border-premium-gold/30 text-premium-gold bg-premium-gold/10">
                  {savedSpreads.length} {t('journal.records')}
                </Badge>
              </div>
              
              {savedSpreads.length === 0 ? (
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-premium-gold/20 to-transparent blur-xl rounded-2xl"></div>
                  <Card className="relative bg-white/10 backdrop-blur-lg border border-white/20">
                    <CardContent className="p-8 text-center space-y-4">
                      <div className="relative">
                        <Layout className="h-16 w-16 text-premium-gold mx-auto animate-mystical-pulse" />
                        <div className="absolute inset-0 bg-premium-gold/20 blur-lg rounded-full"></div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-white text-lg">{t('journal.noSpreads')}</h3>
                        <p className="text-white/70 leading-relaxed">
                          {t('journal.noSpreadsDesc')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedSpreads.map((spread) => (
                    <div key={spread.id} className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-premium-gold/20 via-transparent to-premium-gold/20 blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <Card 
                        className="relative bg-white/18 border border-white/20 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-premium-gold/10 hover:border-premium-gold/30"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.18)', /* React Native 호환 */
                          boxShadow: '0 4px 20px rgba(74, 26, 79, 0.12)'
                        }}
                        onClick={() => handleSpreadClick(spread)}
                      >
                        <CardContent className="p-5 space-y-4">
                          {/* 스프레드 미니어처 */}
                          <SpreadMiniature spread={spread} />
                          
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-white group-hover:text-premium-gold transition-colors">
                                  {spread.title}
                                </h3>
                                <Badge variant="outline" className="text-xs border-premium-gold/30 text-premium-gold bg-premium-gold/10">
                                  Spread
                                </Badge>
                              </div>
                              <p className="text-sm text-premium-gold/80">
                                {formatDate(spread.date, language)}
                              </p>
                              <p className="text-sm text-white/70 line-clamp-2 leading-relaxed">
                                {spread.notes || 'A mystical spread reading record'}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-white/50">
                                <span>{spread.cards.length} {t('spreads.cards')}</span>
                                <span>•</span>
                                <span>{new Date(spread.savedAt).toLocaleTimeString(language === 'ko' ? 'ko-KR' : 'en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })} {t('journal.saved')}</span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 border-premium-gold/30 text-premium-gold bg-premium-gold/10 hover:bg-premium-gold/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSpreadClick(spread);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                              {t('journal.view')}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Dialog for viewing daily readings */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md mx-auto max-h-[80vh] overflow-y-auto bg-midnight-blue/95 backdrop-blur-xl border border-premium-gold/30 scrollbar-none">
            <DialogHeader>
              <DialogTitle className="text-center text-premium-gold text-lg">
                {selectedReading && (
                  <>
                    <Clock className="h-5 w-5 inline mr-2" />
                    {formatDate(selectedReading.date, language)}
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            
            {selectedReading && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-premium-gold">24-Hour Tarot Cards</h3>
                  <div className="overflow-x-auto horizontal-scroll">
                    <div className="flex gap-3 pb-2" style={{ width: 'max-content' }}>
                      {selectedReading.hourlyCards.map((card, index) => (
                        <div key={`${card.id}-${index}`} className="flex-shrink-0 text-center space-y-2">
                          <div className="w-16 h-24 rounded-lg overflow-hidden shadow-lg border border-premium-gold/30">
                            <ImageWithFallback
                              src={card.imageUrl}
                              alt={language === 'ko' ? card.nameKr : card.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-premium-gold">
                              {formatHour(index)}
                            </p>
                            <p className="text-xs font-medium text-white line-clamp-1">
                              {language === 'ko' ? card.nameKr : card.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-premium-gold">Sacred Notes</h3>
                  <div className="p-4 bg-white/15 rounded-lg border border-white/20" style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)', /* React Native 호환 */
                    boxShadow: '0 2px 8px rgba(74, 26, 79, 0.08)'
                  }}>
                    <p className="text-sm text-white leading-relaxed">
                      {selectedReading.insights || 'No special notes for this day.'}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-xs text-white/50 pt-2 border-t border-white/20">
                  <span>Saved Time</span>
                  <span>
                    {new Date(selectedReading.savedAt).toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US')} {' '}
                    {new Date(selectedReading.savedAt).toLocaleTimeString(language === 'ko' ? 'ko-KR' : 'en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Mystical Quote */}
        <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
          <p className="text-white/80 italic leading-relaxed">
            {t('journal.quote')}
          </p>
        </div>
        
        {/* Bottom padding for navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}