import React, { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { AudioPlayer } from './components/AudioPlayer';
import { ThemeToggle } from './components/ThemeToggle';
import { VerseCard } from './components/VerseCard';
import { useQuranStore } from './store/quranStore';
import { Loader2, Menu } from 'lucide-react';

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
    toggleSidebar
  } = useQuranStore();

  useEffect(() => {
    setCurrentSurah(1);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar />
      
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} p-8 pb-24`}>
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
              {currentVerses.map((verse, index) => (
                <VerseCard 
                  key={`${verse.surah || currentSurah}-${verse.number}`}
                  verse={verse}
                  surahNumber={verse.surah || currentSurah}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <AudioPlayer />
    </div>
  );
}

export default App;