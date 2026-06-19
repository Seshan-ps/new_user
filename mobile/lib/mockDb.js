import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial default user VGM
const DEFAULT_USER = {
  name: 'vgm',
  email: 'vgm@gmail.com',
  phone: '9900887766',
  username: 'vgm',
  password: 'vgm@123',
  headline: 'Chief Tax Consultant • Coimbatore Branch',
  about: 'Experienced accounting professional specializing in taxation, auditing, compliance management, and business advisory services.',
  city: 'Coimbatore',
  state: 'Tamil Nadu',
  address: '123, Trichy Road',
  role: 'Chief Tax Consultant',
  company: 'VGM & Associates',
  experience: '10 Years',
  specialization: 'Corporate Taxation & GST Audits',
  companyAddress: 'Coimbatore, TN, India',
  memberSince: 'Jan 2026',
  membershipPlan: 'Premium',
  autopayEnabled: true,
  connectionsCount: 4,
  idCode: 'TAS-2026-00125'
};

// Initial directory members with Tamil names
const DEFAULT_DIRECTORY = [
  { 
    id: 1, 
    name: 'Seshan Srinivasan', 
    role: 'Senior Audit Manager', 
    branch: 'Coimbatore Branch', 
    email: 'seshan@example.com', 
    avatarBg: '#E6EEFF', 
    avatarColor: '#0A52C5', 
    initials: 'SS',
    username: 'seshan',
    phone: '+91 94433 22110',
    about: 'Dedicated financial auditor with over 12 years of experience in regulatory compliance and risk assessment.',
    connections: 188,
    memberIdCode: 'TAS-2026-00084',
    image: null
  },
  { 
    id: 2, 
    name: 'Sanjay Ramasamy', 
    role: 'Tax Compliance Lead', 
    branch: 'Coimbatore Branch', 
    email: 'sanjay@example.com', 
    avatarBg: '#E6F9F0', 
    avatarColor: '#16A34A', 
    initials: 'SR',
    username: 'sanjay_ram',
    phone: '+91 94432 10987',
    about: 'Compliance lead focusing on direct tax planning, statutory audits, and corporate tax structuring.',
    connections: 215,
    memberIdCode: 'TAS-2026-00021',
    image: null
  },
  { 
    id: 3, 
    name: 'Ram Kumar', 
    role: 'GST Specialist', 
    branch: 'Chennai Branch', 
    email: 'ram@example.com', 
    avatarBg: '#FFF8E7', 
    avatarColor: '#D97706', 
    initials: 'RK',
    username: 'ram_kumar',
    phone: '+91 98401 23456',
    about: 'Specialist in GST audits, input tax credit optimization, and representation services.',
    connections: 104,
    memberIdCode: 'TAS-2026-00053',
    image: null
  },
  { 
    id: 4, 
    name: 'Sanjeev Senthil', 
    role: 'Indirect Tax Auditor', 
    branch: 'Trichy Branch', 
    email: 'sanjeev@example.com', 
    avatarBg: '#F3E8FF', 
    avatarColor: '#7E22CE', 
    initials: 'SS',
    username: 'sanjeev_s', 
    phone: '+91 98765 43210',
    about: 'Experienced accounting professional specializing in taxation, auditing, compliance management, and business advisory services.',
    connections: 95,
    memberIdCode: 'TAS-2026-00125',
    image: null
  },
  { 
    id: 5, 
    name: 'Tamil Selvan', 
    role: 'Audit Executive', 
    branch: 'Madurai Branch', 
    email: 'tamil@example.com', 
    avatarBg: '#ECFEFF', 
    avatarColor: '#0891B2', 
    initials: 'TS',
    username: 'tamil_s',
    phone: '+91 97890 12345',
    about: 'Focusing on internal control testing, statutory audits, and financial reporting verification.',
    connections: 84,
    memberIdCode: 'TAS-2026-00142',
    image: null
  },
  { 
    id: 6, 
    name: 'Karthik Raja', 
    role: 'Chartered Accountant', 
    branch: 'Salem Branch', 
    email: 'karthik@example.com', 
    avatarBg: '#F0FDF4', 
    avatarColor: '#16A34A', 
    initials: 'KR',
    username: 'karthik_r',
    phone: '+91 90033 44556',
    about: 'Assisting in corporate taxation filings, VAT audits, and client financial reconciliations.',
    connections: 67,
    memberIdCode: 'TAS-2026-00199',
    image: null
  },
  { 
    id: 7, 
    name: 'Ananya Krishnan', 
    role: 'Corporate Tax Specialist', 
    branch: 'Coimbatore Branch', 
    email: 'ananya@example.com', 
    avatarBg: '#FFE4E6', 
    avatarColor: '#E11D48', 
    initials: 'AK',
    username: 'ananya_k',
    phone: '+91 98402 34567',
    about: 'Consulting on cross-border tax treaties, transfer pricing planning and corporate compliance.',
    connections: 112,
    memberIdCode: 'TAS-2026-00112',
    image: null
  },
  { 
    id: 8, 
    name: 'Priya Mani', 
    role: 'Financial Analyst', 
    branch: 'Chennai Branch', 
    email: 'priya@example.com', 
    avatarBg: '#FDF2F8', 
    avatarColor: '#DB2777', 
    initials: 'PM',
    username: 'priya_m',
    phone: '+91 99100 98765',
    about: 'Consulting on expatriate tax planning, audit logs, and accounting advisory.',
    connections: 153,
    memberIdCode: 'TAS-2026-00104',
    image: null
  },
  { 
    id: 9, 
    name: 'Sowmiya R.', 
    role: 'Tax Consultant', 
    branch: 'Coimbatore Branch', 
    email: 'sowmiya@example.com', 
    avatarBg: '#ECFEFF', 
    avatarColor: '#0A52C5', 
    initials: 'SR',
    username: 'sowmiya_r',
    phone: '+91 98403 45678',
    about: 'Consultant in corporate advisory, GST filing, and financial ledger management.',
    connections: 45,
    memberIdCode: 'TAS-2026-00210',
    image: null
  },
  { 
    id: 10, 
    name: 'Vishal Venkat', 
    role: 'Audit Executive', 
    branch: 'Chennai Branch', 
    email: 'vishal@example.com', 
    avatarBg: '#FFF8E7', 
    avatarColor: '#D97706', 
    initials: 'VV',
    username: 'vishal_v',
    phone: '+91 99011 22334',
    about: 'Assisting in audit planning, internal audits, and direct taxation compliance.',
    connections: 72,
    memberIdCode: 'TAS-2026-00234',
    image: null
  },
  { 
    id: 11, 
    name: 'Lokesh Sundar', 
    role: 'Senior Auditor', 
    branch: 'Salem Branch', 
    email: 'lokesh@example.com', 
    avatarBg: '#F3E8FF', 
    avatarColor: '#7E22CE', 
    initials: 'LS',
    username: 'lokesh_s',
    phone: '+91 99022 33445',
    about: 'Dedicated tax professional with 6 years of expertise in corporate tax audits and accounting files.',
    connections: 120,
    memberIdCode: 'TAS-2026-00245',
    image: null
  }
];

