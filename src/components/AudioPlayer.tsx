import React from 'react';
import { Pause, Play, SkipBack, SkipForward, Repeat } from 'lucide-react';
import { cn } from '../lib/utils';
import { useQuranStore } from '../store/quranStore';

export function AudioPlayer() {
  const { 
    audioPlayer, 
    currentVerses,
    playAudio,
    pauseAudio,
    toggleAutoPlay
  } = useQuranStore();

  const handlePrevious = () => {
    if (audioPlayer.currentVerseIndex > 0) {
      playAudio(audioPlayer.currentVerseIndex - 1, audioPlayer.isAutoPlaying);
    }
  };

  const handleNext = () => {
    if (audioPlayer.currentVerseIndex < currentVerses.length - 1) {
      playAudio(audioPlayer.currentVerseIndex + 1, audioPlayer.isAutoPlaying);
    }
  };

  const handlePlayPause = () => {
    if (audioPlayer.isPlaying) {
      pauseAudio();
    } else {
      playAudio(
        audioPlayer.currentVerseIndex !== -1 ? audioPlayer.currentVerseIndex : 0,
        audioPlayer.isAutoPlaying
      );
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrevious}
            disabled={audioPlayer.currentVerseIndex <= 0}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            <SkipBack className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <button
            onClick={handlePlayPause}
            className={cn(
              "p-3 rounded-full",
              audioPlayer.isPlaying
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-emerald-600 text-white dark:bg-emerald-500"
            )}
          >
            {audioPlayer.isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </button>
          
          <button 
            onClick={handleNext}
            disabled={audioPlayer.currentVerseIndex >= currentVerses.length - 1}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            <SkipForward className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>

          <button
            onClick={toggleAutoPlay}
            className={cn(
              "p-2 rounded-full",
              audioPlayer.isAutoPlaying
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <Repeat className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 mx-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {audioPlayer.currentVerseIndex !== -1 ? (
              <>Ayat {currentVerses[audioPlayer.currentVerseIndex]?.number}</>
            ) : (
              'Pilih ayat untuk diputar'
            )}
          </div>
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div 
              className="h-full bg-emerald-500 rounded-full" 
              style={{ 
                width: `${((audioPlayer.currentVerseIndex + 1) / currentVerses.length) * 100}%`
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}