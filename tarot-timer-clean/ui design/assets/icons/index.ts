/**
 * 타로 타이머 앱 아이콘 에셋 인덱스
 * 
 * 이 폴더에는 앱에서 사용하는 모든 SVG 아이콘들이 포함되어 있습니다.
 * 각 아이콘은 24x24px 기본 크기로 제작되었으며, currentColor를 사용하여
 * 테마에 따른 색상 적용이 가능합니다.
 */

// 네비게이션 아이콘
export { default as ClockIcon } from './clock.svg';
export { default as LayoutIcon } from './layout.svg';
export { default as BookOpenIcon } from './book-open.svg';
export { default as SettingsIcon } from './settings.svg';

// 브랜드 아이콘
export { default as TarotCardsIcon } from './tarot-cards.svg';
export { default as MoonIcon } from './moon.svg';

// 액션 아이콘
export { default as StarIcon } from './star.svg';
export { default as SparklesIcon } from './sparkles.svg';
export { default as ZapIcon } from './zap.svg';
export { default as RotateCcwIcon } from './rotate-ccw.svg';
export { default as SaveIcon } from './save.svg';
export { default as CrownIcon } from './crown.svg';
export { default as ShuffleIcon } from './shuffle.svg';

// 인터페이스 아이콘
export { default as ChevronLeftIcon } from './chevron-left.svg';
export { default as CheckIcon } from './check.svg';
export { default as XIcon } from './x.svg';
export { default as EyeIcon } from './eye.svg';
export { default as CalendarIcon } from './calendar.svg';

// 설정 아이콘
export { default as SunIcon } from './sun.svg';
export { default as GlobeIcon } from './globe.svg';
export { default as Volume2Icon } from './volume2.svg';
export { default as BellIcon } from './bell.svg';
export { default as LockIcon } from './lock.svg';
export { default as ShieldIcon } from './shield.svg';
export { default as HelpCircleIcon } from './help-circle.svg';

/**
 * 아이콘 사용 가이드라인:
 * 
 * 1. 기본 크기: 24x24px (w-6 h-6 클래스 사용)
 * 2. 색상: currentColor 사용으로 부모 요소의 text 색상 상속
 * 3. 스트로크: 일관된 2px 스트로크 위드 사용
 * 4. 접근성: 의미 있는 aria-label 추가 권장
 * 
 * 예시:
 * <ClockIcon className="w-6 h-6 text-premium-gold" />
 */

export const ICON_CATEGORIES = {
  navigation: ['clock', 'layout', 'book-open', 'settings'],
  brand: ['tarot-cards', 'moon'],
  actions: ['star', 'sparkles', 'zap', 'rotate-ccw', 'save', 'crown', 'shuffle'],
  interface: ['chevron-left', 'check', 'x', 'eye', 'calendar'],
  settings: ['sun', 'globe', 'volume2', 'bell', 'lock', 'shield', 'help-circle']
} as const;

export const ICON_NAMES = [
  'clock', 'layout', 'book-open', 'settings', 'tarot-cards', 'moon',
  'star', 'sparkles', 'zap', 'rotate-ccw', 'save', 'crown', 'shuffle',
  'chevron-left', 'check', 'x', 'eye', 'calendar', 'sun', 'globe',
  'volume2', 'bell', 'lock', 'shield', 'help-circle'
] as const;

export type IconName = typeof ICON_NAMES[number];
export type IconCategory = keyof typeof ICON_CATEGORIES;