import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  console.log('🚀 CLEAN PROJECT - WELCOME SCREEN LOADED! 🚀');
  console.log('🔮 Clean Tarot Timer - Testing Welcome Implementation');

  const [showWelcome, setShowWelcome] = useState(true);

  if (showWelcome) {
    return (
      <View style={styles.welcomeContainer}>
        <Text style={styles.icon}>🔮</Text>
        <Text style={styles.title}>Tarot Timer</Text>
        <Text style={styles.subtitle}>매 시간마다 새로운 타로 카드로 하루를 시작하세요</Text>
        
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => {
            console.log('🎯 24시간 타로 뽑기 버튼 클릭됨!');
            setShowWelcome(false);
          }}
        >
          <Text style={styles.startButtonText}>24시간 타로 뽑기</Text>
        </TouchableOpacity>
        
        <Text style={styles.quote}>
          "시간은 모든 상처를 치유하며, 모든 진실을 드러낸다"
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainTitle}>✅ 환영 화면에서 메인 앱으로 이동 성공!</Text>
      <Text style={styles.successMessage}>24시간 타로 뽑기 버튼이 정상 작동합니다.</Text>
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => {
          console.log('🔄 환영 화면으로 돌아가기');
          setShowWelcome(true);
        }}
      >
        <Text style={styles.backButtonText}>환영 화면으로 돌아가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
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
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  startButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  quote: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 40,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a90e2',
    textAlign: 'center',
    marginBottom: 20,
  },
  successMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
  },
  backButton: {
    backgroundColor: '#cccccc',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#333333',
    fontSize: 16,
  },
});
