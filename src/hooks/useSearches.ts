import { useState, useCallback } from 'react';
import { Search, SearchResult, ResultStatus, NewSearchFormData, ReasoningStep } from '../types';
import { getSearches, setSearches } from '../lib/storage';
import { generateMockResults, generateReasoningTrace } from '../lib/mockGenerator';

interface ScoutResponse {
  results: SearchResult[];
  reasoningTrace: ReasoningStep[];
  appliedFilters: Record<string, unknown>;
}

async function callScoutApi(data: NewSearchFormData): Promise<ScoutResponse> {
  const res = await fetch('/api/scout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<ScoutResponse>;
}

export function useSearches() {
  const [searches, setSearchesState] = useState<Search[]>(() => getSearches());

  const persist = useCallback((updated: Search[]) => {
    setSearchesState(updated);
    setSearches(updated);
  }, []);

  // Must capture searches by value at call time — use functional updater inside
  const createSearch = useCallback(
    async (data: NewSearchFormData): Promise<string> => {
      const id = `search-${Date.now()}`;
      const month = new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

      let results: SearchResult[];
      let reasoningTrace: ReasoningStep[];

      try {
        const response = await callScoutApi(data);
        // Tag each result with the search id
        results = response.results.map((r, i) => ({ ...r, id: `result-${id}-${i}` }));
        reasoningTrace = response.reasoningTrace;
        console.log(`[useSearches] Got ${results.length} live results from API`);
      } catch (err) {
        console.warn('[useSearches] API call failed, falling back to mock data:', err);
        results = generateMockResults(data.industry, data.numberOfResults, id);
        reasoningTrace = generateReasoningTrace(data.description, data.industry);
      }

      const newSearch: Search = {
        id,
        name: `${data.industry} — ${month}`,
        description: data.description,
        industry: data.industry,
        location: data.location,
        numberOfResults: data.numberOfResults,
        collaborationType: data.collaborationType,
        status: 'active',
        results,
        reasoningTrace,
        createdAt: new Date().toISOString(),
      };

      // Use functional state update to avoid stale closure
      setSearchesState((prev) => {
        const updated = [newSearch, ...prev];
        setSearches(updated);
        return updated;
      });

      return id;
    },
    [], // no deps — uses functional updater
  );

  const updateResult = useCallback(
    (searchId: string, resultId: string, patch: Partial<SearchResult>) => {
      setSearchesState((prev) => {
        const updated = prev.map((s) => {
          if (s.id !== searchId) return s;
          return { ...s, results: s.results.map((r) => (r.id === resultId ? { ...r, ...patch } : r)) };
        });
        setSearches(updated);
        return updated;
      });
    },
    [],
  );

  const setResultStatus = useCallback(
    (searchId: string, resultId: string, status: ResultStatus, callDate?: string | null) => {
      updateResult(searchId, resultId, { status, agreedCallDate: callDate !== undefined ? callDate : null });
    },
    [updateResult],
  );

  const restartSearch = useCallback(
    async (searchId: string): Promise<string> => {
      const original = searches.find((s) => s.id === searchId);
      if (!original) return searchId;

      const id = `search-${Date.now()}`;
      const month = new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

      let results: SearchResult[];
      let reasoningTrace: ReasoningStep[];

      try {
        const response = await callScoutApi({
          description: original.description,
          industry: original.industry,
          location: original.location,
          numberOfResults: original.numberOfResults,
          collaborationType: original.collaborationType,
        });
        results = response.results.map((r, i) => ({ ...r, id: `result-${id}-${i}` }));
        reasoningTrace = response.reasoningTrace;
      } catch {
        results = generateMockResults(original.industry, original.numberOfResults, id);
        reasoningTrace = generateReasoningTrace(original.description, original.industry);
      }

      const newSearch: Search = {
        ...original,
        id,
        name: `${original.industry} — ${month} (Restart)`,
        status: 'active',
        results,
        reasoningTrace,
        createdAt: new Date().toISOString(),
      };

      setSearchesState((prev) => {
        const updated = [newSearch, ...prev];
        setSearches(updated);
        return updated;
      });

      return id;
    },
    [searches],
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
