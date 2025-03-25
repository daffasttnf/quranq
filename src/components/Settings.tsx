import React from 'react';
import { Settings as SettingsIcon, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import * as Tabs from '@radix-ui/react-tabs';
import { useQuranStore } from '../store/quranStore';

const fonts = [
  { label: 'Amiri', value: 'Amiri' },
  { label: 'Scheherazade New', value: 'Scheherazade New' },
  { label: 'Noto Naskh Arabic', value: 'Noto Naskh Arabic' }
];

export function Settings() {
  const { settings, updateSettings, readingMode, setReadingMode } = useQuranStore();

  const handleFontChange = (value: string) => {
    updateSettings({ font: value });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ fontSize: parseInt(e.target.value) });
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <SettingsIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[60]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-[90vw] max-w-lg max-h-[85vh] overflow-y-auto z-[70]">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
              Pengaturan
            </Dialog.Title>
            <Dialog.Close className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <X className="h-5 w-5 text-gray-500" />
            </Dialog.Close>
          </div>

          <Tabs.Root defaultValue="display">
            <Tabs.List className="flex gap-2 mb-6">
              <Tabs.Trigger
                value="display"
                className="px-4 py-2 text-sm rounded-lg data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-900/20 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400"
              >
                Tampilan
              </Tabs.Trigger>
              <Tabs.Trigger
                value="about"
                className="px-4 py-2 text-sm rounded-lg data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-900/20 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400"
              >
                Tentang
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="display" className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mode Baca
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setReadingMode('arabic-only')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg ${
                      readingMode === 'arabic-only'
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    Teks Arab
                  </button>
                  <button
                    onClick={() => setReadingMode('with-translation')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg ${
                      readingMode === 'with-translation'
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    Teks Arab & Terjemahan
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Font Arab
                </label>
                <Select.Root value={settings.font} onValueChange={handleFontChange}>
                  <Select.Trigger className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                      <Select.Viewport>
                        {fonts.map((font) => (
                          <Select.Item
                            key={font.value}
                            value={font.value}
                            className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            <Select.ItemText>{font.label}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ukuran Font Arab
                </label>
                <input
                  type="range"
                  min="24"
                  max="48"
                  value={settings.fontSize}
                  onChange={handleFontSizeChange}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 mt-1">{settings.fontSize}px</div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="about" className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                QuranQ
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Dibuat oleh Muhamad Daffa Ariftama
              </p>
              <div className="space-y-2">
                <a
                  href="https://instagram.com/daffaariftamaa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Instagram: @daffaariftamaa
                </a>
                <a
                  href="mailto:daffaariftamareal@gmail.com"
                  className="block text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Email: daffaariftamareal@gmail.com
                </a>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                Versi 1.0.0
              </p>
            </Tabs.Content>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}