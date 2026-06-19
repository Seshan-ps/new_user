import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  LayoutAnimation, 
  Platform 
} from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { BackArrowIcon } from './Icons';

export default function NotificationScreen({ 
  onNavigate, 
  notifications, 
  setNotifications,
  communitiesList = [],
  receivedJoinRequests = {},
  onApproveJoinRequest,
  onRejectJoinRequest
}) {
  const [connectionRequests, setConnectionRequests] = useState([
    { id: 101, username: 'mithran_k', name: 'Mithran Kumar, ACA', avatar: 'MK', avatarColor: '#E0F2FE', time: '3h', status: 'pending' },
    { id: 102, username: 'lokesh_s', name: 'Lokesh Saravanan, ACA', avatar: 'LS', avatarColor: '#F0FDF4', time: '5h', status: 'pending' },
    { id: 103, username: 'pooja_g', name: 'Pooja Gopal, FCA', avatar: 'PG', avatarColor: '#FEF3C7', time: '1d', status: 'pending' },
    { id: 104, username: 'sowmiya_r', name: 'Sowmiya Rajan, ACA', avatar: 'SR', avatarColor: '#F3E8FF', time: '2d', status: 'pending' }
  ]);
  const [showConnectionRequests, setShowConnectionRequests] = useState(false);

  const handleMarkAllRead = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const toggleReadStatus = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const handleConfirmRequest = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setConnectionRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'connected' } : r));
  };

  const handleDeleteRequest = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setConnectionRequests(prev => prev.filter(r => r.id !== id));
  };

  const pendingRequests = connectionRequests.filter(r => r.status === 'pending');
  
  const communityRequests = [];
  communitiesList.forEach(comm => {
    if (comm.isOwner && receivedJoinRequests[comm.id]) {
      receivedJoinRequests[comm.id].forEach(requester => {
        communityRequests.push({
          id: `req-${comm.id}-${requester}`,
          type: 'join_request',
          communityId: comm.id,
          communityName: comm.name,
          requesterName: requester,
          section: 'Community Request'
        });
      });
    }
  });

  const sections = ['Community Request', 'Last 7 Days'];
  const groupedNotifications = {};
  sections.forEach(sec => {
    if (sec === 'Community Request') {
      groupedNotifications[sec] = communityRequests;
    } else {
      groupedNotifications[sec] = notifications.filter(n => n.section === sec || (n.section === 'Yesterday' && sec === 'Last 7 Days'));
    }
  });

  const renderOverlappingAvatars = (requests) => {
    if (requests.length === 0) return null;
    if (requests.length === 1) {
      return (
        <View style={[styles.reqAvatarCircle, { backgroundColor: requests[0].avatarColor, top: 6, left: 6 }]}>
          <Text style={styles.reqAvatarText}>{requests[0].avatar}</Text>
        </View>
      );
    }
    return (
      <View style={styles.reqAvatarOverlapContainer}>
        <View style={[styles.reqAvatarCircle, styles.reqAvatarOverlap1, { backgroundColor: requests[0].avatarColor }]}>
          <Text style={styles.reqAvatarText}>{requests[0].avatar}</Text>
        </View>
        <View style={[styles.reqAvatarCircle, styles.reqAvatarOverlap2, { backgroundColor: requests[1].avatarColor }]}>
          <Text style={styles.reqAvatarText}>{requests[1].avatar}</Text>
        </View>
      </View>
    );
  };

  const ChevronIcon = ({ expanded }) => (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: [{ rotate: expanded ? '90deg' : '0deg' }] }}>
      <Path d="m9 18 6-6-6-6" />
    </Svg>
  );

  const renderNotificationItem = (item) => {
    let avatarContent = null;
    let bodyContent = null;
    let actionContent = null;

    if (item.type === 'like_story') {
      avatarContent = (
        <View style={styles.instaAvatarContainer}>
          <View style={styles.reqAvatarOverlapContainer}>
            <View style={[styles.reqAvatarCircle, styles.reqAvatarOverlap1, { backgroundColor: '#E0F2FE' }]}>
              <Text style={styles.reqAvatarText}>LK</Text>
            </View>
            <View style={[styles.reqAvatarCircle, styles.reqAvatarOverlap2, { backgroundColor: '#FEF3C7' }]}>
              <Text style={styles.reqAvatarText}>PJ</Text>
            </View>
          </View>
          <View style={styles.avatarHeartBadge}>
            <Svg width="10" height="10" viewBox="0 0 24 24" fill="#EF4444">
              <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </Svg>
          </View>
        </View>
      );
    } else if (item.type === 'like_comment') {
      avatarContent = (
        <View style={styles.instaAvatarContainer}>
          <View style={[styles.singleAvatarCircle, { backgroundColor: '#F3E8FF' }]}>
            <Text style={styles.singleAvatarText}>VH</Text>
          </View>
          <View style={styles.avatarHeartBadge}>
            <Svg width="10" height="10" viewBox="0 0 24 24" fill="#EF4444">
              <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </Svg>
          </View>
        </View>
      );
    } else if (item.type === 'new_post') {
      avatarContent = (
        <View style={styles.instaAvatarContainer}>
          <View style={[styles.singleAvatarCircle, { backgroundColor: '#F1F5F9' }]}>
            <Image source={require('../assets/logo.png')} style={styles.avatarImage} resizeMode="contain" />
          </View>
        </View>
      );
    } else if (item.type === 'new_event') {
      avatarContent = (
        <View style={styles.instaAvatarContainer}>
          <View style={[styles.singleAvatarCircle, { backgroundColor: '#DCFCE7' }]}>
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <Path d="M16 2v4M8 2v4M3 10h18" />
            </Svg>
          </View>
        </View>
      );
    } else if (item.type === 'follow_accept') {
      avatarContent = (
        <View style={styles.instaAvatarContainer}>
          <View style={[styles.singleAvatarCircle, { backgroundColor: '#E0F2FE' }]}>
            <Text style={styles.singleAvatarText}>SR</Text>
          </View>
        </View>
      );
    }

    if (item.type === 'like_story') {
      bodyContent = (
        <Text style={styles.instaNotificationText}>
          <Text style={styles.boldUsername}>{item.users.join(', ')}</Text> and <Text style={styles.boldUsername}>{item.otherCount} others</Text> {item.text} <Text style={styles.instaNotificationTime}>{item.time}</Text>
        </Text>
      );
    } else if (item.type === 'like_comment') {
      bodyContent = (
        <Text style={styles.instaNotificationText}>
          <Text style={styles.boldUsername}>{item.username}</Text> {item.text} <Text style={styles.instaNotificationTime}>{item.time}</Text>
        </Text>
      );
    } else if (item.type === 'new_post') {
      bodyContent = (
        <Text style={styles.instaNotificationText}>
          <Text style={styles.boldUsername}>{item.username}</Text> {item.text} <Text style={styles.instaNotificationTime}>{item.time}</Text>
        </Text>
      );
    } else if (item.type === 'new_event') {
      bodyContent = (
        <Text style={styles.instaNotificationText}>
          <Text style={styles.boldUsername}>Community Event</Text>: "{item.title}" has been scheduled. <Text style={styles.instaNotificationTime}>{item.time}</Text>
        </Text>
      );
    } else if (item.type === 'follow_accept') {
      bodyContent = (
        <Text style={styles.instaNotificationText}>
          <Text style={styles.boldUsername}>{item.username}</Text> {item.text} <Text style={styles.instaNotificationTime}>{item.time}</Text>
        </Text>
      );
    }

    if (item.type === 'like_story' || item.type === 'like_comment') {
      actionContent = (
        <Image source={require('../assets/server_room.png')} style={styles.instaThumbnail} resizeMode="cover" />
      );
    } else if (item.type === 'new_post') {
      actionContent = (
        <TouchableOpacity style={styles.instaActionBtnBlue} onPress={() => onNavigate('home')}>
          <Text style={styles.instaActionBtnTextWhite}>View</Text>
        </TouchableOpacity>
      );
    } else if (item.type === 'new_event') {
      actionContent = (
        <TouchableOpacity style={styles.instaActionBtnBlue} onPress={() => onNavigate('events')}>
          <Text style={styles.instaActionBtnTextWhite}>Register</Text>
        </TouchableOpacity>
      );
    } else if (item.type === 'follow_accept') {
      actionContent = (
        <TouchableOpacity style={styles.instaActionBtnGray} onPress={() => onNavigate('chat')}>
          <Text style={styles.instaActionBtnTextBlack}>Message</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        key={item.id} 
        style={[styles.instaNotificationRow, !item.read && styles.instaUnreadRow]} 
        onPress={() => toggleReadStatus(item.id)}
        activeOpacity={0.9}
      >
        {avatarContent}
        <View style={styles.instaNotificationTextCol}>
          {bodyContent}
        </View>
        <View style={styles.instaActionCol}>
          {actionContent}
        </View>
      </TouchableOpacity>
    );
  };

  const renderJoinRequestItem = (item) => {
    // Generate initials for avatar
    const initials = item.requesterName
      ? item.requesterName
          .split(' ')
          .map(n => n.charAt(0))
          .join('')
          .substring(0, 2)
          .toUpperCase()
      : '??';

    const colors = ['#E0F2FE', '#F0FDF4', '#FEF3C7', '#F3E8FF', '#FFE4E6'];
    const avatarBg = colors[item.requesterName.length % colors.length];

    return (
      <View key={item.id} style={styles.instaNotificationRow}>
        <View style={styles.instaAvatarContainer}>
          <View style={[styles.singleAvatarCircle, { backgroundColor: avatarBg }]}>
            <Text style={styles.singleAvatarText}>{initials}</Text>
          </View>
        </View>
        <View style={styles.instaNotificationTextCol}>
          <Text style={styles.instaNotificationText}>
            <Text style={styles.boldUsername}>{item.requesterName}</Text> wants to join <Text style={styles.boldUsername}>{item.communityName}</Text>
          </Text>
        </View>
        <View style={styles.instaActionCol}>
          <View style={styles.reqBtnRow}>
            <TouchableOpacity 
              style={styles.reqConfirmBtn} 
              onPress={() => onApproveJoinRequest(item.communityId, item.requesterName)}
            >
              <Text style={styles.reqConfirmBtnText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.reqDeleteBtn} 
              onPress={() => onRejectJoinRequest(item.communityId, item.requesterName)}
            >
              <Text style={styles.reqDeleteBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.instaScreenWrapper}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity 
          onPress={() => onNavigate('home')} 
          style={styles.headerBackBtn}
        >
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerScreenTitle}>Notification</Text>
      </View>

      {/* Count Header & Mark All Read */}
      <View style={styles.instaHeaderRow}>
        <Text style={styles.instaHeaderCountText}>
          You have {notifications.filter(n => !n.read).length} unread updates
        </Text>
        {notifications.some(n => !n.read) && (
          <TouchableOpacity onPress={handleMarkAllRead} style={styles.markAllReadBtn}>
            <Text style={styles.markAllReadText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.instaListContainer} showsVerticalScrollIndicator={false}>
        
        {/* Connection Requests Header Row */}
        {pendingRequests.length > 0 && (
          <View style={styles.requestsSectionWrapper}>
            <TouchableOpacity 
              style={styles.requestsHeaderRow} 
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setShowConnectionRequests(!showConnectionRequests);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.requestsLeftCol}>
                {renderOverlappingAvatars(pendingRequests)}
                <View style={styles.requestsTitleCol}>
                  <Text style={styles.requestsTitleText}>Connection requests</Text>
                  <Text style={styles.requestsSubtitleText}>
                    {pendingRequests[0].username} {pendingRequests.length > 1 ? `+ ${pendingRequests.length - 1} others` : ''}
                  </Text>
                </View>
              </View>
              <View style={styles.requestsRightCol}>
                <View style={styles.requestsBlueDot} />
                <ChevronIcon expanded={showConnectionRequests} />
              </View>
            </TouchableOpacity>

            {/* Collapsible Connection Requests List */}
            {showConnectionRequests && (
              <View style={styles.requestsExpandedList}>
                {connectionRequests.map(req => (
                  <View key={req.id} style={styles.requestItemRow}>
                    <View style={[styles.singleAvatarCircle, { backgroundColor: req.avatarColor, marginRight: 10 }]}>
                      <Text style={styles.singleAvatarText}>{req.avatar}</Text>
                    </View>
                    <View style={styles.requestItemInfoCol}>
                      <Text style={styles.requestUsername}>{req.username}</Text>
                      <Text style={styles.requestFullName} numberOfLines={1}>{req.name} • {req.time}</Text>
                    </View>
                    <View style={styles.requestItemActionCol}>
                      {req.status === 'pending' ? (
                        <View style={styles.reqBtnRow}>
                          <TouchableOpacity style={styles.reqConfirmBtn} onPress={() => handleConfirmRequest(req.id)}>
                            <Text style={styles.reqConfirmBtnText}>Confirm</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.reqDeleteBtn} onPress={() => handleDeleteRequest(req.id)}>
                            <Text style={styles.reqDeleteBtnText}>✕</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity style={styles.reqMessageBtn} onPress={() => onNavigate('chat')}>
                          <Text style={styles.reqMessageBtnText}>Message</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
            <View style={styles.requestsDivider} />
          </View>
        )}

        {/* Grouped Notifications lists */}
        {sections.map(section => {
          const sectionItems = groupedNotifications[section] || [];
          if (sectionItems.length === 0) return null;
          return (
            <View key={section} style={styles.instaSectionWrapper}>
              <Text style={styles.instaSectionHeader}>{section}</Text>
              {sectionItems.map(item => {
                if (item.type === 'join_request') {
                  return renderJoinRequestItem(item);
                }
                return renderNotificationItem(item);
              })}
            </View>
          );
        })}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  instaScreenWrapper: {
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
  instaHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  instaHeaderCountText: {
    fontSize: 13.5,
    color: '#64748B',
    fontWeight: '700',
  },
  instaListContainer: {
    flex: 1,
  },
  requestsSectionWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  requestsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  requestsLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  reqAvatarOverlapContainer: {
    width: 44,
    height: 44,
    position: 'relative',
  },
  reqAvatarCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2.2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  reqAvatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#03254C',
  },
  reqAvatarOverlap1: {
    top: 0,
    left: 0,
    zIndex: 2,
  },
  reqAvatarOverlap2: {
    bottom: 0,
    right: 0,
    zIndex: 1,
  },
  requestsTitleCol: {
    flex: 1,
    justifyContent: 'center',
  },
  requestsTitleText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#03254C',
  },
  requestsSubtitleText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },
  requestsRightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  requestsBlueDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#3B82F6',
  },
  requestsExpandedList: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 14,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 14,
  },
  requestItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  requestItemInfoCol: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 12,
  },
  requestUsername: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#03254C',
  },
  requestFullName: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },
  requestItemActionCol: {
    justifyContent: 'center',
  },
  reqBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reqConfirmBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reqConfirmBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  reqDeleteBtn: {
    backgroundColor: '#E2E8F0',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reqDeleteBtnText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
  },
  reqMessageBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reqMessageBtnText: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
  },
  requestsDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    width: '100%',
  },
  instaSectionWrapper: {
    marginTop: 18,
  },
  instaSectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#03254C',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  instaNotificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.8,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  instaUnreadRow: {
    backgroundColor: '#EFF6FF',
  },
  instaAvatarContainer: {
    position: 'relative',
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  singleAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  singleAvatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#03254C',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarHeartBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    zIndex: 10,
  },
  instaNotificationTextCol: {
    flex: 1,
  },
  instaNotificationText: {
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 18,
    fontWeight: '500',
  },
  boldUsername: {
    fontWeight: '700',
    color: '#03254C',
  },
  instaNotificationTime: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  instaActionCol: {
    justifyContent: 'center',
  },
  instaThumbnail: {
    width: 38,
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  instaActionBtnBlue: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instaActionBtnTextWhite: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  instaActionBtnGray: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instaActionBtnTextBlack: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700',
  },
  markAllReadBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  markAllReadText: {
    fontSize: 13,
    color: '#7DBE14',
    fontWeight: '800',
  },
});
