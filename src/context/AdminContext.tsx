import React, { createContext, useContext, useState, useEffect } from 'react';
import { PenTool, Video, Bot, Mic, Code2, Briefcase, Terminal, Wrench } from 'lucide-react';

// Default Content
const defaultContent = {
  hero: {
    badge: "Gravity AI 2.0 is now live",
    title: "One Platform.\nUnlimited AI Power.",
    subtitle: "Create, automate, analyze, build and grow with the world’s most powerful AI tools – all in one place.",
  },
  founder: {
    name: "Abhinaba Banerjee",
    role: "Founder & CEO",
    bio: "I created Gravity AI because I was tired of juggling 15 different subscriptions to get my work done. We're building the unified operating system for the AI era.",
    image: "https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/111827/ffffff?text=Upload+Your+Photo" 
  },
  categories: [
    { id: 'writing', title: "AI Writing", desc: "Blogs, copy, & scripts", iconKey: 'PenTool' },
    { id: 'video', title: "Image & Video", desc: "Generative media tools", iconKey: 'Video' },
    { id: 'automation', title: "Automation", desc: "Workflows & agents", iconKey: 'Bot' },
    { id: 'voice', title: "Voice & Speech", desc: "TTS & cloning", iconKey: 'Mic' },
    { id: 'coding', title: "Coding Agents", desc: "Debug & generate code", iconKey: 'Code2' },
    { id: 'business', title: "Business", desc: "Analytics & strategy", iconKey: 'Briefcase' },
    { id: 'api', title: "API Access", desc: "For developers", iconKey: 'Terminal' },
    { id: 'builder', title: "Custom Builder", desc: "Build your own agents", iconKey: 'Wrench' },
  ],
  notifications: [
    { id: 1, text: "New GPT-4o model integrated", link: "#" },
    { id: 2, text: "System maintenance scheduled for Sunday", link: "#" }
  ]
};

// Mock Data for Admin Features
const initialGiftCodes = [
  { code: 'WELCOME50', amount: 50, active: true },
  { code: 'GRAVITYPRO', amount: 1000, active: true }
];

const initialUsers = [
  { id: 1, name: "Alice Dev", email: "alice@example.com", tokens: 450, status: "Active" },
  { id: 2, name: "Bob Design", email: "bob@design.co", tokens: 20, status: "Active" },
  { id: 3, name: "Charlie Root", email: "charlie@sys.net", tokens: 0, status: "Banned" }
];

interface AdminContextType {
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  content: typeof defaultContent;
  updateContent: (section: keyof typeof defaultContent, data: any) => void;
  
  // New Admin Features
  giftCodes: typeof initialGiftCodes;
  createGiftCode: (code: string, amount: number) => void;
  deleteGiftCode: (code: string) => void;
  users: typeof initialUsers;
  updateUserStatus: (id: number, status: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [content, setContent] = useState(defaultContent);
  const [giftCodes, setGiftCodes] = useState(initialGiftCodes);
  const [users, setUsers] = useState(initialUsers);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedContent = localStorage.getItem('gravity_content');
    const savedAuth = localStorage.getItem('gravity_auth');
    const savedCodes = localStorage.getItem('gravity_gift_codes');
    
    if (savedContent) setContent(JSON.parse(savedContent));
    if (savedAuth === 'true') setIsAuthenticated(true);
    if (savedCodes) setGiftCodes(JSON.parse(savedCodes));
  }, []);

  const login = (email: string, pass: string) => {
    if (email === 'banerjeeabhinaba7@gmail.com' && pass === 'sarfarosh@1') {
      setIsAuthenticated(true);
      localStorage.setItem('gravity_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('gravity_auth');
  };

  const updateContent = (section: keyof typeof defaultContent, data: any) => {
    const newContent = { ...content, [section]: data };
    // If section is 'hero' or 'founder', we merge. If it's 'categories', we replace (array).
    if (section === 'hero' || section === 'founder') {
       newContent[section] = { ...content[section], ...data };
    }
    
    setContent(newContent);
    localStorage.setItem('gravity_content', JSON.stringify(newContent));
  };

  // Gift Code Management
  const createGiftCode = (code: string, amount: number) => {
    const newCodes = [...giftCodes, { code, amount, active: true }];
    setGiftCodes(newCodes);
    localStorage.setItem('gravity_gift_codes', JSON.stringify(newCodes));
  };

  const deleteGiftCode = (code: string) => {
    const newCodes = giftCodes.filter(c => c.code !== code);
    setGiftCodes(newCodes);
    localStorage.setItem('gravity_gift_codes', JSON.stringify(newCodes));
  };

  // User Management
  const updateUserStatus = (id: number, status: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status } : u));
  };

  return (
    <AdminContext.Provider value={{ 
      isAuthenticated, login, logout, content, updateContent,
      giftCodes, createGiftCode, deleteGiftCode,
      users, updateUserStatus
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};
