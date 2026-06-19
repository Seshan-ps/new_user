import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  LayoutAnimation, 
  Platform,
  Animated,
  Easing
} from 'react-native';
import Svg, { Path, Circle, Rect, Line, Polygon, Polyline } from 'react-native-svg';
import { SearchIcon, BackArrowIcon, SendIcon, PhoneIcon, VideoCallIcon } from './Icons';

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

export default function ChatScreen({ 
  onNavigate, 
  pendingAdminMessage, 
  setPendingAdminMessage, 
  activeDirectChatUser, 
  setActiveDirectChatUser,
  chatsList = [],
  setChatsList,
  chatMessages = {},
  setChatMessages,
  directoryMembers = [],
  showAlert
}) {

  const allMembers = [
    { id: 10, name: 'Karthik Raja', role: 'External Auditor', online: true, avatar: 'KR', avatarColor: '#F0FDF4', image: null },
    { id: 11, name: 'Priya Mani', role: 'Tax Advisor', online: false, avatar: 'PM', avatarColor: '#E0F2FE', image: require('../assets/avatar_emily.png') },
    { id: 12, name: 'Manoj Kumar', role: 'Financial Analyst', online: true, avatar: 'MK', avatarColor: '#FEF3C7', image: null },
    { id: 13, name: 'Janani K.', role: 'Compliance Associate', online: false, avatar: 'JK', avatarColor: '#F3E8FF', image: require('../assets/avatar_janice.png') },
    { id: 14, name: 'Ramesh B.', role: 'Treasurer', online: true, avatar: 'RB', avatarColor: '#FFE4E6', image: require('../assets/avatar_robert.png') },
    { id: 15, name: 'Elilarasi M.', role: 'Legal Counsel', online: false, avatar: 'EM', avatarColor: '#E0F2FE', image: require('../assets/avatar_emily.png') },
    { id: 16, name: 'Sathya P.', role: 'Senior Tax Consultant', online: true, avatar: 'SP', avatarColor: '#F0FDF4', image: require('../assets/avatar_saja.png') },
    { id: 17, name: 'Tamil Selvan', role: 'Associate Advisor', online: false, avatar: 'TS', avatarColor: '#FEF3C7', image: null },
  ];

  const getContactImage = (contact) => {
    if (!contact) return null;
    // 1. Check if the contact object itself has a valid image
    if (contact.image) {
      return typeof contact.image === 'string' && AVATAR_MAP[contact.image]
        ? AVATAR_MAP[contact.image]
        : (typeof contact.image === 'string' ? { uri: contact.image } : contact.image);
    }

    // 2. Lookup in directoryMembers prop
    const dirMember = (directoryMembers || []).find(
      m => m.name?.toLowerCase() === contact.name?.toLowerCase() ||
           m.username?.toLowerCase() === contact.name?.toLowerCase()
    );
    if (dirMember && dirMember.image) {
      return typeof dirMember.image === 'string' && AVATAR_MAP[dirMember.image]
        ? AVATAR_MAP[dirMember.image]
        : (typeof dirMember.image === 'string' ? { uri: dirMember.image } : dirMember.image);
    }

    // 3. Lookup in local allMembers list
    const localMember = allMembers.find(
      m => m.name?.toLowerCase() === contact.name?.toLowerCase()
    );
    if (localMember && localMember.image) {
      return typeof localMember.image === 'string' && AVATAR_MAP[localMember.image]
        ? AVATAR_MAP[localMember.image]
        : (typeof localMember.image === 'string' ? { uri: localMember.image } : localMember.image);
    }

    return null;
  };

  const [chatSearch, setChatSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [chatSubView, setChatSubView] = useState('list');
  const [selectedMembers, setSelectedMembers] = useState({});
  const [activeChatId, setActiveChatId] = useState(null);
  const [messageInput, setMessageInput] = useState('');

  // New states
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [callState, setCallState] = useState(null); // { type: 'voice' | 'video', status: 'ringing' | 'connected', contact: object }
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  const [selectMode, setSelectMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState({});
  const [blockedContacts, setBlockedContacts] = useState({});
  const [replyingToMessage, setReplyingToMessage] = useState(null);

  // Local file / gallery mock explorer states
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

  const callTimeoutRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Ringing pulse animation
  useEffect(() => {
    if (callState && callState.status === 'ringing') {
      pulseAnim.setValue(0);
      Animated.loop(
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      ).start();
    } else {
      pulseAnim.setValue(0);
    }
  }, [callState]);

  // Call timer simulation (runs only when call is picked up/connected)
  useEffect(() => {
    let interval;
    if (callState && callState.status === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [callState]);

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

  const activeChatIdRef = useRef(activeChatId);
  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  const chatsListRef = useRef(chatsList);
  useEffect(() => {
    chatsListRef.current = chatsList;
  }, [chatsList]);

  // Handle pending admin message appeals from restricted communities
  useEffect(() => {
    if (pendingAdminMessage) {
      const timeStr = getCurrentTimeFormatted();
      const newMsg = {
        id: Date.now(),
        sender: 'me',
        text: pendingAdminMessage,
        time: timeStr,
        read: false
      };

      setChatMessages(prev => ({
        ...prev,
        100: [...(prev[100] || []), newMsg]
      }));

      setChatsList(prev => prev.map(c => 
        c.id === 100 
          ? { ...c, msg: pendingAdminMessage, time: timeStr } 
          : c
      ));

      setActiveChatId(100);
      setChatSubView('conversation');
      setPendingAdminMessage(null);

      // Simulating Admin auto-reply after 2 seconds
      setTimeout(() => {
        const replyTime = getCurrentTimeFormatted();
        const adminReply = {
          id: Date.now() + 2,
          sender: 'them',
          text: "We have received your appeal request for the community restriction. The security team will review it and get back to you shortly.",
          time: replyTime
        };
        setChatMessages(prev => ({
          ...prev,
          100: [...(prev[100] || []), adminReply]
        }));
        setChatsList(prevList => prevList.map(c => 
          c.id === 100 
            ? { ...c, msg: adminReply.text, time: replyTime } 
            : c
        ));
      }, 2000);
    }
  }, [pendingAdminMessage]);

  // Handle direct message redirects from member profiles
  useEffect(() => {
    if (activeDirectChatUser) {
      const contactName = activeDirectChatUser.name;
      // Search if this user already exists in chatsList
      const existingChat = chatsList.find(c => c.name.toLowerCase() === contactName.toLowerCase());
      if (existingChat) {
        setActiveChatId(existingChat.id);
        setChatSubView('conversation');
      } else {
        // Create new chat
        const newId = Date.now();
        const initials = contactName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const newChat = {
          id: newId,
          name: contactName,
          avatar: initials,
          avatarColor: '#E6EEFF',
          image: null,
          msg: 'Conversation started',
          time: 'Now',
          unread: false,
          online: true,
          status: 'accepted'
        };
        setChatsList(prev => [newChat, ...prev]);
        setActiveChatId(newId);
        setChatSubView('conversation');
      }
      setActiveDirectChatUser(null);
    }
  }, [activeDirectChatUser]);

  // Live Simulator for background incoming messages (every 10 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const currentChats = chatsListRef.current;
      const candidates = currentChats.filter(c => c.status === 'accepted' && c.id !== activeChatIdRef.current);
      if (candidates.length === 0) return;
      
      const randomContact = candidates[Math.floor(Math.random() * candidates.length)];
      const mockTexts = [
        "Hey! Are you free to talk?",
        "I just sent you the updated reconciliation sheet.",
        "Let's catch up on the audit results.",
        "Could you check the compliance log?",
        "Sounds good! Let me know when you're done."
      ];
      const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
      const timeStr = getCurrentTimeFormatted();

      const newMsg = {
        id: Date.now(),
        sender: 'them',
        text: randomText,
        time: timeStr
      };

      setChatMessages(prevMessages => ({
        ...prevMessages,
        [randomContact.id]: [...(prevMessages[randomContact.id] || []), newMsg]
      }));

      setChatsList(prevList => prevList.map(c => 
        c.id === randomContact.id 
          ? { ...c, msg: randomText, time: timeStr, unread: true }
          : c
      ));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatCallTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const activeChatContact = chatsList.find(c => c.id === activeChatId) || {};
  const isBlocked = !!blockedContacts[activeChatId];

  const handleSendMessage = () => {
    if (isBlocked) return;
    if (!messageInput.trim()) return;

    const timeStr = getCurrentTimeFormatted();

    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: messageInput.trim(),
      time: timeStr,
      read: false
    };

    if (replyingToMessage) {
      newMessage.replyTo = {
        text: replyingToMessage.text,
        sender: replyingToMessage.sender,
        name: replyingToMessage.sender === 'me' ? 'You' : activeChatContact.name
      };
      setReplyingToMessage(null);
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setChatMessages(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage]
    }));

    // Update latest message text in chat list
    setChatsList(prev => prev.map(c => c.id === activeChatId ? { ...c, msg: messageInput.trim(), time: timeStr } : c));

    setMessageInput('');

    // Trigger simulated read receipt after 3 seconds
    const sentMsgId = newMessage.id;
    const currentChatId = activeChatId;
    setTimeout(() => {
      setChatMessages(prev => {
        const msgs = prev[currentChatId] || [];
        return {
          ...prev,
          [currentChatId]: msgs.map(m => m.id === sentMsgId ? { ...m, read: true } : m)
        };
      });
    }, 3000);

    // Simulated Auto reply
    triggerAutoReply(timeStr);
  };

  const getCurrentTimeFormatted = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const minutesStr = minutes < 10 ? '0'+minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const triggerAutoReply = (timeStr) => {
    const currentChatId = activeChatId;
    setTimeout(() => {
      const autoReplies = [
        "Got it! I will look into this.",
        "Perfect, thanks for the update.",
        "Awesome, let's discuss this in our next sync.",
        "Sounds good!",
        "I'm on it."
      ];
      const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      const replyMessage = {
        id: Date.now() + 1,
        sender: 'them',
        text: randomReply,
        time: timeStr
      };
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setChatMessages(prev => {
        if (!prev[currentChatId]) return prev;
        const updatedMsgs = (prev[currentChatId] || []).map(m => m.sender === 'me' ? { ...m, read: true } : m);
        return {
          ...prev,
          [currentChatId]: [...updatedMsgs, replyMessage]
        };
      });

      // Update latest message text in chat list
      setChatsList(prev => prev.map(c => {
        if (c.id === currentChatId) {
          // If we are currently active on this chat, it shouldn't show as unread
          return { ...c, msg: randomReply, time: timeStr, unread: activeChatId !== currentChatId };
        }
        return c;
      }));
    }, 1500);
  };

  const handleSendAttachment = (type, details) => {
    setShowAttachmentMenu(false);
    setActiveModal(null);
    const timeStr = getCurrentTimeFormatted();
    let newMsg = {
      id: Date.now(),
      sender: 'me',
      time: timeStr,
      read: false,
      isAttachment: true,
      attachmentType: type
    };

    if (replyingToMessage) {
      newMsg.replyTo = {
        text: replyingToMessage.text,
        sender: replyingToMessage.sender,
        name: replyingToMessage.sender === 'me' ? 'You' : activeChatContact.name
      };
      setReplyingToMessage(null);
    }

    let msgSummary = '';
    if (type === 'image') {
      newMsg.text = details?.name || 'Sent an image';
      newMsg.imagePath = details?.path || require('../assets/server_room.png');
      msgSummary = 'Sent an image';
    } else if (type === 'file') {
      newMsg.text = details?.name || 'Audit_Report_Q4.pdf';
      newMsg.fileName = details?.name || 'Audit_Report_Q4.pdf';
      newMsg.fileSize = details?.size || '1.4 MB';
      msgSummary = details?.name || 'Audit_Report_Q4.pdf';
    } else if (type === 'audio') {
      newMsg.text = 'Voice memo';
      newMsg.duration = details?.duration || '0:12';
      msgSummary = 'Voice memo';
    } else if (type === 'location') {
      newMsg.text = details?.name || 'TAS Coimbatore Office';
      newMsg.locationName = details?.name || 'TAS Coimbatore Office, India';
      msgSummary = details?.name || 'TAS Coimbatore Office';
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setChatMessages(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg]
    }));

    setChatsList(prev => prev.map(c => c.id === activeChatId ? { ...c, msg: msgSummary, time: timeStr } : c));

    // Trigger simulated read receipt after 3 seconds
    const sentMsgId = newMsg.id;
    const currentChatId = activeChatId;
    setTimeout(() => {
      setChatMessages(prev => {
        const msgs = prev[currentChatId] || [];
        return {
          ...prev,
          [currentChatId]: msgs.map(m => m.id === sentMsgId ? { ...m, read: true } : m)
        };
      });
    }, 3000);
  };

  const handleRequestAction = (action) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (action === 'accepted') {
      setChatsList(prev => prev.map(c => c.id === activeChatId ? { ...c, status: 'accepted', unread: false } : c));
      // Mark messages as read
      setChatMessages(prev => {
        const msgs = prev[activeChatId] || [];
        return {
          ...prev,
          [activeChatId]: msgs.map(m => ({ ...m, read: true }))
        };
      });
      showAlert('Conversation request approved. You can now chat!', 'Chat Request');
    } else if (action === 'blocked') {
      setChatsList(prev => prev.map(c => c.id === activeChatId ? { ...c, status: 'blocked', unread: false } : c));
      setChatSubView('list');
      setActiveChatId(null);
      showAlert('Conversation request blocked.', 'Chat Request');
    }
  };

  const toggleMessageSelect = (msgId) => {
    setSelectedMessages(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const handleClearChat = () => {
    setShowHeaderMenu(false);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setChatMessages(prev => ({
      ...prev,
      [activeChatId]: []
    }));
    showAlert('Chat history cleared.', 'Success');
  };

  const handleBlockContact = () => {
    setShowHeaderMenu(false);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setBlockedContacts(prev => ({
      ...prev,
      [activeChatId]: !prev[activeChatId]
    }));
    showAlert(isBlocked ? `${activeChatContact.name} unblocked.` : `${activeChatContact.name} blocked.`, 'Block Contact');
  };

  const handleForwardChat = () => {
    setShowHeaderMenu(false);
    showAlert(`Forwarding chat with ${activeChatContact.name}...`, 'Forward Chat');
  };

  const handleStartCall = (type) => {
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCallState({
      type,
      status: 'ringing',
      contact: activeChatContact
    });
    setCallDuration(0);

    // Ring for 3.5 seconds, then pick up and transition to active call screen
    callTimeoutRef.current = setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setCallState(prev => {
        if (prev && prev.status === 'ringing') {
          return { ...prev, status: 'connected' };
        }
        return prev;
      });
    }, 3500);
  };

  const handleEndCall = () => {
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = null;
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCallState(null);
    setCallDuration(0);
  };

  const handleStartChatForMember = (member) => {
    setChatsList(prev => {
      if (prev.some(c => c.id === member.id)) {
        return prev;
      }
      return [
        {
          id: member.id,
          name: member.name,
          avatar: member.avatar,
          avatarColor: member.avatarColor,
          image: member.image,
          msg: 'Started a new conversation',
          time: 'Just now',
          unread: false,
          online: member.online,
          status: 'waiting_accept'
        },
        ...prev
      ];
    });

    setChatMessages(prev => {
      if (prev[member.id]) return prev;
      return {
        ...prev,
        [member.id]: []
      };
    });

    setActiveChatId(member.id);
    setChatSubView('conversation');
    setSelectedMembers({});
    setMemberSearch('');
  };

  const renderCallOverlay = () => {
    if (!callState) return null;
    const isVideo = callState.type === 'video';
    const isRinging = callState.status === 'ringing';

    // Sub-components for call control icons
    const CallSpeakerIcon = () => (
      <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isSpeakerOn ? "#0b141a" : "#FFFFFF"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M11 5L6 9H2v6h4l5 4V5z" fill={isSpeakerOn ? "#0b141a" : "none"} />
        <Path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
      </Svg>
    );

    const CallMuteIcon = () => (
      <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isMuted ? "#0b141a" : "#FFFFFF"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" fill={isMuted ? "#0b141a" : "none"} />
        <Path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
        {isMuted && <Line x1="1" y1="1" x2="23" y2="23" stroke="#EF4444" strokeWidth="3" />}
      </Svg>
    );

    const CallVideoIcon = () => (
      <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isVideo ? "#0b141a" : "#FFFFFF"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <Path d="m22 8-6 4 6 4V8Z" fill={isVideo ? "#0b141a" : "none"} />
        <Rect x="2" y="6" width="14" height="12" rx="2" ry="2" fill={isVideo ? "#0b141a" : "none"} />
      </Svg>
    );

    const CallHangUpIcon = () => (
      <Svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: [{ rotate: '135deg' }] }}>
        <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </Svg>
    );

    return (
      <View style={styles.callOverlay}>
        {/* If video call and connected, render remote video feed */}
        {!isRinging && isVideo ? (
          <View style={styles.videoOverlayPlaceholder}>
            <Image source={require('../assets/server_room.png')} style={styles.videoBgImage} resizeMode="cover" />
            
            {/* Self floating preview */}
            <View style={styles.videoSelfPreview}>
              <Image source={require('../assets/avatar_marcus_thornton.png')} style={styles.selfPreviewInnerImage} />
              <View style={styles.selfPreviewLabelBg}>
                <Text style={styles.selfPreviewText}>You</Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* WhatsApp Call Header */}
        <View style={styles.callHeaderContainer}>
          <Text style={styles.callEncryptionText}>🔒 End-to-end encrypted</Text>
          <Text style={styles.callContactName}>{callState.contact.name}</Text>
          <Text style={[styles.callStatus, isRinging && styles.callStatusRinging]}>
            {isRinging ? 'Ringing...' : formatCallTime(callDuration)}
          </Text>
        </View>

        {/* Middle Avatar Area for Voice Call or Video Ringing */}
        {(!isVideo || isRinging) && (
          <View style={styles.callAvatarWrapper}>
            {isRinging && (
              <View style={styles.pulseContainer}>
                <Animated.View style={[
                  styles.pulseRing,
                  {
                    transform: [{
                      scale: pulseAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 2.2]
                      })
                    }],
                    opacity: pulseAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.6, 0]
                    })
                  }
                ]} />
                <Animated.View style={[
                  styles.pulseRing,
                  {
                    transform: [{
                      scale: pulseAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [1, 1.6, 2.2]
                      })
                    }],
                    opacity: pulseAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.6, 0.3, 0]
                    })
                  }
                ]} />
              </View>
            )}

            <View style={[
              styles.callAvatarCircle,
              { backgroundColor: callState.contact.avatarColor || '#F3E8FF' }
            ]}>
              {getContactImage(callState.contact) ? (
                <Image source={getContactImage(callState.contact)} style={styles.callAvatarImage} />
              ) : (
                <Text style={styles.callAvatarText}>{callState.contact.avatar}</Text>
              )}
            </View>
          </View>
        )}

        {/* WhatsApp calling style bottom controls panel */}
        <View style={styles.callControlPanel}>
          <View style={styles.callActionRow}>
            {/* Speaker Button */}
            <TouchableOpacity 
              style={[styles.callActionBtn, isSpeakerOn && styles.callActionBtnActive]} 
              onPress={() => setIsSpeakerOn(!isSpeakerOn)}
              activeOpacity={0.75}
            >
              <CallSpeakerIcon />
            </TouchableOpacity>

            {/* Video Toggle Button (Voice to Video or Toggle Camera) */}
            <TouchableOpacity 
              style={[styles.callActionBtn, isVideo && styles.callActionBtnActive]} 
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setCallState(prev => ({
                  ...prev,
                  type: prev.type === 'video' ? 'voice' : 'video'
                }));
              }}
              activeOpacity={0.75}
            >
              <CallVideoIcon />
            </TouchableOpacity>

            {/* Mute Button */}
            <TouchableOpacity 
              style={[styles.callActionBtn, isMuted && styles.callActionBtnActive]} 
              onPress={() => setIsMuted(!isMuted)}
              activeOpacity={0.75}
            >
              <CallMuteIcon />
            </TouchableOpacity>

            {/* Hangup Button */}
            <TouchableOpacity 
              style={styles.callActionBtnEnd} 
              onPress={handleEndCall}
              activeOpacity={0.75}
            >
              <CallHangUpIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderHeaderMenu = () => {
    if (!showHeaderMenu) return null;
    return (
      <View style={styles.headerMenuWrapper}>
        <TouchableOpacity style={styles.headerBackdrop} activeOpacity={1} onPress={() => setShowHeaderMenu(false)} />
        <View style={styles.headerMenuDropdown}>
          <TouchableOpacity 
            style={styles.headerMenuOption} 
            onPress={() => {
              setShowHeaderMenu(false);
              setSelectMode(!selectMode);
              setSelectedMessages({});
            }}
          >
            <Text style={styles.headerMenuOptionText}>
              {selectMode ? 'Disable Select Mode' : 'Select Messages'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerMenuOption} onPress={handleForwardChat}>
            <Text style={styles.headerMenuOptionText}>Forward Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerMenuOption} onPress={handleClearChat}>
            <Text style={styles.headerMenuOptionText}>Clear Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.headerMenuOption, styles.headerMenuOptionDestructive]} onPress={handleBlockContact}>
            <Text style={styles.headerMenuOptionTextDestructive}>
              {isBlocked ? 'Unblock Contact' : 'Block Contact'}
            </Text>
          </TouchableOpacity>
        </View>
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

  const renderNewMessageContent = () => {
    // Filter contacts based on search query
    const filteredSuggested = allMembers.filter(m => 
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.role.toLowerCase().includes(memberSearch.toLowerCase())
    );

    const toggleSelectSuggested = (id) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setSelectedMembers(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const PlusCircleIcon = ({ selected }) => (
      <Svg width="22" height="22" viewBox="0 0 24 24" fill={selected ? "#7DBE14" : "none"} stroke={selected ? "#7DBE14" : "#94A3B8"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        {selected ? (
          <Path d="M9 12l2 2 4-4" stroke="#FFFFFF" strokeWidth="2.5" />
        ) : (
          <Path d="M12 8v8M8 12h8" />
        )}
      </Svg>
    );

    const StartChatIcon = () => (
      <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <Path d="m22 2-7 20-4-9-9-4Z" />
        <Path d="M22 2 11 13" />
      </Svg>
    );


    const handleStartChatGroup = () => {
      const selectedIds = Object.keys(selectedMembers).filter(id => selectedMembers[id]);
      if (selectedIds.length === 0) {
        showAlert('Please select at least one member to start chat.');
        return;
      }
      
      const firstId = parseInt(selectedIds[0]);
      const member = allMembers.find(m => m.id === firstId);
      if (!member) return;

      handleStartChatForMember(member);
    };

    return (
      <View style={styles.newChatScreenWrapper}>
        {/* Sub Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity 
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setChatSubView('list');
              setMemberSearch('');
            }} 
            style={styles.headerBackBtn}
          >
            <BackArrowIcon />
          </TouchableOpacity>
          <Text style={styles.headerScreenTitle}>New Message</Text>
        </View>

        <ScrollView style={styles.newChatScroll} showsVerticalScrollIndicator={false}>
          {/* To Search Card */}
          <View style={styles.newChatSearchCard}>
            <View style={styles.newChatToRow}>
              <Text style={styles.newChatToLabel}>To:</Text>
              <TextInput 
                style={styles.newChatToInput} 
                placeholder="Search members..." 
                placeholderTextColor="#94A3B8"
                value={memberSearch}
                onChangeText={setMemberSearch}
              />
            </View>
          </View>

          {/* Suggested Contacts */}
          <Text style={styles.newChatSectionTitle}>SUGGESTED CONTACTS</Text>
          <View style={styles.suggestedListContainer}>
            {filteredSuggested.map(contact => {
              const isSelected = !!selectedMembers[contact.id];
              return (
                <TouchableOpacity 
                  key={contact.id} 
                  style={styles.suggestedContactCard}
                  onPress={() => handleStartChatForMember(contact)}
                  activeOpacity={0.75}
                >
                  <View style={styles.chatAvatarContainer}>
                    <View style={[
                      styles.chatAvatarSquare, 
                      { backgroundColor: contact.avatarColor }
                    ]}>
                      {getContactImage(contact) ? (
                        <Image source={getContactImage(contact)} style={{ width: '100%', height: '100%' }} />
                      ) : (
                        <Text style={[
                          styles.chatAvatarSquareText, 
                          contact.textColor ? { color: contact.textColor } : {}
                        ]}>{contact.avatar}</Text>
                      )}
                    </View>
                    <View style={[
                      styles.chatStatusDot, 
                      { backgroundColor: contact.online ? '#7DBE14' : '#CBD5E1', borderColor: '#FFFFFF' }
                    ]} />
                  </View>
                  <View style={styles.suggestedInfoCol}>
                    <Text style={styles.suggestedName}>{contact.name}</Text>
                    <Text style={styles.suggestedRole}>{contact.role}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.suggestedActionCol}
                    onPress={() => toggleSelectSuggested(contact.id)}
                  >
                    <PlusCircleIcon selected={isSelected} />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Recent Members */}
          <Text style={styles.newChatSectionTitle}>RECENT MEMBERS</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.recentMembersScroll}
          >
            {allMembers.slice(2, 6).map(member => (
              <TouchableOpacity 
                key={member.id} 
                style={styles.recentMemberCard}
                onPress={() => handleStartChatForMember(member)}
              >
                <View style={[styles.recentMemberAvatarSquare, { backgroundColor: member.avatarColor }]}>
                  {getContactImage(member) ? (
                    <Image source={getContactImage(member)} style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <Text style={styles.recentMemberAvatarText}>{member.avatar}</Text>
                  )}
                </View>
                <Text style={styles.recentMemberName} numberOfLines={1}>{member.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Start Chat Button */}
        {Object.values(selectedMembers).filter(Boolean).length > 0 && (
          <View style={styles.startChatBtnContainer}>
            <TouchableOpacity 
              style={styles.startChatBtn} 
              activeOpacity={0.85}
              onPress={handleStartChatGroup}
            >
              <View style={styles.startChatBtnContent}>
                <StartChatIcon />
                <Text style={styles.startChatBtnText}>Start Group Chat</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderConversationContent = () => {
    const messages = chatMessages[activeChatId] || [];

    const ReplyArrowIcon = () => (
      <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M9 14L4 9l5-5" />
        <Path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v.5" />
      </Svg>
    );

    return (
      <View style={styles.conversationWrapper}>
        {/* Sub Header for Conversation view */}
        <View style={[styles.headerBar, styles.conversationHeaderBar]}>
          <View style={styles.convHeaderLeftCol}>
            <TouchableOpacity 
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setChatSubView('list');
                setActiveChatId(null);
                setSelectMode(false);
              }} 
              style={styles.convHeaderBackBtn}
            >
              <BackArrowIcon />
            </TouchableOpacity>
            
            <View style={styles.convHeaderAvatarContainer}>
              <View style={[styles.convHeaderAvatarSquare, { backgroundColor: activeChatContact.avatarColor || '#F3E8FF' }]}>
                {getContactImage(activeChatContact) ? (
                  <Image source={getContactImage(activeChatContact)} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <Text style={styles.convHeaderAvatarText}>{activeChatContact.avatar || '?'}</Text>
                )}
              </View>
              <View style={[
                styles.chatStatusDot, 
                { backgroundColor: activeChatContact.online ? '#7DBE14' : '#CBD5E1', borderColor: '#FFFFFF', bottom: -1, right: -1 }
              ]} />
            </View>

            <View style={styles.convHeaderTitleCol}>
              <Text style={styles.convHeaderName}>{activeChatContact.name || 'Chat'}</Text>
              <Text style={[
                styles.convHeaderStatus, 
                { color: activeChatContact.online ? '#7DBE14' : '#64748B' }
              ]}>
                {activeChatContact.online ? 'ONLINE' : 'OFFLINE'}
              </Text>
            </View>
          </View>

          <View style={styles.convHeaderRightButtons}>
            <TouchableOpacity onPress={() => handleStartCall('voice')} style={styles.convHeaderActionBtn}>
              <PhoneIcon />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleStartCall('video')} style={styles.convHeaderActionBtn}>
              <VideoCallIcon />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setShowHeaderMenu(!showHeaderMenu);
              }} 
              style={styles.convHeaderMenuBtn}
            >
              <Svg width="20" height="20" viewBox="0 0 24 24" fill="#03254C">
                <Circle cx="12" cy="12" r="2" />
                <Circle cx="12" cy="5" r="2" />
                <Circle cx="12" cy="19" r="2" />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.convMessagesScroll} 
          contentContainerStyle={styles.convMessagesContent} 
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.convDateMarker}>Today</Text>

          {messages.length === 0 ? (
            <View style={styles.emptyMessagesContainer}>
              <Text style={styles.emptyMessagesText}>No messages yet.</Text>
            </View>
          ) : (
            messages.map(msg => {
              const isMe = msg.sender === 'me';
              const isSelected = !!selectedMessages[msg.id];
              return (
                <View 
                  key={msg.id} 
                  style={[
                    styles.msgContainerWithSelect, 
                    isMe ? styles.msgContainerMe : styles.msgContainerThem,
                    selectMode && styles.msgContainerWithSelectActive,
                    selectMode && isMe && styles.msgContainerMeSelectActive
                  ]}
                >
                  {selectMode ? (
                    <TouchableOpacity 
                      style={styles.selectCheckboxContainer} 
                      onPress={() => toggleMessageSelect(msg.id)}
                    >
                      <View style={[styles.selectCheckbox, isSelected && styles.selectCheckboxChecked]}>
                        {isSelected && (
                          <Svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3">
                            <Path d="M20 6 9 17l-5-5" />
                          </Svg>
                        )}
                      </View>
                    </TouchableOpacity>
                  ) : null}

                  <View style={[styles.msgRow, isMe ? styles.msgRowMe : styles.msgRowThem]}>
                    {isMe && !selectMode && (
                      <TouchableOpacity 
                        style={styles.replyButtonLeft} 
                        onPress={() => setReplyingToMessage(msg)}
                        activeOpacity={0.6}
                      >
                        <ReplyArrowIcon />
                      </TouchableOpacity>
                    )}
                    {!isMe && (
                      <View style={styles.msgAvatarContainer}>
                        <View style={[styles.msgAvatarSquare, { backgroundColor: activeChatContact.avatarColor }]}>
                          {getContactImage(activeChatContact) ? (
                            <Image source={getContactImage(activeChatContact)} style={{ width: '100%', height: '100%' }} />
                          ) : (
                            <Text style={styles.msgAvatarText}>{activeChatContact.avatar}</Text>
                          )}
                        </View>
                      </View>
                    )}
                    <View style={[styles.msgBubble, isMe ? styles.msgBubbleMe : styles.msgBubbleThem, msg.isAttachment && styles.msgBubbleAttachment]}>
                      {/* Quote Reply Box inside bubble */}
                      {msg.replyTo && (
                        <View style={[
                          styles.replyQuoteContainer, 
                          isMe ? styles.replyQuoteMe : styles.replyQuoteThem
                        ]}>
                          <Text style={[styles.replyQuoteName, isMe ? styles.replyQuoteNameMe : styles.replyQuoteNameThem]}>
                            {msg.replyTo.name}
                          </Text>
                          <Text style={[styles.replyQuoteText, isMe ? styles.replyQuoteTextMe : styles.replyQuoteTextThem]} numberOfLines={1}>
                            {msg.replyTo.text}
                          </Text>
                        </View>
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
                          <Text style={[styles.msgReadStatus, !msg.read && styles.msgSentStatus]}>
                            {msg.read ? ' • READ' : ' • SENT'}
                          </Text>
                        )}
                      </View>
                    </View>
                    {!isMe && !selectMode && (
                      <TouchableOpacity 
                        style={styles.replyButtonRight} 
                        onPress={() => setReplyingToMessage(msg)}
                        activeOpacity={0.6}
                      >
                        <ReplyArrowIcon />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Multi-select bottom bar */}
        {selectMode ? (
          <View style={styles.selectActionBar}>
            <Text style={styles.selectCountText}>
              {Object.values(selectedMessages).filter(Boolean).length} Selected
            </Text>
            <View style={styles.selectActionBtnsRow}>
              <TouchableOpacity 
                style={styles.selectActionBtn} 
                onPress={() => {
                  const selectedCount = Object.values(selectedMessages).filter(Boolean).length;
                  if (selectedCount === 0) return;
                  showAlert(`Forwarding ${selectedCount} messages...`, 'Forward Messages');
                  setSelectMode(false);
                }}
              >
                <Text style={styles.selectActionBtnText}>Forward</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.selectActionBtn, styles.selectActionBtnDestructive]} 
                onPress={() => {
                  const selectedCount = Object.values(selectedMessages).filter(Boolean).length;
                  if (selectedCount === 0) return;
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setChatMessages(prev => ({
                    ...prev,
                    [activeChatId]: prev[activeChatId].filter(m => !selectedMessages[m.id])
                  }));
                  setSelectMode(false);
                  showAlert(`Deleted ${selectedCount} messages.`, 'Delete Messages');
                }}
              >
                <Text style={styles.selectActionBtnTextDestructive}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* Reply preview bar */}
        {replyingToMessage && (
          <View style={styles.replyPreviewBar}>
            <View style={styles.replyPreviewIndicator} />
            <View style={styles.replyPreviewCol}>
              <Text style={styles.replyPreviewTitle}>
                Replying to {replyingToMessage.sender === 'me' ? 'You' : activeChatContact.name}
              </Text>
              <Text style={styles.replyPreviewSnippet} numberOfLines={1}>
                {replyingToMessage.text}
              </Text>
            </View>
            <TouchableOpacity style={styles.replyPreviewCloseBtn} onPress={() => setReplyingToMessage(null)}>
              <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5">
                <Line x1="18" y1="6" x2="6" y2="18" />
                <Line x1="6" y1="6" x2="18" y2="18" />
              </Svg>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom Input / Banner Area */}
        {!selectMode && (
          <View style={styles.convBottomContainer}>
            {isBlocked ? (
              <View style={styles.blockedBanner}>
                <Text style={styles.blockedBannerText}>You have blocked this contact.</Text>
                <TouchableOpacity onPress={handleBlockContact} style={styles.unblockBtn}>
                  <Text style={styles.unblockBtnText}>Unblock</Text>
                </TouchableOpacity>
              </View>
            ) : activeChatContact.status === 'requested' ? (
              <View style={styles.requestBannerContainer}>
                <Text style={styles.requestBannerTitle}>
                  Do you want to allow {activeChatContact.name} to message you?
                </Text>
                <Text style={styles.requestBannerSubtitle}>
                  They won't know you've seen their messages until you accept.
                </Text>
                <View style={styles.requestBannerActions}>
                  <TouchableOpacity 
                    style={[styles.requestActionBtn, styles.requestActionBtnBlock]}
                    onPress={() => handleRequestAction('blocked')}
                  >
                    <Text style={styles.requestActionTextBlock}>Block</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.requestActionBtn, styles.requestActionBtnAccept]}
                    onPress={() => handleRequestAction('accepted')}
                  >
                    <Text style={styles.requestActionTextAccept}>Allow</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : activeChatContact.status === 'waiting_accept' ? (
              <View style={styles.waitingBannerContainer}>
                <Text style={styles.waitingBannerText}>
                  Waiting for {activeChatContact.name} to accept for further chat.
                </Text>
                <TouchableOpacity 
                  style={styles.simulateAcceptBtn}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setChatsList(prev => prev.map(c => c.id === activeChatId ? { ...c, status: 'accepted' } : c));
                    showAlert(`${activeChatContact.name} accepted your invitation!`, 'Invitation Accepted');
                  }}
                >
                  <Text style={styles.simulateAcceptBtnText}>Simulate Accept</Text>
                </TouchableOpacity>
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
                    value={messageInput}
                    onChangeText={setMessageInput}
                    onSubmitEditing={handleSendMessage}
                  />
                </View>
                <TouchableOpacity style={styles.convSendBtn} onPress={handleSendMessage}>
                  <SendIcon stroke="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderChatContent = () => {
    if (chatSubView === 'new_message') {
      return renderNewMessageContent();
    }
    if (chatSubView === 'conversation') {
      return renderConversationContent();
    }
    if (chatSubView === 'requests') {
      return renderRequestsContent();
    }

    const filteredChats = chatsList.filter(chat => 
      chat.status === 'accepted' && (
        chat.name.toLowerCase().includes(chatSearch.toLowerCase()) || 
        chat.msg.toLowerCase().includes(chatSearch.toLowerCase())
      )
    );

    const filteredSuggested = chatSearch.trim() === '' 
      ? [] 
      : allMembers.filter(member => 
          (member.name.toLowerCase().includes(chatSearch.toLowerCase()) ||
           member.role.toLowerCase().includes(chatSearch.toLowerCase())) &&
          !chatsList.some(c => c.id === member.id)
        );

    const unreadChatsCount = chatsList.filter(c => c.unread && c.status === 'accepted').length;

    const getLatestMsgInfo = (chatId, defaultMsg, defaultTime) => {
      const msgs = chatMessages[chatId];
      if (msgs && msgs.length > 0) {
        const lastMsg = msgs[msgs.length - 1];
        return {
          msg: lastMsg.text,
          time: lastMsg.time,
          isFile: lastMsg.attachmentType === 'file'
        };
      }
      return { msg: defaultMsg, time: defaultTime, isFile: false };
    };

    return (
      <View style={styles.chatScreenWrapper}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity 
            onPress={() => onNavigate('home')} 
            style={styles.headerBackBtn}
          >
            <BackArrowIcon />
          </TouchableOpacity>
          <Text style={styles.headerScreenTitle}>Message</Text>
        </View>

        {/* Search Bar & Requests Button */}
        <View style={styles.chatSearchContainer}>
          <View style={styles.searchRow}>
            <View style={styles.chatSearchWrapperReduced}>
              <View style={styles.chatSearchIconContainer}>
                <SearchIcon />
              </View>
              <TextInput
                style={styles.chatSearchInput}
                placeholder="Search..."
                placeholderTextColor="#94A3B8"
                value={chatSearch}
                onChangeText={setChatSearch}
              />
            </View>
            <TouchableOpacity 
              style={styles.requestsButton}
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setChatSubView('requests');
              }}
            >
              <View style={styles.requestsIconContainer}>
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#03254C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <Polyline points="22,6 12,13 2,6" />
                </Svg>
                {chatsList.filter(c => c.status === 'requested').length > 0 && (
                  <View style={styles.requestsBadge}>
                    <Text style={styles.requestsBadgeText}>
                      {chatsList.filter(c => c.status === 'requested').length}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.requestsBtnLabel}>Requests</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section Header Row */}
        <View style={styles.chatSectionTitleRow}>
          <Text style={styles.chatSectionTitle}>Recent Conversations</Text>
          <View style={styles.chatUnreadBadge}>
            <Text style={styles.chatUnreadBadgeText}>{unreadChatsCount} UNREAD</Text>
          </View>
        </View>

        {/* Conversations List */}
        <ScrollView style={styles.chatListContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.chatCardListWrapper}>
            {filteredChats.map(chat => {
              const latestMsg = getLatestMsgInfo(chat.id, chat.msg, chat.time);
              return (
                <TouchableOpacity 
                  key={chat.id} 
                  style={styles.chatItemCard} 
                  activeOpacity={0.75}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setChatsList(prev => prev.map(c => c.id === chat.id ? { ...c, unread: false } : c));
                    setActiveChatId(chat.id);
                    setChatSubView('conversation');
                  }}
                >
                  <View style={styles.chatAvatarContainer}>
                    <View style={[styles.chatAvatarSquare, { backgroundColor: chat.avatarColor }]}>
                      {getContactImage(chat) ? (
                        <Image source={getContactImage(chat)} style={{ width: '100%', height: '100%' }} />
                      ) : (
                        <Text style={styles.chatAvatarSquareText}>{chat.avatar}</Text>
                      )}
                    </View>
                    <View style={[styles.chatStatusDot, { backgroundColor: chat.online ? '#7DBE14' : '#CBD5E1', borderColor: '#FFFFFF' }]} />
                  </View>
                  <View style={styles.chatInfoCol}>
                    <View style={styles.chatHeaderRow}>
                      <Text style={[styles.chatName, chat.unread && styles.chatNameUnread]}>{chat.name}</Text>
                      <Text style={[styles.chatTime, chat.unread && styles.chatTimeUnread]}>{latestMsg.time}</Text>
                    </View>
                    <Text style={[styles.chatMsg, chat.unread && styles.chatMsgUnread]} numberOfLines={1}>
                      {latestMsg.isFile ? (
                        <Text style={{ color: '#64748B', fontWeight: '500' }}>
                          Sent a file: <Text style={{ textDecorationLine: 'underline', color: '#334155' }}>{latestMsg.msg}</Text>
                        </Text>
                      ) : chat.isDraft && chat.msg === latestMsg.msg ? (
                        <Text style={{ fontStyle: 'italic', color: '#64748B' }}>
                          [Draft] <Text style={{ fontStyle: 'normal', color: '#64748B' }}>{latestMsg.msg.replace('[Draft] ', '')}</Text>
                        </Text>
                      ) : (
                        latestMsg.msg
                      )}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Render society member search results if any */}
            {filteredSuggested.length > 0 && (
              <View style={{ marginTop: 20 }}>
                <Text style={styles.newChatSectionTitle}>SOCIETY MEMBERS</Text>
                <View style={{ gap: 12, marginTop: 8 }}>
                  {filteredSuggested.map(member => (
                    <TouchableOpacity 
                      key={member.id} 
                      style={styles.chatItemCard} 
                      activeOpacity={0.75}
                      onPress={() => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        handleStartChatForMember(member);
                      }}
                    >
                      <View style={styles.chatAvatarContainer}>
                        <View style={[styles.chatAvatarSquare, { backgroundColor: member.avatarColor }]}>
                          {getContactImage(member) ? (
                            <Image source={getContactImage(member)} style={{ width: '100%', height: '100%' }} />
                          ) : (
                            <Text style={styles.chatAvatarSquareText}>{member.avatar}</Text>
                          )}
                        </View>
                        <View style={[styles.chatStatusDot, { backgroundColor: member.online ? '#7DBE14' : '#CBD5E1', borderColor: '#FFFFFF' }]} />
                      </View>
                      <View style={styles.chatInfoCol}>
                        <View style={styles.chatHeaderRow}>
                          <Text style={styles.chatNameUnread}>{member.name}</Text>
                          <Text style={styles.chatTimeUnread}>{member.role}</Text>
                        </View>
                        <Text style={styles.chatMsg} numberOfLines={1}>
                          Tap to request chat invitation
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {filteredChats.length === 0 && filteredSuggested.length === 0 && (
              <View style={styles.emptyMessagesContainer}>
                <Text style={styles.emptyMessagesText}>No conversations or members found.</Text>
              </View>
            )}
          </View>
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity 
          style={styles.chatFab} 
          activeOpacity={0.85} 
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setChatSubView('new_message');
          }}
        >
          <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12 5v14M5 12h14" />
          </Svg>
        </TouchableOpacity>
      </View>
    );
  };

  const renderRequestsContent = () => {
    const requestedChats = chatsList.filter(c => c.status === 'requested');

    return (
      <View style={styles.chatScreenWrapper}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity 
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setChatSubView('list');
            }} 
            style={styles.headerBackBtn}
          >
            <BackArrowIcon />
          </TouchableOpacity>
          <Text style={headerScreenTitleStyle()}>Message Requests</Text>
        </View>

        <ScrollView style={styles.chatListContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.requestsIntroText}>
            These messages are from people you don't follow. They won't know you've seen their messages until you accept.
          </Text>
          <View style={styles.chatCardListWrapper}>
            {requestedChats.length === 0 ? (
              <View style={styles.emptyMessagesContainer}>
                <Text style={styles.emptyMessagesText}>No message requests.</Text>
              </View>
            ) : (
              requestedChats.map(chat => (
                <TouchableOpacity 
                  key={chat.id} 
                  style={styles.chatItemCard} 
                  activeOpacity={0.75}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setActiveChatId(chat.id);
                    setChatSubView('conversation');
                  }}
                >
                  <View style={styles.chatAvatarContainer}>
                    <View style={[styles.chatAvatarSquare, { backgroundColor: chat.avatarColor }]}>
                      {getContactImage(chat) ? (
                        <Image source={getContactImage(chat)} style={{ width: '100%', height: '100%' }} />
                      ) : (
                        <Text style={styles.chatAvatarSquareText}>{chat.avatar}</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.chatInfoCol}>
                    <View style={styles.chatHeaderRow}>
                      <Text style={styles.chatNameUnread}>{chat.name}</Text>
                      <Text style={styles.chatTimeUnread}>{chat.time}</Text>
                    </View>
                    <Text style={styles.chatMsgUnread} numberOfLines={1}>
                      {chat.msg}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
          <View style={{ height: 120 }} />
        </ScrollView>
      </View>
    );
  };

  // Inline helper to resolve title style
  const headerScreenTitleStyle = () => {
    return styles.headerScreenTitle;
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
    <View style={styles.container}>
      {renderChatContent()}
      {renderAttachmentMenu()}
      {renderHeaderMenu()}
      {renderCallOverlay()}
      {renderGalleryModal()}
      {renderFilesModal()}
      {renderAudioRecordModal()}
      {renderLocationSelectModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  headerBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerBackText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#03254C',
  },
  headerScreenTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#03254C',
  },
  chatScreenWrapper: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  chatSearchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  chatSearchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#D0DDF5',
  },
  chatSearchIconContainer: {
    marginRight: 8,
  },
  chatSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#03254C',
    fontWeight: '600',
    padding: 0,
  },
  chatSectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 14,
    marginBottom: 8,
  },
  chatSectionTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#03254C',
  },
  chatUnreadBadge: {
    backgroundColor: '#7DBE14',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatUnreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  chatListContainer: {
    flex: 1,
  },
  chatCardListWrapper: {
    paddingHorizontal: 20,
    gap: 12,
  },
  chatItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    gap: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  chatAvatarContainer: {
    position: 'relative',
  },
  chatAvatarSquare: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  chatAvatarSquareText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#03254C',
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
  chatInfoCol: {
    flex: 1,
  },
  chatHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  chatNameUnread: {
    fontWeight: '800',
    color: '#03254C',
  },
  chatTime: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  chatTimeUnread: {
    fontWeight: '700',
    color: '#03254C',
  },
  chatMsg: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  chatMsgUnread: {
    fontWeight: '600',
    color: '#334155',
  },
  chatFab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 86 : 68,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#03254C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 100,
  },
  newChatScreenWrapper: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  newChatScroll: {
    flex: 1,
  },
  newChatSearchCard: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#D0DDF5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  newChatToRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 12,
  },
  newChatToLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#03254C',
    marginRight: 8,
  },
  newChatToInput: {
    flex: 1,
    fontSize: 15,
    color: '#03254C',
    fontWeight: '600',
    padding: 0,
  },
  newChatInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  newChatInfoIcon: {
    fontSize: 14,
    color: '#64748B',
  },
  newChatInfoText: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '600',
  },
  newChatSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1.5,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  suggestedListContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  suggestedContactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    gap: 14,
  },
  suggestedInfoCol: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  suggestedName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#03254C',
  },
  suggestedRole: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '600',
  },
  suggestedActionCol: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  recentMembersScroll: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 10,
  },
  recentMemberCard: {
    alignItems: 'center',
    width: 70,
  },
  recentMemberAvatarSquare: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 6,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  recentMemberAvatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#03254C',
  },
  recentMemberName: {
    fontSize: 11,
    color: '#03254C',
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  startChatBtnContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  startChatBtn: {
    backgroundColor: '#03254C',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  startChatBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  startChatBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  conversationHeaderBar: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
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
  convHeaderAvatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#03254C',
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
    fontWeight: '800',
    letterSpacing: 1.5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 1,
  },
  convHeaderMenuBtn: {
    padding: 8,
  },
  conversationWrapper: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  convMessagesScroll: {
    flex: 1,
  },
  convMessagesContent: {
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

  // Calling Styles
  callOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(3, 37, 76, 0.95)',
    zIndex: 1000,
    elevation: 1001,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    paddingVertical: 60,
    alignItems: 'center',
  },
  callInfoContainer: {
    alignItems: 'center',
    marginTop: 40,
    zIndex: 10,
  },
  callInfoContainerVideo: {
    marginTop: 20,
  },
  callAvatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  callAvatarImage: {
    width: '100%',
    height: '100%',
  },
  callAvatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#03254C',
  },
  callContactName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  callStatus: {
    fontSize: 14,
    color: '#7DBE14',
    fontWeight: '700',
    letterSpacing: 1.5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  callTextLight: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  videoOverlayPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  videoBgImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  videoSelfPreview: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 90,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#03254C',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selfPreviewInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selfPreviewText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  callActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    zIndex: 10,
  },
  callActionBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  callActionBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  callActionBtnLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  callActionBtnLabelActive: {
    color: '#03254C',
  },
  callActionBtnEnd: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  callActionBtnEndText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  // 3-dots Dropdown Styles
  headerMenuWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  headerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  headerMenuDropdown: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 90 : 54,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#D0DDF5',
    paddingVertical: 6,
    width: 170,
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerMenuOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.8,
    borderBottomColor: '#F1F5F9',
  },
  headerMenuOptionDestructive: {
    borderBottomWidth: 0,
  },
  headerMenuOptionText: {
    fontSize: 13.5,
    color: '#03254C',
    fontWeight: '700',
  },
  headerMenuOptionTextDestructive: {
    fontSize: 13.5,
    color: '#EF4444',
    fontWeight: '700',
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
    fontSize: 10,
    color: '#3B82F6',
    fontWeight: '600',
    marginTop: 2,
  },

  // Multi-select styles
  msgContainerWithSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  msgContainerWithSelectActive: {
    gap: 12,
  },
  msgContainerMe: {
    justifyContent: 'flex-end',
  },
  msgContainerThem: {
    justifyContent: 'flex-start',
  },
  msgContainerMeSelectActive: {
    justifyContent: 'space-between',
  },
  selectCheckboxContainer: {
    paddingVertical: 10,
  },
  selectCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectCheckboxChecked: {
    backgroundColor: '#7DBE14',
    borderColor: '#7DBE14',
  },
  selectActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E6EEFF',
    borderTopWidth: 1.2,
    borderTopColor: '#D0DDF5',
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
  },
  selectCountText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#03254C',
  },
  selectActionBtnsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  selectActionBtn: {
    backgroundColor: '#03254C',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  selectActionBtnDestructive: {
    backgroundColor: '#EF4444',
  },
  selectActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  selectActionBtnTextDestructive: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // Block contact styles
  blockedBanner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  blockedBannerText: {
    color: '#B91C1C',
    fontSize: 12.5,
    fontWeight: '600',
  },
  unblockBtn: {
    backgroundColor: '#EF4444',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  unblockBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyMessagesContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyMessagesText: {
    color: '#64748B',
    fontSize: 14,
    fontStyle: 'italic',
  },

  // Missing screen layout & header styles
  convHeaderRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  convHeaderActionBtn: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
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

  // Call Screen Styling (WhatsApp Inspired)
  callOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0b141a',
    zIndex: 1000,
    elevation: 1001,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  callHeaderContainer: {
    alignItems: 'center',
    marginTop: 40,
    zIndex: 10,
  },
  callEncryptionText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  callContactName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  callStatus: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '700',
    letterSpacing: 1,
  },
  callStatusRinging: {
    color: '#7DBE14',
  },
  callAvatarWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    height: 200,
    width: 200,
  },
  pulseContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(125, 190, 20, 0.4)',
    backgroundColor: 'rgba(125, 190, 20, 0.05)',
  },
  callAvatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  callAvatarImage: {
    width: '100%',
    height: '100%',
  },
  callAvatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#03254C',
  },
  callControlPanel: {
    width: '90%',
    backgroundColor: 'rgba(18, 27, 34, 0.9)',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
    zIndex: 10,
  },
  callActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  callActionBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  callActionBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  callActionBtnEnd: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  videoOverlayPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0b141a',
  },
  videoBgImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  videoSelfPreview: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 90,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#03254C',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selfPreviewInnerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selfPreviewLabelBg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 3,
    alignItems: 'center',
  },
  selfPreviewText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },

  // Message reply buttons
  replyButtonLeft: {
    marginRight: 6,
    alignSelf: 'center',
    padding: 6,
  },
  replyButtonRight: {
    marginLeft: 6,
    alignSelf: 'center',
    padding: 6,
  },

  // Quote reply container inside bubble
  replyQuoteContainer: {
    borderLeftWidth: 3,
    borderLeftColor: '#7DBE14',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 6,
    padding: 6,
    marginBottom: 6,
    minWidth: 120,
  },
  replyQuoteMe: {
    borderLeftColor: '#7DBE14',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  replyQuoteThem: {
    borderLeftColor: '#03254C',
    backgroundColor: 'rgba(3, 37, 76, 0.05)',
  },
  replyQuoteName: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  replyQuoteNameMe: {
    color: '#7DBE14',
  },
  replyQuoteNameThem: {
    color: '#03254C',
  },
  replyQuoteText: {
    fontSize: 12,
    color: '#64748B',
  },
  replyQuoteTextMe: {
    color: '#E2E8F0',
  },
  replyQuoteTextThem: {
    color: '#334155',
  },

  // Reply preview bar directly above input
  replyPreviewBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.2,
    borderTopColor: '#D0DDF5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  replyPreviewIndicator: {
    width: 3,
    height: '100%',
    backgroundColor: '#7DBE14',
    borderRadius: 1.5,
  },
  replyPreviewCol: {
    flex: 1,
    gap: 2,
  },
  replyPreviewTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7DBE14',
  },
  replyPreviewSnippet: {
    fontSize: 13,
    color: '#64748B',
  },
  replyPreviewCloseBtn: {
    padding: 4,
  },

  // Search and requests row
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  chatSearchWrapperReduced: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#D0DDF5',
  },
  requestsButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6EEFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    height: 44,
    minWidth: 72,
    borderWidth: 1,
    borderColor: '#D0DDF5',
  },
  requestsIconContainer: {
    position: 'relative',
    paddingTop: 2,
  },
  requestsBadge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  requestsBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  requestsBtnLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#03254C',
    marginTop: 2,
  },

  // Banner layouts
  convBottomContainer: {
    backgroundColor: '#E6EEFF',
    borderTopWidth: 1.2,
    borderTopColor: '#D0DDF5',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  requestBannerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 12,
    padding: 16,
    borderWidth: 1.2,
    borderColor: '#D0DDF5',
    alignItems: 'center',
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  requestBannerTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#03254C',
    textAlign: 'center',
    marginBottom: 6,
  },
  requestBannerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 16,
  },
  requestBannerActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  requestActionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.2,
  },
  requestActionBtnBlock: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FCA5A5',
  },
  requestActionBtnAccept: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  requestActionTextBlock: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
  requestActionTextAccept: {
    color: '#22C55E',
    fontSize: 13,
    fontWeight: '700',
  },

  waitingBannerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 12,
    padding: 16,
    borderWidth: 1.2,
    borderColor: '#D0DDF5',
    alignItems: 'center',
    gap: 12,
  },
  waitingBannerText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
  },
  simulateAcceptBtn: {
    backgroundColor: '#03254C',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  simulateAcceptBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Message Requests page intro text
  requestsIntroText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 24,
    marginVertical: 16,
    fontWeight: '500',
  },

  // Read status override colors
  msgSentStatus: {
    color: '#94A3B8',
  },
});
