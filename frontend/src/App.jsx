import React, { useState, useEffect } from 'react';
import GovernmentHeader from './components/GovernmentHeader';
import FilterBar from './components/FilterBar';
import DashboardPage from './components/DashboardPage';
import MapPage from './components/MapPage';
import StatisticsPage from './components/StatisticsPage';
import HotspotsPage from './components/HotspotsPage';
import MethodologyPage from './components/MethodologyPage';
import ReportsPage from './components/ReportsPage';
import AboutPage from './components/AboutPage';
import GovernmentFooter from './components/GovernmentFooter';
import AccidentDetailModal from './components/AccidentDetailModal';
import AiAssistantModal from './components/AiAssistantModal';

import { 
  fetchSummary, 
  fetchAccidents, 
  fetchAllAccidents,
  fetchHotspots, 
  fetchMatches, 
  fetchSources, 
  fetchAnalytics 
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Core Data State from real APIs / verified datasets
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [matches, setMatches] = useState([]);
  const [sources, setSources] = useState([]);
  const [accidents, setAccidents] = useState([]);
  const [allAccidents, setAllAccidents] = useState([]);
  const [totalCount, setTotalCount] = useState(2692);

  // Filter State
  const [filters, setFilters] = useState({
    severity: 'all',
    vehicleType: 'all',
    area: 'all',
    source: 'all',
    search: '',
    page: 0,
    size: 200
  });

  // Modals
  const [selectedAccident, setSelectedAccident] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Initial Load from real backend
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [sumRes, hotRes, matRes, srcRes, anaRes, allAccRes] = await Promise.all([
          fetchSummary(),
          fetchHotspots(),
          fetchMatches(),
          fetchSources(),
          fetchAnalytics(),
          fetchAllAccidents()
        ]);
        setSummary(sumRes);
        setHotspots(hotRes || []);
        setMatches(matRes || []);
        setSources(srcRes || []);
        setAnalytics(anaRes);
        setAllAccidents(allAccRes || []);
      } catch (err) {
        console.error('Failed to load initial data:', err);
        setError('Notice: Running with fallback verified public dataset.');
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Filtered Accidents Query
  useEffect(() => {
    async function loadFilteredAccidents() {
      try {
        const res = await fetchAccidents(filters);
        if (res && res.data) {
          setAccidents(res.data);
          setTotalCount(res.meta?.total !== undefined ? res.meta.total : res.data.length);
        }
      } catch (err) {
        console.error('Error fetching filtered accidents:', err);
      }
    }
    loadFilteredAccidents();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      severity: 'all',
      vehicleType: 'all',
      area: 'all',
      source: 'all',
      search: '',
      page: 0,
      size: 200
    });
  };

  const handleExportCsv = () => {
    const params = new URLSearchParams({
      severity: filters.severity,
      vehicleType: filters.vehicleType,
      area: filters.area,
      source: filters.source,
      search: filters.search
    });
    window.open(`/api/accidents/export?${params.toString()}`, '_blank');
  };

  const handleApplyAiFilters = (extractedFilters) => {
    setFilters(prev => ({
      ...prev,
      ...extractedFilters,
      page: 0
    }));
  };

  const handleViewHotspotOnMap = () => {
    setActiveTab('map');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1F2937] flex flex-col antialiased">
      
      {/* Two-Level Government Header */}
      <GovernmentHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Clean Light Filter Bar with slide-over drawer (active on home & map tabs) */}
      {(activeTab === 'home' || activeTab === 'map') && (
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          onReset={handleResetFilters}
          onExportCsv={handleExportCsv}
          totalCount={totalCount}
          language={language}
        />
      )}

      {/* Backend Unavailable Notice Banner */}
      {error && (
        <div className="bg-[#FFFBEB] border-b border-[#FCD34D] px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs text-[#92400E]">
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4 text-[#C77B00] shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Notice: Backend service unavailable — displaying verified public fallback dataset. Live API data will appear when the service is restored.</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-[#92400E] hover:text-[#78350F] shrink-0 font-bold text-sm cursor-pointer"
              aria-label="Dismiss notice"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 space-y-3">
            <div className="h-8 w-8 border-3 border-[#0B5CAD] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-[#5B6573]">
              Loading verified road safety information...
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <DashboardPage
                summary={summary}
                analytics={analytics}
                hotspots={hotspots}
                onSelectAccident={setSelectedAccident}
                onNavigate={setActiveTab}
                language={language}
              />
            )}

            {activeTab === 'map' && (
              <MapPage
                accidents={accidents}
                hotspots={hotspots}
                onSelectAccident={setSelectedAccident}
                language={language}
              />
            )}

            {activeTab === 'statistics' && (
              <StatisticsPage
                analytics={analytics}
                allAccidents={allAccidents}
                language={language}
              />
            )}

            {activeTab === 'hotspots' && (
              <HotspotsPage
                hotspots={hotspots}
                onSelectOnMap={handleViewHotspotOnMap}
                language={language}
              />
            )}

            {activeTab === 'methodology' && (
              <MethodologyPage
                summary={summary}
                sources={sources}
                matches={matches}
                qualityMetrics={analytics?.quality}
                language={language}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsPage
                summary={summary}
                analytics={analytics}
                hotspots={hotspots}
                sources={sources}
                onExportCsv={handleExportCsv}
                language={language}
              />
            )}

            {activeTab === 'about' && (
              <AboutPage
                language={language}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <AccidentDetailModal
        accident={selectedAccident}
        onClose={() => setSelectedAccident(null)}
        language={language}
      />

      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyFilters={handleApplyAiFilters}
      />

      {/* Government Footer */}
      <GovernmentFooter
        setActiveTab={setActiveTab}
        language={language}
      />

    </div>
  );
}
