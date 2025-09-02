import React from 'react';

interface TimerScreenProps {
  className?: string;
  style?: React.CSSProperties;
}

export function TimerScreenSimple({ className = '', style = {} }: TimerScreenProps) {
  return (
    <div 
      className={className}
      style={{
        height: '100vh',
        padding: '20px',
        backgroundColor: 'var(--color-surface-base)',
        color: 'var(--color-text-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <h1 style={{
        fontSize: 'var(--text-title-large)',
        color: 'var(--brand-accent)',
        marginBottom: '20px',
      }}>
        타로 타이머
      </h1>
      <p style={{
        fontSize: 'var(--text-body-medium)',
        color: 'var(--color-text-secondary)',
        textAlign: 'center',
      }}>
        24시간 타로 타이머가 곧 시작됩니다.
      </p>
    </div>
  );
}