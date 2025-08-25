import React, { useMemo, useCallback, memo } from 'react';
import { FlatList, View, StyleSheet, Dimensions } from 'react-native';
import { HourCard } from './HourCard';
import { theme } from '@/constants';
import { type DailyCard } from '@/lib/cardGeneration';

interface VirtualizedHourGridProps {
  currentSession: any;
  getMemoForHour: (hour: number) => string;
  currentHour: number;
  selectedHour: number;
  onHourPress: (hour: number) => void;
}

interface HourItem {
  hour: number;
  id: string;
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 45;
const ITEM_SPACING = 8;
const ITEMS_PER_ROW = Math.floor((width - 32) / (ITEM_WIDTH + ITEM_SPACING));

export const VirtualizedHourGrid = memo<VirtualizedHourGridProps>(({
  currentSession,
  getMemoForHour,
  currentHour,
  selectedHour,
  onHourPress,
}) => {
  // Create stable data array
  const hourData = useMemo<HourItem[]>(() =>
    Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      id: `hour-${i}`,
    })),
    []
  );

  const renderHourItem = useCallback(({ item }: { item: HourItem }) => {
    const { hour } = item;
    const hourCard = currentSession?.cards.find((card: DailyCard) => card.hour === hour);
    const hasMemo = getMemoForHour(hour).length > 0;
    const isCurrentHourCard = hour === currentHour;
    const isSelectedHour = hour === selectedHour;

    return (
      <View style={styles.itemContainer}>
        <HourCard
          hour={hour}
          hourCard={hourCard}
          hasMemo={hasMemo}
          isCurrentHour={isCurrentHourCard}
          isSelected={isSelectedHour}
          onPress={onHourPress}
        />
      </View>
    );
  }, [currentSession?.cards, getMemoForHour, currentHour, selectedHour, onHourPress]);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_WIDTH + ITEM_SPACING,
      offset: (ITEM_WIDTH + ITEM_SPACING) * index,
      index,
    }),
    []
  );

  const keyExtractor = useCallback((item: HourItem) => item.id, []);

  return (
    <FlatList
      data={hourData}
      renderItem={renderHourItem}
      keyExtractor={keyExtractor}
      numColumns={ITEMS_PER_ROW}
      getItemLayout={getItemLayout}
      removeClippedSubviews={true}
      maxToRenderPerBatch={12}
      updateCellsBatchingPeriod={50}
      initialNumToRender={12}
      windowSize={5}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
});

VirtualizedHourGrid.displayName = 'VirtualizedHourGrid';

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.sm,
  },
  itemContainer: {
    width: ITEM_WIDTH + ITEM_SPACING,
    height: ITEM_WIDTH + ITEM_SPACING,
    alignItems: 'center',
    justifyContent: 'center',
  },
});