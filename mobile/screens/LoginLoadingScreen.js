import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground, ActivityIndicator, SafeAreaView, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function LoginLoadingScreen({ onRedirect }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRedirect();
    }, 2000); // Redirect after 2 seconds
    return () => clearTimeout(timer);
  }, [onRedirect]);

  return (
    <ImageBackground 
      source={require('../assets/background.png')} 
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logo} 
            resizeMode="contain" 
          />
          <Text style={styles.title}>Welcome back!</Text>
          <ActivityIndicator size="large" color="#03254C" style={styles.loader} />
          <Text style={styles.subtitle}>Securing connection and loading your portal...</Text>
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
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 240,
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#03254C',
    textAlign: 'center',
    marginBottom: 24,
  },
  loader: {
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
});
