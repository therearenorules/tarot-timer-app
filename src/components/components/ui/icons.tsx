import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants';

interface IconProps {
  size?: number;
  color?: string;
  style?: any;
}

// Expo Vector Icons를 사용한 아이콘 컴포넌트들
export function Clock({ size = 16, color = theme.colors.text, style }: IconProps) {
  return <Ionicons name="time-outline" size={size} color={color} style={style} />;
}

export function Layout({ size = 16, color = theme.colors.text, style }: IconProps) {
  return <Ionicons name="grid-outline" size={size} color={color} style={style} />;
}

export function BookOpen({ size = 16, color = theme.colors.text, style }: IconProps) {
  return <Ionicons name="book-outline" size={size} color={color} style={style} />;
}

export function Settings({ size = 16, color = theme.colors.text, style }: IconProps) {
  return <Ionicons name="settings-outline" size={size} color={color} style={style} />;
}

export function ChevronLeft({ size = 16, color = theme.colors.text, style }: IconProps) {
  return <Ionicons name="chevron-back" size={size} color={color} style={style} />;
}

export function ChevronRight({ size = 16, color = theme.colors.text, style }: IconProps) {
  return <Ionicons name="chevron-forward" size={size} color={color} style={style} />;
}

export function X({ size = 16, color = theme.colors.text, style }: IconProps) {
  return <Ionicons name="close" size={size} color={color} style={style} />;
}

export function Camera({ size = 16, color = theme.colors.text, style }: IconProps) {
  return <Ionicons name="camera-outline" size={size} color={color} style={style} />;
}

export function RotateCcw({ size = 16, color = theme.colors.text, style }: IconProps) {
  return <Ionicons name="refresh-outline" size={size} color={color} style={style} />;
}

export function Calendar({ size = 16, color = theme.colors.text, style }: IconProps) {
  return <Ionicons name="calendar-outline" size={size} color={color} style={style} />;
}

export function Share2({ size = 16, color = theme.colors.text, style }: IconProps) {
  return <Ionicons name="share-outline" size={size} color={color} style={style} />;
}

export function Trash2({ size = 16, color = theme.colors.text, style }: IconProps) {
  return <Ionicons name="trash-outline" size={size} color={color} style={style} />;
}

export function Download({ size = 16, color = theme.colors.text, style }: IconProps) {
  return <Ionicons name="download-outline" size={size} color={color} style={style} />;
}

export function ZoomIn({ size = 16, color = theme.colors.text, style }: IconProps) {
  return <Ionicons name="search-outline" size={size} color={color} style={style} />;
}

export function Palette({ size = 16, color = theme.colors.text, style }: IconProps) {
  return <Ionicons name="color-palette-outline" size={size} color={color} style={style} />;
}

export function Bell({ size = 16, color = theme.colors.text, style }: IconProps) {
  return <Ionicons name="notifications-outline" size={size} color={color} style={style} />;
}

export function Info({ size = 16, color = theme.colors.text, style }: IconProps) {
  return <Ionicons name="information-circle-outline" size={size} color={color} style={style} />;
}

export function Check({ size = 16, color = theme.colors.text, style }: IconProps) {
  return <Ionicons name="checkmark" size={size} color={color} style={style} />;
}