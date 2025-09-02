import React from 'react';
import { TabBar } from './TabBar';
import { Header } from './Header';
import { Modal } from './Modal';

/**
 * 🔄 Composite Navigation Flow Component
 * 
 * Complete screen navigation container assembled from composite components.
 * Uses only composite and base components with design tokens.
 * 
 * Features:
 * - Full screen layout structure
 * - Header + Content + TabBar composition
 * - Modal overlay management
 * - Toast notification area
 * - Safe area handling
 * - Mystical background effects
 * - Full independence from other composites
 */

interface NavigationFlowProps {
  // Header configuration
  headerProps?: React.ComponentProps<typeof Header>;
  showHeader?: boolean;
  
  // Content area
  children: React.ReactNode;
  
  // Tab bar configuration
  tabBarProps?: React.ComponentProps<typeof TabBar>;
  showTabBar?: boolean;
  
  // Modal management
  modalProps?: React.ComponentProps<typeof Modal>;
  
  // Background and styling
  showMysticalBackground?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Mystical Background Component - Internal composite
 */
function MysticalBackground() {
  // Star positions for mystical effect
  const stars = [
    { top: '32px', left: '32px', size: '4px', delay: '1000ms' },
    { top: '96px', right: '48px', size: '2px', delay: '2000ms' },
    { bottom: '128px', left: '64px', size: '6px', delay: '500ms' },
    { top: '192px', left: '33%', size: '2px', delay: '3000ms' },
    { bottom: '192px', right: '25%', size: '4px', delay: '1500ms' },
    { top: '288px', right: '32px', size: '2px', delay: '4000ms' },
  ];

  const backgroundStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    background: 'linear-gradient(135deg, #1a1f3a 0%, #4a1a4f 50%, #1a1f3a 100%)',
  };

  const overlayStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.05), transparent)',
    opacity: 0.5,
    animation: 'mystical-pulse 4s ease-in-out infinite',
    pointerEvents: 'none',
  };

  const topGradientStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '128px',
    background: 'linear-gradient(to bottom, rgba(26, 31, 58, 0.3), transparent)',
    pointerEvents: 'none',
  };

  return (
    <div style={backgroundStyles}>
      {/* Mystical overlay */}
      <div style={overlayStyles} />
      
      {/* Top gradient */}
      <div style={topGradientStyles} />
      
      {/* Animated stars */}
      {stars.map((star, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            width: star.size,
            height: star.size,
            backgroundColor: index % 2 === 0 ? '#d4af37' : '#ffffff',
            borderRadius: '50%',
            animation: index % 2 === 0 ? 'mystical-pulse 2s ease-in-out infinite' : 'twinkle 3s ease-in-out infinite',
            animationDelay: star.delay,
            pointerEvents: 'none',
            ...star,
          }}
        />
      ))}

      {/* Inline styles for star animations */}
      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}

/**
 * Content Area Component - Internal composite
 */
function ContentArea({ 
  children, 
  hasHeader, 
  hasTabBar 
}: { 
  children: React.ReactNode;
  hasHeader: boolean;
  hasTabBar: boolean;
}) {
  
  const contentStyles: React.CSSProperties = {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
    // Adjust for header and tab bar
    paddingTop: hasHeader ? 0 : 'var(--spacing-safe-margin)',
    paddingBottom: hasTabBar ? '80px' : 'var(--spacing-safe-margin)', // Tab bar height
  };

  const scrollAreaStyles: React.CSSProperties = {
    height: '100%',
    overflow: 'auto',
    position: 'relative',
  };

  return (
    <div style={contentStyles}>
      <div style={scrollAreaStyles} className="scrollbar-none">
        {children}
      </div>
    </div>
  );
}

/**
 * Toast Area Component - Internal composite
 */
function ToastArea() {
  const toastAreaStyles: React.CSSProperties = {
    position: 'fixed',
    top: 'var(--space-l)',
    left: 'var(--space-m)',
    right: 'var(--space-m)',
    zIndex: 100,
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-s)',
  };

  return (
    <div style={toastAreaStyles}>
      {/* Toast notifications will be rendered here by toast system */}
    </div>
  );
}

/**
 * Main Navigation Flow Component
 */
export function NavigationFlow({
  headerProps,
  showHeader = false,
  children,
  tabBarProps,
  showTabBar = true,
  modalProps,
  showMysticalBackground = true,
  className = '',
  style = {},
}: NavigationFlowProps) {

  // Root container styles
  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    ...style,
  };

  // Main content wrapper styles
  const mainStyles: React.CSSProperties = {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxHeight: '100vh',
  };

  return (
    <div className={className} style={containerStyles}>
      {/* Mystical Background */}
      {showMysticalBackground && <MysticalBackground />}
      
      {/* Main Content Structure */}
      <div style={mainStyles}>
        {/* Header */}
        {showHeader && headerProps && (
          <Header {...headerProps} />
        )}
        
        {/* Content Area */}
        <ContentArea 
          hasHeader={showHeader}
          hasTabBar={showTabBar}
        >
          {children}
        </ContentArea>
        
        {/* Tab Bar */}
        {showTabBar && tabBarProps && (
          <TabBar {...tabBarProps} />
        )}
      </div>
      
      {/* Modal Overlay */}
      {modalProps && <Modal {...modalProps} />}
      
      {/* Toast Area */}
      <ToastArea />
    </div>
  );
}

// Convenience components for specific screen types
export function TabScreen({
  activeTab,
  onTabChange,
  children,
  modalProps,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
  modalProps?: React.ComponentProps<typeof Modal>;
}) {
  return (
    <NavigationFlow
      showHeader={false}
      showTabBar={true}
      tabBarProps={{
        activeTab,
        onTabChange,
      }}
      modalProps={modalProps}
    >
      {children}
    </NavigationFlow>
  );
}

export function DetailScreen({
  headerProps,
  children,
  modalProps,
}: {
  headerProps: React.ComponentProps<typeof Header>;
  children: React.ReactNode;
  modalProps?: React.ComponentProps<typeof Modal>;
}) {
  return (
    <NavigationFlow
      showHeader={true}
      showTabBar={false}
      headerProps={headerProps}
      modalProps={modalProps}
    >
      {children}
    </NavigationFlow>
  );
}

export function FullscreenFlow({
  children,
  modalProps,
  showMysticalBackground = true,
}: {
  children: React.ReactNode;
  modalProps?: React.ComponentProps<typeof Modal>;
  showMysticalBackground?: boolean;
}) {
  return (
    <NavigationFlow
      showHeader={false}
      showTabBar={false}
      showMysticalBackground={showMysticalBackground}
      modalProps={modalProps}
    >
      {children}
    </NavigationFlow>
  );
}

// Screen with custom header and tab bar
export function CustomScreen({
  headerProps,
  tabBarProps,
  children,
  modalProps,
}: {
  headerProps?: React.ComponentProps<typeof Header>;
  tabBarProps?: React.ComponentProps<typeof TabBar>;
  children: React.ReactNode;
  modalProps?: React.ComponentProps<typeof Modal>;
}) {
  return (
    <NavigationFlow
      showHeader={!!headerProps}
      showTabBar={!!tabBarProps}
      headerProps={headerProps}
      tabBarProps={tabBarProps}
      modalProps={modalProps}
    >
      {children}
    </NavigationFlow>
  );
}