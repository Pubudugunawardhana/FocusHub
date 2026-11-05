import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, PlayCircle, Trash2, GripHorizontal } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  youtubeId: string;
  thumbnail?: string;
  duration?: string;
  status: string;
}

interface SortableVideoCardProps {
  video: Video;
  onPlay: (youtubeId: string) => void;
  onDelete: (id: string) => void;
  statusDropdown: React.ReactNode;
}

export function SortableVideoCard({ video, onPlay, onDelete, statusDropdown }: SortableVideoCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: video.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.8 : 1,
    position: 'relative' as const,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`group flex flex-col bg-white dark:bg-zinc-950 border ${isDragging ? 'border-emerald-500 shadow-2xl scale-[1.02]' : 'border-black/10 dark:border-white/10 shadow-lg'} rounded-3xl overflow-hidden hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 relative`}
    >
      <div className="absolute top-2 left-2 z-20 cursor-grab active:cursor-grabbing p-1.5 bg-black/40 backdrop-blur-md rounded-lg text-white/70 hover:text-white hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100" {...attributes} {...listeners}>
        <GripHorizontal size={18} />
      </div>

      <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={video.thumbnail || `https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg`} 
          alt={video.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        
        {video.duration && video.duration !== '00:00' && (
          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 shadow-lg border border-white/10 pointer-events-none">
            <Clock size={12} /> {video.duration}
          </div>
        )}
        
        <button 
          onClick={() => onPlay(video.youtubeId)}
          className="absolute inset-0 flex items-center justify-center w-full h-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 cursor-pointer"
        >
          <div className="bg-emerald-600/90 backdrop-blur-md rounded-full p-4 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-emerald-500 hover:scale-110">
            <PlayCircle size={28} className="text-white fill-white/20" />
          </div>
        </button>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-zinc-900 dark:text-white text-[15px] mb-4 line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" title={video.title}>
          {video.title}
        </h3>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5 relative z-20">
          {statusDropdown}
          
          <button 
            onClick={() => onDelete(video.id)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-500/30 border border-transparent transition-all"
            title="Remove video"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
