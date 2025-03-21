import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuranState, ReadingMode, Settings } from '../types/quran';
import { fetchSurah, fetchJuz, fetchSurahList } from '../services/quranAPI';
import { toPng } from 'html-to-image';

const defaultSettings: Settings = {
  font: 'Amiri',
  reciter: 'ar.alafasy',
  fontSize: 32
};

export const useQuranStore = create<QuranState>()(
  persist(
    (set, get) => ({
      currentSurah: 1,
      currentVerse: 1,
      searchQuery: '',
      view: 'surah',
      selectedJuz: 1,
      bookmarks: [],
      surahs: [],
      currentVerses: [],
      isLoading: false,
      error: null,
      isSidebarOpen: true,
      currentSurahInfo: null,
      readingMode: 'with-translation',
      settings: defaultSettings,
      audioPlayer: {
        isPlaying: false,
        currentAudio: null,
        currentVerseIndex: -1,
        isAutoPlaying: false
      },

      filteredSurahs: [],

      toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),

      setCurrentSurah: async (surah: number) => {
        set({ isLoading: true, error: null });
        try {
          const surahData = await fetchSurah(surah, get().settings.reciter);
          set({ 
            currentSurah: surah,
            currentVerses: surahData.verses,
            currentSurahInfo: {
              number: surahData.number,
              name: surahData.name,
              nameArabic: surahData.nameArabic,
              englishName: surahData.name,
              englishNameTranslation: surahData.nameTranslation,
              numberOfAyahs: surahData.verses.length,
              revelationType: surahData.revelationType
            },
            isLoading: false 
          });
        } catch (error) {
          set({ error: 'Failed to load surah', isLoading: false });
        }
      },

      setCurrentVerse: (verse: number) => set({ currentVerse: verse }),
      
      setSearchQuery: (query: string) => {
        const normalizedQuery = query.toLowerCase();
        set((state) => ({
          searchQuery: query,
          filteredSurahs: state.surahs.filter((surah) =>
            surah.englishName.toLowerCase().includes(normalizedQuery) ||
            surah.number.toString().includes(normalizedQuery)
          )
        }));
      },
      
      setView: async (view: 'surah' | 'juz') => {
        set({ view, isLoading: true, error: null });
        try {
          if (view === 'surah') {
            const surahData = await fetchSurah(get().currentSurah, get().settings.reciter);
            set({ currentVerses: surahData.verses });
          } else {
            const juzVerses = await fetchJuz(get().selectedJuz, get().settings.reciter);
            set({ currentVerses: juzVerses });
          }
          set({ isLoading: false });
        } catch (error) {
          set({ error: 'Failed to load content', isLoading: false });
        }
      },

      setSelectedJuz: async (juz: number) => {
        set({ isLoading: true, error: null });
        try {
          const juzVerses = await fetchJuz(juz, get().settings.reciter);
          set({ 
            selectedJuz: juz,
            currentVerses: juzVerses,
            isLoading: false 
          });
        } catch (error) {
          set({ error: 'Failed to load juz', isLoading: false });
        }
      },

      toggleBookmark: (surah: number, verse: number, note: string = '') =>
        set((state) => {
          const existingBookmark = state.bookmarks.find(
            (b) => b.surah === surah && b.verse === verse
          );
          
          if (existingBookmark) {
            return {
              bookmarks: state.bookmarks.filter(
                (b) => !(b.surah === surah && b.verse === verse)
              ),
            };
          }
          
          return {
            bookmarks: [...state.bookmarks, { surah, verse, note, timestamp: new Date().toISOString() }],
          };
        }),

      updateBookmarkNote: (surah: number, verse: number, note: string) =>
        set((state) => ({
          bookmarks: state.bookmarks.map((bookmark) =>
            bookmark.surah === surah && bookmark.verse === verse
              ? { ...bookmark, note }
              : bookmark
          ),
        })),

      initializeSurahList: async () => {
        try {
          const surahList = await fetchSurahList();
          set({ 
            surahs: surahList,
            filteredSurahs: surahList 
          });
        } catch (error) {
          set({ error: 'Failed to load surah list' });
        }
      },

      playAudio: (verseIndex: number, autoPlay: boolean = false) => {
        const state = get();
        const verse = state.currentVerses[verseIndex];
        
        if (state.audioPlayer.currentAudio) {
          state.audioPlayer.currentAudio.pause();
        }

        const audio = new Audio(verse.audioUrl);
        
        audio.onended = () => {
          const nextIndex = verseIndex + 1;
          if (autoPlay && nextIndex < state.currentVerses.length) {
            get().playAudio(nextIndex, true);
          } else {
            set((state) => ({
              audioPlayer: {
                ...state.audioPlayer,
                isPlaying: false,
                currentVerseIndex: -1,
                isAutoPlaying: false
              }
            }));
          }
        };

        audio.play();
        set({
          audioPlayer: {
            isPlaying: true,
            currentAudio: audio,
            currentVerseIndex: verseIndex,
            isAutoPlaying: autoPlay
          }
        });
      },

      pauseAudio: () => {
        const state = get();
        if (state.audioPlayer.currentAudio) {
          state.audioPlayer.currentAudio.pause();
          set((state) => ({
            audioPlayer: {
              ...state.audioPlayer,
              isPlaying: false,
              isAutoPlaying: false
            }
          }));
        }
      },

      toggleAutoPlay: () => {
        const state = get();
        if (state.audioPlayer.isAutoPlaying) {
          state.pauseAudio();
        } else {
          state.playAudio(state.audioPlayer.currentVerseIndex !== -1 ? state.audioPlayer.currentVerseIndex : 0, true);
        }
      },

      setReadingMode: (mode: ReadingMode) => set({ readingMode: mode }),

      updateSettings: (newSettings: Partial<Settings>) => 
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),

      shareVerse: async (verse: Verse, surahNumber: number) => {
        const node = document.createElement('div');
        node.className = 'bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-lg text-white';
        node.innerHTML = `
          <div class="text-right mb-4 font-arabic text-4xl leading-loose">${verse.text}</div>
          <div class="text-lg mb-2">${verse.translation}</div>
          <div class="text-sm opacity-75">QS ${surahNumber}:${verse.number}</div>
          <div class="text-xs mt-4 opacity-50">Shared via QuranQ</div>
        `;
        document.body.appendChild(node);

        try {
          const dataUrl = await toPng(node);
          const link = document.createElement('a');
          link.download = `quran-${surahNumber}-${verse.number}.png`;
          link.href = dataUrl;
          link.click();
        } catch (error) {
          console.error('Error sharing verse:', error);
        }

        document.body.removeChild(node);
      }
    }),
    {
      name: 'quran-store',
      partialize: (state) => ({
        bookmarks: state.bookmarks,
        currentSurah: state.currentSurah,
        selectedJuz: state.selectedJuz,
        view: state.view,
        readingMode: state.readingMode,
        settings: state.settings
      }),
    }
  )
);