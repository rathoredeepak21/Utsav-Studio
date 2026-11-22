'use client';

const FAVORITES_KEY = 'utsav_favorite_templates';
const FAVORITES_EVENT = 'utsav_favorites_updated';

export function getFavoriteIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isFavorite(templateId: string): boolean {
  const ids = getFavoriteIds();
  return ids.includes(templateId);
}

export function toggleFavorite(templateId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const ids = getFavoriteIds();
    let updated: string[];
    let isNowFavorite: boolean;

    if (ids.includes(templateId)) {
      updated = ids.filter((id) => id !== templateId);
      isNowFavorite = false;
    } else {
      updated = [...ids, templateId];
      isNowFavorite = true;
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(FAVORITES_EVENT, { detail: { templateId, isNowFavorite, updated } }));
    return isNowFavorite;
  } catch {
    return false;
  }
}
