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
import { supabase } from '../lib/supabase';
import DatePickerModal from '../components/DatePickerModal';

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

const PhoneIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
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

const CalendarIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Path d="M16 2L16 6" />
    <Path d="M8 2L8 6" />
    <Path d="M3 10L21 10" />
  </Svg>
);

const EmailIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <Path d="M22 6L12 13L2 6" />
  </Svg>
);

const AtIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="4" />
    <Path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
  </Svg>
);

const StepIndicator = ({ currentStep }) => {
  return (
    <View style={styles.stepIndicatorContainer}>
      {/* Step 1 */}
      <View style={[styles.stepDot, currentStep >= 1 ? styles.stepDotActive : styles.stepDotInactive]}>
        {currentStep > 1 ? (
          <Svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3">
            <Path d="M20 6L9 17l-5-5" />
          </Svg>
        ) : (
          <Text style={styles.stepDotText}>1</Text>
        )}
      </View>
      <View style={[styles.stepLine, currentStep >= 2 ? styles.stepLineActive : styles.stepLineInactive]} />
      
      {/* Step 2 */}
      <View style={[styles.stepDot, currentStep >= 2 ? styles.stepDotActive : styles.stepDotInactive]}>
        {currentStep > 2 ? (
          <Svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3">
            <Path d="M20 6L9 17l-5-5" />
          </Svg>
        ) : (
          <Text style={styles.stepDotText}>2</Text>
        )}
      </View>
      <View style={[styles.stepLine, currentStep >= 3 ? styles.stepLineActive : styles.stepLineInactive]} />
      
      {/* Step 3 */}
      <View style={[styles.stepDot, currentStep >= 3 ? styles.stepDotActive : styles.stepDotInactive]}>
        <Text style={styles.stepDotText}>3</Text>
      </View>
    </View>
  );
};

