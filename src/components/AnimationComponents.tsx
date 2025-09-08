import React, { useEffect, useRef, ReactNode, useState } from 'react';
import { 
  View,
  Animated,
  Easing,
  ViewStyle,
  StyleProp,
} from 'react-native';

interface AnimatedComponentProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

// Mystical Pulse 애니메이션
export function MysticalPulse({ children, style }: AnimatedComponentProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const createPulseAnimation = () => {
      return Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 1000,
            easing: Easing.sin,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.8,
            duration: 1000,
            easing: Easing.sin,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.sin,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.sin,
            useNativeDriver: true,
          }),
        ]),
      ]);
    };

    const startAnimation = () => {
      createPulseAnimation().start(() => startAnimation());
    };

    startAnimation();
  }, [pulseAnim, opacityAnim]);

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: pulseAnim }],
          opacity: opacityAnim,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

// Gentle Float 애니메이션
export function GentleFloat({ children, style }: AnimatedComponentProps) {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createFloatAnimation = () => {
      return Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
      ]);
    };

    const startAnimation = () => {
      createFloatAnimation().start(() => startAnimation());
    };

    startAnimation();
  }, [floatAnim]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

// Sparkle Effect 애니메이션
export function SparkleEffect({ children, style }: AnimatedComponentProps) {
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const createSparkleAnimation = () => {
      return Animated.parallel([
        Animated.sequence([
          Animated.timing(sparkleAnim, {
            toValue: 1,
            duration: 750,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(sparkleAnim, {
            toValue: 0,
            duration: 750,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.loop(
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.1,
              duration: 200,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 200,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]),
          { iterations: 3 }
        ),
      ]);
    };

    const startAnimation = () => {
      createSparkleAnimation().start(() => {
        setTimeout(startAnimation, 2000); // 2초 간격으로 반복
      });
    };

    startAnimation();
  }, [sparkleAnim, scaleAnim]);

  const opacity = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  return (
    <Animated.View
      style={[
        {
          opacity,
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

// Gentle Glow 애니메이션
export function GentleGlow({ children, style }: AnimatedComponentProps) {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createGlowAnimation = () => {
      return Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
      ]);
    };

    const startAnimation = () => {
      createGlowAnimation().start(() => startAnimation());
    };

    startAnimation();
  }, [glowAnim]);

  const opacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  return (
    <Animated.View
      style={[
        {
          opacity,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

// Scale Hover 애니메이션 (React Native에서는 터치 기반)
interface ScaleHoverProps extends AnimatedComponentProps {
  hoverScale?: number;
  duration?: number;
  onPress?: () => void;
}

export function ScaleHover({ 
  children, 
  style, 
  hoverScale = 1.05, 
  duration = 200,
  onPress
}: ScaleHoverProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: hoverScale,
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}
    >
      {onPress ? (
        <View
          onTouchStart={handlePressIn}
          onTouchEnd={handlePressOut}
          onTouchCancel={handlePressOut}
          style={{ flex: 1 }}
        >
          {children}
        </View>
      ) : (
        children
      )}
    </Animated.View>
  );
}

// Fade In 애니메이션
interface FadeInProps extends AnimatedComponentProps {
  delay?: number;
  duration?: number;
}

export function FadeIn({ 
  children, 
  style, 
  delay = 0, 
  duration = 500 
}: FadeInProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration, fadeAnim]);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

// Slide In 애니메이션
interface SlideInProps extends AnimatedComponentProps {
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
}

export function SlideIn({ 
  children, 
  style, 
  direction = 'up',
  delay = 0, 
  duration = 300,
  distance = 20
}: SlideInProps) {
  const slideAnim = useRef(new Animated.Value(distance)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration, distance, slideAnim, fadeAnim]);

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return [{ translateY: slideAnim }];
      case 'down':
        return [{ translateY: slideAnim.interpolate({ inputRange: [0, distance], outputRange: [0, -distance] }) }];
      case 'left':
        return [{ translateX: slideAnim }];
      case 'right':
        return [{ translateX: slideAnim.interpolate({ inputRange: [0, distance], outputRange: [0, -distance] }) }];
      default:
        return [{ translateY: slideAnim }];
    }
  };

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: getTransform(),
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

// Loading Spinner
interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function LoadingSpinner({ size = 24, color = '#d4af37', style }: LoadingSpinnerProps) {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createSpinAnimation = () => {
      return Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      });
    };

    const startAnimation = () => {
      spinAnim.setValue(0);
      createSpinAnimation().start(() => startAnimation());
    };

    startAnimation();
  }, [spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderWidth: 2,
          borderColor: color + '30',
          borderTopColor: color,
          borderRadius: size / 2,
          transform: [{ rotate: spin }],
        },
        style,
      ]}
    />
  );
}

// 애니메이션 컨테이너
interface AnimationContainerProps {
  children: ReactNode;
  animations?: ('pulse' | 'float' | 'glow' | 'sparkle')[];
  style?: StyleProp<ViewStyle>;
}

export function AnimationContainer({ 
  children, 
  animations = [], 
  style 
}: AnimationContainerProps) {
  let AnimatedComponent = ({ children }: { children: ReactNode }) => <View>{children}</View>;

  // 애니메이션 중첩 적용
  animations.forEach((animation) => {
    const PrevComponent = AnimatedComponent;

    switch (animation) {
      case 'pulse':
        AnimatedComponent = ({ children }) => (
          <PrevComponent>
            <MysticalPulse style={style}>
              {children}
            </MysticalPulse>
          </PrevComponent>
        );
        break;
      case 'float':
        AnimatedComponent = ({ children }) => (
          <PrevComponent>
            <GentleFloat style={style}>
              {children}
            </GentleFloat>
          </PrevComponent>
        );
        break;
      case 'glow':
        AnimatedComponent = ({ children }) => (
          <PrevComponent>
            <GentleGlow style={style}>
              {children}
            </GentleGlow>
          </PrevComponent>
        );
        break;
      case 'sparkle':
        AnimatedComponent = ({ children }) => (
          <PrevComponent>
            <SparkleEffect style={style}>
              {children}
            </SparkleEffect>
          </PrevComponent>
        );
        break;
    }
  });

  if (animations.length === 0) {
    return <View style={style}>{children}</View>;
  }

  return <AnimatedComponent>{children}</AnimatedComponent>;
}