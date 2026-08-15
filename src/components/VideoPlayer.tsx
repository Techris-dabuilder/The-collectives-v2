import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Play } from 'lucide-react';
import { VideoItem } from '../types';
import { BottomSheet } from './BottomSheet';

export function VideoPlayer({ 
  item, 
  isActive, 
  onDelete 
}: { 
  item: VideoItem; 
  isActive: boolean; 
  onDelete: () => void; 
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [showHeart, setShowHeart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(item.isFavorite);
  const [showDelete, setShowDelete] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Tap Tracking
  const lastTapTime = useRef(0);
  const consecutiveTaps = useRef(0);

  useEffect(() => {
    const url = URL.createObjectURL(item.file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [item.file]);

  useEffect(() => {
    if (isActive) {
      // Small delay prevents play() interrupt errors on rapid scrolling
      const playPromise = videoRef.current?.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => setIsPlaying(false));
      }
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
      if (videoRef.current) videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const m = Math.floor(Math.max(0, time) / 60);
    const s = Math.floor(Math.max(0, time) % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const updateSeek = (e: React.PointerEvent<HTMLDivElement>) => {
    if (videoRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      videoRef.current.currentTime = pos * duration;
      setCurrentTime(pos * duration);
    }
  };

  const handleSeekDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(true);
    updateSeek(e);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleSeekMove = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isDragging) {
      updateSeek(e);
    }
  };

  const handleSeekUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(e => console.error(e));
        setIsPlaying(true);
      }
    }
  };

  const handlePointerDown = () => {
    const now = Date.now();
    // 500ms window to chain taps
    if (now - lastTapTime.current > 500) {
      consecutiveTaps.current = 0;
    }
    consecutiveTaps.current += 1;
    lastTapTime.current = now;

    if (consecutiveTaps.current === 1) {
      togglePlay();
    } else if (consecutiveTaps.current === 2) {
      togglePlay(); // reverts the 1st tap toggle to keep state continuous
      setIsFavorite(true);
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1000);
    } else if (consecutiveTaps.current === 3) {
      togglePlay(); // reverts the 2nd tap toggle
      setShowDelete(true);
      consecutiveTaps.current = 0;
    }
  };

  return (
    <div 
      className="relative w-full h-[100dvh] flex items-center justify-center bg-black overflow-hidden" 
      onPointerDown={handlePointerDown}
    >
      <video
        ref={videoRef}
        src={src || undefined}
        loop
        playsInline
        className="w-full h-[100dvh] object-cover"
        onTimeUpdate={(e) => {
          if (!isDragging) setCurrentTime(e.currentTarget.currentTime);
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />

      {/* Play Indicator Overlay */}
      <AnimatePresence>
        {!isPlaying && !showDelete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-20 h-20 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-md">
              <Play className="w-10 h-10 text-white translate-x-1" fill="white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar Overlay */}
      <AnimatePresence>
        {!isPlaying && !showDelete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 left-0 right-0 px-8 z-20"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 bg-black/60 backdrop-blur-xl px-5 py-4 rounded-3xl border border-white/10 shadow-2xl">
              <span className="text-white text-sm font-mono opacity-80 min-w-[40px] text-right">
                {formatTime(currentTime)}
              </span>
              <div 
                className="flex-1 h-10 -my-3 flex items-center cursor-pointer group touch-none"
                onPointerDown={handleSeekDown}
                onPointerMove={handleSeekMove}
                onPointerUp={handleSeekUp}
                onPointerCancel={handleSeekUp}
              >
                <div className="w-full h-2.5 bg-white/20 rounded-full relative overflow-hidden transition-transform group-active:scale-y-125">
                  <div 
                    className="absolute top-0 left-0 bottom-0 bg-white rounded-full pointer-events-none"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <span className="text-white text-sm font-mono opacity-80 min-w-[50px]">
                -{formatTime(duration - currentTime)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Double Tap Heart Overlay */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
            animate={{ opacity: 1, scale: 1.2, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <Heart className="w-32 h-32 text-red-500" fill="currentColor" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Favorite Icon */}
      <AnimatePresence>
        {isFavorite && (
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-10 right-4 pointer-events-none z-10"
          >
            <Heart className="w-10 h-10 text-red-500 drop-shadow-2xl" fill="currentColor" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Sheet */}
      <BottomSheet
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => {
          setShowDelete(false);
          onDelete();
        }}
      />
    </div>
  );
}
