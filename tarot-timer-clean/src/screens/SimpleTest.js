import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GradientBackground } from '../components/ui/GradientBackground';

export const SimpleTest = () => {
  return (
    <GradientBackground>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Text style={styles.title}>🔮 Tarot Timer Test 🔮</Text>
        <Text style={styles.subtitle}>앱이 성공적으로 실행되고 있습니다!</Text>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: '#d4af37',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});