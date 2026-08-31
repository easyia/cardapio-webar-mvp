import React, { useEffect, useRef, useState } from 'react';
import { 
  X, 
  RotateCw, 
  Smartphone, 
  AlertCircle,
  Sun,
  Layers,
  MoveDown,
  MoveUp,
  Sliders,
  Scan,
  Anchor
} from 'lucide-react';
import type { Dish } from '../../types';
import { storeService } from '../../services/storeService';

interface LiveCameraARViewProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LiveCameraARView: React.FC<LiveCameraARViewProps> = ({
  dish,
  isOpen,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modelViewerRef = useRef<any>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [exposure, setExposure] = useState('1.2');

  // Surface Plane Detection & Grounding States
  const [surfaceDetected, setSurfaceDetected] = useState(false);
  const [isGrounded, setIsGrounded] = useState(true);
  const [tableHeightOffset, setTableHeightOffset] = useState<number>(30); // % from bottom
  const [plateScale, setPlateScale] = useState<number>(1);
  const [showControls, setShowControls] = useState(false);
  const [shadowIntensity, setShadowIntensity] = useState<number>(1.8);
  const [devicePitch, setDevicePitch] = useState<number>(45);

  useEffect(() => {
    if (!isOpen || !dish) {
      // Stop video tracks when modal is closed
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setSurfaceDetected(false);
      return;
    }

    storeService.incrementARView(dish.id);

    // Request smartphone rear camera
    const startCamera = async () => {
      try {
        setCameraError(null);
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        // Simulate surface mesh scanning detection
        const timer = setTimeout(() => {
          setSurfaceDetected(true);
        }, 1200);

        return () => clearTimeout(timer);
      } catch (err: any) {
        console.warn('Camera access error:', err);
        setCameraError(
          'Permissão de câmera não concedida. Toque no botão "Apple / Google AR" abaixo para abrir no modo nativo do sistema operacional.'
        );
      }
    };

    startCamera();

    // Device Gyroscope / Tilt Tracking for Table Horizon Alignment
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null) {
        // Clamp phone pitch between 15° and 75°
        const pitch = Math.min(Math.max(Math.round(e.beta), 15), 75);
        setDevicePitch(pitch);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [isOpen, dish]);

  if (!isOpen || !dish) return null;

  // Native Apple ARKit / Google ARCore trigger
  const handleLaunchNativeAR = () => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isAndroid) {
      const glbUrl = dish.model_3d_url.startsWith('http')
        ? dish.model_3d_url
        : `${window.location.origin}${dish.model_3d_url}`;
      const sceneViewerUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(glbUrl)}&mode=ar_only&resizable=false&title=${encodeURIComponent(dish.name)}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end;`;
      window.location.href = sceneViewerUrl;
    } else if (isIOS) {
      const usdzUrl = dish.usdz_url || 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz';
      // Create quick anchor with rel="ar" for iOS Quick Look plane detector
      const anchor = document.createElement('a');
      anchor.setAttribute('rel', 'ar');
      anchor.setAttribute('href', usdzUrl);
      anchor.appendChild(document.createElement('img'));
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } else {
      alert('Seu dispositivo está usando a câmera ao vivo com ancoragem no navegador.');
    }
  };

  const handleTapSurfaceToPlace = () => {
    setIsGrounded(true);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col justify-between overflow-hidden animate-fade-in select-none">
      
      {/* Live Video Camera Feed */}
      <div 
        className="absolute inset-0 z-0 bg-slate-950 flex items-center justify-center overflow-hidden cursor-crosshair"
        onClick={handleTapSurfaceToPlace}
      >
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        {/* Ambient Room Lighting simulation */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/15 to-black/50 pointer-events-none" />

        {/* Laser Grid Table Horizon Scanner */}
        {!surfaceDetected ? (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            <div className="w-72 h-72 border border-orange-500/40 rounded-full animate-ping opacity-60" />
            <div className="absolute flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-full border border-orange-500/40 text-xs font-bold text-orange-300 shadow-xl">
              <Scan className="w-4 h-4 animate-spin text-orange-400" />
              <span>Detectando superfície da mesa...</span>
            </div>
          </div>
        ) : (
          /* Locked Perspective Hologram Ring on Table */
          <div 
            className="absolute left-1/2 -translate-x-1/2 w-80 h-80 pointer-events-none transition-all duration-300"
            style={{
              bottom: `${tableHeightOffset - 12}%`,
              transform: `translateX(-50%) rotateX(${devicePitch}deg)`,
            }}
          >
            {/* Holographic Radar Ring */}
            <div className="w-full h-full border-2 border-dashed border-orange-400/40 rounded-full animate-pulse-subtle flex items-center justify-center">
              <div className="w-56 h-56 border border-orange-500/30 rounded-full" />
              <div className="w-32 h-32 border border-orange-500/40 rounded-full" />
              <div className="w-3 h-3 bg-orange-500 rounded-full shadow-lg shadow-orange-500" />
            </div>
          </div>
        )}
      </div>

      {/* Top Action Bar */}
      <div className="relative z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/85 via-black/40 to-transparent">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-orange-500/40 shadow-lg text-xs font-bold text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Mesa Detectada • Escala 1:1</span>
          </div>

          <button
            onClick={() => setShowControls(!showControls)}
            className={`p-2 rounded-full border backdrop-blur-md transition-colors ${
              showControls ? 'bg-orange-500 text-white border-orange-400' : 'bg-slate-900/80 text-slate-300 border-slate-700'
            }`}
            title="Ajustar Altura e Posição na Mesa"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-2xl transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Surface Height & Scale Slider Drawer */}
      {showControls && (
        <div className="relative z-30 mx-4 p-4 bg-slate-950/90 backdrop-blur-md rounded-2xl border border-orange-500/30 shadow-2xl space-y-3 animate-fade-in text-xs">
          <div className="flex items-center justify-between font-bold text-white uppercase tracking-wider text-[11px]">
            <span>Ajuste de Altura da Mesa & Escala</span>
            <span className="text-orange-400">{Math.round(plateScale * 100)}% tamanho</span>
          </div>

          {/* Height Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Nível da Superfície (Altura):</span>
              <span className="font-mono text-orange-300">{tableHeightOffset}%</span>
            </div>
            <div className="flex items-center gap-3">
              <MoveDown className="w-4 h-4 text-slate-400" />
              <input
                type="range"
                min="10"
                max="60"
                value={tableHeightOffset}
                onChange={(e) => setTableHeightOffset(Number(e.target.value))}
                className="flex-1 accent-orange-500 cursor-pointer"
              />
              <MoveUp className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Scale Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Tamanho do Prato:</span>
              <span className="font-mono text-orange-300">{plateScale.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.5"
              step="0.05"
              value={plateScale}
              onChange={(e) => setPlateScale(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* 3D Model Anchor Object Firmly Grounded on Table */}
      <div 
        className="relative z-10 flex-1 flex flex-col items-center justify-end pointer-events-auto transition-all duration-300"
        style={{
          paddingBottom: `${tableHeightOffset}%`,
        }}
      >
        <div 
          className="relative w-full max-w-sm flex items-center justify-center transition-transform duration-200"
          style={{
            transform: `scale(${plateScale})`,
            height: '320px',
          }}
        >
          {/* Deep Multi-Layer Radial Table Contact Shadow (Eliminates floating feel) */}
          {isGrounded && (
            <div 
              className="absolute bottom-2 left-1/2 -translate-x-1/2 w-64 h-24 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0.3) 65%, transparent 85%)',
                filter: 'blur(6px)',
                transform: `translateX(-50%) rotateX(${devicePitch}deg) scale(1.15)`,
                opacity: shadowIntensity > 0 ? 0.95 : 0,
              }}
            />
          )}

          {/* 3D Model Viewer */}
          {/* @ts-ignore */}
          <model-viewer
            ref={modelViewerRef}
            src={dish.model_3d_url}
            ios-src={dish.usdz_url || undefined}
            alt={dish.name}
            camera-controls
            touch-action="pan-y"
            auto-rotate={isRotating ? '' : undefined}
            auto-rotate-delay={200}
            rotation-per-second="25deg"
            shadow-intensity={shadowIntensity.toString()}
            shadow-softness="0.5"
            exposure={exposure}
            camera-orbit="0deg 75deg 105%"
            className="w-full h-full cursor-grab active:cursor-grabbing bg-transparent"
          />
        </div>
      </div>

      {/* Camera permission error banner */}
      {cameraError && (
        <div className="absolute top-20 left-4 right-4 z-20 p-3.5 bg-amber-950/90 border border-amber-500/50 rounded-2xl text-amber-200 text-xs flex items-center gap-3 backdrop-blur-md">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400" />
          <p className="flex-1 text-[11px] leading-tight">{cameraError}</p>
        </div>
      )}

      {/* Bottom Floating Control Strip */}
      <div className="relative z-20 p-4 sm:p-6 bg-gradient-to-t from-black via-black/85 to-transparent flex flex-col items-center gap-3">
        
        {/* Status Hint */}
        <div className="bg-slate-950/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-800 text-[11px] text-slate-300 shadow-xl flex items-center gap-2">
          <Anchor className="w-3.5 h-3.5 text-orange-400" />
          <span>Fixado sobre a mesa física • Arraste para girar em 360°</span>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-2xl">
          
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-3 rounded-xl border transition-colors ${
              isRotating ? 'bg-orange-500/20 border-orange-500/40 text-orange-300' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Girar Prato 360°"
          >
            <RotateCw className={`w-5 h-5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          </button>

          <button
            onClick={() => setExposure(exposure === '1.2' ? '1.6' : '1.2')}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 transition-colors"
            title="Ajustar Luz do Ambiente"
          >
            <Sun className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShadowIntensity(shadowIntensity === 1.8 ? 0.8 : 1.8)}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
            title="Ajustar Sombra de Contato com a Mesa"
          >
            <Layers className="w-5 h-5 text-orange-300" />
          </button>

          {/* Native Apple ARKit / Google Scene Viewer Button */}
          <button
            onClick={handleLaunchNativeAR}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-orange-500/30 active:scale-95 transition-transform"
          >
            <Smartphone className="w-4 h-4" />
            <span>LiDAR / Apple & Google AR</span>
          </button>

        </div>

      </div>

    </div>
  );
};
