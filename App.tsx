import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {snapPoint} from 'react-native-redash';

const SIZE = 100;
const {width, height} = Dimensions.get('screen');

const snapPointsX = [0, width - SIZE];
const snapPointsY = [0, height - SIZE];

const App = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {x: number; y: number}
  >({
    onStart: (_event, ctx) => {
      ctx.x = translateX.value;
      ctx.y = translateY.value;
    },
    onActive: ({translationX, translationY}, ctx) => {
      translateX.value = ctx.x + translationX;
      translateY.value = ctx.y + translationY;
    },
    onEnd: ({translationX, translationY, velocityX, velocityY}) => {
      const snapPointX = snapPoint(translationX, velocityX, snapPointsX);
      const snapPointY = snapPoint(translationY, velocityY, snapPointsY);

      translateX.value = withSpring(snapPointX, {velocity: velocityX});
      translateY.value = withSpring(snapPointY, {velocity: velocityY});
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: '#F00',
    width: SIZE,
    aspectRatio: 1,
    borderRadius: SIZE / 2,
    position: 'absolute',
    top: 0,
    transform: [{translateX: translateX.value}, {translateY: translateY.value}],
  }));

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={animatedStyle} />
      </PanGestureHandler>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
