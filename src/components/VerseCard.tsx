import React, { useState } from 'react';
import { BookOpen, MessageSquare, Bookmark, Play, Pause, ChevronDown, ChevronUp, PencilLine } from 'lucide-react';
import { useQuranStore } from '../store/quranStore';
import type { Verse } from '../types/quran';

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
    audioPlayer 
  } = useQuranStore();
  
  const [showTafsir, setShowTafsir] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState('');
  
  const bookmark = bookmarks.find(
    (b) => b.surah === surahNumber && b.verse === verse.number
  );
  
  const isPlaying = audioPlayer.currentVerseIndex === index && audioPlayer.isPlaying;

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
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium px-2.5 py-0.5 rounded">
          {surahNumber}:{verse.number}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleAudioClick}
            className={`p-1.5 rounded-lg ${
              isPlaying
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
            }`}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button
            onClick={handleBookmark}
            className={`p-1.5 rounded-lg ${
              bookmark
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
            }`}
          >
            <Bookmark className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowNoteInput(!showNoteInput)}
            className={`p-1.5 rounded-lg ${
              showNoteInput
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
            }`}
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

      <p className="text-right mb-4 font-arabic text-3xl leading-loose">
        {verse.text}
      </p>

      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {verse.translation}
      </p>

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
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
            {verse.tafsir}
          </p>
        )}
      </div>
    </div>
  );
}