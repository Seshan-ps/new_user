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

// Initial directory members matching UI Design
const DEFAULT_DIRECTORY = [
  { 
    id: 1, 
    name: 'Dr. Alistair Vance', 
    role: 'Chief Financial Auditor', 
    branch: 'Global Trust', 
    email: 'alistair@example.com', 
    avatarBg: '#E6F9F0', 
    avatarColor: '#16A34A', 
    initials: 'AV',
    username: 'alistair_vance',
    phone: '+1 555-019-9200',
    about: 'Chief Financial Auditor at Global Trust. Specialist in corporate auditing, compliance, and financial forensics.',
    connections: 188,
    memberIdCode: 'TAS-9920-PL',
    image: null
  },
  { 
    id: 2, 
    name: 'Elena Rodriguez', 
    role: 'Partner', 
    branch: 'Rodriguez & Assoc.', 
    email: 'elena@example.com', 
    avatarBg: '#E6EEFF', 
    avatarColor: '#0A52C5', 
    initials: 'ER',
    username: 'elena_rodriguez',
    phone: '+1 555-014-4412',
    about: 'Partner at Rodriguez & Assoc. Over 15 years of experience in taxation consulting, audit planning, and corporate compliance.',
    connections: 215,
    memberIdCode: 'TAS-4412-SR',
    image: null
  },
  { 
    id: 3, 
    name: 'Jameson Thorne', 
    role: 'Forensic Accountant', 
    branch: 'TAS Governance', 
    email: 'jameson@example.com', 
    avatarBg: '#E0F2FE', 
    avatarColor: '#0284C7', 
    initials: 'JT',
    username: 'jameson_thorne',
    phone: '+1 555-018-8801',
    about: 'Forensic Accountant focusing on internal controls, fraud investigations, and financial reporting verification.',
    connections: 104,
    memberIdCode: 'TAS-8801-AS',
    image: null
  },
  { 
    id: 4, 
    name: 'Sarah Jenkins', 
    role: 'Senior Tax Consultant', 
    branch: 'Jenkins Advisory', 
    email: 'sarah@example.com', 
    avatarBg: '#F3E8FF', 
    avatarColor: '#7E22CE', 
    initials: 'SJ',
    username: 'sarah_j', 
    phone: '+1 555-013-3129',
    about: 'Senior consultant specializing in indirect taxes, GST planning, and corporate representation.',
    connections: 95,
    memberIdCode: 'TAS-3129-SR',
    image: null
  },
  { 
    id: 5, 
    name: 'David Chen', 
    role: 'Corporate Auditor', 
    branch: 'Chen Financials', 
    email: 'david@example.com', 
    avatarBg: '#ECFEFF', 
    avatarColor: '#0891B2', 
    initials: 'DC',
    username: 'david_chen',
    phone: '+1 555-015-5502',
    about: 'Auditing specialist assisting clients in corporate tax preparation and regulatory reconciliations.',
    connections: 84,
    memberIdCode: 'TAS-5502-AS',
    image: null
  },
  { 
    id: 6, 
    name: 'Emily Watson', 
    role: 'GST Specialist', 
    branch: 'Watson Partners', 
    email: 'emily@example.com', 
    avatarBg: '#F0FDF4', 
    avatarColor: '#16A34A', 
    initials: 'EW',
    username: 'emily_w',
    phone: '+1 555-017-7741',
    about: 'Focused on GST audit representation, input tax credits, and client advisory.',
    connections: 67,
    memberIdCode: 'TAS-7741-ST',
    image: null
  },
  { 
    id: 7, 
    name: 'Marcus Sterling', 
    role: 'Tax Director', 
    branch: 'Sterling Group', 
    email: 'marcus@example.com', 
    avatarBg: '#FFE4E6', 
    avatarColor: '#E11D48', 
    initials: 'MS',
    username: 'marcus_sterling',
    phone: '+1 555-011-1042',
    about: 'Consulting on cross-border tax treaties, transfer pricing planning, and corporate structuring.',
    connections: 112,
    memberIdCode: 'TAS-1042-PL',
    image: null
  },
  { 
    id: 8, 
    name: 'Janice Miller', 
    role: 'Audit Executive', 
    branch: 'Miller Consulting', 
    email: 'janice@example.com', 
    avatarBg: '#FDF2F8', 
    avatarColor: '#DB2777', 
    initials: 'JM',
    username: 'janice_m',
    phone: '+1 555-012-1205',
    about: 'Focused on internal audits, control systems testing, and client bookkeeping.',
    connections: 153,
    memberIdCode: 'TAS-1205-ST',
    image: null
  }
];

// Initial default connections
const DEFAULT_CONNECTIONS = {
  1: 'connected',
  2: 'connected',
  3: 'connected',
  4: 'connected',
  5: 'not_connected',
  6: 'not_connected',
  7: 'not_connected',
  8: 'not_connected'
};

const DEFAULT_CHATS = [
  {
    id: 2,
    name: 'Elena Rodriguez',
    avatar: 'ER',
    avatarColor: '#E6F9F0',
    msg: 'Sure, let\'s catch up on direct tax filing rules tomorrow.',
    time: '12:30 PM',
    unread: false,
    online: true,
    status: 'accepted'
  },
  {
    id: 3,
    name: 'Jameson Thorne',
    avatar: 'JT',
    avatarColor: '#FFF8E7',
    msg: 'Audit logs checked. Looks complete.',
    time: 'Yesterday',
    unread: false,
    online: false,
    status: 'accepted'
  },
  {
    id: 4,
    name: 'Sarah Jenkins',
    avatar: 'SJ',
    avatarColor: '#F3E8FF',
    msg: 'Please check the Q4 submission link before closing.',
    time: '2 days ago',
    unread: true,
    online: true,
    status: 'accepted'
  },
  {
    id: 7,
    name: 'Marcus Sterling',
    avatar: 'MS',
    avatarColor: '#FFE4E6',
    msg: 'Hi, I would like to connect and discuss GST auditing guidelines.',
    time: '3 days ago',
    unread: true,
    online: false,
    status: 'requested'
  }
];

const DEFAULT_MESSAGES = {
  2: [
    { id: 1, sender: 'Elena Rodriguez', text: 'Hey vgm, did you verify the audit draft report?', time: '11:20 AM', isSystem: false },
    { id: 2, sender: 'vgm', text: 'Yes, Elena. I checked it and it matches the ledger entries.', time: '11:25 AM', isSystem: false },
    { id: 3, sender: 'Elena Rodriguez', text: 'Sure, let\'s catch up on direct tax filing rules tomorrow.', time: '12:30 PM', isSystem: false }
  ],
  3: [
    { id: 1, sender: 'Jameson Thorne', text: 'The GST audit report needs signature.', time: '10:00 AM', isSystem: false },
    { id: 2, sender: 'vgm', text: 'Sent the signed copy over. Let me know if you received it.', time: '10:15 AM', isSystem: false },
    { id: 3, sender: 'Jameson Thorne', text: 'Audit logs checked. Looks complete.', time: '04:30 PM', isSystem: false }
  ],
  4: [
    { id: 1, sender: 'Sarah Jenkins', text: 'Please check the Q4 submission link before closing.', time: '02:15 PM', isSystem: false }
  ],
  7: [
    { id: 1, sender: 'Marcus Sterling', text: 'Hi, I would like to connect and discuss GST auditing guidelines.', time: '11:00 AM', isSystem: false }
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
