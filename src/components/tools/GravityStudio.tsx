import React, { useState, useEffect } from 'react';
import { 
  Terminal, Play, Save, Folder, FileCode, 
  ChevronRight, ChevronDown, RefreshCw, Eye, 
  Settings, Shield, Loader2, Cloud, LogOut
} from 'lucide-react';
import { useTokens } from '../../context/TokenContext';
import { useAuth } from '../../context/AuthContext';
import { supabase, Project } from '../../lib/supabase';
import { streamChat, ChatMessage } from '../../lib/openrouter';
import { Link, useNavigate } from 'react-router-dom';

// --- Types ---
interface VirtualFile {
  name: string;
  content: string;
  language: string;
}

interface FileSystem {
  [path: string]: VirtualFile;
}

// --- Components ---

// 1. File Explorer
const FileExplorer = ({ files, activeFile, onSelectFile }: { 
  files: FileSystem, 
  activeFile: string, 
  onSelectFile: (path: string) => void 
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-64 bg-[#0d0d0d] border-r border-[#1f1f1f] flex flex-col h-full">
      <div className="p-3 border-b border-[#1f1f1f] flex items-center justify-between text-gray-400">
        <span className="text-xs font-bold uppercase tracking-wider">Explorer</span>
        <Folder className="w-4 h-4" />
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-2">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-gray-300 hover:text-white w-full text-left text-sm py-1"
          >
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <span className="font-bold">src</span>
          </button>
          
          {isOpen && (
            <div className="ml-4 mt-1 space-y-0.5">
              {Object.keys(files).map((path) => (
                <button
                  key={path}
                  onClick={() => onSelectFile(path)}
                  className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                    activeFile === path 
                      ? 'bg-[#2d2d2d] text-white' 
                      : 'text-gray-500 hover:text-gray-300 hover:bg-[#1f1f1f]'
                  }`}
                >
                  <FileCode className="w-4 h-4 shrink-0" />
                  <span className="truncate">{path}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 2. Code Editor
const CodeEditor = ({ file, onChange }: { file: VirtualFile, onChange: (val: string) => void }) => {
  return (
    <div className="flex-1 bg-[#0d0d0d] flex flex-col h-full overflow-hidden">
      <div className="h-10 bg-[#0d0d0d] border-b border-[#1f1f1f] flex items-center px-4 text-sm text-gray-400">
        <span className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-blue-400" />
          {file?.name || 'No file selected'}
        </span>
      </div>
      <div className="flex-1 relative overflow-hidden">
        {file ? (
          <textarea
            value={file.content}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full bg-[#0d0d0d] text-gray-300 font-mono text-sm p-4 outline-none resize-none leading-relaxed"
            spellCheck={false}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600 text-sm">Select a file to edit</div>
        )}
      </div>
    </div>
  );
};

// 3. Preview Window
const PreviewWindow = ({ files }: { files: FileSystem }) => {
  const [key, setKey] = useState(0);

  const getSrcDoc = () => {
    const html = files['index.html']?.content || '<h1>No index.html found</h1>';
    const css = files['style.css']?.content || '';
    const js = files['script.js']?.content || '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
          <style>body { margin: 0; font-family: sans-serif; }</style>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          ${html}
          <script>
            document.addEventListener('contextmenu', event => event.preventDefault());
            window.onerror = function(msg) {
              document.body.innerHTML += '<div style="color:red; padding:10px; background:#ffebee;">Error: ' + msg + '</div>';
            }
            ${js}
          </script>
        </body>
      </html>
    `;
  };

  return (
    <div className="flex-1 bg-white flex flex-col h-full overflow-hidden relative">
      <div className="h-10 bg-[#f3f4f6] border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          Live Preview
        </div>
        <button onClick={() => setKey(k => k + 1)} className="p-1 hover:bg-gray-200 rounded">
          <RefreshCw className="w-3 h-3 text-gray-500" />
        </button>
      </div>
      <div className="flex-1 relative bg-white" onContextMenu={(e) => e.preventDefault()}>
        <iframe
          key={key}
          srcDoc={getSrcDoc()}
          className="w-full h-full border-0"
          title="Preview"
          sandbox="allow-scripts allow-modals"
        />
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-50 pointer-events-none flex items-center gap-1">
          <Shield className="w-3 h-3" /> Protected View
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export const GravityStudio = () => {
  const { tokens, deductTokens } = useTokens();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('preview');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [files, setFiles] = useState<FileSystem>({
    'index.html': { name: 'index.html', language: 'html', content: '<div class="flex h-screen items-center justify-center bg-gray-100">\n  <div class="text-center">\n    <h1 class="text-4xl font-bold text-gray-900 mb-4">Gravity Studio</h1>\n    <p class="text-gray-600">Ready to build something amazing?</p>\n  </div>\n</div>' },
    'style.css': { name: 'style.css', language: 'css', content: '' },
    'script.js': { name: 'script.js', language: 'javascript', content: 'console.log("Gravity Studio Initialized");' }
  });
  const [activeFile, setActiveFile] = useState('index.html');
  
  // Project Management State
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showProjects, setShowProjects] = useState(false);

  // Fetch Projects on Load
  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setProjects(data);
  };

  const handleSaveProject = async () => {
    if (!user) {
      navigate('/admin8240152131'); // Redirect to login
      return;
    }
    
    setIsSaving(true);
    try {
      let projectId = currentProject?.id;

      // 1. Create or Update Project
      if (!projectId) {
        // Generate a name based on the first message or default
        const name = messages[0]?.content.slice(0, 30) || 'Untitled Project';
        const { data, error } = await supabase
          .from('projects')
          .insert({ name, user_id: user.id })
          .select()
          .single();
        
        if (error) throw error;
        projectId = data.id;
        setCurrentProject(data);
      }

      // 2. Upsert Files
      const fileUpdates = Object.values(files).map(f => ({
        project_id: projectId,
        path: f.name,
        content: f.content,
        language: f.language
      }));

      // Delete old files first (simple strategy for this demo)
      await supabase.from('project_files').delete().eq('project_id', projectId);
      
      const { error: fileError } = await supabase
        .from('project_files')
        .insert(fileUpdates);

      if (fileError) throw fileError;
      
      await fetchProjects(); // Refresh list
      alert('Project saved successfully!');
    } catch (err: any) {
      console.error('Error saving:', err);
      alert('Failed to save project: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const loadProject = async (project: Project) => {
    try {
      const { data: filesData } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', project.id);

      if (filesData) {
        const newFiles: FileSystem = {};
        filesData.forEach(f => {
          newFiles[f.path] = {
            name: f.path,
            content: f.content,
            language: f.language
          };
        });
        setFiles(newFiles);
        setCurrentProject(project);
        setMessages([]); // Clear chat for new context or load chat history if stored
        setShowProjects(false);
      }
    } catch (err) {
      console.error('Error loading project', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    if (tokens < 10) {
      alert("Insufficient tokens (10 required).");
      return;
    }
    deductTokens(10);

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);
    setActiveTab('preview');

    const systemPrompt: ChatMessage = {
      role: 'system',
      content: `You are Gravity AI, an expert full-stack web developer.
      You MUST generate code for a web application.
      You MUST output the code in a specific JSON format so I can parse it into files.
      
      Format your response EXACTLY like this example (no markdown around the JSON):
      
      {
        "files": [
          { "path": "index.html", "content": "..." },
          { "path": "style.css", "content": "..." },
          { "path": "script.js", "content": "..." }
        ],
        "message": "I have built the login form for you."
      }
      
      Only use index.html, style.css, and script.js.
      Make the UI modern, clean, and beautiful (Tailwind CSS via CDN is allowed in index.html).
      `
    };

    let fullResponse = '';

    await streamChat(
      [systemPrompt, ...messages, userMsg],
      (chunk) => {
        fullResponse += chunk;
      },
      () => {
        setIsStreaming(false);
        try {
          const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            const newFiles = { ...files };
            data.files.forEach((f: any) => {
              newFiles[f.path] = {
                name: f.path,
                language: f.path.endsWith('js') ? 'javascript' : f.path.endsWith('css') ? 'css' : 'html',
                content: f.content
              };
            });
            setFiles(newFiles);
            setMessages(prev => [...prev, { role: 'assistant', content: data.message || "Code generated successfully." }]);
          } else {
            setMessages(prev => [...prev, { role: 'assistant', content: fullResponse }]);
          }
        } catch (e) {
          console.error("Failed to parse AI response", e);
          setMessages(prev => [...prev, { role: 'assistant', content: "I generated code but there was a parsing error. Please try again." }]);
        }
      },
      (err) => {
        console.error(err);
        setIsStreaming(false);
      }
    );
  };

  return (
    <div className="h-screen w-screen bg-black text-white flex overflow-hidden font-sans">
      
      {/* Left Sidebar: Chat */}
      <div className="w-[400px] flex flex-col border-r border-[#1f1f1f] bg-[#0d0d0d]">
        {/* Header */}
        <div className="h-14 border-b border-[#1f1f1f] flex items-center px-4 justify-between">
           <div className="flex items-center gap-3">
             <Link to="/" className="hover:opacity-80 transition-opacity">
               <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black">
                 <Terminal className="w-5 h-5" />
               </div>
             </Link>
             <div>
               <h1 className="font-bold text-sm">Gravity Studio</h1>
               <div className="flex items-center gap-1 text-xs text-gray-500">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> {user ? 'Connected' : 'Guest'}
               </div>
             </div>
           </div>
           
           <button 
             onClick={() => setShowProjects(!showProjects)}
             className="p-2 hover:bg-[#1f1f1f] rounded-lg transition-colors"
             title="My Projects"
           >
             <Folder className="w-5 h-5 text-gray-400" />
           </button>
        </div>

        {/* Project List Overlay */}
        {showProjects && (
          <div className="absolute top-14 left-0 w-[400px] bottom-0 bg-[#0d0d0d] z-20 border-r border-[#1f1f1f] p-4 overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Your Projects</h3>
            {projects.length === 0 ? (
              <div className="text-gray-600 text-sm text-center py-8">No saved projects yet.</div>
            ) : (
              <div className="space-y-2">
                {projects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => loadProject(p)}
                    className="w-full text-left p-3 rounded-xl bg-[#1f1f1f] hover:bg-[#2d2d2d] transition-colors border border-transparent hover:border-gray-700"
                  >
                    <div className="font-bold text-sm text-white mb-1">{p.name}</div>
                    <div className="text-xs text-gray-500">{new Date(p.created_at).toLocaleDateString()}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 && !showProjects && (
            <div className="text-center text-gray-600 mt-10">
              <p className="text-sm">Describe an app to build...</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                {msg.role === 'user' ? 'U' : 'AI'}
              </div>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user' ? 'bg-[#2d2d2d] text-white' : 'bg-transparent text-gray-300'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isStreaming && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shrink-0 animate-pulse">AI</div>
              <div className="text-gray-500 text-sm py-2">Thinking & Coding...</div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#1f1f1f] bg-[#0d0d0d]">
          <form onSubmit={handleSubmit} className="relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the app you want to build..."
              className="w-full bg-[#1f1f1f] text-white rounded-xl pl-4 pr-12 py-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none placeholder-gray-600"
            />
            <button 
              type="submit"
              disabled={isStreaming || !input.trim()}
              className="absolute right-2 top-2 p-1.5 bg-blue-600 rounded-lg text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel: Workspace */}
      <div className="flex-1 flex flex-col bg-[#0d0d0d]">
        {/* Toolbar */}
        <div className="h-10 bg-[#0d0d0d] border-b border-[#1f1f1f] flex items-center justify-between px-4">
          <div className="flex items-center gap-1 bg-[#1f1f1f] p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${
                activeTab === 'preview' ? 'bg-[#2d2d2d] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Eye className="w-3 h-3" /> Preview
            </button>
            <button 
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${
                activeTab === 'code' ? 'bg-[#2d2d2d] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <FileCode className="w-3 h-3" /> Code
            </button>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1f1f1f] border border-[#2d2d2d]">
               <Settings className="w-3 h-3 text-gray-500" />
               <span className="text-xs text-gray-400">Config</span>
             </div>
             <button 
               onClick={handleSaveProject}
               disabled={isSaving}
               className="bg-white text-black px-3 py-1 rounded-md text-xs font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
             >
               {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Cloud className="w-3 h-3" />}
               {isSaving ? 'Saving...' : 'Save'}
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'code' && (
            <>
              <FileExplorer 
                files={files} 
                activeFile={activeFile} 
                onSelectFile={setActiveFile} 
              />
              <CodeEditor 
                file={files[activeFile]} 
                onChange={(val) => setFiles({...files, [activeFile]: {...files[activeFile], content: val}})}
              />
            </>
          )}
          
          {activeTab === 'preview' && (
            <PreviewWindow files={files} />
          )}
        </div>
      </div>
    </div>
  );
};
