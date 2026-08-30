import React, { useEffect, useRef, useState } from 'react';
import '@google/model-viewer';
import { 
  RotateCw, 
  Sun, 
  Sparkles, 
  Smartphone, 
  ZoomIn, 
  Layers, 
  Loader2,
  Camera
} from 'lucide-react';
import type { Dish } from '../../types';
import { storeService } from '../../services/storeService';

interface ModelViewer3DProps {
  dish: Dish;
  autoRotate?: boolean;
  className?: string;
  onOpenARModal?: () => void;
  showControls?: boolean;
}

export const ModelViewer3D: React.FC<ModelViewer3DProps> = ({
  dish,
  autoRotate = true,
  className = 'h-80 w-full',
  onOpenARModal,
  showControls = true,
}) => {
  const modelViewerRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [lightingPreset, setLightingPreset] = useState<'neutral' | 'warm' | 'studio'>('warm');
  const [isARSupported, setIsARSupported] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Detect mobile / AR support
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsARSupported(isMobile);

    const viewer = modelViewerRef.current;
    if (!viewer) return;

    const handleProgress = (event: any) => {
      setProgress(Math.round((event.detail?.totalProgress || 0) * 100));
    };

    const handleLoad = () => {
      setLoading(false);
      setHasError(false);
    };

    const handleError = () => {
      setLoading(false);
      setHasError(true);
    };

    viewer.addEventListener('progress', handleProgress);
    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('error', handleError);

    return () => {
      viewer.removeEventListener('progress', handleProgress);
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('error', handleError);
    };
  }, [dish.model_3d_url]);

  const handleLaunchAR = () => {
    storeService.incrementARView(dish.id);
    const viewer = modelViewerRef.current;
    if (viewer && isARSupported) {
      if (typeof viewer.activateAR === 'function') {
        viewer.activateAR();
      }
    } else if (onOpenARModal) {
      onOpenARModal();
    }
  };

  const handleResetCamera = () => {
    const viewer = modelViewerRef.current;
    if (viewer) {
      viewer.cameraOrbit = '0deg 75deg 105%';
      viewer.fieldOfView = 'auto';
    }
  };

  const toggleRotation = () => {
    setIsRotating(prev => !prev);
    const viewer = modelViewerRef.current;
    if (viewer) {
      viewer.autoRotate = !isRotating;
    }
  };

  const cycleLighting = () => {
    const presets: Array<'neutral' | 'warm' | 'studio'> = ['neutral', 'warm', 'studio'];
    const nextIdx = (presets.indexOf(lightingPreset) + 1) % presets.length;
    setLightingPreset(presets[nextIdx]);
  };

  const getExposure = () => {
    switch (lightingPreset) {
      case 'studio': return '1.3';
      case 'warm': return '1.1';
      case 'neutral': default: return '0.9';
    }
  };

  const getShadowIntensity = () => {
    return '1.4';
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-slate-800 shadow-2xl flex flex-col items-center justify-center group ${className}`}>
      
      {/* 3D Model Viewer Web Component */}
      {/* @ts-ignore */}
      <model-viewer
        ref={modelViewerRef}
        src={dish.model_3d_url}
        ios-src={dish.usdz_url || undefined}
        alt={`Visualização 3D de ${dish.name}`}
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="fixed"
        ar-placement="floor"
        camera-controls
        touch-action="pan-y"
        auto-rotate={isRotating ? '' : undefined}
        auto-rotate-delay={500}
        rotation-per-second="25deg"
        shadow-intensity={getShadowIntensity()}
        shadow-softness="0.9"
        exposure={getExposure()}
        interaction-prompt="auto"
        poster={dish.image_url}
        loading="eager"
        reveal="auto"
        camera-orbit="0deg 75deg 105%"
        min-camera-orbit="auto auto 50%"
        max-camera-orbit="auto auto 200%"
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Slot Poster / Fallback */}
        <div slot="poster" className="absolute inset-0 flex items-center justify-center bg-slate-900">
          <img 
            src={dish.image_url} 
            alt={dish.name} 
            className="w-full h-full object-cover opacity-40 blur-sm" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent flex flex-col items-center justify-center p-6 text-center">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-3" />
            <p className="text-sm font-semibold text-slate-200">Carregando modelo 3D ultra realista...</p>
            <p className="text-xs text-slate-400 mt-1">{progress}% concluído</p>
          </div>
        </div>
      {/* @ts-ignore */}
      </model-viewer>

      {/* Loading Overlay */}
      {loading && !hasError && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-xs transition-opacity">
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-4 py-2 rounded-full shadow-lg">
            <Loader2 className="w-4 h-4 text-orange-400 animate-spin" />
            <span className="text-xs font-medium text-slate-200">Otimizando malha 3D ({progress}%)</span>
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 p-6 text-center">
          <img src={dish.image_url} alt={dish.name} className="w-24 h-24 object-cover rounded-xl mb-3 shadow-lg border border-slate-700" />
          <p className="text-sm font-semibold text-slate-200">Visualização 3D em processamento</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">Exibindo imagem ultra HD do prato. Você ainda pode projetar em AR no seu celular.</p>
        </div>
      )}

      {/* Top Floating Badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md border border-orange-500/30 px-2.5 py-1 rounded-full text-xs font-medium text-orange-300 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          <span>WebAR 1:1 Escala Real</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 px-2 py-1 rounded-full text-[11px] font-medium text-slate-300">
          <Layers className="w-3 h-3 text-slate-400" />
          <span>360° Interativo</span>
        </div>
      </div>

      {/* Bottom Main Action Button: VER NA MESA (AR TRIGGER) */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-center gap-2">
        <button
          onClick={handleLaunchAR}
          className="w-full py-3.5 px-5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.98] border border-orange-400/30 group/btn"
        >
          <div className="p-1 rounded-lg bg-white/20 group-hover/btn:rotate-12 transition-transform">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div className="text-left flex-1">
            <div className="text-sm leading-tight font-extrabold flex items-center gap-1.5">
              <span>PROJETAR NA MINHA MESA</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-pulse" />
            </div>
            <div className="text-[10px] text-orange-100 font-normal">
              {isARSupported ? 'Toque para abrir a câmera e ver em Realidade Aumentada' : 'Aponte a câmera do celular para ver na mesa'}
            </div>
          </div>
          <Smartphone className="w-5 h-5 opacity-90 hidden xs:block" />
        </button>
      </div>

      {/* Floating Viewport Controls (Side/Bottom) */}
      {showControls && (
        <div className="absolute right-3 top-14 flex flex-col gap-2 z-10">
          <button
            onClick={toggleRotation}
            title={isRotating ? 'Pausar rotação automática' : 'Ativar rotação automática'}
            className={`p-2.5 rounded-xl border backdrop-blur-md transition-all shadow-md ${
              isRotating 
                ? 'bg-orange-500/20 border-orange-500/40 text-orange-300' 
                : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-white'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          </button>

          <button
            onClick={cycleLighting}
            title={`Iluminação: ${lightingPreset.toUpperCase()}`}
            className="p-2.5 rounded-xl border bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-white backdrop-blur-md transition-all shadow-md flex items-center justify-center relative group/light"
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span className="absolute right-full mr-2 px-2 py-0.5 bg-slate-900 text-[10px] text-slate-200 rounded border border-slate-700 whitespace-nowrap opacity-0 group-hover/light:opacity-100 transition-opacity pointer-events-none">
              Luz: {lightingPreset}
            </span>
          </button>

          <button
            onClick={handleResetCamera}
            title="Resetar Câmera"
            className="p-2.5 rounded-xl border bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-white backdrop-blur-md transition-all shadow-md"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Interaction Help Hint */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
        <span className="text-[11px] text-slate-400 bg-slate-950/80 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-800/80 flex items-center gap-1.5 shadow-sm">
          <span>👆 Arraste para girar em 360° • Pinça para zoom</span>
        </span>
      </div>
    </div>
  );
};
