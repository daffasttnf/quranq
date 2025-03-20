import React, { useEffect, useState, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { AudioPlayer } from './components/AudioPlayer';
import { ThemeToggle } from './components/ThemeToggle';
import { VerseCard } from './components/VerseCard';
import { useQuranStore } from './store/quranStore';
import { Loader2, Menu, ArrowUp } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { cn } from './lib/utils';

function App() {
  const { 
    view, 
    currentSurah, 
    selectedJuz, 
    searchQuery, 
    currentVerses,
    isLoading,
    error,
    setCurrentSurah,
    isSidebarOpen,
    toggleSidebar,
    audioPlayer,
    currentSurahInfo
  } = useQuranStore();

  const [visibleVerses, setVisibleVerses] = useState<number>(20);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  useEffect(() => {
    setCurrentSurah(1);
    // Close sidebar on mobile by default
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  }, []);

  useEffect(() => {
    if (inView && visibleVerses < currentVerses.length) {
      setVisibleVerses(prev => Math.min(prev + 20, currentVerses.length));
    }
  }, [inView, currentVerses.length]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to playing verse
  useEffect(() => {
    if (audioPlayer.currentVerseIndex !== -1) {
      const verseElement = document.getElementById(`verse-${audioPlayer.currentVerseIndex}`);
      if (verseElement) {
        verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [audioPlayer.currentVerseIndex]);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar />
      
      <main ref={mainRef} className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'} p-8 pb-32`}>
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h2 className="text-2xl font-bold">
                  {view === 'surah' ? `Surah ${currentSurah}` : `Juz ${selectedJuz}`}
                </h2>
                {searchQuery && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Hasil pencarian untuk: "{searchQuery}"
                  </p>
                )}
              </div>
            </div>
            <ThemeToggle />
          </div>

          {currentSurahInfo && view === 'surah' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-8 text-center">
              <h1 className="font-arabic text-4xl mb-2">{currentSurahInfo.nameArabic}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {currentSurahInfo.englishName} • {currentSurahInfo.englishNameTranslation}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                {currentSurahInfo.revelationType} • {currentSurahInfo.numberOfAyahs} Ayat
              </p>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">
              {error}
            </div>
          ) : (
            <div className="space-y-8">
              {currentVerses.slice(0, visibleVerses).map((verse, index) => (
                <VerseCard 
                  key={`${verse.surah || currentSurah}-${verse.number}`}
                  verse={verse}
                  surahNumber={verse.surah || currentSurah}
                  index={index}
                />
              ))}
              {visibleVerses < currentVerses.length && (
                <div ref={ref} className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <button
        onClick={handleBackToTop}
        className={cn(
          "fixed right-4 bottom-24 p-3 bg-emerald-600 text-white rounded-full shadow-lg transition-all duration-300 hover:bg-emerald-700",
          showBackToTop ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
        )}
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      <AudioPlayer />
    </div>
  );
}

export default App;