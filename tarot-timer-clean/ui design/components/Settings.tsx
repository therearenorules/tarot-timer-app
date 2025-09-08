import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useLanguage } from '../utils/language';
import { Settings as SettingsIcon, Crown, Bell, Palette, Moon, Sun, Volume2, VolumeX, Lock, Shield, HelpCircle, Heart, Star, Globe } from './ui/icons';

interface SettingsProps {}

export function Settings({}: SettingsProps) {
  const { t, language, setLanguage } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isHapticEnabled, setIsHapticEnabled] = useState(true);
  
  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const handleNotificationToggle = () => {
    setIsNotificationsEnabled(!isNotificationsEnabled);
  };
  
  const handleSoundToggle = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };
  
  const handleHapticToggle = () => {
    setIsHapticEnabled(!isHapticEnabled);
  };
  
  const handleLanguageToggle = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
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
                  <SettingsIcon className="h-12 w-12 text-premium-gold animate-mystical-pulse" />
                  <div className="absolute inset-0 bg-premium-gold/30 blur-lg rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold bg-gradient-to-r from-premium-gold via-white to-premium-gold bg-clip-text text-transparent">
                {t('settings.title')}
              </h1>
              
              <p className="text-white/70 text-sm font-medium tracking-wide">
                {t('settings.subtitle')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Premium Section */}
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-premium-gold/30 to-yellow-500/30 blur-xl rounded-2xl"></div>
          <Card className="relative bg-white/10 backdrop-blur-lg border border-premium-gold/30 shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Crown className="h-6 w-6 text-premium-gold animate-mystical-pulse" />
                {t('settings.premium')}
                <Badge className="gap-1 bg-gradient-to-r from-premium-gold to-yellow-500 text-midnight-blue border-none">
                  <Star className="h-3 w-3" />
                  {t('settings.active')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-sm font-medium text-white">{t('settings.premiumSpreads')}</span>
                  <Badge className="text-xs border-premium-gold/30 text-premium-gold bg-premium-gold/10 border">
                    ✓ {t('settings.active')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-sm font-medium text-white">{t('settings.adFree')}</span>
                  <Badge className="text-xs border-premium-gold/30 text-premium-gold bg-premium-gold/10 border">
                    ✓ {t('settings.active')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-sm font-medium text-white">{t('settings.unlimitedStorage')}</span>
                  <Badge className="text-xs border-premium-gold/30 text-premium-gold bg-premium-gold/10 border">
                    ✓ {t('settings.active')}
                  </Badge>
                </div>
              </div>
              <Button className="w-full gap-2 bg-gradient-to-r from-premium-gold to-yellow-500 text-midnight-blue font-bold py-3 hover:from-yellow-500 hover:to-premium-gold transition-all duration-500 shadow-2xl">
                <Crown className="h-4 w-4" />
                {t('settings.managePremium')}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Display & Theme */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-premium-gold/20 to-transparent blur-lg rounded-xl"></div>
          <Card className="relative bg-white/10 backdrop-blur-lg border border-white/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Palette className="h-5 w-5 text-premium-gold" />
                {t('settings.displayTheme')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Moon className="h-5 w-5 text-premium-gold" /> : <Sun className="h-5 w-5 text-premium-gold" />}
                  <span className="text-sm font-medium text-white">{t('settings.darkMode')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-premium-gold bg-premium-gold/10 px-2 py-1 rounded">
                    {isDarkMode ? t('settings.on') : t('settings.off')}
                  </span>
                  <Switch 
                    checked={isDarkMode}
                    onCheckedChange={handleThemeToggle}
                    className="data-[state=checked]:bg-premium-gold data-[state=unchecked]:bg-white/20"
                  />
                </div>
              </div>
              
              {/* Language Selection */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-premium-gold" />
                  <span className="text-sm font-medium text-white">{t('settings.language')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-premium-gold bg-premium-gold/10 px-2 py-1 rounded">
                    {language === 'ko' ? t('settings.korean') : t('settings.english')}
                  </span>
                  <Switch 
                    checked={language === 'en'}
                    onCheckedChange={handleLanguageToggle}
                    className="data-[state=checked]:bg-premium-gold data-[state=unchecked]:bg-white/20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Notifications */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-premium-gold/20 to-transparent blur-lg rounded-xl"></div>
          <Card className="relative bg-white/10 backdrop-blur-lg border border-white/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-premium-gold" />
                {t('settings.notifications')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-white">{t('settings.spreadCompletion')}</span>
                  <p className="text-xs text-white/60">{t('settings.spreadCompletionDesc')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-premium-gold bg-premium-gold/10 px-2 py-1 rounded">
                    {isNotificationsEnabled ? t('settings.on') : t('settings.off')}
                  </span>
                  <Switch 
                    checked={isNotificationsEnabled}
                    onCheckedChange={handleNotificationToggle}
                    className="data-[state=checked]:bg-premium-gold data-[state=unchecked]:bg-white/20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sound & Haptic */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-premium-gold/20 to-transparent blur-lg rounded-xl"></div>
          <Card className="relative bg-white/10 backdrop-blur-lg border border-white/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-premium-gold" />
                {t('settings.soundHaptics')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  {isSoundEnabled ? <Volume2 className="h-5 w-5 text-premium-gold" /> : <VolumeX className="h-5 w-5 text-white/50" />}
                  <span className="text-sm font-medium text-white">{t('settings.soundEffects')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-premium-gold bg-premium-gold/10 px-2 py-1 rounded">
                    {isSoundEnabled ? t('settings.on') : t('settings.off')}
                  </span>
                  <Switch 
                    checked={isSoundEnabled}
                    onCheckedChange={handleSoundToggle}
                    className="data-[state=checked]:bg-premium-gold data-[state=unchecked]:bg-white/20"
                  />
                </div>
              </div>
              
              <Separator className="bg-white/20" />
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-white">{t('settings.hapticFeedback')}</span>
                  <p className="text-xs text-white/60">{t('settings.hapticFeedbackDesc')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-premium-gold bg-premium-gold/10 px-2 py-1 rounded">
                    {isHapticEnabled ? t('settings.on') : t('settings.off')}
                  </span>
                  <Switch 
                    checked={isHapticEnabled}
                    onCheckedChange={handleHapticToggle}
                    className="data-[state=checked]:bg-premium-gold data-[state=unchecked]:bg-white/20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Privacy & Security */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-premium-gold/20 to-transparent blur-lg rounded-xl"></div>
          <Card className="relative bg-white/10 backdrop-blur-lg border border-white/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-premium-gold" />
                {t('settings.privacySecurity')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 border-white/20 text-white bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <Lock className="h-4 w-4 text-premium-gold" />
                {t('settings.privacyPolicy')}
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 border-white/20 text-white bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <Shield className="h-4 w-4 text-premium-gold" />
                {t('settings.dataManagement')}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Support */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-premium-gold/20 to-transparent blur-lg rounded-xl"></div>
          <Card className="relative bg-white/10 backdrop-blur-lg border border-white/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-premium-gold" />
                {t('settings.support')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 border-white/20 text-white bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <HelpCircle className="h-4 w-4 text-premium-gold" />
                {t('settings.helpFaq')}
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 border-white/20 text-white bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <Heart className="h-4 w-4 text-premium-gold" />
                {t('settings.supportDev')}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* App Version */}
        <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
          <p className="text-xs text-white/50">
            {t('settings.version')}
          </p>
          <p className="text-xs text-white/50 mt-1">
            {t('settings.copyright')}
          </p>
        </div>
        
        {/* Mystical Quote */}
        <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
          <p className="text-white/80 italic leading-relaxed">
            {t('settings.quote')}
          </p>
        </div>
        
        {/* Bottom padding for navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}