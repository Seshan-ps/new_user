import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Platform, 
  Image, 
  LayoutAnimation,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar as RNStatusBar
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Circle, Rect, Polygon, Line, Polyline } from 'react-native-svg';

// Custom SVG Icons matching Light Blue/Green Theme
const MegaphoneIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7DBE14" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M11 5L6 9H2v6h4l5 4V5z" />
    <Path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <Path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </Svg>
);

const MultiUserIcon = ({ strokeColor = "#03254C" }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <Circle cx="9" cy="7" r="4" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

const CommunityUsersIcon = ({ strokeColor = "#03254C" }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 21v-2a4 4 0 0 0-3-3.87" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <Path d="M21 21v-2a4 4 0 0 0-3-3.87" />
    <Path d="M22 4a4 4 0 0 1 0 7.75" />
    <Path d="M9 21v-2a4 4 0 0 0-4-4H3a4 4 0 0 0-4 4v2" />
    <Circle cx="7" cy="7" r="4" />
  </Svg>
);

const SearchIcon = ({ strokeColor = "#64748B" }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Svg>
);

const BackArrowIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#03254C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="19" y1="12" x2="5" y2="12" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

const ThreeDotsIcon = ({ strokeColor = "#64748B" }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="1.2" fill={strokeColor} />
    <Circle cx="12" cy="5" r="1.2" fill={strokeColor} />
    <Circle cx="12" cy="19" r="1.2" fill={strokeColor} />
  </Svg>
);

const CameraIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <Circle cx="12" cy="13" r="4" />
  </Svg>
);

const PlusIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round">
    <Path d="M12 5v14M5 12h14" />
  </Svg>
);

const CheckIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3">
    <Path d="M20 6 9 17l-5-5" />
  </Svg>
);

const DownArrowIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5">
    <Path d="m6 9 6 6 6-6" />
  </Svg>
);

const EmojiIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.2">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M8 14s1.5 2 4 2 4-2 4-2" strokeLinecap="round" />
    <Line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" strokeLinecap="round" />
    <Line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" strokeLinecap="round" />
  </Svg>
);

const SendIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
    <Path d="m22 2-7 20-4-9-9-4Z" />
    <Path d="M22 2 11 13" />
  </Svg>
);

const SIMULATED_USERS = [
  'Sanjay Ram',
  'Ananya Krishnan',
  'Pradeep Raj',
  'Sandhya Rajan',
  'Sanjeev Senthil',
  'Karthik Raja',
  'Priya Mani',
  'Manoj Kumar',
  'Janani K.',
  'Ramesh B.',
  'Sathya P.',
  'Tamil Selvan'
];

const SIMULATED_MESSAGES = [
  'Can someone send the link to the tax audit slides?',
  'The reconciliation review meeting starts in 10 minutes. Please join!',
  'Great job team, the tax audit logs are looking clean! 🎉',
  'Let me check with the compliance committee and update here.',
  'Uploading the updated direct tax PDF, let me know if anyone cannot open it.',
  'Thanks for the tax heads up.',
  'Awesome work on the double tax treaty! 👍',
  'Are we meeting offline today for the GST draft review?'
];

const getUserRole = (name) => {
  const roles = {
    'Sanjay Ram': 'Principal Tax Partner',
    'Ananya Krishnan': 'Senior Auditor',
    'Pradeep Raj': 'Direct Tax Consultant',
    'Sandhya Rajan': 'GST Analyst',
    'Sanjeev Senthil': 'Corporate Accountant',
    'Karthik Raja': 'Transfer Pricing Lead',
    'Priya Mani': 'Compliance Director',
    'Manoj Kumar': 'Customs Consultant',
    'Janani K.': 'Financial Controller',
    'Ramesh B.': 'Audit Manager',
    'Sathya P.': 'Indirect Tax Specialist',
    'Tamil Selvan': 'Tax Law Advisor'
  };
  return roles[name] || 'Tax Consultant';
};

const INITIAL_DISCOVERABLE_COMMUNITIES = [
  {
    id: 301,
    name: 'DIRECT TAX REVENUE ADVOCATES',
    code: 'TAX-DIR-881',
    desc: 'Forum for direct tax litigations, appeals and assessment advisory.',
    iconBgColor: '#FFE4E6',
    iconColor: '#E91E63',
    owner: 'Priya Mani',
    joinStatus: 'none'
  },
  {
    id: 302,
    name: 'GST COMPLIANCE ADVISORY',
    code: 'TAX-GST-292',
    desc: 'Discussion group for GST filings, circulars, and compliance checklists.',
    iconBgColor: '#E0F2FE',
    iconColor: '#34B7F1',
    owner: 'Ananya Krishnan',
    joinStatus: 'none'
  },
  {
    id: 303,
    name: 'TRANSFER PRICING FORUM',
    code: 'TAX-TP-554',
    desc: 'Global transfer pricing audit practices and documentation exchange.',
    iconBgColor: '#F3E8FF',
    iconColor: '#9333EA',
    owner: 'Sanjeev Senthil',
    joinStatus: 'none'
  }
];

