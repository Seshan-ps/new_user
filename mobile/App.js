import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Modal, Text, TouchableOpacity, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Ignore specific deprecation warnings for clean runtime logs
LogBox.ignoreLogs([
  'setLayoutAnimationEnabledExperimental is currently a no-op',
  'SafeAreaView has been deprecated'
]);
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import EmailVerificationScreen from './screens/EmailVerificationScreen';
import CongratulationScreen from './screens/CongratulationScreen';
import PendingApprovalScreen from './screens/PendingApprovalScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import LoginLoadingScreen from './screens/LoginLoadingScreen';
import HomeScreen from './screens/HomeScreen';
import MembershipScreen from './screens/MembershipScreen';

import { mockDb } from './lib/mockDb';

export default function App() {
  const [screen, setScreen] = useState('SPLASH');
  
  // Signup temp states
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPlan, setSignupPlan] = useState('Premium');
  const [signupAutopay, setSignupAutopay] = useState(true);

  // Active authenticated user
  const [currentUser, setCurrentUser] = useState(null);

  // Custom premium alert state
  const [appAlert, setAppAlert] = useState({ visible: false, message: '', title: 'Alert', onConfirm: null });
  const showAlert = (message, title = 'Alert', onConfirm = null) => {
    setAppAlert({ visible: true, message, title, onConfirm });
  };

  // Initialize DB on mount
  useEffect(() => {
    mockDb.initDb();
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setScreen('WELCOME');
  };

  const handleResetPassword = async (emailOrPhone, newPassword) => {
    return await mockDb.updateUserPassword(emailOrPhone, newPassword);
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="dark" />
      {screen === 'SPLASH' && (
        <SplashScreen onFinish={() => setScreen('ONBOARDING')} />
      )}
      {screen === 'ONBOARDING' && (
        <OnboardingScreen onFinish={() => setScreen('WELCOME')} />
      )}
      {screen === 'WELCOME' && (
        <WelcomeScreen 
          onRestartOnboarding={() => setScreen('ONBOARDING')}
          onSignIn={() => setScreen('SIGN_IN')}
          onSignUp={() => setScreen('SIGN_UP')}
        />
      )}
      {screen === 'SIGN_IN' && (
        <SignInScreen 
          onSignUp={() => setScreen('SIGN_UP')}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setScreen('LOGIN_LOADING');
          }}
          onForgotPassword={() => setScreen('FORGOT_PASSWORD')}
          onBack={() => setScreen('WELCOME')}
          showAlert={showAlert}
        />
      )}
      {screen === 'LOGIN_LOADING' && (
        <LoginLoadingScreen 
          onRedirect={() => setScreen('HOME')}
        />
      )}
      {screen === 'HOME' && (
        <HomeScreen 
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          onLogout={handleLogout}
          onForgotPassword={() => setScreen('FORGOT_PASSWORD')}
          showAlert={showAlert}
        />
      )}
      {screen === 'FORGOT_PASSWORD' && (
        <ForgotPasswordScreen 
          onBackToSignIn={() => setScreen('SIGN_IN')}
          onResetPassword={handleResetPassword}
          showAlert={showAlert}
        />
      )}
      {screen === 'SIGN_UP' && (
        <SignUpScreen 
          onSignIn={() => setScreen('SIGN_IN')}
          onSignUpSuccess={(details) => {
            setSignupName(details.name);
            setSignupEmail(details.email);
            setSignupPhone(details.phone);
            setSignupPassword(details.password);
            setSignupUsername(details.username);
            setScreen('SIGNUP_MEMBERSHIP');
          }}
          onBack={() => setScreen('WELCOME')}
          showAlert={showAlert}
        />
      )}
      {screen === 'SIGNUP_MEMBERSHIP' && (
        <MembershipScreen 
          isSignUpFlow={true}
          setMembershipPlan={setSignupPlan}
          setAutopayEnabled={setSignupAutopay}
          showAlert={showAlert}
          onNavigate={async (target) => {
            if (target === 'back_to_signup') {
              setScreen('SIGN_UP');
            } else if (target === 'signup_success') {
              try {
                const registered = await mockDb.registerUser({
                  name: signupName,
                  email: signupEmail,
                  phone: signupPhone,
                  password: signupPassword,
                  username: signupUsername,
                  membershipPlan: signupPlan,
                  autopayEnabled: signupAutopay
                });
                setCurrentUser(registered);
                setScreen('PENDING_APPROVAL');
              } catch (e) {
                showAlert('Registration failed: ' + e.message, 'Error');
              }
            }
          }}
        />
      )}
      {screen === 'PENDING_APPROVAL' && (
        <PendingApprovalScreen 
          onCheckStatus={() => setScreen('CONGRATULATIONS')}
        />
      )}
      {screen === 'VERIFY_EMAIL' && (
        <EmailVerificationScreen 
          email={signupEmail}
          onVerifySuccess={() => setScreen('CONGRATULATIONS')}
          onBack={() => setScreen('SIGN_UP')}
          showAlert={showAlert}
        />
      )}
      {screen === 'CONGRATULATIONS' && (
        <CongratulationScreen 
          onStart={() => setScreen('HOME')}
        />
      )}

      {appAlert.visible && (
        <Modal
          transparent={true}
          visible={appAlert.visible}
          animationType="fade"
          onRequestClose={() => setAppAlert({ ...appAlert, visible: false })}
        >
          <View style={styles.alertOverlay}>
            <View style={styles.alertContainer}>
              {appAlert.title !== 'Alert' && (
                <Text style={styles.alertTitle}>{appAlert.title}</Text>
              )}
              <Text style={styles.alertMessage}>{appAlert.message}</Text>
              <TouchableOpacity 
                style={styles.alertButton}
                onPress={() => {
                  const cb = appAlert.onConfirm;
                  setAppAlert({ ...appAlert, visible: false });
                  if (cb) cb();
                }}
              >
                <Text style={styles.alertButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 37, 76, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#03254C',
    marginBottom: 12,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: 14.5,
    color: '#03254C',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  alertButton: {
    backgroundColor: '#03254C',
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
  },
  alertButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
