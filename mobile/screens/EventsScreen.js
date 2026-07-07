import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Platform,
  Modal,
  ActivityIndicator,
  StatusBar as RNStatusBar,
  TextInput
} from 'react-native';
import Svg, { Path, Circle, Line, Polyline, Rect } from 'react-native-svg';

// Custom SVG Icons matching the Premium Light Blue Theme
const BackArrowIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#03254C" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="19" y1="12" x2="5" y2="12" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

const ClockIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Polyline points="12 6 12 12 16 14" />
  </Svg>
);

const MapPinIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Circle cx="12" cy="10" r="3" />
  </Svg>
);

const SearchIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Svg>
);

const ShareIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#03254C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="18" cy="5" r="3" />
    <Circle cx="6" cy="12" r="3" />
    <Circle cx="18" cy="19" r="3" />
    <Line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <Line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </Svg>
);

const BookmarkIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#03254C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </Svg>
);

const CalendarIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A52C5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
  </Svg>
);

const LocationPinIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A52C5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Circle cx="12" cy="10" r="3" />
  </Svg>
);

const CheckmarkCircleIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" fill="#64748B" />
    <Path d="M9 12l2 2 4-4" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const RegisterIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <Circle cx="8.5" cy="7" r="4" />
    <Polyline points="17 11 19 13 23 9" />
  </Svg>
);

const DownloadIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <Polyline points="7 10 12 15 17 10" />
    <Line x1="12" y1="15" x2="12" y2="3" />
  </Svg>
);

const CalendarPlusIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A52C5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
    <Line x1="12" y1="14" x2="12" y2="18" />
    <Line x1="10" y1="16" x2="14" y2="16" />
  </Svg>
);

const NetworkingIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <Circle cx="9" cy="7" r="4" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

