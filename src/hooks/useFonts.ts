/**
 * Custom Hook for Font Loading
 * Phase 4: 네이티브 최적화 - Noto Sans KR 폰트 시스템
 */

import { useFonts as useExpoFonts } from 'expo-font';
import {
  NotoSansKR_300Light,
  NotoSansKR_400Regular,
  NotoSansKR_500Medium,
  NotoSansKR_600SemiBold,
  NotoSansKR_700Bold,
} from '@expo-google-fonts/noto-sans-kr';

export const useFonts = () => {
  const [fontsLoaded, fontError] = useExpoFonts({
    // Noto Sans KR 폰트 패밀리
    'NotoSansKR-Light': NotoSansKR_300Light,
    'NotoSansKR-Regular': NotoSansKR_400Regular,
    'NotoSansKR-Medium': NotoSansKR_500Medium,
    'NotoSansKR-SemiBold': NotoSansKR_600SemiBold,
    'NotoSansKR-Bold': NotoSansKR_700Bold,
  });

  return {
    fontsLoaded,
    fontError,
    isReady: fontsLoaded && !fontError,
  };
};

export default useFonts;