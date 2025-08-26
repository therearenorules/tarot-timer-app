/**
 * Simple App Entry Point - Bypassing Expo Router for testing
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { registerRootComponent } from 'expo';

function SimpleApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔮 타로 타이머</Text>
      <Text style={styles.subtitle}>앱이 성공적으로 실행되었습니다!</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>홈 탭</Text>
        <Text style={styles.cardText}>24시간 타로 카드 시스템</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>스프레드 탭</Text>
        <Text style={styles.cardText}>다양한 카드 배치법</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>다이어리 탭</Text>
        <Text style={styles.cardText}>타로 기록 관리</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>설정 탭</Text>
        <Text style={styles.cardText}>앱 환경설정</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#16213e',
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    borderLeftWidth: 4,
    borderLeftColor: '#0f3460',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: '#cccccc',
  },
});

export default registerRootComponent(SimpleApp);