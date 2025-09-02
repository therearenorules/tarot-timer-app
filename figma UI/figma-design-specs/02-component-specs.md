# 타로 타이머 앱 - 컴포넌트 스펙

## 🔘 버튼 컴포넌트

### Primary Button (주 버튼)
```
• 배경: Deep Purple (#4A1A4F)
• 텍스트: Premium Gold (#D4AF37)
• 패딩: 12px 24px
• 라디우스: 8px
• 폰트: Body Medium / Semibold
• 그림자: Level 2
• 최소 높이: 48px

States:
- Default: 기본 스타일
- Hover: 약간 밝아짐 + scale(1.02)
- Active: 약간 어두워짐 + scale(0.98)
- Disabled: 40% 투명도
- Loading: 스피너 + 텍스트 변경
```

### Premium Button (프리미엄 버튼)
```
• 배경: Premium Gold (#D4AF37)
• 텍스트: Deep Purple (#4A1A4F)
• 패딩: 12px 24px
• 라디우스: 8px
• 폰트: Body Medium / Bold
• 그림자: Mystical Shadow
• 글로우: Gold glow on hover

States:
- Default: 골드 그라데이션
- Hover: 더 밝은 골드 + 글로우 효과
- Active: 약간 어두운 골드
- Disabled: 회색 처리
```

### Secondary Button (보조 버튼)
```
• 배경: 투명
• 테두리: 1px solid Deep Purple (#4A1A4F)
• 텍스트: Deep Purple (#4A1A4F)
• 패딩: 12px 24px
• 라디우스: 8px
• 폰트: Body Medium / Medium

States:
- Default: 기본 스타일
- Hover: 배경 Deep Purple 10%
- Active: 배경 Deep Purple 20%
- Disabled: 40% 투명도
```

### Icon Button (아이콘 버튼)
```
• 크기: 44x44px (최소 터치 타겟)
• 아이콘: 24x24px
• 라디우스: 8px
• 배경: 투명 → hover시 배경색

States:
- Default: 투명 배경
- Hover: 배경 10% 투명도
- Active: 배경 20% 투명도
- Selected: Premium Gold 배경
```

## 🎴 카드 컴포넌트

### Tarot Card (타로 카드)
```
• 비율: 2:3 (width:height)
• 라디우스: 8px
• 테두리: 2px solid Gold 30%
• 그림자: Level 1 → Level 2 on hover
• 백드롭: 블러 효과

Sizes:
- Thumbnail: 50x75px
- Small: 70x105px
- Medium: 90x135px
- Large: 120x180px
- Display: 200x300px

States:
- Empty: 점선 테두리 + 카드 번호
- Face Down: 카드 뒷면 패턴
- Revealed: 카드 이미지 + 골드 테두리
- Selected: 골드 링 + 글로우 효과
- Loading: 스피너 애니메이션
```

### Card Container (카드 컨테이너)
```
• 배경: 흰색 10% + 백드롭 블러
• 테두리: 1px solid 흰색 20%
• 라디우스: 16px
• 패딩: 24px
• 그림자: Level 2

States:
- Default: 기본 스타일
- Hover: 약간 상승 효과
- Active: 약간 눌림 효과
```

## 🏷️ 뱃지 컴포넌트

### Premium Badge (프리미엄 뱃지)
```
• 배경: Premium Gold (#D4AF37)
• 텍스트: Deep Purple (#4A1A4F)
• 패딩: 4px 8px
• 라디우스: 4px
• 폰트: Caption / Bold
• 아이콘: 크라운 (16x16px)
• 텍스트: "프리미엄" / "Premium"
```

### Status Badge (상태 뱃지)
```
Success:
• 배경: 성공 색상
• 텍스트: 흰색
• 텍스트: "저장됨" / "Saved"

Warning:
• 배경: 경고 색상
• 텍스트: 검은색
• 텍스트: "주의" / "Warning"

Info:
• 배경: 정보 색상
• 텍스트: 흰색
• 텍스트: "정보" / "Info"
```

