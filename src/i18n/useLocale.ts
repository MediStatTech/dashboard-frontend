import { useState, useCallback } from 'react';
import { ua } from './ua';
import { en } from './en';
import type { Locale } from './ua';

type Lang = 'ua' | 'en';

const dictionaries: Record<Lang, Locale> = { ua, en };

export function useLocale() {
  const [lang, setLang] = useState<Lang>(
    () => (localStorage.getItem('lang') as Lang) || 'ua',
  );

  const t = dictionaries[lang];

  const toggleLang = useCallback(() => {
    const next: Lang = lang === 'ua' ? 'en' : 'ua';
    setLang(next);
    localStorage.setItem('lang', next);
  }, [lang]);

  return { t, lang, toggleLang };
}
