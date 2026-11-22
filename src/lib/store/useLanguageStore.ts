import { create } from 'zustand';

export type Language = 'en' | 'hi';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'en',
  setLanguage: (lang: Language) => set({ language: lang }),
  toggleLanguage: () =>
    set((state) => ({ language: state.language === 'en' ? 'hi' : 'en' })),
}));
