import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ImageBackground, 
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen({ onRestartOnboarding, onSignIn, onSignUp }) {
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
            <Image 
              source={require('../assets/logo.png')} 
              style={styles.logo} 
              resizeMode="contain" 
            />
            <Text style={styles.title}>Welcome</Text>
          </View>

          {/* Buttons Stack */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.signInButton} 
              onPress={onSignIn}
              activeOpacity={0.85}
            >
              <Text style={styles.signInText}>Sign in</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.signUpButton} 
              onPress={onSignUp}
              activeOpacity={0.85}
            >
              <Text style={styles.signUpText}>Sign up</Text>
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
    paddingBottom: Platform.OS === 'android' ? 24 : 0,
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
    // Slightly offset vertically to balance with bottom button stack
    paddingBottom: 40,
  },
  logo: {
    width: 240,
    height: 75,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#03254C',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  buttonContainer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
    gap: 16,
  },
  signInButton: {
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
  signInText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  signUpButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#03254C',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: '#03254C',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