// Initial default connections
const DEFAULT_CONNECTIONS = {
  1: 'connected', // Seshan
  2: 'connected', // Sanjay Ramasamy
  3: 'connected', // Ram Kumar
  4: 'connected', // Sanjeev Senthil
  5: 'not_connected',
  6: 'not_connected',
  7: 'not_connected',
  8: 'not_connected',
  9: 'not_connected',
  10: 'not_connected',
  11: 'not_connected'
};

const DEFAULT_CHATS = [
  {
    id: 1,
    name: 'Sanjay Ramasamy',
    avatar: 'SR',
    avatarColor: '#E6F9F0',
    msg: 'Sure, let\'s catch up on direct tax filing rules tomorrow.',
    time: '12:30 PM',
    unread: false,
    online: true,
    status: 'accepted'
  },
  {
    id: 3,
    name: 'Ram Kumar',
    avatar: 'RK',
    avatarColor: '#FFF8E7',
    msg: 'Audit logs checked. Looks complete.',
    time: 'Yesterday',
    unread: false,
    online: false,
    status: 'accepted'
  },
  {
    id: 4,
    name: 'Sanjeev Senthil',
    avatar: 'SS',
    avatarColor: '#F3E8FF',
    msg: 'Please check the Q4 submission link before closing.',
    time: '2 days ago',
    unread: true,
    online: true,
    status: 'accepted'
  },
  {
    id: 7,
    name: 'Ananya Krishnan',
    avatar: 'AK',
    avatarColor: '#FFE4E6',
    msg: 'Hi, I would like to connect and discuss GST auditing guidelines.',
    time: '3 days ago',
    unread: true,
    online: false,
    status: 'requested'
  }
];

