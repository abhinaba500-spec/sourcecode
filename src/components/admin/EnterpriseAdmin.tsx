import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, CreditCard, Activity, Shield, Settings, 
  Search, MoreHorizontal, Download, Filter, 
  CheckCircle, XCircle, AlertTriangle, Bell, Lock, Loader2,
  Layout, Gift, Save, Upload, Image as ImageIcon, Plus, Trash2, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { supabase, Profile } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

// Mock Usage Data
const usageData = [
  { name: 'Mon', tokens: 4000, cost: 240 },
  { name: 'Tue', tokens: 3000, cost: 139 },
  { name: 'Wed', tokens: 2000, cost: 980 },
  { name: 'Thu', tokens: 2780, cost: 390 },
  { name: 'Fri', tokens: 1890, cost: 480 },
  { name: 'Sat', tokens: 2390, cost: 380 },
  { name: 'Sun', tokens: 3490, cost: 430 },
];

export const EnterpriseAdmin = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const { signOut } = useAuth();
  
  // --- Supabase Data State ---
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Local CMS State (from AdminContext) ---
  const { content, updateContent, giftCodes, createGiftCode, deleteGiftCode } = useAdmin();
  
  // Defensive init for forms
  const [heroForm, setHeroForm] = useState(content?.hero || {});
  const [founderForm, setFounderForm] = useState(content?.founder || {});
  const [categoriesForm, setCategoriesForm] = useState(content?.categories || []);
  
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Gift Code State
  const [newCode, setNewCode] = useState('');
  const [newAmount, setNewAmount] = useState(100);

  // --- Effects ---
  useEffect(() => {
    fetchProfiles();
  }, []);

  // --- Supabase Actions ---
  const fetchProfiles = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProfiles(data);
    if (error) console.error('Error fetching profiles:', error);
    setIsLoading(false);
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);
    
    if (!error) {
      fetchProfiles();
    } else {
      alert('Failed to update role');
    }
  };

  // --- CMS Actions ---
  const handleSaveContent = () => {
    updateContent('hero', heroForm);
    updateContent('founder', founderForm);
    updateContent('categories', categoriesForm);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFounderForm({ ...founderForm, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (idx: number, field: string, value: string) => {
    const newCats = [...categoriesForm];
    newCats[idx] = { ...newCats[idx], [field]: value };
    setCategoriesForm(newCats);
  };

  const handleCreateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCode && newAmount > 0) {
      createGiftCode(newCode, newAmount);
      setNewCode('');
    }
  };

  // --- UI Components ---
  const SidebarItem = ({ id, icon: Icon, label }: any) => (
    <button 
      onClick={() => setActiveSection(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        activeSection === id 
          ? 'bg-black text-white shadow-lg shadow-black/20' 
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">Gravity Admin</span>
          </div>
          <div className="text-xs text-gray-500 px-1">Enterprise Edition</div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-xs font-bold text-gray-400 uppercase px-4 py-2 mt-2">Core</div>
          <SidebarItem id="overview" icon={Activity} label="Overview" />
          <SidebarItem id="users" icon={Users} label="User Management" />
          <SidebarItem id="billing" icon={CreditCard} label="Billing & Plans" />
          
          <div className="text-xs font-bold text-gray-400 uppercase px-4 py-2 mt-4">CMS & Rewards</div>
          <SidebarItem id="content" icon={Layout} label="Website Content" />
          <SidebarItem id="gifts" icon={Gift} label="Gift Codes" />
          
          <div className="text-xs font-bold text-gray-400 uppercase px-4 py-2 mt-4">Security</div>
          <SidebarItem id="audit" icon={Lock} label="Audit Logs" />
          
          <div className="text-xs font-bold text-gray-400 uppercase px-4 py-2 mt-4">System</div>
          <SidebarItem id="settings" icon={Settings} label="Settings" />
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-gray-200" />
            <div className="flex-1">
              <div className="text-sm font-bold text-gray-900">Admin</div>
              <div className="text-xs text-gray-500">Super Admin</div>
            </div>
            <button onClick={signOut} className="text-gray-400 hover:text-red-500">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeSection.replace('-', ' ')}</h1>
          
          <div className="flex items-center gap-4">
            {activeSection === 'content' && (
              <Button onClick={handleSaveContent} className="gap-2 shadow-xl shadow-blue-500/20" size="sm">
                {isSaved ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaved ? 'Saved!' : 'Save Changes'}
              </Button>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 rounded-full bg-gray-100 border-transparent focus:bg-white focus:border-gray-300 focus:ring-0 text-sm w-64 transition-all"
              />
            </div>
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          
          {/* --- OVERVIEW --- */}
          {activeSection === 'overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Revenue', val: '$124,500', change: '+12%', color: 'text-green-600' },
                  { label: 'Active Users', val: profiles.length.toString(), change: '+5%', color: 'text-blue-600' },
                  { label: 'Token Usage', val: '45.2M', change: '+24%', color: 'text-purple-600' },
                  { label: 'Server Load', val: '34%', change: '-2%', color: 'text-gray-600' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.val}</div>
                    <div className={`text-xs font-medium ${stat.color} flex items-center gap-1`}>
                      <Activity className="w-3 h-3" /> {stat.change} from last month
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-6">Token Consumption Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={usageData}>
                        <defs>
                          <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                        <Tooltip />
                        <Area type="monotone" dataKey="tokens" stroke="#8884d8" fillOpacity={1} fill="url(#colorTokens)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* --- USER MANAGEMENT --- */}
          {activeSection === 'users' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg">All Users</h3>
                <div className="flex gap-3">
                  <Button onClick={fetchProfiles} variant="outline" size="sm" className="gap-2">
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
                  </Button>
                </div>
              </div>
              
              {isLoading ? (
                <div className="p-12 flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Plan</th>
                      <th className="px-6 py-4">Joined</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {profiles.map((profile) => (
                      <tr key={profile.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs">
                              {(profile.full_name || profile.email || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{profile.full_name || 'User'}</div>
                              <div className="text-xs text-gray-500">{profile.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                            profile.role === 'admin' || profile.role === 'owner' 
                              ? 'bg-purple-50 text-purple-700 border-purple-100' 
                              : 'bg-gray-50 text-gray-600 border-gray-200'
                          }`}>
                            {profile.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                            {profile.plan_tier}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                             {profile.role !== 'admin' && (
                               <button 
                                 onClick={() => handleUpdateRole(profile.id, 'admin')}
                                 className="text-xs text-blue-600 hover:underline"
                               >
                                 Make Admin
                               </button>
                             )}
                             <button className="text-gray-400 hover:text-black">
                               <MoreHorizontal className="w-5 h-5" />
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* --- CONTENT EDITOR --- */}
          {activeSection === 'content' && (
            <div className="space-y-8">
              {/* Founder Section Editor */}
              <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                      <ImageIcon className="w-5 h-5" />
                   </div>
                   <h2 className="text-xl font-bold">Founder Profile</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Image Uploader */}
                  <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Profile Photo</label>
                      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                          <div className="aspect-square rounded-full overflow-hidden border-4 border-gray-100 group-hover:border-purple-100 transition-colors bg-gray-50 relative">
                              {founderForm.image ? (
                                  <img src={founderForm.image} alt="Preview" className="w-full h-full object-cover" />
                              ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                                      <ImageIcon className="w-12 h-12" />
                                  </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                  <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                      <Upload className="w-3 h-3" /> Change
                                  </div>
                              </div>
                          </div>
                          <input 
                              ref={fileInputRef}
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleImageUpload}
                          />
                      </div>
                  </div>

                  {/* Text Fields */}
                  <div className="col-span-1 md:col-span-2 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input 
                          value={founderForm.name || ''}
                          onChange={(e) => setFounderForm({...founderForm, name: e.target.value})}
                          className="w-full p-3 rounded-xl border border-gray-200 focus:border-black outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <input 
                          value={founderForm.role || ''}
                          onChange={(e) => setFounderForm({...founderForm, role: e.target.value})}
                          className="w-full p-3 rounded-xl border border-gray-200 focus:border-black outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea 
                        value={founderForm.bio || ''}
                        onChange={(e) => setFounderForm({...founderForm, bio: e.target.value})}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-black outline-none h-32 resize-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Hero Section Editor */}
              <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold mb-6">Hero Text</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
                    <input 
                      value={heroForm.badge || ''}
                      onChange={(e) => setHeroForm({...heroForm, badge: e.target.value})}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:border-black outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Main Title</label>
                    <textarea 
                      value={heroForm.title || ''}
                      onChange={(e) => setHeroForm({...heroForm, title: e.target.value})}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:border-black outline-none h-24"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                    <textarea 
                      value={heroForm.subtitle || ''}
                      onChange={(e) => setHeroForm({...heroForm, subtitle: e.target.value})}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:border-black outline-none h-24"
                    />
                  </div>
                </div>
              </section>
              
              {/* Categories Editor */}
              <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <Layout className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">Power Grid Categories</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categoriesForm?.map((cat: any, idx: number) => (
                    <div key={cat.id || idx} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                      <div className="text-xs font-bold text-gray-400 uppercase mb-2">Category {idx + 1}</div>
                      <div className="space-y-3">
                        <input 
                          value={cat.title || ''}
                          onChange={(e) => handleCategoryChange(idx, 'title', e.target.value)}
                          className="w-full p-2 rounded-lg border border-gray-200 text-sm font-bold"
                          placeholder="Title"
                        />
                        <input 
                          value={cat.desc || ''}
                          onChange={(e) => handleCategoryChange(idx, 'desc', e.target.value)}
                          className="w-full p-2 rounded-lg border border-gray-200 text-sm text-gray-600"
                          placeholder="Description"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* --- GIFT CODES --- */}
          {activeSection === 'gifts' && (
            <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Gift Codes</h2>
                  <p className="text-sm text-gray-500">Create codes for users to redeem tokens</p>
                </div>
              </div>

              {/* Create New Code */}
              <form onSubmit={handleCreateCode} className="flex gap-4 mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <input 
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="Code (e.g. SUMMER2025)"
                  className="flex-1 p-3 rounded-xl border border-gray-200 focus:border-black outline-none font-mono uppercase"
                />
                <input 
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(parseInt(e.target.value))}
                  placeholder="Amount"
                  className="w-32 p-3 rounded-xl border border-gray-200 focus:border-black outline-none"
                />
                <Button type="submit" className="whitespace-nowrap">
                  <Plus className="w-4 h-4" /> Create
                </Button>
              </form>

              {/* List Codes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {giftCodes?.map((code: any) => (
                  <div key={code.code} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all">
                    <div>
                      <div className="font-mono font-bold text-lg tracking-wide">{code.code}</div>
                      <div className="text-sm text-gray-500">{code.amount} Tokens</div>
                    </div>
                    <button 
                      onClick={() => deleteGiftCode(code.code)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
};
