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
  StatusBar as RNStatusBar
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// SVGs
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

const PhoneIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

const EmailIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <Path d="M22 6L12 13L2 6" />
  </Svg>
);

const GreenTickIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
);

const RedCrossIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 6L6 18" />
    <Path d="M6 6L18 18" />
  </Svg>
);

const TinyGreenCheckIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
);

const ShieldCheckIllustration = () => (
  <Svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="#7DBE14" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <Path d="M9 11L11 13L15 9" stroke="#03254C" strokeWidth="2" />
  </Svg>
);

export default function ForgotPasswordScreen({ onBackToSignIn, onResetPassword, showAlert }) {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('email'); // 'email' or 'phone'

  // Input states
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [isStatusError, setIsStatusError] = useState(false);

  // Password states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Send Code
  const handleSendOtp = () => {
    if (method === 'email') {
      if (!email || !email.includes('@')) {
        setStatusMsg('Please enter a valid email address.');
        setIsStatusError(true);
        return;
      }
      setStatusMsg('Verification code sent to email! (Use 123456)');
    } else {
      if (!phone || phone.trim().length < 8) {
        setStatusMsg('Please enter a valid phone number.');
        setIsStatusError(true);
        return;
      }
      setStatusMsg('SMS verification code sent! (Use 123456)');
    }
    setIsStatusError(false);
    setOtpSent(true);
  };

  // Verify Code
  const handleVerifyOtp = () => {
    if (otpCode === '123456') {
      setIsVerified(true);
      setStatusMsg(method === 'email' ? 'Email verified successfully!' : 'Phone number verified successfully!');
      setIsStatusError(false);
      setOtpSent(false);
      setErrorMsg('');
    } else {
      setStatusMsg('Invalid code. Please try again.');
      setIsStatusError(true);
    }
  };

  // Switch Method
  const handleSwitchMethod = () => {
    setMethod(method === 'email' ? 'phone' : 'email');
    setOtpSent(false);
    setIsVerified(false);
    setStatusMsg('');
    setOtpCode('');
  };

  // Proceed to Step 2
  const handleNextStep = () => {
    if (!isVerified) {
      setErrorMsg('Please complete verification first.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  // Password validation
  const isMinLength = newPassword.length >= 8;
  const hasNumber = /[0-9]/.test(newPassword);
  const hasLetter = /[a-zA-Z]/.test(newPassword);

  const handleResetPasswordSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      setErrorMsg('Please fill in both password fields.');
      return;
    }
    if (!isMinLength || !hasNumber || !hasLetter) {
      setErrorMsg('Please satisfy all password requirements.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    const identifier = method === 'email' ? email : phone;
    try {
      const success = await onResetPassword(identifier, newPassword);
      setLoading(false);
      if (success) {
        setStep(3); // success screen
      } else {
        setErrorMsg('User not found in system.\nPlease enter a registered email or phone.');
      }
    } catch (e) {
      setLoading(false);
      setErrorMsg('Error resetting password: ' + e.message);
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Header Branding */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onBackToSignIn} style={styles.backTouchArea}>
                <Image 
                  source={require('../assets/logo.png')} 
                  style={styles.logo} 
                  resizeMode="contain" 
                />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Welcome</Text>
            </View>

            {/* Main Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Forgot Password</Text>

              {/* Error Banner */}
              {errorMsg !== '' && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              )}

              {/* STEP 1: Verify Identity */}
              {step === 1 && (
                <View>
                  <Text style={styles.cardSubtitle}>
                    {method === 'email' 
                      ? 'Verify your email to reset your password.' 
                      : 'Verify your phone number to reset your password.'
                    }
                  </Text>

                  {/* Input box */}
                  {method === 'email' ? (
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Email Address</Text>
                      <View style={styles.inputWrapper}>
                        <View style={styles.inputIcon}>
                          <EmailIcon />
                        </View>
                        <TextInput
                          style={styles.input}
                          value={email}
                          onChangeText={(text) => {
                            setEmail(text);
                            setIsVerified(false);
                            setOtpSent(false);
                            setOtpCode('');
                            setStatusMsg('');
                          }}
                          placeholder="Enter email address"
                          placeholderTextColor="#94A3B8"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          editable={!isVerified}
                        />
                        {isVerified && (
                          <View style={styles.verifiedCheckWrapper}>
                            <GreenTickIcon />
                          </View>
                        )}
                      </View>
                    </View>
                  ) : (
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Phone Number</Text>
                      <View style={styles.inputWrapper}>
                        <View style={styles.inputIcon}>
                          <PhoneIcon />
                        </View>
                        <TextInput
                          style={styles.input}
                          value={phone}
                          onChangeText={(text) => {
                            setPhone(text);
                            setIsVerified(false);
                            setOtpSent(false);
                            setOtpCode('');
                            setStatusMsg('');
                          }}
                          placeholder="Enter phone number"
                          placeholderTextColor="#94A3B8"
                          keyboardType="phone-pad"
                          editable={!isVerified}
                        />
                        {isVerified && (
                          <View style={styles.verifiedCheckWrapper}>
                            <GreenTickIcon />
                          </View>
                        )}
                      </View>
                    </View>
                  )}

                  {/* OTP Send/Verify UI */}
                  <View style={styles.otpSection}>
                    {!isVerified && (
                      <>
                        {otpSent ? (
                          <View style={styles.otpInputContainer}>
                            <View style={styles.inputWrapper}>
                              <View style={styles.inputIcon}>
                                <LockIcon />
                              </View>
                              <TextInput
                                style={styles.input}
                                value={otpCode}
                                onChangeText={setOtpCode}
                                placeholder="Enter 6-digit OTP"
                                placeholderTextColor="#94A3B8"
                                keyboardType="number-pad"
                                maxLength={6}
                              />
                            </View>
                            <View style={styles.otpButtonRow}>
                              <TouchableOpacity 
                                style={styles.otpVerifyButton} 
                                onPress={handleVerifyOtp}
                                activeOpacity={0.85}
                              >
                                <Text style={styles.otpVerifyButtonText}>Verify OTP</Text>
                              </TouchableOpacity>
                              <TouchableOpacity 
                                style={styles.otpResendButton} 
                                onPress={handleSendOtp}
                                activeOpacity={0.85}
                              >
                                <Text style={styles.otpResendButtonText}>Resend</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : (
                          <TouchableOpacity 
                            style={styles.otpSendButton} 
                            onPress={handleSendOtp}
                            activeOpacity={0.85}
                          >
                            <Text style={styles.otpSendButtonText}>
                              {method === 'email' ? 'Send Email OTP' : 'Send SMS OTP'}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                    {statusMsg !== '' && (
                      <Text style={[
                        styles.statusText,
                        isStatusError ? styles.statusError : styles.statusSuccess
                      ]}>
                        {statusMsg}
                      </Text>
                    )}
                  </View>

                  {/* Next Action Button */}
                  <TouchableOpacity 
                    style={[styles.nextButton, !isVerified && styles.buttonDisabled]} 
                    onPress={handleNextStep}
                    activeOpacity={0.85}
                    disabled={!isVerified}
                  >
                    <Text style={styles.nextButtonText}>Next ➔</Text>
                  </TouchableOpacity>

                  {/* Try Another Way Option */}
                  <TouchableOpacity 
                    style={styles.switchMethodButton}
                    onPress={handleSwitchMethod}
                  >
                    <Text style={styles.switchMethodText}>
                      Try another way with {method === 'email' ? 'Phone Number' : 'Email Address'}
                    </Text>
                  </TouchableOpacity>

                  {/* Back to Login Option */}
                  <TouchableOpacity 
                    style={styles.backToLoginLink}
                    onPress={onBackToSignIn}
                  >
                    <Text style={styles.backToLoginLinkText}>
                      Back to Login
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* STEP 2: Choose New Password */}
              {step === 2 && (
                <View>
                  <Text style={styles.cardSubtitle}>
                    Enter your new password and satisfy all requirements to update.
                  </Text>

                  {/* Password Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>New Password</Text>
                    <View style={styles.inputWrapper}>
                      <View style={styles.inputIcon}>
                        <LockIcon />
                      </View>
                      <TextInput
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Enter new password"
                        placeholderTextColor="#94A3B8"
                        secureTextEntry={!showNewPassword}
                        autoCapitalize="none"
                      />
                      <TouchableOpacity 
                        style={styles.eyeButton} 
                        onPress={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Password Constraints List */}
                  <View style={styles.constraintsContainer}>
                    <View style={styles.constraintRow}>
                      <View style={styles.constraintIcon}>
                        {isMinLength ? <TinyGreenCheckIcon /> : <RedCrossIcon />}
                      </View>
                      <Text style={[styles.constraintText, isMinLength ? styles.constraintTextActive : styles.constraintTextInactive]}>
                        Minimum 8 characters
                      </Text>
                    </View>
                    <View style={styles.constraintRow}>
                      <View style={styles.constraintIcon}>
                        {hasNumber ? <TinyGreenCheckIcon /> : <RedCrossIcon />}
                      </View>
                      <Text style={[styles.constraintText, hasNumber ? styles.constraintTextActive : styles.constraintTextInactive]}>
                        Atleast 1 number (1-9)
                      </Text>
                    </View>
                    <View style={styles.constraintRow}>
                      <View style={styles.constraintIcon}>
                        {hasLetter ? <TinyGreenCheckIcon /> : <RedCrossIcon />}
                      </View>
                      <Text style={[styles.constraintText, hasLetter ? styles.constraintTextActive : styles.constraintTextInactive]}>
                        Atleast lowercase or uppercase letters
                      </Text>
                    </View>
                  </View>

                  {/* Confirm Password Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirm New Password</Text>
                    <View style={styles.inputWrapper}>
                      <View style={styles.inputIcon}>
                        <LockIcon />
                      </View>
                      <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Re-enter password"
                        placeholderTextColor="#94A3B8"
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                      />
                      <TouchableOpacity 
                        style={styles.eyeButton} 
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Confirm Action Button */}
                  <TouchableOpacity 
                    style={styles.confirmButton} 
                    onPress={handleResetPasswordSubmit}
                    activeOpacity={0.85}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.confirmButtonText}>Confirm Password</Text>
                    )}
                  </TouchableOpacity>

                  {/* Back to Login Option */}
                  <TouchableOpacity 
                    style={styles.backToLoginLink}
                    onPress={onBackToSignIn}
                  >
                    <Text style={styles.backToLoginLinkText}>
                      Back to Login
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* STEP 3: Success Screen */}
              {step === 3 && (
                <View style={styles.successContainer}>
                  <View style={styles.illustrationWrapper}>
                    <ShieldCheckIllustration />
                  </View>

                  <Text style={styles.successTitle}>Password Updated!</Text>
                  <Text style={styles.successSubtitle}>
                    Your password has been updated successfully. You can now sign in with your new password.
                  </Text>

                  {/* Back to Sign In button */}
                  <TouchableOpacity 
                    style={styles.backToSignInButton} 
                    onPress={onBackToSignIn}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.backToSignInButtonText}>Back to Sign-in</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Footer */}
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
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#334E68',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 14,
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
    height: 50,
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
  otpSection: {
    marginTop: 2,
    marginBottom: 14,
  },
  otpSendButton: {
    width: '100%',
    height: 44,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#03254C',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  otpSendButtonText: {
    color: '#03254C',
    fontSize: 14,
    fontWeight: '700',
  },
  otpInputContainer: {
    gap: 8,
  },
  otpButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  otpVerifyButton: {
    flex: 2,
    height: 44,
    backgroundColor: '#7DBE14',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpVerifyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  otpResendButton: {
    flex: 1,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#94A3B8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpResendButtonText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  statusError: {
    color: '#DC2626',
  },
  statusSuccess: {
    color: '#16A34A',
  },
  verifiedCheckWrapper: {
    paddingRight: 16,
    justifyContent: 'center',
  },
  nextButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#03254C',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  switchMethodButton: {
    alignSelf: 'center',
    marginTop: 18,
    marginBottom: 6,
    paddingVertical: 4,
  },
  switchMethodText: {
    fontSize: 13.5,
    color: '#1E40AF',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  constraintsContainer: {
    paddingHorizontal: 6,
    marginBottom: 14,
    gap: 6,
  },
  constraintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  constraintIcon: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  constraintText: {
    fontSize: 13,
    fontWeight: '600',
  },
  constraintTextActive: {
    color: '#3B5A80',
  },
  constraintTextInactive: {
    color: '#64748B',
  },
  confirmButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#03254C',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  illustrationWrapper: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#03254C',
    textAlign: 'center',
    marginBottom: 14,
  },
  successSubtitle: {
    fontSize: 14.5,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 28,
  },
  backToSignInButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#03254C',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  backToSignInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  errorBanner: {
    backgroundColor: '#F1A9B2',
    borderWidth: 1.2,
    borderColor: '#E25B6C',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  errorText: {
    color: '#5C1D24',
    fontSize: 13,
    fontWeight: '600',
  },
  backToLoginLink: {
    alignSelf: 'center',
    marginTop: 14,
    marginBottom: 6,
    paddingVertical: 4,
  },
  backToLoginLinkText: {
    fontSize: 13.5,
    color: '#03254C',
    fontWeight: '700',
    textDecorationLine: 'underline',
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
});
