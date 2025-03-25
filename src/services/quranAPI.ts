import axios from 'axios';

const BASE_URL = 'https://api.alquran.cloud/v1';

export const fetchSurah = async (surahNumber: number) => {
  const [surahData, translation, tafsir] = await Promise.all([
    axios.get(`${BASE_URL}/surah/${surahNumber}/ar.alafasy`),
    axios.get(`${BASE_URL}/surah/${surahNumber}/id.indonesian`),
    axios.get(`${BASE_URL}/surah/${surahNumber}/id.kemenag`)
  ]);

  const verses = surahData.data.data.ayahs.map((ayah: any, index: number) => ({
    number: ayah.numberInSurah,
    text: ayah.text,
    translation: translation.data.data.ayahs[index].text,
    tafsir: tafsir.data.data.ayahs[index].text,
    audioUrl: ayah.audio
  }));

  return {
    number: surahData.data.data.number,
    name: surahData.data.data.englishName,
    nameArabic: surahData.data.data.name,
    verses
  };
};

export const fetchJuz = async (juzNumber: number) => {
  const [juzData, translation, tafsir] = await Promise.all([
    axios.get(`${BASE_URL}/juz/${juzNumber}/ar.alafasy`),
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
  return response.data.data;
};