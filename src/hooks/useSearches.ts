import { useState, useCallback } from 'react';
import { Search, SearchResult, ResultStatus, NewSearchFormData } from '../types';
import { getSearches, setSearches } from '../lib/storage';
import { generateMockResults, generateReasoningTrace } from '../lib/mockGenerator';

export function useSearches() {
  const [searches, setSearchesState] = useState<Search[]>(() => getSearches());

  const persist = useCallback((updated: Search[]) => {
    setSearchesState(updated);
    setSearches(updated);
  }, []);

  const createSearch = useCallback(
    (data: NewSearchFormData): string => {
      const id = `search-${Date.now()}`;
      const month = new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
      const newSearch: Search = {
        id,
        name: `${data.industry} — ${month}`,
        description: data.description,
        industry: data.industry,
        location: data.location,
        numberOfResults: data.numberOfResults,
        collaborationType: data.collaborationType,
        status: 'active',
        results: generateMockResults(data.industry, data.numberOfResults, id),
        reasoningTrace: generateReasoningTrace(data.description, data.industry),
        createdAt: new Date().toISOString(),
      };
      persist([newSearch, ...searches]);
      return id;
    },
    [searches, persist],
  );

  const updateResult = useCallback(
    (searchId: string, resultId: string, patch: Partial<SearchResult>) => {
      persist(
        searches.map((s) => {
          if (s.id !== searchId) return s;
          return {
            ...s,
            results: s.results.map((r) => (r.id === resultId ? { ...r, ...patch } : r)),
          };
        }),
      );
    },
    [searches, persist],
  );

  const setResultStatus = useCallback(
    (searchId: string, resultId: string, status: ResultStatus, callDate?: string | null) => {
      updateResult(searchId, resultId, {
        status,
        agreedCallDate: callDate !== undefined ? callDate : null,
      });
    },
    [updateResult],
  );

  const restartSearch = useCallback(
    (searchId: string): string => {
      const original = searches.find((s) => s.id === searchId);
      if (!original) return searchId;
      const id = `search-${Date.now()}`;
      const month = new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
      const newSearch: Search = {
        ...original,
        id,
        name: `${original.industry} — ${month} (Restart)`,
        status: 'active',
        results: generateMockResults(original.industry, original.numberOfResults, id),
        reasoningTrace: generateReasoningTrace(original.description, original.industry),
        createdAt: new Date().toISOString(),
      };
      persist([newSearch, ...searches]);
      return id;
    },
    [searches, persist],
  );

  return {
    searches,
    activeSearches: searches.filter((s) => s.status === 'active'),
    finishedSearches: searches.filter((s) => s.status === 'finished'),
    getSearch: (id: string) => searches.find((s) => s.id === id),
    createSearch,
    updateResult,
    setResultStatus,
    restartSearch,
  };
}
