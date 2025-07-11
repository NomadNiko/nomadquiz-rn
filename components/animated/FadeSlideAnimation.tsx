import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface FadeSlideAnimationProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  fromScale?: number;
  fromTranslateY?: number;
  autoStart?: boolean;
  style?: object;
}

const FadeSlideAnimation: React.FC<FadeSlideAnimationProps> = ({
  children,
  duration = 3000,
  delay = 0,
  fromScale = 0.3,
  fromTranslateY = 50,
  autoStart = true,
  style,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (autoStart) {
      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
        ]).start();
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [slideAnim, opacityAnim, duration, delay, autoStart]);

  const animatedStyle = {
    opacity: opacityAnim,
    transform: [
      {
        scale: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [fromScale, 1],
        }),
      },
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [fromTranslateY, 0],
        }),
      },
    ],
  };

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
};

export default FadeSlideAnimation;
