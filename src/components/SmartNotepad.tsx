import React, { useState, useEffect, useRef } from 'react';
import { Edit3, X, FileText, Clock, Save, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface SmartNotepadProps {
  videoId: string;
  initialNotes: string;
  onSeek: (seconds: number) => void;
  onClose?: () => void;
  onSave?: (videoId: string, newNotes: string) => void;
  getCurrentTime?: () => Promise<number>;
}

export function SmartNotepad({ videoId, initialNotes, onSeek, onClose, onSave, getCurrentTime }: SmartNotepadProps) {
  const [notes, setNotes] = useState(initialNotes || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-focus when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const saveNotes = async () => {
    setIsSaving(true);
    try {
      await api.put(`/videos/${videoId}/notes`, { notes });
      if (onSave) onSave(videoId, notes);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save notes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    } else if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      saveNotes();
    }
  };

  const insertTimestamp = async () => {
    if (!getCurrentTime || !textareaRef.current) return;
    
    try {
      const time = await getCurrentTime();
      
      const h = Math.floor(time / 3600);
      const m = Math.floor((time % 3600) / 60);
      const s = Math.floor(time % 60);
      
      let timeStr = "";
      if (h > 0) {
        timeStr = `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      } else {
        timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      }
      
      const isNotesEmpty = notes.trim() === '';
      let prefix = '';
      if (!isNotesEmpty) {
        if (notes.endsWith('\n\n')) {
          prefix = '';
        } else if (notes.endsWith('\n')) {
          prefix = '\n';
        } else {
          prefix = '\n\n';
        }
      }
      
      const insertText = `${prefix}${timeStr} - `;
      const newText = `${notes}${insertText}`;
      
      setNotes(newText);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newCursor = newText.length;
          textareaRef.current.setSelectionRange(newCursor, newCursor);
        }
      }, 10);
    } catch (err) {
      console.error("Could not get current time", err);
    }
  };

  // Parse text to find timestamps (e.g. 1:20, 04:15, 1:05:30)
  const renderParsedNotes = (text: string) => {
    if (!text) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-zinc-500 opacity-60 mt-10">
          <FileText size={48} className="mb-4" />
          <p>No notes yet.</p>
          <p className="text-sm">Click edit to add some!</p>
        </div>
      );
    }

    const timestampRegex = /\b(?:([0-9]{1,2}):)?([0-9]{1,2}):([0-9]{2})\b/g;
    
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = timestampRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const matchStr = match[0];
      const hours = match[1] ? parseInt(match[1], 10) : 0;
      const minutes = parseInt(match[2], 10);
      const seconds = parseInt(match[3], 10);
      
      const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

      parts.push(
        <button
          key={`ts-${match.index}`}
          onClick={() => onSeek(totalSeconds)}
          className="inline-flex items-center gap-1 font-mono text-sm bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/20 hover:bg-emerald-500/30 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
          title={`Jump to ${matchStr}`}
        >
          <Clock size={12} />
          {matchStr}
        </button>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return (
      <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {parts.map((part, i) => <React.Fragment key={i}>{part}</React.Fragment>)}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 w-full animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
        <h3 className="font-bold flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
          <FileText size={18} className="text-emerald-500" />
          Smart Notes
        </h3>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              onClick={saveNotes}
              disabled={isSaving}
              className="p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors flex items-center gap-2 text-sm font-semibold disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors text-zinc-700 dark:text-zinc-300"
              title="Edit notes"
            >
              <Edit3 size={16} />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
              title="Close notes"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto flex flex-col relative custom-scrollbar">
        {isEditing ? (
          <div className="flex flex-col h-full bg-zinc-50/50 dark:bg-zinc-950/50">
            {getCurrentTime && (
              <div className="p-2 border-b border-black/5 dark:border-white/5 bg-white dark:bg-zinc-900 sticky top-0 z-10 flex gap-2">
                <button
                  onClick={insertTimestamp}
                  className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30 rounded-lg transition-colors"
                >
                  <Clock size={14} />
                  Insert Time
                </button>
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your notes here... Click 'Insert Time' to add a clickable timestamp!"
              className="flex-1 w-full min-h-[300px] p-4 resize-none outline-none bg-transparent text-sm leading-relaxed text-zinc-800 dark:text-zinc-200"
            />
          </div>
        ) : (
          <div className="p-4">
            {renderParsedNotes(notes)}
          </div>
        )}
      </div>
      
      {isEditing && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border-t border-emerald-200 dark:border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400">
          <span className="font-semibold">Tip:</span> Type a time like <code className="bg-emerald-200 dark:bg-emerald-500/30 px-1 rounded">01:25</code> and it will become a clickable link to jump the video to that exact second!
        </div>
      )}
    </div>
  );
}
