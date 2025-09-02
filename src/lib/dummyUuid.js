// src/lib/dummyUuid.js - UUID 모듈 문제 해결을 위한 더미 파일
// expo-modules-core의 uuid 모듈이 Metro에서 찾을 수 없어 발생하는 문제를 해결하기 위한 파일입니다.
// 실제 uuid 패키지를 사용하여 expo-modules-core와 호환되는 인터페이스를 제공합니다.

import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';

if (__DEV__) {
  console.log('🔧 UUID 모듈 더미 파일 로드됨 (uuid 패키지 사용)');
}

// 네임스페이스 상수 (expo-modules-core와 호환)
const Uuidv5Namespace = {
  DNS: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  URL: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
  OID: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
  X500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
};

// UUID 객체 (expo-modules-core와 호환되는 인터페이스)
const uuid = {
  v4: uuidv4,
  v5: uuidv5,
  namespace: Uuidv5Namespace,
};

export default uuid;
export { uuidv4 as v4, uuidv5 as v5, Uuidv5Namespace as namespace };