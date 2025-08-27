import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const updateIsMobile = () => {
      const { width } = Dimensions.get('window');
      setIsMobile(width < MOBILE_BREAKPOINT);
    };

    // 초기 값 설정
    updateIsMobile();

    // 화면 크기 변경 시 업데이트
    const subscription = Dimensions.addEventListener('change', updateIsMobile);

    return () => {
      subscription?.remove();
    };
  }, []);

  return isMobile;
}
