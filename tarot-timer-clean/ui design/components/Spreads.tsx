import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { SPREAD_TYPES, type SpreadType } from '../utils/tarot-data';
import { useLanguage } from '../utils/language';
import { Layout, Crown, Star, Sparkles, Zap } from './ui/icons';

interface SpreadsProps {
  onSpreadSelect: (spread: SpreadType) => void;
}

export function Spreads({ onSpreadSelect }: SpreadsProps) {
  const { t, language } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-blue via-deep-purple to-midnight-blue relative">
      {/* Mystical Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-premium-gold/5 to-transparent animate-pulse"></div>
      <div className="absolute top-16 left-12 w-1 h-1 bg-premium-gold rounded-full animate-ping delay-1000"></div>
      <div className="absolute top-32 right-8 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-2000"></div>
      <div className="absolute bottom-48 left-20 w-1.5 h-1.5 bg-premium-gold rounded-full animate-ping delay-500"></div>
      <div className="absolute top-64 right-16 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-3000"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-md space-y-8">
        
        {/* Mystical Header */}
        <div className="text-center space-y-6 pt-8">
          <div className="relative">
            <div className="absolute inset-0 bg-premium-gold/20 blur-3xl rounded-full"></div>
            <div className="relative space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Layout className="h-12 w-12 text-premium-gold animate-mystical-pulse" />
                  <div className="absolute inset-0 bg-premium-gold/30 blur-lg rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold bg-gradient-to-r from-premium-gold via-white to-premium-gold bg-clip-text text-transparent">
                {t('spreads.title')}
              </h1>
              
              <p className="text-white/70 text-sm font-medium tracking-wide">
                {t('spreads.subtitle')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Enhanced Spread Cards */}
        <div className="space-y-6">
          {SPREAD_TYPES.map((spread) => (
            <div key={spread.id} className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-premium-gold/20 via-transparent to-premium-gold/20 blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <Card 
                className="relative bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-premium-gold/10 hover:scale-[1.02] hover:border-premium-gold/30"
                onClick={() => onSpreadSelect(spread)}
              >
                <CardContent className="p-6 space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Layout className="h-6 w-6 text-premium-gold" />
                          <div className="absolute inset-0 bg-premium-gold/30 blur-sm rounded-full"></div>
                        </div>
                        <h3 className="text-xl font-bold text-white group-hover:text-premium-gold transition-colors">
                          {language === 'ko' ? spread.nameKr : spread.name}
                        </h3>
                        {spread.isPremium && (
                          <div className="relative">
                            <Badge className="gap-1 bg-gradient-to-r from-premium-gold to-yellow-500 text-midnight-blue border-none shadow-lg">
                              <Crown className="h-3 w-3" />
                              {t('spreads.premium')}
                            </Badge>
                            <div className="absolute inset-0 bg-premium-gold/20 blur-md rounded-full"></div>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-premium-gold/80 font-medium tracking-wide">
                        {language === 'ko' ? spread.name : spread.nameKr}
                      </p>
                    </div>
                    
                    {/* 카드 수 표시 Badge 제거 */}
                  </div>
                  
                  {/* Description */}
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-white/90 leading-relaxed text-sm">
                      {language === 'ko' ? spread.descriptionKr : spread.description}
                    </p>
                  </div>
                  
                  {/* Action Button */}
                  <div className="pt-2">
                    <Button 
                      className="w-full bg-gradient-to-r from-premium-gold to-yellow-500 text-midnight-blue font-bold py-3 text-base hover:from-yellow-500 hover:to-premium-gold transition-all duration-500 shadow-2xl shadow-premium-gold/20 group-hover:shadow-premium-gold/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSpreadSelect(spread);
                      }}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      {t('spreads.beginReading')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        {/* Premium Feature Highlight */}
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-premium-gold/30 to-yellow-500/30 blur-xl rounded-2xl"></div>
          <Card className="relative bg-white/18 border border-premium-gold/30 shadow-2xl" style={{
            backgroundColor: 'rgba(255, 255, 255, 0.18)', /* React Native 호환 */
            boxShadow: '0 8px 32px rgba(74, 26, 79, 0.15), 0 4px 16px rgba(212, 175, 55, 0.1)'
          }}>
            <CardContent className="p-6 text-center space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <Crown className="h-12 w-12 text-premium-gold animate-mystical-pulse" />
                    <div className="absolute inset-0 bg-premium-gold/30 blur-lg rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {t('spreads.premiumTitle')}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {t('spreads.premiumDesc')}
                </p>
              </div>
              <div className="flex justify-center">
                <Badge className="gap-2 bg-gradient-to-r from-premium-gold to-yellow-500 text-midnight-blue px-4 py-2">
                  <Star className="h-4 w-4" />
                  {t('spreads.premiumActive')}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Mystical Quote */}
        <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
          <p className="text-white/80 italic leading-relaxed">
            {t('spreads.quote')}
          </p>
        </div>
        
        {/* Bottom padding for navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}