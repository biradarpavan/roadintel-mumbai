import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  Compass, 
  Car, 
  Send,
  BarChart2,
  Filter,
  RotateCcw,
  Users,
  Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid
} from 'recharts';
import { sendAiQuery, fetchAllAccidents } from '../services/api';
import { computeFilteredStats } from '../services/statsAnalytics';

// ── Empty/loading state placeholders ──────────────────────────
function ChartEmpty({ message = 'No data available for this analysis.' }) {
  return (
    <div className="h-60 w-full flex flex-col items-center justify-center text-[#5B6573] text-xs gap-2">
      <BarChart2 className="h-8 w-8 text-[#D9E0E7]" />
      <span>{message}</span>
    </div>
  );
}

function ChartLoading() {
  return (
    <div className="h-60 w-full flex items-center justify-center text-[#5B6573] text-xs">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 border-2 border-[#0B5CAD] border-t-transparent rounded-full animate-spin" />
        <span>Loading statistics...</span>
      </div>
    </div>
  );
}

function getCorridorLabel(areaKey, isMarathi = false) {
  switch (areaKey) {
    case 'western':
      return isMarathi ? 'पश्चिम उपनगरे / WEH' : 'Western Suburbs / WEH';
    case 'eastern':
      return isMarathi ? 'पूर्व उपनगरे / EEH' : 'Eastern Suburbs / EEH';
    case 'island':
      return isMarathi ? 'दक्षिण / मुंबई शहर' : 'South / Island City';
    case 'harbour':
      return isMarathi ? 'हार्बर / नवी मुंबई' : 'Harbour / Navi Mumbai';
    case 'thane':
      return isMarathi ? 'ठाणे / विस्तारित प्रदेश' : 'Thane / Extended MMR';
    default:
      return isMarathi ? 'सर्व मुंबई कॉरिडॉर्स' : 'All Mumbai Corridors';
  }
}

export default function StatisticsPage({ analytics, allAccidents = [], language = 'en' }) {
  const isMarathi = language === 'mr';
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  const [localAccidents, setLocalAccidents] = useState(allAccidents || []);
  const [isLoadingAccidents, setIsLoadingAccidents] = useState(false);

  const [queryInput, setQueryInput] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryResponse, setQueryResponse] = useState(null);

  // Synchronize or load full accidents dataset
  useEffect(() => {
    if (allAccidents && allAccidents.length > 0) {
      setLocalAccidents(allAccidents);
    } else {
      setIsLoadingAccidents(true);
      fetchAllAccidents()
        .then(data => {
          if (data && data.length > 0) {
            setLocalAccidents(data);
          }
        })
        .catch(err => console.error('Error loading accidents for statistics:', err))
        .finally(() => setIsLoadingAccidents(false));
    }
  }, [allAccidents]);

  // Dynamically compute filtered statistics whenever Year or Area changes
  const stats = useMemo(() => {
    return computeFilteredStats(localAccidents, selectedYear, selectedArea, analytics);
  }, [localAccidents, selectedYear, selectedArea, analytics]);

  const isLoading = (analytics === null && localAccidents.length === 0) || isLoadingAccidents;

  const hourlyData  = stats.hourly;
  const roadData    = stats.roadTypes;
  const causeData   = stats.causes;
  const vehicleData = stats.vehicles;
  const monthlyData = stats.monthly;

  const handleResetFilters = () => {
    setSelectedYear('all');
    setSelectedArea('all');
  };

  const handleAskData = async (e) => {
    e?.preventDefault();
    if (!queryInput.trim()) return;
    setIsQuerying(true);
    try {
      const res = await sendAiQuery(queryInput);
      setQueryResponse({
        ...res,
        matchedCount: stats.totalAccidents,
        filterContext: `${selectedYear === 'all' ? 'All Years' : selectedYear} | ${getCorridorLabel(selectedArea, false)}`
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsQuerying(false);
    }
  };

  const sampleQuestions = [
    "Which areas recorded the highest number of fatal accidents?",
    "What vehicle type is involved in the majority of collisions?",
    "During what hours do most severe accidents occur?"
  ];

  const yearLabel = selectedYear === 'all'
    ? (isMarathi ? 'सर्व उपलब्ध वर्षे' : 'All Available Years')
    : selectedYear;
  const corridorLabel = getCorridorLabel(selectedArea, isMarathi);

  return (
    <div className="space-y-6">
      
      {/* Title & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-3 border-b border-[#D9E0E7] gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1F2937]">
            {isMarathi ? 'रस्ता अपघात सांख्यिकी' : 'Road Accident Statistics'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6573]">
            {isMarathi
              ? 'मुंबई महानगर प्रदेशातील अपघातांचे कल, वाहनांचे प्रकार व कारणांची अधिकृत आकडेवारी'
              : 'Official statistical breakdowns, temporal patterns, and causality analysis across Mumbai.'}
          </p>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center space-x-2 text-xs">
          <select
            id="statistics-year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-white border border-[#D9E0E7] rounded-md px-2.5 py-1 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B5CAD] cursor-pointer shadow-2xs"
          >
            <option value="all">All Available Years</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>

          <select
            id="statistics-corridor-select"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="bg-white border border-[#D9E0E7] rounded-md px-2.5 py-1 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B5CAD] cursor-pointer shadow-2xs"
          >
            <option value="all">All Mumbai Corridors</option>
            <option value="western">Western Suburbs / WEH</option>
            <option value="eastern">Eastern Suburbs / EEH</option>
            <option value="island">South / Island City</option>
            <option value="harbour">Harbour / Navi Mumbai</option>
            <option value="thane">Thane / Extended MMR</option>
          </select>
        </div>
      </div>

      {/* Dynamic Filter Context & Real-Time Stats Ribbon */}
      <div className="bg-white border border-[#D9E0E7] rounded-lg p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center text-[#5B6573] font-medium">
            <Filter className="h-3.5 w-3.5 text-[#0B5CAD] mr-1.5" />
            <span>{isMarathi ? 'सक्रिय निकष:' : 'Active Filter:'}</span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#E8F1FA] text-[#0B5CAD] border border-[#BAE6FD]">
            {yearLabel}
          </span>
          <span className="text-[#94A3B8]">•</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#E8F1FA] text-[#0B5CAD] border border-[#BAE6FD]">
            {corridorLabel}
          </span>
          {stats.isFiltered && (
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-[#C62828] hover:text-[#991B1B] font-semibold ml-2 cursor-pointer flex items-center gap-1 hover:underline transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>{isMarathi ? 'सर्व रीसेट करा' : 'Reset to All'}</span>
            </button>
          )}
        </div>

        {/* Live Filtered KPIs */}
        <div className="flex items-center space-x-4 text-xs shrink-0">
          <div>
            <span className="text-[#5B6573] mr-1.5">
              {isMarathi ? 'नोंदवलेले अपघात:' : 'Filtered Incidents:'}
            </span>
            <strong className="font-mono text-[#1F2937] text-sm font-bold">
              {stats.totalAccidents.toLocaleString()}
            </strong>
          </div>
          <div className="border-l border-[#D9E0E7] pl-3">
            <span className="text-[#5B6573] mr-1.5">
              {isMarathi ? 'प्राणघातक (मृत्यू):' : 'Fatalities:'}
            </span>
            <strong className="font-mono text-[#C62828] text-sm font-bold">
              {stats.fatalities.toLocaleString()}
            </strong>
          </div>
          <div className="border-l border-[#D9E0E7] pl-3">
            <span className="text-[#5B6573] mr-1.5">
              {isMarathi ? 'जखमी व्यक्ती:' : 'Injured:'}
            </span>
            <strong className="font-mono text-[#C77B00] text-sm font-bold">
              {stats.injured.toLocaleString()}
            </strong>
          </div>
        </div>
      </div>

      {/* Row 1: Monthly Trend & Fatalities Over Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Trend */}
        <div className="bg-white border border-[#D9E0E7] rounded-lg p-5 shadow-xs">
          <div className="mb-4 pb-2 border-b border-[#D9E0E7] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1F2937] flex items-center space-x-1.5">
                <TrendingUp className="h-4 w-4 text-[#0B5CAD]" />
                <span>{isMarathi ? 'वेळेनुसार अपघात (मासिक कल)' : 'Accidents Over Time (Monthly Trend)'}</span>
              </h2>
              <p className="text-xs text-[#5B6573]">
                {isMarathi 
                  ? `निवडलेल्या निकषांनुसार (${yearLabel}, ${corridorLabel}) मासिक अपघात नोंदणी` 
                  : `Monthly reported incidents for ${yearLabel} (${corridorLabel})`}
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#0B5CAD] bg-[#F5F7FA] px-2 py-0.5 rounded border border-[#D9E0E7]">
              {stats.totalAccidents} {isMarathi ? 'घटना' : 'events'}
            </span>
          </div>

          {isLoading ? (
            <ChartLoading />
          ) : monthlyData.length === 0 || stats.totalAccidents === 0 ? (
            <ChartEmpty message={`No recorded accidents for ${yearLabel} in ${corridorLabel}.`} />
          ) : (
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  key={`monthly-${selectedYear}-${selectedArea}`}
                  data={monthlyData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" vertical={false} />
                  <XAxis dataKey="month" stroke="#5B6573" fontSize={11} tickLine={false} />
                  <YAxis stroke="#5B6573" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: '#F1F5F9' }}
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D9E0E7', borderRadius: '6px', fontSize: '12px' }}
                    formatter={(value) => [value, 'Accidents']}
                  />
                  <Bar dataKey="accidents" fill="#0B5CAD" radius={[3, 3, 0, 0]} name="Accidents" maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Fatalities Over Time */}
        <div className="bg-white border border-[#D9E0E7] rounded-lg p-5 shadow-xs">
          <div className="mb-4 pb-2 border-b border-[#D9E0E7] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1F2937] flex items-center space-x-1.5">
                <AlertTriangle className="h-4 w-4 text-[#C62828]" />
                <span>{isMarathi ? 'अपघातात झालेले मृत्यू (मासिक)' : 'Fatalities Over Time'}</span>
              </h2>
              <p className="text-xs text-[#5B6573]">
                {isMarathi
                  ? `निवडलेल्या निकषांनुसार (${yearLabel}, ${corridorLabel}) मासिक प्राणघातक दुर्घटना`
                  : `Monthly fatal casualty progression for ${yearLabel} (${corridorLabel})`}
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#C62828] bg-[#FEE2E2] px-2 py-0.5 rounded border border-[#FCA5A5]">
              {stats.fatalities} {isMarathi ? 'मृत्यू' : 'fatalities'}
            </span>
          </div>

          {isLoading ? (
            <ChartLoading />
          ) : monthlyData.length === 0 || stats.totalAccidents === 0 ? (
            <ChartEmpty message={`No fatal incident data recorded for this selection.`} />
          ) : (
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  key={`fatalities-${selectedYear}-${selectedArea}`}
                  data={monthlyData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" vertical={false} />
                  <XAxis dataKey="month" stroke="#5B6573" fontSize={11} tickLine={false} />
                  <YAxis stroke="#5B6573" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D9E0E7', borderRadius: '6px', fontSize: '12px' }}
                    formatter={(value) => [value, 'Fatalities']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fatalities" 
                    stroke="#C62828" 
                    strokeWidth={2.5} 
                    dot={{ r: 3, fill: '#C62828' }} 
                    name="Fatalities"
                    connectNulls={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>

      {/* Row 2: Vehicle Type & 24-Hour Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Accidents by Vehicle Type */}
        <div className="bg-white border border-[#D9E0E7] rounded-lg p-5 shadow-xs">
          <div className="mb-4 pb-2 border-b border-[#D9E0E7] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1F2937] flex items-center space-x-1.5">
                <Car className="h-4 w-4 text-[#0B5CAD]" />
                <span>{isMarathi ? 'वाहनाच्या प्रकारानुसार अपघात' : 'Accidents by Vehicle Type'}</span>
              </h2>
              <p className="text-xs text-[#5B6573]">
                {isMarathi
                  ? `वाहनांचे वर्गीकरण (${yearLabel} – ${corridorLabel})`
                  : `Proportion of vehicle classes involved in ${yearLabel} (${corridorLabel})`}
              </p>
            </div>
            <span className="text-[11px] text-[#5B6573] bg-[#F5F7FA] px-2 py-0.5 rounded border border-[#D9E0E7]">
              {vehicleData.length} {isMarathi ? 'प्रकार' : 'categories'}
            </span>
          </div>

          {isLoading ? (
            <ChartLoading />
          ) : vehicleData.length === 0 ? (
            <ChartEmpty />
          ) : (
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  key={`vehicle-${selectedYear}-${selectedArea}`}
                  data={vehicleData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" horizontal={false} />
                  <XAxis type="number" stroke="#5B6573" fontSize={11} tickLine={false} />
                  <YAxis
                    dataKey="vehicle_type"
                    type="category"
                    stroke="#5B6573"
                    fontSize={10}
                    tickLine={false}
                    width={130}
                    tickFormatter={(v) => v.length > 20 ? v.substring(0, 18) + '…' : v}
                  />
                  <Tooltip
                    cursor={{ fill: '#F1F5F9' }}
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D9E0E7', borderRadius: '6px', fontSize: '12px' }}
                    formatter={(value) => [value, 'Collisions']}
                  />
                  <Bar dataKey="count" fill="#1E73BE" radius={[0, 3, 3, 0]} name="Collisions" maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* 24-Hour Diurnal Distribution */}
        <div className="bg-white border border-[#D9E0E7] rounded-lg p-5 shadow-xs">
          <div className="mb-4 pb-2 border-b border-[#D9E0E7] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1F2937] flex items-center space-x-1.5">
                <Clock className="h-4 w-4 text-[#0B5CAD]" />
                <span>{isMarathi ? 'वेळेनुसार अपघात (२४ तास वितरण)' : 'Diurnal 24-Hour Accident Distribution'}</span>
              </h2>
              <p className="text-xs text-[#5B6573]">
                {isMarathi
                  ? `दिवसाच्या वेळेनुसार अपघातांचे प्रमाण (${yearLabel})`
                  : `Incident frequency across hours of the day (${yearLabel})`}
              </p>
            </div>
            <span className="text-[11px] text-[#5B6573] bg-[#F5F7FA] px-2 py-0.5 rounded border border-[#D9E0E7]">
              24-Hour Profile
            </span>
          </div>

          {isLoading ? (
            <ChartLoading />
          ) : hourlyData.length === 0 ? (
            <ChartEmpty />
          ) : (
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  key={`hourly-${selectedYear}-${selectedArea}`}
                  data={hourlyData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" vertical={false} />
                  <XAxis
                    dataKey="hour"
                    stroke="#5B6573"
                    fontSize={9}
                    tickLine={false}
                    interval={2}
                  />
                  <YAxis stroke="#5B6573" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: '#F1F5F9' }}
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D9E0E7', borderRadius: '6px', fontSize: '12px' }}
                    formatter={(value) => [value, 'Accidents']}
                  />
                  <Bar dataKey="accidents" fill="#0B5CAD" radius={[2, 2, 0, 0]} name="Accidents" maxBarSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>

      {/* Row 3: Road Types & Primary Causes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Accidents by Road Classification */}
        <div className="bg-white border border-[#D9E0E7] rounded-lg p-5 shadow-xs">
          <div className="mb-4 pb-2 border-b border-[#D9E0E7] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1F2937] flex items-center space-x-1.5">
                <Compass className="h-4 w-4 text-[#0B5CAD]" />
                <span>{isMarathi ? 'रस्त्याच्या वर्गीकरणानुसार अपघात' : 'Accidents by Road Classification'}</span>
              </h2>
              <p className="text-xs text-[#5B6573]">
                {isMarathi
                  ? `रस्त्याचे प्रकार व तीव्रता (${corridorLabel})`
                  : `Concentration on Expressways, Major Arterials & Urban Corridors (${corridorLabel})`}
              </p>
            </div>
            <span className="text-[11px] text-[#5B6573] bg-[#F5F7FA] px-2 py-0.5 rounded border border-[#D9E0E7]">
              {roadData.length} {isMarathi ? 'प्रकार' : 'classes'}
            </span>
          </div>

          {isLoading ? (
            <ChartLoading />
          ) : roadData.length === 0 ? (
            <ChartEmpty />
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  key={`road-${selectedYear}-${selectedArea}`}
                  data={roadData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" horizontal={false} />
                  <XAxis type="number" stroke="#5B6573" fontSize={11} tickLine={false} />
                  <YAxis
                    dataKey="road_type"
                    type="category"
                    stroke="#5B6573"
                    fontSize={10}
                    tickLine={false}
                    width={110}
                    tickFormatter={(v) => v.length > 18 ? v.substring(0, 16) + '…' : v}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D9E0E7', borderRadius: '6px', fontSize: '12px' }}
                    formatter={(value) => [value, 'Incidents']}
                  />
                  <Bar dataKey="count" fill="#0B5CAD" radius={[0, 3, 3, 0]} name="Incidents" maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Causes of Accidents */}
        <div className="bg-white border border-[#D9E0E7] rounded-lg p-5 shadow-xs">
          <div className="mb-4 pb-2 border-b border-[#D9E0E7] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1F2937] flex items-center space-x-1.5">
                <AlertTriangle className="h-4 w-4 text-[#C77B00]" />
                <span>{isMarathi ? 'अपघाताची नोंदवलेली प्रमुख कारणे' : 'Causes of Accidents'}</span>
              </h2>
              <p className="text-xs text-[#5B6573]">
                {isMarathi
                  ? `तपासाअंती नोंदवलेली मुख्य कारणे (${yearLabel})`
                  : `Contributory factors from primary investigation (${yearLabel})`}
              </p>
            </div>
            <span className="text-[11px] text-[#5B6573] bg-[#F5F7FA] px-2 py-0.5 rounded border border-[#D9E0E7]">
              {causeData.length} {isMarathi ? 'कारणे' : 'factors'}
            </span>
          </div>

          {isLoading ? (
            <ChartLoading />
          ) : causeData.length === 0 ? (
            <ChartEmpty />
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  key={`causes-${selectedYear}-${selectedArea}`}
                  data={causeData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" horizontal={false} />
                  <XAxis type="number" stroke="#5B6573" fontSize={11} tickLine={false} />
                  <YAxis
                    dataKey="cause"
                    type="category"
                    stroke="#5B6573"
                    fontSize={10}
                    tickLine={false}
                    width={130}
                    tickFormatter={(v) => v.length > 22 ? v.substring(0, 20) + '…' : v}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D9E0E7', borderRadius: '6px', fontSize: '12px' }}
                    formatter={(value) => [value, 'Reported Instances']}
                  />
                  <Bar dataKey="count" fill="#C77B00" radius={[0, 3, 3, 0]} name="Reported Instances" maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>

      {/* Analysis Assistant */}
      <div className="bg-white border border-[#D9E0E7] border-l-4 border-l-[#0B5CAD] rounded-lg p-5 shadow-xs">
        <div className="mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-[#0B5CAD] uppercase tracking-wider">
              {isMarathi ? 'डेटा विश्लेषण सहाय्यक' : 'Civic Data Inquiry'}
            </span>
          </div>
          <h2 className="text-base font-bold text-[#1F2937] mt-0.5">
            {isMarathi ? 'माहितीबद्दल विचारा (Analysis Assistant)' : 'Analysis Assistant'}
          </h2>
          <p className="text-xs text-[#5B6573]">
            {isMarathi
              ? `मुंबई रस्ता अपघात डेटाबद्दल थेट प्रश्न विचारा. सध्या सक्रिय निकष: ${yearLabel} (${corridorLabel}).`
              : `Ask questions about verified Mumbai road accident statistics. Currently analyzed dataset: ${yearLabel} (${corridorLabel}).`}
          </p>
        </div>

        <form onSubmit={handleAskData} className="flex gap-2">
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="e.g., Which areas recorded the highest number of fatal accidents?"
            className="flex-1 bg-[#F5F7FA] border border-[#D9E0E7] rounded-md px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B5CAD]"
          />
          <button
            type="submit"
            disabled={isQuerying || !queryInput.trim()}
            className="px-4 py-2 rounded-md bg-[#0B5CAD] hover:bg-[#084887] disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            {isQuerying ? (
              <span>Analyzing...</span>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Ask about the data</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-[#5B6573]">
          <span className="text-[11px] font-medium mr-1">Suggestions:</span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setQueryInput(q)}
              className="text-[11px] bg-[#F5F7FA] hover:bg-[#E8F1FA] text-[#0B5CAD] border border-[#D9E0E7] px-2 py-0.5 rounded cursor-pointer transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {queryResponse && (
          <div className="mt-4 p-4 bg-[#F8FAFC] border border-[#D9E0E7] rounded-md text-xs space-y-2">
            <div className="font-bold text-[#1F2937] flex items-center justify-between border-b border-[#EDF2F7] pb-1.5">
              <span>Analytical Response:</span>
              <span className="font-mono text-[11px] text-[#5B6573]">
                Verified records processed: {stats.totalAccidents.toLocaleString()} ({queryResponse.filterContext || `${yearLabel} | ${corridorLabel}`})
              </span>
            </div>
            <p className="text-[#1F2937] leading-relaxed">
              {queryResponse.answer || `According to verified records for ${yearLabel} in ${corridorLabel}, ${stats.totalAccidents} incidents were registered with ${stats.fatalities} fatalities and ${stats.injured} injuries.`}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
