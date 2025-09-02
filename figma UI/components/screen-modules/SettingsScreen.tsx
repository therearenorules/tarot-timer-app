import React, { useState, useCallback } from 'react';
import { Button } from '../base/Button';
import { Text } from '../base/Text';
import { Badge } from '../base/Badge';
import { Icon } from '../base/Icon';
import { Modal } from '../composite/Modal';

/**
 * ⚙️ Settings Screen Module - Mobile App Style
 * 
 * Clean mobile-first settings screen with professional design.
 * Features app preferences, theme management, and account settings.
 */

interface ThemeOption {
  id: string;
  nameKr: string;
  description: string;
  price?: number;
  isPremium: boolean;
  isPurchased: boolean;
  isActive: boolean;
  difficulty: 'free' | 'premium' | 'exclusive';
  difficultyKr: string;
  previewColors: {
    primary: string;
    accent: string;
    background: string;
  };
}

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  isPremium?: boolean;
}

interface SettingsScreenProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Mobile Header Component
 */
function SettingsHeader() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-midnight-blue to-deep-purple">
      {/* Mystical Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-premium-gold/5 to-transparent animate-pulse"></div>
      <div className="absolute top-4 left-1/4 w-1 h-1 bg-premium-gold rounded-full animate-ping delay-1000"></div>
      <div className="absolute top-8 right-1/3 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-2000"></div>
      
      <div className="relative z-10 p-6 text-center">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-premium-gold to-yellow-500 rounded-full mb-3 shadow-lg">
            <Icon name="settings" size={20} className="text-midnight-blue" />
          </div>
        </div>
        
        <Text className="text-xs font-medium text-white/80 mb-2 uppercase tracking-wider">
          신성한 설정의 공간
        </Text>
        <Text className="text-xl font-bold text-white mb-2">
          마법의 설정
        </Text>
        <Text className="text-sm text-white/70 leading-relaxed max-w-xs mx-auto">
          당신만의 타로 경험을 완성하는 신비로운 맞춤 설정
        </Text>
        
        <div className="flex justify-center mt-3">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-premium-gold to-transparent rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Settings Section Component
 */
function SettingsSection({ 
  title, 
  children 
}: { 
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-4 bg-gradient-to-b from-premium-gold to-yellow-500 rounded-full"></div>
        <Text className="font-bold text-white">
          {title}
        </Text>
      </div>
      
      <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

/**
 * Settings Item Component
 */
function SettingsItem({
  title,
  subtitle,
  icon,
  toggle,
  onClick,
  isPremium = false,
  isLast = false
}: {
  title: string;
  subtitle: string;
  icon: string;
  toggle?: {
    checked: boolean;
    onChange: (enabled: boolean) => void;
  };
  onClick?: () => void;
  isPremium?: boolean;
  isLast?: boolean;
}) {
  return (
    <div 
      className={`
        p-4 flex items-center justify-between transition-all duration-200 group touch-target
        ${onClick ? 'cursor-pointer active:bg-white/5' : ''}
        ${!isLast ? 'border-b border-white/10' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="p-2 rounded-lg bg-premium-gold/20 group-active:bg-premium-gold/30 transition-all duration-200">
          <Icon name={icon} size={18} className="text-premium-gold" />
        </div>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Text className="font-medium text-white">
              {title}
            </Text>
            {isPremium && (
              <Badge className="text-xs font-bold bg-gradient-to-r from-premium-gold to-yellow-500 text-midnight-blue border-0">
                프리미엄
              </Badge>
            )}
          </div>
          <Text className="text-sm text-white/70">
            {subtitle}
          </Text>
        </div>
      </div>
      
      {toggle && (
        <div className="ml-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggle.onChange(!toggle.checked);
            }}
            className={`
              relative w-11 h-6 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-premium-gold/50 touch-target
              ${toggle.checked 
                ? 'bg-gradient-to-r from-premium-gold to-yellow-500' 
                : 'bg-white/20'
              }
            `}
          >
            <div className={`
              absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-200 shadow-sm
              ${toggle.checked ? 'left-5' : 'left-0.5'}
            `} />
          </button>
        </div>
      )}
      
      {onClick && !toggle && (
        <Icon name="chevron-right" size={16} className="text-white/40 group-active:text-premium-gold transition-colors" />
      )}
    </div>
  );
}

/**
 * Theme Preview Component
 */
function ThemePreview({ 
  currentTheme, 
  onThemeStoreOpen 
}: { 
  currentTheme: ThemeOption;
  onThemeStoreOpen: () => void;
}) {
  return (
    <div className="p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-1">
            <Text className="font-bold text-white">
              현재 테마
            </Text>
            <Text className="text-sm text-premium-gold font-medium">
              {currentTheme.nameKr}
            </Text>
          </div>
          
          <Button
            onClick={onThemeStoreOpen}
            size="sm"
            className="mobile-button bg-premium-gold/20 text-premium-gold border border-premium-gold/30 hover:bg-premium-gold/30 touch-target"
          >
            <Icon name="star" className="mr-2 h-4 w-4" />
            테마 스토어
          </Button>
        </div>

        {/* Theme Preview Cards */}
        <div className="flex justify-center gap-2 mb-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="w-12 h-16 rounded-lg border-2 flex items-center justify-center text-sm transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: currentTheme.previewColors.background,
                borderColor: currentTheme.previewColors.accent,
                color: currentTheme.previewColors.primary,
                boxShadow: `0 2px 8px ${currentTheme.previewColors.accent}30`
              }}
            >
              {['♠', '♦', '♣', '♥'][i]}
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="text-center space-y-2">
          <Text className="text-sm text-white/70 italic">
            {currentTheme.description}
          </Text>
          <Badge className={`text-xs font-medium border ${
            currentTheme.difficulty === 'free' 
              ? 'text-green-400 bg-green-400/10 border-green-400/20'
              : currentTheme.difficulty === 'premium'
              ? 'text-amber-400 bg-amber-400/10 border-amber-400/20'
              : 'text-purple-400 bg-purple-400/10 border-purple-400/20'
          }`}>
            {currentTheme.difficultyKr}
          </Badge>
        </div>
      </div>
    </div>
  );
}

/**
 * Main Settings Screen Component
 */
export function SettingsScreen({ 
  className = '', 
  style = {} 
}: SettingsScreenProps) {
  
  const [showThemeStore, setShowThemeStore] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Current theme
  const [currentTheme] = useState<ThemeOption>({
    id: 'mystical-dark',
    nameKr: '신비로운 다크',
    description: '깊은 우주의 신비를 담은 기본 테마',
    isPremium: false,
    isPurchased: true,
    isActive: true,
    difficulty: 'free',
    difficultyKr: '무료',
    previewColors: {
      primary: '#FFFFFF',
      accent: '#D4AF37',
      background: '#1A1F3A',
    },
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'daily-reminder',
      title: '일일 타로 알림',
      description: '매일 정해진 시간에 신비로운 타로 안내',
      enabled: true,
    },
    {
      id: 'card-insights',
      title: '카드 해석 알림',
      description: '새로운 카드 해석과 깊은 통찰 업데이트',
      enabled: false,
      isPremium: true,
    },
    {
      id: 'premium-offers',
      title: '프리미엄 혜택 알림',
      description: '특별 할인과 신비로운 새 기능 소식',
      enabled: true,
      isPremium: true,
    },
  ]);

  // Handle notification toggle
  const handleNotificationToggle = useCallback((notificationId: string, enabled: boolean) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId 
        ? { ...notif, enabled }
        : notif
    ));
  }, []);

  const handleAppReset = useCallback(() => {
    console.log('App data reset');
    setShowConfirmReset(false);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-midnight-blue via-deep-purple to-midnight-blue relative mobile-optimized ${className}`} style={style}>
      <div className="h-full overflow-auto pb-20 custom-scrollbar">
        
        {/* Header */}
        <SettingsHeader />

        {/* Theme Preview */}
        <ThemePreview
          currentTheme={currentTheme}
          onThemeStoreOpen={() => setShowThemeStore(true)}
        />

        {/* Settings Sections */}
        <div className="space-y-2">
          
          {/* Notifications Section */}
          <SettingsSection title="알림 설정">
            {notifications.map((notif, index) => (
              <SettingsItem
                key={notif.id}
                title={notif.title}
                subtitle={notif.description}
                icon="bell"
                isPremium={notif.isPremium}
                toggle={{
                  checked: notif.enabled,
                  onChange: (enabled) => handleNotificationToggle(notif.id, enabled),
                }}
                isLast={index === notifications.length - 1}
              />
            ))}
          </SettingsSection>

          {/* Personalization Section */}
          <SettingsSection title="개인화 설정">
            <SettingsItem
              title="언어 설정"
              subtitle="앱에서 사용할 언어를 선택하세요"
              icon="globe"
              onClick={() => setShowLanguageModal(true)}
            />
            <SettingsItem
              title="테마 설정"
              subtitle={currentTheme.nameKr}
              icon="palette"
              onClick={() => setShowThemeStore(true)}
              isLast
            />
          </SettingsSection>

          {/* App Info Section */}
          <SettingsSection title="앱 정보">
            <SettingsItem
              title="앱 버전"
              subtitle="1.0.0 - 신비로운 첫 번째 여정"
              icon="info"
            />
            <SettingsItem
              title="개인정보 처리방침"
              subtitle="데이터 보호 및 개인정보 정책"
              icon="shield"
              onClick={() => console.log('Privacy policy')}
            />
            <SettingsItem
              title="이용약관"
              subtitle="서비스 이용 규정 및 가이드라인"
              icon="file-text"
              onClick={() => console.log('Terms of service')}
            />
            <SettingsItem
              title="앱 데이터 초기화"
              subtitle="모든 타로 기록과 설정을 삭제합니다"
              icon="trash-2"
              onClick={() => setShowConfirmReset(true)}
              isLast
            />
          </SettingsSection>

        </div>
      </div>

      {/* Theme Store Modal */}
      <Modal
        isOpen={showThemeStore}
        onClose={() => setShowThemeStore(false)}
        title="신비로운 테마 스토어"
        subtitle="마법의 테마로 당신만의 타로 공간을 꾸며보세요"
        size="large"
        actions={[
          {
            label: '닫기',
            variant: 'ghost',
            onClick: () => setShowThemeStore(false),
          },
        ]}
      >
        <div className="p-4 text-center">
          <Text className="text-white/70">
            테마 스토어가 곧 공개됩니다!
          </Text>
        </div>
      </Modal>

      {/* Language Selection Modal */}
      <Modal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        title="언어 선택"
        subtitle="앱에서 사용할 신성한 언어를 선택하세요"
        size="medium"
        actions={[
          {
            label: '닫기',
            variant: 'ghost',
            onClick: () => setShowLanguageModal(false),
          },
        ]}
      >
        <div className="space-y-3 p-2">
          {[
            { code: 'ko', name: '한국어', nameEn: 'Korean', isActive: true },
            { code: 'en', name: 'English', nameEn: 'English', isActive: false },
          ].map((language) => (
            <div
              key={language.code}
              className={`
                p-4 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-between touch-target
                ${language.isActive 
                  ? 'bg-premium-gold/20 border-2 border-premium-gold/40' 
                  : 'bg-white/10 border border-white/20 hover:border-premium-gold/40'
                }
              `}
            >
              <div>
                <Text className="font-medium text-white">
                  {language.name}
                </Text>
                <Text className="text-sm text-white/70">
                  {language.nameEn}
                </Text>
              </div>
              {language.isActive && (
                <Badge className="bg-green-400/20 text-green-400 border border-green-400/30">
                  선택됨
                </Badge>
              )}
            </div>
          ))}
        </div>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showConfirmReset}
        onClose={() => setShowConfirmReset(false)}
        title="앱 데이터 초기화"
        subtitle="정말로 모든 데이터를 삭제하시겠습니까?"
        size="medium"
        actions={[
          {
            label: '취소',
            variant: 'ghost',
            onClick: () => setShowConfirmReset(false),
          },
          {
            label: '초기화',
            variant: 'secondary',
            onClick: handleAppReset,
          },
        ]}
      >
        <div className="p-4 text-center">
          <Text className="text-white/70 leading-relaxed">
            모든 타로 기록, 설정, 테마가 영원히 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
          </Text>
        </div>
      </Modal>
    </div>
  );
}