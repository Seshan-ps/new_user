import React, { useState, useEffect } from 'react';
import { mockDb } from '../lib/mockDb';
import DatePickerModal from '../components/DatePickerModal';

let ImagePicker;
try {
  ImagePicker = require('expo-image-picker');
} catch (e) {
  console.log('Native ExponentImagePicker not found, using presets fallback.');
}

import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Platform,
  TextInput,
  Modal,
  StatusBar as RNStatusBar
} from 'react-native';
import Svg, { Path, Circle, Line, Polyline, Rect } from 'react-native-svg';

// Custom inline SVG icons for premium styling
const BackArrowIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#03254C" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="19" y1="12" x2="5" y2="12" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

const EditPencilIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A52C5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <Path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </Svg>
);

const PersonalIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A52C5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

const UserCardIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
    <Line x1="7" y1="8" x2="17" y2="8" />
    <Line x1="7" y1="12" x2="15" y2="12" />
    <Line x1="7" y1="16" x2="11" y2="16" />
  </Svg>
);

const PhoneIcon = ({ color = '#64748B', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

const MailIcon = ({ color = '#64748B', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <Polyline points="22,6 12,13 2,6" />
  </Svg>
);

const LocationPinIcon = ({ color = '#64748B', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Circle cx="12" cy="10" r="3" />
  </Svg>
);

const BriefcaseIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A52C5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <Path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </Svg>
);

const LockIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A52C5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

const SignOutIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <Polyline points="16 17 21 12 16 7" />
    <Line x1="21" y1="12" x2="9" y2="12" />
  </Svg>
);

const BadgeCheckIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="20 6 9 17 4 12" />
  </Svg>
);

const CameraPlusIcon = () => (
  <Svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0A52C5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <Circle cx="12" cy="13" r="4" />
    <Line x1="19" y1="8" x2="19" y2="14" />
    <Line x1="16" y1="11" x2="22" y2="11" />
  </Svg>
);

const QrIcon = ({ color = '#0A52C5', size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="3" width="7" height="7" />
    <Rect x="14" y="3" width="7" height="7" />
    <Rect x="14" y="14" width="7" height="7" />
    <Rect x="3" y="14" width="7" height="7" />
    <Line x1="7" y1="7" x2="7" y2="7" strokeWidth="3" />
    <Line x1="18" y1="7" x2="18" y2="7" strokeWidth="3" />
    <Line x1="7" y1="18" x2="7" y2="18" strokeWidth="3" />
    <Path d="M10 10h4v4h-4z" />
  </Svg>
);

const DigitalQrCode = ({ primaryColor = '#03254C', accentColor = '#7DBE14' }) => (
  <Svg width="120" height="120" viewBox="0 0 100 100" fill="none">
    <Rect x="0" y="0" width="25" height="25" fill={primaryColor} stroke={accentColor} strokeWidth="2" />
    <Rect x="5" y="5" width="15" height="15" fill={accentColor} />
    
    <Rect x="75" y="0" width="25" height="25" fill={primaryColor} stroke={accentColor} strokeWidth="2" />
    <Rect x="80" y="5" width="15" height="15" fill={accentColor} />
    
    <Rect x="0" y="75" width="25" height="25" fill={primaryColor} stroke={accentColor} strokeWidth="2" />
    <Rect x="5" y="80" width="15" height="15" fill={accentColor} />
    
    <Rect x="35" y="5" width="5" height="15" fill={primaryColor} />
    <Rect x="45" y="10" width="10" height="5" fill={primaryColor} />
    <Rect x="60" y="5" width="5" height="10" fill={primaryColor} />
    
    <Rect x="5" y="35" width="15" height="5" fill={primaryColor} />
    <Rect x="10" y="45" width="5" height="10" fill={primaryColor} />
    <Rect x="5" y="60" width="10" height="5" fill={primaryColor} />

    <Rect x="35" y="35" width="30" height="30" fill={primaryColor} stroke={accentColor} strokeWidth="1" />
    <Rect x="42" y="42" width="16" height="16" fill={accentColor} />
    <Circle cx="50" cy="50" r="5" fill="#ffffff" />
    
    <Rect x="75" y="35" width="15" height="5" fill={primaryColor} />
    <Rect x="85" y="45" width="5" height="15" fill={primaryColor} />
    <Rect x="80" y="65" width="10" height="5" fill={primaryColor} />
    
    <Rect x="35" y="75" width="10" height="5" fill={primaryColor} />
    <Rect x="50" y="80" width="5" height="10" fill={primaryColor} />
    <Rect x="40" y="90" width="15" height="5" fill={primaryColor} />

    <Rect x="75" y="75" width="5" height="5" fill={primaryColor} />
    <Rect x="85" y="80" width="10" height="5" fill={primaryColor} />
    <Rect x="90" y="90" width="5" height="5" fill={primaryColor} />
  </Svg>
);

const AVATAR_MAP = {
  'sarah_jenkins': require('../assets/avatar_sarah_jenkins.png'),
  'david_chen': require('../assets/avatar_david_chen.png'),
  'elena': require('../assets/avatar_elena.png'),
  'emily': require('../assets/avatar_emily.png'),
  'janice': require('../assets/avatar_janice.png'),
  'julian_vance': require('../assets/avatar_julian_vance.png'),
  'marcus': require('../assets/avatar_marcus.png'),
  'marcus_thornton': require('../assets/avatar_marcus_thornton.png'),
  'robert': require('../assets/avatar_robert.png'),
  'saja': require('../assets/avatar_saja.png'),
};

const PICKER_AVATARS = [
  { id: 'sarah_jenkins', name: 'Sarah J.' },
  { id: 'david_chen', name: 'David C.' },
  { id: 'elena', name: 'Elena' },
  { id: 'emily', name: 'Emily' },
  { id: 'janice', name: 'Janice' },
  { id: 'julian_vance', name: 'Julian V.' },
  { id: 'marcus', name: 'Marcus' },
  { id: 'marcus_thornton', name: 'Marcus T.' },
  { id: 'robert', name: 'Robert' },
  { id: 'saja', name: 'Saja' },
];

export default function ProfileScreen({ 
  onNavigate, 
  onLogout, 
  onForgotPassword,
  membershipPlan,
  setMembershipPlan,
  autopayEnabled,
  setAutopayEnabled,
  currentUser,
  setCurrentUser,
  directoryMembers,
  connectionStatuses,
  setConnectionStatuses,
  showAlert,
  safeAreaBottom = 0
}) {
  const pickImage = async () => {
    setShowFileGallery(true);
  };

  const takePhoto = async () => {
    try {
      if (!ImagePicker || !ImagePicker.launchCameraAsync || !ImagePicker.requestCameraPermissionsAsync) {
        showAlert('Device Camera is not available on this preview build.', 'Camera Not Available');
        return;
      }
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        showAlert('Camera permission is required to take a photo.', 'Permission Denied');
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const selectedUri = result.assets[0].uri;
        setTempImage(selectedUri);
        setShowImagePicker(false);
      }
    } catch (e) {
      showAlert('Failed to open Device Camera.', 'Camera Error');
    }
  };
  // Screen Mode State
  // 0 = View Profile, 1 = Edit Step 1/3, 2 = Edit Step 2/3, 3 = Edit Step 3/3
  const [editStep, setEditStep] = useState(0);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Main Profile State variables
  const [profileUsername, setProfileUsername] = useState('vgm');
  const [profileHeadline, setProfileHeadline] = useState('Chief Tax Consultant');
  const [aboutText, setAboutText] = useState('Experienced accounting professional.');
  const [accountType, setAccountType] = useState('Public');
  const [profileImage, setProfileImage] = useState('sarah_jenkins');

  const [personalName, setPersonalName] = useState('vgm');
  const [personalGender, setPersonalGender] = useState('Male');
  const [personalDob, setPersonalDob] = useState('');
  const [personalPhone, setPersonalPhone] = useState('9900887766');
  const [personalEmail, setPersonalEmail] = useState('vgm@gmail.com');
  const [personalCity, setPersonalCity] = useState('Coimbatore');
  const [personalState, setPersonalState] = useState('Tamil Nadu');
  const [personalAddress, setPersonalAddress] = useState('');

  const [profRole, setProfRole] = useState('Chief Tax Consultant');
  const [profCompany, setProfCompany] = useState('VGM & Associates');
  const [profExperience, setProfExperience] = useState('10 Years');
  const [profCompanyAddress, setProfCompanyAddress] = useState('');
  const [profMemberSince, setProfMemberSince] = useState('Jan 2026');
  const [profSpecialization, setProfSpecialization] = useState('Corporate Taxation & GST');

  // Connections Modal State
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);

  // OTP State for email/phone changes
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpVal, setOtpVal] = useState('');
  const [pendingStep2Data, setPendingStep2Data] = useState(null);
  const [otpTargetStep, setOtpTargetStep] = useState(0);

  // Load from currentUser prop
  useEffect(() => {
    if (currentUser) {
      setProfileUsername(currentUser.username ?? 'vgm');
      setProfileHeadline(currentUser.headline ?? '');
      setAboutText(currentUser.about ?? '');
      setProfileImage(currentUser.image ?? '');
      setPersonalName(currentUser.name ?? 'vgm');
      setPersonalGender(currentUser.gender ?? 'Male');
      setPersonalDob(currentUser.dob ?? '');
      setPersonalPhone(currentUser.phone ?? '9900887766');
      setPersonalEmail(currentUser.email ?? 'vgm@gmail.com');
      setPersonalCity(currentUser.city ?? '');
      setPersonalState(currentUser.state ?? '');
      setPersonalAddress(currentUser.address ?? '');

      setProfRole(currentUser.role ?? '');
      setProfCompany(currentUser.company ?? '');
      setProfExperience(currentUser.experience ?? '');
      setProfCompanyAddress(currentUser.companyAddress ?? '');
      setProfMemberSince(currentUser.memberSince ?? '');
      setProfSpecialization(currentUser.specialization ?? '');
    }
  }, [currentUser]);

  // Compute connection list
  const activeConnectionsList = (directoryMembers || []).filter(member => {
    return connectionStatuses[member.id] === 'connected';
  });

  // Temporary wizard state variables for editing
  const [tempUsername, setTempUsername] = useState('');
  const [tempHeadline, setTempHeadline] = useState('');
  const [tempAbout, setTempAbout] = useState('');
  const [tempAccountType, setTempAccountType] = useState('');
  const [tempImage, setTempImage] = useState('sarah_jenkins');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showFileGallery, setShowFileGallery] = useState(false);

  const [tempPersonalName, setTempPersonalName] = useState('');
  const [tempGender, setTempGender] = useState('');
  const [tempDob, setTempDob] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempPhone, setTempPhone] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [tempCity, setTempCity] = useState('');
  const [tempState, setTempState] = useState('');
  const [tempAddress, setTempAddress] = useState('');

  const [tempProfRole, setTempProfRole] = useState('');
  const [tempProfCompany, setTempProfCompany] = useState('');
  const [tempProfExperience, setTempProfExperience] = useState('');
  const [tempProfCompanyAddress, setTempProfCompanyAddress] = useState('');
  const [tempProfMemberSince, setTempProfMemberSince] = useState('');
  const [tempProfSpecialization, setTempProfSpecialization] = useState('');

  // Start edit wizard and populate values
  const startWizardStep = (stepNumber) => {
    setTempUsername(profileUsername);
    setTempHeadline(profileHeadline);
    setTempAbout(aboutText);
    setTempAccountType(accountType);
    setTempImage(profileImage);

    setTempPersonalName(personalName);
    setTempGender(personalGender);
    setTempDob(personalDob);
    setTempPhone(personalPhone);
    setTempEmail(personalEmail);
    setTempCity(personalCity);
    setTempState(personalState);
    setTempAddress(personalAddress);

    setTempProfRole(profRole);
    setTempProfCompany(profCompany);
    setTempProfExperience(profExperience);
    setTempProfCompanyAddress(profCompanyAddress);
    setTempProfMemberSince(profMemberSince);
    setTempProfSpecialization(profSpecialization);

    setEditStep(stepNumber);
  };

  // Card specific saves
  const saveStep1 = async () => {
    const cleanUser = tempUsername.trim().toLowerCase();
    if (cleanUser !== currentUser?.username?.toLowerCase()) {
      const isTaken = (directoryMembers || []).some(m => m.username?.toLowerCase() === cleanUser);
      if (isTaken) {
        showAlert('Username is already taken. Please choose another.', 'Error');
        return false;
      }
    }

    const updated = {
      username: tempUsername,
      headline: tempHeadline,
      about: tempAbout,
      accountType: tempAccountType,
      image: tempImage
    };
    const savedUser = await mockDb.updateUserProfile(currentUser.username, updated);
    if (savedUser) {
      await setCurrentUser(savedUser);
    } else {
      await setCurrentUser({ ...currentUser, ...updated });
    }
    setProfileUsername(tempUsername);
    setProfileHeadline(tempHeadline);
    setAboutText(tempAbout);
    setAccountType(tempAccountType);
    setProfileImage(tempImage);
    setEditStep(0);
    return true;
  };

  const saveStep2 = (targetStep = 0) => {
    const isPhoneChanged = tempPhone !== personalPhone;
    const isEmailChanged = tempEmail !== personalEmail;

    if (isPhoneChanged || isEmailChanged) {
      setPendingStep2Data({
        name: tempPersonalName,
        gender: tempGender,
        dob: tempDob,
        phone: tempPhone,
        email: tempEmail,
        city: tempCity,
        state: tempState,
        address: tempAddress
      });
      setOtpVal('');
      setOtpTargetStep(targetStep);
      setShowOtpVerification(true);
    } else {
      performSaveStep2({
        name: tempPersonalName,
        gender: tempGender,
        dob: tempDob,
        phone: tempPhone,
        email: tempEmail,
        city: tempCity,
        state: tempState,
        address: tempAddress
      }, targetStep);
      showAlert('Saved Step 2 details!', 'Success');
    }
  };

  const performSaveStep2 = async (data, targetStep) => {
    const savedUser = await mockDb.updateUserProfile(currentUser.username, data);
    if (savedUser) {
      await setCurrentUser(savedUser);
    } else {
      await setCurrentUser({ ...currentUser, ...data });
    }
    setPersonalName(data.name);
    setPersonalGender(data.gender);
    setPersonalDob(data.dob);
    setPersonalPhone(data.phone);
    setPersonalEmail(data.email);
    setPersonalCity(data.city);
    setPersonalState(data.state);
    setPersonalAddress(data.address);
    setEditStep(targetStep);
  };

  const handleVerifyStep2Otp = () => {
    if (otpVal === '123456') {
      setShowOtpVerification(false);
      if (pendingStep2Data) {
        performSaveStep2(pendingStep2Data, otpTargetStep);
        showAlert('Verification successful! Profile updated.', 'Success');
      }
    } else {
      showAlert('Invalid OTP code. Please enter 123456.', 'Error');
    }
  };

  const saveStep3 = async () => {
    const updated = {
      role: tempProfRole,
      company: tempProfCompany,
      experience: tempProfExperience,
      companyAddress: tempProfCompanyAddress,
      memberSince: tempProfMemberSince,
      specialization: tempProfSpecialization
    };
    const savedUser = await mockDb.updateUserProfile(currentUser.username, updated);
    if (savedUser) {
      await setCurrentUser(savedUser);
    } else {
      await setCurrentUser({ ...currentUser, ...updated });
    }
    setProfRole(tempProfRole);
    setProfCompany(tempProfCompany);
    setProfExperience(tempProfExperience);
    setProfCompanyAddress(tempProfCompanyAddress);
    setProfMemberSince(tempProfMemberSince);
    setProfSpecialization(tempProfSpecialization);
    setEditStep(0);
  };

  // Section completeness calculations
  const isStep1Complete = profileUsername.trim() !== '' && profileHeadline.trim() !== '' && aboutText.trim() !== '';
  const isStep2Complete = personalName.trim() !== '' && personalPhone.trim() !== '' && personalEmail.trim() !== '' && personalCity.trim() !== '' && personalState.trim() !== '';
  const isStep3Complete = profRole.trim() !== '' && profCompany.trim() !== '' && profExperience.trim() !== '' && profMemberSince.trim() !== '' && profSpecialization.trim() !== '';

  let completedCount = 0;
  if (isStep1Complete) completedCount += 1;
  if (isStep2Complete) completedCount += 1;
  if (isStep3Complete) completedCount += 1;

  // Render main profile screen view
  const renderProfileView = () => (
    <View style={styles.screenWrapper}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('home')}>
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Top Profile Section Card */}
        <View style={styles.profileHeaderSection}>
          <View style={styles.profileRow}>
            {/* Avatar Image or Initials */}
            {!profileImage || profileImage === '' ? (
              <View style={styles.avatarCirclePlaceholder}>
                <Text style={styles.avatarLetterPlaceholder}>
                  {profileUsername ? profileUsername.charAt(0).toUpperCase() : (personalName ? personalName.charAt(0).toUpperCase() : 'U')}
                </Text>
              </View>
            ) : (
              <Image 
                source={
                  typeof profileImage === 'string' && AVATAR_MAP[profileImage]
                    ? AVATAR_MAP[profileImage]
                    : { uri: profileImage }
                } 
                style={styles.avatarImage} 
              />
            )}
            {/* User Meta */}
            <View style={styles.profileMeta}>
              <Text style={styles.profileNameText}>{profileUsername}</Text>
              <Text style={styles.profileSubtitleText}>{profileHeadline}</Text>
              <TouchableOpacity onPress={() => setShowConnectionsModal(true)}>
                <Text style={[styles.connectionsText, { color: '#16A34A', fontWeight: '800', textDecorationLine: 'underline' }]}>
                  {activeConnectionsList.length} connections
                </Text>
              </TouchableOpacity>
              
              <View style={styles.badgeWrapper}>
                <TouchableOpacity 
                  style={styles.memberBadge} 
                  onPress={() => onNavigate('membership')}
                  activeOpacity={0.8}
                >
                  <BadgeCheckIcon />
                  <Text style={styles.memberBadgeText}>Platinum Member</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.idRowContainer}>
            <Text style={styles.idText}>ID: {currentUser?.idCode || 'TAS-2026-00000'}</Text>
            <TouchableOpacity 
              style={styles.qrIdButton} 
              onPress={() => setShowQrModal(true)}
            >
              <QrIcon color="#0A52C5" size={16} />
            </TouchableOpacity>
          </View>

          {/* Complete your profile bar */}
          {completedCount < 3 && (
            <TouchableOpacity 
              style={styles.completeProfileBar} 
              activeOpacity={0.8}
              onPress={() => {
                if (!isStep1Complete) {
                  startWizardStep(1);
                } else if (!isStep2Complete) {
                  startWizardStep(2);
                } else if (!isStep3Complete) {
                  startWizardStep(3);
                }
              }}
            >
              <Text style={styles.completeProfileText}>✨ Enhance your profile</Text>
              <Text style={styles.completeProfileFraction}>{completedCount}/3 Completed</Text>
            </TouchableOpacity>
          )}
          
          {/* About Section */}
          <Text style={styles.aboutHeader}>ABOUT</Text>
          <View style={styles.aboutContainer}>
            <Text style={styles.aboutContent}>
              {isAboutExpanded 
                ? aboutText 
                : 'Experienced accounting professional specializing in taxation, auditing....'}
            </Text>
            <TouchableOpacity onPress={() => setIsAboutExpanded(!isAboutExpanded)} style={styles.moreAboutLink}>
              <Text style={styles.moreAboutLinkText}>{isAboutExpanded ? '... less' : '... more'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 1: Personal Information */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderTitleRow}>
              <PersonalIcon />
              <Text style={styles.cardHeaderTitle}>PERSONAL INFORMATION</Text>
            </View>
            <TouchableOpacity onPress={() => startWizardStep(1)}>
              <EditPencilIcon />
            </TouchableOpacity>
          </View>
          
          <View style={styles.divider} />
          
          {/* Read Only Rows */}
          <View style={styles.infoRow}>
            <View style={styles.rowIconContainer}>
              <UserCardIcon />
            </View>
            <View style={styles.rowTextContainer}>
              <Text style={styles.rowLabel}>Full Name</Text>
              <Text style={styles.rowValue}>{personalName || <Text style={styles.emptyPlaceholder}>Not entered yet</Text>}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.rowIconContainer}>
              <PhoneIcon />
            </View>
            <View style={styles.rowTextContainer}>
              <Text style={styles.rowLabel}>Mobile Number</Text>
              <Text style={styles.rowValue}>{personalPhone || <Text style={styles.emptyPlaceholder}>Not entered yet</Text>}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.rowIconContainer}>
              <MailIcon />
            </View>
            <View style={styles.rowTextContainer}>
              <Text style={styles.rowLabel}>Email Address</Text>
              <Text style={styles.rowValue}>{personalEmail || <Text style={styles.emptyPlaceholder}>Not entered yet</Text>}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.rowIconContainer}>
              <LocationPinIcon />
            </View>
            <View style={styles.rowTextContainer}>
              <Text style={styles.rowLabel}>City, State</Text>
              <Text style={styles.rowValue}>
                {(personalCity || personalState) ? `${personalCity}, ${personalState}` : <Text style={styles.emptyPlaceholder}>Not entered yet</Text>}
              </Text>
            </View>
          </View>
        </View>

        {/* Card 2: Professional Profile */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderTitleRow}>
              <BriefcaseIcon />
              <Text style={styles.cardHeaderTitle}>PROFESSIONAL PROFILE</Text>
            </View>
            <TouchableOpacity onPress={() => startWizardStep(3)}>
              <EditPencilIcon />
            </TouchableOpacity>
          </View>
          
          <View style={styles.divider} />

          {/* Read Only Rows */}
          <View style={styles.professionalRow}>
            <Text style={styles.rowLabel}>Current Role</Text>
            <Text style={styles.rowValue}>
              {profRole ? `${profRole}${profCompany ? ` at ${profCompany}` : ''}` : <Text style={styles.emptyPlaceholder}>Not entered yet</Text>}
            </Text>
          </View>

          <View style={styles.columnsRow}>
            <View style={styles.columnItem}>
              <Text style={styles.rowLabel}>Experience</Text>
              <Text style={styles.rowValue}>{profExperience || <Text style={styles.emptyPlaceholder}>Not entered yet</Text>}</Text>
            </View>
            
            <View style={styles.columnItem}>
              <Text style={styles.rowLabel}>TAS Member Since</Text>
              <Text style={styles.rowValue}>{profMemberSince || <Text style={styles.emptyPlaceholder}>Not entered yet</Text>}</Text>
            </View>
          </View>

          <View style={styles.professionalRow}>
            <Text style={styles.rowLabel}>Specialization</Text>
            <Text style={styles.rowValue}>{profSpecialization || <Text style={styles.emptyPlaceholder}>Not entered yet</Text>}</Text>
          </View>
        </View>

        {/* Card 3: Membership Details */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderTitleRow}>
              <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A52C5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </Svg>
              <Text style={styles.cardHeaderTitle}>MEMBERSHIP & PLAN</Text>
            </View>
          </View>
          
          <View style={styles.divider} />

          <View style={styles.membershipDetailsRow}>
            <View style={styles.platinumBadge}>
              <BadgeCheckIcon />
              <Text style={styles.platinumBadgeText}>{membershipPlan} Member</Text>
            </View>
            <View style={styles.validityContainer}>
              <Text style={styles.validityLabel}>Valid Until</Text>
              <Text style={styles.validityValue}>31 Dec 2026</Text>
            </View>
          </View>

          {membershipPlan !== 'Lifetime' && (
            <View style={styles.autopayStatusWrapper}>
              <Text style={styles.autopayStatusLabel}>Autopay Status</Text>
              <View style={styles.autopayStatusRow}>
                <Text style={[styles.autopayStatusText, autopayEnabled ? styles.autopayActiveText : styles.autopayInactiveText]}>
                  {autopayEnabled ? 'Enabled (Renews automatically)' : 'Disabled'}
                </Text>
                <TouchableOpacity 
                  style={[styles.autopayActionBtn, autopayEnabled ? styles.autopayActionBtnCancel : styles.autopayActionBtnEnable]}
                  onPress={() => {
                    if (autopayEnabled) {
                      setAutopayEnabled(false);
                      showAlert('Autopay has been cancelled. Your membership will expire on 31 Dec 2026.', 'Autopay Cancelled');
                    } else {
                      setAutopayEnabled(true);
                      showAlert('Autopay has been enabled. Your subscription will automatically renew.', 'Autopay Enabled');
                    }
                  }}
                >
                  <Text style={autopayEnabled ? styles.autopayActionBtnTextCancel : styles.autopayActionBtnTextEnable}>
                    {autopayEnabled ? 'Cancel Autopay' : 'Enable Autopay'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity 
            style={styles.updatePlanBtnProfile} 
            onPress={() => onNavigate('membership')}
          >
            <Text style={styles.updatePlanBtnProfileText}>Update Plan / View Details</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Actions Row */}
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.changePasswordBtn} 
            onPress={onForgotPassword}
          >
            <LockIcon />
            <Text style={styles.changePasswordBtnText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutBtn} onPress={onLogout}>
            <SignOutIcon />
            <Text style={styles.signOutBtnText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* QR Code / E-Visiting Card Modal */}
      <Modal
        visible={showQrModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQrModal(false)}
      >
        <View style={styles.qrModalOverlay}>
          <View style={styles.qrCardContainer}>
            {/* Visiting Card Background Deco */}
            <View style={styles.qrCardDecoRing1} />
            <View style={styles.qrCardDecoRing2} />

            {/* Header */}
            <View style={styles.qrCardHeader}>
              <Text style={styles.qrCardHeaderBrand}>TAX ADMINISTRATION SOCIETY</Text>
              <View style={styles.qrCardBadge}>
                <Text style={styles.qrCardBadgeText}>MEMBER</Text>
              </View>
            </View>

            {/* Main content split */}
            <View style={styles.qrCardBody}>
              <View style={styles.qrCardInfo}>
                <Text style={styles.qrCardName}>{personalName || profileUsername}</Text>
                <Text style={styles.qrCardRole}>{profRole || 'Tax Consultant'}</Text>
                <Text style={styles.qrCardCompany}>{profCompany || 'TAS Member'}</Text>
                
                <View style={styles.qrCardDetailsList}>
                  <View style={styles.qrCardDetailRow}>
                    <PhoneIcon color="#64748B" size={13} />
                    <Text style={styles.qrCardDetailText}>{personalPhone}</Text>
                  </View>
                  <View style={styles.qrCardDetailRow}>
                    <MailIcon color="#64748B" size={13} />
                    <Text style={styles.qrCardDetailText}>{personalEmail}</Text>
                  </View>
                  <View style={styles.qrCardDetailRow}>
                    <LocationPinIcon color="#64748B" size={13} />
                    <Text style={styles.qrCardDetailText}>{personalCity || 'Coimbatore'}, {personalState || 'TN'}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.qrCardCodeWrapper}>
                <DigitalQrCode primaryColor="#000000" accentColor="#000000" />
                <Text style={styles.qrCardCodeLabel}>SCAN TO CONNECT</Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.qrCardFooter}>
              <Text style={styles.qrCardIdCode}>ID: {currentUser?.idCode || 'TAS-2026-00125'}</Text>
              <Text style={styles.qrCardVerified}>✓ Verified Profile</Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity 
              style={styles.qrCardCloseBtn} 
              onPress={() => setShowQrModal(false)}
            >
              <Text style={styles.qrCardCloseBtnText}>Close Visiting Card</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );

  // Render Step 1/3 (Personal Info part 1)
  const renderStep1 = () => (
    <View style={styles.screenWrapper}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => setEditStep(0)}>
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>
      <Text style={styles.editSubtitleId}>ID: {currentUser?.idCode || 'TAS-2026-00000'}</Text>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.wizardCard}>
          <View style={styles.wizardCardHeader}>
            <Text style={styles.wizardCardTitle}>Personal Info</Text>
            <TouchableOpacity style={styles.wizardSaveBtn} onPress={async () => { if (await saveStep1()) { showAlert('Saved Step 1 details!', 'Success'); } }}>
              <Text style={styles.wizardSaveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.wizardFieldGroup}>
            <Text style={styles.wizardLabel}>User name*</Text>
            <TextInput
              style={styles.wizardUnderlineInput}
              value={tempUsername}
              onChangeText={setTempUsername}
              placeholder="Sarah_Jen"
            />
          </View>

          <View style={styles.wizardFieldGroup}>
            <Text style={styles.wizardLabel}>Headline*</Text>
            <TextInput
              style={styles.wizardUnderlineInput}
              value={tempHeadline}
              onChangeText={setTempHeadline}
              placeholder="Headline"
            />
          </View>

          <View style={styles.wizardFieldGroup}>
            <Text style={styles.wizardLabel}>About*</Text>
            <TextInput
              style={[styles.wizardUnderlineInput, { height: 80, textAlignVertical: 'top' }]}
              value={tempAbout}
              onChangeText={setTempAbout}
              multiline={true}
              placeholder="About description..."
            />
          </View>

          <View style={styles.wizardFieldGroup}>
            <Text style={styles.wizardLabel}>Account Type</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity 
                style={[styles.toggleBtn, tempAccountType === 'Public' ? styles.toggleBtnActive : styles.toggleBtnInactive]}
                onPress={() => setTempAccountType('Public')}
              >
                <Text style={tempAccountType === 'Public' ? styles.toggleBtnTextActive : styles.toggleBtnTextInactive}>Public</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleBtn, tempAccountType === 'Private' ? styles.toggleBtnActive : styles.toggleBtnInactive]}
                onPress={() => setTempAccountType('Private')}
              >
                <Text style={tempAccountType === 'Private' ? styles.toggleBtnTextActive : styles.toggleBtnTextInactive}>Private</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.wizardFieldGroup}>
            <Text style={styles.wizardLabel}>Profile Image</Text>
            {tempImage ? (
              <View style={styles.imagePreviewWrapper}>
                <Image 
                  source={
                    typeof tempImage === 'string' && AVATAR_MAP[tempImage] 
                      ? AVATAR_MAP[tempImage] 
                      : { uri: tempImage }
                  } 
                  style={styles.imagePreview} 
                />
                <TouchableOpacity style={styles.changeImageBtn} onPress={() => setShowImagePicker(true)}>
                  <Text style={styles.changeImageBtnText}>Change Image</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.imageUploadCard} 
                activeOpacity={0.8}
                onPress={() => setShowImagePicker(true)}
              >
                <CameraPlusIcon />
                <Text style={styles.imageUploadTitle}>Click to upload brand Profile image</Text>
                <Text style={styles.imageUploadSub}>Recommended: 1200 x 400px (PNG, JPG)</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom wizard footer */}
      <View style={[styles.wizardFooter, { paddingBottom: safeAreaBottom > 0 ? safeAreaBottom + 74 : 84 }]}>
        <Text style={styles.wizardFooterStep}>1/3</Text>
        <View style={styles.wizardFooterActions}>
          <TouchableOpacity style={styles.wizardOutlineBtn} onPress={() => setEditStep(0)}>
            <Text style={styles.wizardOutlineBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.wizardSolidBtn} onPress={async () => { if (await saveStep1()) { setEditStep(2); } }}>
            <Text style={styles.wizardSolidBtnText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Render Step 2/3 (Personal Info part 2)
  const renderStep2 = () => (
    <View style={styles.screenWrapper}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => setEditStep(0)}>
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>
      <Text style={styles.editSubtitleId}>ID: TAS-2026-00125</Text>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.wizardCard}>
          <View style={styles.wizardCardHeader}>
            <Text style={styles.wizardCardTitle}>Persional Info</Text>
            <TouchableOpacity style={styles.wizardSaveBtn} onPress={() => { saveStep2(0); }}>
              <Text style={styles.wizardSaveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.wizardFieldGroup}>
            <Text style={styles.wizardLabel}>Full name*</Text>
            <TextInput
              style={styles.wizardUnderlineInput}
              value={tempPersonalName}
              onChangeText={setTempPersonalName}
              placeholder="Sarah Jenkins"
            />
          </View>

          <View style={styles.wizardFieldGroup}>
            <Text style={styles.wizardLabel}>Gender</Text>
            <View style={styles.genderRow}>
              {['Male', 'Female', 'Other'].map(g => (
                <TouchableOpacity 
                  key={g}
                  style={[styles.genderBtn, tempGender === g ? styles.genderBtnActive : styles.genderBtnInactive]}
                  onPress={() => setTempGender(g)}
                >
                  <Text style={tempGender === g ? styles.genderBtnTextActive : styles.genderBtnTextInactive}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ marginTop: 8 }}>
              <TouchableOpacity 
                style={[styles.genderBtnWide, tempGender === 'Prefer not to tell' ? styles.genderBtnActive : styles.genderBtnInactive]}
                onPress={() => setTempGender('Prefer not to tell')}
              >
                <Text style={tempGender === 'Prefer not to tell' ? styles.genderBtnTextActive : styles.genderBtnTextInactive}>Prefer not to tell</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.wizardFieldGroup}>
            <Text style={styles.wizardLabel}>DOB</Text>
            <TouchableOpacity 
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}
            >
              <TextInput
                style={styles.wizardUnderlineInput}
                value={tempDob}
                placeholder="Select Date of Birth"
                placeholderTextColor="#94A3B8"
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.wizardFieldGroup}>
            <View style={styles.labelWithBadgeRow}>
              <Text style={styles.wizardLabel}>Mobile Number*</Text>
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
            <TextInput
              style={styles.wizardUnderlineInput}
              value={tempPhone}
              onChangeText={setTempPhone}
              placeholder="+91 98765 43210"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.wizardFieldGroup}>
            <View style={styles.labelWithBadgeRow}>
              <Text style={styles.wizardLabel}>Email Address</Text>
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
            <TextInput
              style={styles.wizardUnderlineInput}
              value={tempEmail}
              onChangeText={setTempEmail}
              placeholder="sarah.jen@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.wizardColumnsRow}>
            <View style={styles.wizardColumnItem}>
              <Text style={styles.wizardLabel}>City</Text>
              <TextInput
                style={styles.wizardUnderlineInput}
                value={tempCity}
                onChangeText={setTempCity}
                placeholder="Coimbatore"
              />
            </View>
            <View style={styles.wizardColumnItem}>
              <Text style={styles.wizardLabel}>State</Text>
              <TextInput
                style={styles.wizardUnderlineInput}
                value={tempState}
                onChangeText={setTempState}
                placeholder="Tamil Nadu"
              />
            </View>
          </View>

          <View style={styles.wizardFieldGroup}>
            <Text style={styles.wizardLabel}>Address</Text>
            <TextInput
              style={styles.wizardUnderlineInput}
              value={tempAddress}
              onChangeText={setTempAddress}
              placeholder="Line address"
            />
          </View>

          {/* OTP note banner */}
          <View style={styles.noteBanner}>
            <Text style={styles.noteTitle}>Note</Text>
            <Text style={styles.noteText}>
              In case of changing mobile number or email address verification through otp has to be done
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom wizard footer */}
      <View style={[styles.wizardFooter, { paddingBottom: safeAreaBottom > 0 ? safeAreaBottom + 74 : 84 }]}>
        <Text style={styles.wizardFooterStep}>2/3</Text>
        <View style={styles.wizardFooterActions}>
          <TouchableOpacity style={styles.wizardOutlineBtn} onPress={() => setEditStep(1)}>
            <Text style={styles.wizardOutlineBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.wizardSolidBtn} onPress={() => { saveStep2(3); }}>
            <Text style={styles.wizardSolidBtnText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Render Step 3/3 (Professional Info)
  const renderStep3 = () => (
    <View style={styles.screenWrapper}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => setEditStep(0)}>
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>
      <Text style={styles.editSubtitleId}>ID: TAS-2026-00125</Text>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.wizardCard}>
          <View style={styles.wizardCardHeader}>
            <Text style={styles.wizardCardTitle}>Professional Info</Text>
            <TouchableOpacity style={styles.wizardSaveBtn} onPress={() => { saveStep3(); showAlert('Saved Step 3 details!', 'Success'); }}>
              <Text style={styles.wizardSaveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.wizardFieldGroup}>
            <Text style={styles.wizardLabel}>Current role</Text>
            <TextInput
              style={styles.wizardUnderlineInput}
              value={tempProfRole}
              onChangeText={setTempProfRole}
              placeholder="Current role"
            />
          </View>

          <View style={styles.wizardFieldGroup}>
            <Text style={styles.wizardLabel}>Company name</Text>
            <TextInput
              style={styles.wizardUnderlineInput}
              value={tempProfCompany}
              onChangeText={setTempProfCompany}
              placeholder="Company name"
            />
          </View>

          <View style={styles.wizardFieldGroup}>
            <Text style={styles.wizardLabel}>Experience</Text>
            <TextInput
              style={styles.wizardUnderlineInput}
              value={tempProfExperience}
              onChangeText={setTempProfExperience}
              placeholder="e.g. 8 Years"
            />
          </View>

          <View style={styles.wizardFieldGroup}>
            <Text style={styles.wizardLabel}>Company Address</Text>
            <TextInput
              style={styles.wizardUnderlineInput}
              value={tempProfCompanyAddress}
              onChangeText={setTempProfCompanyAddress}
              placeholder="Company Address"
            />
          </View>

          <View style={styles.wizardFieldGroup}>
            <Text style={styles.wizardLabel}>TAS member since</Text>
            <TextInput
              style={styles.wizardUnderlineInput}
              value={tempProfMemberSince}
              onChangeText={setTempProfMemberSince}
              placeholder="e.g. Jan 2024"
            />
          </View>

          <View style={styles.wizardFieldGroup}>
            <Text style={styles.wizardLabel}>Specialization</Text>
            <TextInput
              style={styles.wizardUnderlineInput}
              value={tempProfSpecialization}
              onChangeText={setTempProfSpecialization}
              placeholder="Specialization"
            />
          </View>

          {/* Membership card details */}
          <View style={styles.membershipCard}>
            <Text style={styles.membershipCardTitle}>Membership</Text>
            <Text style={styles.membershipStatus}>Active TAS Member</Text>
            
            <View style={styles.membershipDetailsRow}>
              <View style={styles.platinumBadge}>
                <BadgeCheckIcon />
                <Text style={styles.platinumBadgeText}>Platinum Member</Text>
              </View>
              <View style={styles.validityContainer}>
                <Text style={styles.validityLabel}>Valid Until</Text>
                <Text style={styles.validityValue}>31 Dec 2026</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.updatePlanBtn} 
              onPress={() => {
                setEditStep(0);
                onNavigate('membership');
              }}
            >
              <Text style={styles.updatePlanBtnText}>Update plan</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom wizard footer */}
      <View style={[styles.wizardFooter, { paddingBottom: safeAreaBottom > 0 ? safeAreaBottom + 74 : 84 }]}>
        <Text style={styles.wizardFooterStep}>3/3</Text>
        <View style={styles.wizardFooterActions}>
          <TouchableOpacity style={styles.wizardOutlineBtn} onPress={() => setEditStep(2)}>
            <Text style={styles.wizardOutlineBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.wizardSolidBtn} onPress={() => { saveStep3(); }}>
            <Text style={styles.wizardSolidBtnText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Connections list modal rendering helper
  const renderConnectionsModalView = () => (
    <Modal
      visible={showConnectionsModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowConnectionsModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>My Connections ({activeConnectionsList.length})</Text>
            <TouchableOpacity onPress={() => setShowConnectionsModal(false)} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            {activeConnectionsList.length === 0 ? (
              <View style={styles.emptyConnectionsWrapper}>
                <Text style={styles.emptyConnectionsText}>You haven't connected with anyone yet.</Text>
              </View>
            ) : (
              activeConnectionsList.map(member => (
                <View key={member.id} style={styles.connectionItemCard}>
                  <View style={[styles.connAvatar, { backgroundColor: member.avatarBg || '#E6EEFF' }]}>
                    <Text style={[styles.connAvatarText, { color: member.avatarColor || '#0A52C5' }]}>{member.initials}</Text>
                  </View>
                  <View style={styles.connDetails}>
                    <Text style={styles.connName}>{member.name}</Text>
                    <Text style={styles.connRole}>{member.role}</Text>
                    <Text style={styles.connBranch}>{member.branch}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.connMsgBtn}
                    onPress={() => {
                      setShowConnectionsModal(false);
                      onNavigate('chat');
                    }}
                  >
                    <Text style={styles.connMsgBtnText}>Message</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // OTP modal rendering helper
  const renderOtpModalView = () => (
    <Modal
      visible={showOtpVerification}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setShowOtpVerification(false)}
    >
      <View style={styles.otpModalOverlay}>
        <View style={styles.otpModalContentCard}>
          <Text style={styles.otpModalTitle}>Verify Profile Update</Text>
          <Text style={styles.otpModalSubtitle}>
            A verification code has been sent to your new email/phone. Please enter the 6-digit OTP code to confirm changes. (Use 123456)
          </Text>
          
          <TextInput
            style={styles.otpModalInput}
            value={otpVal}
            onChangeText={setOtpVal}
            placeholder="******"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            maxLength={6}
            textAlign="center"
          />

          <View style={styles.otpModalActionRow}>
            <TouchableOpacity 
              style={styles.otpModalCancelBtn} 
              onPress={() => setShowOtpVerification(false)}
            >
              <Text style={styles.otpModalCancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.otpModalVerifyBtn} 
              onPress={handleVerifyStep2Otp}
            >
              <Text style={styles.otpModalVerifyText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderImagePickerModalView = () => (
    <Modal
      visible={showImagePicker}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowImagePicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Profile Photo</Text>
            <TouchableOpacity onPress={() => setShowImagePicker(false)} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.imagePickerOptions}>
            <TouchableOpacity style={styles.imagePickerOptionBtn} onPress={pickImage}>
              <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0A52C5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <Circle cx="8.5" cy="8.5" r="1.5" />
                <Polyline points="21 15 16 10 5 21" />
              </Svg>
              <Text style={styles.imagePickerOptionBtnText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.imagePickerOptionBtn} onPress={takePhoto}>
              <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0A52C5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <Circle cx="12" cy="13" r="4" />
              </Svg>
              <Text style={styles.imagePickerOptionBtnText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderFileGalleryModalView = () => (
    <Modal
      visible={showFileGallery}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFileGallery(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>File Gallery</Text>
            <TouchableOpacity onPress={() => setShowFileGallery(false)} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <Text style={[styles.pickerSubTitle, { marginBottom: 12 }]}>Choose a Profile Image Preset:</Text>
            <View style={styles.avatarGrid}>
              {PICKER_AVATARS.map(avatar => (
                <TouchableOpacity 
                  key={avatar.id} 
                  style={[
                    styles.avatarGridItem,
                    tempImage === avatar.id && styles.avatarGridItemSelected
                  ]}
                  onPress={() => {
                    setTempImage(avatar.id);
                    setShowFileGallery(false);
                    setShowImagePicker(false);
                  }}
                >
                  <Image source={AVATAR_MAP[avatar.id]} style={styles.gridAvatarImg} />
                  <Text style={styles.gridAvatarName}>{avatar.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Return step view or main profile view based on current step
  return (
    <View style={{ flex: 1 }}>
      {editStep === 1 ? renderStep1() :
       editStep === 2 ? renderStep2() :
       editStep === 3 ? renderStep3() :
       renderProfileView()}
       
      {renderConnectionsModalView()}
      {renderOtpModalView()}
      {renderImagePickerModalView()}
      {renderFileGalleryModalView()}
      
      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={(selectedDate) => setTempDob(selectedDate)}
        currentValue={tempDob}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#F5F8FF',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#E6EEFF',
    borderBottomWidth: 1.2,
    borderBottomColor: '#D0DDF5',
  },
  backButton: {
    paddingVertical: 4,
    paddingRight: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#03254C',
  },
  editSubtitleId: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
    marginVertical: 10,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  profileHeaderSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 18,
    marginBottom: 16,
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  avatarCirclePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#03254C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  avatarLetterPlaceholder: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '800',
  },
  profileMeta: {
    flex: 1,
    gap: 2,
  },
  profileNameText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#03254C',
  },
  profileSubtitleText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '600',
  },
  connectionsText: {
    fontSize: 12,
    color: '#7DBE14',
    fontWeight: '700',
    marginTop: 2,
  },
  badgeWrapper: {
    flexDirection: 'row',
    marginTop: 4,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#64748B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    gap: 6,
  },
  memberBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  idText: {
    fontSize: 12.5,
    color: '#94A3B8',
    fontWeight: '600',
  },
  idRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  qrIdButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E6EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0A52C5',
  },
  completeProfileBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#03254C',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 14,
    width: '100%',
  },
  completeProfileText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  completeProfileFraction: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    opacity: 0.9,
  },
  aboutHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#03254C',
    marginTop: 16,
    letterSpacing: 0.5,
  },
  aboutContainer: {
    marginTop: 4,
    gap: 4,
  },
  aboutContent: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    fontWeight: '600',
  },
  moreAboutLink: {
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  moreAboutLinkText: {
    color: '#0A52C5',
    fontWeight: '800',
    fontSize: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#03254C',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  rowIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  rowTextContainer: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
  },
  rowValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#334155',
  },
  emptyPlaceholder: {
    color: '#EF4444',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  professionalRow: {
    marginBottom: 14,
    gap: 4,
  },
  columnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 16,
  },
  columnItem: {
    flex: 1,
    gap: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  changePasswordBtn: {
    flexDirection: 'row',
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#0A52C5',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  changePasswordBtnText: {
    color: '#0A52C5',
    fontSize: 13,
    fontWeight: '800',
  },
  signOutBtn: {
    flexDirection: 'row',
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  signOutBtnText: {
    color: '#EF4444',
    fontSize: 13.5,
    fontWeight: '800',
  },

  // WIZARD STYLING
  wizardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#0A52C5',
    padding: 18,
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  wizardCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  wizardCardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#03254C',
  },
  wizardSaveBtn: {
    backgroundColor: '#0A52C5',
    paddingHorizontal: 22,
    paddingVertical: 7,
    borderRadius: 20,
  },
  wizardSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  wizardFieldGroup: {
    marginBottom: 16,
  },
  wizardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
  },
  wizardUnderlineInput: {
    borderBottomWidth: 1.2,
    borderBottomColor: '#CBD5E1',
    fontSize: 14.5,
    fontWeight: '700',
    color: '#03254C',
    paddingVertical: 6,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  toggleBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#0A52C5',
    borderColor: '#0A52C5',
  },
  toggleBtnInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#0A52C5',
  },
  toggleBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13.5,
  },
  toggleBtnTextInactive: {
    color: '#0A52C5',
    fontWeight: '800',
    fontSize: 13.5,
  },
  imageUploadCard: {
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    marginTop: 4,
    gap: 6,
  },
  imageUploadTitle: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '700',
    textAlign: 'center',
  },
  imageUploadSub: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  genderBtn: {
    flex: 1,
    height: 38,
    borderRadius: 18,
    borderWidth: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderBtnWide: {
    width: '100%',
    height: 38,
    borderRadius: 18,
    borderWidth: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderBtnActive: {
    backgroundColor: '#03254C',
    borderColor: '#03254C',
  },
  genderBtnInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
  },
  genderBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  genderBtnTextInactive: {
    color: '#64748B',
    fontWeight: '700',
    fontSize: 13,
  },
  labelWithBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verifiedText: {
    color: '#0A52C5',
    fontSize: 12.5,
    fontWeight: '800',
  },
  wizardColumnsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  wizardColumnItem: {
    flex: 1,
  },
  noteBanner: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1.2,
    borderRadius: 12,
    padding: 12,
    marginTop: 18,
    gap: 4,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E40AF',
  },
  noteText: {
    fontSize: 12.5,
    color: '#1E40AF',
    fontWeight: '600',
    lineHeight: 17,
  },
  membershipCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1.2,
    borderRadius: 14,
    padding: 16,
    marginTop: 18,
  },
  membershipCardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E40AF',
  },
  membershipStatus: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E40AF',
    marginTop: 2,
    marginBottom: 14,
  },
  membershipDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  platinumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#64748B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 6,
  },
  platinumBadgeText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  validityContainer: {
    alignItems: 'flex-end',
    gap: 2,
  },
  validityLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  validityValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E40AF',
  },
  updatePlanBtn: {
    backgroundColor: '#03254C',
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updatePlanBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  autopayStatusWrapper: {
    marginTop: 16,
    backgroundColor: '#F8F9FF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6EEFF',
  },
  autopayStatusLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  autopayStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  autopayStatusText: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  autopayActiveText: {
    color: '#16A34A',
  },
  autopayInactiveText: {
    color: '#94A3B8',
  },
  autopayActionBtn: {
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.2,
  },
  autopayActionBtnCancel: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  autopayActionBtnEnable: {
    borderColor: '#0A52C5',
    backgroundColor: '#E6EEFF',
  },
  autopayActionBtnTextCancel: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '800',
  },
  autopayActionBtnTextEnable: {
    color: '#0A52C5',
    fontSize: 11,
    fontWeight: '800',
  },
  updatePlanBtnProfile: {
    backgroundColor: '#03254C',
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  updatePlanBtnProfileText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  wizardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.2,
    borderTopColor: '#E2E8F0',
  },
  wizardFooterStep: {
    fontSize: 16,
    fontWeight: '800',
    color: '#03254C',
  },
  wizardFooterActions: {
    flexDirection: 'row',
    gap: 12,
  },
  wizardOutlineBtn: {
    height: 42,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#03254C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wizardOutlineBtnText: {
    color: '#03254C',
    fontWeight: '800',
    fontSize: 14,
  },
  wizardSolidBtn: {
    height: 42,
    paddingHorizontal: 28,
    borderRadius: 10,
    backgroundColor: '#03254C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wizardSolidBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 37, 76, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContentCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '75%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1.2,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#03254C',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseBtnText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '700',
  },
  modalScroll: {
    width: '100%',
  },
  emptyConnectionsWrapper: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyConnectionsText: {
    color: '#94A3B8',
    fontWeight: '600',
    fontSize: 14,
  },
  connectionItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  connAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connAvatarText: {
    fontSize: 15,
    fontWeight: '800',
  },
  connDetails: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  connName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#03254C',
  },
  connRole: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  connBranch: {
    fontSize: 11.5,
    color: '#0A52C5',
    fontWeight: '700',
  },
  connMsgBtn: {
    backgroundColor: '#E6EEFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0DDF5',
  },
  connMsgBtnText: {
    color: '#0A52C5',
    fontSize: 12,
    fontWeight: '800',
  },
  otpModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 37, 76, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpModalContentCard: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  otpModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#03254C',
    marginBottom: 12,
  },
  otpModalSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  otpModalInput: {
    width: '60%',
    height: 48,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#D0DDF5',
    borderRadius: 12,
    fontSize: 22,
    fontWeight: '800',
    color: '#03254C',
    letterSpacing: 4,
    marginBottom: 24,
  },
  otpModalActionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  otpModalCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpModalCancelText: {
    color: '#64748B',
    fontWeight: '800',
    fontSize: 14,
  },
  otpModalVerifyBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#03254C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpModalVerifyText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  imagePreviewWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginTop: 4,
    gap: 16,
  },
  imagePreview: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  changeImageBtn: {
    backgroundColor: '#E6EEFF',
    borderWidth: 1,
    borderColor: '#0A52C5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  changeImageBtnText: {
    color: '#0A52C5',
    fontSize: 12.5,
    fontWeight: '800',
  },
  pickerSubTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#03254C',
    marginTop: 8,
    marginBottom: 12,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  avatarGridItem: {
    width: '30%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 8,
    alignItems: 'center',
    gap: 6,
  },
  avatarGridItemSelected: {
    borderColor: '#0A52C5',
    backgroundColor: '#E6EEFF',
  },
  gridAvatarImg: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  gridAvatarName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
  },
  customUrlContainer: {
    borderTopWidth: 1.2,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
    marginTop: 8,
  },
  urlInputRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  urlInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    fontWeight: '600',
    color: '#03254C',
  },
  urlApplyBtn: {
    backgroundColor: '#03254C',
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  urlApplyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  imagePickerOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    marginTop: 8,
  },
  imagePickerOptionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#0A52C5',
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  imagePickerOptionBtnText: {
    color: '#0A52C5',
    fontSize: 13,
    fontWeight: '800',
  },
  pickerSectionSeparator: {
    height: 1.2,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  qrHeaderButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0A52C5',
    zIndex: 10,
  },
  qrModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 37, 76, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  qrCardContainer: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qrCardDecoRing1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 15,
    borderColor: 'rgba(10, 82, 197, 0.03)',
  },
  qrCardDecoRing2: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 20,
    borderColor: 'rgba(10, 82, 197, 0.02)',
  },
  qrCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1.2,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  qrCardHeaderBrand: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#03254C',
    letterSpacing: 1.2,
  },
  qrCardBadge: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qrCardBadgeText: {
    color: '#475569',
    fontSize: 8.5,
    fontWeight: '800',
  },
  qrCardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  qrCardInfo: {
    flex: 1,
    marginRight: 16,
  },
  qrCardName: {
    fontSize: 21,
    fontWeight: '800',
    color: '#03254C',
    marginBottom: 4,
  },
  qrCardRole: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 2,
  },
  qrCardCompany: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0A52C5',
    marginBottom: 16,
  },
  qrCardDetailsList: {
    marginTop: 8,
    gap: 8,
  },
  qrCardDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qrCardDetailText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
  qrCardCodeWrapper: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  qrCardCodeLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#64748B',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  qrCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1.2,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    marginBottom: 16,
  },
  qrCardIdCode: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
  },
  qrCardVerified: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '800',
  },
  qrCardCloseBtn: {
    backgroundColor: '#03254C',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  qrCardCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
