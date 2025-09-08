import React, { useState } from 'react';
import { 
  TabBar, 
  Header, 
  ListItem, 
  Modal, 
  CardGrid, 
  NavigationFlow,
  SpreadDetailHeader,
  DailyEntryListItem,
  SpreadEntryListItem,
  SettingsListItem,
  SpreadSelectionGrid,
  AlertModal,
  ConfirmModal,
} from './composite';
import { Text, TitleLarge, BodyLarge } from './base/Text';

/**
 * 🧪 Composite Components Demo
 * 
 * Testing ground for all composite components assembled from base components.
 * This demonstrates that each composite:
 * - Uses only base components and design tokens
 * - Works independently with other composites
 * - Maintains consistent styling and behavior
 * - Supports all variants and configurations
 */

export function CompositeDemo() {
  const [activeTab, setActiveTab] = useState('timer');
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [modalType, setModalType] = useState<'content' | 'alert' | 'confirm'>('content');

  // Sample data for grids and lists
  const sampleSpreads = [
    {
      id: '1',
      name: 'Celtic Cross',
      nameKr: '켈틱 크로스',
      description: '가장 전통적인 10장 스프레드',
      isPremium: false,
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
    },
    {
      id: '2',
      name: 'Three Card',
      nameKr: '3카드 스프레드',
      description: '과거, 현재, 미래',
      isPremium: false,
      imageUrl: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300&h=200&fit=crop',
    },
    {
      id: '3',
      name: 'Love Spread',
      nameKr: '사랑 스프레드',
      description: '연애운과 관계를 위한 스프레드',
      isPremium: true,
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
    },
    {
      id: '4',
      name: 'Career Path',
      nameKr: '진로 스프레드',
      description: '직업과 진로를 위한 가이드',
      isPremium: true,
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
    },
  ];

  const sampleJournalEntries = [
    {
      id: '1',
      title: '2024년 1월 15일',
      subtitle: '켈틱 크로스 리딩',
      description: '새로운 시작에 대한 통찰',
      thumbnailUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      onClick: () => console.log('Journal entry clicked'),
    },
    {
      id: '2',
      title: '2024년 1월 12일',
      subtitle: '3카드 스프레드',
      description: '일주일 운세 확인',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=100&h=100&fit=crop',
      onClick: () => console.log('Journal entry clicked'),
    },
  ];

  const sampleSettings = [
    {
      id: '1',
      title: '알림 설정',
      subtitle: '일일 타로 알림 받기',
      icon: 'settings' as const,
      toggle: { checked: true, onChange: (checked: boolean) => console.log('Toggle:', checked) },
    },
    {
      id: '2',
      title: '언어 설정',
      subtitle: '한국어',
      icon: 'settings' as const,
      onClick: () => console.log('Language settings'),
    },
    {
      id: '3',
      title: '프리미엄 업그레이드',
      subtitle: '모든 스프레드 잠금 해제',
      icon: 'star' as const,
      badge: { text: '프리미엄', variant: 'premium' as const },
      onClick: () => console.log('Premium upgrade'),
    },
  ];

  const openModal = (type: 'content' | 'alert' | 'confirm') => {
    setModalType(type);
    if (type === 'alert') {
      setShowAlert(true);
    } else if (type === 'confirm') {
      setShowConfirm(true);
    } else {
      setShowModal(true);
    }
  };

  return (
    <NavigationFlow
      showMysticalBackground={true}
      showHeader={false}
      showTabBar={false}
    >
      <div style={{
        padding: 'var(--space-l)',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        
        {/* Demo Header */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <TitleLarge semantic="primary" style={{ marginBottom: 'var(--space-s)' }}>
            🎯 Composite Components Demo
          </TitleLarge>
          <BodyLarge semantic="secondary">
            All composite components assembled from base components with design tokens.
          </BodyLarge>
        </div>

        {/* Tab Bar Demo */}
        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <TitleLarge semantic="primary" style={{ marginBottom: 'var(--space-l)' }}>
            📱 Tab Bar Component
          </TitleLarge>
          
          <div style={{
            position: 'relative',
            height: '120px',
            backgroundColor: 'var(--color-surface-elevated)',
            borderRadius: 'var(--radius-medium)',
            marginBottom: 'var(--space-l)',
          }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
              <TabBar 
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>
          </div>
          
          <Text variant="caption" semantic="secondary">
            Current Tab: {activeTab}
          </Text>
        </section>

        {/* Header Demo */}
        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <TitleLarge semantic="primary" style={{ marginBottom: 'var(--space-l)' }}>
            📋 Header Components
          </TitleLarge>
          
          <div style={{ marginBottom: 'var(--space-l)' }}>
            <Text variant="title-medium" semantic="secondary" style={{ marginBottom: 'var(--space-m)' }}>
              Spread Detail Header
            </Text>
            <div style={{
              borderRadius: 'var(--radius-medium)',
              overflow: 'hidden',
              border: '1px solid var(--color-border-default)',
            }}>
              <SpreadDetailHeader
                spreadName="켈틱 크로스"
                onBack={() => console.log('Back pressed')}
                onSave={() => console.log('Save pressed')}
                onShare={() => console.log('Share pressed')}
                progress={65}
              />
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-l)' }}>
            <Text variant="title-medium" semantic="secondary" style={{ marginBottom: 'var(--space-m)' }}>
              Timer Header
            </Text>
            <div style={{
              borderRadius: 'var(--radius-medium)',
              overflow: 'hidden',
              border: '1px solid var(--color-border-default)',
            }}>
              <Header
                content="timer"
                actions={[
                  {
                    icon: 'settings',
                    onClick: () => console.log('Settings'),
                    variant: 'ghost',
                  }
                ]}
              />
            </div>
          </div>
        </section>

        {/* List Items Demo */}
        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <TitleLarge semantic="primary" style={{ marginBottom: 'var(--space-l)' }}>
            📝 List Item Components
          </TitleLarge>
          
          <div style={{
            borderRadius: 'var(--radius-medium)',
            overflow: 'hidden',
            border: '1px solid var(--color-border-default)',
            marginBottom: 'var(--space-l)',
          }}>
            <Text variant="title-medium" semantic="secondary" style={{ 
              padding: 'var(--space-m)',
              borderBottom: '1px solid var(--color-divider)',
            }}>
              Journal Entries
            </Text>
            {sampleJournalEntries.map((entry) => (
              <SpreadEntryListItem
                key={entry.id}
                title={entry.title}
                subtitle={entry.subtitle}
                description={entry.description}
                thumbnailUrl={entry.thumbnailUrl}
                onClick={entry.onClick}
              />
            ))}
          </div>

          <div style={{
            borderRadius: 'var(--radius-medium)',
            overflow: 'hidden',
            border: '1px solid var(--color-border-default)',
            marginBottom: 'var(--space-l)',
          }}>
            <Text variant="title-medium" semantic="secondary" style={{ 
              padding: 'var(--space-m)',
              borderBottom: '1px solid var(--color-divider)',
            }}>
              Settings
            </Text>
            {sampleSettings.map((setting) => (
              <SettingsListItem
                key={setting.id}
                title={setting.title}
                subtitle={setting.subtitle}
                icon={setting.icon}
                badge={setting.badge}
                toggle={setting.toggle}
                onClick={setting.onClick}
              />
            ))}
          </div>
        </section>

        {/* Card Grid Demo */}
        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <TitleLarge semantic="primary" style={{ marginBottom: 'var(--space-l)' }}>
            🎴 Card Grid Components
          </TitleLarge>
          
          <div style={{ marginBottom: 'var(--space-l)' }}>
            <Text variant="title-medium" semantic="secondary" style={{ marginBottom: 'var(--space-m)' }}>
              Spread Selection Grid
            </Text>
            <div style={{
              borderRadius: 'var(--radius-medium)',
              overflow: 'hidden',
              border: '1px solid var(--color-border-default)',
            }}>
              <SpreadSelectionGrid
                spreads={sampleSpreads}
                onSpreadSelect={(spreadId) => console.log('Selected spread:', spreadId)}
              />
            </div>
          </div>
        </section>

        {/* Modal Demo */}
        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <TitleLarge semantic="primary" style={{ marginBottom: 'var(--space-l)' }}>
            🔲 Modal Components
          </TitleLarge>
          
          <div style={{
            display: 'flex',
            gap: 'var(--space-m)',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-l)',
          }}>
            <button
              onClick={() => openModal('content')}
              style={{
                padding: 'var(--space-s) var(--space-m)',
                backgroundColor: 'var(--brand-primary)',
                color: 'var(--brand-white)',
                border: 'none',
                borderRadius: 'var(--radius-medium)',
                cursor: 'pointer',
              }}
            >
              Show Content Modal
            </button>
            
            <button
              onClick={() => openModal('alert')}
              style={{
                padding: 'var(--space-s) var(--space-m)',
                backgroundColor: 'var(--brand-accent)',
                color: 'var(--brand-primary)',
                border: 'none',
                borderRadius: 'var(--radius-medium)',
                cursor: 'pointer',
              }}
            >
              Show Alert Modal
            </button>
            
            <button
              onClick={() => openModal('confirm')}
              style={{
                padding: 'var(--space-s) var(--space-m)',
                backgroundColor: 'var(--color-surface-elevated)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-medium)',
                cursor: 'pointer',
              }}
            >
              Show Confirm Modal
            </button>
          </div>
        </section>

        {/* Success Status */}
        <section style={{
          padding: 'var(--space-l)',
          backgroundColor: 'var(--color-surface-elevated)',
          borderRadius: 'var(--radius-medium)',
          border: '2px solid var(--brand-accent)',
          boxShadow: 'var(--shadow-elevated)',
        }}>
          <TitleLarge semantic="accent" style={{ marginBottom: 'var(--space-s)' }}>
            ✅ Composite Components: COMPLETE
          </TitleLarge>
          <BodyLarge semantic="secondary">
            All composite components successfully assembled from base components.
            Ready for Step 4: Complete Screen Modules.
          </BodyLarge>
        </section>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Content Modal Example"
        subtitle="This is a content modal assembled from base components"
        size="large"
        actions={[
          {
            label: '취소',
            variant: 'ghost',
            onClick: () => setShowModal(false),
          },
          {
            label: '저장',
            variant: 'primary',
            icon: 'save',
            onClick: () => {
              console.log('Saved!');
              setShowModal(false);
            },
          },
        ]}
      >
        <div style={{ padding: 'var(--space-m) 0' }}>
          <Text variant="body-medium" semantic="primary">
            This modal demonstrates how composite components can be assembled
            from base components while maintaining design token consistency.
          </Text>
        </div>
      </Modal>

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title="Alert Example"
        message="This is an alert modal example using composite components."
        onConfirm={() => {
          console.log('Alert confirmed');
          setShowAlert(false);
        }}
      />

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action?"
        confirmLabel="확인"
        cancelLabel="취소"
        variant="premium"
        onConfirm={() => {
          console.log('Confirmed');
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </NavigationFlow>
  );
}