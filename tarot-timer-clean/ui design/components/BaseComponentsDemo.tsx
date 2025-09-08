import React, { useState } from 'react';
import { Card, CardSmall, CardMedium, CardLarge, CardEmpty, CardTextOnly } from './base/Card';
import { Button, ButtonPrimary, ButtonSecondary, ButtonPremium, ButtonGhost, ButtonIcon } from './base/Button';
import { Icon, NavigationIcon, TarotIcon, ActionIcon, StateIcon } from './base/Icon';
import { Text, DisplayLarge, TitleLarge, TitleMedium, BodyLarge, BodyMedium, Caption, PremiumText, MysticalText } from './base/Text';
import { Badge, BadgePremium, BadgeNotification, BadgeStatus, BadgeInfo, BadgeOutline } from './base/Badge';

/**
 * 🧪 Base Components Demo
 * 
 * Testing ground for all independent base components.
 * This demonstrates that each component:
 * - Uses only design tokens
 * - Works independently
 * - Supports light/dark mode
 * - Has no external dependencies
 */

export function BaseComponentsDemo() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLoadingTest = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: 'var(--space-l)',
      backgroundColor: 'var(--color-surface-base)',
      background: 'linear-gradient(135deg, #1a1f3a 0%, #4a1a4f 50%, #1a1f3a 100%)',
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: 'var(--space-xl)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-l)',
        }}>
          <DisplayLarge semantic="primary">
            🎨 Independent Base Components
          </DisplayLarge>
          <Button variant="premium" onClick={toggleDarkMode}>
            <Icon name={darkMode ? 'star' : 'star'} color="currentColor" />
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
        
        <BodyLarge semantic="secondary">
          Complete collection of independent base components using only design tokens.
        </BodyLarge>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gap: 'var(--space-xl)',
      }}>
        
        {/* Card Components */}
        <section>
          <TitleLarge semantic="primary" style={{ marginBottom: 'var(--space-l)' }}>
            🎴 Card Components
          </TitleLarge>
          
          {/* Size Variants */}
          <div style={{ marginBottom: 'var(--space-l)' }}>
            <TitleMedium semantic="secondary" style={{ marginBottom: 'var(--space-m)' }}>
              Size Variants
            </TitleMedium>
            <div style={{
              display: 'flex',
              gap: 'var(--space-m)',
              flexWrap: 'wrap',
            }}>
              <CardSmall title="Small Card" description="120×160px" />
              <CardMedium title="Medium Card" description="160×240px" />
              <CardLarge title="Large Card" description="200×300px" />
            </div>
          </div>

          {/* State Variants */}
          <div style={{ marginBottom: 'var(--space-l)' }}>
            <TitleMedium semantic="secondary" style={{ marginBottom: 'var(--space-m)' }}>
              State Variants
            </TitleMedium>
            <div style={{
              display: 'flex',
              gap: 'var(--space-m)',
              flexWrap: 'wrap',
            }}>
              <Card state="default" title="Default" description="Normal state" />
              <Card state="selected" title="Selected" description="Gold border" />
              <Card state="disabled" title="Disabled" description="40% opacity" />
              <Card state="loading" title="Loading" description="With spinner" />
            </div>
          </div>

          {/* Content Variants */}
          <div style={{ marginBottom: 'var(--space-l)' }}>
            <TitleMedium semantic="secondary" style={{ marginBottom: 'var(--space-m)' }}>
              Content Variants
            </TitleMedium>
            <div style={{
              display: 'flex',
              gap: 'var(--space-m)',
              flexWrap: 'wrap',
            }}>
              <CardEmpty emptyText="탭하여 카드 뽑기" />
              <CardTextOnly title="Text Only" description="Pure text content" />
              <Card 
                content="filled" 
                title="Filled Card"
                description="With image placeholder"
                imageUrl="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=300&fit=crop"
              />
            </div>
          </div>
        </section>

        {/* Button Components */}
        <section>
          <TitleLarge semantic="primary" style={{ marginBottom: 'var(--space-l)' }}>
            🔘 Button Components
          </TitleLarge>
          
          {/* Type Variants */}
          <div style={{ marginBottom: 'var(--space-l)' }}>
            <TitleMedium semantic="secondary" style={{ marginBottom: 'var(--space-m)' }}>
              Type Variants
            </TitleMedium>
            <div style={{
              display: 'flex',
              gap: 'var(--space-m)',
              flexWrap: 'wrap',
            }}>
              <ButtonPrimary>Primary Button</ButtonPrimary>
              <ButtonSecondary>Secondary Button</ButtonSecondary>
              <ButtonPremium>Premium Button</ButtonPremium>
              <ButtonGhost>Ghost Button</ButtonGhost>
            </div>
          </div>

          {/* Size Variants */}
          <div style={{ marginBottom: 'var(--space-l)' }}>
            <TitleMedium semantic="secondary" style={{ marginBottom: 'var(--space-m)' }}>
              Size Variants
            </TitleMedium>
            <div style={{
              display: 'flex',
              gap: 'var(--space-m)',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
              <Button size="small" variant="primary">Small</Button>
              <Button size="medium" variant="primary">Medium</Button>
              <Button size="large" variant="primary">Large</Button>
            </div>
          </div>

          {/* Icon Variants */}
          <div style={{ marginBottom: 'var(--space-l)' }}>
            <TitleMedium semantic="secondary" style={{ marginBottom: 'var(--space-m)' }}>
              Icon Variants
            </TitleMedium>
            <div style={{
              display: 'flex',
              gap: 'var(--space-m)',
              flexWrap: 'wrap',
            }}>
              <Button iconVariant="leading-icon" icon={<Icon name="star" />}>
                Leading Icon
              </Button>
              <Button iconVariant="trailing-icon" icon={<Icon name="forward" />}>
                Trailing Icon
              </Button>
              <ButtonIcon icon={<Icon name="settings" />} />
            </div>
          </div>

          {/* State Variants */}
          <div style={{ marginBottom: 'var(--space-l)' }}>
            <TitleMedium semantic="secondary" style={{ marginBottom: 'var(--space-m)' }}>
              State Variants
            </TitleMedium>
            <div style={{
              display: 'flex',
              gap: 'var(--space-m)',
              flexWrap: 'wrap',
            }}>
              <Button onClick={handleLoadingTest}>Normal</Button>
              <Button disabled>Disabled</Button>
              <Button loading={loading}>
                {loading ? 'Loading...' : 'Click to Load'}
              </Button>
            </div>
          </div>
        </section>

        {/* Icon Components */}
        <section>
          <TitleLarge semantic="primary" style={{ marginBottom: 'var(--space-l)' }}>
            🎨 Icon Components
          </TitleLarge>
          
          {/* Navigation Icons */}
          <div style={{ marginBottom: 'var(--space-l)' }}>
            <TitleMedium semantic="secondary" style={{ marginBottom: 'var(--space-m)' }}>
              Navigation Icons
            </TitleMedium>
            <div style={{
              display: 'flex',
              gap: 'var(--space-m)',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
              <NavigationIcon name="timer" />
              <NavigationIcon name="spreads" />
              <NavigationIcon name="journal" />
              <NavigationIcon name="settings" />
              <NavigationIcon name="back" />
              <NavigationIcon name="forward" />
              <NavigationIcon name="close" />
            </div>
          </div>

          {/* Tarot Icons */}
          <div style={{ marginBottom: 'var(--space-l)' }}>
            <TitleMedium semantic="secondary" style={{ marginBottom: 'var(--space-m)' }}>
              Tarot Icons
            </TitleMedium>
            <div style={{
              display: 'flex',
              gap: 'var(--space-m)',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
              <TarotIcon name="card-outline" />
              <TarotIcon name="card-filled" />
              <TarotIcon name="shuffle" />
              <TarotIcon name="flip" />
              <TarotIcon name="star" color="var(--brand-accent)" />
            </div>
          </div>

          {/* Action Icons */}
          <div style={{ marginBottom: 'var(--space-l)' }}>
            <TitleMedium semantic="secondary" style={{ marginBottom: 'var(--space-m)' }}>
              Action Icons
            </TitleMedium>
            <div style={{
              display: 'flex',
              gap: 'var(--space-m)',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
              <ActionIcon name="share" />
              <ActionIcon name="delete" />
              <ActionIcon name="save" />
              <ActionIcon name="edit" />
              <ActionIcon name="search" />
              <ActionIcon name="plus" />
              <ActionIcon name="minus" />
            </div>
          </div>

          {/* State Icons */}
          <div style={{ marginBottom: 'var(--space-l)' }}>
            <TitleMedium semantic="secondary" style={{ marginBottom: 'var(--space-m)' }}>
              State Icons
            </TitleMedium>
            <div style={{
              display: 'flex',
              gap: 'var(--space-m)',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
              <StateIcon name="check" color="var(--state-success)" />
              <StateIcon name="warning" color="var(--state-warning)" />
              <StateIcon name="error" color="var(--state-error)" />
              <StateIcon name="info" color="var(--state-info)" />
              <StateIcon name="loading" />
            </div>
          </div>
        </section>

        {/* Text Components */}
        <section>
          <TitleLarge semantic="primary" style={{ marginBottom: 'var(--space-l)' }}>
            📝 Text Components
          </TitleLarge>
          
          <div style={{ marginBottom: 'var(--space-l)' }}>
            <DisplayLarge semantic="primary">Display Large - Hero Text</DisplayLarge>
            <Caption semantic="tertiary">32px / Semibold / 1.2 line-height</Caption>
          </div>

          <div style={{ marginBottom: 'var(--space-m)' }}>
            <TitleLarge semantic="primary">Title Large - Page Headers</TitleLarge>
            <Caption semantic="tertiary">24px / Semibold / 1.3 line-height</Caption>
          </div>

          <div style={{ marginBottom: 'var(--space-m)' }}>
            <TitleMedium semantic="primary">Title Medium - Section Headers</TitleMedium>
            <Caption semantic="tertiary">20px / Medium / 1.3 line-height</Caption>
          </div>

          <div style={{ marginBottom: 'var(--space-m)' }}>
            <BodyLarge semantic="primary">Body Large - Important content and descriptions</BodyLarge>
            <Caption semantic="tertiary">16px / Regular / 1.5 line-height</Caption>
          </div>

          <div style={{ marginBottom: 'var(--space-m)' }}>
            <BodyMedium semantic="primary">Body Medium - Standard body text for most content</BodyMedium>
            <Caption semantic="tertiary">14px / Regular / 1.5 line-height</Caption>
          </div>

          <div style={{ marginBottom: 'var(--space-l)' }}>
            <div style={{
              display: 'flex',
              gap: 'var(--space-m)',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
              <PremiumText variant="body-large">Premium Text</PremiumText>
              <MysticalText variant="body-large">Mystical Text</MysticalText>
              <Text variant="overline" semantic="accent">OVERLINE TEXT</Text>
            </div>
          </div>
        </section>

        {/* Badge Components */}
        <section>
          <TitleLarge semantic="primary" style={{ marginBottom: 'var(--space-l)' }}>
            🏷️ Badge Components
          </TitleLarge>
          
          {/* Type Variants */}
          <div style={{ marginBottom: 'var(--space-l)' }}>
            <TitleMedium semantic="secondary" style={{ marginBottom: 'var(--space-m)' }}>
              Type Variants
            </TitleMedium>
            <div style={{
              display: 'flex',
              gap: 'var(--space-m)',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
              <BadgePremium>프리미엄</BadgePremium>
              <BadgeNotification>3</BadgeNotification>
              <BadgeStatus>완료</BadgeStatus>
              <BadgeInfo>정보</BadgeInfo>
              <BadgeOutline>아웃라인</BadgeOutline>
            </div>
          </div>

          {/* Size Variants */}
          <div style={{ marginBottom: 'var(--space-l)' }}>
            <TitleMedium semantic="secondary" style={{ marginBottom: 'var(--space-m)' }}>
              Size Variants
            </TitleMedium>
            <div style={{
              display: 'flex',
              gap: 'var(--space-m)',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
              <Badge size="small" variant="premium">Small</Badge>
              <Badge size="medium" variant="premium">Medium</Badge>
            </div>
          </div>
        </section>

        {/* Status */}
        <section style={{
          padding: 'var(--space-l)',
          backgroundColor: 'var(--color-surface-elevated)',
          borderRadius: 'var(--radius-medium)',
          border: '2px solid var(--brand-accent)',
          boxShadow: 'var(--shadow-elevated)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-m)',
          }}>
            <Icon name="check" color="var(--state-success)" size={32} />
            <div>
              <TitleMedium semantic="accent">
                ✅ Independent Base Components: COMPLETE
              </TitleMedium>
              <BodyMedium semantic="secondary">
                All components use design tokens exclusively and work independently.
                Ready for Step 3: Composite Components.
              </BodyMedium>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}