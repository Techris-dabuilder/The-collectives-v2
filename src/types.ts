export interface VideoItem {
  id: string;
  file: File;
  isFavorite: boolean;
}

declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}
