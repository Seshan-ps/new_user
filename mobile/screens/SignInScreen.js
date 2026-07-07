import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ImageBackground, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Modal,
  StatusBar as RNStatusBar
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { supabase } from '../lib/supabase';
import { mockDb } from '../lib/mockDb';

// Custom inline SVG icons
const ProfileIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

const LockIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

const EyeIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <Circle cx="12" cy="12" r="3" />
  </Svg>
);

const EyeOffIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <Path d="M1 1L23 23" />
  </Svg>
);

const WarningIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7A1C24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 8L12 12" />
    <Path d="M12 16L12.01 16" />
  </Svg>
);

const GoogleIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24">
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <Path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </Svg>
);

const AppleIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="#000000">
    <Path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.52-.64.74-1.2 1.88-1.05 3 .15.01.27.02.39.02.97 0 2.13-.56 2.59-1.48z" />
  </Svg>
);

export default function SignInScreen({ onSignUp, onLoginSuccess, onForgotPassword, onBack, showAlert }) {
  // Preset matching the mockup screenshot values for demonstration
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Social Login Popup Modal States
  const [socialModalVisible, setSocialModalVisible] = useState(false);
  const [socialPlatform, setSocialPlatform] = useState('');
  const [socialLoading, setSocialLoading] = useState(false);

  const googleAccounts = [
    { name: 'VGM Member', email: 'vgm@gmail.com', initial: 'V' },
    { name: 'Seshan Accountant', email: 'seshan@gmail.com', initial: 'S' },
    { name: 'Accounting Pro', email: 'accounting_pro@gmail.com', initial: 'A' },
  ];

  const appleAccounts = [
    { name: 'VGM iCloud', email: 'vgm@icloud.com', initial: 'V' },
    { name: 'Seshan iCloud', email: 'seshan@icloud.com', initial: 'S' },
  ];

  const handleSocialLogin = (platform) => {
    setSocialPlatform(platform);
    setSocialModalVisible(true);
  };

  const handleSelectSocialAccount = async (account) => {
    setSocialLoading(true);
    try {
      const users = await mockDb.getUsers();
      const matched = users.find(u => u.email.toLowerCase() === account.email.toLowerCase()) || users[0];
      setTimeout(() => {
        setSocialLoading(false);
        setSocialModalVisible(false);
        onLoginSuccess(matched);
      }, 1200);
    } catch (e) {
      setSocialLoading(false);
      setSocialModalVisible(false);
    }
  };

  const handleLogin = async () => {
    if (!emailOrPhone || !password) {
      setErrorMsg('Please enter email/phone and password.');
      setShowError(true);
      return;
    }
    setErrorMsg('');
    setShowError(false);

    setLoading(true);
    try {
      const users = await mockDb.getUsers();
      const cleanInput = emailOrPhone.trim().toLowerCase();
      const matchedUser = users.find(u => 
        (u.email.toLowerCase() === cleanInput || u.phone === cleanInput) && 
        u.password === password
      );

      if (matchedUser) {
        onLoginSuccess(matchedUser);
      } else {
        setErrorMsg('Invalid email/phone or password.\nPlease try again.');
        setShowError(true);
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
      setShowError(true);
    } finally {
      setLoading(false);
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
        {/* Account Selection Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={socialModalVisible}
          onRequestClose={() => {
            if (!socialLoading) setSocialModalVisible(false);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {socialLoading ? (
                <View style={styles.modalLoadingContainer}>
                  <ActivityIndicator size="large" color="#03254C" />
                  <Text style={styles.modalLoadingText}>
                    Connecting to {socialPlatform}...
                  </Text>
                </View>
              ) : (
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
                    Sign in with {socialPlatform}
                  </Text>
                  <Text style={styles.modalSubtitle}>
                    Select an account to continue to Texcity Accountants Society
                  </Text>
                  
                  <View style={styles.accountsList}>
                    {(socialPlatform === 'Google' ? googleAccounts : appleAccounts).map((acc) => (
                      <TouchableOpacity
                        key={acc.email}
                        style={styles.accountItem}
                        onPress={() => handleSelectSocialAccount(acc)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.avatarCircle}>
                          <Text style={styles.avatarText}>{acc.initial}</Text>
                        </View>
                        <View style={styles.accountDetails}>
                          <Text style={styles.accountName}>{acc.name}</Text>
                          <Text style={styles.accountEmail}>{acc.email}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => setSocialModalVisible(false)}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Header Branding */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onBack} style={styles.backTouchArea}>
                <Image 
                  source={require('../assets/logo.png')} 
                  style={styles.logo} 
                  resizeMode="contain" 
                />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Welcome</Text>
            </View>

            {/* Input Card Container */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Sign-in</Text>

              {/* Email or Phone Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email ID / Phone Number</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <ProfileIcon />
                  </View>
                  <TextInput
                    style={styles.input}
                    value={emailOrPhone}
                    onChangeText={(text) => {
                      setEmailOrPhone(text);
                      if (showError) setShowError(false);
                    }}
                    placeholder="Enter email or phone number"
                    placeholderTextColor="#94A3B8"
                    keyboardType="default"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <LockIcon />
                  </View>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (showError) setShowError(false);
                    }}
                    placeholder="Enter password"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onSubmitEditing={handleLogin}
                    returnKeyType="done"
                  />
                  <TouchableOpacity 
                    style={styles.eyeButton} 
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity 
                style={styles.forgotPassword}
                onPress={onForgotPassword}
                disabled={loading}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Invalid Banner */}
              {showError && (
                <View style={styles.errorBanner}>
                  <View style={styles.errorIcon}>
                    <WarningIcon />
                  </View>
                  <Text style={styles.errorText}>
                    {errorMsg}
                  </Text>
                </View>
              )}

              {/* Login Button */}
              <TouchableOpacity 
                style={styles.loginButton} 
                onPress={handleLogin}
                activeOpacity={0.85}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.loginButtonText}>Login ➔</Text>
                )}
              </TouchableOpacity>

              {/* Sign Up Link */}
              <View style={styles.signUpRow}>
                <Text style={styles.signUpLabel}>Don’t have an account? </Text>
                <TouchableOpacity onPress={onSignUp}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>

              {/* Social Login Options */}
              <Text style={styles.orText}>Or with</Text>

              <TouchableOpacity 
                style={styles.socialButton} 
                activeOpacity={0.8}
                onPress={() => handleSocialLogin('Google')}
                disabled={loading}
              >
                <GoogleIcon />
                <Text style={styles.socialButtonText}>Sign in with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.socialButton} 
                activeOpacity={0.8}
                onPress={() => handleSocialLogin('Apple')}
                disabled={loading}
              >
                <AppleIcon />
                <Text style={styles.socialButtonText}>Sign in with Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Sticky/Branding Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerLine1}>
                © 2024 Texcity Accountants Society. Secure Administrative Access.
              </Text>
              <Text style={styles.footerLinks}>
                Privacy Policy   Security Standards   Support
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    width: '100%',
  },
  backTouchArea: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 180,
    height: 55,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#03254C',
    marginTop: 12,
  },
  card: {
    width: '88%',
    backgroundColor: '#D6E8FC',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#03254C',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#03254C',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    height: 52,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    paddingLeft: 16,
    paddingRight: 10,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '600',
    paddingRight: 16,
  },
  eyeButton: {
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
  },
  forgotPassword: {
    alignSelf: 'flex-start',
    marginBottom: 18,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
  },
  errorBanner: {
    flexDirection: 'row',
    backgroundColor: '#F1A9B2',
    borderWidth: 1.2,
    borderColor: '#E25B6C',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  errorIcon: {
    marginRight: 12,
  },
  errorText: {
    flex: 1,
    color: '#5C1D24',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  loginButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#03254C',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  signUpLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
  },
  orText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
    marginBottom: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#03254C',
    borderRadius: 24,
    height: 48,
    marginBottom: 12,
    gap: 10,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#03254C',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  footerLine1: {
    fontSize: 10.5,
    color: '#475569',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 14,
  },
  footerLinks: {
    fontSize: 10.5,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 37, 76, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    minHeight: 320,
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  modalLoadingContainer: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  modalLoadingText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#03254C',
  },
  modalContent: {
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#03254C',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 20,
    lineHeight: 18,
  },
  accountsList: {
    gap: 12,
    marginBottom: 20,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    gap: 12,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#D6E8FC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#03254C',
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#03254C',
  },
  accountEmail: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
  },
  modalCancelButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  modalCancelText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#475569',
  },
});
