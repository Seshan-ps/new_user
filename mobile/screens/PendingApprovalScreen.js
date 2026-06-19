import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  ImageBackground, 
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar as RNStatusBar,
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function PendingApprovalScreen({ onCheckStatus }) {
  const [checking, setChecking] = useState(false);

  const handleCheckStatus = () => {
    setChecking(true);
    // Simulate checking status with a 1.5s delay
    setTimeout(() => {
      setChecking(false);
      onCheckStatus();
    }, 1500);
  };

  return (
    <ImageBackground 
      source={require('../assets/background.png')} 
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            {/* Logo */}
            <Image 
              source={require('../assets/logo.png')} 
              style={styles.logo} 
              resizeMode="contain" 
            />

            {/* Title */}
            <Text style={styles.title}>Welcome aboard!</Text>

            {/* Description */}
            <Text style={styles.description}>
              Your account has been created successfully and is currently waiting for admin approval. You'll be able to access the app once your profile is approved.{"\n"}{"\n"}
              Please check back after some time.
            </Text>
          </View>

          {/* Action Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleCheckStatus}
              activeOpacity={0.85}
              disabled={checking}
            >
              {checking ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.buttonText}>Check Approval Status</Text>
              )}
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
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  logo: {
    width: 240,
    height: 75,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#03254C',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 15.5,
    fontWeight: '600',
    color: '#1E3A5F',
    textAlign: 'center',
    lineHeight: 23,
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
