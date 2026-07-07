import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ImageBackground, 
  Platform,
  SafeAreaView,
  StatusBar as RNStatusBar
} from 'react-native';
import Svg, { Path, Circle, Rect, Line, Polyline } from 'react-native-svg';

const BackArrowIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#03254C" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="19" y1="12" x2="5" y2="12" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

const FeatureCheckIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Polyline points="16 9 11 14 8 11" />
  </Svg>
);

const FeatureCrossIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Line x1="15" y1="9" x2="9" y2="15" />
    <Line x1="9" y1="9" x2="15" y2="15" />
  </Svg>
);

const EliteNetworkIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A52C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <Circle cx="9" cy="7" r="4" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

const MarketVisibilityIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A52C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M11 5L6 9H2v6h4l5 4V5z" />
    <Path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <Path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </Svg>
);

const KnowledgeHubIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A52C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <Path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </Svg>
);

const PrioritySupportIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A52C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <Circle cx="9" cy="11" r="1" />
    <Circle cx="15" cy="11" r="1" />
    <Path d="M9 15h6" />
  </Svg>
);

export default function MembershipScreen({ 
  onNavigate, 
  isSignUpFlow = false,
  setMembershipPlan,
  setAutopayEnabled,
  showAlert
}) {
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState(null);
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [isAutopayToggleEnabled, setIsAutopayToggleEnabled] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [showSuccessView, setShowSuccessView] = useState(false);
  const [purchasedPlanName, setPurchasedPlanName] = useState('');
  const [purchasedAutopayEnabled, setPurchasedAutopayEnabled] = useState(true);

  const handleUpgradePress = (planName) => {
    setSelectedPlanForCheckout(planName);
    if (planName === 'Lifetime') {
      setIsAutopayToggleEnabled(false);
    } else {
      setIsAutopayToggleEnabled(true);
    }
    setCheckoutModalVisible(true);
  };

  const handleConfirmPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setCheckoutModalVisible(false);
      setPurchasedPlanName(selectedPlanForCheckout);
      
      const nextAutopay = selectedPlanForCheckout === 'Lifetime' ? false : isAutopayToggleEnabled;
      setPurchasedAutopayEnabled(nextAutopay);
      
      if (setMembershipPlan) {
        setMembershipPlan(selectedPlanForCheckout);
      }
      if (setAutopayEnabled) {
        setAutopayEnabled(nextAutopay);
      }
      
      setShowSuccessView(true);
    }, 1500);
  };

  const renderCheckoutModal = () => {
    if (!checkoutModalVisible || !selectedPlanForCheckout) return null;

    const planPrices = {
      Basic: '₹4,999 /year',
      Professional: '₹12,499 /year',
      Premium: '₹24,999 /year',
      Lifetime: '₹1,49,999'
    };

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Checkout Details</Text>
          
          <View style={styles.checkoutSummaryCard}>
            <Text style={styles.summaryPlanLabel}>Plan Selected</Text>
            <Text style={styles.summaryPlanValue}>{selectedPlanForCheckout} Plan</Text>
            <Text style={styles.summaryPriceValue}>{planPrices[selectedPlanForCheckout]}</Text>
          </View>

           {/* Autopay Switch Row */}
          {selectedPlanForCheckout !== 'Lifetime' && (
            <View style={styles.autopayRow}>
              <View style={styles.autopayTextCol}>
                <Text style={styles.autopayLabel}>Setup Autopay</Text>
                <Text style={styles.autopaySublabel}>Automatically renew this subscription</Text>
              </View>
              <TouchableOpacity 
                style={[styles.switchTrack, isAutopayToggleEnabled ? styles.switchTrackActive : styles.switchTrackInactive]}
                onPress={() => setIsAutopayToggleEnabled(!isAutopayToggleEnabled)}
                activeOpacity={0.8}
              >
                <View style={[styles.switchThumb, isAutopayToggleEnabled ? styles.switchThumbActive : styles.switchThumbInactive]} />
              </TouchableOpacity>
            </View>
          )}

          {/* Policy / Refund Notice */}
          <View style={styles.refundNoticeBox}>
            <Text style={styles.refundNoticeText}>
              Refund Policy: If your profile registration is declined, your full payment amount of {planPrices[selectedPlanForCheckout]} will be automatically refunded to your card within 5 working days.
            </Text>
          </View>

          {/* Actions Row */}
          <View style={styles.modalActionsRow}>
            <TouchableOpacity 
              style={styles.modalCancelBtn} 
              onPress={() => {
                setCheckoutModalVisible(false);
                setSelectedPlanForCheckout(null);
              }}
              disabled={isProcessingPayment}
            >
              <Text style={styles.modalCancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalPayBtn} 
              onPress={handleConfirmPayment}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? (
                <Text style={styles.modalPayBtnText}>Processing...</Text>
              ) : (
                <Text style={styles.modalPayBtnText}>Pay & Subscribe</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (showSuccessView) {
    const planPrices = {
      Basic: '₹4,999 /year',
      Professional: '₹12,499 /year',
      Premium: '₹24,999 /year',
      Lifetime: '₹1,49,999'
    };

    return (
      <SafeAreaView style={styles.safeAreaSuccess}>
        <View style={styles.successScreenWrapper}>
          <View style={styles.successContentContainer}>
            {/* Green Checkmark Icon */}
            <View style={styles.successIconOuter}>
              <View style={styles.successIconInner}>
                <Svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <Polyline points="20 6 9 17 4 12" />
                </Svg>
              </View>
            </View>

            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successSubtitle}>Thank you for your purchase</Text>

            {/* Purchase Details Card */}
            <View style={styles.successDetailsCard}>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Subscription Plan</Text>
                <Text style={styles.successDetailValue}>{purchasedPlanName} Plan</Text>
              </View>
              <View style={styles.successDetailDivider} />
              
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Amount Charged</Text>
                <Text style={styles.successDetailValue}>{planPrices[purchasedPlanName]}</Text>
              </View>
              {purchasedPlanName !== 'Lifetime' && (
                <>
                  <View style={styles.successDetailDivider} />
                  <View style={styles.successDetailRow}>
                    <Text style={styles.successDetailLabel}>Autopay Status</Text>
                    <Text style={[styles.successDetailValue, purchasedAutopayEnabled ? styles.autopayActiveText : styles.autopayInactiveText]}>
                      {purchasedAutopayEnabled ? 'Enabled' : 'Disabled'}
                    </Text>
                  </View>
                </>
              )}
            </View>

            {/* Next Button */}
            <TouchableOpacity 
              style={styles.successNextBtn}
              onPress={() => {
                if (isSignUpFlow) {
                  onNavigate('signup_success');
                } else {
                  setShowSuccessView(false);
                  setSelectedPlanForCheckout(null);
                  onNavigate('profile');
                }
              }}
            >
              <Text style={styles.successNextBtnText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.screenWrapper}>
      {/* Header Bar with Safe Area Wrapper */}
      {isSignUpFlow ? (
        <SafeAreaView style={styles.safeAreaHeader}>
          <View style={styles.headerBar}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => onNavigate('back_to_signup')}
            >
              <BackArrowIcon />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Membership</Text>
          </View>
        </SafeAreaView>
      ) : (
        <View style={styles.headerBar}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => onNavigate('profile')}
          >
            <BackArrowIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Membership</Text>
        </View>
      )}

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Intro Hero */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Elevate Your Career</Text>
          <Text style={styles.heroSubtitle}>
            Join a community of elite tax professionals and entrepreneurs. Select the plan that fuels your growth and connects you with industry leaders.
          </Text>
        </View>

        {/* Basic Plan Card */}
        <View style={styles.planCard}>
          <Text style={styles.planTitle}>Basic</Text>
          <View style={styles.priceRow}>
            <Text style={styles.planPrice}>₹4,999</Text>
            <Text style={styles.planDuration}>/year</Text>
          </View>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <FeatureCheckIcon />
              <Text style={styles.featureText}>Standard Event Access</Text>
            </View>
            <View style={styles.featureItem}>
              <FeatureCheckIcon />
              <Text style={styles.featureText}>Basic Directory Listing</Text>
            </View>
            <View style={styles.featureItem}>
              <FeatureCrossIcon />
              <Text style={styles.featureDisabledText}>Priority Support</Text>
            </View>
            <View style={styles.featureItem}>
              <FeatureCrossIcon />
              <Text style={styles.featureDisabledText}>Exclusive Workshops</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.upgradeBtnDefault} onPress={() => handleUpgradePress('Basic')}>
            <Text style={styles.upgradeBtnTextDefault}>Upgrade Now</Text>
          </TouchableOpacity>
        </View>

        {/* Professional Plan Card */}
        <View style={styles.planCard}>
          <Text style={styles.planTitle}>Professional</Text>
          <View style={styles.priceRow}>
            <Text style={styles.planPrice}>₹12,499</Text>
            <Text style={styles.planDuration}>/year</Text>
          </View>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <FeatureCheckIcon />
              <Text style={styles.featureText}>All Standard Events</Text>
            </View>
            <View style={styles.featureItem}>
              <FeatureCheckIcon />
              <Text style={styles.featureText}>Featured Directory Listing</Text>
            </View>
            <View style={styles.featureItem}>
              <FeatureCheckIcon />
              <Text style={styles.featureText}>Email Support (24h)</Text>
            </View>
            <View style={styles.featureItem}>
              <FeatureCrossIcon />
              <Text style={styles.featureDisabledText}>VIP Lounge Access</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.upgradeBtnDefault} onPress={() => handleUpgradePress('Professional')}>
            <Text style={styles.upgradeBtnTextDefault}>Upgrade Now</Text>
          </TouchableOpacity>
        </View>

        {/* Premium Plan Card (BEST VALUE) */}
        <View style={[styles.planCard, styles.planCardPremium]}>
          {/* Best Value Badge */}
          <View style={styles.bestValueBadge}>
            <Text style={styles.bestValueBadgeText}>BEST VALUE</Text>
          </View>

          <Text style={[styles.planTitle, styles.planTitlePremium]}>Premium</Text>
          <View style={styles.priceRow}>
            <Text style={styles.planPrice}>₹24,999</Text>
            <Text style={styles.planDuration}>/year</Text>
          </View>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <FeatureCheckIcon />
              <Text style={styles.featureText}>Unlimited Event Access</Text>
            </View>
            <View style={styles.featureItem}>
              <FeatureCheckIcon />
              <Text style={styles.featureText}>Priority Directory Placement</Text>
            </View>
            <View style={styles.featureItem}>
              <FeatureCheckIcon />
              <Text style={styles.featureText}>Dedicated Account Manager</Text>
            </View>
            <View style={styles.featureItem}>
              <FeatureCheckIcon />
              <Text style={styles.featureText}>VIP Lounge & Workshops</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.upgradeBtnPremium} onPress={() => handleUpgradePress('Premium')}>
            <Text style={styles.upgradeBtnTextPremium}>Upgrade Now</Text>
          </TouchableOpacity>
        </View>

        {/* Lifetime Plan Card */}
        <View style={styles.planCard}>
          <Text style={styles.planTitle}>Lifetime</Text>
          <View style={styles.priceRow}>
            <Text style={styles.planPrice}>₹1,49,999</Text>
          </View>
          <Text style={styles.oneTimePaymentLabel}>ONE-TIME PAYMENT</Text>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <FeatureCheckIcon />
              <Text style={styles.featureText}>Lifetime Membership</Text>
            </View>
            <View style={styles.featureItem}>
              <FeatureCheckIcon />
              <Text style={styles.featureText}>Annual Founders Retreat</Text>
            </View>
            <View style={styles.featureItem}>
              <FeatureCheckIcon />
              <Text style={styles.featureText}>Board Member Eligibility</Text>
            </View>
            <View style={styles.featureItem}>
              <FeatureCheckIcon />
              <Text style={styles.featureText}>Premium Branding Package</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.upgradeBtnDefault} onPress={() => handleUpgradePress('Lifetime')}>
            <Text style={styles.upgradeBtnTextDefault}>Upgrade Now</Text>
          </TouchableOpacity>
        </View>

        {/* Testimonial Section with Background */}
        <View style={styles.testimonialWrapper}>
          <ImageBackground 
            source={require('../assets/event_networking.png')} 
            style={styles.testimonialBackground}
            imageStyle={{ borderRadius: 16 }}
            resizeMode="cover"
          >
            <View style={styles.testimonialOverlay}>
              <Text style={styles.testimonialText}>
                "Since joining the Premium plan, our tax consultancy saw a 40% increase in high-net-worth client referrals."
              </Text>
              <Text style={styles.testimonialAuthor}>
                — Rajesh Khanna, Senior Partner
              </Text>
            </View>
          </ImageBackground>
        </View>

        {/* Why Upgrade Today Section */}
        <View style={styles.whyUpgradeSection}>
          <Text style={styles.whyUpgradeHeading}>Why upgrade today?</Text>

          {/* Elite Network block */}
          <View style={styles.benefitBlock}>
            <View style={styles.benefitIconBox}>
              <EliteNetworkIcon />
            </View>
            <View style={styles.benefitDetails}>
              <Text style={styles.benefitTitle}>Elite Network</Text>
              <Text style={styles.benefitText}>
                Connect with 5000+ top-tier tax consultants and entrepreneurs globally.
              </Text>
            </View>
          </View>

          {/* Market Visibility block */}
          <View style={styles.benefitBlock}>
            <View style={styles.benefitIconBox}>
              <MarketVisibilityIcon />
            </View>
            <View style={styles.benefitDetails}>
              <Text style={styles.benefitTitle}>Market Visibility</Text>
              <Text style={styles.benefitText}>
                Get featured in our monthly newsletter and priority directory listings.
              </Text>
            </View>
          </View>

          {/* Knowledge Hub block */}
          <View style={styles.benefitBlock}>
            <View style={styles.benefitIconBox}>
              <KnowledgeHubIcon />
            </View>
            <View style={styles.benefitDetails}>
              <Text style={styles.benefitTitle}>Knowledge Hub</Text>
              <Text style={styles.benefitText}>
                Exclusive access to case studies, whitepapers, and certified workshops.
              </Text>
            </View>
          </View>

          {/* Priority Support block */}
          <View style={styles.benefitBlock}>
            <View style={styles.benefitIconBox}>
              <PrioritySupportIcon />
            </View>
            <View style={styles.benefitDetails}>
              <Text style={styles.benefitTitle}>Priority Support</Text>
              <Text style={styles.benefitText}>
                Bypass the queue with direct access to our professional support team.
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
      {renderCheckoutModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#E6EEFF',
    borderBottomWidth: 1.2,
    borderBottomColor: '#D0DDF5',
    gap: 12,
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
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 24,
    paddingHorizontal: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#03254C',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  planCardPremium: {
    borderWidth: 2,
    borderColor: '#0A52C5',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    marginTop: 10,
  },
  bestValueBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: '#0A52C5',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bestValueBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  planTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 8,
  },
  planTitlePremium: {
    color: '#0A52C5',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 14,
  },
  planPrice: {
    fontSize: 26,
    fontWeight: '800',
    color: '#03254C',
  },
  planDuration: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginLeft: 4,
  },
  oneTimePaymentLabel: {
    fontSize: 11,
    color: '#0A52C5',
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 14,
    marginTop: -8,
  },
  featuresList: {
    marginBottom: 20,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  featureDisabledText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94A3B8',
  },
  upgradeBtnDefault: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  upgradeBtnTextDefault: {
    color: '#0A52C5',
    fontSize: 14,
    fontWeight: '800',
  },
  upgradeBtnPremium: {
    backgroundColor: '#0A52C5',
    borderRadius: 10,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeBtnTextPremium: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  testimonialWrapper: {
    marginVertical: 10,
    marginBottom: 24,
  },
  testimonialBackground: {
    width: '100%',
    height: 160,
    overflow: 'hidden',
  },
  testimonialOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 37, 76, 0.78)',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
  },
  testimonialText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontStyle: 'italic',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 12,
  },
  testimonialAuthor: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
    opacity: 0.9,
  },
  whyUpgradeSection: {
    marginBottom: 20,
  },
  whyUpgradeHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#03254C',
    marginBottom: 16,
  },
  benefitBlock: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  benefitIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E6EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitDetails: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#03254C',
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16.5,
    fontWeight: '500',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(3, 37, 76, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    width: '90%',
    maxWidth: 360,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#03254C',
    textAlign: 'center',
    marginBottom: 16,
  },
  checkoutSummaryCard: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  summaryPlanLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  summaryPlanValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#03254C',
    marginTop: 2,
  },
  summaryPriceValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0A52C5',
    marginTop: 4,
  },
  autopayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    backgroundColor: '#F8F9FF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6EEFF',
  },
  autopayTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  autopayLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#03254C',
  },
  autopaySublabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
    fontWeight: '500',
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  switchTrackActive: {
    backgroundColor: '#3B82F6',
  },
  switchTrackInactive: {
    backgroundColor: '#CBD5E1',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  switchThumbInactive: {
    alignSelf: 'flex-start',
  },
  refundNoticeBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  refundNoticeText: {
    color: '#EF4444',
    fontSize: 11,
    lineHeight: 16.5,
    fontWeight: '600',
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    height: 42,
    borderWidth: 1.2,
    borderColor: '#94A3B8',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  modalCancelBtnText: {
    color: '#64748B',
    fontSize: 13.5,
    fontWeight: '700',
  },
  modalPayBtn: {
    flex: 1.5,
    height: 42,
    backgroundColor: '#0A52C5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalPayBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  successScreenWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successContentContainer: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  successIconOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#03254C',
    textAlign: 'center',
    marginBottom: 6,
  },
  successSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
  },
  successDetailsCard: {
    backgroundColor: '#F8F9FF',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E6EEFF',
    padding: 18,
    width: '100%',
    marginBottom: 36,
  },
  successDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  successDetailLabel: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '600',
  },
  successDetailValue: {
    fontSize: 13.5,
    color: '#03254C',
    fontWeight: '800',
  },
  successDetailDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  successNextBtn: {
    backgroundColor: '#0A52C5',
    borderRadius: 10,
    height: 48,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0A52C5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  successNextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  safeAreaHeader: {
    backgroundColor: '#E6EEFF',
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 35) : 0,
  },
  safeAreaSuccess: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 35) : 0,
  },
});
