import { useState, useRef } from 'react';
import { VideoItem } from '../types';
import { VideoPlayer } from './VideoPlayer';
import { motion } from 'motion/react';

export function Feed({ videos, onDelete }: { videos: VideoItem[], onDelete: (id: string) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!containerRef.current) return;
    // Calculate which item is taking up the majority of the view
    const index = Math.round(containerRef.current.scrollTop / containerRef.current.clientHeight);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  if (videos.length === 0) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-black text-gray-500">
        No videos remaining.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      ref={containerRef}
      onScroll={handleScroll}
      className="h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black"
    >
      {videos.map((item, index) => {
        // Enforce 3-Player Pool Memory Constraint:
        // Only render the current, previous, and next videos to DOM.
        // Unmounted items automatically release their ObjectURLs, keeping memory < 150MB.
        const isVisible = Math.abs(currentIndex - index) <= 1;
        
        return (
          <div 
            key={item.id} 
            className="h-[100dvh] w-full snap-start relative flex items-center justify-center bg-black"
          >
            {isVisible ? (
              <VideoPlayer
                item={item}
                isActive={currentIndex === index}
                onDelete={() => onDelete(item.id)}
              />
            ) : null}
          </div>
        );
      })}
    </motion.div>
  );
}
