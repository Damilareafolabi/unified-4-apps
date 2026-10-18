import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Cpu, 
  Zap, 
  Clock, 
  User, 
  Radio, 
  RotateCcw,
  Flame,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
  audioUrl?: string;
}

interface RedRobotChatVoiceProps {
  onSaveMessage: (msg: ChatMessage) => void;
  userUid: string;
}

export const RedRobotChatVoice: React.FC<RedRobotChatVoiceProps> = ({ onSaveMessage, userUid }) => {
  const [mode, setMode] = useState<'chat' | 'voice'>('chat');
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-4-argon' | 'gemini-3.1-flash-lite'>('gemini-3.8-flash');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'model',
      content: `🔥 **SimeonJr Chatbot Online.**\n\nI am your autonomous growth advisor, CMO, and strategist across the SimeonJr Studios ecosystem (LazyCEO, KeyDirect & Studio Hub).\n\nAsk me to:\n- 🚀 Formulate viral hooks and multi-part contrarian tweet threads\n- 📰 Write AP-standard press releases ready for global wire syndication\n- 🏡 Analyze property pricing, yields, and remote inspection angles for KeyDirect\n- 💼 Draft turnkey freelance gig proposals & client sprint plans\n\nWhat is our top growth objective today?`,
      timestamp: 'Just Now',
      modelUsed: 'gemini-3.8-flash'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message in text chat mode
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          model: selectedModel
        })
      });

      const data = await res.json();
      const modelMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.response || 'Action confirmed. Proceed with next phase.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel
      };

      setMessages((prev) => [...prev, modelMessage]);
      onSaveMessage(modelMessage);

      // Play voice turn if speech audio is enabled
      if (speechEnabled) {
        try {
          const voiceRes = await fetch('/api/voice-turn', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userText: text })
          });
          const voiceData = await voiceRes.json();
          if (voiceData.audioData) {
            const audio = new Audio(voiceData.audioData);
            audio.play().catch(() => {});
          }
        } catch {
          // Non-blocking voice audio
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Live Voice Turn (gemini-3.8-live)
  const handleVoicePush = async () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      setIsLoading(true);
      try {
        const res = await fetch('/api/voice-turn', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userText: 'SimeonJr Chatbot, what is our top autonomous marketing and growth priority today?' })
        });
        const data = await res.json();
        const modelVoiceMsg: ChatMessage = {
          id: `voice-${Date.now()}`,
          role: 'model',
          content: `🎙️ **[Live Voice Session]**: ${data.replyText}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: 'gemini-3.8-live'
        };
        setMessages((prev) => [...prev, modelVoiceMsg]);
        if (data.audioData) {
          const audio = new Audio(data.audioData);
          audio.play().catch(() => {});
        }
      } catch (err) {
        console.error('Voice turn error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header Card */}
      <div className="glass-panel p-5 rounded-2xl border border-red-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 p-0.5 shadow-lg shadow-red-600/30 overflow-hidden flex items-center justify-center">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-white">SimeonJr Chatbot</h1>
              <span className="text-[10px] font-bold text-red-400 bg-red-500/15 px-2 py-0.5 rounded border border-red-500/30 uppercase">
                {mode === 'voice' ? 'Live API (gemini-3.8-live)' : selectedModel}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous AI growth advisor and CMO across the SimeonJr Studios ecosystem.
            </p>
          </div>
        </div>

        {/* Mode Selector & Model Choice */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setMode('chat')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                mode === 'chat' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setMode('voice')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-lg font-bold transition-all ${
                mode === 'voice' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-red-300 animate-pulse" />
              <span>Live Voice</span>
            </button>
          </div>

          {/* Model Switcher for Chat */}
          {mode === 'chat' && (
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash (General Tasks)</option>
              <option value="gemini-4-argon">gemini-4-argon (Complex Strategy)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast Tasks)</option>
            </select>
          )}

          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`p-2 rounded-xl border transition-colors ${
              speechEnabled
                ? 'bg-red-500/20 text-red-400 border-red-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title={speechEnabled ? 'Voice responses active' : 'Voice responses muted'}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* CHAT THREAD VIEW */}
      {mode === 'chat' && (
        <div className="glass-panel rounded-2xl border border-red-950/60 flex flex-col h-[600px] overflow-hidden">
          
          {/* Scrollable Thread */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-lg bg-red-600/30 border border-red-500/40 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                    <img src="/src/assets/images/red_robot_logo_1792157120575.jpg" alt="Robot" className="w-full h-full object-cover" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-red-600 text-white rounded-tr-none'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>{msg.role === 'user' ? 'You' : 'Red Robot CMO'}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div>{msg.content}</div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-xs text-red-400 font-mono animate-pulse">
                <Sparkles className="w-4 h-4 animate-spin text-red-500" />
                <span>The Red Robot is strategizing with {selectedModel}...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="px-5 py-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto text-[11px]">
            <span className="text-slate-500 font-semibold shrink-0">Quick Hooks:</span>
            {[
              'Draft a 5-tweet viral contrarian hook for X',
              'Write an AP press release headline and lead paragraph',
              'Analyze our competitive pricing moat',
              'Plan this week\'s high-authority LinkedIn essay'
            ].map((hook, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(hook)}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1 rounded-full border border-slate-800 whitespace-nowrap transition-colors shrink-0"
              >
                {hook}
              </button>
            ))}
          </div>

          {/* Input Row */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-4 bg-slate-950 border-t border-slate-800/80 flex items-center space-x-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask SimeonJr Chatbot anything about marketing, viral loops, PR, or growth strategy..."
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold p-3 rounded-xl transition-all shadow-md shadow-red-600/30 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* LIVE VOICE ROOM VIEW (gemini-3.8-live) */}
      {mode === 'voice' && (
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border-2 border-red-500/40 text-center space-y-8 bg-gradient-to-b from-slate-900 via-slate-950 to-[#06070a]">
          <div className="max-w-md mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-red-400">
              Real-Time Voice Room (gemini-3.8-live)
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Speak Directly with SimeonJr Chatbot
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Low-latency conversational voice engine. Brainstorm viral campaigns, practice journalist interviews, and receive live verbal growth critiques.
            </p>
          </div>

          {/* Central Pulsing Red Core Visualizer */}
          <div className="flex flex-col items-center justify-center my-6">
            <div className="relative">
              <div className={`w-36 h-36 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 p-1 flex items-center justify-center shadow-2xl ${
                isVoiceActive ? 'animate-pulse ring-8 ring-red-500/30 shadow-red-600/50' : ''
              }`}>
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src="/src/assets/images/red_robot_logo_1792157120575.jpg"
                    alt="Voice Robot"
                    className={`w-28 h-28 object-cover rounded-full ${isVoiceActive ? 'scale-110' : ''} transition-transform duration-500`}
                  />
                </div>
              </div>

              {isVoiceActive && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider animate-bounce">
                  Live Listening
                </div>
              )}
            </div>

            {/* Live Audio Equalizer Waveform */}
            <div className="h-12 flex items-center justify-center gap-1.5 mt-8">
              {[20, 45, 75, 95, 60, 30, 85, 100, 70, 40, 90, 65, 80, 50].map((h, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-200 ${
                    isVoiceActive ? 'bg-red-500 animate-pulse' : 'bg-slate-800'
                  }`}
                  style={{ height: isVoiceActive ? `${h}%` : '20%' }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleVoicePush}
              className={`flex items-center space-x-2 px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl ${
                isVoiceActive
                  ? 'bg-red-600 text-white hover:bg-red-500 shadow-red-600/40 ring-4 ring-red-500/30'
                  : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-600/30'
              }`}
            >
              {isVoiceActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <span>{isVoiceActive ? 'Stop Voice Session' : 'Start Live Voice Session'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
