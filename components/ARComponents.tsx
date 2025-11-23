
import React, { useState, useRef, useEffect } from 'react';
import { Video, CloudLightning, Maximize2, Pause, Play, ZoomOut, Rotate3d, ZoomIn, Zap, X, Scan, Target, Hand, Minus, Plus, RefreshCw, Aperture, ChevronDown, Sparkles } from 'lucide-react';
import { Dish } from '../types';

// --- 3D Cube Renderer (Robust 360 Visualization) ---
const CubeRenderer = ({ dish, wireframe = false, ghost = false }: { dish: Dish, wireframe?: boolean, ghost?: boolean }) => {
    // Dimensions for the virtual box
    const size = 280;
    const half = size / 2;

    // Check if this is a Gemini generated asset
    const isGeminiAsset = !!dish.angles;

    // Use main image as global fallback
    const mainImage = dish.imageUrl;
    
    // Robust Texture Logic: Prioritize AI generated angles, fall back to main image
    const getTexture = (angleKey: 'front' | 'right' | 'back' | 'left' | 'top' | 'bottom') => {
        if (dish.angles) {
            // Map 'bottom' to 'top' if bottom is missing (common in single-image generation)
            if (angleKey === 'bottom' && !dish.angles.bottom && dish.angles.top) {
                return dish.angles.top; 
            }
            // Use specific angle if exists
            if (dish.angles[angleKey as keyof typeof dish.angles]) {
                return dish.angles[angleKey as keyof typeof dish.angles];
            }
        }
        return mainImage;
    };

    const faces = [
        { name: 'front',  transform: `rotateY(0deg) translateZ(${half}px)`,   src: getTexture('front'), mirror: false },
        { name: 'right',  transform: `rotateY(90deg) translateZ(${half}px)`,  src: getTexture('right'), mirror: true }, // Mirror for seamless wrap
        { name: 'back',   transform: `rotateY(180deg) translateZ(${half}px)`, src: getTexture('back'), mirror: false },
        { name: 'left',   transform: `rotateY(-90deg) translateZ(${half}px)`, src: getTexture('left'), mirror: true },  // Mirror for seamless wrap
        { name: 'top',    transform: `rotateX(90deg) translateZ(${half}px)`,  src: getTexture('top'), mirror: false },
        { name: 'bottom', transform: `rotateX(-90deg) translateZ(${half}px)`, src: getTexture('bottom'), mirror: true }, 
    ];

    // Dynamic Border Class based on state
    const borderClass = wireframe 
        ? 'border-2 border-blue-500/40' 
        : ghost 
            ? (isGeminiAsset ? 'border-2 border-blue-400/60 border-dashed' : 'border-2 border-white/40 border-dashed')
            : 'border-0 shadow-sm'; // No border when placed

    return (
        <div className={`w-full h-full relative transition-all duration-500 ${ghost ? 'opacity-90 scale-95' : 'opacity-100 scale-100'}`} style={{ transformStyle: 'preserve-3d' }}>
            {faces.map((face) => (
                <div
                    key={face.name}
                    className="absolute inset-0"
                    style={{
                        transform: face.transform,
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'visible', // Ensure visible in AR
                        WebkitBackfaceVisibility: 'visible',
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {/* Face Container */}
                    <div className={`w-full h-full relative bg-slate-800 overflow-hidden transition-all duration-500 ${wireframe ? 'bg-transparent opacity-80' : ''} ${borderClass} ${ghost ? 'bg-slate-900/40 backdrop-blur-[2px]' : 'bg-slate-900'}`}>
                        
                        {!wireframe && (
                            <>
                                {/* 1. Fallback Content */}
                                <div className="absolute inset-0 flex items-center justify-center z-0">
                                    <span className="text-white/20 font-bold text-xs uppercase tracking-widest">{ghost ? 'PREVIEW' : face.name}</span>
                                </div>

                                {/* 2. Actual Image Texture */}
                                <img 
                                    src={face.src} 
                                    alt={face.name}
                                    className={`absolute inset-0 w-full h-full object-cover z-10 block transition-all duration-500 ${ghost && !isGeminiAsset ? 'grayscale opacity-70' : 'opacity-100'}`}
                                    style={{ 
                                        transform: face.mirror ? 'scaleX(-1)' : 'none',
                                    }}
                                    onError={(e) => { 
                                        // Self-healing: if specific angle fails, revert to main image
                                        if (e.currentTarget.src !== mainImage) {
                                            e.currentTarget.src = mainImage;
                                        }
                                    }} 
                                />

                                {/* 3. Realistic Lighting Overlay (Gradient) */}
                                <div className={`absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/50 z-20 pointer-events-none transition-opacity ${ghost ? 'opacity-30' : 'opacity-30'}`} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-20 pointer-events-none" />
                                
                                {/* 4. Fresnel / Rim Light Simulation */}
                                <div className="absolute inset-0 border border-white/10 z-30 pointer-events-none mix-blend-overlay" />
                                
                                {/* 5. Noise Texture for Realism */}
                                {!ghost && !isGeminiAsset && (
                                    <div className="absolute inset-0 opacity-10 z-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}} />
                                )}
                            </>
                        )}
                        
                        {wireframe && (
                            <div className="absolute inset-0 bg-[url('https://media.istockphoto.com/id/535620633/vector/abstract-wireframe-mesh-background.jpg?s=612x612&w=0&k=20&c=wI4YlqRmvKjQ5-vWq0rZqgLq5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q')] bg-cover opacity-30 mix-blend-screen" />
                        )}

                    </div>
                </div>
            ))}
            
            {/* Center Glow for Ghost Mode */}
            {ghost && (
                <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-blue-500/20 blur-3xl -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none animate-pulse" style={{ transform: 'translateZ(0)' }} />
            )}
        </div>
    );
};

// --- Mini Dish Visualizer (For Menu Grid) ---
export const MiniDishVisualizer = ({ dish }: { dish: Dish }) => {
    const [rot, setRot] = useState(0);
    
    useEffect(() => {
        let frameId: number;
        const loop = () => {
            setRot(r => r + 0.5); // Slow rotation
            frameId = requestAnimationFrame(loop);
        };
        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, []);

    return (
        <div className="w-full h-full relative overflow-hidden bg-slate-900">
             <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '800px' }}>
                <div 
                    className="relative"
                    style={{ 
                        transform: `scale(0.5) rotateX(20deg) rotateY(${rot}deg)`,
                        transformStyle: 'preserve-3d',
                        width: '280px',
                        height: '280px'
                    }}
                >
                    <CubeRenderer dish={dish} />
                </div>
             </div>
             {/* Overlay Badge */}
             <div className="absolute top-2 right-2 bg-blue-600/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10 backdrop-blur-md border border-white/10">
                 3D VIEW
             </div>
        </div>
    );
};

// --- Dish Visualizer (Enhanced Interactive Preview) ---
export const DishVisualizer = ({ dish, interactive = true }: { dish: Dish, interactive?: boolean }) => {
  const objectRef = useRef<HTMLDivElement>(null);
  
  // View State
  const [viewMode, setViewMode] = useState<'texture' | 'wireframe'>('texture');
  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);
  const [scale, setScale] = useState(1);

  // Physics State (Refs for performance loop)
  const physics = useRef({
    rotX: -10, // Degrees (slightly tilted down)
    rotY: 45,  // Degrees
    velocityX: 0,
    velocityY: 0,
    lastX: 0,
    lastY: 0
  });

  // Animation Loop for Inertia/Momentum
  useEffect(() => {
      let animationFrameId: number;

      const loop = () => {
          const p = physics.current;

          if (!isInteracting && isAutoSpin) {
              // Smooth constant rotation when idle
              p.rotY += 0.2; 
          } else if (!isInteracting) {
              // Apply Friction/Inertia when released
              p.velocityX *= 0.95;
              p.velocityY *= 0.95;
              
              p.rotY += p.velocityX;
              p.rotX += p.velocityY;

              // Stop completely if slow enough
              if (Math.abs(p.velocityX) < 0.01) p.velocityX = 0;
              if (Math.abs(p.velocityY) < 0.01) p.velocityY = 0;
          }

          // Clamp Vertical Rotation (Don't flip over)
          p.rotX = Math.max(-60, Math.min(60, p.rotX));

          // Apply Transform directly to DOM
          if (objectRef.current) {
              objectRef.current.style.transform = `rotateX(${p.rotX}deg) rotateY(${p.rotY}deg) scale(${scale})`;
          }
          
          animationFrameId = requestAnimationFrame(loop);
      };

      animationFrameId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(animationFrameId);
  }, [isInteracting, isAutoSpin, scale]);

  // Pointer Handlers (Mouse + Touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    setIsInteracting(true);
    setIsAutoSpin(false); // Stop spinning on grab
    physics.current.lastX = e.clientX;
    physics.current.lastY = e.clientY;
    physics.current.velocityX = 0;
    physics.current.velocityY = 0;
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isInteracting || !interactive) return;
    const p = physics.current;
    
    const deltaX = e.clientX - p.lastX;
    const deltaY = e.clientY - p.lastY;
    
    p.lastX = e.clientX;
    p.lastY = e.clientY;

    // Update Rotation based on drag
    p.rotY += deltaX * 0.5;
    p.rotX -= deltaY * 0.5; // Invert Y axis for natural feel

    // Store velocity for inertia release
    p.velocityX = deltaX * 0.5;
    p.velocityY = -deltaY * 0.5;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsInteracting(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  const resetView = () => {
      physics.current.rotX = -10;
      physics.current.rotY = 45;
      physics.current.velocityX = 0;
      physics.current.velocityY = 0;
      setScale(1);
      setIsAutoSpin(true);
  };

  // Video Fallback
  const isVideo = !!dish.videoUrl;
  if (isVideo) {
      return (
        <div className="relative w-full max-w-md aspect-square flex items-center justify-center p-4">
             <div className="w-full h-full rounded-2xl shadow-2xl overflow-hidden relative border border-white/10 group">
                 <video src={dish.videoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                 <div className="absolute top-4 right-4 bg-black/60 p-2 rounded-full backdrop-blur-md">
                    <Video className="text-white" size={20} />
                 </div>
             </div>
        </div>
      );
  }

  return (
    <div className="relative w-full max-w-md aspect-square group select-none rounded-3xl overflow-hidden bg-[#0a0a0a] shadow-2xl border border-white/5">
        
        {/* Branding Badge: Gemini */}
        <div className="absolute top-4 left-4 z-20 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-blue-500/20 flex items-center gap-2 shadow-lg animate-in slide-in-from-top-4">
            <Sparkles size={14} className="text-blue-400 fill-blue-400/20" />
            <div className="flex flex-col leading-none">
                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider">Powered by</span>
                <span className="text-[10px] font-black text-white uppercase tracking-wide">Gemini AI</span>
            </div>
        </div>

        {/* Studio Lighting Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
             {/* Main Spotlight */}
             <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[120%] h-[80%] bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_70%)] blur-2xl" />
             {/* Bottom Reflection Glow (Blue Tint for Gemini Brand) */}
             <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-[30%] bg-blue-500/10 blur-[50px]" />
             {/* Film Grain Texture for Realism */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
        </div>
        
        {/* 3D Scene Container */}
        <div 
            className={`w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10 relative`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{ perspective: '1200px' }}
        >
            {/* Rotating Object */}
            <div 
                ref={objectRef}
                className="relative w-[240px] h-[240px] will-change-transform"
                style={{ transformStyle: 'preserve-3d' }}
            >
                <CubeRenderer dish={dish} wireframe={viewMode === 'wireframe'} />
                
                {/* Reflection on floor */}
                <div 
                    className="absolute top-full left-0 w-full h-full opacity-30 pointer-events-none scale-y-[-1] mask-image-gradient"
                    style={{ 
                        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 40%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 40%)',
                        transform: 'translateY(10px)'
                     }}
                >
                     <CubeRenderer dish={dish} ghost={true} />
                </div>
            </div>

            {/* Dynamic Drop Shadow */}
            <div 
                className="absolute bottom-16 w-[180px] h-[30px] bg-black/80 blur-xl rounded-[100%] pointer-events-none transition-all duration-300"
                style={{
                    transform: `translateY(140px) scale(${scale * 0.9}) rotateX(60deg)`,
                    opacity: 0.7
                }}
            />
        </div>

        {/* --- Controls UI --- */}
        {interactive && (
            <>
                {/* Top Right: View Modes */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                    <button 
                        onClick={() => setViewMode(viewMode === 'texture' ? 'wireframe' : 'texture')}
                        className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${viewMode === 'wireframe' ? 'bg-blue-600 text-white border-blue-500' : 'bg-black/40 text-slate-300 border-white/10 hover:bg-white/10'}`}
                        title="Toggle Wireframe"
                    >
                        <Maximize2 size={16} />
                    </button>
                    <button 
                        onClick={() => setIsAutoSpin(!isAutoSpin)}
                        className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${isAutoSpin ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-black/40 text-slate-300 border-white/10 hover:bg-white/10'}`}
                        title={isAutoSpin ? "Pause Rotation" : "Auto Spin"}
                    >
                        {isAutoSpin ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                    </button>
                </div>

                {/* Bottom Center: Interaction Tools */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20 pointer-events-none">
                    <div className="bg-black/70 backdrop-blur-lg rounded-2xl p-1 flex items-center gap-1 border border-white/10 shadow-2xl pointer-events-auto">
                        <button 
                            onClick={() => setScale(s => Math.max(0.6, s - 0.2))} 
                            className="p-2 hover:bg-white/10 rounded-xl text-slate-300 transition-colors"
                        >
                            <ZoomOut size={16} />
                        </button>
                        
                        <div className="w-px h-5 bg-white/10 mx-1" />
                        
                        <button 
                            onClick={resetView}
                            className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-xl text-xs font-bold text-white transition-colors"
                        >
                            <Rotate3d size={14} className="text-blue-500" />
                            Reset
                        </button>

                        <div className="w-px h-5 bg-white/10 mx-1" />

                        <button 
                            onClick={() => setScale(s => Math.min(1.8, s + 0.2))} 
                            className="p-2 hover:bg-white/10 rounded-xl text-slate-300 transition-colors"
                        >
                            <ZoomIn size={16} />
                        </button>
                    </div>
                </div>
            </>
        )}
    </div>
  );
};

// --- Real Camera AR Viewer Component ---
export const ARViewer = ({ dish, onClose }: { dish: Dish, onClose: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [surfaceDetected, setSurfaceDetected] = useState(false);
  
  // Transform State
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(0.8); // Default scale
  const [rotation, setRotation] = useState({ x: 15, y: 45 });
  const [placed, setPlaced] = useState(false);
  
  // Interaction State
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const lastPinchDist = useRef<number | null>(null);
  const hasMoved = useRef(false);

  // Initialize center position
  useEffect(() => {
      setPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      
      // Simulate surface detection delay
      const timer = setTimeout(() => {
          setSurfaceDetected(true);
      }, 1500);
      return () => clearTimeout(timer);
  }, []);

  // Auto-rotate ghost model to make it visible/attractive
  useEffect(() => {
      if (placed) return;
      let frameId: number;
      const spin = () => {
          setRotation(r => ({ ...r, y: r.y + 0.5 }));
          frameId = requestAnimationFrame(spin);
      };
      frameId = requestAnimationFrame(spin);
      return () => cancelAnimationFrame(frameId);
  }, [placed]);

  useEffect(() => {
      // Preload textures
      const sources = dish.angles ? Object.values(dish.angles) : [dish.imageUrl];
      sources.forEach(src => {
          if(src) { const img = new Image(); img.src = src; }
      });
  }, [dish]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => setCameraReady(true);
        }
      } catch (err) {
        setPermissionDenied(true);
      }
    };
    startCamera();
    return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
  }, []);

  // --- Gesture Handlers ---
  const handleStart = (clientX: number, clientY: number) => {
      setIsDragging(true);
      hasMoved.current = false;
      lastPos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
      if (!isDragging) return;
      const deltaX = clientX - lastPos.current.x;
      const deltaY = clientY - lastPos.current.y;

      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
          hasMoved.current = true;
      }

      if (placed) {
        setRotation(prev => ({ ...prev, y: prev.y + deltaX * 0.5 }));
      } else {
        setPosition(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      }
      lastPos.current = { x: clientX, y: clientY };
  };

  const handleEnd = () => { 
      setIsDragging(false); 
      lastPinchDist.current = null;
      if (!placed && !hasMoved.current && surfaceDetected) {
          // Tap to place logic
          handlePlace();
      }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) handleStart(e.touches[0].clientX, e.touches[0].clientY);
    else if (e.touches.length === 2) {
       lastPinchDist.current = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    else if (e.touches.length === 2 && lastPinchDist.current !== null) {
       const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
       const delta = dist - lastPinchDist.current;
       setScale(prev => Math.max(0.3, Math.min(3, prev + delta * 0.01)));
       lastPinchDist.current = dist;
    }
  };
  
  // Place Logic
  const handlePlace = (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      
      if (surfaceDetected) {
          setPlaced(true);
          if (navigator.vibrate) navigator.vibrate(50);
      }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden touch-none select-none font-sans">
      
      {/* 1. Background (Camera) */}
      <div className="absolute inset-0 bg-slate-900">
        {!permissionDenied && (
           <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover transition-opacity duration-500 ${cameraReady ? 'opacity-100' : 'opacity-0'}`} />
        )}
        
        {/* Fallback */}
        <div className={`absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615716276950-1a28601a302e?q=80&w=1000')] bg-cover bg-center opacity-40 transition-opacity duration-500 ${cameraReady && !permissionDenied ? 'opacity-0 pointer-events-none' : 'opacity-40'}`} />
      </div>

      {/* 2. Header Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-safe-top flex justify-between items-start z-50">
         <div className="flex flex-col gap-2">
             <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 text-white shadow-lg self-start">
                <div className={`w-2 h-2 rounded-full ${cameraReady ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`} />
                <span className="text-xs font-bold tracking-wider">{cameraReady ? 'LIVE AR' : 'INITIALIZING'}</span>
             </div>
         </div>
         
         <button onClick={onClose} className="bg-black/40 backdrop-blur-md p-3 rounded-full border border-white/10 text-white hover:bg-red-500/20 transition-colors shadow-lg">
            <X size={24} />
         </button>
      </div>

      {/* 3. 3D Scene */}
      <div 
        className="absolute inset-0 z-10 overflow-hidden perspective-1000"
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleEnd}
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)} onMouseMove={(e) => handleMove(e.clientX, e.clientY)} onMouseUp={handleEnd}
      >
           <div className="absolute w-0 h-0 flex items-center justify-center will-change-transform" style={{ left: position.x, top: position.y, transformStyle: 'preserve-3d' }}>
              <div 
                 className={`relative transition-all duration-700 cubic-bezier(0.175, 0.885, 0.32, 1.275) ${placed ? 'drop-shadow-2xl scale-100' : 'scale-90'}`}
                 style={{
                    width: '280px', height: '280px',
                    transform: `translate(-50%, -50%) scale(${scale}) rotateX(${placed ? rotation.x : 15}deg) rotateY(${rotation.y}deg)`,
                    transformStyle: 'preserve-3d'
                 }}
              >
                 {/* 3D Model Render */}
                 <CubeRenderer dish={dish} ghost={!placed} />
                 
                 {/* Visual Surface Detection Feedback */}
                 {!placed && surfaceDetected && (
                     <div className="absolute top-1/2 left-1/2 w-[160%] h-[160%] -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ transform: 'translateZ(-150px) rotateX(90deg)' }}>
                        {/* Scanning Ring */}
                        <div className="absolute inset-0 border-2 border-white/50 border-dashed rounded-full animate-[spin_8s_linear_infinite]" />
                        {/* Pulsing Inner Circle */}
                        <div className="absolute inset-4 bg-white/5 rounded-full animate-pulse border border-white/10" />
                        {/* Target Reticle Lines */}
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30" />
                        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/30" />
                        
                        {/* Floating Label */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/50 backdrop-blur px-3 py-1 rounded-lg border border-white/20 animate-bounce">
                            <span className="text-xs font-bold text-white flex items-center gap-1"><ChevronDown size={12}/> Ready to Place</span>
                        </div>
                     </div>
                 )}

                 {/* Shadow */}
                 {placed && (
                    <div className="absolute top-1/2 left-1/2 w-[140%] h-[140%] bg-black/60 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ transform: `translateZ(-150px) rotateX(90deg)`, opacity: 0.8 }} />
                 )}

                 {!placed && !surfaceDetected && (
                    <div className="absolute -inset-24 border-2 border-dashed border-white/50 rounded-full animate-[spin_2s_linear_infinite] pointer-events-none" style={{ transform: 'rotateX(-90deg)' }}>
                        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_white]" />
                    </div>
                 )}
              </div>
           </div>
      </div>

      {/* 4. UI Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-50 pointer-events-none">
         <div className="w-full pointer-events-auto max-w-md mx-auto">
            {!placed ? (
                <div className="flex flex-col items-center gap-6 animate-in slide-in-from-bottom-4">
                    {!surfaceDetected ? (
                        <div className="bg-black/60 backdrop-blur-md text-white px-6 py-4 rounded-3xl border border-white/10 flex flex-col items-center text-center shadow-xl">
                            <Scan className="mb-2 text-orange-500 animate-pulse" size={32} />
                            <p className="font-bold text-lg">Scanning Surface...</p>
                            <p className="text-sm text-slate-400">Move your camera slowly to detect a flat surface.</p>
                        </div>
                    ) : (
                        <div className="bg-black/60 backdrop-blur-md text-white px-6 py-4 rounded-3xl border border-white/10 flex flex-col items-center text-center shadow-xl mb-2">
                            <Target className="mb-2 text-green-500" size={32} />
                            <p className="font-bold text-lg">Surface Detected</p>
                            <p className="text-sm text-slate-400">Tap button or screen to place.</p>
                        </div>
                    )}
                    
                    {/* Manual Place Button */}
                    {surfaceDetected && (
                        <button 
                            onClick={handlePlace} 
                            className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-black uppercase tracking-widest py-4 px-12 rounded-full shadow-2xl shadow-orange-500/40 active:scale-95 transition-all border-4 border-white/10 text-lg animate-pulse hover:animate-none"
                        >
                            PLACE DISH
                        </button>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-4">
                    <div className="bg-black/70 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl">
                         <div className="flex justify-center gap-6 text-white/70 mb-3">
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"><Hand size={12} className="text-orange-500"/> Swipe to Rotate</span>
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"><Maximize2 size={12} className="text-orange-500"/> Pinch to Scale</span>
                         </div>
                         <div className="flex items-center gap-3">
                             <button onClick={() => setScale(s => Math.max(0.3, s - 0.1))} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"><Minus size={18}/></button>
                             <input type="range" min="0.3" max="2.5" step="0.05" value={scale} onChange={(e) => setScale(Number(e.target.value))} className="flex-1 h-1 bg-slate-600 rounded-full appearance-none accent-orange-500 cursor-pointer" />
                             <button onClick={() => setScale(s => Math.min(3, s + 0.1))} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"><Plus size={18}/></button>
                         </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => { setPlaced(false); setRotation({x:15, y:45}); setScale(0.8); setSurfaceDetected(false); setTimeout(()=>setSurfaceDetected(true), 800); }} className="flex items-center justify-center gap-2 bg-slate-800/90 backdrop-blur-md py-3.5 rounded-2xl text-white border border-white/10 font-bold hover:bg-slate-700"><RefreshCw size={18} /> Reposition</button>
                        <button onClick={() => { const flash = document.createElement('div'); flash.className = 'fixed inset-0 bg-white z-[200] animate-out fade-out duration-500'; document.body.appendChild(flash); setTimeout(() => flash.remove(), 500); }} className="flex items-center justify-center gap-2 bg-white text-black py-3.5 rounded-2xl font-bold hover:bg-slate-200"><Aperture size={18} /> Snapshot</button>
                    </div>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};
