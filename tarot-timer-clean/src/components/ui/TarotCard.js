import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  interpolate,
  withRepeat,
  Easing 
} from 'react-native-reanimated';
import { colors, gradients } from '../../utils/colors';
import { typography, spacing, borderRadius, shadows, dimensions } from '../../utils/styles';
import { cardSelectFeedback, cardFlipFeedback } from '../../utils/haptics';
import { CARD_BACK_IMAGE, CARD_PLACEHOLDER_IMAGE, getCurrentHourCardImage } from '../../utils/cardImages';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const TarotCard = ({ 
  cardName = '카드 이름',
  cardMeaning = '카드 의미',
  cardImage = null,
  isFlipped = false,
  onPress,
  style = {},
  size = 'medium',
  showImage = false
}) => {
  const rotateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.8);

  // 신비로운 글로우 효과
  useEffect(() => {
    glowOpacity.value = withRepeat(
      withTiming(1, { 
        duration: 2000, 
        easing: Easing.inOut(Easing.ease) 
      }),
      -1,
      true
    );
  }, []);
  const getCardDimensions = () => {
    const sizeDimensions = {
      small: {
        width: dimensions.cardWidth * 0.7,
        height: dimensions.cardHeight * 0.7,
      },
      medium: {
        width: dimensions.cardWidth,
        height: dimensions.cardHeight,
      },
      large: {
        width: dimensions.cardWidth * 1.3,
        height: dimensions.cardHeight * 1.3,
      },
    };

    return sizeDimensions[size];
  };

  const cardDimensions = getCardDimensions();

  const handlePress = () => {
    if (!onPress) return;
    
    cardSelectFeedback();
    
    // 터치 애니메이션
    scale.value = withSpring(0.95, { duration: 150 });
    setTimeout(() => {
      scale.value = withSpring(1, { duration: 200 });
    }, 100);
    
    onPress();
  };

  const animatedCardStyle = useAnimatedStyle(() => {
    const rotateYDeg = interpolate(rotateY.value, [0, 1], [0, 180]);
    
    return {
      transform: [
        { rotateY: `${rotateYDeg}deg` },
        { scale: scale.value }
      ],
      opacity: glowOpacity.value,
    };
  });

  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(rotateY.value, [0, 0.5, 1], [0, 0, 1]),
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(rotateY.value, [0, 0.5, 1], [1, 0, 0]),
    };
  });

  // 카드 플립 애니메이션 효과
  useEffect(() => {
    if (isFlipped) {
      cardFlipFeedback();
      rotateY.value = withTiming(1, { 
        duration: 800, 
        easing: Easing.out(Easing.ease) 
      });
    } else {
      rotateY.value = withTiming(0, { 
        duration: 800, 
        easing: Easing.out(Easing.ease) 
      });
    }
  }, [isFlipped]);

  return (
    <AnimatedTouchableOpacity
      onPress={handlePress}
      activeOpacity={1}
      style={[
        styles.cardContainer,
        cardDimensions,
        shadows.mysticalGlow,
        style,
        animatedCardStyle
      ]}
    >
        {/* Card Back */}
        <Animated.View style={[StyleSheet.absoluteFillObject, backAnimatedStyle]}>
          <View style={styles.cardImageContainer}>
            <Image
              source={CARD_BACK_IMAGE}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardBackOverlay}>
              <Text style={styles.cardBackText}>🌙</Text>
              <Text style={styles.cardBackSubtext}>TAROT</Text>
              <Text style={styles.cardBackText}>⭐</Text>
            </View>
          </View>
        </Animated.View>

        {/* Card Front */}
        <Animated.View style={[StyleSheet.absoluteFillObject, frontAnimatedStyle]}>
          {showImage && cardImage ? (
            <View style={styles.cardImageContainer}>
              <Image
                source={cardImage || CARD_PLACEHOLDER_IMAGE}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.cardFrontOverlay}
              >
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {cardName}
                </Text>
                <Text style={styles.cardMeaning} numberOfLines={2}>
                  {cardMeaning}
                </Text>
              </LinearGradient>
            </View>
          ) : (
            <LinearGradient
              colors={gradients.gold}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardFront}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {cardName}
                  </Text>
                </View>
                
                <View style={styles.cardSymbol}>
                  <Text style={styles.symbolText}>🔮</Text>
                </View>
                
                <View style={styles.cardFooter}>
                  <Text style={styles.cardMeaning} numberOfLines={3}>
                    {cardMeaning}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          )}
        </Animated.View>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: borderRadius.large,
    overflow: 'hidden',
    marginHorizontal: spacing.xs,
    marginVertical: spacing.sm,
  },
  cardGradient: {
    flex: 1,
    padding: spacing.md,
  },
  cardImageContainer: {
    flex: 1,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.large,
  },
  cardBackOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: borderRadius.large,
  },
  cardFrontOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomLeftRadius: borderRadius.large,
    borderBottomRightRadius: borderRadius.large,
  },
  cardBack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBackPattern: {
    alignItems: 'center',
    opacity: 0.8,
  },
  cardBackText: {
    fontSize: 32,
    marginVertical: spacing.xs,
  },
  cardBackSubtext: {
    ...typography.titleMedium,
    color: colors.dark.accent,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginVertical: spacing.sm,
  },
  cardFront: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.titleMedium,
    color: colors.dark.foreground,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardSymbol: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbolText: {
    fontSize: 48,
    opacity: 0.9,
  },
  cardFooter: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  cardMeaning: {
    ...typography.bodyMedium,
    color: colors.dark.secondaryForeground,
    textAlign: 'center',
    lineHeight: 18,
  },
});