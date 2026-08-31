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
  Camera, 
  QrCode, 
  Sliders,
  Scan
} from 'lucide-react';
import type { Dish } from '../../types';
import { storeService } from '../../services/storeService';

interface ModelViewer3DProps {
  dish: Dish;
  autoRotate?: boolean;
  className?: string;
  onOpenARModal?: () => void;
  onOpenLiveCamera?: (dish: Dish) => void;
  showControls?: boolean;
  initialScale?: number;
  onScaleChange?: (scale: number) => void;
}

export const ModelViewer3D: React.FC<ModelViewer3DProps> = ({
  dish,
  autoRotate = true,
  className = 'h-80 w-full',
  onOpenARModal,
  onOpenLiveCamera,
  showControls = true,
  initialScale,
  onScaleChange,
}) => {
  const modelViewerRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [lightingPreset, setLightingPreset] = useState<'neutral' | 'warm' | 'studio'>('warm');
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Dynamic Scale state (default: 0.35 for realistic tableware size instead of 1.0 meter default)
  const defaultScale = initialScale || dish.scale || 0.35;
  const [currentScale, setCurrentScale] = useState<number>(defaultScale);
  const [showScaleMenu, setShowScaleMenu] = useState(false);

  useEffect(() => {
    if (dish.scale) {
      setCurrentScale(dish.scale);
    }
  }, [dish.scale]);

  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (viewer) {
      viewer.scale = `${currentScale} ${currentScale} ${currentScale}`;
      viewer.setAttribute('scale', `${currentScale} ${currentScale} ${currentScale}`);
    }
  }, [currentScale]);

  useEffect(() => {
    // Detect mobile device
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsMobileDevice(isMobile);

    const viewer = modelViewerRef.current;
    if (!viewer) return;

    const handleProgress = (event: any) => {
      setProgress(Math.round((event.detail?.totalProgress || 0) * 100));
    };

    const handleLoad = () => {
      setLoading(false);
      setHasError(false);
      viewer.scale = `${currentScale} ${currentScale} ${currentScale}`;
    };

    const handleError = () => {
      setLoading(false);
      setHasError(true);
    };

    const handleARStatus = (event: any) => {
      console.log('model-viewer ar-status:', event.detail?.status);
    };

    viewer.addEventListener('progress', handleProgress);
    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('error', handleError);
    viewer.addEventListener('ar-status', handleARStatus);

    return () => {
      viewer.removeEventListener('progress', handleProgress);
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('error', handleError);
      viewer.removeEventListener('ar-status', handleARStatus);
    };
  }, [dish.model_3d_url]);

  const handleUpdateScale = (newScale: number) => {
    const clamped = Math.max(0.1, Math.min(1.5, Math.round(newScale * 100) / 100));
    setCurrentScale(clamped);
    if (onScaleChange) {
      onScaleChange(clamped);
    }
  };

  // Direct 1-tap Native WebAR projection (Apple Quick Look / Android Scene Viewer / Live Camera)
  const handleLaunchAR = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    storeService.incrementARView(dish.id);

    const viewer = modelViewerRef.current;
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isMobile = isAndroid || isIOS;

    // Desktop check: open QR modal for mobile scanning
    if (!isMobile) {
      if (onOpenARModal) {
        onOpenARModal();
      }
      return;
    }

    // 1. If viewer has native AR capability, trigger activateAR()
    if (viewer && typeof viewer.activateAR === 'function' && viewer.canActivateAR) {
      try {
        viewer.activateAR();
        return;
      } catch (err) {
        console.warn('viewer.activateAR error:', err);
      }
    }

    // 2. iOS Safari AR Quick Look fallback
    if (isIOS) {
      const usdzUrl = dish.usdz_url || dish.model_3d_url;
      if (usdzUrl && (usdzUrl.includes('.usdz') || usdzUrl.includes('format=usdz'))) {
        const fullUsdzUrl = usdzUrl.startsWith('http')
          ? usdzUrl
          : `${window.location.origin}${usdzUrl}`;

        const anchor = document.createElement('a');
        anchor.setAttribute('rel', 'ar');
        anchor.setAttribute('href', fullUsdzUrl);
        const img = document.createElement('img');
        img.setAttribute('src', dish.image_url);
        anchor.appendChild(img);
        document.body.appendChild(anchor);
        anchor.click();
        setTimeout(() => {
          if (document.body.contains(anchor)) {
            document.body.removeChild(anchor);
          }
        }, 1000);
        return;
      }
    }

    // 3. Android Scene Viewer fallback
    if (isAndroid) {
      const glbUrl = dish.model_3d_url.startsWith('http') 
        ? dish.model_3d_url 
        : `${window.location.origin}${dish.model_3d_url}`;
      
      const sceneViewerUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(glbUrl)}&mode=ar_only&resizable=true&title=${encodeURIComponent(dish.name)}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end;`;
      window.location.href = sceneViewerUrl;
      return;
    }

    // 4. Universal Fallback: Open Live Camera In-Browser Surface Projector
    if (onOpenLiveCamera) {
      onOpenLiveCamera(dish);
    } else if (onOpenARModal) {
      onOpenARModal();
    }
  };

  const handleLaunchLiveCamera = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenLiveCamera) {
      onOpenLiveCamera(dish);
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

  const modelViewerProps: any = {
    ref: modelViewerRef,
    src: dish.model_3d_url,
    'ios-src': dish.usdz_url || undefined,
    alt: `Visualização 3D de ${dish.name}`,
    scale: `${currentScale} ${currentScale} ${currentScale}`,
    ar: true,
    'ar-modes': 'webxr scene-viewer quick-look',
    'ar-scale': 'auto',
    'ar-placement': 'floor',
    'camera-controls': true,
    'touch-action': 'pan-y',
    'auto-rotate': isRotating ? '' : undefined,
    'auto-rotate-delay': 500,
    'rotation-per-second': '25deg',
    'shadow-intensity': '1.6',
    'shadow-softness': '0.4',
    'tone-mapping': 'aces',
    'environment-image': 'neutral',
    exposure: getExposure(),
    'interaction-prompt': 'auto',
    poster: dish.image_url,
    loading: 'eager',
    reveal: 'auto',
    'camera-orbit': '0deg 75deg 105%',
    'min-camera-orbit': 'auto auto 40%',
    'max-camera-orbit': 'auto auto 250%',
    className: 'w-full h-full cursor-grab active:cursor-grabbing',
  };

  return (
    <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#161412] via-[#0C0B0A] to-black border border-[#1E1B18] shadow-2xl flex flex-col items-center justify-center group ${className}`}>
      
      {/* 3D Model Viewer Web Component */}
      {/* @ts-ignore */}
      <model-viewer {...modelViewerProps}>
        {/* Custom native AR button slot */}
        <button
          slot="ar-button"
          id="native-ar-btn"
          className="hidden"
          aria-label="Abrir em Realidade Aumentada"
        />

        {/* Slot Poster / Loading State */}
        <div slot="poster" className="absolute inset-0 flex items-center justify-center bg-[#0C0B0A]">
          <img 
            src={dish.image_url} 
            alt={dish.name} 
            className="w-full h-full object-cover opacity-35 blur-sm" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A] via-[#0C0B0A]/70 to-transparent flex flex-col items-center justify-center p-6 text-center">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
            <p className="text-sm font-semibold text-slate-200">Carregando malha 3D...</p>
            <p className="text-xs text-slate-400 mt-1 font-mono">{progress}% concluído</p>
          </div>
        </div>
      {/* @ts-ignore */}
      </model-viewer>

      {/* Loading Overlay */}
      {loading && !hasError && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center bg-[#0C0B0A]/70 backdrop-blur-xs transition-opacity">
          <div className="flex items-center gap-2 bg-[#161412]/95 border border-amber-500/30 px-4 py-2 rounded-full shadow-xl">
            <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
            <span className="text-xs font-medium text-slate-200">Sincronizando 3D ({progress}%)</span>
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0C0B0A]/95 p-6 text-center">
          <img src={dish.image_url} alt={dish.name} className="w-24 h-24 object-cover rounded-2xl mb-3 shadow-xl border border-[#1E1B18]" />
          <p className="text-sm font-semibold text-slate-200">Visualização 3D em processamento</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">Exibindo foto do item. Toque abaixo para projetar em AR.</p>
        </div>
      )}

      {/* Top Floating Badges */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#0C0B0A]/90 backdrop-blur-md border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold text-amber-300 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>WebAR 1:1</span>
          </div>

          {/* Scale Indicator */}
          <div className="flex items-center gap-1 bg-[#161412]/90 backdrop-blur-md border border-[#2B2723] px-2.5 py-1 rounded-full text-[11px] font-mono text-[#FAF8F5]">
            <span>{Math.round(currentScale * 100)}%</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-[#0C0B0A]/85 backdrop-blur-md border border-[#1E1B18] px-2.5 py-1 rounded-full text-[11px] font-medium text-slate-300">
          <Layers className="w-3 h-3 text-amber-400" />
          <span>360° Interativo</span>
        </div>
      </div>

      {/* Bottom Main Action Button: VER NA MESA (AR TRIGGER) */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={handleLaunchAR}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold rounded-2xl shadow-2xl shadow-amber-600/30 flex items-center justify-between gap-3 transition-all transform active:scale-[0.98] border border-amber-400/40 group/btn cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-white/20 group-hover/btn:rotate-12 transition-transform shadow-inner flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <div className="text-xs sm:text-sm leading-tight font-extrabold flex items-center gap-1.5 text-white">
                <span>{isMobileDevice ? 'PROJETAR NA MESA (AR)' : 'PROJETAR NA MESA'}</span>
                <Sparkles className="w-3 h-3 text-yellow-200 animate-pulse" />
              </div>
              <div className="text-[10px] text-amber-100 font-normal">
                {isMobileDevice ? 'Apple Quick Look & Google AR' : 'Escanear QR Code no celular'}
              </div>
            </div>
          </div>

          {isMobileDevice ? (
            <Smartphone className="w-5 h-5 text-white/90 animate-pulse-subtle flex-shrink-0" />
          ) : (
            <div className="p-1 rounded-lg bg-black/20 text-amber-200 flex items-center gap-1 text-[10px] font-bold flex-shrink-0">
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">QR Code</span>
            </div>
          )}
        </button>

        {/* Live Camera Direct Button for 100% device compatibility */}
        {onOpenLiveCamera && isMobileDevice && (
          <button
            type="button"
            onClick={handleLaunchLiveCamera}
            className="py-3 px-3.5 bg-[#161412]/95 hover:bg-[#1E1B18] text-amber-300 font-bold rounded-2xl border border-amber-500/40 shadow-xl flex items-center justify-center gap-1.5 text-xs transition-all active:scale-95 flex-shrink-0"
            title="Abrir Câmera ao Vivo com Radar de Mesa no Navegador"
          >
            <Scan className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-[11px]">Câmera Web</span>
          </button>
        )}
      </div>

      {/* Floating Viewport Controls */}
      {showControls && (
        <div className="absolute right-3.5 top-14 flex flex-col gap-2 z-20">
          
          {/* Scale Adjuster Toggle Button */}
          <div className="relative">
            <button
              onClick={() => setShowScaleMenu(!showScaleMenu)}
              title="Ajustar Tamanho / Escala do Prato"
              className={`p-2.5 rounded-xl border backdrop-blur-md transition-all shadow-xl flex items-center justify-center ${
                showScaleMenu 
                  ? 'bg-amber-600 text-white border-amber-400' 
                  : 'bg-[#161412]/90 border-[#2B2723] text-amber-400 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Scale Presets Popover Menu */}
            {showScaleMenu && (
              <div className="absolute right-full mr-2.5 top-0 bg-[#161412] border border-amber-500/40 rounded-2xl p-3 shadow-2xl space-y-2.5 w-48 text-xs animate-fade-in z-30">
                <div className="flex items-center justify-between text-[11px] font-bold text-white">
                  <span>Escala do Objeto</span>
                  <span className="text-amber-400 font-mono">{Math.round(currentScale * 100)}%</span>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min="0.1"
                  max="1.2"
                  step="0.05"
                  value={currentScale}
                  onChange={(e) => handleUpdateScale(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-[#0C0B0A] rounded-lg"
                />

                {/* Quick Presets */}
                <div className="grid grid-cols-3 gap-1 pt-1 border-t border-[#1E1B18]">
                  <button
                    onClick={() => handleUpdateScale(0.25)}
                    className="py-1 rounded-lg bg-[#0C0B0A] hover:bg-amber-600 text-[10px] font-bold text-slate-300 hover:text-white"
                  >
                    25% (Pequeno)
                  </button>
                  <button
                    onClick={() => handleUpdateScale(0.38)}
                    className="py-1 rounded-lg bg-[#0C0B0A] hover:bg-amber-600 text-[10px] font-bold text-slate-300 hover:text-white"
                  >
                    38% (Prato)
                  </button>
                  <button
                    onClick={() => handleUpdateScale(0.65)}
                    className="py-1 rounded-lg bg-[#0C0B0A] hover:bg-amber-600 text-[10px] font-bold text-slate-300 hover:text-white"
                  >
                    65% (Grande)
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={toggleRotation}
            title={isRotating ? 'Pausar rotação' : 'Ativar rotação'}
            className={`p-2.5 rounded-xl border backdrop-blur-md transition-all shadow-xl ${
              isRotating 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                : 'bg-[#161412]/90 border-[#2B2723] text-slate-400 hover:text-white'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          </button>

          <button
            onClick={cycleLighting}
            title={`Iluminação: ${lightingPreset.toUpperCase()}`}
            className="p-2.5 rounded-xl border bg-[#161412]/90 border-[#2B2723] text-slate-300 hover:text-white backdrop-blur-md transition-all shadow-xl flex items-center justify-center relative group/light"
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span className="absolute right-full mr-2 px-2 py-0.5 bg-[#0C0B0A] text-[10px] text-slate-200 rounded-lg border border-[#2B2723] whitespace-nowrap opacity-0 group-hover/light:opacity-100 transition-opacity pointer-events-none">
              Luz: {lightingPreset}
            </span>
          </button>

          <button
            onClick={handleResetCamera}
            title="Resetar Posição"
            className="p-2.5 rounded-xl border bg-[#161412]/90 border-[#2B2723] text-slate-300 hover:text-white backdrop-blur-md transition-all shadow-xl"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Interaction Help Hint */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] text-[#A39E93] bg-[#0C0B0A]/90 backdrop-blur-xs px-3 py-0.5 rounded-full border border-[#1E1B18] flex items-center gap-1 shadow-md font-light">
          <span>👆 Arraste 360° • Ajuste escala</span>
        </span>
      </div>
    </div>
  );
};
