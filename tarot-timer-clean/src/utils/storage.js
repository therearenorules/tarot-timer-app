// src/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  DAILY_TAROT_SAVES: 'dailyTarotSaves',
  SAVED_SPREADS: 'savedSpreads',
  USER_SETTINGS: 'userSettings',
  LANGUAGE: 'language',
};

// Daily Tarot 관련
export const saveDailyTarot = async (dailyTarotSave) => {
  try {
    const existingSaves = await getDailyTarotSaves();
    const updatedSaves = [...existingSaves, dailyTarotSave];
    await AsyncStorage.setItem(KEYS.DAILY_TAROT_SAVES, JSON.stringify(updatedSaves));
    return true;
  } catch (error) {
    console.error('Error saving daily tarot:', error);
    return false;
  }
};

export const getDailyTarotSaves = async () => {
  try {
    const saves = await AsyncStorage.getItem(KEYS.DAILY_TAROT_SAVES);
    return saves ? JSON.parse(saves) : [];
  } catch (error) {
    console.error('Error loading daily tarot saves:', error);
    return [];
  }
};

export const getTodaysSave = async () => {
  try {
    const saves = await getDailyTarotSaves();
    const today = new Date().toDateString();
    return saves.find(save => save.date === today) || null;
  } catch (error) {
    console.error('Error getting today\'s save:', error);
    return null;
  }
};

export const deleteDailyTarotSave = async (saveId) => {
  try {
    const saves = await getDailyTarotSaves();
    const filteredSaves = saves.filter(save => save.id !== saveId);
    await AsyncStorage.setItem(KEYS.DAILY_TAROT_SAVES, JSON.stringify(filteredSaves));
    return true;
  } catch (error) {
    console.error('Error deleting daily tarot save:', error);
    return false;
  }
};

// Spread 관련
export const saveSpread = async (spreadData) => {
  try {
    const existingSpreads = await getSavedSpreads();
    const updatedSpreads = [...existingSpreads, spreadData];
    await AsyncStorage.setItem(KEYS.SAVED_SPREADS, JSON.stringify(updatedSpreads));
    return true;
  } catch (error) {
    console.error('Error saving spread:', error);
    return false;
  }
};

export const getSavedSpreads = async () => {
  try {
    const spreads = await AsyncStorage.getItem(KEYS.SAVED_SPREADS);
    return spreads ? JSON.parse(spreads) : [];
  } catch (error) {
    console.error('Error loading saved spreads:', error);
    return [];
  }
};

// 설정 관련
export const saveUserSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(KEYS.USER_SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving user settings:', error);
    return false;
  }
};

export const getUserSettings = async () => {
  try {
    const settings = await AsyncStorage.getItem(KEYS.USER_SETTINGS);
    return settings ? JSON.parse(settings) : getDefaultSettings();
  } catch (error) {
    console.error('Error loading user settings:', error);
    return getDefaultSettings();
  }
};

export const getDefaultSettings = () => ({
  language: 'ko',
  theme: 'dark',
  notifications: true,
  hapticFeedback: true,
  soundEffects: true,
  cardAnimations: true,
  autoSaveSpreads: true,
});

// 언어 설정
export const setLanguage = async (language) => {
  try {
    await AsyncStorage.setItem(KEYS.LANGUAGE, language);
    return true;
  } catch (error) {
    console.error('Error setting language:', error);
    return false;
  }
};

export const getLanguage = async () => {
  try {
    const language = await AsyncStorage.getItem(KEYS.LANGUAGE);
    return language || 'ko';
  } catch (error) {
    console.error('Error getting language:', error);
    return 'ko';
  }
};

// 전체 데이터 삭제
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};

// 데이터 내보내기
export const exportData = async () => {
  try {
    const data = {};
    for (const key of Object.values(KEYS)) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        data[key] = JSON.parse(value);
      }
    }
    return data;
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};

// 데이터 가져오기
export const importData = async (data) => {
  try {
    for (const [key, value] of Object.entries(data)) {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    }
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};