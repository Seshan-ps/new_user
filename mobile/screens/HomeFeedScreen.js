import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  LayoutAnimation, 
  Platform 
} from 'react-native';
import Svg, { Path, Circle, Line, Polyline, Rect } from 'react-native-svg';
import { SearchIcon, BellIcon, LikeIcon, CommentIcon, ShareIcon, SendIcon } from './Icons';
import { mockDb } from '../lib/mockDb';

const BackArrowIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#03254C" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="19" y1="12" x2="5" y2="12" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

const DirectoryIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#03254C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <Circle cx="12" cy="8" r="2.5" />
    <Path d="M8 14c0-2 2-3 4-3s4 1 4 3" />
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

const PhoneIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

const MailIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <Polyline points="22,6 12,13 2,6" />
  </Svg>
);

const LocationPinIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

export default function HomeFeedScreen({ 
  onNavigate, 
  hasUnreadNotifications, 
  setActiveDirectChatUser,
  directoryMembers,
  connectionStatuses,
  setConnectionStatuses,
  currentUser,
  showAlert,
  showDirectory: propShowDirectory,
  setShowDirectory: propSetShowDirectory,
  safeAreaBottom = 0
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [localShowDirectory, setLocalShowDirectory] = useState(false);
  const showDirectory = propShowDirectory !== undefined ? propShowDirectory : localShowDirectory;
  const setShowDirectory = propSetShowDirectory !== undefined ? propSetShowDirectory : setLocalShowDirectory;

  const [directoryQuery, setDirectoryQuery] = useState('');
  const [activeTier, setActiveTier] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const scrollViewRef = useRef(null);

  const getMemberTier = (role) => {
    const lower = role.toLowerCase();
    if (lower.includes('chief') || lower.includes('lead') || lower.includes('chartered') || lower.includes('specialist') || lower.includes('analyst') || lower.includes('partner')) {
      return 'PLATINUM';
    }
    if (lower.includes('senior') || lower.includes('manager')) {
      return 'SENIOR';
    }
    if (lower.includes('auditor') || lower.includes('advisor')) {
      return 'ASSOCIATE';
    }
    return 'STUDENT';
  };

  const getMemberAvatar = (member) => {
    const defaults = [
      require('../assets/avatar_sarah_jenkins.png'),
      require('../assets/avatar_david_chen.png'),
      require('../assets/avatar_marcus.png'),
      require('../assets/avatar_elena.png'),
      require('../assets/avatar_robert.png'),
    ];
    return defaults[member.id % defaults.length];
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'PLATINUM':
        return '#7DBE14';
      case 'SENIOR':
        return '#0A52C5';
      case 'ASSOCIATE':
        return '#34B7F1';
      default:
        return '#CBD5E1';
    }
  };
  
  // Member profile details view state
  const [selectedMemberForProfile, setSelectedMemberForProfile] = useState(null);
  
  // Pending timers to auto-accept connection
  const [pendingTimers, setPendingTimers] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  const showTemporaryToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleConnectToggle = async (memberId, memberName) => {
    const currentStatus = connectionStatuses[memberId] || 'not_connected';
    if (currentStatus === 'not_connected') {
      await setConnectionStatuses(memberId, 'pending');
      showTemporaryToast(`Connection request sent to ${memberName}`);
      
      const timerId = setTimeout(async () => {
        const latest = await mockDb.getConnections();
        if (latest[memberId] === 'pending') {
          await setConnectionStatuses(memberId, 'connected');
          showTemporaryToast(`${memberName} accepted your connection request!`);
        }
      }, 3000);
      
      setPendingTimers(prev => ({ ...prev, [memberId]: timerId }));
    } else if (currentStatus === 'pending') {
      await setConnectionStatuses(memberId, 'not_connected');
      showTemporaryToast(`Cancelled request for ${memberName}`);
      
      if (pendingTimers[memberId]) {
        clearTimeout(pendingTimers[memberId]);
        setPendingTimers(prev => {
          const updated = { ...prev };
          delete updated[memberId];
          return updated;
        });
      }
    } else if (currentStatus === 'connected') {
      await setConnectionStatuses(memberId, 'not_connected');
      showTemporaryToast(`Connection removed with ${memberName}`);
    }
  };
  const [likedPosts, setLikedPosts] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [likedComments, setLikedComments] = useState({});
  const [likedReplies, setLikedReplies] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyInputs, setReplyInputs] = useState({});
  const [sharePostId, setSharePostId] = useState(null);

  const [adminPosts, setAdminPosts] = useState([
    {
      id: 1,
      title: 'tas_admin',
      subtitle: 'Admin Society Broadcast • 10,248 members',
      time: '2h ago',
      content: 'We are pleased to announce the successful rollout of the **Q3 Security Patch** for the national administration portal. All member accounts now benefit from enhanced biometric authentication layers. Ensure your regional office has updated their node.',
      image: require('../assets/server_room.png'),
      imageBadge: 'System Update 4.2.0',
      likes: 42,
      commentsCount: 2,
      comments: [
        { 
          id: 11, 
          author: 'Sandhya Rajan', 
          avatar: 'SR', 
          time: '10m ago', 
          text: 'Great update on the security patch! The biometric layer is a much-needed addition for our regional nodes.', 
          likes: 22,
          replies: [
            { id: 111, author: 'Arun Kumar', avatar: 'AK', time: '5m ago', text: 'Agreed! We just tested it in the South node and it works flawlessly.', likes: 4 }
          ]
        },
        { 
          id: 12, 
          author: 'Sanjeev Senthil', 
          avatar: 'SS', 
          time: '45m ago', 
          text: 'Will there be a technical briefing for the IT administrators regarding the node update process?', 
          likes: 12,
          replies: [
            { id: 121, author: 'tas_admin', avatar: 'TA', time: '30m ago', text: 'Yes Sanjeev, we will be hosting a brief Zoom call tomorrow at 10 AM. The link will be sent shortly.', likes: 8 }
          ]
        }
      ],
      tags: ['Security', 'Patch', 'Update']
    },
    {
      id: 2,
      title: 'tas_admin',
      subtitle: 'Admin Society Broadcast',
      time: '2h ago',
      content: "Is anyone else observing a significant increase in automated reconciliation errors following the latest API update? We've had to revert to manual validation for three major enterprise audits this morning.",
      quote: '“Maintaining fiscal integrity requires human oversight, especially during transition phases.”',
      likes: 8,
      commentsCount: 0,
      comments: [],
      tags: ['API', 'Reconciliation', 'Auditing']
    },
    {
      id: 3,
      title: 'tas_admin',
      subtitle: 'Admin Society Broadcast • 10,248 members',
      time: '5h ago',
      content: 'Important Reminder: The annual membership renewal cycle starts next week. Please verify your billing address and professional credentials under the Profile settings tab before processing your dues.',
      likes: 18,
      commentsCount: 1,
      comments: [
        {
          id: 31,
          author: 'Arun Kumar',
          avatar: 'AK',
          time: '4h ago',
          text: 'Thanks for the reminder. Will the invoices be sent automatically to our registered email addresses?',
          likes: 3,
          replies: []
        }
      ],
      tags: ['Membership', 'Renewal', 'Annual']
    },
    {
      id: 4,
      title: 'tas_admin',
      subtitle: 'Admin Society Broadcast',
      time: '1d ago',
      content: 'We are thrilled to announce a collaboration with the National Finance Institute to offer advanced certifications in AI-driven forensics. Member registrations will open next Monday.',
      quote: '“Bridging the gap between classical auditing and modern machine intelligence.”',
      likes: 31,
      commentsCount: 0,
      comments: [],
      tags: ['Forensics', 'AI', 'Education']
    }
  ]);

  const handleLikePost = (postId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const liked = !likedPosts[postId];
    setLikedPosts(prev => ({ ...prev, [postId]: liked }));
    setAdminPosts(posts => posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: liked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  const handleToggleComments = (postId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = (postId) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newComment = {
      id: Date.now(),
      author: 'VGM Member',
      avatar: 'VM',
      time: 'Just now',
      text: text.trim(),
      likes: 0,
      replies: []
    };

    setAdminPosts(posts => posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          commentsCount: post.commentsCount + 1,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleLikeComment = (postId, commentId) => {
    const liked = !likedComments[commentId];
    setLikedComments(prev => ({ ...prev, [commentId]: liked }));
    setAdminPosts(posts => posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(c => {
            if (c.id === commentId) {
              return { ...c, likes: liked ? c.likes + 1 : c.likes - 1 };
            }
            return c;
          })
        };
      }
      return post;
    }));
  };

  const handleAddReply = (postId, commentId) => {
    const text = replyInputs[commentId];
    if (!text || !text.trim()) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newReply = {
      id: Date.now(),
      author: 'VGM Member',
      avatar: 'VM',
      time: 'Just now',
      text: text.trim(),
      likes: 0
    };

    setAdminPosts(posts => posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(c => {
            if (c.id === commentId) {
              return {
                ...c,
                replies: [...(c.replies || []), newReply]
              };
            }
            return c;
          })
        };
      }
      return post;
    }));

    setReplyInputs(prev => ({ ...prev, [commentId]: '' }));
    setActiveReplyId(null);
  };

  const handleLikeReply = (postId, commentId, replyId) => {
    const liked = !likedReplies[replyId];
    setLikedReplies(prev => ({ ...prev, [replyId]: liked }));
    setAdminPosts(posts => posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(c => {
            if (c.id === commentId) {
              return {
                ...c,
                replies: c.replies.map(r => r.id === replyId ? { ...r, likes: liked ? r.likes + 1 : r.likes - 1 } : r)
              };
            }
            return c;
          })
        };
      }
      return post;
    }));
  };

  const renderSharePopup = () => {
    if (sharePostId === null) return null;
    return (
      <View style={styles.shareOverlay}>
        <TouchableOpacity 
          style={styles.shareBackdrop} 
          activeOpacity={1}
          onPress={() => setSharePostId(null)}
        />
        <View style={styles.shareBottomSheet}>
          <View style={styles.shareIndicator} />
          <Text style={styles.shareTitle}>Share Post</Text>
          
          <View style={styles.shareGrid}>
            <TouchableOpacity style={styles.shareOption} onPress={() => { setSharePostId(null); showAlert('Shared to Feed'); }}>
              <View style={[styles.shareIconCircle, { backgroundColor: '#E0F2FE' }]}>
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <Path d="M4 22v-7" />
                </Svg>
              </View>
              <Text style={styles.shareOptionText}>Feed</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareOption} onPress={() => { setSharePostId(null); showAlert('Shared in Chat'); }}>
              <View style={[styles.shareIconCircle, { backgroundColor: '#F0FDF4' }]}>
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </Svg>
              </View>
              <Text style={styles.shareOptionText}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareOption} onPress={() => { setSharePostId(null); showAlert('Shared via WhatsApp'); }}>
              <View style={[styles.shareIconCircle, { backgroundColor: '#DCFCE7' }]}>
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </Svg>
              </View>
              <Text style={styles.shareOptionText}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareOption} onPress={() => { setSharePostId(null); showAlert('Link Copied'); }}>
              <View style={[styles.shareIconCircle, { backgroundColor: '#F3E8FF' }]}>
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7E22CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <Path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </Svg>
              </View>
              <Text style={styles.shareOptionText}>Copy Link</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.shareCancelBtn} onPress={() => setSharePostId(null)}>
            <Text style={styles.shareCancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const filteredPosts = adminPosts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // directoryMembers is now passed as a prop from the parent state.

  const filteredMembers = directoryMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(directoryQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(directoryQuery.toLowerCase()) ||
      member.branch.toLowerCase().includes(directoryQuery.toLowerCase()) ||
      (member.memberIdCode && member.memberIdCode.toLowerCase().includes(directoryQuery.toLowerCase()));

    const memberTier = getMemberTier(member.role);
    const matchesTier = activeTier === 'ALL' || memberTier === activeTier;

    return matchesSearch && matchesTier;
  });

  const renderConnectButton = (memberId, memberName) => {
    const status = connectionStatuses[memberId] || 'not_connected';
    
    let btnStyle = styles.connectBtnDefault;
    let textStyle = styles.connectBtnTextDefault;
    let label = 'Connect';
    
    if (status === 'pending') {
      btnStyle = styles.connectBtnPending;
      textStyle = styles.connectBtnTextPending;
      label = 'Pending';
    } else if (status === 'connected') {
      btnStyle = styles.connectBtnConnected;
      textStyle = styles.connectBtnTextConnected;
      label = 'Remove';
    }
    
    return (
      <TouchableOpacity 
        style={btnStyle}
        onPress={() => handleConnectToggle(memberId, memberName)}
      >
        <Text style={textStyle}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const renderDirectoryView = () => {
    const membersPerPage = 6;
    const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
    const indexOfLastMember = currentPage * membersPerPage;
    const indexOfFirstMember = indexOfLastMember - membersPerPage;
    const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);

    const activeBadgeColor = (tier) => {
      switch (tier) {
        case 'PLATINUM':
          return { bg: '#E6F9F0', text: '#16A34A', label: 'PLATINUM ELITE' };
        case 'SENIOR':
          return { bg: '#E6EEFF', text: '#0A52C5', label: 'SENIOR FELLOW' };
        case 'ASSOCIATE':
          return { bg: '#E0F2FE', text: '#0284C7', label: 'ASSOCIATE' };
        default:
          return { bg: '#F1F5F9', text: '#64748B', label: 'STUDENT MEMBER' };
      }
    };

    return (
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => setShowDirectory(false)}>
            <BackArrowIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Directory</Text>
        </View>

        <ScrollView ref={scrollViewRef} style={styles.contentScroll} showsVerticalScrollIndicator={false}>
          {/* Members Heading section */}
          <View style={styles.membersHeaderRow}>
            <View style={styles.membersTitleRow}>
              <Text style={styles.membersTitleText}>Members</Text>
              <View style={styles.activeDatabaseBadge}>
                <Text style={styles.activeDatabaseBadgeText}>Active Database</Text>
              </View>
            </View>
            <View style={styles.totalMembersContainer}>
              <Text style={styles.totalMembersLabel}>TOTAL SOCIETY MEMBERS</Text>
              <Text style={styles.totalMembersCount}>{directoryMembers.length}</Text>
            </View>
          </View>

          {/* Search Registry and Membership Tier Filters */}
          <View style={styles.filterCard}>
            <Text style={styles.filterCardLabel}>Search Registry</Text>
            <View style={styles.registrySearchInputWrapper}>
              <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" style={{ marginRight: 8 }}>
                <Circle cx="11" cy="11" r="8" />
                <Line x1="21" y1="21" x2="16.65" y2="16.65" />
              </Svg>
              <TextInput
                style={styles.registrySearchInput}
                placeholder="Filter by Name, ID, or Professional Designation."
                placeholderTextColor="#94A3B8"
                value={directoryQuery}
                onChangeText={(val) => {
                  setDirectoryQuery(val);
                  setCurrentPage(1);
                }}
              />
            </View>

            <Text style={styles.filterCardLabel}>Membership Tier</Text>
            <View style={styles.tierPillsWrapper}>
              {['ALL', 'PLATINUM', 'SENIOR', 'ASSOCIATE', 'STUDENT'].map((tier) => {
                const isSelected = activeTier === tier;
                return (
                  <TouchableOpacity
                    key={tier}
                    style={[styles.tierPillBtn, isSelected ? styles.tierPillBtnActive : null]}
                    onPress={() => {
                      setActiveTier(tier);
                      setCurrentPage(1);
                    }}
                  >
                    <Text style={[styles.tierPillBtnText, isSelected ? styles.tierPillBtnTextActive : null]}>
                      {tier}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Member Card Listing */}
          {currentMembers.length === 0 ? (
            <View style={styles.emptyFeedContainer}>
              <Text style={styles.emptyFeedText}>No members match your criteria.</Text>
            </View>
          ) : (
            currentMembers.map(member => {
              const tier = getMemberTier(member.role);
              const badge = activeBadgeColor(tier);
              const avatarBorderColor = getTierColor(tier);

              return (
                <View key={member.id} style={styles.memberCardNew}>
                  <TouchableOpacity 
                    style={styles.memberCardContent}
                    onPress={() => setSelectedMemberForProfile(member.id)}
                    activeOpacity={0.7}
                  >
                    <Image 
                      source={getMemberAvatar(member)} 
                      style={[styles.memberCardImage, { borderColor: avatarBorderColor }]} 
                    />
                    
                    <View style={styles.memberCardDetails}>
                      <Text style={styles.memberCardName}>{member.name}</Text>
                      <Text style={styles.memberCardHeadline}>
                        {member.role}, {member.branch}
                      </Text>

                      <View style={styles.memberCardIdRow}>
                        <Svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" style={{ marginRight: 4 }}>
                          <Rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
                          <Line x1="7" y1="8" x2="17" y2="8" />
                          <Line x1="7" y1="12" x2="15" y2="12" />
                        </Svg>
                        <Text style={styles.memberCardIdText}>
                          ID: {member.memberIdCode || 'TAS-0000-XX'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.memberCardButtonsRow}>
                    {(() => {
                      const status = connectionStatuses[member.id] || 'not_connected';
                      let btnStyle = styles.memberCardConnectBtnDefault;
                      let textStyle = styles.memberCardConnectBtnTextDefault;
                      let label = 'CONNECT';
                      
                      if (status === 'pending') {
                         btnStyle = styles.memberCardConnectBtnPending;
                         textStyle = styles.memberCardConnectBtnTextPending;
                         label = 'PENDING';
                      } else if (status === 'connected') {
                         btnStyle = styles.memberCardConnectBtnConnected;
                         textStyle = styles.memberCardConnectBtnTextConnected;
                         label = 'REMOVE';
                      }

                      return (
                        <TouchableOpacity 
                          style={btnStyle}
                          onPress={() => handleConnectToggle(member.id, member.name)}
                        >
                          <Text style={textStyle}>{label}</Text>
                        </TouchableOpacity>
                      );
                    })()}

                    <TouchableOpacity 
                      style={styles.memberCardMsgBtn}
                      onPress={() => {
                        setActiveDirectChatUser({ name: member.name });
                        setShowDirectory(false);
                        onNavigate('chat');
                      }}
                    >
                      <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#03254C" strokeWidth="2.5" style={{ marginRight: 6 }}>
                        <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </Svg>
                      <Text style={styles.memberCardMsgBtnText}>MESSAGE</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}

          {/* Pagination Controls */}
          {filteredMembers.length > 0 && (
            <View style={styles.paginationSection}>
              <Text style={styles.paginationInfo}>
                Showing {indexOfFirstMember + 1}-{Math.min(indexOfLastMember, filteredMembers.length)} of {filteredMembers.length} results
              </Text>
              
              <View style={styles.paginationBtnsRow}>
                <TouchableOpacity 
                  disabled={currentPage === 1}
                  style={[styles.pageBtn, currentPage === 1 ? styles.pageBtnDisabled : null]}
                  onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  <Text style={[styles.pageBtnText, currentPage === 1 ? styles.pageBtnTextDisabled : null]}>‹</Text>
                </TouchableOpacity>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <TouchableOpacity
                      key={pageNum}
                      style={[styles.pageBtn, isActive ? styles.pageBtnActive : null]}
                      onPress={() => setCurrentPage(pageNum)}
                    >
                      <Text style={[styles.pageBtnText, isActive ? styles.pageBtnTextActive : null]}>
                        {pageNum}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                <TouchableOpacity 
                  disabled={currentPage === totalPages}
                  style={[styles.pageBtn, currentPage === totalPages ? styles.pageBtnDisabled : null]}
                  onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  <Text style={[styles.pageBtnText, currentPage === totalPages ? styles.pageBtnTextDisabled : null]}>›</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={{ height: 140 }} />
        </ScrollView>

        {/* Scroll To Top floating action button */}
        <TouchableOpacity 
          style={[styles.floatingScrollTopBtn, { bottom: (safeAreaBottom > 0 ? safeAreaBottom + 110 : 120) }]}
          onPress={() => scrollViewRef.current?.scrollTo({ y: 0, animated: true })}
        >
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3">
            <Line x1="12" y1="19" x2="12" y2="5" />
            <Polyline points="5 12 12 5 19 12" />
          </Svg>
        </TouchableOpacity>

        {toastMessage && (
          <View style={styles.toastContainer}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderMemberProfileView = (memberId) => {
    const member = directoryMembers.find(m => m.id === memberId);
    if (!member) return null;

    const connectionStatus = connectionStatuses[memberId] || 'not_connected';

    let connectBtnStyle = styles.profileConnectBtnDefault;
    let connectBtnTextStyle = styles.profileConnectBtnTextDefault;
    let connectLabel = 'Connect';

    if (connectionStatus === 'pending') {
      connectBtnStyle = styles.profileConnectBtnPending;
      connectBtnTextStyle = styles.profileConnectBtnTextPending;
      connectLabel = 'Pending';
    } else if (connectionStatus === 'connected') {
      connectBtnStyle = styles.profileConnectBtnConnected;
      connectBtnTextStyle = styles.profileConnectBtnTextConnected;
      connectLabel = 'Remove';
    }

    return (
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedMemberForProfile(null)}>
            <BackArrowIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
          {/* Main Card */}
          <View style={styles.profileMainCard}>
            <View style={styles.profileTopRow}>
              {/* Profile Image / Initials */}
              {member.image ? (
                <Image source={member.image} style={styles.profileAvatarImage} />
              ) : (
                <View style={[styles.profileAvatarCircle, { backgroundColor: member.avatarBg }]}>
                  <Text style={[styles.profileAvatarText, { color: member.avatarColor }]}>{member.initials}</Text>
                </View>
              )}

              <View style={styles.profileTopDetails}>
                <Text style={styles.profileUsername}>{member.username || member.name.toLowerCase().replace(' ', '_')}</Text>
                <Text style={styles.profileRoleBranch}>{member.role} • {member.branch}</Text>
                <Text style={styles.profileConnectionsCount}>{member.connections || 0} connections</Text>
                <Text style={styles.profileIdCode}>ID: {member.memberIdCode || 'TAS-2026-00000'}</Text>
              </View>
            </View>

            {/* About Section */}
            <Text style={styles.profileSectionSubheading}>ABOUT</Text>
            <Text style={styles.profileAboutText}>
              {member.about || 'No details provided.'}
            </Text>

            {/* Action Buttons Row */}
            <View style={styles.profileActionRow}>
              <TouchableOpacity 
                style={styles.profileMessageBtn}
                onPress={() => {
                  setActiveDirectChatUser({ name: member.name });
                  setShowDirectory(false);
                  setSelectedMemberForProfile(null);
                  onNavigate('chat');
                }}
              >
                <Text style={styles.profileMessageBtnText}>Message</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={connectBtnStyle}
                onPress={() => handleConnectToggle(member.id, member.name)}
              >
                <Text style={connectBtnTextStyle}>{connectLabel}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Personal Information Card */}
          <View style={styles.profileDetailsCard}>
            <View style={styles.cardHeaderRow}>
              <PersonalIcon />
              <Text style={styles.cardHeaderTitle}>PERSONAL INFORMATION</Text>
            </View>
            <View style={styles.cardDivider} />

            {/* Fields */}
            <View style={styles.profileFieldRow}>
              <UserCardIcon />
              <View style={styles.profileFieldCol}>
                <Text style={styles.profileFieldLabel}>Full Name</Text>
                <Text style={styles.profileFieldValue}>{member.name}</Text>
              </View>
            </View>

            <View style={styles.profileFieldRow}>
              <PhoneIcon />
              <View style={styles.profileFieldCol}>
                <Text style={styles.profileFieldLabel}>Mobile Number</Text>
                <Text style={styles.profileFieldValue}>{member.phone || '--'}</Text>
              </View>
            </View>

            <View style={styles.profileFieldRow}>
              <MailIcon />
              <View style={styles.profileFieldCol}>
                <Text style={styles.profileFieldLabel}>Email Address</Text>
                <Text style={styles.profileFieldValue}>{member.email || '--'}</Text>
              </View>
            </View>

            <View style={styles.profileFieldRow}>
              <LocationPinIcon />
              <View style={styles.profileFieldCol}>
                <Text style={styles.profileFieldLabel}>City, State</Text>
                <Text style={styles.profileFieldValue}>--</Text>
              </View>
            </View>
          </View>

          {/* Professional Profile Card */}
          <View style={styles.profileDetailsCard}>
            <View style={styles.cardHeaderRow}>
              <BriefcaseIcon />
              <Text style={styles.cardHeaderTitle}>PROFESSIONAL PROFILE</Text>
            </View>
            <View style={styles.cardDivider} />

            <View style={styles.professionalFieldsContainer}>
              <View style={styles.professionalFieldBlock}>
                <Text style={styles.professionalFieldLabel}>Current Role</Text>
                <Text style={styles.professionalFieldValue}>--</Text>
              </View>

              <View style={styles.professionalTwoColRow}>
                <View style={styles.professionalCol}>
                  <Text style={styles.professionalFieldLabel}>Experience</Text>
                  <Text style={styles.professionalFieldValue}>--</Text>
                </View>
                <View style={styles.professionalCol}>
                  <Text style={styles.professionalFieldLabel}>TAS Member Since</Text>
                  <Text style={styles.professionalFieldValue}>--</Text>
                </View>
              </View>

              <View style={styles.professionalFieldBlock}>
                <Text style={styles.professionalFieldLabel}>Specialization</Text>
                <Text style={styles.professionalFieldValue}>--</Text>
              </View>
            </View>
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
        {toastMessage && (
          <View style={styles.toastContainer}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}
      </View>
    );
  };

  if (selectedMemberForProfile !== null) {
    return renderMemberProfileView(selectedMemberForProfile);
  }

  if (showDirectory) {
    return renderDirectoryView();
  }

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={[styles.headerBar, styles.homeHeaderBar]}>
        <View style={styles.searchBarWrapper}>
          <TextInput
            style={styles.headerSearchInput}
            placeholder="Search posts..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            style={styles.lensButton}
            onPress={() => showAlert(`Searching posts for: ${searchQuery}`)}
          >
            <SearchIcon />
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.directoryBtn}
          onPress={() => setShowDirectory(true)}
        >
          <DirectoryIcon />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.notificationBellBtn}
          onPress={() => onNavigate('notifications')}
        >
          <BellIcon hasUnread={hasUnreadNotifications} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.feedHeading}>Official Admin Broadcasts</Text>
        
        {filteredPosts.length === 0 ? (
          <View style={styles.emptyFeedContainer}>
            <Text style={styles.emptyFeedText}>No posts match your search query.</Text>
          </View>
        ) : (
          filteredPosts.map(post => {
            const isLiked = likedPosts[post.id];
            const isCommentsExpanded = expandedComments[post.id];

            return (
              <View key={post.id} style={styles.postCard}>
                {/* Header Row */}
                <View style={styles.postHeader}>
                  <View style={styles.authorBadgeContainer}>
                    <View style={styles.authorAvatar}>
                      <Image source={require('../assets/logo.png')} style={styles.authorLogoImage} resizeMode="contain" />
                    </View>
                    <View>
                      <Text style={styles.postAuthor}>{post.title}</Text>
                      <Text style={styles.postRole}>{post.subtitle}</Text>
                    </View>
                  </View>
                  {post.time ? <Text style={styles.postTimeText}>{post.time}</Text> : null}
                </View>

                {/* Body Content */}
                <View style={styles.postBodyContainer}>
                  {post.id === 1 ? (
                    <Text style={styles.postContent}>
                      We are pleased to announce the successful rollout of the <Text style={{fontWeight: '800'}}>Q3 Security Patch</Text> for the national administration portal. All member accounts now benefit from enhanced biometric authentication layers. Ensure your regional office has updated their node.
                    </Text>
                  ) : (
                    <Text style={styles.postContent}>{post.content}</Text>
                  )}

                  {/* Render quote if present */}
                  {post.quote ? (
                    <View style={styles.quoteBlockContainer}>
                      <Text style={styles.quoteBlockText}>{post.quote}</Text>
                    </View>
                  ) : null}

                  {/* Render image if present */}
                  {post.image ? (
                    <View style={styles.postImageContainer}>
                      <Image source={post.image} style={styles.postMainImage} resizeMode="cover" />
                      {post.imageBadge ? (
                        <View style={styles.postImageBadge}>
                          <Text style={styles.postImageBadgeText}>{post.imageBadge}</Text>
                        </View>
                      ) : null}
                    </View>
                  ) : null}
                </View>

                {/* Likes, Comments & Share Bar */}
                <View style={styles.engagementDivider} />
                <View style={styles.engagementBar}>
                  <TouchableOpacity 
                    style={styles.engagementBtn} 
                    onPress={() => handleLikePost(post.id)}
                  >
                    <LikeIcon liked={isLiked} />
                    <Text style={[styles.engagementBtnText, isLiked && styles.likedBtnText]}>
                      {post.likes}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.engagementBtn}
                    onPress={() => handleToggleComments(post.id)}
                  >
                    <CommentIcon />
                    <Text style={styles.engagementBtnText}>{post.commentsCount}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.engagementBtnShare}
                    onPress={() => setSharePostId(post.id)}
                  >
                    <ShareIcon />
                  </TouchableOpacity>
                </View>
                <View style={styles.engagementDivider} />

                {/* Comments Section */}
                {isCommentsExpanded && (
                  <View style={styles.commentsSectionContainer}>
                    <View style={styles.commentsHeader}>
                      <Text style={styles.commentsHeaderTitle}>Comments</Text>
                      <TouchableOpacity onPress={() => handleToggleComments(post.id)}>
                        <Text style={styles.commentsCloseBtn}>✕</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Comments List */}
                    <View style={styles.commentsList}>
                      {post.comments.length === 0 ? (
                        <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
                      ) : (
                        post.comments.map(comment => (
                          <View key={comment.id} style={styles.commentContainer}>
                            <View style={styles.commentItem}>
                              <View style={styles.commentAvatar}>
                                {comment.avatar === 'TA' ? (
                                  <Image source={require('../assets/logo.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                                ) : (
                                  <Text style={styles.commentAvatarText}>{comment.avatar}</Text>
                                )}
                              </View>
                              <View style={styles.commentContentCol}>
                                <View style={styles.commentRowHeader}>
                                  <Text style={styles.commentAuthorName}>{comment.author}</Text>
                                  <Text style={styles.commentTime}>{comment.time}</Text>
                                </View>
                                <Text style={styles.commentBodyText}>{comment.text}</Text>
                                
                                <View style={styles.commentActionRow}>
                                  <TouchableOpacity 
                                    style={styles.commentLikeBtn}
                                    onPress={() => handleLikeComment(post.id, comment.id)}
                                  >
                                    <LikeIcon liked={!!likedComments[comment.id]} />
                                    <Text style={[styles.commentLikeText, !!likedComments[comment.id] && styles.likedCommentText]}>{comment.likes}</Text>
                                  </TouchableOpacity>

                                  <TouchableOpacity 
                                    style={styles.commentReplyBtn}
                                    onPress={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                                  >
                                    <Text style={styles.commentReplyBtnText}>Reply</Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>

                            {/* Replies List */}
                            {comment.replies && comment.replies.map(reply => (
                              <View key={reply.id} style={styles.replyItem}>
                                <View style={styles.replyAvatar}>
                                  {reply.avatar === 'TA' ? (
                                    <Image source={require('../assets/logo.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                                  ) : (
                                    <Text style={styles.replyAvatarText}>{reply.avatar}</Text>
                                  )}
                                </View>
                                <View style={styles.replyContentCol}>
                                  <View style={styles.replyRowHeader}>
                                    <Text style={styles.replyAuthorName}>{reply.author}</Text>
                                    <Text style={styles.replyTime}>{reply.time}</Text>
                                  </View>
                                  <Text style={styles.replyBodyText}>{reply.text}</Text>
                                  
                                  <TouchableOpacity 
                                    style={styles.replyLikeBtn}
                                    onPress={() => handleLikeReply(post.id, comment.id, reply.id)}
                                  >
                                    <LikeIcon liked={!!likedReplies[reply.id]} />
                                    <Text style={[styles.replyLikeText, !!likedReplies[reply.id] && styles.likedReplyText]}>{reply.likes}</Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            ))}

                            {/* Inline Reply Input Bar */}
                            {activeReplyId === comment.id && (
                              <View style={styles.replyInputContainer}>
                                <TextInput
                                  style={styles.replyTextInput}
                                  placeholder="Write a reply..."
                                  placeholderTextColor="#94A3B8"
                                  value={replyInputs[comment.id] || ''}
                                  onChangeText={text => setReplyInputs(prev => ({ ...prev, [comment.id]: text }))}
                                />
                                <TouchableOpacity 
                                  style={styles.sendReplyBtn}
                                  onPress={() => handleAddReply(post.id, comment.id)}
                                >
                                  <SendIcon />
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        ))
                      )}
                    </View>

                    {/* Add Comment Input Bar */}
                    <View style={styles.addCommentBar}>
                      <View style={styles.commentAvatar}>
                        <Text style={styles.commentAvatarText}>VM</Text>
                      </View>
                      <TextInput
                        style={styles.addCommentInput}
                        placeholder="Add a comment..."
                        placeholderTextColor="#94A3B8"
                        value={commentInputs[post.id] || ''}
                        onChangeText={text => setCommentInputs(prev => ({ ...prev, [post.id]: text }))}
                      />
                      <TouchableOpacity 
                        style={styles.sendCommentBtn}
                        onPress={() => handleAddComment(post.id)}
                      >
                        <SendIcon />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          })
        )}
        <View style={{ height: 90 }} />
      </ScrollView>
      {renderSharePopup()}
      {toastMessage && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
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
  homeHeaderBar: {
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    gap: 12,
  },
  searchBarWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: '#D0DDF5',
  },
  searchIconContainer: {
    marginRight: 8,
  },
  headerSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#03254C',
    fontWeight: '600',
    padding: 0,
  },
  notificationBellBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0DDF5',
  },
  contentScroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  feedHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#03254C',
    marginBottom: 16,
  },
  emptyFeedContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyFeedText: {
    fontSize: 14.5,
    color: '#64748B',
    fontWeight: '600',
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  authorLogoImage: {
    width: '100%',
    height: '100%',
  },
  postAuthor: {
    fontSize: 15,
    fontWeight: '700',
    color: '#03254C',
  },
  postRole: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  postTimeText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  postBodyContainer: {
    marginBottom: 12,
  },
  postContent: {
    fontSize: 14.5,
    color: '#334155',
    lineHeight: 21,
    fontWeight: '500',
    marginBottom: 12,
  },
  quoteBlockContainer: {
    backgroundColor: '#F0F9FF',
    borderLeftWidth: 4,
    borderLeftColor: '#7DBE14',
    padding: 12,
    borderRadius: 4,
    marginBottom: 12,
  },
  quoteBlockText: {
    fontSize: 13.5,
    color: '#6FAA11',
    fontStyle: 'italic',
    fontWeight: '700',
    lineHeight: 19,
  },
  postImageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 8,
  },
  postMainImage: {
    width: '100%',
    height: '100%',
  },
  postImageBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(3, 37, 76, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  postImageBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  engagementDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    width: '100%',
  },
  engagementBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  engagementBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  engagementBtnShare: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  engagementBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#134074',
  },
  likedBtnText: {
    color: '#7DBE14',
  },
  commentsSectionContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 8,
  },
  commentsHeaderTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#03254C',
  },
  commentsCloseBtn: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '800',
  },
  commentsList: {
    marginBottom: 12,
  },
  noCommentsText: {
    fontSize: 13,
    color: '#64748B',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 10,
  },
  commentContainer: {
    marginBottom: 12,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 10,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#03254C',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  commentAvatarText: {
    fontSize: 11,
    color: '#7DBE14',
    fontWeight: '800',
  },
  commentContentCol: {
    flex: 1,
  },
  commentRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  commentAuthorName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#03254C',
  },
  commentTime: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  commentBodyText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    fontWeight: '500',
  },
  commentActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
  },
  commentLikeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentLikeText: {
    fontSize: 11.5,
    color: '#134074',
    fontWeight: '700',
  },
  likedCommentText: {
    color: '#7DBE14',
  },
  commentReplyBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  commentReplyBtnText: {
    fontSize: 11.5,
    color: '#134074',
    fontWeight: '700',
  },
  replyItem: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginLeft: 36,
    borderLeftWidth: 1.5,
    borderLeftColor: '#E2E8F0',
    paddingLeft: 10,
  },
  replyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#03254C',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  replyAvatarText: {
    fontSize: 9,
    color: '#7DBE14',
    fontWeight: '800',
  },
  replyContentCol: {
    flex: 1,
  },
  replyRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  replyAuthorName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#03254C',
  },
  replyTime: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
  },
  replyBodyText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 16,
    fontWeight: '500',
  },
  replyLikeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  replyLikeText: {
    fontSize: 11,
    color: '#134074',
    fontWeight: '700',
  },
  likedReplyText: {
    color: '#7DBE14',
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginLeft: 36,
    borderLeftWidth: 1.5,
    borderLeftColor: '#E2E8F0',
    paddingLeft: 10,
  },
  replyTextInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 10,
    height: 32,
    fontSize: 12,
    color: '#03254C',
    fontWeight: '500',
  },
  sendReplyBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCommentBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
  },
  addCommentInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    paddingHorizontal: 12,
    height: 36,
    fontSize: 13,
    color: '#03254C',
    fontWeight: '500',
  },
  sendCommentBtn: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  backButton: {
    paddingVertical: 4,
    paddingRight: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#03254C',
  },
  directoryBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0DDF5',
  },
  lensButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  directorySearchWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#D0DDF5',
    marginBottom: 16,
    justifyContent: 'center',
  },
  directorySearchInput: {
    fontSize: 14,
    color: '#03254C',
    fontWeight: '600',
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  memberAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberAvatarText: {
    fontSize: 15,
    fontWeight: '800',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#03254C',
  },
  memberRole: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  memberBranch: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  memberRowTapArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectBtnDefault: {
    borderWidth: 1.2,
    borderColor: '#0A52C5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  connectBtnTextDefault: {
    color: '#0A52C5',
    fontSize: 12,
    fontWeight: '800',
  },
  connectBtnPending: {
    borderWidth: 1.2,
    borderColor: '#94A3B8',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FF',
    minWidth: 80,
  },
  connectBtnTextPending: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '800',
  },
  connectBtnConnected: {
    borderWidth: 1.2,
    borderColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    minWidth: 80,
  },
  connectBtnTextConnected: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '800',
  },
  profileMainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#D0DDF5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatarImage: {
    width: 76,
    height: 76,
    borderRadius: 8,
    marginRight: 16,
    borderWidth: 1.5,
    borderColor: '#D0DDF5',
  },
  profileAvatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileAvatarText: {
    fontSize: 24,
    fontWeight: '800',
  },
  profileTopDetails: {
    flex: 1,
  },
  profileUsername: {
    fontSize: 21,
    fontWeight: '800',
    color: '#03254C',
  },
  profileRoleBranch: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  profileConnectionsCount: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#84CC16',
    marginTop: 4,
  },
  profileIdCode: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2,
  },
  profileSectionSubheading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#03254C',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 4,
  },
  profileAboutText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  profileActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  profileMessageBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#03254C',
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  profileMessageBtnText: {
    color: '#03254C',
    fontSize: 13.5,
    fontWeight: '800',
  },
  profileConnectBtnDefault: {
    flex: 1,
    backgroundColor: '#03254C',
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileConnectBtnTextDefault: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  profileConnectBtnPending: {
    flex: 1,
    backgroundColor: '#94A3B8',
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileConnectBtnTextPending: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  profileConnectBtnConnected: {
    flex: 1,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileConnectBtnTextConnected: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  profileDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1.2,
    borderColor: '#A2B6DF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardHeaderTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#03254C',
    letterSpacing: 0.5,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  profileFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  profileFieldCol: {
    flex: 1,
  },
  profileFieldLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'none',
  },
  profileFieldValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#334155',
    marginTop: 1,
  },
  professionalFieldsContainer: {
    gap: 12,
  },
  professionalFieldBlock: {
    width: '100%',
  },
  professionalTwoColRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  professionalCol: {
    flex: 1,
  },
  professionalFieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  professionalFieldValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#334155',
    marginTop: 2,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    right: 20,
    backgroundColor: '#03254C',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 9999,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
    textAlign: 'center',
  },
  dirStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    shadowColor: '#0A52C5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  dirStatBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dirStatNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0A52C5',
    marginBottom: 4,
  },
  dirStatLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
  },
  dirStatDivider: {
    width: 1.2,
    height: 32,
    backgroundColor: '#E2E8F0',
  },
  dirTabWrapper: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 14,
    padding: 4,
  },
  dirTabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  dirTabButtonActive: {
    backgroundColor: '#03254C',
  },
  dirTabButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  dirTabButtonTextActive: {
    color: '#FFFFFF',
  },
  membersHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 14,
  },
  membersTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membersTitleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#03254C',
  },
  activeDatabaseBadge: {
    backgroundColor: '#E6F9F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7DBE14',
    marginLeft: 8,
  },
  activeDatabaseBadgeText: {
    color: '#16A34A',
    fontSize: 10,
    fontWeight: '800',
  },
  totalMembersContainer: {
    alignItems: 'flex-end',
  },
  totalMembersLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#94A3B8',
  },
  totalMembersCount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#03254C',
  },
  filterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  filterCardLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#03254C',
    marginBottom: 8,
  },
  registrySearchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 16,
  },
  registrySearchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#03254C',
  },
  tierPillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tierPillBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tierPillBtnActive: {
    backgroundColor: '#03254C',
    borderColor: '#03254C',
  },
  tierPillBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  tierPillBtnTextActive: {
    color: '#FFFFFF',
  },
  memberCardNew: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  memberCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  memberCardImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1.5,
    marginRight: 16,
  },
  memberCardDetails: {
    flex: 1,
    alignItems: 'flex-start',
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  tierBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  memberCardName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#03254C',
    marginBottom: 2,
  },
  memberCardHeadline: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    lineHeight: 16,
  },
  memberCardIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  memberCardIdText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  memberCardButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  memberCardConnectBtnDefault: {
    flex: 1,
    backgroundColor: '#03254C',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberCardConnectBtnTextDefault: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  memberCardConnectBtnPending: {
    flex: 1,
    backgroundColor: '#94A3B8',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberCardConnectBtnTextPending: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  memberCardConnectBtnConnected: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    borderWidth: 1.2,
    borderColor: '#EF4444',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberCardConnectBtnTextConnected: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '800',
  },
  memberCardMsgBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#03254C',
    borderRadius: 10,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberCardMsgBtnText: {
    color: '#03254C',
    fontSize: 12,
    fontWeight: '800',
  },
  paginationSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  paginationInfo: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
  },
  paginationBtnsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  pageBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageBtnActive: {
    backgroundColor: '#03254C',
    borderColor: '#03254C',
  },
  pageBtnDisabled: {
    backgroundColor: '#F8FAFC',
    borderColor: '#F1F5F9',
  },
  pageBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  pageBtnTextActive: {
    color: '#FFFFFF',
  },
  pageBtnTextDisabled: {
    color: '#CBD5E1',
  },
  floatingScrollTopBtn: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#03254C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 999,
  },
});
