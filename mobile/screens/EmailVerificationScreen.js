import React, { useState, useRef } from 'react';
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
  StatusBar as RNStatusBar
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { supabase } from '../lib/supabase';

// Custom inline SVG icons
const ShieldIcon = () => (
  <Svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <Path d="m9 11 2 2 4-4" />
  </Svg>
);

export default function EmailVerificationScreen({ email, onVerifySuccess, onBack, showAlert }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChangeText = (text, index) => {
    // Only accept numeric inputs
    const cleanText = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = cleanText;
    setOtp(newOtp);

    // Auto-focus next input field on type
    if (cleanText !== '' && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Auto-focus previous input field on backspace
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length < 6) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }
    setErrorMsg('');

    if (!supabase) {
      console.warn('Supabase not configured. Simulating verification.');
      onVerifySuccess();
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email || '',
        token: otpString,
        type: 'signup'
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        onVerifySuccess();
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setErrorMsg('');
    if (!supabase) {
      console.warn('Supabase not configured. Simulating Resend OTP.');
      showAlert('Verification code resent successfully!', 'Success');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email || '',
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        showAlert('Verification code resent successfully!', 'Success');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const maskEmail = (emailStr) => {
    if (!emailStr) return 'your email address';
    const [local, domain] = emailStr.split('@');
    if (!domain) return emailStr;
    const maskedLocal = local.length > 3 
      ? local.slice(0, 3) + '...'.repeat(Math.min(local.length - 3, 5)) 
      : local + '...';
    return `${maskedLocal}@${domain}`;
  };

  return (
    <ImageBackground 
      source={require('../assets/background.png')} 
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      <SafeAreaView style={styles.safeArea}>
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
            </View>

            {/* Input Card Container */}
            <View style={styles.card}>
              {/* Top Shield Emblem */}
              <View style={styles.shieldBadge}>
                <ShieldIcon />
              </View>

              {/* Error Banner */}
              {errorMsg !== '' && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              )}

              <Text style={styles.cardTitle}>Verify Your Email</Text>
              
              <Text style={styles.cardSubtitle}>
                We've sent a 6-digit verification code to{"\n"}
                {maskEmail(email)}
              </Text>

              {/* OTP Inputs Box */}
              <View style={styles.otpInputContainer}>
                {otp.map((digit, index) => (
                  <View key={index} style={styles.otpBoxWrapper}>
                    <TextInput
                      ref={inputRefs[index]}
                      style={styles.otpBox}
                      value={digit}
                      onChangeText={(text) => handleChangeText(text, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      textAlign="center"
                      selectTextOnFocus
                    />
                    {/* Mockup Underline Detail */}
                    <View style={styles.otpUnderline} />
                  </View>
                ))}
              </View>

              {/* Verify Button */}
              <TouchableOpacity 
                style={styles.verifyButton} 
                onPress={handleVerify}
                activeOpacity={0.85}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.verifyButtonText}>Verify</Text>
                )}
              </TouchableOpacity>

              {/* Resend Link */}
              <View style={styles.resendRow}>
                <Text style={styles.resendLabel}>Didn't receive the code? </Text>
                <TouchableOpacity onPress={handleResendOtp} disabled={loading}>
                  <Text style={styles.resendLink}>Resend OTP</Text>
                </TouchableOpacity>
              </View>
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
    alignItems: 'center',
  },
  shieldBadge: {
    width: 68,
    height: 68,
    backgroundColor: '#03254C',
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#03254C',
    textAlign: 'center',
    marginBottom: 16,
  },
  cardSubtitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#1E3A8A',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  otpBoxWrapper: {
    width: '13%',
    alignItems: 'center',
  },
  otpBox: {
    width: '100%',
    fontSize: 22,
    fontWeight: '800',
    color: '#03254C',
    paddingBottom: 2,
  },
  otpUnderline: {
    width: '90%',
    height: 2,
    backgroundColor: '#94A3B8',
    borderRadius: 1,
  },
  verifyButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#03254C',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resendLabel: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#334155',
  },
  resendLink: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1E40AF',
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
  errorBanner: {
    backgroundColor: '#F1A9B2',
    borderWidth: 1.2,
    borderColor: '#E25B6C',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    color: '#5C1D24',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
