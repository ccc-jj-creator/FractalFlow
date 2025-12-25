import React, { useRef, useEffect } from 'react';
import { FractalMode } from '../types';

interface FractalPlayerProps {
  videoUrl: string;
  mode: FractalMode;
  className?: string;
  isPlaying: boolean;
}

const FractalPlayer: React.FC<FractalPlayerProps> = ({ videoUrl, mode, className, isPlaying }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(e => console.log('Autoplay prevented', e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Base video component
  const BaseVideo = () => (
    <video
      ref={videoRef}
      src={videoUrl}
      className="w-full h-full object-cover"
      loop
      muted
      playsInline
    />
  );

  // Render logic based on mode
  const renderContent = () => {
    switch (mode) {
      case FractalMode.RecursivePiP:
        return (
          <div className="relative w-full h-full overflow-hidden">
            <BaseVideo />
            {/* Recursive Layers */}
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-indigo-500/50 shadow-2xl overflow-hidden animate-pulse">
               <BaseVideo />
               <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-purple-500/50 shadow-xl overflow-hidden">
                  <BaseVideo />
               </div>
            </div>
          </div>
        );

      case FractalMode.GridRemix:
        return (
          <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
            <div className="w-full h-full overflow-hidden scale-x-[-1] filter hue-rotate-90"><BaseVideo /></div>
            <div className="w-full h-full overflow-hidden"><BaseVideo /></div>
            <div className="w-full h-full overflow-hidden scale-y-[-1]"><BaseVideo /></div>
            <div className="w-full h-full overflow-hidden filter hue-rotate-180"><BaseVideo /></div>
          </div>
        );

      case FractalMode.Kaleidoscope:
        return (
           <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-black">
              <div className="absolute w-full h-full opacity-50 scale-150 animate-[spin_10s_linear_infinite]">
                 <BaseVideo />
              </div>
              <div className="absolute w-full h-full opacity-50 scale-125 animate-[spin_15s_linear_infinite_reverse] mix-blend-screen">
                 <BaseVideo />
              </div>
              <div className="relative w-3/4 h-3/4 rounded-full overflow-hidden border-4 border-white/20 z-10">
                 <BaseVideo />
              </div>
           </div>
        );

      case FractalMode.TimeEcho:
        return (
          <div className="relative w-full h-full overflow-hidden bg-black">
            <div className="absolute inset-0 opacity-30 blur-sm scale-105">
              <BaseVideo />
            </div>
            <div className="absolute inset-0 opacity-50 blur-[2px] scale-102">
              <BaseVideo />
            </div>
            <div className="absolute inset-0">
              <BaseVideo />
            </div>
          </div>
        );

      default:
        return <BaseVideo />;
    }
  };

  return (
    <div className={`bg-black rounded-lg overflow-hidden shadow-2xl relative ${className}`}>
      {renderContent()}
      
      {/* Overlay indicator */}
      {mode !== FractalMode.None && (
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
          <span className="text-xs font-bold text-white uppercase tracking-wider">{mode}</span>
        </div>
      )}
    </div>
  );
};

export default FractalPlayer;
