import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export function Clock({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <polyline points="12,6 12,12 16,14" strokeWidth="2" />
    </svg>
  );
}

export function Layout({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
      <line x1="9" y1="9" x2="15" y2="9" strokeWidth="2" />
      <line x1="9" y1="15" x2="15" y2="15" strokeWidth="2" />
    </svg>
  );
}

export function BookOpen({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" strokeWidth="2" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" strokeWidth="2" />
    </svg>
  );
}

export function Settings({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" strokeWidth="2" />
    </svg>
  );
}

export function ChevronLeft({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <polyline points="15,18 9,12 15,6" strokeWidth="2" />
    </svg>
  );
}

export function Star({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" strokeWidth="2" />
    </svg>
  );
}

export function Moon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeWidth="2" />
    </svg>
  );
}

export function Sparkles({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" strokeWidth="2" />
      <path d="M20 3v4" strokeWidth="2" />
      <path d="M22 5h-4" strokeWidth="2" />
      <path d="M4 17v2" strokeWidth="2" />
      <path d="M5 18H3" strokeWidth="2" />
    </svg>
  );
}

export function Zap({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" strokeWidth="2" />
    </svg>
  );
}

export function RotateCcw({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <polyline points="1,4 1,10 7,10" strokeWidth="2" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" strokeWidth="2" />
    </svg>
  );
}

export function Save({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" strokeWidth="2" />
      <polyline points="17,21 17,13 7,13 7,21" strokeWidth="2" />
      <polyline points="7,3 7,8 15,8" strokeWidth="2" />
    </svg>
  );
}

export function Crown({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path d="M2 19h20l-2-8-6 2-2-8-2 8-6-2z" strokeWidth="2" />
    </svg>
  );
}

export function Calendar({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
      <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
      <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
      <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
    </svg>
  );
}

export function Sun({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="5" strokeWidth="2" />
      <line x1="12" y1="1" x2="12" y2="3" strokeWidth="2" />
      <line x1="12" y1="21" x2="12" y2="23" strokeWidth="2" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeWidth="2" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeWidth="2" />
      <line x1="1" y1="12" x2="3" y2="12" strokeWidth="2" />
      <line x1="21" y1="12" x2="23" y2="12" strokeWidth="2" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeWidth="2" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeWidth="2" />
    </svg>
  );
}

export function Globe({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <line x1="2" y1="12" x2="22" y2="12" strokeWidth="2" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeWidth="2" />
    </svg>
  );
}

export function Volume2({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" strokeWidth="2" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" strokeWidth="2" />
    </svg>
  );
}

export function Bell({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeWidth="2" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeWidth="2" />
    </svg>
  );
}

export function Lock({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2" />
      <circle cx="12" cy="16" r="1" strokeWidth="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2" />
    </svg>
  );
}

export function Shield({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" />
    </svg>
  );
}

export function HelpCircle({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeWidth="2" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" />
    </svg>
  );
}

export function Check({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <polyline points="20,6 9,17 4,12" strokeWidth="2" />
    </svg>
  );
}

export function X({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" />
      <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
    </svg>
  );
}

export function Eye({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
    </svg>
  );
}

export function Shuffle({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <polyline points="16,3 21,3 21,8" strokeWidth="2" />
      <line x1="4" y1="20" x2="21" y2="3" strokeWidth="2" />
      <polyline points="21,16 21,21 16,21" strokeWidth="2" />
      <line x1="15" y1="15" x2="21" y2="21" strokeWidth="2" />
      <line x1="4" y1="4" x2="9" y2="9" strokeWidth="2" />
    </svg>
  );
}