const VerifiedBadgeIcon = () => (
  <Svg width="54" height="54" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill="#22C55E" />
    <Path d="M8.5 12.5l2 2 5-5" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CalendarEmptyIcon = () => (
  <Svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
  </Svg>
);

const DownloadSuccessIcon = () => (
  <Svg width="54" height="54" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill="#22C55E" />
    <Path d="M8 12l4 4 4-4" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="12" y1="8" x2="12" y2="16" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

const CalendarSuccessIcon = () => (
  <Svg width="54" height="54" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill="#0A52C5" />
    <Path d="M8 12l3 3 5-5" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const FilePdfIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Polyline points="14 2 14 8 20 8" />
    <Line x1="16" y1="13" x2="8" y2="13" />
    <Line x1="16" y1="17" x2="8" y2="17" />
  </Svg>
);

const QRCodeSvg = () => (
  <Svg width="140" height="140" viewBox="0 0 29 29" shapeRendering="crispEdges">
    <Rect width="29" height="29" fill="#FFFFFF" />
    <Rect x="0" y="0" width="7" height="7" fill="#1E293B" />
    <Rect x="1" y="1" width="5" height="5" fill="#FFFFFF" />
    <Rect x="2" y="2" width="3" height="3" fill="#1E293B" />
    <Rect x="22" y="0" width="7" height="7" fill="#1E293B" />
    <Rect x="23" y="1" width="5" height="5" fill="#FFFFFF" />
    <Rect x="24" y="2" width="3" height="3" fill="#1E293B" />
    <Rect x="0" y="22" width="7" height="7" fill="#1E293B" />
    <Rect x="1" y="23" width="5" height="5" fill="#FFFFFF" />
    <Rect x="2" y="24" width="3" height="3" fill="#1E293B" />
    <Rect x="20" y="20" width="5" height="5" fill="#1E293B" />
    <Rect x="21" y="21" width="3" height="3" fill="#FFFFFF" />
    <Rect x="22" y="22" width="1" height="1" fill="#1E293B" />
    <Rect x="7" y="2" width="15" height="1" fill="#1E293B" />
    <Rect x="2" y="7" width="1" height="15" fill="#1E293B" />
    <Path d="M 9 9 h 2 v 1 h -2 z M 13 9 h 1 v 2 h -1 z M 16 9 h 3 v 1 h -3 z M 20 9 h 1 v 1 h -1 z M 9 11 h 1 v 2 h -1 z M 11 11 h 2 v 1 h -2 z M 15 11 h 1 v 1 h -1 z M 18 11 h 2 v 2 h -2 z M 10 13 h 3 v 1 h -3 z M 14 13 h 2 v 1 h -2 z M 17 13 h 1 v 2 h -1 z M 9 15 h 2 v 1 h -2 z M 12 15 h 1 v 1 h -1 z M 14 15 h 3 v 1 h -3 z M 10 17 h 1 v 2 h -1 z M 12 17 h 2 v 1 h -2 z M 16 17 h 1 v 1 h -1 z M 18 17 h 3 v 1 h -3 z M 9 19 h 3 v 1 h -3 z M 13 19 h 1 v 2 h -1 z M 15 19 h 2 v 1 h -2 z M 11 21 h 2 v 1 h -2 z M 14 21 h 3 v 1 h -3 z M 18 21 h 1 v 2 h -1 z M 20 21 h 2 v 1 h -2 z M 9 23 h 1 v 1 h -1 z M 11 23 h 3 v 2 h -3 z M 15 23 h 2 v 1 h -2 z M 18 23 h 1 v 1 h -1 z M 20 23 h 3 v 2 h -3 z M 10 25 h 2 v 1 h -2 z M 13 25 h 1 v 1 h -1 z M 16 25 h 2 v 1 h -2 z M 19 25 h 1 v 2 h -1 z" fill="#1E293B" />
  </Svg>
);

export default function EventsScreen({ onNavigate, registeredEvents = {}, setRegisteredEvents, showAlert }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showTicket, setShowTicket] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(-1);
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
  const [showCalendarSuccess, setShowCalendarSuccess] = useState(false);
  const [filterRegistered, setFilterRegistered] = useState(false);
  const [eventSearchQuery, setEventSearchQuery] = useState('');

  const handleDownloadTicket = (event) => {
    setDownloadProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setDownloadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setDownloadProgress(-1);
          setShowDownloadSuccess(true);
        }, 300);
      }
    }, 150);
  };

  const handleAddToCalendar = (event) => {
    setShowCalendarSuccess(true);
  };

  const mockEvents = [
    { 
      id: 1, 
      date: '24', 
      month: 'OCT', 
      title: 'Annual GST Conclave 2024', 
      type: 'Seminar', 
      time: '09:00 AM IST',
      location: 'Grand Ballroom, Ritz-Carlton, Mumbai',
      image: require('../assets/event_tax_seminar.png'),
      bookedCount: 200,
      maxCapacity: 240,
      formattedDate: 'Oct 24, 2024',
      formattedTime: '09:00 AM IST',
      dayOfWeek: 'Thursday',
    },
    { 
      id: 2, 
      date: '02', 
      month: 'NOV', 
      title: 'Executive Networking Mixer & Cocktails', 
      type: 'Networking', 
      time: '06:30 PM - 09:00 PM',
      location: 'Sky Garden, 20 Fenchurch St, London',
      image: require('../assets/event_networking.png'),
      bookedCount: 85,
      maxCapacity: 120,
      formattedDate: 'Nov 02, 2024',
      formattedTime: '06:30 PM BST',
      dayOfWeek: 'Saturday',
    },
    { 
      id: 3, 
      date: '15', 
      month: 'NOV', 
      title: 'Digital Transformation for CFOs', 
      type: 'Workshop', 
      time: '10:00 AM - 01:00 PM',
      location: 'Innovation Hub, Shoreditch, London',
      image: require('../assets/event_workshop.png'),
      bookedCount: 200,
      maxCapacity: 240,
      formattedDate: 'Nov 15, 2024',
      formattedTime: '10:00 AM GMT',
      dayOfWeek: 'Friday',
    },
  ];

  const handleRegister = (eventId, title, silent = false) => {
    const isReg = !!registeredEvents[eventId];
    setRegisteredEvents(prev => ({
      ...prev,
      [eventId]: !isReg
    }));
    if (!silent) {
      showAlert(isReg ? `Cancelled registration for ${title}` : `Successfully registered for ${title}!`);
    }
  };

  const handleShowQRData = (event) => {
    const dataString = `
--- TICKET VERIFICATION ---
Event: ${event.title}
Status: CONFIRMED / APPROVED
Attendee Name: Vikram Malhotra
Attendee ID: VAT-2024-001293
Phone Number: +91 98765 43210
Email: vikram.malhotra@taxassoc.org
Membership: Platinum Member
    `.trim();
    showAlert(dataString, 'Ticket Info');
  };

  const renderTicketView = (event) => {
    return (
      <View style={styles.screenWrapper}>
        {/* Detail Header Bar */}
        <View style={[styles.headerBar, { justifyContent: 'flex-start', gap: 14 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => setShowTicket(false)}>
            <BackArrowIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event</Text>
        </View>

        <ScrollView style={[styles.detailScroll, { padding: 20 }]} showsVerticalScrollIndicator={false}>
          {/* Ticket Card */}
          <View style={styles.ticketCard}>
            {/* Ticket Notches */}
            <View style={styles.ticketNotchLeft} />
            <View style={styles.ticketNotchRight} />

            {/* Event Image */}
            <View style={styles.ticketImageContainer}>
              <Image source={event.image} style={styles.ticketImage} resizeMode="cover" />
              <View style={styles.ticketConfirmedBadge}>
                <Text style={styles.ticketConfirmedText}>CONFIRMED</Text>
              </View>
            </View>

            {/* Event Info */}
            <View style={styles.ticketInfoContainer}>
              <Text style={styles.ticketEventTitle}>{event.title}</Text>
              
              <View style={styles.ticketLocationRow}>
                <MapPinIcon />
                <Text style={styles.ticketLocationText}>{event.location}</Text>
              </View>

              <View style={styles.ticketDivider} />

              {/* Info Grid */}
              <View style={styles.ticketGrid}>
                {/* Col 1 */}
                <View style={styles.ticketGridCol}>
                  <Text style={styles.ticketGridLabel}>DATE</Text>
                  <Text style={styles.ticketGridValue}>{event.formattedDate}</Text>

                  <View style={{ height: 12 }} />

                  <Text style={styles.ticketGridLabel}>MEMBER</Text>
                  <Text style={styles.ticketGridValue}>Vikram Malhotra</Text>
                </View>

                {/* Col 2 */}
                <View style={styles.ticketGridCol}>
                  <Text style={styles.ticketGridLabel}>TIME</Text>
                  <Text style={styles.ticketGridValue}>{event.formattedTime}</Text>

                  <View style={{ height: 12 }} />

                  <Text style={styles.ticketGridLabel}>TIER</Text>
                  <Text style={[styles.ticketGridValue, { color: '#0A52C5' }]}>Platinum Member</Text>
                </View>
              </View>

              <View style={styles.ticketDivider} />

              {/* QR Code Section */}
              <View style={styles.qrSectionContainer}>
                <TouchableOpacity 
                  activeOpacity={0.8}
                  style={styles.qrCodeWrapper}
                  onPress={() => setShowQRModal(true)}
                >
                  <QRCodeSvg />
                </TouchableOpacity>
                <Text style={styles.ticketIdText}>ID: VAT-2024-00129{event.id}</Text>
                <Text style={styles.qrSubtitle}>Scan at the entry gate for quick check-in</Text>
              </View>
            </View>
          </View>

          {/* Download & Calendar Buttons */}
          <View style={styles.ticketActionsContainer}>
            <TouchableOpacity style={styles.downloadTicketBtn} onPress={() => handleDownloadTicket(event)}>
              <DownloadIcon />
              <Text style={styles.downloadTicketBtnText}>Download Ticket</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addToCalendarBtn} onPress={() => handleAddToCalendar(event)}>
              <CalendarPlusIcon />
              <Text style={styles.addToCalendarBtnText}>Add to Calendar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.returnEventsBtn} 
              onPress={() => {
                setSelectedEvent(null);
                setShowTicket(false);
              }}
            >
              <Text style={styles.returnEventsBtnText}>Return to Events</Text>
            </TouchableOpacity>
          </View>

          {/* Networking Active Banner */}
          <View style={styles.networkingBanner}>
            <View style={styles.networkingIconBox}>
              <NetworkingIcon />
            </View>
            <View style={styles.networkingTextCol}>
              <Text style={styles.networkingBannerTitle}>Networking Active</Text>
              <Text style={styles.networkingBannerSubtitle}>12 members you know are attending this event.</Text>
            </View>
          </View>
          
          <View style={{ height: 130 }} />
        </ScrollView>

        {/* QR Code Verification Modal */}
        <Modal
          visible={showQRModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowQRModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContentCard}>
              <View style={styles.verifiedIconContainer}>
                <VerifiedBadgeIcon />
              </View>
              
              <Text style={styles.modalTitleText}>TICKET VERIFIED</Text>
              <Text style={styles.modalSubtitleText}>Official Entry Pass Approved</Text>
              
              <View style={styles.modalDivider} />
              
              <View style={styles.modalDetailsList}>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>EVENT</Text>
                  <Text style={styles.modalDetailValue} numberOfLines={2}>{event.title}</Text>
                </View>
                
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>STATUS</Text>
                  <Text style={[styles.modalDetailValue, { color: '#22C55E', fontWeight: '800' }]}>APPROVED & CONFIRMED</Text>
                </View>

                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>ATTENDEE NAME</Text>
                  <Text style={styles.modalDetailValue}>Vikram Malhotra</Text>
                </View>

                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>MEMBER ID</Text>
                  <Text style={styles.modalDetailValue}>VAT-2024-00129{event.id}</Text>
                </View>

                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>PHONE NUMBER</Text>
                  <Text style={styles.modalDetailValue}>+91 98765 43210</Text>
                </View>

                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>EMAIL ID</Text>
                  <Text style={styles.modalDetailValue}>vikram.malhotra@taxassoc.org</Text>
                </View>

                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>MEMBERSHIP</Text>
                  <Text style={[styles.modalDetailValue, { color: '#0A52C5', fontWeight: '800' }]}>Platinum Member</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.modalCloseBtn}
                onPress={() => setShowQRModal(false)}
              >
                <Text style={styles.modalCloseBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Simulated Download Progress Modal */}
        {downloadProgress >= 0 && (
          <Modal transparent={true} animationType="fade" visible={true}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContentCard}>
                <ActivityIndicator size="large" color="#0A52C5" />
                <Text style={[styles.modalTitleText, { marginTop: 16 }]}>Downloading Ticket</Text>
                <Text style={styles.qrSubtitle}>Generating secure PDF pass...</Text>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBarFill, { width: `${downloadProgress}%` }]} />
                </View>
                <Text style={styles.progressPercentText}>{downloadProgress}%</Text>
              </View>
            </View>
          </Modal>
        )}

        {/* Download Success Modal */}
        <Modal
          visible={showDownloadSuccess}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDownloadSuccess(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContentCard}>
              <View style={styles.successIconContainer}>
                <DownloadSuccessIcon />
              </View>
              <Text style={styles.modalTitleText}>DOWNLOAD COMPLETE</Text>
              <Text style={[styles.qrSubtitle, { textAlign: 'center', marginTop: 8 }]}>
                Ticket PDF has been successfully generated and saved to your device.
              </Text>
              
              <View style={styles.fileDetailsBox}>
                <FilePdfIcon />
                <View style={{ flex: 1 }}>
                  <Text style={styles.fileNameText} numberOfLines={1}>
                    VAT-2024-00129{event.id}.pdf
                  </Text>
                  <Text style={styles.fileSizeText}>142 KB • PDF Document</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.modalCloseBtn}
                onPress={() => setShowDownloadSuccess(false)}
              >
                <Text style={styles.modalCloseBtnText}>Open File</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Calendar Success Modal */}
        <Modal
          visible={showCalendarSuccess}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCalendarSuccess(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContentCard}>
              <View style={styles.calendarIconContainer}>
                <CalendarSuccessIcon />
              </View>
              <Text style={styles.modalTitleText}>REMINDER ADDED</Text>
              <Text style={[styles.qrSubtitle, { textAlign: 'center', marginTop: 8 }]}>
                Event has been added to your calendar with a reminder.
              </Text>
              
              <View style={styles.calendarDetailsBox}>
                <Text style={styles.calendarEventTitleText}>{event.title}</Text>
                <Text style={styles.calendarEventTimeText}>
                  {event.formattedDate} • {event.formattedTime}
                </Text>
                <View style={styles.reminderSettingsRow}>
                  <Text style={styles.reminderLabelText}>Reminder set for:</Text>
                  <Text style={styles.reminderValueText}>1 hour before</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.modalCloseBtn}
                onPress={() => setShowCalendarSuccess(false)}
              >
                <Text style={styles.modalCloseBtnText}>Got it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const renderEventDetails = (event) => {
    const isRegistered = !!registeredEvents[event.id];
    
    // Speakers list mapping
    const speakers = [
      { id: 1, name: 'Dr. Amit Shah', role: 'GST Expert', image: require('../assets/avatar_marcus_thornton.png') },
      { id: 2, name: 'Sarah Jenkins', role: 'Tax Attorney', image: require('../assets/avatar_sarah_jenkins.png') },
      { id: 3, name: 'Ramesh B.', role: 'Senior Treasurer', image: require('../assets/avatar_robert.png') }
    ];

    // Agenda mapping
    const agenda = [
      { 
        id: 1, 
        time: '10:00 AM - 11:30 AM', 
        title: 'Keynote: GST Vision 2025', 
        desc: 'Opening remarks by Dr. Amit Shah followed by an overview of upcoming policy changes.',
        active: true
      },
      { 
        id: 2, 
        time: '11:30 AM - 1:00 PM', 
        title: 'Workshop: Compliance Automation', 
        desc: 'A hands-on session demonstrating the latest AI tools for tax filing and reconciliation.',
        active: false
      },
      { 
        id: 3, 
        time: '1:00 PM - 2:00 PM', 
        title: 'Networking Lunch', 
        desc: 'Executive lunch at the Grand Ballroom with round-table discussions.',
        active: false
      }
    ];

    return (
      <View style={styles.screenWrapper}>
        {/* Detail Header Bar */}
        <View style={[styles.headerBar, { justifyContent: 'flex-start', gap: 14 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedEvent(null)}>
            <BackArrowIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event</Text>
        </View>

        <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
          {/* Cover Image & Title Overlay */}
          <View style={styles.detailsImageContainer}>
            <Image source={event.image} style={styles.detailsImage} />
            <View style={styles.imageOverlayContainer}>
              <View style={styles.detailsCategoryBadge}>
                <Text style={styles.detailsCategoryText}>Finance & Tax</Text>
              </View>
              <Text style={styles.detailsEventTitle}>{event.title}</Text>
            </View>
          </View>

          {/* Info Card Overlapping the Image */}
          <View style={styles.infoCard}>
            {/* Date Row */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <CalendarIcon />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoTextBold}>{event.formattedDate}</Text>
                <Text style={styles.infoTextRegular}>{event.dayOfWeek}, {event.time}</Text>
              </View>
            </View>

            {/* Location Row */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <LocationPinIcon />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoTextBold}>{event.location.split(',')[0]}</Text>
                <Text style={styles.infoTextRegular}>{event.location}</Text>
              </View>
            </View>

            {/* Line Separator */}
            <View style={styles.cardSeparator} />

            {/* Status & Confirmed RSVPs Row */}
            <View style={styles.statusRow}>
              <View style={styles.rsvpStatusCol}>
                <CheckmarkCircleIcon />
                <Text style={styles.rsvpStatusText}>
                  {isRegistered ? 'RSVP: CONFIRMED' : 'RSVP: REGISTER NOW'}
                </Text>
              </View>
              <Text style={styles.registeredCountText}>
                {isRegistered ? event.bookedCount + 1 : event.bookedCount}/{event.maxCapacity} registration
              </Text>
            </View>
          </View>

          {/* Speakers Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Distinguished Speakers</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.speakersScrollContent}>
              {speakers.map(speaker => (
                <View key={speaker.id} style={styles.speakerCard}>
                  <Image source={speaker.image} style={styles.speakerAvatar} />
                  <Text style={styles.speakerName} numberOfLines={1}>{speaker.name}</Text>
                  <Text style={styles.speakerRole} numberOfLines={1}>{speaker.role}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Agenda Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Event Agenda</Text>
            
            <View style={styles.agendaTimelineContainer}>
              {agenda.map((item, index) => (
                <View key={item.id} style={styles.agendaRow}>
                  {/* Timeline Line & Dot */}
                  <View style={styles.timelineCol}>
                    <View style={[styles.timelineDot, item.active ? styles.timelineDotActive : styles.timelineDotInactive]} />
                    {index < agenda.length - 1 && <View style={styles.timelineLine} />}
                  </View>

                  {/* Agenda Details Box */}
                  <View style={styles.agendaBox}>
                    <Text style={[styles.agendaTimeText, item.active && styles.agendaTimeTextActive]}>{item.time}</Text>
                    <Text style={styles.agendaTitleText}>{item.title}</Text>
                    <Text style={styles.agendaDescText}>{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Bottom Button Bar */}
        <View style={styles.bottomButtonContainer}>
          {isRegistered ? (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity 
                style={[styles.bottomRegisterBtn, { flex: 1, backgroundColor: '#FFFFFF', borderColor: '#EF4444', borderWidth: 1.5, shadowColor: 'transparent' }]} 
                onPress={() => handleRegister(event.id, event.title)}
              >
                <Text style={[styles.bottomRegisterBtnText, { color: '#EF4444' }]}>Cancel RSVP</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.bottomRegisterBtn, { flex: 1 }]} 
                onPress={() => setShowTicket(true)}
              >
                <Text style={styles.bottomRegisterBtnText}>View Ticket</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.bottomRegisterBtn} 
              onPress={() => {
                handleRegister(event.id, event.title, true);
                setShowTicket(true);
              }}
            >
              <RegisterIcon />
              <Text style={styles.bottomRegisterBtnText}>Register Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (selectedEvent && showTicket) {
    return renderTicketView(selectedEvent);
  }

  if (selectedEvent) {
    return renderEventDetails(selectedEvent);
  }

  return (
    <View style={styles.screenWrapper}>
      {/* Header Bar */}
      <View style={[styles.headerBar, { justifyContent: 'flex-start', gap: 14 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('home')}>
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event</Text>
      </View>

      {/* Events Feed Scroll */}
      <ScrollView style={styles.feedContainer} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchBarWrapper}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events by title or category..."
            placeholderTextColor="#94A3B8"
            value={eventSearchQuery}
            onChangeText={setEventSearchQuery}
          />
          {eventSearchQuery !== '' && (
            <TouchableOpacity onPress={() => setEventSearchQuery('')} style={styles.clearSearchBtn}>
              <Text style={styles.clearSearchText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.feedHeaderRow}>
          <Text style={styles.sectionHeading}>Upcoming Events</Text>
          <TouchableOpacity 
            style={[
              styles.filterTabBtn, 
              filterRegistered ? styles.filterTabBtnActive : styles.filterTabBtnInactive
            ]} 
            onPress={() => setFilterRegistered(!filterRegistered)}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.filterTabBtnText, 
              filterRegistered ? styles.filterTabBtnTextActive : styles.filterTabBtnTextInactive
            ]}>
              Registered
            </Text>
          </TouchableOpacity>
        </View>
        
        {(() => {
          const displayedEvents = (filterRegistered 
            ? mockEvents.filter(event => !!registeredEvents[event.id])
            : mockEvents).filter(event => 
              event.title.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
              event.category.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
              (event.location && event.location.toLowerCase().includes(eventSearchQuery.toLowerCase()))
            );

          if (displayedEvents.length > 0) {
            return displayedEvents.map(event => {
              const isRegistered = !!registeredEvents[event.id];
              return (
                <TouchableOpacity 
                  key={event.id} 
                  style={styles.eventCard} 
                  activeOpacity={0.9}
                  onPress={() => setSelectedEvent(event)}
                >
                  {/* Event Image & Badges */}
                  <View style={styles.cardImageContainer}>
                    <Image source={event.image} style={styles.cardImage} resizeMode="cover" />
                    
                    {/* Date Badge */}
                    <View style={styles.dateBadge}>
                      <Text style={styles.dateMonth}>{event.month}</Text>
                      <Text style={styles.dateDay}>{event.date}</Text>
                    </View>

                    {/* Event Type Badge */}
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeBadgeText}>{event.type}</Text>
                    </View>
                  </View>

                  {/* Event Details */}
                  <View style={styles.cardDetails}>
                    {/* Time Row */}
                    <View style={styles.metaRow}>
                      <ClockIcon />
                      <Text style={styles.metaText}>{event.time}</Text>
                    </View>

                    {/* Title */}
                    <Text style={styles.eventTitle}>{event.title}</Text>

                    {/* Location Row */}
                    <View style={styles.metaRow}>
                      <MapPinIcon />
                      <Text style={styles.metaText} numberOfLines={1}>{event.location}</Text>
                    </View>

                    {/* Register Button */}
                    <TouchableOpacity 
                      style={[
                        styles.registerBtn, 
                        isRegistered ? styles.registeredBtn : styles.registerBtnActive
                      ]}
                      onPress={() => {
                        setSelectedEvent(event);
                      }}
                    >
                      <Text style={isRegistered ? styles.registeredBtnText : styles.registerBtnText}>
                        {isRegistered ? '✓ Registered' : 'View Details'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            });
          } else {
            return (
              <View style={styles.noBookingsContainer}>
                <View style={styles.noBookingsIconCircle}>
                  <CalendarEmptyIcon />
                </View>
                <Text style={styles.noBookingsText}>
                  {eventSearchQuery !== '' 
                    ? 'No events match your search query' 
                    : (filterRegistered ? 'no upcoming events registered' : 'No upcoming events available')}
                </Text>
              </View>
            );
          }
        })()}
        <View style={{ height: 130 }} />
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#E6EEFF',
    borderBottomWidth: 1.2,
    borderBottomColor: '#D0DDF5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIconBtn: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: 4,
    paddingRight: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#03254C', // Deep Blue
  },
  feedContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 20,
    shadowColor: '#0A52C5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#03254C',
  },
  clearSearchBtn: {
    padding: 6,
  },
  clearSearchText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '800',
  },
  sectionHeading: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 16,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#0A52C5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  cardImageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  dateBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 46,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#0A52C5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  dateDay: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: -2,
  },
  typeBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeBadgeText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0A52C5',
  },
  cardDetails: {
    padding: 16,
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 22,
  },
  registerBtn: {
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    borderWidth: 1.5,
  },
  registerBtnActive: {
    backgroundColor: '#0A52C5',
    borderColor: '#0A52C5',
  },
  registerBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  registeredBtn: {
    backgroundColor: '#F0FDF4',
    borderColor: '#22C55E',
  },
  registeredBtnText: {
    color: '#15803D',
    fontSize: 13.5,
    fontWeight: '800',
  },

  // Event Details Styles
  detailScroll: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  detailsImageContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
  },
  detailsImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 40,
    backgroundColor: 'rgba(3, 37, 76, 0.45)', // Overlay matches deep corporate theme
  },
  detailsCategoryBadge: {
    backgroundColor: '#0A52C5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  detailsCategoryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  detailsEventTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  infoCard: {
    marginTop: -20,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    gap: 14,
    shadowColor: '#0A52C5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E6EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTextCol: {
    flex: 1,
    gap: 2,
  },
  infoTextBold: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#03254C',
  },
  infoTextRegular: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  cardSeparator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rsvpStatusCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rsvpStatusText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#64748B',
  },
  registeredCountText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '700',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#03254C',
  },
  viewAllLink: {
    fontSize: 12.5,
    color: '#0A52C5',
    fontWeight: '800',
  },
  speakersScrollContent: {
    paddingRight: 20,
  },
  speakerCard: {
    width: 124,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 12,
    alignItems: 'center',
    marginRight: 12,
  },
  speakerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  speakerName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#03254C',
    textAlign: 'center',
  },
  speakerRole: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  agendaTimelineContainer: {
    marginTop: 12,
  },
  agendaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  timelineCol: {
    alignItems: 'center',
    width: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2.5,
    marginTop: 6,
  },
  timelineDotActive: {
    backgroundColor: '#0A52C5',
    borderColor: '#0A52C5',
  },
  timelineDotInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
  },
  timelineLine: {
    flex: 1,
    width: 2.5,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  agendaBox: {
    flex: 1,
    backgroundColor: '#F8F9FF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  agendaTimeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  agendaTimeTextActive: {
    color: '#0A52C5',
  },
  agendaTitleText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#03254C',
    marginTop: 4,
  },
  agendaDescText: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
    marginTop: 6,
    fontWeight: '500',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1.2,
    borderTopColor: '#E2E8F0',
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
  },
  bottomRegisterBtn: {
    flexDirection: 'row',
    backgroundColor: '#0A52C5',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    shadowColor: '#0A52C5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  bottomRegisterBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  bottomRegisteredBtn: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },

  // Ticket Screen Styles
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#0A52C5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 20,
  },
  ticketNotchLeft: {
    position: 'absolute',
    left: -12,
    top: '48%',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F8F9FF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    zIndex: 10,
  },
  ticketNotchRight: {
    position: 'absolute',
    right: -12,
    top: '48%',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F8F9FF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    zIndex: 10,
  },
  ticketImageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  ticketImage: {
    width: '100%',
    height: '100%',
  },
  ticketConfirmedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#0A52C5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ticketConfirmedText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  ticketInfoContainer: {
    padding: 20,
  },
  ticketEventTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#03254C',
  },
  ticketLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  ticketLocationText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '600',
  },
  ticketDivider: {
    height: 1.2,
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
  },
  ticketGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ticketGridCol: {
    flex: 1,
  },
  ticketGridLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  ticketGridValue: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#03254C',
    marginTop: 4,
  },
  qrSectionContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  qrCodeWrapper: {
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  ticketIdText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 14,
  },
  qrSubtitle: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 4,
  },
  ticketActionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  downloadTicketBtn: {
    flexDirection: 'row',
    backgroundColor: '#0A52C5',
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#0A52C5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  downloadTicketBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  addToCalendarBtn: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderColor: '#D0DDF5',
    borderWidth: 1.5,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addToCalendarBtnText: {
    color: '#0A52C5',
    fontSize: 14,
    fontWeight: '800',
  },
  networkingBanner: {
    flexDirection: 'row',
    backgroundColor: '#E8EFFF',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.2,
    borderColor: '#D0DDF5',
  },
  networkingIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#0A52C5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  networkingTextCol: {
    flex: 1,
  },
  networkingBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#03254C',
  },
  networkingBannerSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 37, 76, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 340,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1.2,
    borderColor: '#D0DDF5',
  },
  verifiedIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitleText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#03254C',
    letterSpacing: 0.5,
  },
  modalSubtitleText: {
    fontSize: 13,
    color: '#16A34A',
    fontWeight: '700',
    marginTop: 4,
  },
  modalDivider: {
    height: 1.2,
    backgroundColor: '#E2E8F0',
    width: '100%',
    marginVertical: 18,
  },
  modalDetailsList: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  modalDetailRow: {
    width: '100%',
    flexDirection: 'column',
    gap: 2,
  },
  modalDetailLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  modalDetailValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalCloseBtn: {
    backgroundColor: '#0A52C5',
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#0A52C5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  modalCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginTop: 18,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0A52C5',
    borderRadius: 4,
  },
  progressPercentText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0A52C5',
    marginTop: 8,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  fileDetailsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderColor: '#FEE2E2',
    borderWidth: 1.2,
    borderRadius: 14,
    padding: 14,
    width: '100%',
    gap: 12,
    marginVertical: 18,
  },
  fileNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#991B1B',
  },
  fileSizeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EF4444',
    marginTop: 2,
  },
  calendarDetailsBox: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1.2,
    borderRadius: 14,
    padding: 14,
    width: '100%',
    gap: 8,
    marginVertical: 18,
  },
  calendarEventTitleText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  calendarEventTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  reminderSettingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    marginTop: 4,
  },
  reminderLabelText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  reminderValueText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0A52C5',
  },
  returnEventsBtn: {
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D0DDF5',
    backgroundColor: '#FFFFFF',
    marginTop: 4,
  },
  returnEventsBtnText: {
    color: '#0A52C5',
    fontSize: 14,
    fontWeight: '800',
  },
  feedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterTabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterTabBtnInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D0DDF5',
  },
  filterTabBtnActive: {
    backgroundColor: '#0A52C5',
    borderColor: '#0A52C5',
  },
  filterTabBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  filterTabBtnTextInactive: {
    color: '#0A52C5',
  },
  filterTabBtnTextActive: {
    color: '#FFFFFF',
  },
  noBookingsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 12,
    width: '100%',
  },
  noBookingsIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBookingsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
  },
});
