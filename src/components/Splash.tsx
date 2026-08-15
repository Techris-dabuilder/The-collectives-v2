import { motion } from 'motion/react';
import { useEffect } from 'react';

export function Splash({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] w-full bg-black">
      {/* Animated Stroke Container */}
      <div className="relative mb-6 flex justify-center items-center h-32 w-full">
        <svg viewBox="0 0 300 100" className="absolute w-64 h-24">
          <motion.path
            d="M 50,50 C 50,20 80,20 80,50 C 80,80 110,80 110,50 C 110,20 140,20 140,50 C 140,80 170,80 170,50"
            fill="transparent"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.5, ease: "easeInOut", times: [0, 0.2, 0.8, 1] }}
          />
        </svg>
        <motion.div
          initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
          transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
          className="absolute text-white text-7xl font-bold z-10"
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          hello
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1, ease: "easeOut" }}
        className="text-gray-400 tracking-[0.3em] uppercase text-xs font-semibold"
      >
        The collectives
      </motion.div>
    </div>
  );
}
