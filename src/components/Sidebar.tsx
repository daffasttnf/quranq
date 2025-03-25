import React, { useEffect } from 'react';
import { Book, Search, BookOpen, Layers, ChevronLeft, Bookmark } from 'lucide-react';
import { useQuranStore } from '../store/quranStore';
import { cn } from '../lib/utils';
import { useSwipeable } from 'react-swipeable';
import { Settings } from './Settings';

export function Sidebar() {
  const {
    view,
    setView,
    searchQuery,
    setSearchQuery,
    currentSurah,
    setCurrentSurah,
    selectedJuz,
    setSelectedJuz,
    surahs,
    initializeSurahList,
    isSidebarOpen,
    toggleSidebar,
    filteredSurahs,
    bookmarks
  } = useQuranStore();

  useEffect(() => {
    initializeSurahList();
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (isSidebarOpen && window.innerWidth < 1024) {
        toggleSidebar();
      }
    },
    onSwipedRight: () => {
      if (!isSidebarOpen) {
        toggleSidebar();
      }
    }
  });

  return (
    <>
      <div {...handlers}>
        <div 
          className={cn(
            "fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 overflow-y-auto transition-all duration-300 z-50",
            isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:translate-x-0"
          )}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Book className="h-6 w-6 text-emerald-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">QuranQ</h1>
            </div>
            <div className="flex items-center gap-2">
              <Settings />
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 lg:hidden"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
          </div>

          {bookmarks.length > 0 && (
            <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Bookmark className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Penanda</span>
                <span className="ml-auto bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs px-2 py-0.5 rounded-full">
                  {bookmarks.length}
                </span>
              </div>
              <div className="space-y-2">
                {bookmarks.map((bookmark) => (
                  <button
                    key={`${bookmark.surah}-${bookmark.verse}`}
                    onClick={() => {
                      setCurrentSurah(bookmark.surah);
                      if (window.innerWidth < 1024) {
                        toggleSidebar();
                      }
                    }}
                    className="w-full flex items-start gap-2 px-3 py-2 text-sm rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800/30"
                  >
                    <span className="shrink-0">
                      {bookmark.surah}:{bookmark.verse}
                    </span>
                    {bookmark.note && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 truncate">
                        - {bookmark.note}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari surah..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setView('surah')}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-sm font-medium",
                view === 'surah'
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              <BookOpen className="h-4 w-4 mb-1 mx-auto" />
              Surah
            </button>
            <button
              onClick={() => setView('juz')}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-sm font-medium",
                view === 'juz'
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              <Layers className="h-4 w-4 mb-1 mx-auto" />
              Juz
            </button>
          </div>

          <div className="space-y-1">
            {view === 'surah' ? (
              filteredSurahs.map((surah) => (
                <button
                  key={surah.number}
                  onClick={() => {
                    setCurrentSurah(surah.number);
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                  className={cn(
                    "w-full flex items-start gap-3 px-3 py-2 text-sm font-medium rounded-lg",
                    currentSurah === surah.number
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  <span className="w-6 text-center mt-1">{surah.number}</span>
                  <div className="text-left">
                    <div className="font-arabic text-lg">{surah.nameArabic}</div>
                    <div className="text-xs text-gray-500">{surah.englishName}</div>
                  </div>
                </button>
              ))
            ) : (
              Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                <button
                  key={juz}
                  onClick={() => {
                    setSelectedJuz(juz);
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg",
                    selectedJuz === juz
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  <span className="w-6 text-center">{juz}</span>
                  <span>Juz {juz}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
      {isSidebarOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}