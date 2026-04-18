import { CompanyProfile, Search } from '../types';
import { KEYS } from '../constants/storageKeys';
import { MOCK_SEARCHES } from '../constants/mockData';

export function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('localStorage write failed:', e);
  }
}

export function initializeStorage(): void {
  const version = localStorage.getItem(KEYS.SCHEMA_VERSION);
  if (!version) {
    setItem(KEYS.SEARCHES, MOCK_SEARCHES);
    localStorage.setItem(KEYS.SCHEMA_VERSION, '1');
  }
}

export function getProfile(): CompanyProfile | null {
  return getItem<CompanyProfile | null>(KEYS.PROFILE, null);
}

export function setProfile(profile: CompanyProfile): void {
  setItem(KEYS.PROFILE, profile);
}

export function getSearches(): Search[] {
  return getItem<Search[]>(KEYS.SEARCHES, []);
}

export function setSearches(searches: Search[]): void {
  setItem(KEYS.SEARCHES, searches);
}
