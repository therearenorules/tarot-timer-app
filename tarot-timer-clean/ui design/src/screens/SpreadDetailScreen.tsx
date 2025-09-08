import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../utils/colors';
import { typography, spacing } from '../utils/styles';

export default function SpreadDetailScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1f3a', '#4a1a4f', '#1a1f3a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Spread Detail</Text>
          <Text style={styles.subtitle}>Coming Soon...</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    ...typography.displayLarge,
    color: colors.dark.foreground,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
});