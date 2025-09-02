// src/lib/dummyRsc.js - RSC 모듈 문제 해결을 위한 더미 파일
// @expo/metro-runtime의 rsc/runtime 모듈이 누락되어 발생하는 문제를 해결하기 위한 빈 파일입니다.

if (__DEV__) {
  console.log('🔧 RSC 모듈 더미 파일 로드됨 (정상 동작)');
}

// 빈 객체를 export하여 import 오류를 방지
export default {};
export const runtime = {};