### Time Badge (시간 뱃지)
```
• 배경: Premium Gold 20%
• 텍스트: Premium Gold
• 테두리: 1px solid Premium Gold 30%
• 패딩: 4px 8px
• 라디우스: 6px
• 폰트: Caption / Medium
• 텍스트: "오전 9시" / "9 AM"
```

## 📱 네비게이션 컴포넌트

### Bottom Tab Bar (하단 탭 바)
```
• 높이: 80px
• 배경: Midnight Blue 95% + 백드롭 블러
• 상단 테두리: 1px solid Premium Gold 20%
• 그라데이션 오버레이: 골드 5%

Tab Item:
• 크기: 전체 너비 / 4
• 패딩: 16px 12px
• 아이콘: 24x24px
• 라벨: Caption / Medium

States:
- Inactive: 흰색 60% + 작은 크기
- Active: Premium Gold + 큰 크기 + 글로우
- Hover: 흰색 80%
```

### Header Bar (헤더 바)
```
• 높이: 56px
• 배경: 투명 → 스크롤시 블러 배경
• 하단 테두리: 1px solid 구분선 (스크롤시만)
• 패딩: 0 16px

요소:
- 뒤로가기 버튼: 44x44px
- 제목: Title Medium / Semibold
- 액션 버튼: 44x44px (최대 2개)
```

## 📝 입력 컴포넌트

### Text Input (텍스트 입력)
```
• 높이: 48px
• 패딩: 12px 16px
• 라디우스: 8px
• 배경: 흰색 10% + 백드롭 블러
• 테두리: 1px solid 흰색 20%
• 플레이스홀더: 흰색 50%
• 텍스트: 흰색

States:
- Default: 기본 스타일
- Focus: 골드 테두리 + 글로우
- Error: 빨간 테두리
- Disabled: 50% 투명도
```

### Textarea (텍스트 영역)
```
• 최소 높이: 120px
• 패딩: 16px
• 라디우스: 8px
• 리사이즈: 세로만 허용
• 스크롤바: 커스텀 스타일

States:
- Default: 기본 스타일  
- Focus: 골드 테두리 + 글로우
- Error: 빨간 테두리
```

### Switch (스위치)
```
• 크기: 44x24px
• 트랙 라디우스: 12px
• 썸 크기: 20x20px
• 썸 라디우스: 10px

States:
- Off: 회색 트랙 + 흰색 썸
- On: 골드 트랙 + 흰색 썸
- Disabled: 50% 투명도
```

## 📋 리스트 컴포넌트

### List Item (리스트 아이템)
```
• 높이: 최소 56px
• 패딩: 16px
• 배경: 투명
• 하단 구분선: 1px solid 구분선 색상

구조:
- 아이콘 영역: 24x24px (선택사항)
- 메인 콘텐츠: 제목 + 설명
- 액션 영역: 버튼 또는 화살표

States:
- Default: 기본 스타일
- Hover: 배경 10% 투명도
- Active: 배경 20% 투명도
- Selected: 골드 테두리 + 배경
```

### Card List Item (카드 리스트 아이템)
```
• 배경: 흰색 5%
• 테두리: 1px solid 흰색 10%
• 라디우스: 12px
• 패딩: 16px
• 마진: 8px 0
• 그림자: Level 1

States:
- Default: 기본 스타일
- Hover: 상승 효과 + 골드 테두리
- Active: 약간 눌림 효과
```

## 🗂️ 모달 컴포넌트

### Dialog Modal (다이얼로그 모달)
```
• 오버레이: 검은색 40%
• 배경: Midnight Blue 95% + 백드롭 블러
• 테두리: 1px solid Premium Gold 30%
• 라디우스: 16px
• 최대 너비: 400px
• 패딩: 24px
• 그림자: Level 4

애니메이션:
- 입장: 아래에서 위로 슬라이드 + 페이드 인
- 퇴장: 위에서 아래로 슬라이드 + 페이드 아웃
- 지속시간: 300ms
```

