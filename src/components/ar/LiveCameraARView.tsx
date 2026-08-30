import React, { useEffect, useRef, useState } from 'react';
import { 
  X, 
  RotateCw, 
  ZoomIn, 
  Sparkles, 
  Smartphone, 
  AlertCircle,
  Sun
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
  const [exposure, setExposure] = useState('1.1');

  useEffect(() => {
    if (!isOpen || !dish) {
      // Stop video tracks when modal is closed
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      return;
    }

    storeService.incrementARView(dish.id);

    // Request smartphone / device rear camera
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
      } catch (err: any) {
        console.warn('Camera access error:', err);
        setCameraError(
          'Permissão de câmera não concedida. Você ainda pode usar o modo 3D interativo ou abrir no Google Scene Viewer.'
        );
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, dish]);

  if (!isOpen || !dish) return null;

  const handleLaunchNativeAR = () => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isAndroid) {
      const glbUrl = dish.model_3d_url.startsWith('http')
        ? dish.model_3d_url
        : `${window.location.origin}${dish.model_3d_url}`;
      const sceneViewerUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(glbUrl)}&mode=ar_only&resizable=false&title=${encodeURIComponent(dish.name)}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end;`;
      window.location.href = sceneViewerUrl;
    } else if (isIOS && dish.usdz_url) {
      window.location.href = dish.usdz_url;
    } else {
      alert('Seu dispositivo está usando a projeção de câmera ao vivo no navegador.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col justify-between overflow-hidden animate-fade-in select-none">
      
      {/* Live Video Camera Background */}
      <div className="absolute inset-0 z-0 bg-slate-950 flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        {/* Ambient Room Lighting simulation */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 pointer-events-none" />

        {/* Grid Floor Placement Guide */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-64 h-64 border border-orange-500/25 rounded-full pointer-events-none flex items-center justify-center transform rotateX(60deg) animate-pulse-subtle">
          <div className="w-48 h-48 border border-orange-400/20 rounded-full" />
          <div className="w-32 h-32 border border-orange-400/30 rounded-full" />
          <div className="w-3 h-3 bg-orange-500/60 rounded-full" />
        </div>
      </div>

      {/* Top Floating Action Bar */}
      <div className="relative z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-orange-500/40 shadow-lg text-xs font-bold text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Mesa em Realidade Aumentada</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-3 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-2xl transition-colors"
          title="Fechar Projeção AR"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Center 3D Overlay Object with 360 touch control */}
      <div className="relative z-10 flex-1 flex items-center justify-center pointer-events-auto">
        <div className="w-full h-full max-w-lg max-h-[70vh] relative">
          {/* @ts-ignore */}
          <model-viewer
            ref={modelViewerRef}
            src={dish.model_3d_url}
            ios-src={dish.usdz_url || undefined}
            alt={dish.name}
            camera-controls
            touch-action="pan-y"
            auto-rotate={isRotating ? '' : undefined}
            auto-rotate-delay={300}
            rotation-per-second="30deg"
            shadow-intensity="1.8"
            shadow-softness="0.8"
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

      {/* Bottom Controls Strip */}
      <div className="relative z-20 p-4 sm:p-6 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center gap-3">
        
        {/* Helper Hint */}
        <div className="bg-slate-950/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-800 text-[11px] text-slate-300 shadow-lg flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>Arraste para posicionar o <strong>{dish.name}</strong> sobre a mesa</span>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-2xl">
          
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-3 rounded-xl border transition-colors ${
              isRotating ? 'bg-orange-500/20 border-orange-500/40 text-orange-300' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Girar 360°"
          >
            <RotateCw className={`w-5 h-5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          </button>

          <button
            onClick={() => setExposure(exposure === '1.1' ? '1.5' : '1.1')}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 transition-colors"
            title="Ajustar Iluminação"
          >
            <Sun className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              if (modelViewerRef.current) {
                modelViewerRef.current.cameraOrbit = '0deg 75deg 105%';
              }
            }}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
            title="Centralizar Prato"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          {/* Native OS App Trigger Fallback */}
          <button
            onClick={handleLaunchNativeAR}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-orange-500/30"
          >
            <Smartphone className="w-4 h-4" />
            <span>Google / Apple 3D</span>
          </button>

        </div>

      </div>

    </div>
  );
};
