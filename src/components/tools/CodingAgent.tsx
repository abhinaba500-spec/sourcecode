import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, StopCircle, Sparkles, Code2, Terminal, Zap, Copy, Check, History, Gift, Download, Trash, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useTokens } from '../../context/TokenContext';
import { streamChat, ChatMessage } from '../../lib/openrouter';
import { Button } from '../ui/Button';

// Simple code block component with copy functionality
const CodeBlock = ({ children, className }: { children: any, className?: string }) => {
  const [copied, setCopied] = useState(false);
  const language = className ? className.replace('language-', '') : 'text';

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden my-4 border border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
        <span className="text-xs font-mono text-gray-500 uppercase">{language}</span>
        <button 
          onClick={handleCopy}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-gray-500" />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
        <code className={className}>{children}</code>
      </div>
    </div>
  );
};

export const CodingAgent = () => {
  const { tokens, deductTokens, redeemCode, referralCode } = useTokens();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftCodeInput, setGiftCodeInput] = useState('');
  const [giftMessage, setGiftMessage] = useState<{text: string, success: boolean} | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isStreaming) return;

    // Token Check
    const COST_PER_QUERY = 5;
    if (tokens < COST_PER_QUERY) {
      alert("Insufficient tokens! Please redeem a gift code.");
      setShowGiftModal(true);
      return;
    }

    if (!deductTokens(COST_PER_QUERY)) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);
    setCurrentResponse('');

    await streamChat(
      [...messages, userMsg],
      (chunk) => setCurrentResponse(prev => prev + chunk),
      () => {
        setIsStreaming(false);
        setMessages(prev => [...prev, { role: 'assistant', content: currentResponse }]);
        setCurrentResponse(''); // Clear buffer as it's now in messages
      },
      (err) => {
        console.error(err);
        setIsStreaming(false);
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error processing your request." }]);
      }
    );
  };

  // Handle Enter key to submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleRedeem = () => {
    const result = redeemCode(giftCodeInput);
    setGiftMessage({ text: result.message, success: result.success });
    if (result.success) {
      setTimeout(() => {
        setShowGiftModal(false);
        setGiftMessage(null);
        setGiftCodeInput('');
      }, 1500);
    }
  };

  const handleExport = () => {
    const content = messages.map(m => `[${m.role.toUpperCase()}]\n${m.content}\n\n`).join('');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gravity-chat-${new Date().toISOString()}.txt`;
    a.click();
  };

  const quickPrompts = [
    "Create a React Login Form",
    "Explain Python Decorators",
    "Debug this JSON object",
    "Write a SQL query for users"
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 bg-white/80 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setShowSidebar(!showSidebar)} className="lg:hidden">
            <History className="w-4 h-4" />
          </Button>
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="font-bold text-gray-900 hidden sm:inline">Gravity Coder Pro</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowGiftModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors text-sm font-medium"
          >
            <Gift className="w-4 h-4" /> Redeem
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200">
            <Zap className="w-3 h-3 fill-yellow-400 text-yellow-500" />
            <span className="text-sm font-bold text-gray-900">{tokens}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.aside 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden lg:flex flex-col border-r border-gray-100 bg-gray-50/50 h-full"
            >
              <div className="p-4">
                <Button onClick={() => setMessages([])} variant="outline" className="w-full justify-start gap-2 text-sm">
                  <PlusIcon className="w-4 h-4" /> New Chat
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 pt-0">
                <div className="text-xs font-bold text-gray-400 uppercase mb-3">Your Stats</div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6">
                   <div className="text-sm text-gray-500 mb-1">Referral Code</div>
                   <div className="font-mono font-bold text-lg tracking-wider text-black flex items-center justify-between">
                     {referralCode}
                     <Copy className="w-3 h-3 text-gray-400 cursor-pointer hover:text-black" onClick={() => navigator.clipboard.writeText(referralCode)} />
                   </div>
                   <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
                     <Share2 className="w-3 h-3" /> Share to earn 50 tokens
                   </div>
                </div>

                <div className="text-xs font-bold text-gray-400 uppercase mb-3">History</div>
                <div className="text-sm text-gray-500 text-center py-4 italic">
                  No previous chats saved.
                </div>
              </div>

              <div className="p-4 border-t border-gray-100">
                <Button variant="ghost" onClick={handleExport} className="w-full justify-start gap-2 text-sm text-gray-500">
                  <Download className="w-4 h-4" /> Export Chat
                </Button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col relative">
          <div className="flex-1 overflow-y-auto p-6 pb-32">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-100 max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mb-8 shadow-sm">
                  <Code2 className="w-10 h-10 text-black" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Gravity Coder Pro</h2>
                <p className="text-gray-500 mb-10 text-lg">
                  Your AI pair programmer. Debug, refactor, and build faster.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {quickPrompts.map((prompt, i) => (
                    <button 
                      key={i}
                      onClick={() => setInput(prompt)}
                      className="p-4 rounded-xl border border-gray-200 hover:border-black hover:bg-gray-50 transition-all text-left text-sm font-medium text-gray-700"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-8 max-w-3xl mx-auto">
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[90%] rounded-2xl px-6 py-4 ${
                    msg.role === 'user' 
                      ? 'bg-gray-100 text-gray-900 rounded-tr-sm' 
                      : 'bg-white border border-gray-100 shadow-sm rounded-tl-sm'
                  }`}>
                    <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent">
                      <ReactMarkdown 
                        components={{
                          code: ({node, className, children, ...props}) => {
                            const match = /language-(\w+)/.exec(className || '')
                            return match ? (
                              <CodeBlock className={className}>{children}</CodeBlock>
                            ) : (
                              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-red-500" {...props}>
                                {children}
                              </code>
                            )
                          }
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Streaming Response */}
              {isStreaming && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4 justify-start"
                >
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0 mt-1 animate-pulse">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="max-w-[90%] bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-6 py-4">
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown 
                        components={{
                          code: ({node, className, children, ...props}) => {
                            const match = /language-(\w+)/.exec(className || '')
                            return match ? (
                              <CodeBlock className={className}>{children}</CodeBlock>
                            ) : (
                              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-red-500" {...props}>
                                {children}
                              </code>
                            )
                          }
                        }}
                      >
                        {currentResponse + " ▍"}
                      </ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-6">
            <div className="max-w-3xl mx-auto relative">
              <form onSubmit={handleSubmit} className="relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Gravity Coder to build something..."
                  className="w-full bg-white border border-gray-200 rounded-2xl pl-6 pr-16 py-4 shadow-lg shadow-gray-100/50 focus:ring-2 focus:ring-black/5 focus:border-black outline-none resize-none min-h-[60px] max-h-[200px]"
                  rows={1}
                  style={{ height: 'auto', minHeight: '60px' }}
                />
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                   {messages.length > 0 && (
                     <Button 
                       type="button" 
                       variant="ghost" 
                       size="sm" 
                       onClick={() => setMessages([])}
                       className="h-10 w-10 p-0 rounded-xl text-gray-400 hover:text-red-500"
                       title="Clear Chat"
                     >
                       <Trash className="w-4 h-4" />
                     </Button>
                   )}
                   <Button 
                    type="submit" 
                    disabled={!input.trim() || isStreaming}
                    size="sm"
                    className={`w-10 h-10 p-0 rounded-xl flex items-center justify-center transition-all ${
                      input.trim() ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isStreaming ? <StopCircle className="w-5 h-5 animate-pulse" /> : <Send className="w-5 h-5" />}
                  </Button>
                </div>
              </form>
              <div className="text-center mt-3 text-xs text-gray-400">
                Gravity Coder can make mistakes. Review generated code. • 5 Tokens / Request
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Gift Code Modal */}
      <AnimatePresence>
        {showGiftModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative"
            >
              <button 
                onClick={() => setShowGiftModal(false)} 
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
              >
                <Trash className="w-4 h-4 rotate-45" /> {/* Using Trash as X icon substitute or just import X */}
              </button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-pink-600">
                  <Gift className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Redeem Tokens</h3>
                <p className="text-gray-500">Enter your gift code to top up your balance.</p>
              </div>

              <div className="space-y-4">
                <input 
                  value={giftCodeInput}
                  onChange={(e) => setGiftCodeInput(e.target.value.toUpperCase())}
                  placeholder="ENTER CODE"
                  className="w-full p-4 text-center text-xl font-mono font-bold tracking-widest rounded-xl border border-gray-200 focus:border-black outline-none uppercase"
                />
                
                {giftMessage && (
                  <div className={`p-3 rounded-lg text-sm font-medium text-center ${
                    giftMessage.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {giftMessage.text}
                  </div>
                )}

                <Button onClick={handleRedeem} className="w-full justify-center py-4 text-lg">
                  Redeem Code
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);
