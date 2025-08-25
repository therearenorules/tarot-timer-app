/**
 * Time Management Utilities for 24-Hour Tarot System
 */

import { addHours, startOfDay, differenceInMinutes, format } from 'date-fns';

/**
 * Get current hour (0-23)
 */
export const getCurrentHour = (): number => {
  return new Date().getHours();
};

/**
 * Get current minute within the hour (0-59)
 */
export const getCurrentMinute = (): number => {
  return new Date().getMinutes();
};

/**
 * Get time until next hour in minutes
 */
export const getTimeUntilNextHour = (): number => {
  const now = new Date();
  const nextHour = addHours(startOfDay(now), now.getHours() + 1);
  
  // If it's past 23:00, next hour is tomorrow at 00:00
  if (now.getHours() === 23) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return differenceInMinutes(tomorrow, now);
  }
  
  return differenceInMinutes(nextHour, now);
};

/**
 * Format hour for display (12-hour or 24-hour)
 */
export const formatHour = (hour: number, format24h: boolean = false): string => {
  if (format24h) {
    return hour.toString().padStart(2, '0') + ':00';
  }
  
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${period}`;
};

/**
 * Get time display for specific hour
 */
export const getTimeDisplay = (hour: number): string => {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return format(date, 'h:mm a');
};

/**
 * Format time display with custom format
 */
export const formatTimeDisplay = (hour: number): string => {
  return getTimeDisplay(hour);
};

/**
 * Check if it's currently the specified hour
 */
export const isCurrentHour = (hour: number): boolean => {
  return getCurrentHour() === hour;
};

/**
 * Get progress through current hour (0-1)
 */
export const getHourProgress = (): number => {
  const now = new Date();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  return (minutes * 60 + seconds) / 3600; // 3600 seconds in an hour
};

/**
 * Get greeting based on time of day
 */
export const getTimeBasedGreeting = (hour?: number): string => {
  const currentHour = hour ?? getCurrentHour();
  
  if (currentHour >= 5 && currentHour < 12) {
    return 'Good Morning';
  } else if (currentHour >= 12 && currentHour < 17) {
    return 'Good Afternoon';
  } else if (currentHour >= 17 && currentHour < 21) {
    return 'Good Evening';
  } else {
    return 'Good Night';
  }
};

/**
 * Get current date in YYYY-MM-DD format
 */
export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Check if it's a new day compared to last date
 */
export const isNewDay = (lastDate: string): boolean => {
  if (!lastDate) return true;
  return getCurrentDate() !== lastDate;
};

/**
 * Get next midnight date
 */
export const getMidnightDate = (): Date => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setDate(now.getDate() + 1);
  midnight.setHours(0, 0, 0, 0);
  return midnight;
};

/**
 * Get hour range description
 */
export const getHourRangeDescription = (hour: number): string => {
  const ranges = {
    0: 'Midnight Hour - Deep introspection',
    1: 'Late Night - Shadow work',
    2: 'Deep Night - Dream wisdom',
    3: 'Witching Hour - Mystical insights',
    4: 'Pre-dawn - Transformation',
    5: 'Dawn - New beginnings',
    6: 'Early Morning - Fresh perspectives',
    7: 'Morning - Action and energy',
    8: 'Work Begin - Productivity',
    9: 'Mid-morning - Focus and clarity',
    10: 'Active Hour - Achievement',
    11: 'Pre-noon - Preparation',
    12: 'Noon - Peak energy',
    13: 'Early Afternoon - Balance',
    14: 'Mid-afternoon - Creativity',
    15: 'Active Afternoon - Communication',
    16: 'Late Afternoon - Connection',
    17: 'Evening Begin - Reflection',
    18: 'Dinner Hour - Nourishment',
    19: 'Evening - Relationships',
    20: 'Night Begin - Relaxation',
    21: 'Late Evening - Contemplation',
    22: 'Night Time - Rest preparation',
    23: 'Pre-midnight - Day completion'
  };
  
  return ranges[hour as keyof typeof ranges] || `Hour ${hour}`;
};

/**
 * Calculate time since midnight in minutes
 */
export const getMinutesSinceMidnight = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

/**
 * Get percentage of day completed (0-100)
 */
export const getDayProgress = (): number => {
  const minutesSinceMidnight = getMinutesSinceMidnight();
  return Math.round((minutesSinceMidnight / 1440) * 100); // 1440 minutes in a day
};