### Bottom Sheet (바텀 시트)
```
• 배경: 카드와 동일
• 상단 핸들: 4x32px 라운드
• 최대 높이: 80vh
• 패딩: 24px

애니메이션:
- 입장: 아래에서 위로 슬라이드
- 퇴장: 위에서 아래로 슬라이드
- 지속시간: 300ms
```

## 📊 데이터 표시 컴포넌트

### Progress Bar (진행 바)
```
• 높이: 4px
• 라디우스: 2px
• 배경: 흰색 20%
• 진행: Premium Gold
• 그림자: 골드 글로우

States:
- Default: 정적 진행
- Animated: 부드러운 전환
- Indeterminate: 무한 로딩
```

### Loading Spinner (로딩 스피너)
```
• 크기: 24x24px (기본)
• 색상: Premium Gold
• 애니메이션: 회전 + 페이드
• 지속시간: 1초

Variants:
- Small: 16x16px
- Medium: 24x24px
- Large: 32x32px
```

## 🎨 특별 컴포넌트

### Mystical Background (신비로운 배경)
```
• 기본 그라데이션: 135도 방향
• 색상: Midnight Blue → Deep Purple → Midnight Blue
• 애니메이션 점들: 다양한 크기와 깜빡임
• 백그라운드 펄스: 미묘한 골드 빛

효과:
- 작은 점들: 1-2px, 무작위 위치
- 애니메이션: 핑/펄스 효과
- 딜레이: 500ms-3000ms 무작위
```

### Sacred Geometry Pattern (성스러운 기하학 패턴)
```
• 색상: Premium Gold 10%
• 크기: 1px 라인
• 패턴: 십자가, 원형, 삼각형
• 위치: 절대 위치, 배경 레이어
• 애니메이션: 미묘한 페이드 인/아웃
```

### Card Spread Layout (카드 스프레드 레이아웃)
```
Celtic Cross:
• 전체 크기: 350x350px
• 중앙 십자: 5장 배치
• 오른쪽 스태프: 4장 세로 배치
• 가이드라인: 골드 1px 라인

Three Card:
• 전체 너비: 300px
• 카드 간격: 20px
• 중앙 정렬
• 라벨: 하단 12px 여백

AB Choice:
• 전체 너비: 320px
• A/B 그룹: 각 3장
• 중앙 조언: 1장
• 그룹 영역: 점선 테두리

Relationship:
• 전체 크기: 280x350px
• 11장 복잡 배치
• 컵 모양 형태
• 연결선: 골드 라인
```

## 🔍 상태 시스템

### Empty States (빈 상태)
```
• 아이콘: 48x48px, 중앙 정렬
• 제목: Title Small / Semibold
• 설명: Body Medium / Regular
• 액션 버튼: Primary 또는 Secondary
• 색상: 흰색 50% (아이콘), 흰색 (텍스트)
```

### Error States (오류 상태)
```
• 아이콘: 경고 또는 오류 아이콘
• 색상: 오류 색상 시스템
• 재시도 버튼: Secondary 스타일
• 메시지: 명확하고 도움이 되는 텍스트
```

### Loading States (로딩 상태)
```
• 스켈레톤: 회색 배경 + 펄스 애니메이션
• 스피너: 골드 색상 + 회전 애니메이션
• 진행 바: 골드 색상 + 부드러운 전환
• 오버레이: 반투명 배경 + 중앙 스피너
```

## 📐 레이아웃 시스템

### Grid System (그리드 시스템)
```
• 기본 단위: 8px
• 컨테이너 최대 너비: 375px
• 사이드 마진: 16px
• 콘텐츠 영역: 343px

Grid Types:
- 1열: 전체 너비
- 2열: 50% / 50% (8px 갭)
- 3열: 33.33% / 33.33% / 33.33% (8px 갭)
- 4열: 25% / 25% / 25% / 25% (4px 갭)
```

### Safe Area (안전 영역)
```
• 상단: 상태바 + 노치 고려
• 하단: 홈 인디케이터 + 네비게이션
• 좌우: 16px 최소 마진
• 컨텐츠: 안전 영역 내 배치
```

이 스펙을 기반으로 Figma에서 각 컴포넌트를 정확히 구현할 수 있습니다!