import React from 'react';
import { Icon } from '../base/Icon';
import { Text } from '../base/Text';
import { Badge } from '../base/Badge';

/**
 * 📱 Mobile App Style Tab Bar Component
 * 
 * Professional mobile navigation tab bar with modern iOS/Android design patterns.
 * Features:
 * - Native mobile app feel
 * - Smooth animations and haptic-like feedback
 * - Premium mystical branding
 * - Touch-optimized interactions
 * - Safe area support
 */

// Tab definition
interface TabDefinition {
  id: string;
  label: string;
  labelKr: string;
  iconName: 'timer' | 'spreads' | 'journal' | 'settings';
  badgeCount?: number;
}

interface TabBarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs?: TabDefinition[];
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Single Tab Item Component - Mobile App Style
 */
interface TabItemProps {
  tab: TabDefinition;
  isActive: boolean;
  onClick: () => void;
  language?: 'en' | 'ko';
}

function TabItem({ tab, isActive, onClick, language = 'ko' }: TabItemProps) {
  return (
    <button 
      className={`
        mobile-tab-item relative flex flex-col items-center justify-center gap-1 py-2 px-1
        transition-all duration-300 ease-out touch-target group
        min-h-[60px] flex-1
        ${isActive 
          ? 'text-premium-gold transform scale-105' 
          : 'text-white/60 hover:text-white/80 active:scale-95'
        }
        focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-premium-gold focus-visible:ring-offset-2
      `}
      onClick={onClick}
      aria-label={`${language === 'ko' ? tab.labelKr : tab.label} 탭${isActive ? ' (현재 선택됨)' : ''}`}
      role="tab"
      aria-selected={isActive}
    >
      {/* Active Background Glow */}
      {isActive && (
        <div className="absolute inset-x-2 inset-y-1 bg-gradient-to-br from-premium-gold/20 to-premium-gold/10 rounded-2xl border border-premium-gold/30 backdrop-blur-sm"></div>
      )}
      
      {/* Icon Container */}
      <div className="relative flex items-center justify-center z-10">
        {/* Icon Glow Effect */}
        {isActive && (
          <div className="absolute inset-0 bg-premium-gold/30 rounded-full blur-md scale-150 animate-pulse"></div>
        )}
        
        <Icon 
          name={tab.iconName}
          size={24}
          className={`
            relative transition-all duration-300 drop-shadow-lg
            ${isActive 
              ? 'text-premium-gold scale-110' 
              : 'text-white/70 group-active:scale-90'
            }
          `}
        />
        
        {/* Notification Badge */}
        {tab.badgeCount && tab.badgeCount > 0 && (
          <div className="absolute -top-2 -right-2 z-20">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full blur-sm opacity-60 animate-pulse"></div>
              <Badge className="relative bg-red-500 text-white border-white border-2 h-5 min-w-[20px] text-xs px-1 font-bold shadow-lg">
                {tab.badgeCount > 99 ? '99+' : tab.badgeCount.toString()}
              </Badge>
            </div>
          </div>
        )}
      </div>
      
      {/* Label */}
      <Text 
        variant="caption"
        className={`
          relative z-10 text-center transition-all duration-300 font-medium text-xs leading-tight
          ${isActive 
            ? 'text-premium-gold font-bold' 
            : 'text-white/70 group-active:text-white/50'
          }
        `}
      >
        {language === 'ko' ? tab.labelKr : tab.label}
      </Text>
      
      {/* Active Indicator Dot */}
      {isActive && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <div className="w-1 h-1 bg-premium-gold rounded-full shadow-lg animate-pulse"></div>
        </div>
      )}
    </button>
  );
}

/**
 * Main Tab Bar Component
 */
export function TabBar({ 
  activeTab, 
  onTabChange, 
  tabs,
  className = '',
  style = {},
}: TabBarProps) {
  
  // Default tabs configuration
  const defaultTabs: TabDefinition[] = [
    {
      id: 'timer',
      label: 'Timer',
      labelKr: '타이머',
      iconName: 'timer',
    },
    {
      id: 'spreads',
      label: 'Spreads',
      labelKr: '스프레드',
      iconName: 'spreads',
    },
    {
      id: 'journal',
      label: 'Journal',
      labelKr: '일기',
      iconName: 'journal',
    },
    {
      id: 'settings',
      label: 'Settings',
      labelKr: '설정',
      iconName: 'settings',
    },
  ];

  const tabsToRender = tabs || defaultTabs;

  return (
    <div 
      className={`
        mobile-tab-bar relative h-20 overflow-hidden
        ${className}
      `}
      style={style}
      role="tablist"
      aria-label="메인 내비게이션"
    >
      {/* Premium Mobile App Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-midnight-blue/95 via-deep-purple/90 to-midnight-blue/85"></div>
      
      {/* Glass Morphism Effect */}
      <div className="absolute inset-0 backdrop-blur-xl bg-white/5"></div>
      
      {/* Premium Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-premium-gold/50 to-transparent"></div>
      
      {/* Subtle Mystical Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-premium-gold/5 via-transparent to-transparent"></div>
      
      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="w-full max-w-sm mx-auto px-6">
          <div className="grid grid-cols-4 h-full items-center">
            {tabsToRender.map((tab) => (
              <TabItem
                key={tab.id}
                tab={tab}
                isActive={activeTab === tab.id}
                onClick={() => onTabChange(tab.id)}
                language="ko"
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Home Indicator */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full"></div>
    </div>
  );
}

// Convenience components for specific configurations
export function TabBarWithNotifications(props: Omit<TabBarProps, 'tabs'>) {
  const tabsWithNotifications: TabDefinition[] = [
    {
      id: 'timer',
      label: 'Timer',
      labelKr: '타이머',
      iconName: 'timer',
    },
    {
      id: 'spreads',
      label: 'Spreads',
      labelKr: '스프레드',
      iconName: 'spreads',
    },
    {
      id: 'journal',
      label: 'Journal',
      labelKr: '일기',
      iconName: 'journal',
      badgeCount: 3, // Example notification count
    },
    {
      id: 'settings',
      label: 'Settings',
      labelKr: '설정',
      iconName: 'settings',
      badgeCount: 1, // Example notification count
    },
  ];

  return <TabBar {...props} tabs={tabsWithNotifications} />;
}