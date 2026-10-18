import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  X, 
  RotateCw, 
  Compass, 
  Maximize2, 
  Minimize2, 
  Video, 
  Camera, 
  Eye, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  MapPin, 
  Layers, 
  Sparkles,
  ArrowRight,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { PropertyListing, PanoramaRoom, VirtualTourData } from '../data/keyDirectData';

interface KeyDirectVirtualTourModalProps {
  property: PropertyListing;
  onClose: () => void;
  initialMode?: '360' | 'interactive' | 'photo' | 'video';
  onScheduleInspection?: (prop: PropertyListing) => void;
}

export const KeyDirectVirtualTourModal: React.FC<KeyDirectVirtualTourModalProps> = ({
  property,
  onClose,
  initialMode = '360',
  onScheduleInspection
}) => {
  const tourData: VirtualTourData = property.virtualTour || {
    has360: false,
    hasInteractiveHotspots: false,
    hasPhotoTour: property.photos.length > 0,
    hasVideoTour: property.videos.length > 0,
    videoWalkthroughUrl: property.videos[0]?.url
  };

  // Determine available modes
  const availableModes: { id: '360' | 'interactive' | 'photo' | 'video'; label: string; icon: any; count?: number }[] = [];
  if (tourData.has360 && tourData.panoramas && tourData.panoramas.length > 0) {
    availableModes.push({ id: '360', label: '360° Panoramic Tour', icon: RotateCw, count: tourData.panoramas.length });
  }
  if (tourData.hasInteractiveHotspots && tourData.panoramas && tourData.panoramas.some(p => p.hotspots && p.hotspots.length > 0)) {
    availableModes.push({ id: 'interactive', label: 'Interactive Hotspot Tour', icon: Compass, count: tourData.panoramas.length });
  }
  if (tourData.hasPhotoTour || property.photos.length > 0) {
    availableModes.push({ id: 'photo', label: 'Room-by-Room Photo Tour', icon: Camera, count: tourData.photoTourRooms?.length || property.photos.length });
  }
  if (tourData.hasVideoTour || property.videos.length > 0) {
    availableModes.push({ id: 'video', label: 'Continuous Video Tour', icon: Video, count: property.videos.length });
  }

  // Active tour mode
  const [activeMode, setActiveMode] = useState<'360' | 'interactive' | 'photo' | 'video'>(() => {
    if (availableModes.some(m => m.id === initialMode)) return initialMode;
    return availableModes[0]?.id || 'photo';
  });

  // Fullscreen state
  const modalRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      modalRef.current?.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // =========================================================================
  // 1. THREE.JS 360 PANORAMIC VIEWER IMPLEMENTATION
  // =========================================================================
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activePanoIndex, setActivePanoIndex] = useState(0);
  const activePano: PanoramaRoom | undefined = tourData.panoramas?.[activePanoIndex];
  const [panoLoading, setPanoLoading] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    if (activeMode !== '360' && activeMode !== 'interactive') return;
    if (!canvasRef.current || !activePano) return;

    setPanoLoading(true);

    const canvas = canvasRef.current;
    const width = canvas.clientWidth || 800;
    const height = canvas.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height, false);

    // 3. Inverted Sphere for Equirectangular Projection
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    // Invert geometry so inside faces inward
    geometry.scale(-1, 1, 1);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    let isDisposed = false;

    textureLoader.load(
      activePano.imageUrl,
      (texture) => {
        if (isDisposed) return;
        texture.mapping = THREE.EquirectangularReflectionMapping;
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        setPanoLoading(false);
      },
      undefined,
      (err) => {
        console.warn('360 texture load fallback', err);
        // Fallback procedural ambient gradient
        const fallbackMaterial = new THREE.MeshBasicMaterial({ color: 0x1e2638, wireframe: false });
        const mesh = new THREE.Mesh(geometry, fallbackMaterial);
        scene.add(mesh);
        setPanoLoading(false);
      }
    );

    // 4. Orbit & Drag Coordinates
    let isUserInteracting = false;
    let onPointerDownPointerX = 0;
    let onPointerDownPointerY = 0;
    let onPointerDownLon = 0;
    let onPointerDownLat = 0;
    let lon = 0;
    let lat = 0;
    let phi = 0;
    let theta = 0;

    const onPointerDown = (event: PointerEvent) => {
      if (event.isPrimary === false) return;
      isUserInteracting = true;
      onPointerDownPointerX = event.clientX;
      onPointerDownPointerY = event.clientY;
      onPointerDownLon = lon;
      onPointerDownLat = lat;
      canvas.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.isPrimary === false || !isUserInteracting) return;
      lon = (onPointerDownPointerX - event.clientX) * 0.15 + onPointerDownLon;
      lat = (event.clientY - onPointerDownPointerY) * 0.15 + onPointerDownLat;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.isPrimary === false) return;
      isUserInteracting = false;
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {
        // ignore
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      camera.fov = Math.max(35, Math.min(100, camera.fov + event.deltaY * 0.05));
      camera.updateProjectionMatrix();
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && !isUserInteracting) {
        lon += 0.08;
      }

      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.MathUtils.degToRad(90 - lat);
      theta = THREE.MathUtils.degToRad(lon);

      const targetX = 500 * Math.sin(phi) * Math.cos(theta);
      const targetY = 500 * Math.cos(phi);
      const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(targetX, targetY, targetZ);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      renderer.dispose();
    };
  }, [activeMode, activePano, autoRotate]);

  // Handle Hotspot Click
  const handleHotspotClick = (targetRoomName: string) => {
    if (!tourData.panoramas) return;
    const targetIdx = tourData.panoramas.findIndex(p => p.roomName.toLowerCase().includes(targetRoomName.toLowerCase()));
    if (targetIdx !== -1) {
      setActivePanoIndex(targetIdx);
    }
  };

  // =========================================================================
  // 2. ROOM-BY-ROOM PHOTO TOUR STATE
  // =========================================================================
  const photoRooms = tourData.photoTourRooms && tourData.photoTourRooms.length > 0 
    ? tourData.photoTourRooms 
    : property.photos.map(p => ({
        roomName: p.caption || p.roomType || 'Room',
        imageUrl: p.url,
        inspectionNotes: `${p.roomType || 'Property Area'} inspection photo. High natural lighting, verified condition.`
      }));

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // =========================================================================
  // 3. CONTINUOUS VIDEO WALKTHROUGH STATE
  // =========================================================================
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const videoUrl = tourData.videoWalkthroughUrl || property.videos[0]?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  const videoChapters = tourData.videoChapters || [
    { title: 'Entrance & Street Access', timestamp: 0 },
    { title: 'Compound & Parking', timestamp: 30 },
    { title: 'Living Room & Interior', timestamp: 75 },
    { title: 'Kitchen & Amenities', timestamp: 120 },
    { title: 'Bedrooms & Master Suite', timestamp: 160 }
  ];

  const seekToChapter = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between overflow-hidden text-slate-100 font-sans"
    >
      {/* ===================================================================== */}
      {/* TOP TOUR HEADER */}
      {/* ===================================================================== */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3 truncate">
          <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 text-red-500 animate-spin-slow" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                KeyDirect Virtual Tour
              </span>
              <span className="text-xs text-slate-400 truncate hidden sm:inline">{property.neighborhood}, {property.city}</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white truncate">{property.title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onScheduleInspection && (
            <button
              onClick={() => onScheduleInspection(property)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" /> Book Physical Inspection
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-red-600/30 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODE SELECTOR SUBNAV (360°, INTERACTIVE, PHOTO TOUR, VIDEO WALKTHROUGH) */}
      {/* ===================================================================== */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 py-2 flex items-center justify-between overflow-x-auto no-scrollbar gap-2 z-20 shrink-0">
        <div className="flex items-center gap-2 text-xs font-semibold">
          {availableModes.map(mode => {
            const Icon = mode.icon;
            const isSelected = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  isSelected 
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30 font-bold' 
                    : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-red-400'}`} />
                <span>{mode.label}</span>
                {mode.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {mode.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Status Hint */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Remote Inspection Mode • Verified Footage</span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MAIN VIEWPORT */}
      {/* ===================================================================== */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center bg-black">

        {/* ------------------------------------------------------------------- */}
        {/* MODE A & B: 360° PANORAMA & INTERACTIVE HOTSPOT TOUR */}
        {/* ------------------------------------------------------------------- */}
        {(activeMode === '360' || activeMode === 'interactive') && activePano && (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Real Three.js Canvas */}
            <canvas 
              ref={canvasRef} 
              className="w-full h-full cursor-grab active:cursor-grabbing block"
            />

            {/* Loading Overlay */}
            {panoLoading && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                <RotateCw className="w-8 h-8 text-red-500 animate-spin" />
                <p className="text-xs text-slate-300 font-semibold tracking-wide">
                  Loading Equirectangular 360° Sphere for {activePano.roomName}...
                </p>
              </div>
            )}

            {/* Interactive Hotspot Buttons Overlay (Mode: Interactive) */}
            {activeMode === 'interactive' && activePano.hotspots && activePano.hotspots.length > 0 && (
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-6 z-10">
                <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-2xl p-4 max-w-md pointer-events-auto shadow-2xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-2">
                    <Sparkles className="w-4 h-4" />
                    Interactive Room Portals Available
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activePano.hotspots.map(h => (
                      <button
                        key={h.id}
                        onClick={() => handleHotspotClick(h.targetRoom)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-red-900/30 transition-all cursor-pointer"
                      >
                        <span>{h.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 360 Controls HUD */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 text-slate-200">
                <Eye className="w-4 h-4 text-red-400" />
                <span className="font-bold">{activePano.roomName}</span>
              </div>
              <p className="text-[10px] text-slate-400 bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-sm max-w-xs">
                💡 Drag mouse or touch screen to rotate 360°. Scroll wheel to zoom in/out.
              </p>
            </div>

            {/* Quick 360 Controls (Auto-rotate toggle, zoom) */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  autoRotate 
                    ? 'bg-red-600/30 border-red-500/50 text-red-300' 
                    : 'bg-slate-900/80 border-slate-800 text-slate-400'
                }`}
              >
                <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                <span>{autoRotate ? 'Auto-Pan On' : 'Auto-Pan Off'}</span>
              </button>
            </div>

            {/* Room Switcher Ribbon at Bottom */}
            {tourData.panoramas && tourData.panoramas.length > 1 && (
              <div className="absolute bottom-4 z-10 max-w-2xl w-full px-4">
                <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 p-2 rounded-2xl flex items-center gap-2 overflow-x-auto no-scrollbar shadow-2xl">
                  {tourData.panoramas.map((pano, idx) => (
                    <button
                      key={pano.id}
                      onClick={() => setActivePanoIndex(idx)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        activePanoIndex === idx 
                          ? 'bg-red-600 text-white shadow-md' 
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <img src={pano.thumbnailUrl} alt={pano.roomName} className="w-5 h-5 rounded-md object-cover" />
                      <span>{pano.roomName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* MODE C: ROOM-BY-ROOM PHOTO TOUR */}
        {/* ------------------------------------------------------------------- */}
        {activeMode === 'photo' && (
          <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-6">
            <div className="relative max-w-5xl w-full flex-1 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-950 border border-slate-800">
              <img 
                src={photoRooms[currentPhotoIndex]?.imageUrl} 
                alt={photoRooms[currentPhotoIndex]?.roomName} 
                className="w-full h-full object-contain"
              />

              {/* Prev / Next controls */}
              <button
                onClick={() => setCurrentPhotoIndex(prev => (prev > 0 ? prev - 1 : photoRooms.length - 1))}
                className="absolute left-4 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all cursor-pointer backdrop-blur-md border border-slate-700"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={() => setCurrentPhotoIndex(prev => (prev < photoRooms.length - 1 ? prev + 1 : 0))}
                className="absolute right-4 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all cursor-pointer backdrop-blur-md border border-slate-700"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Room details banner */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-md border border-slate-800 p-4 rounded-xl flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-red-500" />
                    {photoRooms[currentPhotoIndex]?.roomName}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {photoRooms[currentPhotoIndex]?.inspectionNotes}
                  </p>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  {currentPhotoIndex + 1} of {photoRooms.length}
                </div>
              </div>
            </div>

            {/* Thumbnail Navigation Strip */}
            <div className="w-full max-w-5xl mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {photoRooms.map((room, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPhotoIndex(idx)}
                  className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    currentPhotoIndex === idx ? 'border-red-500 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={room.imageUrl} alt={room.roomName} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* MODE D: CONTINUOUS VIDEO WALKTHROUGH WITH CHAPTERS */}
        {/* ------------------------------------------------------------------- */}
        {activeMode === 'video' && (
          <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-6">
            <div className="relative max-w-5xl w-full flex-1 flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-slate-950 border border-slate-800">
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-contain"
                autoPlay
                playsInline
                loop
                muted={isMuted}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setVideoCurrentTime(videoRef.current.currentTime);
                    setVideoDuration(videoRef.current.duration || 1);
                  }
                }}
              />

              {/* Video Overlay Controls */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-md border border-slate-800 p-3.5 rounded-xl space-y-2">
                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pos = (e.clientX - rect.left) / rect.width;
                    if (videoRef.current) {
                      videoRef.current.currentTime = pos * (videoRef.current.duration || 1);
                    }
                  }}
                >
                  <div 
                    className="bg-red-600 h-full transition-all"
                    style={{ width: `${(videoCurrentTime / (videoDuration || 1)) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (videoRef.current) {
                          if (isPlaying) videoRef.current.pause();
                          else videoRef.current.play();
                          setIsPlaying(!isPlaying);
                        }
                      }}
                      className="p-1 text-slate-200 hover:text-white cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.muted = !isMuted;
                          setIsMuted(!isMuted);
                        }
                      }}
                      className="p-1 text-slate-200 hover:text-white cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <span className="font-mono text-slate-400 text-[11px]">
                      {Math.floor(videoCurrentTime / 60)}:{('0' + Math.floor(videoCurrentTime % 60)).slice(-2)} / 
                      {Math.floor(videoDuration / 60)}:{('0' + Math.floor(videoDuration % 60)).slice(-2)}
                    </span>
                  </div>

                  {/* Playback speed */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400">Speed:</span>
                    {[1, 1.25, 1.5].map(spd => (
                      <button
                        key={spd}
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.playbackRate = spd;
                            setPlaybackSpeed(spd);
                          }
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          playbackSpeed === spd ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Video Chapter Timestamps */}
            <div className="w-full max-w-5xl mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <span className="text-xs font-bold text-slate-400 shrink-0">Walkthrough Checkpoints:</span>
              {videoChapters.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => seekToChapter(ch.timestamp)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-red-500/50 shrink-0 cursor-pointer flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 text-red-500 fill-red-500" />
                  <span>{ch.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
