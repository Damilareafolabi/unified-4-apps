import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  Video,
  ChevronRight
} from 'lucide-react';
import { PropertyVideo } from '../data/keyDirectData';

interface KeyDirectVideoGalleryProps {
  videos: PropertyVideo[];
  propertyTitle: string;
  onLaunchVirtualTour?: () => void;
}

export const KeyDirectVideoGallery: React.FC<KeyDirectVideoGalleryProps> = ({
  videos,
  propertyTitle,
  onLaunchVirtualTour
}) => {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const activeVideo = videos[selectedVideoIndex] || videos[0];
  const [activeCategory, setActiveCategory] = useState<string>('All Footage');

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Unique categories in this listing's videos
  const categories = ['All Footage', ...Array.from(new Set(videos.map(v => v.category)))];

  const filteredVideos = activeCategory === 'All Footage' 
    ? videos 
    : videos.filter(v => v.category === activeCategory);

  const handleSelectVideo = (video: PropertyVideo) => {
    const idx = videos.findIndex(v => v.id === video.id);
    if (idx !== -1) {
      setSelectedVideoIndex(idx);
      setIsPlaying(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    }
  };

  if (!videos || videos.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center text-slate-400">
        <Video className="w-10 h-10 mx-auto text-slate-600 mb-2" />
        <p className="text-xs">No video walkthrough uploaded for this property yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* Category Filter Pills */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat 
                  ? 'bg-red-600 text-white shadow-md' 
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {onLaunchVirtualTour && (
          <button
            onClick={onLaunchVirtualTour}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Launch Full Virtual Tour
          </button>
        )}
      </div>

      {/* Main Video Player Showcase */}
      {activeVideo && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl bg-black border border-slate-800 overflow-hidden relative shadow-2xl">
            <div className="aspect-video w-full relative">
              <video
                ref={videoRef}
                src={activeVideo.url}
                controls
                playsInline
                className="w-full h-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">
                  {activeVideo.category}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {activeVideo.title}
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                <Clock className="w-3.5 h-3.5" /> {activeVideo.duration}
              </span>
            </div>
          </div>

          {/* Playlist & Chapters Column */}
          <div className="lg:col-span-4 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-red-500" />
                  Inspection Footage ({videos.length})
                </h4>
                <span className="text-[10px] text-emerald-400 font-bold">HD Quality</span>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {filteredVideos.map((vid, idx) => {
                  const isCurrent = vid.id === activeVideo.id;
                  return (
                    <div
                      key={vid.id}
                      onClick={() => handleSelectVideo(vid)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isCurrent 
                          ? 'bg-red-600/15 border-red-500/50' 
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="w-20 h-14 rounded-lg overflow-hidden bg-black shrink-0 relative">
                        <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play className={`w-4 h-4 ${isCurrent ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                        </div>
                      </div>

                      <div className="truncate flex-1">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">
                          {vid.category}
                        </span>
                        <h5 className={`text-xs font-semibold truncate mt-0.5 ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                          {vid.title}
                        </h5>
                        <span className="text-[10px] text-slate-500 font-mono">{vid.duration}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800 text-[11px] text-slate-400">
              💡 Tip: Watch each room footage before committing to travel or agent logistics fees.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
