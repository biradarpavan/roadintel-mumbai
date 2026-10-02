import React, { useState } from 'react';
import { Filter, Search, RotateCcw, Download, X, Check } from 'lucide-react';

export default function FilterBar({ 
  filters, 
  setFilters, 
  onReset, 
  onExportCsv, 
  totalCount,
  language = 'en'
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);
  const isMarathi = language === 'mr';

  const handleOpenDrawer = () => {
    setTempFilters(filters);
    setIsDrawerOpen(true);
  };

  const handleApply = () => {
    setFilters({ ...tempFilters, page: 0 });
    setIsDrawerOpen(false);
  };

  const handleResetInternal = () => {
    const defaultFilters = {
      severity: 'all',
      vehicleType: 'all',
      area: 'all',
      source: 'all',
      search: '',
      page: 0,
      size: 200
    };
    setTempFilters(defaultFilters);
    onReset();
    setIsDrawerOpen(false);
  };

  const handleSearchChange = (val) => {
    setFilters(prev => ({ ...prev, search: val, page: 0 }));
  };

  // Count active non-default filters
  const activeFilterCount = [
    filters.severity !== 'all',
    filters.vehicleType !== 'all',
    filters.area !== 'all',
    filters.source !== 'all'
  ].filter(Boolean).length;

  return (
    <>
      {/* Compact Clean Control Bar */}
      <div className="bg-white border-b border-[#D9E0E7] px-4 py-2.5 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Left: Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#5B6573]" />
            <input
              type="text"
              placeholder={isMarathi ? "ठिकाण, अपघात क्रमांक किंवा परिसर शोधा..." : "Search location, accident ID or area"}
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-[#F5F7FA] border border-[#D9E0E7] rounded-md pl-9 pr-3 py-1.5 text-xs sm:text-sm text-[#1F2937] placeholder-[#5B6573] focus:outline-none focus:ring-1 focus:ring-[#0B5CAD] focus:border-[#0B5CAD] transition-colors"
            />
            {filters.search && (
              <button 
                onClick={() => handleSearchChange('')}
                className="absolute right-2.5 top-2 text-[#5B6573] hover:text-[#1F2937]"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2.5 self-end sm:self-auto">
            
            {/* Filter Drawer Toggle Button */}
            <button
              onClick={handleOpenDrawer}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                activeFilterCount > 0 
                  ? 'bg-[#E8F1FA] border-[#0B5CAD] text-[#0B5CAD]' 
                  : 'bg-white border-[#D9E0E7] text-[#1F2937] hover:bg-[#F5F7FA]'
              }`}
            >
              <Filter className="h-3.5 w-3.5 text-[#0B5CAD]" />
              <span>{isMarathi ? 'माहिती गाळा (Filters)' : 'Filter data'}</span>
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-[#0B5CAD] text-white text-[10px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Quick Reset if filters applied */}
            {activeFilterCount > 0 && (
              <button
                onClick={onReset}
                title={isMarathi ? 'फिल्टर पूर्ववत करा' : 'Reset filters'}
                className="p-1.5 rounded-md border border-[#D9E0E7] text-[#5B6573] hover:text-[#C62828] hover:bg-[#FEE2E2] transition-colors cursor-pointer text-xs flex items-center"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}

            {/* Total Records Counter Badge */}
            <div className="hidden md:flex items-center text-xs text-[#5B6573] bg-[#F5F7FA] border border-[#D9E0E7] px-2.5 py-1.5 rounded-md font-mono">
              <span className="font-semibold text-[#0B5CAD] mr-1">
                {totalCount !== undefined ? totalCount.toLocaleString() : '2,692'}
              </span>
              <span>{isMarathi ? 'नोंदी' : 'records'}</span>
            </div>

            {/* CSV Export Button */}
            {onExportCsv && (
              <button
                onClick={onExportCsv}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#18864B] hover:bg-[#136C3C] text-white transition-colors cursor-pointer shadow-xs"
                title={isMarathi ? 'CSV डाउनलोड करा' : 'Download CSV'}
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{isMarathi ? 'CSV डाउनलोड' : 'Export CSV'}</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Slide-over Filter Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#D9E0E7]">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#D9E0E7] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-[#0B5CAD]" />
                <h3 className="font-bold text-sm text-[#1F2937]">
                  {isMarathi ? 'माहिती निकष (Filter Data)' : 'Filter Accident Data'}
                </h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 rounded-md text-[#5B6573] hover:text-[#1F2937] hover:bg-[#E2E8F0] transition-colors"
                aria-label="Close filter drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Drawer Body - Filter Controls */}
            <div className="p-5 space-y-4 overflow-y-auto text-xs text-[#1F2937]">
              
              {/* Severity Filter */}
              <div>
                <label className="font-semibold text-xs block mb-1 text-[#1F2937]">
                  {isMarathi ? 'अपघाताची तीव्रता (Severity)' : 'Severity Level'}
                </label>
                <select
                  value={tempFilters.severity || 'all'}
                  onChange={(e) => setTempFilters(prev => ({ ...prev, severity: e.target.value }))}
                  className="w-full bg-white border border-[#D9E0E7] rounded-md px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B5CAD]"
                >
                  <option value="all">All Severities</option>
                  <option value="Fatal">Fatal (प्राणघातक)</option>
                  <option value="Grievous/Major">Grievous / Major (गंभीर दुखापत)</option>
                  <option value="Minor">Minor (किरकोळ दुखापत)</option>
                  <option value="Non-Injury">Non-Injury (दुखापत विरहित)</option>
                </select>
                <p className="text-[11px] text-[#5B6573] mt-1">
                  Categorized in accordance with national safety recording norms.
                </p>
              </div>

              {/* Area / Corridor Filter */}
              <div>
                <label className="font-semibold text-xs block mb-1 text-[#1F2937]">
                  {isMarathi ? 'परिसर / महामार्ग (Area / Corridor)' : 'Area / Corridor'}
                </label>
                <select
                  value={tempFilters.area || 'all'}
                  onChange={(e) => setTempFilters(prev => ({ ...prev, area: e.target.value }))}
                  className="w-full bg-white border border-[#D9E0E7] rounded-md px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B5CAD]"
                >
                  <option value="all">All Mumbai Corridors</option>
                  <option value="Western">Western Suburbs / WEH Corridor</option>
                  <option value="Eastern">Eastern Suburbs / EEH Corridor</option>
                  <option value="Bandra">Bandra / Khar</option>
                  <option value="Dadar">Dadar Central</option>
                  <option value="Lower Parel">Lower Parel / Worli</option>
                  <option value="Andheri">Andheri West / East</option>
                  <option value="Malad">Malad Corridor</option>
                  <option value="Sion">Sion / Chembur Junction</option>
                  <option value="Kurla">Kurla / LBS Marg</option>
                  <option value="Thane">Thane West</option>
                </select>
              </div>

              {/* Vehicle Type Filter */}
              <div>
                <label className="font-semibold text-xs block mb-1 text-[#1F2937]">
                  {isMarathi ? 'वाहनाचा प्रकार (Vehicle Involved)' : 'Vehicle Involved'}
                </label>
                <select
                  value={tempFilters.vehicleType || 'all'}
                  onChange={(e) => setTempFilters(prev => ({ ...prev, vehicleType: e.target.value }))}
                  className="w-full bg-white border border-[#D9E0E7] rounded-md px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B5CAD]"
                >
                  <option value="all">All Vehicle Types</option>
                  <option value="Two-Wheeler">Two-Wheeler / Motorcycle / Scooter</option>
                  <option value="Car">Car / SUV / Private Passenger</option>
                  <option value="Truck">Heavy Commercial / Truck</option>
                  <option value="Auto">Auto-Rickshaw</option>
                  <option value="Bus">Public / Private Bus</option>
                </select>
              </div>

              {/* Data Source Filter */}
              <div>
                <label className="font-semibold text-xs block mb-1 text-[#1F2937]">
                  {isMarathi ? 'माहिती स्रोत (Data Source)' : 'Data Repository Origin'}
                </label>
                <select
                  value={tempFilters.source || 'all'}
                  onChange={(e) => setTempFilters(prev => ({ ...prev, source: e.target.value }))}
                  className="w-full bg-white border border-[#D9E0E7] rounded-md px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B5CAD]"
                >
                  <option value="all">All Repositories (Unified)</option>
                  <option value="NCRB_OGD">NCRB ADSI 2023 (Official Government)</option>
                  <option value="OPEN_ACCIDENT_DATASET">Open Accident Dataset (Third-party Open)</option>
                  <option value="OPEN_MAHARASHTRA_TRAFFIC">Open Maharashtra Traffic (Third-party Open)</option>
                </select>
                <p className="text-[11px] text-[#5B6573] mt-1">
                  Filter by provenanced ingestion repository.
                </p>
              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-[#D9E0E7] bg-[#F8FAFC] flex items-center justify-between gap-3">
              <button
                onClick={handleResetInternal}
                className="px-3.5 py-2 rounded-md border border-[#D9E0E7] text-[#5B6573] hover:text-[#1F2937] hover:bg-[#EDF2F7] font-semibold text-xs transition-colors cursor-pointer"
              >
                {isMarathi ? 'पूर्ववत करा' : 'Reset'}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-3 py-2 rounded-md text-xs font-semibold text-[#5B6573] hover:text-[#1F2937]"
                >
                  {isMarathi ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  onClick={handleApply}
                  className="px-4 py-2 rounded-md bg-[#0B5CAD] hover:bg-[#084887] text-white font-semibold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>{isMarathi ? 'लागू करा' : 'Apply Filters'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
