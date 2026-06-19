import React from 'react';
import Svg, { Path, Circle, Line, Polygon, Rect } from 'react-native-svg';

export const AnnouncementIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

export const BellIcon = ({ hasUnread }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#03254C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
    {hasUnread && <Circle cx="18" cy="6" r="4" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.2" />}
  </Svg>
);

export const SearchIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Path d="m21 21-4.3-4.3" />
  </Svg>
);

export const BackArrowIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#03254C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 12H5" />
    <Path d="m12 19-7-7 7-7" />
  </Svg>
);

export const LikeIcon = ({ liked }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? "#7DBE14" : "none"} stroke={liked ? "#7DBE14" : "#134074"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  </Svg>
);

export const CommentIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Svg>
);

export const ShareIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="18" cy="5" r="3" />
    <Circle cx="6" cy="12" r="3" />
    <Circle cx="18" cy="19" r="3" />
    <Path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
  </Svg>
);

export const SendIcon = ({ stroke = "#03254C" }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 2L11 13" />
    <Path d="M22 2L15 22L11 13L2 9Z" />
  </Svg>
);

export const PhoneIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#03254C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

export const VideoCallIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#03254C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="m22 8-6 4 6 4V8Z" />
    <Rect x="2" y="6" width="14" height="12" rx="2" ry="2" />
  </Svg>
);
