import React, { useState, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Button } from '../ui/Button';
import { Save, RefreshCw, Upload, Image as ImageIcon, Gift, Users, Layout, Plus, Trash2 } from 'lucide-react';

export const Dashboard = () => {
  const { content, updateContent, giftCodes, createGiftCode, deleteGiftCode, users, updateUserStatus } = useAdmin();
  const [activeTab, setActiveTab] = useState<'content' | 'users' | 'gifts'>('content');
  
  // Content State - Defensive Initialization
  const [heroForm, setHeroForm] = useState(content?.hero || {});
  const [founderForm, setFounderForm] = useState(content?.founder || {});
  const [categoriesForm, setCategoriesForm] = useState(content?.categories || []);
  
  // Gift State
  const [newCode, setNewCode] = useState('');
  const [newAmount, setNewAmount] = useState(100);

  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <header className="flex items-center justify-between mb-10 sticky top-0 bg-gray-50 pt-4 pb-4 z-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Manage content, users, and rewards</p>
        </div>
        {activeTab === 'content' && (
          <Button onClick={handleSaveContent} className="gap-2 shadow-xl shadow-blue-500/20">
            {isSaved ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaved ? 'Saved!' : 'Save Changes'}
          </Button>
        )}
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-white p-1 rounded-xl border border-gray-200 w-fit">
        <button 
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'content' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <Layout className="w-4 h-4 inline-block mr-2" /> Content Editor
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <Users className="w-4 h-4 inline-block mr-2" /> Users & Credits
        </button>
        <button 
          onClick={() => setActiveTab('gifts')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'gifts' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <Gift className="w-4 h-4 inline-block mr-2" /> Gift Codes
        </button>
      </div>

      <div className="space-y-8">
        
        {/* CONTENT EDITOR TAB */}
        {activeTab === 'content' && (
          <>
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
          </>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">User Management</h2>
              <div className="text-sm text-gray-500">Total Users: {users?.length || 0}</div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-4 pl-4 text-sm font-medium text-gray-500">User</th>
                    <th className="pb-4 text-sm font-medium text-gray-500">Email</th>
                    <th className="pb-4 text-sm font-medium text-gray-500">Tokens</th>
                    <th className="pb-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="pb-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users?.map((user: any) => (
                    <tr key={user.id} className="hover:bg-gray-50/50">
                      <td className="py-4 pl-4 font-medium">{user.name}</td>
                      <td className="py-4 text-gray-500">{user.email}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-bold">
                          {user.tokens} ⚡
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4">
                        {user.status === 'Active' ? (
                          <button 
                            onClick={() => updateUserStatus(user.id, 'Banned')}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Ban User
                          </button>
                        ) : (
                          <button 
                            onClick={() => updateUserStatus(user.id, 'Active')}
                            className="text-xs text-green-600 hover:underline"
                          >
                            Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* GIFT CODES TAB */}
        {activeTab === 'gifts' && (
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
    </div>
  );
};
