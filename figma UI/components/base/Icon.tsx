import React from 'react';

/**
 * 🎨 Independent Base Icon Component
 * 
 * A completely independent icon component that uses only design tokens.
 * Zero dependencies on other components.
 * 
 * Features:
 * - Consistent 24pt × 24pt size system
 * - Same stroke width (1.5pt) across all icons
 * - Uses color tokens only
 * - Scalable vector format
 * - Full light/dark mode support
 * - Complete icon collection for tarot app
 */

interface IconProps extends React.SVGAttributes<SVGElement> {
  name: IconName;
  size?: number; // Override default 24px if needed
  color?: string; // Override default color if needed
}

// Icon name types - complete collection
type IconName = 
  // Navigation Icons
  | 'timer' | 'spreads' | 'journal' | 'settings' | 'close' | 'back' | 'forward'
  // Tarot Icons  
  | 'card-outline' | 'card-filled' | 'shuffle' | 'flip' | 'star'
  // Action Icons
  | 'share' | 'delete' | 'save' | 'edit' | 'search' | 'plus' | 'minus'
  // State Icons
  | 'check' | 'warning' | 'error' | 'info' | 'loading'
  // Time Icons
  | 'clock' | 'feather';

/**
 * Base Icon Component - Master Component
 */
export function Icon({ 
  name, 
  size = 24, 
  color = '#FFFFFF',
  className = '',
  style = {},
  ...props 
}: IconProps) {

  // Enhanced icon styles with better visibility and shadow
  const baseStyles: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    fill: 'none',
    stroke: color,
    strokeWidth: '2',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))',
    ...style,
  };

  // Icon path definitions - consistent 24x24 viewBox
  const iconPaths: Record<IconName, JSX.Element> = {
    // Navigation Icons
    timer: (
      <>
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12,6 12,12 16,14"/>
      </>
    ),
    
    spreads: (
      <>
        <rect x="3" y="4" width="18" height="12" rx="2"/>
        <path d="M7 4v12M17 4v12"/>
        <path d="M3 10h18"/>
      </>
    ),
    
    journal: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </>
    ),
    
    settings: (
      <>
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2 2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </>
    ),
    
    close: (
      <>
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </>
    ),
    
    back: (
      <>
        <polyline points="15,18 9,12 15,6"/>
      </>
    ),
    
    forward: (
      <>
        <polyline points="9,18 15,12 9,6"/>
      </>
    ),

    // Tarot Icons
    'card-outline': (
      <>
        <rect x="4" y="2" width="16" height="20" rx="2"/>
      </>
    ),
    
    'card-filled': (
      <>
        <rect x="4" y="2" width="16" height="20" rx="2" fill="currentColor"/>
        <circle cx="12" cy="8" r="2" fill="white"/>
        <path d="M8 16h8" stroke="white"/>
        <path d="M8 18h6" stroke="white"/>
      </>
    ),
    
    shuffle: (
      <>
        <polyline points="16,3 21,3 21,8"/>
        <line x1="4" y1="20" x2="21" y2="3"/>
        <polyline points="21,16 21,21 16,21"/>
        <line x1="15" y1="15" x2="21" y2="21"/>
        <line x1="4" y1="4" x2="9" y2="9"/>
      </>
    ),
    
    flip: (
      <>
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ),
    
    star: (
      <>
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </>
    ),

    // Action Icons
    share: (
      <>
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
        <polyline points="16,6 12,2 8,6"/>
        <line x1="12" y1="2" x2="12" y2="15"/>
      </>
    ),
    
    delete: (
      <>
        <polyline points="3,6 5,6 21,6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <line x1="10" y1="11" x2="10" y2="17"/>
        <line x1="14" y1="11" x2="14" y2="17"/>
      </>
    ),
    
    save: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7,10 12,15 17,10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </>
    ),
    
    edit: (
      <>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </>
    ),
    
    search: (
      <>
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </>
    ),
    
    plus: (
      <>
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </>
    ),
    
    minus: (
      <>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </>
    ),

    // State Icons
    check: (
      <>
        <polyline points="20,6 9,17 4,12"/>
      </>
    ),
    
    warning: (
      <>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </>
    ),
    
    error: (
      <>
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </>
    ),
    
    info: (
      <>
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </>
    ),
    
    loading: (
      <>
        <line x1="12" y1="2" x2="12" y2="6"/>
        <line x1="12" y1="18" x2="12" y2="22"/>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
        <line x1="2" y1="12" x2="6" y2="12"/>
        <line x1="18" y1="12" x2="22" y2="12"/>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
      </>
    ),

    // Time Icons
    clock: (
      <>
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12,6 12,12 16,14"/>
      </>
    ),

    feather: (
      <>
        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
        <line x1="16" y1="8" x2="2" y2="22"/>
        <line x1="17.5" y1="15" x2="9" y2="15"/>
      </>
    ),
  };

  return (
    <svg
      className={className}
      style={baseStyles}
      viewBox="0 0 24 24"
      {...props}
    >
      {iconPaths[name]}
    </svg>
  );
}

// Convenience icon components for specific categories
export function NavigationIcon(props: Omit<IconProps, 'name'> & { name: 'timer' | 'spreads' | 'journal' | 'settings' | 'close' | 'back' | 'forward' }) {
  return <Icon {...props} />;
}

export function TarotIcon(props: Omit<IconProps, 'name'> & { name: 'card-outline' | 'card-filled' | 'shuffle' | 'flip' | 'star' }) {
  return <Icon {...props} />;
}

export function ActionIcon(props: Omit<IconProps, 'name'> & { name: 'share' | 'delete' | 'save' | 'edit' | 'search' | 'plus' | 'minus' }) {
  return <Icon {...props} />;
}

export function StateIcon(props: Omit<IconProps, 'name'> & { name: 'check' | 'warning' | 'error' | 'info' | 'loading' }) {
  return <Icon {...props} />;
}