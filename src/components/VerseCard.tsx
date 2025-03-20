import React, { useState, useEffect } from 'react';
import { MessageSquare, Bookmark, Play, Pause, ChevronDown, ChevronUp, PencilLine, Volume2 } from 'lucide-react';
import { useQuranStore } from '../store/quranStore';
import type { Verse } from '../types/quran';
import { cn } from '../lib/utils';

interface VerseCardProps {
  verse: Verse;
  surahNumber: number;
  index: number;
}

export function VerseCard({ verse, surahNumber, index }: VerseCardProps) {
  const { 
    bookmarks, 
    toggleBookmark, 
    updateBookmarkNote,
    playAudio, 
    pauseAudio, 
    audioPlayer,
    readingMode
  } = useQuranStore();
  
  const [showTafsir, setShowTafsir] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState('');
  const [audioProgress, setAudioProgress] = useState(0);
  
  const bookmark = bookmarks.find(
    (b) => b.surah === surahNumber && b.verse === verse.number
  );
  
  const isPlaying = audioPlayer.currentVerseIndex === index && audioPlayer.isPlaying;

  useEffect(() => {
    let progressInterval: number;
    if (isPlaying && audioPlayer.currentAudio) {
      progressInterval = window.setInterval(() => {
        const progress = (audioPlayer.currentAudio!.currentTime / audioPlayer.currentAudio!.duration) * 100;
        setAudioProgress(progress);
      }, 100);
    } else {
      setAudioProgress(0);
    }
    return () => clearInterval(progressInterval);
  }, [isPlaying, audioPlayer.currentAudio]);

  const handleAudioClick = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio(index);
    }
  };

  const handleBookmark = () => {
    toggleBookmark(surahNumber, verse.number, note);
    if (!bookmark && note) {
      setNote('');
      setShowNoteInput(false);
    }
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookmark) {
      updateBookmarkNote(surahNumber, verse.number, note);
    } else {
      toggleBookmark(surahNumber, verse.number, note);
    }
    setShowNoteInput(false);
  };

  return (
    <div 
      id={`verse-${index}`}
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors duration-300",
        isPlaying && "bg-emerald-50 dark:bg-emerald-900/20"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium px-2.5 py-0.5 rounded">
            {surahNumber}:{verse.number}
          </span>
          {isPlaying && (
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Volume2 className="h-4 w-4 animate-pulse" />
              <div className="space-x-0.5">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="inline-block w-0.5 h-2 bg-emerald-600 dark:bg-emerald-400 animate-waveform"
                    style={{
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAudioClick}
            className={cn(
              "p-1.5 rounded-lg",
              isPlaying
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            )}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button
            onClick={handleBookmark}
            className={cn(
              "p-1.5 rounded-lg",
              bookmark
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            )}
          >
            <Bookmark className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowNoteInput(!showNoteInput)}
            className={cn(
              "p-1.5 rounded-lg",
              showNoteInput
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            )}
          >
            <PencilLine className="h-5 w-5" />
          </button>
        </div>
      </div>

      {showNoteInput && (
        <form onSubmit={handleNoteSubmit} className="mb-4">
          <textarea
            value={note || bookmark?.note || ''}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tambahkan catatan..."
            className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-2"
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowNoteInput(false)}
              className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              Simpan
            </button>
          </div>
        </form>
      )}

      {bookmark?.note && !showNoteInput && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <p className="text-sm text-emerald-800 dark:text-emerald-200">{bookmark.note}</p>
        </div>
      )}

      <div className="relative">
        <p className="text-right mb-4 font-arabic text-3xl leading-loose">
          {verse.text}
        </p>
        {isPlaying && (
          <div 
            className="absolute bottom-0 left-0 h-0.5 bg-emerald-500 dark:bg-emerald-400 transition-all duration-200"
            style={{ width: `${audioProgress}%` }}
          />
        )}
      </div>

      {readingMode !== 'arabic-only' && (
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {verse.translation}
        </p>
      )}

      {readingMode === 'with-tajweed' && verse.tajweed && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Tajwid:</span> {verse.tajweed}
          </p>
        </div>
      )}

      <div className="border-t dark:border-gray-700 pt-4">
        <button
          onClick={() => setShowTafsir(!showTafsir)}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Tafsir</span>
          {showTafsir ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        
        {showTafsir && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {verse.tafsir}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}