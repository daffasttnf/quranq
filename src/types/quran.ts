export interface Verse {
  number: number;
  text: string;
  translation: string;
  tafsir: string;
  audioUrl: string;
  surah?: number;
}

export interface Surah {
  number: number;
  name: string;
  nameArabic: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface AudioPlayer {
  isPlaying: boolean;
  currentAudio: HTMLAudioElement | null;
  currentVerseIndex: number;
  isAutoPlaying: boolean;
}

export interface Bookmark {
  surah: number;
  verse: number;
  note: string;
  timestamp: string;
}

export interface QuranState {
  currentSurah: number;
  currentVerse: number;
  searchQuery: string;
  view: 'surah' | 'juz';
  selectedJuz: number;
  bookmarks: Bookmark[];
  surahs: Surah[];
  currentVerses: Verse[];
  isLoading: boolean;
  error: string | null;
  isSidebarOpen: boolean;
  audioPlayer: AudioPlayer;
  toggleSidebar: () => void;
  setCurrentSurah: (surah: number) => Promise<void>;
  setCurrentVerse: (verse: number) => void;
  setSearchQuery: (query: string) => void;
  setView: (view: 'surah' | 'juz') => Promise<void>;
  setSelectedJuz: (juz: number) => Promise<void>;
  toggleBookmark: (surah: number, verse: number, note?: string) => void;
  updateBookmarkNote: (surah: number, verse: number, note: string) => void;
  initializeSurahList: () => Promise<void>;
  playAudio: (verseIndex: number, autoPlay?: boolean) => void;
  pauseAudio: () => void;
  toggleAutoPlay: () => void;
}