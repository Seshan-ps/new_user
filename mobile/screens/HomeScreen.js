import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  SafeAreaView, 
  Platform, 
  LayoutAnimation, 
  UIManager,
  TouchableOpacity,
  Text,
  StatusBar as RNStatusBar
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Home as HomeIcon, MessageSquare as ChatIcon, Users as UsersIcon, Calendar as CalendarIcon, User as UserIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import Screen components
import HomeFeedScreen from './HomeFeedScreen';
import ChatScreen from './ChatScreen';
import NotificationScreen from './NotificationScreen';
import CommunityScreen from './CommunityScreen';
import EventsScreen from './EventsScreen';
import ProfileScreen from './ProfileScreen';
import MembershipScreen from './MembershipScreen';

import { mockDb } from '../lib/mockDb';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeScreen({ currentUser, setCurrentUser, onLogout, onForgotPassword, showAlert }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('home');
  const [pendingAdminMessage, setPendingAdminMessage] = useState(null);
  const [activeDirectChatUser, setActiveDirectChatUser] = useState(null);
  const [callState, setCallState] = useState(null);

  // Lifted states loaded from mockDb
  const [directoryMembers, setDirectoryMembers] = useState([]);
  const [connectionStatuses, setConnectionStatuses] = useState({});
  const [chatsList, setChatsList] = useState([]);
  const [chatMessages, setChatMessages] = useState({});
  const [registeredEvents, setRegisteredEvents] = useState({});

  // Lifted community states
  const [receivedJoinRequests, setReceivedJoinRequests] = useState({
    1: ['Tamil Selvan', 'Karthik Raja']
  });

  const [communityMembers, setCommunityMembers] = useState({
    1: ['Sanjay Ramasamy', 'Ananya Krishnan', 'Seshan Srinivasan', 'Sanjeev Senthil'],
    2: ['Karthik Raja', 'Priya Mani', 'Tamil Selvan']
  });

  const [communitiesList, setCommunitiesList] = useState([
    {
      id: 1,
      name: "TAX COMPLIANCE & AUDIT NETWORK",
      totalMembers: '4',
      desc: 'Standard-setting body for corporate tax compliance and professional integrity.',
      iconBgColor: '#E6EEFF',
      iconColor: '#134074',
      isOwner: true,
      subgroups: [
        {
          id: 101,
          name: 'Announcements',
          iconType: 'announcement',
          iconBgColor: '#E6F9F0',
          latestMessage: 'Sanjay Ramasamy added the group "Corporate Tax Auditing"',
          timestamp: '12/03/2026',
          unreadCount: 0,
          onlyOwnerCanMessage: true,
          messages: [
            { id: 1, sender: 'System', text: 'Welcome to TAX COMPLIANCE & AUDIT NETWORK Announcements.', time: '10:00 AM', isSystem: true },
            { id: 2, sender: 'System', text: 'Sanjay Ramasamy added the group "Corporate Tax Auditing"', time: '10:15 AM', isSystem: true }
          ]
        },
        {
          id: 102,
          name: 'Corporate Tax Auditing',
          iconType: 'group',
          iconBgColor: '#FFF8E7',
          latestMessage: 'Sanjeev Senthil: Guys, are the Q4 tax submission logs open?',
          timestamp: '26/03/2026',
          unreadCount: 3,
          onlyOwnerCanMessage: false,
          messages: [
            { id: 1, sender: 'Sanjeev Senthil', text: 'Hey guys, are the Q4 tax submission logs open?', time: '11:20 AM', isSystem: false },
            { id: 2, sender: 'Ananya Krishnan', text: 'Yes, they just opened. Check the auditor portal link.', time: '11:22 AM', isSystem: false },
            { id: 3, sender: 'System', text: 'Sanjay Ramasamy reacted ❤️ to: "Audit draft report"', time: '11:30 AM', isSystem: true }
          ]
        },
        {
          id: 103,
          name: 'GST & Indirect Tax Reforms',
          iconType: 'group',
          iconBgColor: '#F3E8FF',
          latestMessage: 'Sanjeev Senthil: Guys I\'m going to close the tax log drive link soon...',
          timestamp: '17/03/2026',
          unreadCount: 0,
          onlyOwnerCanMessage: false,
          messages: [
            { id: 1, sender: 'Seshan Srinivasan', text: 'Let\'s coordinate the schedule for GST audit reviews.', time: '02:15 PM', isSystem: false },
            { id: 2, sender: 'Sanjeev Senthil', text: 'Guys I\'m going to close the tax log drive link soon because the deadline is tonight.', time: '02:18 PM', isSystem: false }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "INTERNATIONAL TAXATION COUNCIL",
      totalMembers: '3',
      desc: 'Global forum for international tax treaties, cross-border transactions and OECD guidelines.',
      iconBgColor: '#F0FDF4',
      iconColor: '#16A34A',
      isOwner: false,
      subgroups: [
        {
          id: 201,
          name: 'Announcements',
          iconType: 'announcement',
          iconBgColor: '#E6F9F0',
          latestMessage: 'Priya Mani published "OECD guidelines Section 1"',
          timestamp: '28/03/2026',
          unreadCount: 0,
          onlyOwnerCanMessage: true,
          messages: [
            { id: 1, sender: 'System', text: 'Welcome to INTERNATIONAL TAXATION COUNCIL Announcements.', time: '09:00 AM', isSystem: true },
            { id: 2, sender: 'Priya Mani', text: 'OECD guidelines Section 1. Seshan Srinivasan is coordinating the documentation.', time: '04:20 PM', isSystem: false }
          ]
        },
        {
          id: 202,
          name: 'Cross-Border Transfer Pricing',
          iconType: 'group',
          iconBgColor: '#FFE4E6',
          latestMessage: 'Tamil Selvan: Thanks for the tax heads up.',
          timestamp: '28/03/2026',
          unreadCount: 1,
          onlyOwnerCanMessage: false,
          messages: [
            { id: 1, sender: 'Karthik Raja', text: 'OECD Guidelines Section 1. Seshan Srinivasan is coordinating the documentation.', time: '04:20 PM', isSystem: false },
            { id: 2, sender: 'Tamil Selvan', text: 'Thanks for the tax heads up.', time: '05:15 PM', isSystem: false }
          ]
        }
      ]
    }
  ]);

  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      type: 'like_story', 
      users: ['lokesh_s', 'sowmiya_r'], 
      otherCount: 9, 
      text: 'liked your story.', 
      time: '20h', 
      section: 'Yesterday',
      read: false 
    },
    { 
      id: 2, 
      type: 'follow_accept', 
      username: 'sowmiya_r', 
      text: 'accepted your connection request.', 
      time: '1d', 
      section: 'Last 7 Days',
      read: false 
    },
    { 
      id: 3, 
      type: 'new_post', 
      username: 'tas_admin', 
      text: 'published a new official update: "Q3 Security Patch".', 
      time: '2d', 
      section: 'Last 7 Days',
      read: true 
    },
    { 
      id: 4, 
      type: 'like_comment', 
      username: 'vishal_v', 
      text: 'liked your comment: "Great update on the security patch! ..."', 
      time: '2d', 
      section: 'Last 7 Days',
      read: true 
    },
    { 
      id: 5, 
      type: 'new_event', 
      title: 'Union Budget 2026 Deep Dive', 
      text: 'A new community event has been scheduled.', 
      time: '3d', 
      section: 'Last 7 Days',
      read: true 
    }
  ]);

  // Load from mockDb on mount and whenever currentUser changes
  useEffect(() => {
    const loadDbData = async () => {
      const dir = await mockDb.getDirectory();
      const conn = await mockDb.getConnections();
      const chats = await mockDb.getChats();
      const msgs = await mockDb.getMessages();
      const evts = await mockDb.getRegisteredEvents();

      setDirectoryMembers(dir);
      setConnectionStatuses(conn);
      setChatsList(chats);
      setChatMessages(msgs);
      setRegisteredEvents(evts);
    };

    loadDbData();
  }, [currentUser]);

  // Sync state mutations to mockDb
  const handleUpdateConnectionStatus = async (memberId, status) => {
    const updatedConn = await mockDb.updateConnectionStatus(memberId, status);
    if (updatedConn) {
      setConnectionStatuses(updatedConn);
    }
  };

  const handleUpdateUserProfile = async (updatedFields) => {
    if (!currentUser) return;
    const updatedUser = await mockDb.updateUserProfile(currentUser.username, updatedFields);
    if (updatedUser) {
      setCurrentUser(updatedUser);
    }
  };

  const handleSaveChats = async (newChatsOrFn) => {
    setChatsList(prev => {
      const updated = typeof newChatsOrFn === 'function' ? newChatsOrFn(prev) : newChatsOrFn;
      mockDb.saveChats(updated);
      return updated;
    });
  };

  const handleSaveMessages = async (newMsgsOrFn) => {
    setChatMessages(prev => {
      const updated = typeof newMsgsOrFn === 'function' ? newMsgsOrFn(prev) : newMsgsOrFn;
      mockDb.saveMessages(updated);
      return updated;
    });
  };

  const handleSaveRegisteredEvents = async (newEvtsOrFn) => {
    setRegisteredEvents(prev => {
      const updated = typeof newEvtsOrFn === 'function' ? newEvtsOrFn(prev) : newEvtsOrFn;
      mockDb.saveRegisteredEvents(updated);
      return updated;
    });
  };

  const handleApproveJoinRequest = (commId, requester) => {
    const currentMembers = communityMembers[commId] || [];
    if (currentMembers.includes(requester)) return;
    const updated = [...currentMembers, requester];

    setCommunityMembers(prev => ({
      ...prev,
      [commId]: updated
    }));

    setCommunitiesList(prevList => prevList.map(comm => {
      if (comm.id === commId) {
        return {
          ...comm,
          totalMembers: `${updated.length}`
        };
      }
      return comm;
    }));

    setReceivedJoinRequests(prev => ({
      ...prev,
      [commId]: (prev[commId] || []).filter(r => r !== requester)
    }));
  };

  const handleRejectJoinRequest = (commId, requester) => {
    setReceivedJoinRequests(prev => ({
      ...prev,
      [commId]: (prev[commId] || []).filter(r => r !== requester)
    }));
  };

  const handleTabPress = (tabKey) => {
    setActiveTab(tabKey);
  };

  return (
    <View style={styles.background}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      <SafeAreaView style={styles.safeArea}>
        {/* Dynamic Tab Contents - Mounted Concurrently and visibility toggled via display style to persist state */}
        <View style={styles.tabContentContainer}>
          <View style={{ flex: 1, display: (activeTab === 'home' || activeTab === 'directory') ? 'flex' : 'none' }}>
            <HomeFeedScreen 
              onNavigate={handleTabPress} 
              hasUnreadNotifications={notifications.some(n => !n.read)} 
              setActiveDirectChatUser={setActiveDirectChatUser}
              directoryMembers={directoryMembers}
              connectionStatuses={connectionStatuses}
              setConnectionStatuses={handleUpdateConnectionStatus}
              currentUser={currentUser}
              showAlert={showAlert}
              showDirectory={activeTab === 'directory'}
              setShowDirectory={(val) => handleTabPress(val ? 'directory' : 'home')}
              safeAreaBottom={insets.bottom}
            />
          </View>
          
          <View style={{ flex: 1, display: activeTab === 'notifications' ? 'flex' : 'none' }}>
            <NotificationScreen 
              onNavigate={handleTabPress} 
              notifications={notifications} 
              setNotifications={setNotifications} 
              communitiesList={communitiesList}
              receivedJoinRequests={receivedJoinRequests}
              onApproveJoinRequest={handleApproveJoinRequest}
              onRejectJoinRequest={handleRejectJoinRequest}
              showAlert={showAlert}
            />
          </View>

          <View style={{ flex: 1, display: activeTab === 'chat' ? 'flex' : 'none' }}>
            <ChatScreen 
              onNavigate={handleTabPress} 
              pendingAdminMessage={pendingAdminMessage}
              setPendingAdminMessage={setPendingAdminMessage}
              activeDirectChatUser={activeDirectChatUser}
              setActiveDirectChatUser={setActiveDirectChatUser}
              chatsList={chatsList}
              setChatsList={handleSaveChats}
              chatMessages={chatMessages}
              setChatMessages={handleSaveMessages}
              directoryMembers={directoryMembers}
              showAlert={showAlert}
              callState={callState}
              setCallState={setCallState}
              safeAreaBottom={insets.bottom}
            />
          </View>

          <View style={{ flex: 1, display: activeTab === 'community' ? 'flex' : 'none' }}>
            <CommunityScreen 
              onNavigate={handleTabPress} 
              communitiesList={communitiesList}
              setCommunitiesList={setCommunitiesList}
              receivedJoinRequests={receivedJoinRequests}
              setReceivedJoinRequests={setReceivedJoinRequests}
              communityMembers={communityMembers}
              setCommunityMembers={setCommunityMembers}
              pendingAdminMessage={pendingAdminMessage}
              setPendingAdminMessage={setPendingAdminMessage}
              currentUser={currentUser}
              showAlert={showAlert}
              safeAreaBottom={insets.bottom}
            />
          </View>

          <View style={{ flex: 1, display: activeTab === 'events' ? 'flex' : 'none' }}>
            <EventsScreen 
              onNavigate={handleTabPress} 
              registeredEvents={registeredEvents}
              setRegisteredEvents={handleSaveRegisteredEvents}
              showAlert={showAlert}
            />
          </View>

          <View style={{ flex: 1, display: activeTab === 'profile' ? 'flex' : 'none' }}>
            <ProfileScreen 
              onNavigate={handleTabPress} 
              onLogout={onLogout} 
              onForgotPassword={onForgotPassword}
              membershipPlan={currentUser?.membershipPlan || 'Premium'}
              setMembershipPlan={(plan) => handleUpdateUserProfile({ membershipPlan: plan })}
              autopayEnabled={currentUser?.autopayEnabled !== undefined ? currentUser.autopayEnabled : true}
              setAutopayEnabled={(val) => handleUpdateUserProfile({ autopayEnabled: val })}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              directoryMembers={directoryMembers}
              connectionStatuses={connectionStatuses}
              setConnectionStatuses={handleUpdateConnectionStatus}
              showAlert={showAlert}
              safeAreaBottom={insets.bottom}
            />
          </View>

          <View style={{ flex: 1, display: activeTab === 'membership' ? 'flex' : 'none' }}>
            <MembershipScreen 
              onNavigate={handleTabPress} 
              setMembershipPlan={(plan) => handleUpdateUserProfile({ membershipPlan: plan })}
              setAutopayEnabled={(val) => handleUpdateUserProfile({ autopayEnabled: val })}
              currentUser={currentUser}
              showAlert={showAlert}
            />
          </View>
        </View>

        {/* Floating Custom Bottom Nav Bar with capsule styling */}
        {!callState && (
          <View style={[styles.bottomTabBarContainer, { paddingBottom: insets.bottom > 0 ? insets.bottom + 8 : (Platform.OS === 'ios' ? 16 : 20) }]}>
            <View style={styles.tabBar}>
              {[
                { key: 'home', name: 'Home', icon: HomeIcon },
                { key: 'chat', name: 'Chat', icon: ChatIcon },
                { key: 'community', name: 'Community', icon: UsersIcon },
                { key: 'events', name: 'Events', icon: CalendarIcon },
                { key: 'profile', name: 'Profile', icon: UserIcon },
              ].map((route) => {
                const isFocused = activeTab === route.key;
                const IconComponent = route.icon;
                const activeColor = '#70B62C'; // Green active state
                const inactiveColor = '#134074'; // Dark blue inactive state
                const color = isFocused ? activeColor : inactiveColor;

                return (
                  <TouchableOpacity
                    key={route.key}
                    accessibilityRole="button"
                    accessibilityState={isFocused ? { selected: true } : {}}
                    onPress={() => handleTabPress(route.key)}
                    style={[styles.tabItem, isFocused ? styles.tabItemActive : null]}
                  >
                    <IconComponent size={22} color={color} />
                    {isFocused && (
                      <Text style={styles.tabLabel}>
                        {route.name}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F9FF',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 38) : 0,
  },
  tabContentContainer: {
    flex: 1,
  },
  bottomTabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 16 : 20,
    paddingTop: 4,
    zIndex: 999,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 30,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#03254C',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20
  },
  tabItemActive: {
    backgroundColor: '#f0fdf4' // Soft green background tint for active
  },
  tabLabel: {
    color: '#70B62C',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6
  }
});
