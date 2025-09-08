/**
 * 타로 카드 이미지 매핑 시스템
 * 
 * 24시간 타로 시스템과 실제 타로 카드 이미지를 연결합니다.
 */

// 시간대별 타로 카드 이미지 매핑
export const HOUR_CARD_IMAGES = {
  0: require('../../assets/tarot-cards/classic-tarot/major_00_fool.jpg'),
  1: require('../../assets/tarot-cards/classic-tarot/major_01_magician.jpg'),
  2: require('../../assets/tarot-cards/classic-tarot/major_02_high_priestess.jpg'),
  3: require('../../assets/tarot-cards/classic-tarot/major_03_empress.jpg'),
  4: require('../../assets/tarot-cards/classic-tarot/major_04_emperor.jpg'),
  5: require('../../assets/tarot-cards/classic-tarot/major_05_hierophant.jpg'),
  6: require('../../assets/tarot-cards/classic-tarot/major_06_lovers.jpg'),
  7: require('../../assets/tarot-cards/classic-tarot/major_07_chariot.jpg'),
  8: require('../../assets/tarot-cards/classic-tarot/major_08_strength.jpg'),
  9: require('../../assets/tarot-cards/classic-tarot/major_09_hermit.jpg'),
  10: require('../../assets/tarot-cards/classic-tarot/major_10_wheel_of_fortune.jpg'),
  11: require('../../assets/tarot-cards/classic-tarot/major_11_justice.jpg'),
  12: require('../../assets/tarot-cards/classic-tarot/major_12_hanged_man.jpg'),
  13: require('../../assets/tarot-cards/classic-tarot/major_13_death.jpg'),
  14: require('../../assets/tarot-cards/classic-tarot/major_14_temperance.jpg'),
  15: require('../../assets/tarot-cards/classic-tarot/major_15_devil.jpg'),
  16: require('../../assets/tarot-cards/classic-tarot/major_16_tower.jpg'),
  17: require('../../assets/tarot-cards/classic-tarot/major_17_star.jpg'),
  18: require('../../assets/tarot-cards/classic-tarot/major_18_moon.jpg'),
  19: require('../../assets/tarot-cards/classic-tarot/major_19_sun.jpg'),
  20: require('../../assets/tarot-cards/classic-tarot/major_20_judgement.jpg'),
  21: require('../../assets/tarot-cards/classic-tarot/major_21_world.jpg'),
  22: require('../../assets/tarot-cards/classic-tarot/major_00_fool.jpg'), // 22시는 다시 바보 카드
  23: require('../../assets/tarot-cards/classic-tarot/major_01_magician.jpg'), // 23시는 다시 마법사 카드
};

// 카드 뒷면 이미지
export const CARD_BACK_IMAGE = require('../../assets/images/tarot-card-back.svg');

// 플레이스홀더 이미지
export const CARD_PLACEHOLDER_IMAGE = require('../../assets/images/card-placeholder.svg');

/**
 * 현재 시간에 해당하는 타로 카드 이미지를 가져옵니다.
 * @returns {string} 타로 카드 이미지 경로
 */
export const getCurrentHourCardImage = () => {
  const hour = new Date().getHours();
  return HOUR_CARD_IMAGES[hour] || CARD_PLACEHOLDER_IMAGE;
};

/**
 * 특정 시간의 타로 카드 이미지를 가져옵니다.
 * @param {number} hour - 시간 (0-23)
 * @returns {string} 타로 카드 이미지 경로
 */
export const getHourCardImage = (hour) => {
  return HOUR_CARD_IMAGES[hour] || CARD_PLACEHOLDER_IMAGE;
};

/**
 * 타로 카드 정보와 이미지를 함께 가져옵니다.
 * @param {Object} cardData - 타로 카드 데이터
 * @returns {Object} 카드 데이터와 이미지가 포함된 객체
 */
export const getCardWithImage = (cardData) => {
  const hour = new Date().getHours();
  return {
    ...cardData,
    image: getHourCardImage(hour),
    backImage: CARD_BACK_IMAGE,
    placeholderImage: CARD_PLACEHOLDER_IMAGE
  };
};

/**
 * 모든 타로 카드 이미지 목록을 가져옵니다.
 * @returns {Array} 모든 카드 이미지 경로 배열
 */
export const getAllCardImages = () => {
  return Object.values(HOUR_CARD_IMAGES);
};

/**
 * 랜덤 타로 카드 이미지를 가져옵니다.
 * @returns {string} 랜덤 타로 카드 이미지 경로
 */
export const getRandomCardImage = () => {
  const hours = Object.keys(HOUR_CARD_IMAGES);
  const randomHour = hours[Math.floor(Math.random() * hours.length)];
  return HOUR_CARD_IMAGES[randomHour];
};