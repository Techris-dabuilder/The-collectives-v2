import { motion, AnimatePresence } from 'motion/react';

export function BottomSheet({ 
  isOpen, 
  onClose, 
  onConfirm 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 z-40 pointer-events-auto backdrop-blur-sm"
            onPointerDown={(e) => { e.stopPropagation(); onClose(); }}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-[#1C1C1E] rounded-t-3xl z-50 p-6 pointer-events-auto shadow-2xl pb-10"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-6" />
            <h3 className="text-white font-semibold text-xl text-center mb-2">Delete Video</h3>
            <p className="text-gray-400 text-center mb-8 px-4">
              Are you sure you want to remove this video from The collectives feed?
            </p>
            <button
              className="w-full bg-[#FF3B30] text-white font-semibold text-lg py-4 rounded-xl mb-3 active:bg-red-700 transition-colors"
              onClick={onConfirm}
            >
              Delete
            </button>
            <button
              className="w-full bg-[#2C2C2E] text-[#0A84FF] font-semibold text-lg py-4 rounded-xl active:bg-gray-700 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
