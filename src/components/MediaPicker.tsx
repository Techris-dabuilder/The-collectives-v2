import { FolderOpen } from 'lucide-react';
import { motion } from 'motion/react';

export function MediaPicker({ onSelect }: { onSelect: (files: File[]) => void }) {
  const handleDirChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('video/'));
    if (files.length > 0) onSelect(files);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-[100dvh] w-full bg-black px-6 text-center"
    >
      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
        <FolderOpen className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Initialize Feed</h1>
      <p className="text-gray-400 mb-8 max-w-xs text-sm leading-relaxed">
        Select a local folder containing videos to generate your offline FYP feed. Files are kept locally and never uploaded.
      </p>
      <label className="bg-white text-black px-8 py-4 rounded-full font-semibold active:scale-95 transition-transform cursor-pointer">
        Select Media Folder
        <input
          type="file"
          webkitdirectory=""
          directory=""
          multiple
          accept="video/*"
          className="hidden"
          onChange={handleDirChange}
        />
      </label>
    </motion.div>
  );
}