export default function CommunityScreen({ 
  onNavigate,
  communitiesList,
  setCommunitiesList,
  receivedJoinRequests,
  setReceivedJoinRequests,
  communityMembers,
  setCommunityMembers,
  pendingAdminMessage,
  setPendingAdminMessage,
  currentUser,
  showAlert,
  safeAreaBottom = 0
}) {
  const [communitySubView, setCommunitySubView] = useState('list'); // 'list' | 'create' | 'chat' | 'community-detail'
  const [searchQuery, setSearchQuery] = useState('');
  const [discoverableCommunities, setDiscoverableCommunities] = useState(INITIAL_DISCOVERABLE_COMMUNITIES);
  const [showDiscoveryPanel, setShowDiscoveryPanel] = useState(false);
  const [discoverySearchQuery, setDiscoverySearchQuery] = useState('');
  const [membersModalTab, setMembersModalTab] = useState('members'); // 'members' | 'requests'

  const [communityDetailBackTo, setCommunityDetailBackTo] = useState('list');
  const [showReportIssueModal, setShowReportIssueModal] = useState(false);
  const [showReportSuccessModal, setShowReportSuccessModal] = useState(false);
  const [issueType, setIssueType] = useState('Illegal Activity');
  const [issueDetails, setIssueDetails] = useState('');
  const [showIssueTypeDropdown, setShowIssueTypeDropdown] = useState(false);

  const handleRestrictCommunitySimulate = () => {
    setShowReportSuccessModal(false);
    setCommunitiesList(prev => prev.map(c => {
      if (c.id === activeParentCommunity.id) {
        const updated = { ...c, restricted: true };
        setActiveParentCommunity(updated);
        return updated;
      }
      return c;
    }));
    setIssueType('Illegal Activity');
    setIssueDetails('');
    showAppAlert('Community has been restricted by Admin.', 'System');
  };

  const showAppAlert = (message, title = 'Alert', onConfirm = null) => {
    showAlert(message, title, onConfirm);
  };
  
  // Custom expandable state for parent communities
  const [expandedCommunities, setExpandedCommunities] = useState({});

  // Active chat state
  const [activeSubgroup, setActiveSubgroup] = useState(null);
  const [activeParentCommunity, setActiveParentCommunity] = useState(null);
  const [typedMessage, setTypedMessage] = useState('');
  const chatScrollViewRef = useRef(null);

  // Subgroup chat options menu & modal states
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'gallery' | 'files' | 'audio_record' | 'location_select' | null
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioRecordingState, setAudioRecordingState] = useState('idle'); // 'idle' | 'recording'

  const mockLocalImages = [
    { id: 'img1', name: 'Audit_Room.png', path: require('../assets/server_room.png') },
    { id: 'img2', name: 'TAS_Logo.png', path: require('../assets/logo.png') },
    { id: 'img3', name: 'Network_Topology.png', path: require('../assets/server_room.png') },
    { id: 'img4', name: 'Identity_Verified.png', path: require('../assets/avatar_marcus_thornton.png') },
  ];

  const mockLocalFiles = [
    { id: 'f1', name: 'Q4_Audit_Details.pdf', size: '1.4 MB', type: 'pdf' },
    { id: 'f2', name: 'Reconciliation_Log.xlsx', size: '840 KB', type: 'xlsx' },
    { id: 'f3', name: 'Annual_Report_Draft.docx', size: '2.1 MB', type: 'docx' },
    { id: 'f4', name: 'Biometric_Setup_Guide.pdf', size: '600 KB', type: 'pdf' }
  ];

  const mockLocalLocations = [
    { id: 'loc1', name: 'TAS Coimbatore Office', desc: 'Gandhipuram, Coimbatore, TN' },
    { id: 'loc2', name: 'TAS Chennai Headquarters', desc: 'Nungambakkam, Chennai, TN' },
    { id: 'loc3', name: 'Regional Audit Center', desc: 'Avinashi Road, Coimbatore, TN' },
    { id: 'loc4', name: 'Coimbatore Airport (CJB)', desc: 'Peelamedu, Coimbatore, TN' }
  ];

  // Audio recording timer simulation
  useEffect(() => {
    let interval;
    if (audioRecordingState === 'recording') {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }
    return () => clearInterval(interval);
  }, [audioRecordingState]);

  const formatCallTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);
  const [showManageMembersModal, setShowManageMembersModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // Form states for creating a new community
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState('Specialized'); 
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isPubliclyVisible, setIsPubliclyVisible] = useState(true);
  const [memberLimit, setMemberLimit] = useState(500);
  const [isNoLimit, setIsNoLimit] = useState(false);
  const [uploadedCoverImage, setUploadedCoverImage] = useState(null);

  const activeSubgroupIdRef = useRef(null);
  useEffect(() => {
    activeSubgroupIdRef.current = activeSubgroup ? activeSubgroup.id : null;
  }, [activeSubgroup]);

  // Live Message Simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setCommunitiesList(prevList => {
        const eligibleSubgroups = [];
        prevList.forEach(comm => {
          comm.subgroups.forEach(sub => {
            if (sub.id !== activeSubgroupIdRef.current) {
              eligibleSubgroups.push({ commId: comm.id, subId: sub.id });
            }
          });
        });

        if (eligibleSubgroups.length === 0) return prevList;

        const choice = eligibleSubgroups[Math.floor(Math.random() * eligibleSubgroups.length)];
        const randomUser = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)];
        const randomText = SIMULATED_MESSAGES[Math.floor(Math.random() * SIMULATED_MESSAGES.length)];
        
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const timeString = `${hrs}:${mins}`;

        return prevList.map(comm => {
          if (comm.id !== choice.commId) return comm;
          return {
            ...comm,
            subgroups: comm.subgroups.map(sub => {
              if (sub.id !== choice.subId) return sub;
              
              const newMsg = {
                id: Date.now(),
                sender: randomUser,
                text: randomText,
                time: timeString,
                isSystem: false
              };

              return {
                ...sub,
                latestMessage: `${randomUser}: ${randomText}`,
                timestamp: timeString,
                unreadCount: sub.unreadCount + 1,
                messages: [...sub.messages, newMsg]
              };
            })
          };
        });
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const filteredCommunities = communitiesList.map(comm => {
    const matchesSearch = comm.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchedSubgroups = comm.subgroups.filter(sub => 
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.latestMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchesSearch) {
      return comm;
    } else if (matchedSubgroups.length > 0) {
      return {
        ...comm,
        subgroups: matchedSubgroups
      };
    }
    return null;
  }).filter(Boolean);

  const toggleExpand = (communityId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCommunities(prev => ({
      ...prev,
      [communityId]: !prev[communityId]
    }));
  };

  const handleEstablishCommunity = () => {
    if (!formName.trim()) {
      showAppAlert('Please enter a community name.');
      return;
    }
    if (!formDesc.trim()) {
      showAppAlert('Please enter a description.');
      return;
    }

    let iconBgColor = '#E6EEFF';
    let iconColor = '#134074';
    if (formCategory === 'Regional') {
      iconBgColor = '#E6F9F0';
      iconColor = '#7DBE14';
    } else if (formCategory === 'Public') {
      iconBgColor = '#E0F2FE';
      iconColor = '#34B7F1';
    } else if (formCategory === 'Confidential') {
      iconBgColor = '#FFE4E6';
      iconColor = '#E91E63';
    }

    const newCommunityId = Date.now();
    const newCommunity = {
      id: newCommunityId,
      name: formName.trim().toUpperCase(),
      totalMembers: '1',
      desc: formDesc.trim(),
      iconBgColor,
      iconColor,
      isOwner: true, // Created by me, so I am owner
      subgroups: [
        {
          id: newCommunityId + 1,
          name: 'Announcements',
          iconType: 'announcement',
          iconBgColor: '#E6F9F0',
          latestMessage: `Welcome to ${formName.trim()} announcements!`,
          timestamp: 'Today',
          unreadCount: 0,
          onlyOwnerCanMessage: true,
          messages: [
            { id: 1, sender: 'System', text: `Welcome to the Announcements page of ${formName.trim()}!`, time: 'Just now', isSystem: true }
          ]
        },
        {
          id: newCommunityId + 2,
          name: 'General Forum',
          iconType: 'group',
          iconBgColor: '#E6EEFF',
          latestMessage: 'No messages yet. Start the conversation!',
          timestamp: 'Today',
          unreadCount: 0,
          onlyOwnerCanMessage: false,
          messages: [
            { id: 1, sender: 'System', text: `General Forum established for members. Limit: ${isNoLimit ? 'No Limit' : `${memberLimit} Members`}`, time: 'Just now', isSystem: true }
          ]
        }
      ]
    };

    setCommunitiesList([newCommunity, ...communitiesList]);
    setCommunityMembers(prev => ({
      ...prev,
      [newCommunityId]: ['Sanjay Ram'] // Sanjay Ram added as first member automatically
    }));

    setFormName('');
    setFormDesc('');
    setFormCategory('Specialized');
    setIsPubliclyVisible(true);
    setMemberLimit(500);
    setIsNoLimit(false);
    setUploadedCoverImage(null);

    setCommunitySubView('list');
    showAppAlert('Community established successfully!');
  };

  const handleOpenChat = (parentComm, subgroup) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveParentCommunity(parentComm);
    setActiveSubgroup(subgroup);
    setCommunitySubView('chat');

    setCommunitiesList(prevList => 
      prevList.map(comm => {
        if (comm.id !== parentComm.id) return comm;
        return {
          ...comm,
          subgroups: comm.subgroups.map(sub => {
            if (sub.id !== subgroup.id) return sub;
            return {
              ...sub,
              unreadCount: 0
            };
          })
        };
      })
    );
  };

  const handleSendMessage = () => {
    if (!typedMessage.trim() || !activeSubgroup || !activeParentCommunity) return;

    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hrs}:${mins}`;

    const newMsg = {
      id: Date.now(),
      sender: 'Me',
      text: typedMessage.trim(),
      time: timeString,
      isSystem: false
    };

    const updatedSubgroup = {
      ...activeSubgroup,
      latestMessage: `Me: ${typedMessage.trim()}`,
      timestamp: timeString,
      messages: [...activeSubgroup.messages, newMsg]
    };
    setActiveSubgroup(updatedSubgroup);

    setCommunitiesList(prevList => 
      prevList.map(comm => {
        if (comm.id !== activeParentCommunity.id) return comm;
        return {
          ...comm,
          subgroups: comm.subgroups.map(sub => {
            if (sub.id !== activeSubgroup.id) return sub;
            return updatedSubgroup;
          })
        };
      })
    );

    setTypedMessage('');
  };

  const handleSendAttachment = (type, details) => {
    setShowAttachmentMenu(false);
    setActiveModal(null);

    if (!activeSubgroup || !activeParentCommunity) return;

    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hrs}:${mins}`;

    let newMsg = {
      id: Date.now(),
      sender: 'Me',
      time: timeString,
      isSystem: false,
      isAttachment: true,
      attachmentType: type
    };

    let msgSummary = '';
    if (type === 'image') {
      newMsg.text = details?.name || 'Sent an image';
      newMsg.imagePath = details?.path || require('../assets/server_room.png');
      msgSummary = 'Me: Sent an image';
    } else if (type === 'file') {
      newMsg.text = details?.name || 'Audit_Report_Q4.pdf';
      newMsg.fileName = details?.name || 'Audit_Report_Q4.pdf';
      newMsg.fileSize = details?.size || '1.4 MB';
      msgSummary = `Me: ${details?.name || 'Audit_Report_Q4.pdf'}`;
    } else if (type === 'audio') {
      newMsg.text = 'Voice memo';
      newMsg.duration = details?.duration || '0:12';
      msgSummary = 'Me: Voice memo';
    } else if (type === 'location') {
      newMsg.text = details?.name || 'TAS Coimbatore Office';
      newMsg.locationName = details?.name || 'TAS Coimbatore Office, India';
      msgSummary = `Me: ${details?.name || 'TAS Coimbatore Office'}`;
    }

    const updatedSubgroup = {
      ...activeSubgroup,
      latestMessage: msgSummary,
      timestamp: timeString,
      messages: [...activeSubgroup.messages, newMsg]
    };
    setActiveSubgroup(updatedSubgroup);

    setCommunitiesList(prevList => 
      prevList.map(comm => {
        if (comm.id !== activeParentCommunity.id) return comm;
        return {
          ...comm,
          subgroups: comm.subgroups.map(sub => {
            if (sub.id !== activeSubgroup.id) return sub;
            return updatedSubgroup;
          })
        };
      })
    );
  };

  const renderAttachmentBubble = (msg) => {
    if (msg.attachmentType === 'image') {
      return (
        <View style={styles.attachmentImageContainer}>
          <Image source={msg.imagePath || require('../assets/server_room.png')} style={styles.attachmentImage} resizeMode="cover" />
          <Text style={styles.attachmentCaption}>{msg.text || 'System Update Patch Image'}</Text>
        </View>
      );
    } else if (msg.attachmentType === 'file') {
      return (
        <View style={styles.attachmentFileContainer}>
          <View style={styles.fileIconBox}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#03254C" strokeWidth="2">
              <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <Path d="M14 2v6h6" />
              <Line x1="16" y1="13" x2="8" y2="13" />
              <Line x1="16" y1="17" x2="8" y2="17" />
              <Line x1="10" y1="9" x2="8" y2="9" />
            </Svg>
          </View>
          <View style={styles.fileDetailsBox}>
            <Text style={styles.fileNameText} numberOfLines={1}>{msg.fileName}</Text>
            <Text style={styles.fileSizeText}>{msg.fileSize || '1.4 MB'} • PDF</Text>
          </View>
        </View>
      );
    } else if (msg.attachmentType === 'audio') {
      return (
        <View style={styles.attachmentAudioContainer}>
          <TouchableOpacity style={styles.audioPlayBtn} onPress={() => showAlert('Simulating audio playback...', 'Audio Player')}>
            <Svg width="18" height="18" viewBox="0 0 24 24" fill="#03254C">
              <Polygon points="5 3 19 12 5 21 5 3" />
            </Svg>
          </TouchableOpacity>
          
          <View style={styles.audioWaveform}>
            {/* Simple audio wave visualization */}
            <Svg width="90" height="20" viewBox="0 0 100 20">
              <Rect x="0" y="5" width="3" height="10" fill="#03254C" rx="1.5" />
              <Rect x="6" y="2" width="3" height="16" fill="#03254C" rx="1.5" />
              <Rect x="12" y="8" width="3" height="4" fill="#03254C" rx="1.5" />
              <Rect x="18" y="4" width="3" height="12" fill="#03254C" rx="1.5" />
              <Rect x="24" y="6" width="3" height="8" fill="#03254C" rx="1.5" />
              <Rect x="30" y="1" width="3" height="18" fill="#03254C" rx="1.5" />
              <Rect x="36" y="7" width="3" height="6" fill="#03254C" rx="1.5" />
              <Rect x="42" y="3" width="3" height="14" fill="#03254C" rx="1.5" />
              <Rect x="48" y="5" width="3" height="10" fill="#03254C" rx="1.5" />
              <Rect x="54" y="8" width="3" height="4" fill="#03254C" rx="1.5" />
              <Rect x="60" y="2" width="3" height="16" fill="#03254C" rx="1.5" />
              <Rect x="66" y="4" width="3" height="12" fill="#03254C" rx="1.5" />
              <Rect x="72" y="6" width="3" height="8" fill="#03254C" rx="1.5" />
              <Rect x="78" y="5" width="3" height="10" fill="#03254C" rx="1.5" />
              <Rect x="84" y="7" width="3" height="6" fill="#03254C" rx="1.5" />
              <Rect x="90" y="9" width="3" height="2" fill="#03254C" rx="1.5" />
            </Svg>
          </View>
          <Text style={styles.audioDurationText}>{msg.duration}</Text>
        </View>
      );
    } else if (msg.attachmentType === 'location') {
      return (
        <View style={styles.attachmentLocationContainer}>
          <View style={styles.locationMapPlaceholder}>
            <Image source={require('../assets/logo.png')} style={styles.locationLogoOverlay} resizeMode="contain" />
            <View style={styles.mapPin}>
              <Svg width="18" height="18" viewBox="0 0 24 24" fill="#EF4444">
                <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
              </Svg>
            </View>
          </View>
          <View style={styles.locationDetails}>
            <Text style={styles.locationTitleText}>{msg.locationName}</Text>
            <Text style={styles.locationSubText}>Tap to open in Maps</Text>
          </View>
        </View>
      );
    }
    return null;
  };

  const handleSaveDetails = () => {
    if (!editName.trim()) {
      showAppAlert('Please enter a community name.');
      return;
    }

    setCommunitiesList(prev => prev.map(comm => {
      if (comm.id === activeParentCommunity.id) {
        const updated = {
          ...comm,
          name: editName.trim().toUpperCase(),
          desc: editDesc.trim()
        };
        setActiveParentCommunity(updated);
        return updated;
      }
      return comm;
    }));

    setShowEditDetailsModal(false);
    showAppAlert('Details updated successfully!');
  };

  const handleToggleMessageAccess = () => {
    setShowChatMenu(false);
    const nextVal = !activeSubgroup.onlyOwnerCanMessage;
    
    const updatedSubgroup = {
      ...activeSubgroup,
      onlyOwnerCanMessage: nextVal
    };
    setActiveSubgroup(updatedSubgroup);

    setCommunitiesList(prevList => 
      prevList.map(comm => {
        if (comm.id !== activeParentCommunity.id) return comm;
        return {
          ...comm,
          subgroups: comm.subgroups.map(sub => {
            if (sub.id !== activeSubgroup.id) return sub;
            return updatedSubgroup;
          })
        };
      })
    );

    showAppAlert(`Message access updated: ${nextVal ? 'Only Owner can message' : 'All members can message'}`);
  };

  const handleAddMember = (user) => {
    const currentMembers = communityMembers[activeParentCommunity.id] || [];
    if (currentMembers.includes(user)) return;
    const updated = [...currentMembers, user];

    setCommunityMembers(prev => ({
      ...prev,
      [activeParentCommunity.id]: updated
    }));

    setCommunitiesList(prevList => prevList.map(comm => {
      if (comm.id === activeParentCommunity.id) {
        return {
          ...comm,
          totalMembers: `${updated.length}`
        };
      }
      return comm;
    }));

    setActiveParentCommunity(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        totalMembers: `${updated.length}`
      };
    });
  };

  const handleRemoveMember = (user) => {
    const currentMembers = communityMembers[activeParentCommunity.id] || [];
    const updated = currentMembers.filter(u => u !== user);

    setCommunityMembers(prev => ({
      ...prev,
      [activeParentCommunity.id]: updated
    }));

    setCommunitiesList(prevList => prevList.map(comm => {
      if (comm.id === activeParentCommunity.id) {
        return {
          ...comm,
          totalMembers: `${updated.length}`
        };
      }
      return comm;
    }));

    setActiveParentCommunity(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        totalMembers: `${updated.length}`
      };
    });
  };

  const confirmDeleteCommunity = () => {
    setShowDeleteConfirm(false);
    setCommunitiesList(prev => prev.filter(c => c.id !== activeParentCommunity.id));
    setCommunitySubView('list');
    setActiveSubgroup(null);
    setActiveParentCommunity(null);
    showAppAlert('Community deleted successfully!');
  };

  const handleRequestJoin = (commId) => {
    setDiscoverableCommunities(prev => prev.map(c => {
      if (c.id === commId) {
        return { ...c, joinStatus: 'pending' };
      }
      return c;
    }));

    showAppAlert('Request sent to the community owner. Pending approval.');

    setTimeout(() => {
      const targetComm = INITIAL_DISCOVERABLE_COMMUNITIES.find(c => c.id === commId);
      if (!targetComm) return;

      setCommunitiesList(prevList => {
        if (prevList.some(c => c.id === commId)) return prevList;

        const approvedCommunity = {
          id: targetComm.id,
          name: targetComm.name,
          totalMembers: '3',
          desc: targetComm.desc,
          iconBgColor: targetComm.iconBgColor,
          iconColor: targetComm.iconColor,
          isOwner: false,
          subgroups: [
            {
              id: targetComm.id + 10,
              name: 'Announcements',
              iconType: 'announcement',
              iconBgColor: '#E6F9F0',
              latestMessage: `Your request was approved by ${targetComm.owner}!`,
              timestamp: 'Just now',
              unreadCount: 1,
              onlyOwnerCanMessage: true,
              messages: [
                { id: 1, sender: 'System', text: `Welcome to the Announcements page of ${targetComm.name}!`, time: 'Just now', isSystem: true },
                { id: 2, sender: 'System', text: `Your request to join this community has been approved by the owner, ${targetComm.owner}.`, time: 'Just now', isSystem: true }
              ]
            },
            {
              id: targetComm.id + 20,
              name: 'General Forum',
              iconType: 'group',
              iconBgColor: '#E6EEFF',
              latestMessage: 'Welcome to the group!',
              timestamp: 'Just now',
              unreadCount: 0,
              onlyOwnerCanMessage: false,
              messages: [
                { id: 1, sender: 'System', text: `General Forum established.`, time: 'Just now', isSystem: true }
              ]
            }
          ]
        };

        return [approvedCommunity, ...prevList];
      });

      setCommunityMembers(prevMembers => ({
        ...prevMembers,
        [commId]: [targetComm.owner, 'Sanjay Ram', 'VGM Member']
      }));

      setDiscoverableCommunities(prev => prev.map(c => {
        if (c.id === commId) {
          return { ...c, joinStatus: 'joined' };
        }
        return c;
      }));

      showAppAlert(`Congratulations! Owner ${targetComm.owner} has approved your request to join "${targetComm.name}".`);
    }, 5000);
  };

  const handleApproveJoinRequest = (requester) => {
    const currentMembers = communityMembers[activeParentCommunity.id] || [];
    if (currentMembers.includes(requester)) return;
    const updated = [...currentMembers, requester];

    setCommunityMembers(prev => ({
      ...prev,
      [activeParentCommunity.id]: updated
    }));

    setCommunitiesList(prevList => prevList.map(comm => {
      if (comm.id === activeParentCommunity.id) {
        return {
          ...comm,
          totalMembers: `${updated.length}`
        };
      }
      return comm;
    }));

    setActiveParentCommunity(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        totalMembers: `${updated.length}`
      };
    });

    setReceivedJoinRequests(prev => ({
      ...prev,
      [activeParentCommunity.id]: (prev[activeParentCommunity.id] || []).filter(r => r !== requester)
    }));

    showAppAlert(`${requester} has been approved to join the community.`);
  };

  const handleRejectJoinRequest = (requester) => {
    setReceivedJoinRequests(prev => ({
      ...prev,
      [activeParentCommunity.id]: (prev[activeParentCommunity.id] || []).filter(r => r !== requester)
    }));

    showAppAlert(`Request from ${requester} has been denied.`);
  };

  const handleDeleteSubgroup = (subgroupId) => {
    const sub = activeParentCommunity.subgroups.find(s => s.id === subgroupId);
    if (sub && sub.name === 'Announcements') {
      showAppAlert('Announcements subgroup cannot be deleted.');
      return;
    }

    setCommunitiesList(prev => prev.map(comm => {
      if (comm.id === activeParentCommunity.id) {
        const updated = {
          ...comm,
          subgroups: comm.subgroups.filter(s => s.id !== subgroupId)
        };
        setActiveParentCommunity(updated);
        return updated;
      }
      return comm;
    }));

    showAppAlert('Subgroup deleted successfully!');
  };

  const handleCreateSubgroup = () => {
    if (!newGroupName.trim()) {
      showAppAlert('Please enter a group name.');
      return;
    }

    const newSubId = Date.now();
    const newSub = {
      id: newSubId,
      name: newGroupName.trim(),
      iconType: 'group',
      iconBgColor: '#FFF8E7',
      latestMessage: 'Welcome to the group!',
      timestamp: 'Just now',
      unreadCount: 0,
      onlyOwnerCanMessage: false,
      messages: [
        { id: 1, sender: 'System', text: `Subgroup "${newGroupName.trim()}" established by owner.`, time: 'Just now', isSystem: true }
      ]
    };

    setCommunitiesList(prev => prev.map(comm => {
      if (comm.id === activeParentCommunity.id) {
        const updated = {
          ...comm,
          subgroups: [...comm.subgroups, newSub]
        };
        setActiveParentCommunity(updated);
        return updated;
      }
      return comm;
    }));

    setShowAddGroupModal(false);
    setNewGroupName('');
    showAppAlert(`Subgroup "${newSub.name}" added successfully!`);
  };

  // 4. Community Detail / Subgroup List Management View
  const renderCommunityDetailView = () => {
    if (!activeParentCommunity) return null;

    return (
      <View style={styles.screenWrapper}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity 
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setCommunitySubView(communityDetailBackTo);
            }} 
            style={styles.headerBackBtn}
          >
            <BackArrowIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Community Info</Text>
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Community Card Header */}
          <View style={styles.detailCardHeader}>
            <View style={[styles.detailAvatarSquare, { backgroundColor: activeParentCommunity.iconBgColor || '#E6EEFF' }]}>
              <CommunityUsersIcon strokeColor={activeParentCommunity.iconColor || '#03254C'} />
            </View>
            <Text style={styles.detailCommunityName}>{activeParentCommunity.name}</Text>
            <Text style={styles.detailMembersText}>{activeParentCommunity.totalMembers} Members</Text>
            <Text style={styles.detailDescText}>{activeParentCommunity.desc || 'No description provided.'}</Text>
          </View>

          {/* Groups List Section */}
          <Text style={styles.detailGroupsSectionTitle}>Groups you're in</Text>
          <View style={styles.detailGroupsListContainer}>
            
            {/* Add group option (only if owner) */}
            {activeParentCommunity.isOwner && (
              <TouchableOpacity 
                style={styles.detailAddGroupRow}
                activeOpacity={0.8}
                onPress={() => {
                  setNewGroupName('');
                  setShowAddGroupModal(true);
                }}
              >
                <View style={[styles.detailAddGroupIconBox, { backgroundColor: '#E6F9F0' }]}>
                  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7DBE14" strokeWidth="2.5">
                    <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <Circle cx="9" cy="7" r="4" />
                    <Line x1="19" y1="8" x2="19" y2="14" />
                    <Line x1="16" y1="11" x2="22" y2="11" />
                  </Svg>
                </View>
                <Text style={styles.detailAddGroupText}>Add group</Text>
              </TouchableOpacity>
            )}

            {/* Subgroups List */}
            {activeParentCommunity.subgroups.map((sub) => (
              <View key={sub.id} style={styles.detailSubgroupRow}>
                <TouchableOpacity 
                  style={styles.detailSubgroupLeftCol}
                  activeOpacity={0.7}
                  onPress={() => handleOpenChat(activeParentCommunity, sub)}
                >
                  <View style={[
                    styles.subgroupIconBox, 
                    { backgroundColor: sub.iconType === 'announcement' ? '#E6F9F0' : sub.iconBgColor || '#E6EEFF' }
                  ]}>
                    {sub.iconType === 'announcement' ? (
                      <MegaphoneIcon />
                    ) : (
                      <MultiUserIcon strokeColor="#03254C" />
                    )}
                  </View>
                  <View style={styles.detailSubgroupTextCol}>
                    <Text style={styles.detailSubgroupName}>{sub.name}</Text>
                    <Text style={styles.detailSubgroupLatestMsg} numberOfLines={1}>
                      {sub.latestMessage}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Delete button (Only if owner, and not announcements subgroup) */}
                {activeParentCommunity.isOwner && sub.name !== 'Announcements' && (
                  <TouchableOpacity 
                    style={styles.detailDeleteGroupBtn}
                    onPress={() => handleDeleteSubgroup(sub.id)}
                  >
                    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                      <Polyline points="3 6 5 6 21 6" />
                      <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <Line x1="10" y1="11" x2="10" y2="17" />
                      <Line x1="14" y1="11" x2="14" y2="17" />
                    </Svg>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
          <View style={{ height: 120 }} />
        </ScrollView>
      </View>
    );
  };

  // 1. Communities Main List View
  const renderListView = () => (
    <View style={styles.screenWrapper}>
      {/* Light Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => onNavigate('home')} style={styles.headerBackBtn}>
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Light Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <View style={styles.searchIconBox}>
              <SearchIcon strokeColor="#64748B" />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search communities..."
              placeholderTextColor="#64748B"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Join New Community Section */}
        <View style={styles.discoveryToggleContainer}>
          <TouchableOpacity 
            style={[styles.discoveryToggleBtn, showDiscoveryPanel && styles.discoveryToggleBtnActive]}
            activeOpacity={0.8}
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setShowDiscoveryPanel(!showDiscoveryPanel);
            }}
          >
            <Text style={[styles.discoveryToggleText, showDiscoveryPanel && styles.discoveryToggleTextActive]}>
              {showDiscoveryPanel ? '▲ Close Discovery Panel' : '▼ Join New Community'}
            </Text>
          </TouchableOpacity>
        </View>

        {showDiscoveryPanel && (
          <View style={styles.discoveryContainer}>
            <Text style={styles.discoverySectionTitle}>Discover Communities</Text>
            
            {/* Search / Unique Code input */}
            <View style={styles.discoverySearchWrapper}>
              <View style={styles.searchIconBox}>
                <SearchIcon strokeColor="#64748B" />
              </View>
              <TextInput
                style={styles.discoverySearchInput}
                placeholder="Search by name or unique code..."
                placeholderTextColor="#64748B"
                value={discoverySearchQuery}
                onChangeText={setDiscoverySearchQuery}
              />
            </View>

            {/* List of unjoined communities */}
            <View style={styles.discoveryList}>
              {discoverableCommunities
                .filter(comm => 
                  comm.name.toLowerCase().includes(discoverySearchQuery.toLowerCase()) ||
                  comm.code.toLowerCase().includes(discoverySearchQuery.toLowerCase())
                )
                .map(comm => (
                  <View key={comm.id} style={styles.discoverCard}>
                    <View style={styles.discoverCardHeader}>
                      <View style={[styles.parentIconBox, { backgroundColor: comm.iconBgColor, width: 40, height: 40 }]}>
                        <CommunityUsersIcon strokeColor={comm.iconColor} />
                      </View>
                      <View style={styles.discoverTitleCol}>
                        <Text style={styles.discoverNameText}>{comm.name}</Text>
                        <Text style={styles.discoverCodeText}>Code: {comm.code} • Owner: {comm.owner}</Text>
                      </View>
                    </View>
                    <Text style={styles.discoverDescText}>{comm.desc}</Text>
                    
                    <View style={styles.discoverActionRow}>
                      {comm.joinStatus === 'none' && (
                        <TouchableOpacity 
                          style={styles.joinCommBtn}
                          onPress={() => handleRequestJoin(comm.id)}
                        >
                          <Text style={styles.joinCommBtnText}>Join Community</Text>
                        </TouchableOpacity>
                      )}
                      {comm.joinStatus === 'pending' && (
                        <View style={styles.pendingBadge}>
                          <Text style={styles.pendingBadgeText}>Pending Approval...</Text>
                        </View>
                      )}
                      {comm.joinStatus === 'joined' && (
                        <View style={styles.joinedBadge}>
                          <Text style={styles.joinedBadgeText}>✓ Joined</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              {discoverableCommunities.filter(comm => 
                comm.name.toLowerCase().includes(discoverySearchQuery.toLowerCase()) ||
                comm.code.toLowerCase().includes(discoverySearchQuery.toLowerCase())
              ).length === 0 && (
                <Text style={styles.noResultsText}>No communities match your search.</Text>
              )}
            </View>
            <View style={styles.discoveryDivider} />
          </View>
        )}

        {/* Communities Nested List */}
        <View style={styles.communitiesSection}>
          {filteredCommunities.map(comm => {
            const isExpanded = !!expandedCommunities[comm.id];
            const hasMoreThanThree = comm.subgroups.length > 3;
            const visibleSubgroups = isExpanded ? comm.subgroups : comm.subgroups.slice(0, 3);

            return (
              <View key={comm.id} style={styles.communityContainer}>
                {/* Parent Community Header */}
                <TouchableOpacity 
                  style={styles.communityHeaderRow}
                  activeOpacity={0.7}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setActiveParentCommunity(comm);
                    setCommunityDetailBackTo('list');
                    setCommunitySubView('community-detail');
                  }}
                >
                  <View style={[styles.parentIconBox, { backgroundColor: comm.iconBgColor }]}>
                    <CommunityUsersIcon strokeColor={comm.iconColor} />
                  </View>
                  <View style={styles.parentTitleCol}>
                    <Text style={styles.parentTitleText} numberOfLines={1}>
                      {comm.name}
                    </Text>
                    <Text style={styles.parentMembersText}>
                      {comm.totalMembers} Members
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Subgroups list */}
                <View style={styles.subgroupsList}>
                  {visibleSubgroups.map(sub => (
                    <TouchableOpacity 
                      key={sub.id} 
                      style={styles.subgroupRow}
                      activeOpacity={0.7}
                      onPress={() => handleOpenChat(comm, sub)}
                    >
                      <View style={styles.subgroupLeftCol}>
                        <View style={[
                          styles.subgroupIconBox, 
                          { backgroundColor: sub.iconType === 'announcement' ? '#E6F9F0' : sub.iconBgColor || '#E6EEFF' }
                        ]}>
                          {sub.iconType === 'announcement' ? (
                            <MegaphoneIcon />
                          ) : (
                            <MultiUserIcon strokeColor="#03254C" />
                          )}
                        </View>
                        <View style={styles.subgroupTextCol}>
                          <Text style={styles.subgroupNameText} numberOfLines={1}>
                            {sub.name}
                          </Text>
                          <Text style={styles.subgroupMsgText} numberOfLines={1}>
                            {sub.latestMessage}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.subgroupRightCol}>
                        <Text style={styles.subgroupTimeText}>{sub.timestamp}</Text>
                        {sub.unreadCount > 0 ? (
                          <View style={styles.unreadBadge}>
                            <Text style={styles.unreadBadgeText}>{sub.unreadCount}</Text>
                          </View>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  ))}

                  {/* View All */}
                  {hasMoreThanThree && (
                    <TouchableOpacity 
                      style={styles.viewAllRow}
                      activeOpacity={0.7}
                      onPress={() => toggleExpand(comm.id)}
                    >
                      <Text style={styles.viewAllText}>
                        {isExpanded ? 'Collapse' : 'View all'}
                      </Text>
                      <View style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}>
                        <DownArrowIcon />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
                
                {/* Visual spacer band between communities */}
                <View style={styles.communitySpacerBand} />
              </View>
            );
          })}

          {filteredCommunities.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No communities or subgroups found.</Text>
            </View>
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Action Button - Create New Community */}
      <TouchableOpacity 
        style={[styles.fab, { bottom: (safeAreaBottom > 0 ? safeAreaBottom + 86 : (Platform.OS === 'ios' ? 110 : 96)) }]}
        activeOpacity={0.85}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setCommunitySubView('create');
        }}
      >
        <PlusIcon />
      </TouchableOpacity>
    </View>
  );

  // 2. Subgroup Chat View (Light Mode with Alignment to Chat Detail UI & No Call buttons)
  const renderChatView = () => {
    if (!activeSubgroup || !activeParentCommunity) return null;
    const isRestricted = activeSubgroup.onlyOwnerCanMessage && !activeParentCommunity.isOwner;

    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.chatWrapper}
      >
        {/* Chat Header Bar (Removed call buttons, added options drop down menu) */}
        <View style={[styles.headerBar, styles.conversationHeaderBar]}>
          <View style={styles.convHeaderLeftCol}>
            <TouchableOpacity 
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setCommunitySubView('list');
              }} 
              style={styles.convHeaderBackBtn}
            >
              <BackArrowIcon />
            </TouchableOpacity>
            
            <View style={styles.convHeaderAvatarContainer}>
              <View style={[
                styles.convHeaderAvatarSquare, 
                { backgroundColor: activeSubgroup.iconType === 'announcement' ? '#E6F9F0' : activeSubgroup.iconBgColor || '#E6EEFF' }
              ]}>
                {activeSubgroup.iconType === 'announcement' ? (
                  <MegaphoneIcon />
                ) : (
                  <MultiUserIcon strokeColor="#03254C" />
                )}
              </View>
              <View style={[
                styles.chatStatusDot, 
                { backgroundColor: '#7DBE14', borderColor: '#FFFFFF', bottom: -1, right: -1 }
              ]} />
            </View>

            <TouchableOpacity 
              style={styles.convHeaderTitleCol}
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setCommunityDetailBackTo('chat');
                setCommunitySubView('community-detail');
              }}
            >
              <Text style={styles.convHeaderName}>{activeSubgroup.name}</Text>
              <Text style={styles.convHeaderStatus}>
                {activeParentCommunity.name}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.convHeaderRightButtons}>
            <TouchableOpacity 
              style={styles.convHeaderActionBtn}
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setShowChatMenu(!showChatMenu);
              }}
            >
              <ThreeDotsIcon strokeColor="#03254C" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat Message Scroll */}
        <ScrollView 
          style={styles.chatScroll} 
          contentContainerStyle={styles.chatScrollContent}
          ref={chatScrollViewRef}
          onContentSizeChange={() => chatScrollViewRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.convDateMarker}>Today</Text>

          {activeSubgroup.messages.map((msg) => {
            const isMe = msg.sender === 'Me';
            const isSystem = msg.isSystem;
            
            if (isSystem) {
              return (
                <View key={msg.id} style={styles.messageSystemBubble}>
                  <Text style={styles.messageSystemText}>{msg.text}</Text>
                </View>
              );
            }

            return (
              <View key={msg.id} style={[styles.msgRow, isMe ? styles.msgRowMe : styles.msgRowThem]}>
                {!isMe && (
                  <View style={styles.msgAvatarContainer}>
                    <View style={[styles.msgAvatarSquare, { backgroundColor: '#E0F2FE' }]}>
                      <Text style={styles.msgAvatarText}>
                        {msg.sender ? msg.sender.charAt(0) : '?'}
                      </Text>
                    </View>
                  </View>
                )}
                <View style={[styles.msgBubble, isMe ? styles.msgBubbleMe : styles.msgBubbleThem, msg.isAttachment && styles.msgBubbleAttachment]}>
                  {!isMe && (
                    <Text style={styles.messageSenderName}>{msg.sender}</Text>
                  )}
                  {msg.isAttachment ? (
                    renderAttachmentBubble(msg)
                  ) : (
                    <Text style={[styles.msgText, isMe ? styles.msgTextMe : styles.msgTextThem]}>
                      {msg.text}
                    </Text>
                  )}
                  <View style={styles.msgFooterRow}>
                    <Text style={[styles.msgTime, isMe ? styles.msgTimeMe : styles.msgTimeThem]}>
                      {msg.time}
                    </Text>
                    {isMe && (
                      <Text style={styles.msgReadStatus}> • READ</Text>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Bottom Input Area / Locked Announcement Banner */}
        {isRestricted ? (
          <View style={styles.lockedInputBar}>
            <Text style={styles.lockedInputText}>
              Only administrators can send messages to this group.
            </Text>
          </View>
        ) : (
          <View style={styles.convInputContainer}>
            <TouchableOpacity style={styles.convPlusBtn} onPress={() => setShowAttachmentMenu(true)}>
              <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5">
                <Path d="M12 5v14M5 12h14" />
              </Svg>
            </TouchableOpacity>
            <View style={styles.convInputWrapper}>
              <TextInput
                style={styles.convTextInput}
                placeholder="Type a message..."
                placeholderTextColor="#94A3B8"
                value={typedMessage}
                onChangeText={setTypedMessage}
                onSubmitEditing={handleSendMessage}
              />
            </View>
            <TouchableOpacity style={styles.convSendBtn} onPress={handleSendMessage}>
              <SendIcon />
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    );
  };

  // 3. Create New Community View (Light Mode)
  const renderCreateView = () => (
    <View style={styles.screenWrapper}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity 
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setCommunitySubView('list');
          }} 
          style={styles.headerBackBtn}
        >
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Community</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Title Container */}
        <View style={styles.createTitleContainer}>
          <Text style={styles.createTitleText}>Create New Community</Text>
          <Text style={styles.createSubtitleText}>
            Establish a new professional subnetwork. All groups are monitored for compliance and policy guidelines.
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Community Name */}
          <View style={styles.formFieldGroup}>
            <Text style={styles.fieldLabel}>Community Name</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g. Corporate Tax Advocates"
              placeholderTextColor="#64748B"
              value={formName}
              onChangeText={setFormName}
            />
          </View>

          {/* Description */}
          <View style={styles.formFieldGroup}>
            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={styles.formTextarea}
              placeholder="Brief overview of the community's purpose..."
              placeholderTextColor="#64748B"
              multiline={true}
              numberOfLines={4}
              value={formDesc}
              onChangeText={setFormDesc}
              textAlignVertical="top"
            />
          </View>

          {/* Category Dropdown */}
          <View style={styles.formFieldGroup}>
            <Text style={styles.fieldLabel}>Group Category</Text>
            <TouchableOpacity 
              style={styles.dropdownBox}
              activeOpacity={0.8}
              onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <Text style={styles.dropdownSelectedText}>{formCategory}</Text>
              <DownArrowIcon />
            </TouchableOpacity>

            {showCategoryDropdown && (
              <View style={styles.dropdownOptionsList}>
                {['Specialized', 'Regional', 'Public', 'Confidential'].map(opt => (
                  <TouchableOpacity 
                    key={opt}
                    style={styles.dropdownOptionItem}
                    onPress={() => {
                      setFormCategory(opt);
                      setShowCategoryDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Privacy Switch */}
          <View style={styles.formFieldGroup}>
            <Text style={styles.fieldLabel}>Privacy Settings</Text>
            <View style={styles.switchRowContainer}>
              <Text style={styles.switchLabel}>Publicly Visible</Text>
              <TouchableOpacity 
                style={[styles.switchTrack, isPubliclyVisible ? styles.switchTrackActive : styles.switchTrackInactive]}
                activeOpacity={0.85}
                onPress={() => setIsPubliclyVisible(!isPubliclyVisible)}
              >
                <View style={[styles.switchThumb, isPubliclyVisible ? styles.switchThumbActive : styles.switchThumbInactive]} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Member Limit Slider */}
          <View style={styles.formFieldGroup}>
            <View style={styles.limitRow}>
              <Text style={styles.fieldLabel}>Member Limit</Text>
              <View style={[styles.limitBadge, isNoLimit && styles.limitBadgeDisabled]}>
                <Text style={[styles.limitBadgeText, isNoLimit && styles.limitBadgeTextDisabled]}>
                  {isNoLimit ? 'No Limit' : `${memberLimit} Members`}
                </Text>
              </View>
            </View>

            {/* No Limit Checkbox */}
            <TouchableOpacity 
              style={styles.checkboxRow}
              activeOpacity={0.8}
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setIsNoLimit(!isNoLimit);
              }}
            >
              <View style={[styles.checkboxContainer, isNoLimit && styles.checkboxContainerActive]}>
                {isNoLimit && (
                  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="4">
                    <Path d="M20 6 9 17l-5-5" />
                  </Svg>
                )}
              </View>
              <Text style={styles.checkboxLabel}>No member limit for this community</Text>
            </TouchableOpacity>
            
            {/* Slider progress track */}
            <View 
              style={[styles.sliderControlsRow, isNoLimit && { opacity: 0.5 }]} 
              pointerEvents={isNoLimit ? 'none' : 'auto'}
            >
              <TouchableOpacity 
                style={[styles.sliderBtn, isNoLimit && styles.sliderBtnDisabled]} 
                onPress={() => setMemberLimit(prev => Math.max(100, prev - 50))}
                disabled={isNoLimit}
              >
                <Text style={[styles.sliderBtnText, isNoLimit && styles.sliderBtnTextDisabled]}>-</Text>
              </TouchableOpacity>
              <View style={styles.sliderTrackContainer}>
                <View style={[
                  styles.sliderProgressFill, 
                  isNoLimit && styles.sliderProgressFillDisabled,
                  { width: isNoLimit ? '100%' : `${((memberLimit - 100) / 900) * 100}%` }
                ]} />
              </View>
              <TouchableOpacity 
                style={[styles.sliderBtn, isNoLimit && styles.sliderBtnDisabled]} 
                onPress={() => setMemberLimit(prev => Math.min(1000, prev + 50))}
                disabled={isNoLimit}
              >
                <Text style={[styles.sliderBtnText, isNoLimit && styles.sliderBtnTextDisabled]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitBtn}
            activeOpacity={0.85}
            onPress={handleEstablishCommunity}
          >
            <View style={styles.submitBtnContent}>
              <CheckIcon />
              <Text style={styles.submitBtnText}>Establish Community</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );

  const renderRestrictedView = () => {
    if (!activeParentCommunity) return null;
    return (
      <View style={[styles.screenWrapper, { justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#FFF0F0' }]}>
        <View style={{ marginBottom: 20 }}>
          <Svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <Line x1="12" y1="9" x2="12" y2="13" />
            <Line x1="12" y1="17" x2="12.01" y2="17" />
          </Svg>
        </View>
        <Text style={{ fontSize: 20, fontWeight: '800', color: '#EF4444', textAlign: 'center', marginBottom: 12 }}>
          COMMUNITY RESTRICTED BY THE ADMIN
        </Text>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#64748B', textAlign: 'center', marginBottom: 30 }}>
          This community has been restricted for violating community rules.
        </Text>
        
        {activeParentCommunity.isOwner && (
          <TouchableOpacity 
            style={[styles.modalBtn, styles.modalBtnSave, { backgroundColor: '#1E40AF', height: 'auto', paddingVertical: 14, paddingHorizontal: 20, width: '100%', marginBottom: 16 }]}
            onPress={() => {
              const tag = `[#${activeParentCommunity.name}]`;
              const msg = `Dear Admin, my community ${tag} has been restricted. I would like to request an appeal and review the decision.`;
              setPendingAdminMessage(msg);
              onNavigate('chat');
            }}
          >
            <Text style={[styles.modalBtnSaveText, { fontSize: 15, fontWeight: '700', textAlign: 'center' }]}>
              Convey with Admin
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.modalBtn, styles.modalBtnCancel, { height: 'auto', paddingVertical: 14, paddingHorizontal: 20, width: '100%' }]}
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setCommunitySubView('list');
            setActiveParentCommunity(null);
            setActiveSubgroup(null);
          }}
        >
          <Text style={[styles.modalBtnCancelText, { fontSize: 15, fontWeight: '700', textAlign: 'center' }]}>
            RETURN BACK
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAttachmentMenu = () => {
    if (!showAttachmentMenu) return null;
    return (
      <View style={styles.shareOverlay}>
        <TouchableOpacity 
          style={styles.shareBackdrop} 
          activeOpacity={1}
          onPress={() => setShowAttachmentMenu(false)}
        />
        <View style={styles.shareBottomSheet}>
          <View style={styles.shareIndicator} />
          <Text style={styles.shareTitle}>Send Attachment</Text>
          
          <View style={styles.shareGrid}>
            <TouchableOpacity style={styles.shareOption} onPress={() => { setShowAttachmentMenu(false); setActiveModal('gallery'); }}>
              <View style={[styles.shareIconCircle, { backgroundColor: '#E0F2FE' }]}>
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <Circle cx="8.5" cy="8.5" r="1.5" />
                  <Path d="m21 15-5-5L5 21" />
                </Svg>
              </View>
              <Text style={styles.shareOptionText}>Images</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareOption} onPress={() => { setShowAttachmentMenu(false); setActiveModal('files'); }}>
              <View style={[styles.shareIconCircle, { backgroundColor: '#F0FDF4' }]}>
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <Path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </Svg>
              </View>
              <Text style={styles.shareOptionText}>Files</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareOption} onPress={() => { setShowAttachmentMenu(false); setActiveModal('audio_record'); }}>
              <View style={[styles.shareIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <Path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
                </Svg>
              </View>
              <Text style={styles.shareOptionText}>Audio</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareOption} onPress={() => { setShowAttachmentMenu(false); setActiveModal('location_select'); }}>
              <View style={[styles.shareIconCircle, { backgroundColor: '#F3E8FF' }]}>
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7E22CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
                  <Circle cx="12" cy="10" r="3" />
                </Svg>
              </View>
              <Text style={styles.shareOptionText}>Location</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.shareCancelBtn} onPress={() => setShowAttachmentMenu(false)}>
            <Text style={styles.shareCancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderGalleryModal = () => {
    if (activeModal !== 'gallery') return null;
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentCard}>
          <Text style={styles.modalTitle}>Select Image from Gallery</Text>
          <View style={styles.galleryGrid}>
            {mockLocalImages.map(img => (
              <TouchableOpacity 
                key={img.id} 
                style={styles.galleryItemBtn}
                onPress={() => handleSendAttachment('image', img)}
              >
                <Image source={img.path} style={styles.galleryThumbnail} />
                <Text style={styles.galleryItemName} numberOfLines={1}>{img.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setActiveModal(null)}>
            <Text style={styles.modalCloseBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFilesModal = () => {
    if (activeModal !== 'files') return null;
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentCard}>
          <Text style={styles.modalTitle}>Local Documents Explorer</Text>
          <ScrollView style={styles.filesList} showsVerticalScrollIndicator={false}>
            {mockLocalFiles.map(file => (
              <TouchableOpacity 
                key={file.id} 
                style={styles.fileItemRow}
                onPress={() => handleSendAttachment('file', file)}
              >
                <View style={styles.fileIconCircle}>
                  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#03254C" strokeWidth="2.5">
                    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <Path d="M14 2v6h6" />
                  </Svg>
                </View>
                <View style={styles.fileItemDetails}>
                  <Text style={styles.fileItemName} numberOfLines={1}>{file.name}</Text>
                  <Text style={styles.fileItemSize}>{file.size} • PDF</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setActiveModal(null)}>
            <Text style={styles.modalCloseBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderAudioRecordModal = () => {
    if (activeModal !== 'audio_record') return null;
    const isRecording = audioRecordingState === 'recording';
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentCard}>
          <Text style={styles.modalTitle}>Voice Recorder</Text>
          
          <View style={styles.audioRecorderCard}>
            <View style={[styles.micPulsingCircle, isRecording && styles.micPulsingCircleActive]}>
              <Svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={isRecording ? "#FFFFFF" : "#EF4444"} strokeWidth="2.5">
                <Path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <Path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
              </Svg>
            </View>
            <Text style={styles.audioTimerText}>{formatCallTime(recordingDuration)}</Text>
            <Text style={styles.recordingStatusText}>
              {isRecording ? 'Recording audio memo...' : 'Ready to record voice memo'}
            </Text>

            <View style={styles.audioControlsRow}>
              {isRecording ? (
                <TouchableOpacity 
                  style={[styles.audioControlBtn, styles.audioControlBtnRecord, styles.audioControlBtnRecordActive]} 
                  onPress={() => {
                    setAudioRecordingState('idle');
                    const durationStr = formatCallTime(recordingDuration);
                    handleSendAttachment('audio', { duration: durationStr });
                  }}
                >
                  <Text style={[styles.audioControlBtnText, styles.audioControlBtnTextWhite]}>Stop & Send</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity 
                    style={[styles.audioControlBtn, styles.audioControlBtnCancel]} 
                    onPress={() => setActiveModal(null)}
                  >
                    <Text style={styles.audioControlBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.audioControlBtn, styles.audioControlBtnRecord]} 
                    onPress={() => {
                      setRecordingDuration(0);
                      setAudioRecordingState('recording');
                    }}
                  >
                    <Text style={[styles.audioControlBtnText, styles.audioControlBtnTextWhite]}>Start</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderLocationSelectModal = () => {
    if (activeModal !== 'location_select') return null;
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentCard}>
          <Text style={styles.modalTitle}>Share Nearby Place</Text>
          <ScrollView style={styles.locationsList} showsVerticalScrollIndicator={false}>
            {mockLocalLocations.map(loc => (
              <TouchableOpacity 
                key={loc.id} 
                style={styles.locationItemRow}
                onPress={() => handleSendAttachment('location', loc)}
              >
                <View style={styles.locationIconCircle}>
                  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7E22CE" strokeWidth="2.5">
                    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
                    <Circle cx="12" cy="10" r="3" />
                  </Svg>
                </View>
                <View style={styles.locationItemDetails}>
                  <Text style={styles.locationItemName} numberOfLines={1}>{loc.name}</Text>
                  <Text style={styles.locationItemDesc}>{loc.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setActiveModal(null)}>
            <Text style={styles.modalCloseBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      {activeParentCommunity?.restricted && communitySubView !== 'list' ? (
        renderRestrictedView()
      ) : (
        <>
          {communitySubView === 'list' && renderListView()}
          {communitySubView === 'chat' && renderChatView()}
          {communitySubView === 'create' && renderCreateView()}
          {communitySubView === 'community-detail' && renderCommunityDetailView()}
        </>
      )}

      {/* 1. Subgroup Chat Options Menu Overlay */}
      {showChatMenu && activeParentCommunity && (
        <View style={styles.dropdownMenuWrapper}>
          <TouchableOpacity 
            style={styles.dropdownMenuBackdrop} 
            activeOpacity={1} 
            onPress={() => setShowChatMenu(false)}
          />
          <View style={styles.dropdownMenuCard}>
            {activeParentCommunity.isOwner ? (
              <>
                <TouchableOpacity 
                  style={styles.dropdownMenuItem}
                  onPress={() => {
                    setShowChatMenu(false);
                    setEditName(activeParentCommunity.name);
                    setEditDesc(activeParentCommunity.desc || '');
                    setShowEditDetailsModal(true);
                  }}
                >
                  <Text style={styles.dropdownMenuItemText}>Edit Details</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.dropdownMenuItem}
                  onPress={handleToggleMessageAccess}
                >
                  <Text style={styles.dropdownMenuItemText}>
                    {activeSubgroup.onlyOwnerCanMessage ? 'Allow All to Message' : 'Only Owner Can Message'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.dropdownMenuItem}
                  onPress={() => {
                    setShowChatMenu(false);
                    setMemberSearchQuery('');
                    setMembersModalTab('members');
                    setShowManageMembersModal(true);
                  }}
                >
                  <Text style={styles.dropdownMenuItemText}>Manage Members</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.dropdownMenuItem}
                  onPress={() => {
                    setShowChatMenu(false);
                    setShowReportIssueModal(true);
                  }}
                >
                  <Text style={[styles.dropdownMenuItemText, { color: '#EF4444' }]}>Report a Issue</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.dropdownMenuItem, styles.dropdownMenuItemDestructive]}
                  onPress={() => {
                    setShowChatMenu(false);
                    setShowDeleteConfirm(true);
                  }}
                >
                  <Text style={styles.dropdownMenuItemTextDestructive}>Delete Community</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity 
                  style={styles.dropdownMenuItem}
                  onPress={() => {
                    setShowChatMenu(false);
                    showAppAlert(`Name: ${activeParentCommunity.name}\nDescription: ${activeParentCommunity.desc || 'No description'}\nMembers: ${activeParentCommunity.totalMembers}`, 'Community Info');
                  }}
                >
                  <Text style={styles.dropdownMenuItemText}>View Info</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.dropdownMenuItem}
                  onPress={() => {
                    setShowChatMenu(false);
                    showAppAlert('Notifications muted.');
                  }}
                >
                  <Text style={styles.dropdownMenuItemText}>Mute Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.dropdownMenuItem}
                  onPress={() => {
                    setShowChatMenu(false);
                    setShowReportIssueModal(true);
                  }}
                >
                  <Text style={[styles.dropdownMenuItemText, { color: '#EF4444' }]}>Report a Issue</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      )}

      {/* 2. Edit Details Modal */}
      {showEditDetailsModal && activeParentCommunity && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCard}>
            <Text style={styles.modalTitle}>Edit Community Details</Text>
            
            <View style={styles.formFieldGroup}>
              <Text style={styles.fieldLabel}>Community Name</Text>
              <TextInput
                style={styles.formInput}
                value={editName}
                onChangeText={setEditName}
              />
            </View>

            <View style={styles.formFieldGroup}>
              <Text style={styles.fieldLabel}>Description</Text>
              <TextInput
                style={styles.formTextarea}
                value={editDesc}
                onChangeText={setEditDesc}
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setShowEditDetailsModal(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnSave]}
                onPress={handleSaveDetails}
              >
                <Text style={styles.modalBtnSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* 3. Manage Members Modal */}
      {showManageMembersModal && activeParentCommunity && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCard}>
            <Text style={styles.modalTitle}>Manage Members</Text>

            {/* Modal Tabs if Owner */}
            {activeParentCommunity.isOwner && (
              <View style={styles.modalTabsRow}>
                <TouchableOpacity 
                  style={[styles.modalTabButton, membersModalTab === 'members' && styles.modalTabButtonActive]}
                  onPress={() => setMembersModalTab('members')}
                >
                  <Text style={[styles.modalTabButtonText, membersModalTab === 'members' && styles.modalTabButtonTextActive]}>
                    Members ({(communityMembers[activeParentCommunity.id] || []).length})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalTabButton, membersModalTab === 'requests' && styles.modalTabButtonActive]}
                  onPress={() => setMembersModalTab('requests')}
                >
                  <Text style={[styles.modalTabButtonText, membersModalTab === 'requests' && styles.modalTabButtonTextActive]}>
                    Requests ({(receivedJoinRequests[activeParentCommunity.id] || []).length})
                  </Text>
                  {(receivedJoinRequests[activeParentCommunity.id] || []).length > 0 && (
                    <View style={styles.tabBadge}>
                      <Text style={styles.tabBadgeText}>{(receivedJoinRequests[activeParentCommunity.id] || []).length}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Tab: Requests (Only if owner and tab selected) */}
            {activeParentCommunity.isOwner && membersModalTab === 'requests' ? (
              <ScrollView style={styles.membersScrollView} showsVerticalScrollIndicator={false}>
                {(receivedJoinRequests[activeParentCommunity.id] || []).map(requester => (
                  <View key={requester} style={styles.memberItemRow}>
                    <View style={[styles.memberAvatarCircle, { backgroundColor: '#F3E8FF' }]}>
                      <Text style={[styles.memberAvatarInitial, { color: '#9333EA' }]}>{requester.charAt(0)}</Text>
                    </View>
                    <View style={styles.memberInfoCol}>
                      <Text style={styles.memberNameText}>{requester}</Text>
                      <Text style={styles.memberRoleText}>{getUserRole(requester)}</Text>
                    </View>
                    <View style={styles.requestActionRow}>
                      <TouchableOpacity 
                        style={styles.requestApproveBtn}
                        onPress={() => handleApproveJoinRequest(requester)}
                      >
                        <Text style={styles.requestApproveText}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.requestDenyBtn}
                        onPress={() => handleRejectJoinRequest(requester)}
                      >
                        <Text style={styles.requestDenyText}>Deny</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                {(receivedJoinRequests[activeParentCommunity.id] || []).length === 0 && (
                  <Text style={styles.noResultsText}>No pending join requests.</Text>
                )}
              </ScrollView>
            ) : (
              <>
                {/* Search Input Box */}
                <View style={styles.modalSearchContainer}>
                  <View style={styles.modalSearchWrapper}>
                    <TextInput
                      style={styles.modalSearchInput}
                      placeholder="Search profile to add..."
                      placeholderTextColor="#64748B"
                      value={memberSearchQuery}
                      onChangeText={setMemberSearchQuery}
                    />
                    <TouchableOpacity style={styles.modalSearchIconBox}>
                      <SearchIcon strokeColor="#03254C" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Search Results / Candidates to Add */}
                <Text style={styles.memberListSubtitle}>
                  {memberSearchQuery ? 'SEARCH RESULTS' : 'SUGGESTED TO ADD'}
                </Text>
                <ScrollView style={styles.addMemberScrollView} showsVerticalScrollIndicator={false}>
                  {SIMULATED_USERS
                    .filter(user => !(communityMembers[activeParentCommunity.id] || []).includes(user))
                    .filter(user => user.toLowerCase().includes(memberSearchQuery.toLowerCase()))
                    .map(user => (
                      <View key={user} style={styles.memberItemRow}>
                        <View style={styles.memberAvatarCircle}>
                          <Text style={styles.memberAvatarInitial}>{user.charAt(0)}</Text>
                        </View>
                        <View style={styles.memberInfoCol}>
                          <Text style={styles.memberNameText}>{user}</Text>
                          <Text style={styles.memberRoleText}>{getUserRole(user)}</Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.addMemberActionBtn}
                          onPress={() => handleAddMember(user)}
                        >
                          <Text style={styles.addMemberActionText}>+ Add</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  {SIMULATED_USERS
                    .filter(user => !(communityMembers[activeParentCommunity.id] || []).includes(user))
                    .filter(user => user.toLowerCase().includes(memberSearchQuery.toLowerCase())).length === 0 && (
                      <Text style={styles.noResultsText}>No profile matches found.</Text>
                    )}
                </ScrollView>

                {/* Current Members List */}
                <Text style={styles.memberListSubtitle}>CURRENT MEMBERS</Text>
                <ScrollView style={styles.membersScrollView} showsVerticalScrollIndicator={false}>
                  {(communityMembers[activeParentCommunity.id] || []).map(member => (
                    <View key={member} style={styles.memberItemRow}>
                      <View style={[styles.memberAvatarCircle, { backgroundColor: '#E6EEFF' }]}>
                        <Text style={styles.memberAvatarInitial}>{member.charAt(0)}</Text>
                      </View>
                      <View style={styles.memberInfoCol}>
                        <Text style={styles.memberNameText}>{member}</Text>
                        <Text style={styles.memberRoleText}>{getUserRole(member)}</Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.removeMemberBtn}
                        onPress={() => handleRemoveMember(member)}
                      >
                        <Text style={styles.removeMemberText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </>
            )}

            <TouchableOpacity 
              style={styles.modalCloseBtn}
              onPress={() => {
                setMemberSearchQuery('');
                setMembersModalTab('members');
                setShowManageMembersModal(false);
              }}
            >
              <Text style={styles.modalCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 4. Delete Confirmation Modal */}
      {showDeleteConfirm && activeParentCommunity && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCard}>
            <Text style={styles.modalTitle}>Delete Community</Text>
            <Text style={styles.deleteConfirmText}>
              Are you sure you want to delete "{activeParentCommunity.name}"? This will permanently remove the community and all of its subgroups.
            </Text>
            <View style={styles.modalActionsRow}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setShowDeleteConfirm(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnDelete]}
                onPress={confirmDeleteCommunity}
              >
                <Text style={styles.modalBtnDeleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {/* 5. Add Group Modal */}
      {showAddGroupModal && activeParentCommunity && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCard}>
            <Text style={styles.modalTitle}>Add New Group</Text>
            
            <View style={styles.formFieldGroup}>
              <Text style={styles.fieldLabel}>Group Name</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Tax Policy Advisory"
                placeholderTextColor="#64748B"
                value={newGroupName}
                onChangeText={setNewGroupName}
              />
            </View>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setShowAddGroupModal(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnSave]}
                onPress={handleCreateSubgroup}
              >
                <Text style={styles.modalBtnSaveText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Report Issue Modal */}
      {showReportIssueModal && activeParentCommunity && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCard}>
            <Text style={styles.modalTitle}>Report an Issue</Text>
            
            {/* Issue Type Dropdown */}
            <View style={styles.formFieldGroup}>
              <Text style={styles.fieldLabel}>Kind of Issue</Text>
              <TouchableOpacity 
                style={styles.dropdownBox}
                activeOpacity={0.8}
                onPress={() => setShowIssueTypeDropdown(!showIssueTypeDropdown)}
              >
                <Text style={styles.dropdownSelectedText}>{issueType}</Text>
                <DownArrowIcon />
              </TouchableOpacity>

              {showIssueTypeDropdown && (
                <View style={[styles.dropdownOptionsList, { position: 'relative', zIndex: 100, marginTop: 4 }]}>
                  {['Illegal Activity', 'Unauthorized Works', 'Spam / Harassment', 'Intellectual Property Violation'].map(opt => (
                    <TouchableOpacity 
                      key={opt}
                      style={styles.dropdownOptionItem}
                      onPress={() => {
                        setIssueType(opt);
                        setShowIssueTypeDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownOptionText}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Details */}
            <View style={styles.formFieldGroup}>
              <Text style={styles.fieldLabel}>Details</Text>
              <TextInput
                style={styles.formTextarea}
                placeholder="Explain the issue in detail..."
                placeholderTextColor="#64748B"
                multiline={true}
                numberOfLines={4}
                value={issueDetails}
                onChangeText={setIssueDetails}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => {
                  setShowReportIssueModal(false);
                  setIssueType('Illegal Activity');
                  setIssueDetails('');
                  setShowIssueTypeDropdown(false);
                }}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnSave]}
                onPress={() => {
                  if (!issueDetails.trim()) {
                    showAppAlert('Please provide details for the issue reported.');
                    return;
                  }
                  setShowReportIssueModal(false);
                  setShowReportSuccessModal(true);
                }}
              >
                <Text style={styles.modalBtnSaveText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Report Success Modal (Simulates Admin restriction) */}
      {showReportSuccessModal && activeParentCommunity && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCard}>
            <Text style={styles.modalTitle}>Report Submitted</Text>
            
            <Text style={styles.deleteConfirmText}>
              Your report has been successfully submitted to the administrator for review.
            </Text>
            
            <View style={{ marginVertical: 10 }}>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: '#EF4444', alignSelf: 'stretch', height: 44, justifyContent: 'center', borderRadius: 12 }]}
                onPress={handleRestrictCommunitySimulate}
              >
                <Text style={[styles.modalBtnSaveText, { textAlign: 'center' }]}>Restrict Community (Admin Action)</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnCancel, { alignSelf: 'center' }]}
                onPress={() => {
                  setShowReportSuccessModal(false);
                  setIssueType('Illegal Activity');
                  setIssueDetails('');
                }}
              >
                <Text style={styles.modalBtnCancelText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {renderAttachmentMenu()}
      {renderGalleryModal()}
      {renderFilesModal()}
      {renderAudioRecordModal()}
      {renderLocationSelectModal()}
    </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#E6EEFF',
    borderBottomWidth: 1.2,
    borderBottomColor: '#D0DDF5',
    gap: 12,
  },
  headerBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#03254C',
  },
  headerActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIconBtn: {
    padding: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#F8F9FF',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 38,
    borderWidth: 1.2,
    borderColor: '#D0DDF5',
  },
  searchIconBox: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
    color: '#03254C',
    fontWeight: '600',
    padding: 0,
  },
  communitiesSection: {
    marginTop: 8,
  },
  communityContainer: {
    backgroundColor: '#FFFFFF',
  },
  communityHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.8,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    gap: 14,
  },
  parentIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  parentTitleCol: {
    flex: 1,
  },
  parentTitleText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#03254C',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  parentMembersText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  subgroupsList: {
    backgroundColor: '#FFFFFF',
  },
  subgroupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1F5F9',
  },
  subgroupLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14,
  },
  subgroupIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subgroupTextCol: {
    flex: 1,
  },
  subgroupNameText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#03254C',
    marginBottom: 2,
  },
  subgroupMsgText: {
    fontSize: 13,
    color: '#64748B',
  },
  subgroupRightCol: {
    alignItems: 'flex-end',
    gap: 6,
  },
  subgroupTimeText: {
    fontSize: 11.5,
    color: '#64748B',
  },
  unreadBadge: {
    backgroundColor: '#7DBE14',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  viewAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingLeft: 70,
    paddingRight: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1F5F9',
  },
  viewAllText: {
    color: '#7DBE14',
    fontSize: 14,
    fontWeight: '700',
  },
  communitySpacerBand: {
    height: 10,
    backgroundColor: '#E6EEFF',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 110 : 96,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#7DBE14',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7DBE14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },

  // Subgroup Chat View Styles (Aligned with Message Detail UI)
  chatWrapper: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  conversationHeaderBar: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  convHeaderLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  convHeaderBackBtn: {
    paddingVertical: 8,
    paddingRight: 4,
  },
  convHeaderAvatarContainer: {
    position: 'relative',
  },
  convHeaderAvatarSquare: {
    width: 40,
    height: 40,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  convHeaderTitleCol: {
    justifyContent: 'center',
  },
  convHeaderName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#03254C',
  },
  convHeaderStatus: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  convHeaderRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  convHeaderActionBtn: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatStatusDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 10,
  },
  chatScroll: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  chatScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  convDateMarker: {
    textAlign: 'center',
    fontSize: 12,
    color: '#64748B',
    marginVertical: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '600',
  },
  msgRow: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  msgRowMe: {
    alignSelf: 'flex-end',
  },
  msgRowThem: {
    alignSelf: 'flex-start',
    gap: 10,
  },
  msgAvatarContainer: {
    justifyContent: 'flex-start',
  },
  msgAvatarSquare: {
    width: 32,
    height: 32,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  msgAvatarText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#03254C',
  },
  msgBubble: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  msgBubbleMe: {
    backgroundColor: '#03254C',
    borderTopRightRadius: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  msgBubbleThem: {
    backgroundColor: '#E6EEFF',
    borderTopLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#D0DDF5',
  },
  msgText: {
    fontSize: 14.5,
    lineHeight: 20,
    fontWeight: '500',
  },
  msgTextMe: {
    color: '#FFFFFF',
  },
  msgTextThem: {
    color: '#03254C',
  },
  msgFooterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 6,
    gap: 2,
  },
  msgTime: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '600',
  },
  msgTimeMe: {
    color: '#94A3B8',
  },
  msgTimeThem: {
    color: '#64748B',
  },
  msgReadStatus: {
    fontSize: 10,
    color: '#7DBE14',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
  },
  messageSystemBubble: {
    backgroundColor: '#E6EEFF',
    alignSelf: 'center',
    borderRadius: 6,
    marginVertical: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#D0DDF5',
  },
  messageSenderName: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#134074',
    marginBottom: 2,
  },
  messageSystemText: {
    fontSize: 11.5,
    color: '#134074',
    textAlign: 'center',
    fontWeight: '600',
  },
  convInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6EEFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderTopWidth: 1.2,
    borderTopColor: '#D0DDF5',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  convPlusBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#D0DDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  convInputWrapper: {
    flex: 1,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#D0DDF5',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  convTextInput: {
    fontSize: 14,
    color: '#03254C',
    fontWeight: '600',
    padding: 0,
  },
  convSendBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#03254C',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  lockedInputBar: {
    backgroundColor: '#E6EEFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1.2,
    borderTopColor: '#D0DDF5',
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
  },
  lockedInputText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },

  // 3-dots Dropdown Menu Styles (WhatsApp inspired light mode dropdown)
  dropdownMenuWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  dropdownMenuBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  dropdownMenuCard: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 90 : 54,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#D0DDF5',
    paddingVertical: 6,
    width: 190,
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.8,
    borderBottomColor: '#F1F5F9',
  },
  dropdownMenuItemDestructive: {
    borderBottomWidth: 0,
  },
  dropdownMenuItemText: {
    fontSize: 13.5,
    color: '#03254C',
    fontWeight: '700',
  },
  dropdownMenuItemTextDestructive: {
    fontSize: 13.5,
    color: '#EF4444',
    fontWeight: '700',
  },

  // Modal Dialogs Overlay Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(3, 37, 76, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  modalContentCard: {
    width: '85%',
    backgroundColor: '#E6EEFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.2,
    borderColor: '#D0DDF5',
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
    maxHeight: '80%',
    gap: 14,
  },
  modalTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#03254C',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  modalBtn: {
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.2,
  },
  modalBtnCancel: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D0DDF5',
  },
  modalBtnCancelText: {
    color: '#64748B',
    fontWeight: '700',
    fontSize: 13.5,
  },
  modalBtnSave: {
    backgroundColor: '#03254C',
    borderColor: '#03254C',
  },
  modalBtnSaveText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13.5,
  },
  modalBtnDelete: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FCA5A5',
  },
  modalBtnDeleteText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 13.5,
  },
  deleteConfirmText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '500',
    marginVertical: 10,
  },

  // Member Management Styles
  modalSearchContainer: {
    paddingBottom: 4,
  },
  modalSearchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1.2,
    borderColor: '#D0DDF5',
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#03254C',
    fontWeight: '600',
    padding: 0,
  },
  modalSearchIconBox: {
    marginLeft: 6,
  },
  addMemberScrollView: {
    maxHeight: 180,
  },
  memberInfoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  memberRoleText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },
  addMemberActionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#E6F9F0',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A3E635',
  },
  addMemberActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3F6212',
  },
  noResultsText: {
    fontSize: 13,
    color: '#64748B',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 12,
  },
  memberListSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1.2,
    marginTop: 10,
    marginBottom: 4,
  },
  membersScrollView: {
    maxHeight: 180,
  },
  memberItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.8,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  memberAvatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarInitial: {
    fontSize: 13,
    fontWeight: '800',
    color: '#03254C',
  },
  memberNameText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#03254C',
  },
  removeMemberBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FFF1F2',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  removeMemberText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },
  modalCloseBtn: {
    height: 40,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    marginTop: 6,
  },
  modalCloseBtnText: {
    color: '#64748B',
    fontSize: 13.5,
    fontWeight: '700',
  },

  // Create Community Form View Styles (Light Mode)
  createTitleContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  createTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#03254C',
    marginBottom: 6,
  },
  createSubtitleText: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    borderWidth: 1.2,
    borderColor: '#D0DDF5',
    gap: 16,
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  formFieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#03254C',
  },
  formInput: {
    height: 44,
    backgroundColor: '#F8F9FF',
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#D0DDF5',
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#03254C',
    fontWeight: '600',
  },
  formTextarea: {
    height: 90,
    backgroundColor: '#F8F9FF',
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#D0DDF5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#03254C',
    fontWeight: '600',
  },
  dropdownBox: {
    height: 44,
    backgroundColor: '#F8F9FF',
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#D0DDF5',
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownSelectedText: {
    fontSize: 14,
    color: '#03254C',
    fontWeight: '600',
  },
  dropdownOptionsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#D0DDF5',
    marginTop: 4,
    overflow: 'hidden',
  },
  dropdownOptionItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 0.8,
    borderBottomColor: '#F1F5F9',
  },
  dropdownOptionText: {
    fontSize: 13.5,
    color: '#03254C',
    fontWeight: '600',
  },
  switchRowContainer: {
    height: 44,
    backgroundColor: '#F8F9FF',
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#D0DDF5',
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 13.5,
    color: '#03254C',
    fontWeight: '600',
  },
  switchTrack: {
    width: 46,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  switchTrackActive: {
    backgroundColor: '#7DBE14',
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
  limitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  limitBadge: {
    backgroundColor: '#E6EEFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  limitBadgeText: {
    color: '#7DBE14',
    fontSize: 12,
    fontWeight: '800',
  },
  sliderControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  sliderBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E6EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0DDF5',
  },
  sliderBtnText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#03254C',
  },
  sliderTrackContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderProgressFill: {
    height: '100%',
    backgroundColor: '#7DBE14',
  },
  submitBtn: {
    backgroundColor: '#376200', // Forest Green
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 6,
    gap: 8,
  },
  checkboxContainer: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#D0DDF5',
    backgroundColor: '#F8F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainerActive: {
    backgroundColor: '#7DBE14',
    borderColor: '#7DBE14',
  },
  checkboxLabel: {
    fontSize: 13.5,
    color: '#03254C',
    fontWeight: '600',
  },
  limitBadgeDisabled: {
    backgroundColor: '#E2E8F0',
  },
  limitBadgeTextDisabled: {
    color: '#64748B',
  },
  sliderBtnDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  sliderBtnTextDisabled: {
    color: '#CBD5E1',
  },
  sliderProgressFillDisabled: {
    backgroundColor: '#CBD5E1',
  },
  // Discovery Styles
  discoveryToggleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#F8F9FF',
  },
  discoveryToggleBtn: {
    backgroundColor: '#E6EEFF',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#D0DDF5',
  },
  discoveryToggleBtnActive: {
    backgroundColor: '#03254C',
    borderColor: '#03254C',
  },
  discoveryToggleText: {
    color: '#03254C',
    fontSize: 13.5,
    fontWeight: '700',
  },
  discoveryToggleTextActive: {
    color: '#FFFFFF',
  },
  discoveryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FF',
  },
  discoverySectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#03254C',
    marginBottom: 10,
  },
  discoverySearchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 38,
    borderWidth: 1.2,
    borderColor: '#D0DDF5',
    marginBottom: 12,
  },
  discoverySearchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#03254C',
    fontWeight: '600',
    padding: 0,
  },
  discoveryList: {
    gap: 12,
  },
  discoverCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.2,
    borderColor: '#D0DDF5',
    gap: 8,
  },
  discoverCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  discoverTitleCol: {
    flex: 1,
  },
  discoverNameText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#03254C',
  },
  discoverCodeText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  discoverDescText: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
    fontWeight: '500',
  },
  discoverActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  joinCommBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#7DBE14',
    borderRadius: 8,
  },
  joinCommBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  pendingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFF8E7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  pendingBadgeText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '700',
  },
  joinedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#DCFCE7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  joinedBadgeText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '700',
  },
  discoveryDivider: {
    height: 1.2,
    backgroundColor: '#D0DDF5',
    marginVertical: 14,
  },
  // Modal Tabs & Requests View Styles
  modalTabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1.2,
    borderBottomColor: '#E2E8F0',
    marginBottom: 6,
  },
  modalTabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  modalTabButtonActive: {
    borderBottomColor: '#03254C',
  },
  modalTabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  modalTabButtonTextActive: {
    color: '#03254C',
    fontWeight: '800',
  },
  tabBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  requestActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  requestApproveBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#E6F9F0',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A3E635',
  },
  requestApproveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3F6212',
  },
  requestDenyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FFF1F2',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  requestDenyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },
  // Community Details / Groups Management Styles
  detailCardHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1.2,
    borderBottomColor: '#D0DDF5',
  },
  detailAvatarSquare: {
    width: 68,
    height: 68,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailCommunityName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#03254C',
    textAlign: 'center',
    marginBottom: 4,
  },
  detailMembersText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 10,
  },
  detailDescText: {
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 19,
    textAlign: 'center',
    fontWeight: '500',
  },
  detailGroupsSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1.2,
    marginTop: 18,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  detailGroupsListContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.2,
    borderTopColor: '#D0DDF5',
    borderBottomWidth: 1.2,
    borderBottomColor: '#D0DDF5',
  },
  detailAddGroupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.8,
    borderBottomColor: '#F1F5F9',
    gap: 14,
  },
  detailAddGroupIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailAddGroupText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#7DBE14',
  },
  detailSubgroupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.8,
    borderBottomColor: '#F1F5F9',
  },
  detailSubgroupLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14,
  },
  detailSubgroupTextCol: {
    flex: 1,
  },
  detailSubgroupName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#03254C',
    marginBottom: 2,
  },
  detailSubgroupLatestMsg: {
    fontSize: 12.5,
    color: '#64748B',
  },
  detailDeleteGroupBtn: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#F8F9FF',
    paddingTop: 0,
  },

  // Share bottom sheet / attachment
  shareOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    justifyContent: 'flex-end',
  },
  shareBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(3, 37, 76, 0.4)',
  },
  shareBottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  shareIndicator: {
    width: 38,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 16,
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#03254C',
    marginBottom: 20,
    textAlign: 'center',
  },
  shareGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  shareOption: {
    alignItems: 'center',
    flex: 1,
  },
  shareIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  shareOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#03254C',
  },
  shareCancelBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  shareCancelBtnText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
  },

  // Modal Dialogs Explorer Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(3, 37, 76, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  modalContentCard: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.2,
    borderColor: '#D0DDF5',
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#03254C',
    textAlign: 'center',
    marginBottom: 16,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  galleryItemBtn: {
    width: '47%',
    backgroundColor: '#F8F9FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 6,
    alignItems: 'center',
  },
  galleryThumbnail: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 4,
  },
  galleryItemName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  modalCloseBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },
  modalCloseBtnText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
  },
  filesList: {
    marginBottom: 16,
  },
  fileItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  fileIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E6EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileItemDetails: {
    flex: 1,
    gap: 2,
  },
  fileItemName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#03254C',
  },
  fileItemSize: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },

  // Audio Recorder Card Styles
  audioRecorderCard: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  micPulsingCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  micPulsingCircleActive: {
    backgroundColor: '#EF4444',
  },
  audioTimerText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#03254C',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 8,
  },
  recordingStatusText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  audioControlsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  audioControlBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  audioControlBtnCancel: {
    backgroundColor: '#F1F5F9',
  },
  audioControlBtnRecord: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  audioControlBtnRecordActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  audioControlBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  audioControlBtnTextWhite: {
    color: '#FFFFFF',
  },

  // Locations Explorer List Styles
  locationsList: {
    marginBottom: 16,
  },
  locationItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  locationIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationItemDetails: {
    flex: 1,
    gap: 2,
  },
  locationItemName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#03254C',
  },
  locationItemDesc: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },

  // Attachment Bubble Styles
  msgBubbleAttachment: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#D0DDF5',
    padding: 6,
  },
  attachmentImageContainer: {
    width: 180,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
  },
  attachmentImage: {
    width: '100%',
    height: '100%',
  },
  attachmentCaption: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600',
    paddingHorizontal: 4,
  },
  attachmentFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    gap: 10,
    width: 180,
  },
  fileIconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#E6EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileDetailsBox: {
    flex: 1,
  },
  fileNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#03254C',
    textDecorationLine: 'underline',
  },
  fileSizeText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  attachmentAudioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    gap: 8,
    width: 170,
  },
  audioPlayBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E6EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioWaveform: {
    flex: 1,
    justifyContent: 'center',
  },
  audioDurationText: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '600',
  },
  attachmentLocationContainer: {
    width: 180,
    borderRadius: 8,
    overflow: 'hidden',
  },
  locationMapPlaceholder: {
    width: '100%',
    height: 90,
    backgroundColor: '#E6EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  locationLogoOverlay: {
    width: 32,
    height: 32,
    opacity: 0.2,
  },
  mapPin: {
    position: 'absolute',
    top: '30%',
    left: '45%',
  },
  locationDetails: {
    padding: 6,
  },
  locationTitleText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#03254C',
  },
  locationSubText: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
