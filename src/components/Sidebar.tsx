import React, { useEffect } from 'react';
import { Book, Search, BookOpen, Layers, ChevronLeft, Bookmark, Settings } from 'lucide-react';
import { useQuranStore } from '../store/quranStore';
import { cn } from '../lib/utils';

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
    bookmarks,
    readingMode,
    setReadingMode
  } = useQuranStore();

  useEffect(() => {
    initializeSurahList();
  }, []);

  return (
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
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 lg:hidden"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mode Baca</span>
        </div>
        <div className="space-y-1">
          <button
            onClick={() => setReadingMode('arabic-only')}
            className={cn(
              "w-full text-left px-3 py-2 text-sm rounded-lg",
              readingMode === 'arabic-only'
                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
          >
            Teks Arab
          </button>
          <button
            onClick={() => setReadingMode('with-translation')}
            className={cn(
              "w-full text-left px-3 py-2 text-sm rounded-lg",
              readingMode === 'with-translation'
                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
          >
            Teks Arab & Terjemahan
          </button>
          <button
            onClick={() => setReadingMode('with-tajweed')}
            className={cn(
              "w-full text-left px-3 py-2 text-sm rounded-lg",
              readingMode === 'with-tajweed'
                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
          >
            Teks Arab, Terjemahan & Tajwid
          </button>
        </div>
      </div>

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

      <div className="space-y-1 mb-6">
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
                <div className="font-arabic text-lg">{surah.name}</div>
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

      {bookmarks.length > 0 && (
        <div className="border-t dark:border-gray-800 pt-4">
          <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Bookmark className="h-4 w-4" />
            <span>Penanda</span>
            <span className="ml-auto bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs px-2 py-0.5 rounded-full">
              {bookmarks.length}
            </span>
          </div>
          <div className="space-y-1 mt-2">
            {bookmarks.map((bookmark) => (
              <button
                key={`${bookmark.surah}-${bookmark.verse}`}
                onClick={() => {
                  setCurrentSurah(bookmark.surah);
                  if (window.innerWidth < 1024) {
                    toggleSidebar();
                  }
                }}
                className="w-full flex items-start gap-2 px-3 py-2 text-sm rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <span className="shrink-0">
                  {bookmark.surah}:{bookmark.verse}
                </span>
                {bookmark.note && (
                  <span className="text-xs text-gray-500 truncate">
                    - {bookmark.note}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}