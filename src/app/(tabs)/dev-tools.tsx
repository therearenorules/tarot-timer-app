/**
 * Development Tools Tab
 * Contains debugging utilities including Extension Filter Dashboard
 */

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Layout, Card, CardHeader, CardContent, Button, Text } from '@/components/ui';
import { ExtensionFilterDashboard } from '@/components/dev/ExtensionFilterDashboard';
import { theme } from '@/constants';

export default function DevToolsScreen() {
  return (
    <Layout
      title="🛠️ Development Tools"
      subtitle="Debug and monitor app functionality"
      gradient={true}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Extension Filter Dashboard */}
        <ExtensionFilterDashboard />
        
      </ScrollView>
    </Layout>
  );
}