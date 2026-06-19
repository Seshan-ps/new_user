import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ImageBackground, 
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// Custom inline SVG illustration of a gift box popping open with stars
const BoxIllustration = () => (
  <Svg width="220" height="220" viewBox="0 0 100 100">
    {/* Light green glow highlight circle */}
    <Circle cx="50" cy="53" r="28" fill="#F0F9FF" />
    <Circle cx="50" cy="53" r="26" fill="#F0FDFA" />
    <Circle cx="50" cy="53" r="22" fill="#ECFDF5" />
    
    {/* Ground Baseline */}
    <Path d="M15 78L85 78" stroke="#03254C" strokeWidth="2.2" strokeLinecap="round" />
    
    {/* Box Body Container */}
    <Rect x="35" y="55" width="30" height="23" fill="#FFFFFF" stroke="#03254C" strokeWidth="2.5" rx="1" />
    
    {/* Vertical Stripe on Box */}
    <Path d="M50 55L50 78" stroke="#03254C" strokeWidth="2.5" />
    
    {/* Stylized Box Patterns */}
    <Rect x="41" y="62" width="4" height="2.5" rx="0.5" fill="#03254C" />
    <Rect x="55" y="62" width="4" height="2.5" rx="0.5" fill="#03254C" />
    <Rect x="41" y="68" width="4" height="2.5" rx="0.5" fill="#03254C" />
    
    {/* Gift Box Lid (popping open) */}
    <Path d="M31 46.5 L69 46.5 L64.5 54 L35.5 54 Z" fill="#FFFFFF" stroke="#03254C" strokeWidth="2.5" strokeLinejoin="round" />
    
    {/* Large Center Star */}
    <Path d="M50 17 L53.5 24.5 L61.5 25.5 L55.5 31 L57 39 L50 35 L43 39 L44.5 31 L38.5 25.5 L46.5 24.5 Z" fill="#7DBE14" stroke="#03254C" strokeWidth="1.8" strokeLinejoin="round" />
    
    {/* Left Shooting Star */}
    <Path d="M28 33 L30.2 35.5 L33.5 35.7 L31 37.8 L31.7 41 L28 39.5 L24.3 41 L25 37.8 L22.5 35.7 L25.8 35.5 Z" fill="#7DBE14" stroke="#03254C" strokeWidth="1.2" strokeLinejoin="round" />
    
    {/* Right Shooting Star */}
    <Path d="M72 33 L74.2 35.5 L77.5 35.7 L75 37.8 L75.7 41 L72 39.5 L68.3 41 L69 37.8 L66.5 35.7 L69.8 35.5 Z" fill="#7DBE14" stroke="#03254C" strokeWidth="1.2" strokeLinejoin="round" />
    
    {/* Shooting Sparkle Trails */}
    <Path d="M50 38 L50 49" stroke="#03254C" strokeWidth="2.2" strokeLinecap="round" />
    <Path d="M40 43 L45 50" stroke="#03254C" strokeWidth="2.2" strokeLinecap="round" />
    <Path d="M60 43 L55 50" stroke="#03254C" strokeWidth="2.2" strokeLinecap="round" />
    
    {/* Decorative Diamond Sparkles */}
    <Path d="M34 24 L36.5 26.5 L34 29 L31.5 26.5 Z" fill="#7DBE14" />
    <Path d="M66 24 L68.5 26.5 L66 29 L63.5 26.5 Z" fill="#7DBE14" />
    <Path d="M20 54 L22.5 56.5 L20 59 L17.5 56.5 Z" fill="#7DBE14" />
    <Path d="M80 54 L82.5 56.5 L80 59 L77.5 56.5 Z" fill="#7DBE14" />
  </Svg>
);

export default function CongratulationScreen({ onStart }) {
  return (
    <ImageBackground 
      source={require('../assets/background.png')} 
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Content Area */}
          <View style={styles.contentContainer}>
            {/* Sparkle Gift Box Illustration */}
            <View style={styles.illustrationWrapper}>
              <BoxIllustration />
            </View>

            {/* Congratulations Branding */}
            <Text style={styles.title}>Profile Approved!</Text>
            <Text style={styles.subtitle}>
              Your profile has been successfully approved.{"\n"}Welcome to Texcity Accountants Society!
            </Text>
          </View>

          {/* Action Button Container */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={onStart}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  illustrationWrapper: {
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#03254C',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15.5,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    paddingHorizontal: 32,
    paddingBottom: 60,
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
});
