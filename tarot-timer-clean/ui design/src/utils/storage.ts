import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  DAILY_TAROT_SAVES: 'dailyTarotSaves',
  SAVED_SPREADS: 'savedSpreads',
  USER_SETTINGS: 'userSettings',
  LANGUAGE: 'language',
};

export interface DailyTarotSave {
  id: string;
  date: string;
  hourlyCards: any[];
  memos: { [hour: number]: string };
  insights: string;
  savedAt: string;
}

export interface SavedSpread {
  id: string;
  title: string;
  spreadType: string;
  spreadName: string;
  date: string;
  cards: any[];
  insights: string;
  savedAt: string;
}

// Daily Tarot 관련
export const saveDailyTarot = async (dailyTarotSave: DailyTarotSave): Promise<boolean> => {
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

export const getDailyTarotSaves = async (): Promise<DailyTarotSave[]> => {
  try {
    const saves = await AsyncStorage.getItem(KEYS.DAILY_TAROT_SAVES);
    return saves ? JSON.parse(saves) : [];
  } catch (error) {
    console.error('Error loading daily tarot saves:', error);
    return [];
  }
};

export const getTodaysSave = async (): Promise<DailyTarotSave | null> => {
  try {
    const saves = await getDailyTarotSaves();
    const today = new Date().toDateString();
    return saves.find(save => save.date === today) || null;
  } catch (error) {
    console.error('Error getting today\'s save:', error);
    return null;
  }
};

export const deleteDailyTarotSave = async (saveId: string): Promise<boolean> => {
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
export const saveSpread = async (spreadData: SavedSpread): Promise<boolean> => {
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

export const getSavedSpreads = async (): Promise<SavedSpread[]> => {
  try {
    const spreads = await AsyncStorage.getItem(KEYS.SAVED_SPREADS);
    return spreads ? JSON.parse(spreads) : [];
  } catch (error) {
    console.error('Error loading saved spreads:', error);
    return [];
  }
};

// 설정 관련
export const saveUserSettings = async (settings: any): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(KEYS.USER_SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving user settings:', error);
    return false;
  }
};

export const getUserSettings = async (): Promise<any> => {
  try {
    const settings = await AsyncStorage.getItem(KEYS.USER_SETTINGS);
    return settings ? JSON.parse(settings) : getDefaultSettings();
  } catch (error) {
    console.error('Error loading user settings:', error);
    return getDefaultSettings();
  }
};

const getDefaultSettings = () => ({
  language: 'ko',
  soundEffects: true,
  hapticFeedback: true,
  cardDepth: true,
  mysticalEffects: true,
  cardFlipAnimation: true,
  dailyReminders: true,
  autoSave: true,
  textSize: false,
  highContrast: false,
  voiceReading: false,
  meditationTimer: false,
});

// 언어 설정
export const saveLanguage = async (language: string): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(KEYS.LANGUAGE, language);
    return true;
  } catch (error) {
    console.error('Error saving language:', error);
    return false;
  }
};

export const getLanguage = async (): Promise<string> => {
  try {
    const language = await AsyncStorage.getItem(KEYS.LANGUAGE);
    return language || 'ko';
  } catch (error) {
    console.error('Error loading language:', error);
    return 'ko';
  }
};

// 데이터 export/import
export const exportAllData = async () => {
  try {
    const dailyTarotSaves = await getDailyTarotSaves();
    const savedSpreads = await getSavedSpreads();
    const userSettings = await getUserSettings();
    const language = await getLanguage();

    return {
      dailyTarotSaves,
      savedSpreads,
      userSettings,
      language,
      exportDate: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};

export const importAllData = async (data: any): Promise<boolean> => {
  try {
    if (data.dailyTarotSaves) {
      await AsyncStorage.setItem(KEYS.DAILY_TAROT_SAVES, JSON.stringify(data.dailyTarotSaves));
    }
    if (data.savedSpreads) {
      await AsyncStorage.setItem(KEYS.SAVED_SPREADS, JSON.stringify(data.savedSpreads));
    }
    if (data.userSettings) {
      await AsyncStorage.setItem(KEYS.USER_SETTINGS, JSON.stringify(data.userSettings));
    }
    if (data.language) {
      await AsyncStorage.setItem(KEYS.LANGUAGE, data.language);
    }
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

// 전체 데이터 삭제
export const clearAllData = async (): Promise<boolean> => {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};