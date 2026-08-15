import { useState } from 'react';
import { Splash } from './components/Splash';
import { MediaPicker } from './components/MediaPicker';
import { Feed } from './components/Feed';
import { VideoItem } from './types';

type AppState = 'splash' | 'picker' | 'feed';

export default function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [videos, setVideos] = useState<VideoItem[]>([]);

  const handleFilesSelected = (files: File[]) => {
    // Note: This implements the web-adapted version of the Android Native request.
    // Instead of Android MediaStore, we use the File System API to index local files.
    
    // Instantly shuffle the URI array
    const shuffled = [...files].sort(() => Math.random() - 0.5);
    const items: VideoItem[] = shuffled.map((file, i) => ({
      id: `${file.name}-${i}-${Date.now()}`,
      file,
      isFavorite: false
    }));
    setVideos(items);
    setAppState('feed');
  };

  const handleDelete = (id: string) => {
    // Action sheet delete confirmation removes the video from the feed array.
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  return (
    <main className="bg-black w-full h-[100dvh] overflow-hidden text-white">
      {appState === 'splash' && <Splash onComplete={() => setAppState('picker')} />}
      {appState === 'picker' && <MediaPicker onSelect={handleFilesSelected} />}
      {appState === 'feed' && <Feed videos={videos} onDelete={handleDelete} />}
    </main>
  );
}
