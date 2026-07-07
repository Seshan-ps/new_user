import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  ImageBackground, 
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
  Animated
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive image size to fit all screen aspect ratios perfectly
const imageSize = Math.min(screenWidth * 0.82, screenHeight * 0.36);

const slides = [
  {
    key: '1',
    title: 'Connecting\nProfessionals',
    subtitle: 'Build meaningful connections and\ngrow your professional network',
    image: require('../assets/1.1.png'),
  },
  {
    key: '2',
    title: 'Global Accounting\nNetwork',
    subtitle: 'Access a global network of accounting\nexperts and opportunities',
    image: require('../assets/1.3.png'),
  },
  {
    key: '3',
    title: 'Empower Your\nFuture',
    subtitle: 'Gain insights, enhance skills and\nachieve your career goals',
    image: require('../assets/1.2.png'),
  },
];

export default function OnboardingScreen({ onFinish }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / screenWidth);
    if (index !== activeIndex && index >= 0 && index < slides.length) {
      setActiveIndex(index);
    }
  };

  const handleButtonPress = () => {
    if (activeIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (activeIndex + 1) * screenWidth,
        animated: true,
      });
    } else {
      onFinish();
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/background.png')} 
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header Logo */}
        <View style={styles.header}>
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logo} 
            resizeMode="contain" 
          />
        </View>

        {/* Carousel Content */}
        <View style={styles.carouselContainer}>
          <Animated.ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true, listener: handleScroll }
            )}
            scrollEventThrottle={16}
            decelerationRate="fast"
            bounces={false}
          >
            {slides.map((slide, index) => {
              // Interpolations for illustration animation
              const scale = scrollX.interpolate({
                inputRange: [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth],
                outputRange: [0.75, 1, 0.75],
                extrapolate: 'clamp',
              });

              const opacity = scrollX.interpolate({
                inputRange: [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth],
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp',
              });

              const rotate = scrollX.interpolate({
                inputRange: [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth],
                outputRange: ['-12deg', '0deg', '12deg'],
                extrapolate: 'clamp',
              });

              // Parallax and slide animations for text content
              const textOpacity = scrollX.interpolate({
                inputRange: [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth],
                outputRange: [0, 1, 0],
                extrapolate: 'clamp',
              });

              const textTranslateX = scrollX.interpolate({
                inputRange: [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth],
                outputRange: [screenWidth * 0.45, 0, -screenWidth * 0.45],
                extrapolate: 'clamp',
              });

              const textTranslateY = scrollX.interpolate({
                inputRange: [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth],
                outputRange: [50, 0, -50],
                extrapolate: 'clamp',
              });

              return (
                <View key={slide.key} style={styles.slide}>
                  <Animated.View style={[
                    styles.imageContainer,
                    {
                      opacity,
                      transform: [
                        { scale },
                        { rotate }
                      ]
                    }
                  ]}>
                    <Image 
                      source={slide.image} 
                      style={styles.illustration} 
                      resizeMode="contain" 
                    />
                  </Animated.View>
                  
                  <Animated.View style={[
                    styles.textContainer,
                    {
                      opacity: textOpacity,
                      transform: [
                        { translateX: textTranslateX },
                        { translateY: textTranslateY }
                      ]
                    }
                  ]}>
                    <Text style={styles.title}>{slide.title}</Text>
                    <View style={styles.accentLine} />
                    <Text style={styles.subtitle}>{slide.subtitle}</Text>
                  </Animated.View>
                </View>
              );
            })}
          </Animated.ScrollView>
        </View>

        {/* Footer Area with Indicators & Action Button */}
        <View style={styles.footer}>
          <View style={styles.indicatorContainer}>
            {slides.map((_, index) => {
              // Interpolate width expansion using scaleX, keeping it native-friendly
              const scaleX = scrollX.interpolate({
                inputRange: [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth],
                outputRange: [1, 3.33, 1],
                extrapolate: 'clamp',
              });

              const dotOpacity = scrollX.interpolate({
                inputRange: [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth],
                outputRange: [0.4, 1, 0.4],
                extrapolate: 'clamp',
              });

              const isActive = index === activeIndex;

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.indicatorDot,
                    {
                      opacity: dotOpacity,
                      backgroundColor: isActive ? '#03254C' : '#7DBE14',
                      transform: [{ scaleX }],
                    },
                  ]}
                />
              );
            })}
          </View>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleButtonPress} 
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>
              {activeIndex === 2 ? 'Get Start ' : 'Next '}
              <Text style={styles.buttonArrow}>➔</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 35) : 0,
    paddingBottom: Platform.OS === 'android' ? 24 : 0,
  },
  header: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  logo: {
    width: 180,
    height: 55,
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  slide: {
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  imageContainer: {
    width: imageSize,
    height: imageSize,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#03254C',
    textAlign: 'center',
    lineHeight: 36,
  },
  accentLine: {
    width: 55,
    height: 4.5,
    borderRadius: 2.5,
    backgroundColor: '#7DBE14',
    marginTop: 18,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#75AB1A',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingBottom: 24,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 36,
    gap: 12,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  button: {
    width: '100%',
    height: 54,
    backgroundColor: '#03254C',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonArrow: {
    fontSize: 17,
  },
});
