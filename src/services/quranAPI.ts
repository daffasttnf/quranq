import axios from 'axios';

const BASE_URL = 'https://api.alquran.cloud/v1';

export const fetchSurah = async (surahNumber: number, reciter: string = 'ar.alafasy') => {
  const [surahData, translation, tafsir] = await Promise.all([
    axios.get(`${BASE_URL}/surah/${surahNumber}/${reciter}`),
    axios.get(`${BASE_URL}/surah/${surahNumber}/id.indonesian`),
    axios.get(`${BASE_URL}/surah/${surahNumber}/id.kemenag`)
  ]);

  const verses = surahData.data.data.ayahs.map((ayah: any, index: number) => ({
    number: ayah.numberInSurah,
    text: ayah.text,
    translation: translation.data.data.ayahs[index].text,
    tafsir: tafsir.data.data.ayahs[index].text,
    audioUrl: ayah.audio,
    surah: surahNumber
  }));

  return {
    number: surahData.data.data.number,
    name: surahData.data.data.englishName,
    nameArabic: surahData.data.data.name,
    nameTranslation: surahData.data.data.englishNameTranslation,
    revelationType: surahData.data.data.revelationType,
    verses
  };
};

export const fetchJuz = async (juzNumber: number, reciter: string = 'ar.alafasy') => {
  const [juzData, translation, tafsir] = await Promise.all([
    axios.get(`${BASE_URL}/juz/${juzNumber}/${reciter}`),
    axios.get(`${BASE_URL}/juz/${juzNumber}/id.indonesian`),
    axios.get(`${BASE_URL}/juz/${juzNumber}/id.kemenag`)
  ]);

  const verses = juzData.data.data.ayahs.map((ayah: any, index: number) => ({
    number: ayah.numberInSurah,
    surah: ayah.surah.number,
    text: ayah.text,
    translation: translation.data.data.ayahs[index].text,
    tafsir: tafsir.data.data.ayahs[index].text,
    audioUrl: ayah.audio
  }));

  return verses;
};

export const fetchSurahList = async () => {
  const response = await axios.get(`${BASE_URL}/surah`);
  return response.data.data.map((surah: any) => ({
    number: surah.number,
    name: surah.name,
    nameArabic: surah.name,
    englishName: surah.englishName,
    englishNameTranslation: surah.englishNameTranslation,
    numberOfAyahs: surah.numberOfAyahs,
    revelationType: surah.revelationType
  }));
};