export default function SignUpScreen({ onSignIn, onSignUpSuccess, onBack, showAlert }) {
  // Step State
  const [step, setStep] = useState(1);

  // Step 1 States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [otpSent, setOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [phoneVerificationMsg, setPhoneVerificationMsg] = useState('');
  const [isPhoneStatusError, setIsPhoneStatusError] = useState(false);

  // Step 2 States
  const [dob, setDob] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [emailOtpCode, setEmailOtpCode] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailVerificationMsg, setEmailVerificationMsg] = useState('');
  const [isEmailStatusError, setIsEmailStatusError] = useState(false);

  // Step 3 States
  const [username, setUsername] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatusMsg, setUsernameStatusMsg] = useState('');
  const [isUsernameError, setIsUsernameError] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Simulated Functions (Phone)
  const handleSendPhoneOtp = () => {
    if (!phone || phone.trim().length < 8) {
      setPhoneVerificationMsg('Please enter a valid phone number.');
      setIsPhoneStatusError(true);
      return;
    }
    setPhoneVerificationMsg('SMS code sent! (Use 123456 for testing)');
    setIsPhoneStatusError(false);
    setOtpSent(true);
  };

  const handleVerifyPhoneOtp = () => {
    if (otpCode === '123456') {
      setIsPhoneVerified(true);
      setPhoneVerificationMsg('Phone number verified successfully!');
      setIsPhoneStatusError(false);
      setOtpSent(false);
      setErrorMsg('');
    } else {
      setPhoneVerificationMsg('Invalid OTP code. Please try again.');
      setIsPhoneStatusError(true);
    }
  };

  // OTP Simulated Functions (Email)
  const handleSendEmailOtp = () => {
    if (!email || !email.includes('@')) {
      setEmailVerificationMsg('Please enter a valid email address.');
      setIsEmailStatusError(true);
      return;
    }
    setEmailVerificationMsg('Email verification code sent! (Use 123456)');
    setIsEmailStatusError(false);
    setEmailOtpSent(true);
  };

  const handleVerifyEmailOtp = () => {
    if (emailOtpCode === '123456') {
      setIsEmailVerified(true);
      setEmailVerificationMsg('Email verified successfully!');
      setIsEmailStatusError(false);
      setEmailOtpSent(false);
      setErrorMsg('');
    } else {
      setEmailVerificationMsg('Invalid code. Please try again.');
      setIsEmailStatusError(true);
    }
  };

  // DOB Formatter (DD/MM/YYYY)
  const handleDobChange = (text) => {
    const clean = text.replace(/[^0-9]/g, '');
    let formatted = clean;
    if (clean.length > 2 && clean.length <= 4) {
      formatted = `${clean.slice(0, 2)}/${clean.slice(2)}`;
    } else if (clean.length > 4) {
      formatted = `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4, 8)}`;
    }
    setDob(formatted);
  };

  // Username Availability Checking
  const checkUsernameAvailability = () => {
    if (!username || username.trim().length < 3) {
      setUsernameStatusMsg('Username must be at least 3 characters.');
      setIsUsernameError(true);
      setIsUsernameAvailable(false);
      return;
    }
    setIsCheckingUsername(true);
    setTimeout(() => {
      setIsCheckingUsername(false);
      const lower = username.toLowerCase();
      if (lower === 'admin' || lower === 'error' || lower === 'taken') {
        setUsernameStatusMsg('Username is already taken.');
        setIsUsernameError(true);
        setIsUsernameAvailable(false);
      } else {
        setUsernameStatusMsg('Username allocated!');
        setIsUsernameError(false);
        setIsUsernameAvailable(true);
        setErrorMsg('');
      }
    }, 800);
  };

  // Generate 3 username suggestions based on Full Name
  const generateUsernameSuggestions = (fullName) => {
    if (!fullName) return ['user_tas', 'tas_member', 'accountant_tas'];
    const cleanName = fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const randomNum = Math.floor(100 + Math.random() * 900);
    const year = new Date().getFullYear();
    
    return [
      `${cleanName}_tas`,
      `${cleanName}.${randomNum}`,
      `${cleanName}_${year}`
    ];
  };

  // Step 1 validation & next
  const handleNextStep1 = () => {
    if (!name || !phone || !password || !confirmPassword) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    if (!isPhoneVerified) {
      setErrorMsg('Please verify your phone number first.');
      return;
    }
    // Password Strength Verification
    const isMinLength = password.length >= 8;
    const hasNumber = /[0-9]/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    if (!isMinLength || !hasNumber || !hasLetter) {
      setErrorMsg('Please satisfy all password strength requirements.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  // Step 2 validation & next
  const handleNextStep2 = () => {
    if (!dob || !gender || !email) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    if (dob.length < 10) {
      setErrorMsg('Please enter a valid Date of Birth (DD/MM/YYYY).');
      return;
    }
    if (!isEmailVerified) {
      setErrorMsg('Please verify your email first.');
      return;
    }
    setErrorMsg('');
    setSuggestions(generateUsernameSuggestions(name));
    setStep(3);
  };

  // Step 3 final submit
  const handleFinalSignUp = async () => {
    if (!username) {
      setErrorMsg('Please choose a username.');
      return;
    }
    if (!isUsernameAvailable) {
      setErrorMsg('Please check username availability first.');
      return;
    }
    setErrorMsg('');

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSignUpSuccess({
        name,
        email,
        phone,
        password,
        username
      });
    }, 1200);
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
              <Text style={styles.headerTitle}>Welcome</Text>
            </View>

            {/* Input Card Container */}
            <View style={styles.card}>
              <StepIndicator currentStep={step} />
              
              <Text style={styles.cardTitle}>
                {step === 1 ? 'Personal Info' : step === 2 ? 'Verification' : 'Choose Account'}
              </Text>

              {/* Error Warning */}
              {errorMsg !== '' && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              )}

              {/* STEP 1: Personal Info */}
              {step === 1 && (
                <View>
                  {/* Name Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputWrapper}>
                      <View style={styles.inputIcon}>
                        <ProfileIcon />
                      </View>
                      <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter full name"
                        placeholderTextColor="#94A3B8"
                      />
                    </View>
                  </View>

                  {/* Phone Input */}
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
                          setIsPhoneVerified(false);
                          setOtpSent(false);
                          setOtpCode('');
                          setPhoneVerificationMsg('');
                        }}
                        placeholder="Enter phone number"
                        placeholderTextColor="#94A3B8"
                        keyboardType="phone-pad"
                        editable={!isPhoneVerified}
                      />
                      {isPhoneVerified && (
                        <View style={styles.verifiedCheckWrapper}>
                          <GreenTickIcon />
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Phone OTP Section */}
                  <View style={styles.otpSection}>
                    {!isPhoneVerified && (
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
                                onPress={handleVerifyPhoneOtp}
                                activeOpacity={0.85}
                              >
                                <Text style={styles.otpVerifyButtonText}>Verify OTP</Text>
                              </TouchableOpacity>
                              <TouchableOpacity 
                                style={styles.otpResendButton} 
                                onPress={handleSendPhoneOtp}
                                activeOpacity={0.85}
                              >
                                <Text style={styles.otpResendButtonText}>Resend</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : (
                          <TouchableOpacity 
                            style={styles.otpSendButton} 
                            onPress={handleSendPhoneOtp}
                            activeOpacity={0.85}
                          >
                            <Text style={styles.otpSendButtonText}>Send OTP Code</Text>
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                    {phoneVerificationMsg !== '' && (
                      <Text style={[
                        styles.statusText,
                        isPhoneStatusError ? styles.statusError : styles.statusSuccess
                      ]}>
                        {phoneVerificationMsg}
                      </Text>
                    )}
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
                        onChangeText={setPassword}
                        placeholder="Enter password"
                        placeholderTextColor="#94A3B8"
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                      />
                      <TouchableOpacity 
                        style={styles.eyeButton} 
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Password Constraints List */}
                  <View style={styles.constraintsContainer}>
                    <View style={styles.constraintRow}>
                      <View style={styles.constraintIcon}>
                        {password.length >= 8 ? <TinyGreenCheckIcon /> : <RedCrossIcon />}
                      </View>
                      <Text style={[styles.constraintText, password.length >= 8 ? styles.constraintTextActive : styles.constraintTextInactive]}>
                        Minimum 8 characters
                      </Text>
                    </View>
                    <View style={styles.constraintRow}>
                      <View style={styles.constraintIcon}>
                        {/[0-9]/.test(password) ? <TinyGreenCheckIcon /> : <RedCrossIcon />}
                      </View>
                      <Text style={[styles.constraintText, /[0-9]/.test(password) ? styles.constraintTextActive : styles.constraintTextInactive]}>
                        Atleast 1 number (1-9)
                      </Text>
                    </View>
                    <View style={styles.constraintRow}>
                      <View style={styles.constraintIcon}>
                        {/[a-zA-Z]/.test(password) ? <TinyGreenCheckIcon /> : <RedCrossIcon />}
                      </View>
                      <Text style={[styles.constraintText, /[a-zA-Z]/.test(password) ? styles.constraintTextActive : styles.constraintTextInactive]}>
                        Atleast lowercase or uppercase letters
                      </Text>
                    </View>
                  </View>

                  {/* Confirm Password Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={styles.inputWrapper}>
                      <View style={styles.inputIcon}>
                        <LockIcon />
                      </View>
                      <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm password"
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

                  {/* Next Button */}
                  <TouchableOpacity 
                    style={styles.signUpButton} 
                    onPress={handleNextStep1}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.signUpButtonText}>Next ➔</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* STEP 2: DOB, Gender, Email Verification */}
              {step === 2 && (
                <View>
                  {/* DOB Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Date of Birth</Text>
                    <TouchableOpacity 
                      style={styles.inputWrapper}
                      onPress={() => setShowDatePicker(true)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.inputIcon}>
                        <CalendarIcon />
                      </View>
                      <TextInput
                        style={styles.input}
                        value={dob}
                        placeholder="Select Date of Birth"
                        placeholderTextColor="#94A3B8"
                        editable={false}
                        pointerEvents="none"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Gender Selector */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.genderContainer}>
                      {['Male', 'Female', 'Others', 'Prefer not to say'].map((opt) => {
                        const isSelected = gender === opt;
                        return (
                          <TouchableOpacity
                            key={opt}
                            style={[
                              styles.genderChip,
                              isSelected ? styles.genderChipSelected : styles.genderChipUnselected
                            ]}
                            onPress={() => setGender(opt)}
                          >
                            <Text style={[
                              styles.genderChipText,
                              isSelected ? styles.genderChipTextSelected : styles.genderChipTextUnselected
                            ]}>
                              {opt}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* Email Input */}
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
                          setIsEmailVerified(false);
                          setEmailOtpSent(false);
                          setEmailOtpCode('');
                          setEmailVerificationMsg('');
                        }}
                        placeholder="Enter email address"
                        placeholderTextColor="#94A3B8"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!isEmailVerified}
                      />
                      {isEmailVerified && (
                        <View style={styles.verifiedCheckWrapper}>
                          <GreenTickIcon />
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Email OTP Section */}
                  <View style={styles.otpSection}>
                    {!isEmailVerified && (
                      <>
                        {emailOtpSent ? (
                          <View style={styles.otpInputContainer}>
                            <View style={styles.inputWrapper}>
                              <View style={styles.inputIcon}>
                                <LockIcon />
                              </View>
                              <TextInput
                                style={styles.input}
                                value={emailOtpCode}
                                onChangeText={setEmailOtpCode}
                                placeholder="Enter 6-digit code"
                                placeholderTextColor="#94A3B8"
                                keyboardType="number-pad"
                                maxLength={6}
                              />
                            </View>
                            <View style={styles.otpButtonRow}>
                              <TouchableOpacity 
                                style={styles.otpVerifyButton} 
                                onPress={handleVerifyEmailOtp}
                                activeOpacity={0.85}
                              >
                                <Text style={styles.otpVerifyButtonText}>Verify Email</Text>
                              </TouchableOpacity>
                              <TouchableOpacity 
                                style={styles.otpResendButton} 
                                onPress={handleSendEmailOtp}
                                activeOpacity={0.85}
                              >
                                <Text style={styles.otpResendButtonText}>Resend</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : (
                          <TouchableOpacity 
                            style={styles.otpSendButton} 
                            onPress={handleSendEmailOtp}
                            activeOpacity={0.85}
                          >
                            <Text style={styles.otpSendButtonText}>Send OTP Code</Text>
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                    {emailVerificationMsg !== '' && (
                      <Text style={[
                        styles.statusText,
                        isEmailStatusError ? styles.statusError : styles.statusSuccess
                      ]}>
                        {emailVerificationMsg}
                      </Text>
                    )}
                  </View>

                  {/* Back / Next Row */}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity 
                      style={styles.backButton} 
                      onPress={() => setStep(1)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.nextButton} 
                      onPress={handleNextStep2}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.nextButtonText}>Next ➔</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* STEP 3: Choose Username */}
              {step === 3 && (
                <View>
                  {/* Username Custom Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Choose Username</Text>
                    <View style={styles.inputWrapper}>
                      <View style={styles.inputIcon}>
                        <AtIcon />
                      </View>
                      <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={(text) => {
                          setUsername(text.replace(/[^a-zA-Z0-9_.]/g, ''));
                          setIsUsernameAvailable(null);
                          setUsernameStatusMsg('');
                        }}
                        placeholder="Enter custom username"
                        placeholderTextColor="#94A3B8"
                        autoCapitalize="none"
                      />
                      {isUsernameAvailable && (
                        <View style={styles.verifiedCheckWrapper}>
                          <GreenTickIcon />
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Check Availability Button */}
                  <View style={styles.otpSection}>
                    <TouchableOpacity 
                      style={styles.otpSendButton} 
                      onPress={checkUsernameAvailability}
                      activeOpacity={0.85}
                      disabled={isCheckingUsername}
                    >
                      {isCheckingUsername ? (
                        <ActivityIndicator color="#03254C" size="small" />
                      ) : (
                        <Text style={styles.otpSendButtonText}>Check Availability</Text>
                      )}
                    </TouchableOpacity>

                    {usernameStatusMsg !== '' && (
                      <Text style={[
                        styles.statusText,
                        isUsernameError ? styles.statusError : styles.statusSuccess
                      ]}>
                        {usernameStatusMsg}
                      </Text>
                    )}
                  </View>

                  {/* Username Suggestions */}
                  <View style={styles.suggestionsContainer}>
                    <Text style={styles.suggestionsTitle}>Suggested Choices:</Text>
                    <View style={styles.suggestionsRow}>
                      {suggestions.map((sug) => (
                        <TouchableOpacity
                          key={sug}
                          style={styles.suggestionPill}
                          onPress={() => {
                            setUsername(sug);
                            setIsUsernameAvailable(true);
                            setUsernameStatusMsg('Username allocated!');
                            setIsUsernameError(false);
                            setErrorMsg('');
                          }}
                        >
                          <Text style={styles.suggestionPillText}>{sug}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Back / Register Row */}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity 
                      style={styles.backButton} 
                      onPress={() => setStep(2)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.nextButton} 
                      onPress={handleFinalSignUp}
                      activeOpacity={0.85}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                      ) : (
                        <Text style={styles.nextButtonText}>Sign Up ➔</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Sign In Link */}
              <View style={styles.signInRow}>
                <Text style={styles.signInLabel}>Already have an account? </Text>
                <TouchableOpacity onPress={onSignIn}>
                  <Text style={styles.signInLink}>Sign In</Text>
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

      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={(selectedDate) => setDob(selectedDate)}
        currentValue={dob}
      />
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
    fontSize: 22,
    fontWeight: '800',
    color: '#03254C',
    textAlign: 'center',
    marginBottom: 20,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotActive: {
    backgroundColor: '#03254C',
  },
  stepDotInactive: {
    backgroundColor: '#94A3B8',
  },
  stepDotText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  stepLine: {
    flex: 1,
    height: 3,
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: '#03254C',
  },
  stepLineInactive: {
    backgroundColor: '#CBD5E1',
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
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  genderChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderChipSelected: {
    backgroundColor: '#03254C',
    borderColor: '#03254C',
  },
  genderChipUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  genderChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  genderChipTextSelected: {
    color: '#FFFFFF',
  },
  genderChipTextUnselected: {
    color: '#475569',
  },
  suggestionsContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  suggestionsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#03254C',
    marginBottom: 6,
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#94A3B8',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionPillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#03254C',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    marginBottom: 16,
  },
  backButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#03254C',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#03254C',
    fontSize: 16,
    fontWeight: '700',
  },
  nextButton: {
    flex: 1.5,
    height: 50,
    backgroundColor: '#03254C',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  signUpButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#03254C',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  signInLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
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
});
