import { useState } from 'react';
import { CompanyProfile, ResultStatus, NewSearchFormData } from './types';
import { getProfile, setProfile } from './lib/storage';
import { useSearches } from './hooks/useSearches';
import { Navbar } from './components/layout/Navbar';
import { RegistrationForm } from './components/registration/RegistrationForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { SearchDetail } from './components/search-detail/SearchDetail';
import { NewSearchForm } from './components/new-search/NewSearchForm';

type Tab = 'dashboard' | 'new-search';
type View =
  | { type: 'dashboard' }
  | { type: 'search-detail'; searchId: string }
  | { type: 'new-search' };

export default function App() {
  const [profile, setProfileState] = useState<CompanyProfile | null>(() => getProfile());
  const [view, setView] = useState<View>({ type: 'dashboard' });
  const { activeSearches, finishedSearches, getSearch, createSearch, setResultStatus, restartSearch } =
    useSearches();

  function handleRegister(data: Omit<CompanyProfile, 'id' | 'registeredAt'>) {
    const p: CompanyProfile = {
      id: `company-${Date.now()}`,
      ...data,
      registeredAt: new Date().toISOString(),
    };
    setProfile(p);
    setProfileState(p);
  }

  function handleOpenSearch(id: string) {
    setView({ type: 'search-detail', searchId: id });
  }

  function handleBack() {
    setView({ type: 'dashboard' });
  }

  function handleTabChange(tab: Tab) {
    setView({ type: tab });
  }

  // Async: create search via API, then navigate to detail
  async function handleFormSubmit(data: NewSearchFormData): Promise<void> {
    const id = await createSearch(data);
    setView({ type: 'search-detail', searchId: id });
  }

  const activeTab: Tab = view.type === 'new-search' ? 'new-search' : 'dashboard';

  if (!profile) {
    return <RegistrationForm onSubmit={handleRegister} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        companyName={profile.companyName}
      />

      <main className="pt-14">
        {view.type === 'dashboard' && (
          <Dashboard
            activeSearches={activeSearches}
            finishedSearches={finishedSearches}
            onOpenSearch={handleOpenSearch}
            onNewSearch={() => setView({ type: 'new-search' })}
          />
        )}

        {view.type === 'search-detail' &&
          (() => {
            const search = getSearch(view.searchId);
            if (!search) {
              return (
                <div className="max-w-7xl mx-auto px-6 py-16 text-center">
                  <p className="text-zinc-500">Search not found.</p>
                </div>
              );
            }
            return (
              <SearchDetail
                search={search}
                onBack={handleBack}
                onUpdateResult={(resultId, status, callDate) =>
                  setResultStatus(search.id, resultId, status as ResultStatus, callDate)
                }
                onResetResult={(resultId) => setResultStatus(search.id, resultId, 'pending', null)}
                onRestartSearch={async () => {
                  const newId = await restartSearch(search.id);
                  setView({ type: 'search-detail', searchId: newId });
                }}
              />
            );
          })()}

        {view.type === 'new-search' && <NewSearchForm onSubmit={handleFormSubmit} />}
      </main>
    </div>
  );
}
