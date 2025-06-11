// import React, { useRef, useCallback, ReactNode } from "react";
// import { View, Dimensions, StyleSheet } from "react-native";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
//   useAnimatedGestureHandler,
//   interpolate,
//   Extrapolation,
// } from "react-native-reanimated";
// import { PanGestureHandler } from "react-native-gesture-handler";

// const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 100;

// type BottomSheetProps = {
//   children: ReactNode;
//   minHeight?: number;
//   maxHeight?: number;
//   initialHeight?: "min" | "max";
// };

// export const BottomSheet = ({
//   children,
//   minHeight = 300,
//   maxHeight = 670,
//   initialHeight = "min",
// }: BottomSheetProps) => {
//   // Calculate starting position based on initialHeight
//   const startTranslateY = initialHeight === "min" ? -minHeight : -maxHeight;

//   // Animated values
//   const translateY = useSharedValue(startTranslateY);
//   const lastTranslateY = useSharedValue(startTranslateY);
//   const context = useSharedValue({ y: 0 });

//   // Handle gesture events
//   const gestureHandler = useAnimatedGestureHandler({
//     onStart: (_, ctx) => {
//       ctx.y = translateY.value;
//     },
//     onActive: (event, ctx) => {
//       translateY.value = Math.max(
//         Math.min(ctx.y + event.translationY, -minHeight),
//         -maxHeight
//       );
//     },
//     onEnd: (event) => {
//       // Determine whether to snap to top or bottom based on velocity and position
//       const shouldGoToBottom =
//         translateY.value > -minHeight - (maxHeight - minHeight) * 0.5 ||
//         event.velocityY > 500;

//       const finalPosition = shouldGoToBottom ? -minHeight : -maxHeight;

//       translateY.value = withSpring(finalPosition, {
//         damping: 20,
//         stiffness: 90,
//         mass: 0.7,
//       });

//       lastTranslateY.value = finalPosition;
//     },
//   });

//   // Animated styles
//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{ translateY: translateY.value }],
//     };
//   });

//   // Indicator opacity (gets darker as sheet is pulled up)
//   const indicatorStyle = useAnimatedStyle(() => {
//     const opacity = interpolate(
//       translateY.value,
//       [-maxHeight, -minHeight],
//       [0.8, 0.4],
//       Extrapolation.CLAMP
//     );

//     return {
//       opacity,
//     };
//   });

//   return (
//     <PanGestureHandler onGestureEvent={gestureHandler}>
//       <Animated.View
//         style={[
//           styles.bottomSheetContainer,
//           animatedStyle,
//           { height: maxHeight + 20 }, // Add extra to ensure no gap at bottom
//         ]}
//       >
//         <View style={styles.indicatorContainer}>
//           <Animated.View style={[styles.indicator, indicatorStyle]} />
//         </View>
//         <View style={styles.contentContainer}>{children}</View>
//       </Animated.View>
//     </PanGestureHandler>
//   );
// };

// const styles = StyleSheet.create({
//   bottomSheetContainer: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: -20, // Slightly below screen to avoid gaps
//     backgroundColor: "white",
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: -2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   indicatorContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingTop: 12,
//     paddingBottom: 16,
//   },
//   indicator: {
//     width: 40,
//     height: 5,
//     borderRadius: 3,
//     backgroundColor: "#D0D0D0",
//   },
//   contentContainer: {
//     flex: 1,
//   },
// });
