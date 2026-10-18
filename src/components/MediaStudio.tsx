import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Music, 
  Video, 
  Mic, 
  MicOff, 
  Upload, 
  Play, 
  Pause, 
  Download, 
  Send, 
  RefreshCw, 
  Copy, 
  CheckCircle2, 
  Layers, 
  Sliders, 
  Bot, 
  Film, 
  Volume2, 
  FileAudio,
  Radio,
  Flame,
  Wand2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MediaStudioProps {
  onSaveToMedia: (asset: any) => void;
  userUid: string;
}

export const MediaStudio: React.FC<MediaStudioProps> = ({ onSaveToMedia, userUid }) => {
  const [activeTab, setActiveTab] = useState<'images' | 'music' | 'video' | 'transcribe'>('images');

  // --- Image Studio State ---
  const [imagePrompt, setImagePrompt] = useState('A sleek modern red robot standing triumphantly atop a high-tech corporate skyscraper overlooking a glowing cybernetic metropolis, cinematic lighting, 8k render');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('1:1');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>('/src/assets/images/red_robot_mascot_1792157107008.jpg');
  const [editPrompt, setEditPrompt] = useState('Add glowing scarlet neon wings and cinematic lens flare');
  const [isEditingImage, setIsEditingImage] = useState(false);

  // --- Music Studio State ---
  const [musicPrompt, setMusicPrompt] = useState('A high-energy cybernetic electronic track with driving bass and triumphant synth lead for a viral startup commercial');
  const [musicDuration, setMusicDuration] = useState<'15s' | '30s' | '60s'>('30s');
  const [musicModel, setMusicModel] = useState<'lyria-3-clip-preview' | 'lyria-3-pro-preview'>('lyria-3-clip-preview');
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [musicResult, setMusicResult] = useState<{ title: string; lyrics: string; genre?: string; audioData?: string } | null>({
    title: 'The Red Robot Anthem (30s Viral Hook)',
    genre: 'Cyberpunk Electronic / High-Energy Tech',
    lyrics: `[Intro: Cyber Synth Lead]\nAutonomous 365, the red robot never sleeps\nPulling founders to the top, scaling into the deep\nZero ad spend, viral reach, global publicity on repeat\n[Drop]\nLazyCEO! The future of business growth.`
  });

  // --- Video Studio State ---
  const [videoPrompt, setVideoPrompt] = useState('The Red Robot pulling business executives across a glowing neon grid towards exponential growth, dynamic camera pan forward, 4k');
  const [videoAspect, setVideoAspect] = useState<'16:9' | '9:16'>('16:9');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoResult, setVideoResult] = useState<{ url: string; prompt: string; aspect: string } | null>({
    url: '/src/assets/images/red_robot_mascot_1792157107008.jpg',
    prompt: 'The Red Robot pulling business executives across a glowing neon grid towards exponential growth',
    aspect: '16:9'
  });

  // --- Audio Transcription State ---
  const [isRecording, setIsRecording] = useState(false);
  const [audioTranscript, setAudioTranscript] = useState<string | null>(
    'Transcript summary: Our Q4 marketing directive is to shift 100% of our PR to autonomous wire syndication. We will target 450 newsrooms on Month 1, launch a 3-part contrarian hook on X daily, and establish a weekly LinkedIn Pulse manifesto.'
  );
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 1. Generate Image Handler (gemini-nano-banana-2.1)
  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePrompt) return;
    setIsGeneratingImage(true);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt, aspectRatio })
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        onSaveToMedia({
          id: `img-${Date.now()}`,
          type: 'image',
          title: imagePrompt,
          url: data.imageUrl,
          model: 'gemini-nano-banana-2.1',
          createdAt: new Date().toISOString()
        });
        confetti({ particleCount: 30, colors: ['#ef4444', '#f87171'] });
      }
    } catch (err) {
      console.error('Image gen error:', err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // 2. Edit Image Handler (gemini-nano-banana-2.1)
  const handleEditImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPrompt) return;
    setIsEditingImage(true);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: editPrompt, editBase64: generatedImage })
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        confetti({ particleCount: 40, colors: ['#ef4444', '#dc2626'] });
      }
    } catch (err) {
      console.error('Image edit error:', err);
    } finally {
      setIsEditingImage(false);
    }
  };

  // 3. Generate Music Handler (lyria-3-clip-preview / lyria-3-pro-preview)
  const handleGenerateMusic = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingMusic(true);
    try {
      const res = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: musicPrompt, duration: musicDuration, model: musicModel })
      });
      const data = await res.json();
      if (data.success) {
        setMusicResult(data);
        onSaveToMedia({
          id: `music-${Date.now()}`,
          type: 'music',
          title: data.title || musicPrompt,
          url: data.audioData || '',
          model: musicModel,
          createdAt: new Date().toISOString()
        });
        confetti({ particleCount: 35, colors: ['#ef4444', '#fb7185'] });
      }
    } catch (err) {
      console.error('Music gen error:', err);
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  // 4. Generate Video Handler (veo-3.1-fast-generate-preview)
  const handleGenerateVideo = async (e: React.FormEvent, animateExistingImage: boolean = false) => {
    e.preventDefault();
    setIsGeneratingVideo(true);
    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt,
          imageBase64: animateExistingImage ? generatedImage : null,
          aspectRatio: videoAspect
        })
      });
      const data = await res.json();
      if (data.success) {
        setVideoResult({
          url: data.videoUrl || generatedImage,
          prompt: videoPrompt,
          aspect: videoAspect
        });
        onSaveToMedia({
          id: `vid-${Date.now()}`,
          type: 'video',
          title: videoPrompt,
          url: data.videoUrl || generatedImage,
          model: 'veo-3.1-fast-generate-preview',
          createdAt: new Date().toISOString()
        });
        confetti({ particleCount: 40, colors: ['#ef4444', '#f87171'] });
      }
    } catch (err) {
      console.error('Video gen error:', err);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  // 5. Microphone Audio Recording & Transcribe (gemini-3.5-transcribe)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          setIsTranscribing(true);
          try {
            const res = await fetch('/api/transcribe-audio', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioBase64: base64Audio, mimeType: 'audio/webm' })
            });
            const data = await res.json();
            if (data.transcript) {
              setAudioTranscript(data.transcript);
              onSaveToMedia({
                id: `trans-${Date.now()}`,
                type: 'transcript',
                title: 'Voice Recording Transcription',
                url: data.transcript,
                model: 'gemini-3.5-transcribe',
                createdAt: new Date().toISOString()
              });
              confetti({ particleCount: 30 });
            }
          } catch (err) {
            console.error('Transcription error:', err);
          } finally {
            setIsTranscribing(false);
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone error:', err);
      alert('Could not access microphone. Please ensure microphone permissions are granted.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Wand2 className="w-5 h-5 text-red-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Multimodal AI Media Studio
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Produce marketing creatives: Image Generation & Editing, Music & Sound, Video Ads, and Microphone Transcription.
          </p>
        </div>

        {/* Studio Sub-Tabs */}
        <div className="flex items-center space-x-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('images')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'images' ? 'bg-red-600 text-white shadow-md shadow-red-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Images (Nano Banana)</span>
          </button>

          <button
            onClick={() => setActiveTab('music')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'music' ? 'bg-red-600 text-white shadow-md shadow-red-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Music (Lyria)</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'video' ? 'bg-red-600 text-white shadow-md shadow-red-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Video (Veo)</span>
          </button>

          <button
            onClick={() => setActiveTab('transcribe')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'transcribe' ? 'bg-red-600 text-white shadow-md shadow-red-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Transcribe (3.5)</span>
          </button>
        </div>
      </div>

      {/* 1. IMAGE STUDIO TAB */}
      {activeTab === 'images' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Controls Left */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Create Image Card */}
            <div className="glass-panel p-6 rounded-2xl border border-red-950/60 bg-slate-900/40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Create Image (gemini-nano-banana-2.1)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">1K / 2K Resolution</span>
              </div>

              <form onSubmit={handleGenerateImage} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Text Prompt for Creative Marketing Asset
                  </label>
                  <textarea
                    rows={3}
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500 font-sans"
                    placeholder="Describe the image you want to generate..."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Aspect Ratio</label>
                    <div className="flex space-x-1.5">
                      {(['1:1', '16:9', '9:16'] as const).map((ratio) => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => setAspectRatio(ratio)}
                          className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                            aspectRatio === ratio
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isGeneratingImage}
                    className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-red-600/30 disabled:opacity-50"
                  >
                    <Sparkles className={`w-4 h-4 ${isGeneratingImage ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingImage ? 'Generating...' : 'Create Image'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Edit Image Card */}
            <div className="glass-panel p-6 rounded-2xl border border-red-950/60 bg-slate-900/40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
                  <Wand2 className="w-4 h-4" />
                  <span>Edit Active Image (gemini-nano-banana-2.1)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">In-Painting & Style Transfer</span>
              </div>

              <form onSubmit={handleEditImage} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Edit Instructions
                  </label>
                  <input
                    type="text"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                    placeholder="e.g. Add glowing red neon aura, add bold futuristic text..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isEditingImage}
                    className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all border border-slate-700 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isEditingImage ? 'animate-spin text-red-400' : ''}`} />
                    <span>{isEditingImage ? 'Editing Image...' : 'Apply Image Edit'}</span>
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Preview Right */}
          <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-red-500/30 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Generated Image Preview</span>
              <a
                href={generatedImage}
                download="lazyceo_asset.jpg"
                className="flex items-center space-x-1 text-red-400 hover:text-red-300 text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Asset</span>
              </a>
            </div>

            <div className="w-full max-h-[460px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center relative group">
              <img
                src={generatedImage}
                alt="Generated Marketing Asset"
                className="w-full h-auto object-contain max-h-[450px]"
              />
              <div className="absolute bottom-3 left-3 bg-slate-950/80 px-2.5 py-1 rounded text-[11px] text-white font-mono border border-slate-800">
                Model: gemini-nano-banana-2.1
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. MUSIC STUDIO TAB (Lyria) */}
      {activeTab === 'music' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-red-950/60 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center space-x-1.5">
                <Music className="w-4 h-4" />
                <span>Music Generation (Lyria Clip & Pro)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">30s Clips / Full Tracks</span>
            </div>

            <form onSubmit={handleGenerateMusic} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Music Description / Audio Hook Prompt
                </label>
                <textarea
                  rows={3}
                  value={musicPrompt}
                  onChange={(e) => setMusicPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500 font-sans"
                  placeholder="e.g. 30-second futuristic synthwave commercial track with deep bass..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Model Choice</label>
                  <select
                    value={musicModel}
                    onChange={(e) => setMusicModel(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="lyria-3-clip-preview">Lyria Clip (Up to 30s)</option>
                    <option value="lyria-3-pro-preview">Lyria Pro (Full Tracks)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Duration</label>
                  <select
                    value={musicDuration}
                    onChange={(e) => setMusicDuration(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="15s">15 Seconds (Story / Reel)</option>
                    <option value="30s">30 Seconds (Ad / TikTok)</option>
                    <option value="60s">60 Seconds (Podcast Intro)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGeneratingMusic}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md shadow-red-600/30 disabled:opacity-50"
              >
                <Music className={`w-4 h-4 ${isGeneratingMusic ? 'animate-spin' : ''}`} />
                <span>{isGeneratingMusic ? 'Synthesizing Track...' : 'Generate Brand Audio Clip'}</span>
              </button>
            </form>
          </div>

          {/* Music Result Card */}
          <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-red-500/30 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-red-500" />
              <span>{musicResult?.title || 'Synthesized Brand Anthem'}</span>
            </h3>

            {/* Audio Wave Visualizer Simulation */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Model: {musicModel}</span>
                <span className="text-red-400 font-bold">24kHz Stereo</span>
              </div>

              {/* Animated Waveform Bars */}
              <div className="h-16 flex items-center justify-between gap-1 py-2">
                {[40, 65, 30, 85, 95, 45, 70, 100, 80, 50, 90, 60, 75, 40, 85, 95, 60, 45, 80, 100, 70, 50, 90].map((h, i) => (
                  <div
                    key={i}
                    className="w-2 bg-gradient-to-t from-red-600 to-rose-400 rounded-full transition-all duration-300"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                <span className="text-slate-400">{musicResult?.genre || 'Electronic Tech'}</span>
                <span className="text-emerald-400 font-mono font-bold">Ready for Social Ads</span>
              </div>
            </div>

            {musicResult?.lyrics && (
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed">
                {musicResult.lyrics}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. VIDEO STUDIO TAB (Veo 3.1) */}
      {activeTab === 'video' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-red-950/60 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center space-x-1.5">
                <Film className="w-4 h-4" />
                <span>Video Generation (veo-3.1-fast-generate-preview)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">16:9 Landscape & 9:16 Portrait</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Video Motion Prompt
                </label>
                <textarea
                  rows={3}
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500 font-sans"
                  placeholder="Describe the action and camera motion..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Aspect Ratio (Landscape or Portrait)</label>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setVideoAspect('16:9')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                      videoAspect === '16:9'
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    16:9 Landscape (YouTube / Web)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoAspect('9:16')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                      videoAspect === '9:16'
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    9:16 Portrait (TikTok / Reels)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={(e) => handleGenerateVideo(e, false)}
                  disabled={isGeneratingVideo}
                  className="flex items-center justify-center space-x-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md shadow-red-600/30 disabled:opacity-50"
                >
                  <Film className={`w-4 h-4 ${isGeneratingVideo ? 'animate-spin' : ''}`} />
                  <span>Text to Video</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleGenerateVideo(e, true)}
                  disabled={isGeneratingVideo}
                  className="flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-xs transition-all border border-slate-700 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  <span>Animate Image</span>
                </button>
              </div>
            </div>
          </div>

          {/* Video Preview */}
          <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-red-500/30 space-y-3 flex flex-col items-center">
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Veo Video Canvas</span>
              <span className="text-xs text-red-400 font-mono font-semibold">{videoAspect} Render</span>
            </div>

            <div className={`w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center relative ${
              videoAspect === '9:16' ? 'max-w-[280px] aspect-[9/16]' : 'aspect-video'
            }`}>
              <img
                src={videoResult?.url || generatedImage}
                alt="Veo Video"
                className="w-full h-full object-cover animate-pulse"
              />
              <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center text-white shadow-xl">
                  <Play className="w-5 h-5 ml-0.5 fill-current" />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-white font-mono">
                Model: veo-3.1-fast-generate-preview
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. AUDIO TRANSCRIBER TAB (gemini-3.5-transcribe) */}
      {activeTab === 'transcribe' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-red-950/60 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center space-x-1.5">
                <Mic className="w-4 h-4" />
                <span>Microphone Transcription (gemini-3.5-transcribe)</span>
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Record spoken thoughts, founder brainstorming, or customer interviews. Gemini 3.5 Transcribe converts it into clean text and extracts viral publicity angles.
            </p>

            <div className="pt-2 flex flex-col items-center justify-center p-6 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse ring-8 ring-red-600/30'
                    : 'bg-slate-900 border-2 border-red-500 text-red-400 hover:bg-red-500/20'
                }`}
              >
                {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>

              <span className="text-xs font-bold text-slate-200 mt-4">
                {isRecording ? 'Recording... Tap to Stop' : 'Tap to Start Microphone Recording'}
              </span>

              {isTranscribing && (
                <div className="text-xs text-red-400 mt-2 flex items-center space-x-1.5 animate-pulse font-mono">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Transcribing with gemini-3.5-transcribe...</span>
                </div>
              )}
            </div>
          </div>

          {/* Transcript Output */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-red-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <FileAudio className="w-4 h-4 text-red-500" />
                <span>Transcribed Marketing Notes</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">gemini-3.5-transcribe</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed min-h-[140px] whitespace-pre-line">
              {audioTranscript || 'Your audio transcription will appear here after recording...'}
            </div>

            {audioTranscript && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(audioTranscript);
                    confetti({ particleCount: 20 });
                  }}
                  className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs border border-slate-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Transcript</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
