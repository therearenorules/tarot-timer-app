/**
 * 빈 모듈 - 프로덕션 빌드에서 개발 전용 모듈을 대체
 * 번들 크기 최적화를 위해 사용됩니다.
 */

// 빈 함수들
export const initDevMode = () => {};
export const devLog = () => {};
export const performanceUtils = {
  startTimer: () => {},
  endTimer: () => {},
  logRender: () => {},
};

// 빈 컴포넌트들
export const DevWrapper = ({ children }: { children: React.ReactNode }) => children;
export const DevOnlyComponent = () => null;
export const PerformanceMonitor = ({ children }: { children: React.ReactNode }) => children;

// 기본 내보내기
export default {};