const DEFAULT_MESSAGES = {
  1: [
    { id: 1, sender: 'Sanjay Ramasamy', text: 'Hey vgm, did you verify the audit draft report?', time: '11:20 AM', isSystem: false },
    { id: 2, sender: 'vgm', text: 'Yes, Sanjay. I checked it and it matches the ledger entries.', time: '11:25 AM', isSystem: false },
    { id: 3, sender: 'Sanjay Ramasamy', text: 'Sure, let\'s catch up on direct tax filing rules tomorrow.', time: '12:30 PM', isSystem: false }
  ],
  3: [
    { id: 1, sender: 'Ram Kumar', text: 'The GST audit report needs signature.', time: '10:00 AM', isSystem: false },
    { id: 2, sender: 'vgm', text: 'Sent the signed copy over. Let me know if you received it.', time: '10:15 AM', isSystem: false },
    { id: 3, sender: 'Ram Kumar', text: 'Audit logs checked. Looks complete.', time: '04:30 PM', isSystem: false }
  ],
  4: [
    { id: 1, sender: 'Sanjeev Senthil', text: 'Please check the Q4 submission link before closing.', time: '02:15 PM', isSystem: false }
  ],
  7: [
    { id: 1, sender: 'Ananya Krishnan', text: 'Hi, I would like to connect and discuss GST auditing guidelines.', time: '11:00 AM', isSystem: false }
  ]
};

