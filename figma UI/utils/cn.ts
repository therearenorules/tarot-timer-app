// 간단한 cn 유틸리티 함수 (클래스 이름 결합)
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};