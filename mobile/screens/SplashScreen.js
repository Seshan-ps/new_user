import React, { useEffect } from 'react';
import { StyleSheet, View, Image, ImageBackground, Text, SafeAreaView, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <ImageBackground 
      source={require('../assets/background.png')} 
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logo} 
            resizeMode="contain" 
          />
          <Text style={styles.tagline}>
            Connecting Professionals, Empowering{"\n"}Businesses.
          </Text>
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
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logo: {
    width: 260,
    height: 110,
    marginBottom: 20,
  },
  tagline: {
    fontSize: 16.5,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.3,
  },
});