export const mockDb = {
  // Clear and reset the database to defaults
  async resetAllData() {
    try {
      await AsyncStorage.setItem('users', JSON.stringify([DEFAULT_USER]));
      await AsyncStorage.setItem('directory', JSON.stringify(DEFAULT_DIRECTORY));
      await AsyncStorage.setItem('connections', JSON.stringify(DEFAULT_CONNECTIONS));
      await AsyncStorage.setItem('chats', JSON.stringify(DEFAULT_CHATS));
      await AsyncStorage.setItem('messages', JSON.stringify(DEFAULT_MESSAGES));
      await AsyncStorage.setItem('registered_events', JSON.stringify({}));
      console.log('mockDb: Successfully reset database to defaults.');
      return true;
    } catch (e) {
      console.error('mockDb Error: Reset failed', e);
      return false;
    }
  },

  // Initialize DB if not present
  async initDb() {
    try {
      const users = await AsyncStorage.getItem('users');
      if (!users) {
        await this.resetAllData();
      }
    } catch (e) {
      console.error('mockDb Error: Init failed', e);
    }
  },

  // Authentication & Users
  async getUsers() {
    try {
      const u = await AsyncStorage.getItem('users');
      return u ? JSON.parse(u) : [DEFAULT_USER];
    } catch (e) {
      return [DEFAULT_USER];
    }
  },

  async registerUser(user) {
    try {
      const users = await this.getUsers();
      // Create user profile details matching directory format
      const newUser = {
        name: user.full_name || user.name,
        email: user.email,
        phone: user.phone,
        username: user.username,
        password: user.password,
        headline: '',
        about: '',
        city: '',
        state: '',
        address: '',
        role: '',
        company: '',
        experience: '',
        specialization: '',
        companyAddress: '',
        memberSince: 'Jun 2026',
        membershipPlan: user.membershipPlan || 'Premium',
        autopayEnabled: user.autopayEnabled !== undefined ? user.autopayEnabled : true,
        connectionsCount: 0,
        idCode: `TAS-2026-00${Math.floor(100 + Math.random() * 900)}`,
        image: null
      };
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      return newUser;
    } catch (e) {
      console.error('mockDb Error: registerUser failed', e);
      throw e;
    }
  },

  async updateUserPassword(emailOrPhone, newPassword) {
    try {
      const users = await this.getUsers();
      const cleanInput = emailOrPhone.trim().toLowerCase();
      const updatedUsers = users.map(u => {
        if (u.email.toLowerCase() === cleanInput || u.phone === cleanInput) {
          return { ...u, password: newPassword };
        }
        return u;
      });
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
      return true;
    } catch (e) {
      console.error('mockDb Error: updateUserPassword failed', e);
      return false;
    }
  },

  async updateUserProfile(username, updatedFields) {
    try {
      const users = await this.getUsers();
      const updatedUsers = users.map(u => {
        if (u.username.toLowerCase() === username.trim().toLowerCase()) {
          return { ...u, ...updatedFields };
        }
        return u;
      });
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
      // Return updated user
      return updatedUsers.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    } catch (e) {
      console.error('mockDb Error: updateUserProfile failed', e);
      return null;
    }
  },

  // Directory and Connections
  async getDirectory() {
    try {
      const d = await AsyncStorage.getItem('directory');
      return d ? JSON.parse(d) : DEFAULT_DIRECTORY;
    } catch (e) {
      return DEFAULT_DIRECTORY;
    }
  },

  async getConnections() {
    try {
      const c = await AsyncStorage.getItem('connections');
      return c ? JSON.parse(c) : DEFAULT_CONNECTIONS;
    } catch (e) {
      return DEFAULT_CONNECTIONS;
    }
  },

  async updateConnectionStatus(memberId, status) {
    try {
      const connections = await this.getConnections();
      connections[memberId] = status;
      await AsyncStorage.setItem('connections', JSON.stringify(connections));
      return connections;
    } catch (e) {
      console.error('mockDb Error: updateConnectionStatus failed', e);
      return null;
    }
  },

  // Chats & Messages
  async getChats() {
    try {
      const c = await AsyncStorage.getItem('chats');
      return c ? JSON.parse(c) : DEFAULT_CHATS;
    } catch (e) {
      return DEFAULT_CHATS;
    }
  },

  async getMessages() {
    try {
      const m = await AsyncStorage.getItem('messages');
      return m ? JSON.parse(m) : DEFAULT_MESSAGES;
    } catch (e) {
      return DEFAULT_MESSAGES;
    }
  },

  async saveChats(chats) {
    try {
      await AsyncStorage.setItem('chats', JSON.stringify(chats));
    } catch (e) {
      console.error('mockDb Error: saveChats failed', e);
    }
  },

  async saveMessages(messages) {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messages));
    } catch (e) {
      console.error('mockDb Error: saveMessages failed', e);
    }
  },

  // Event Bookings
  async getRegisteredEvents() {
    try {
      const e = await AsyncStorage.getItem('registered_events');
      return e ? JSON.parse(e) : {};
    } catch (e) {
      return {};
    }
  },

  async saveRegisteredEvents(events) {
    try {
      await AsyncStorage.setItem('registered_events', JSON.stringify(events));
    } catch (e) {
      console.error('mockDb Error: saveRegisteredEvents failed', e);
    }
  }
};
