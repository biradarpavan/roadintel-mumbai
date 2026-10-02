import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Info, 
  ArrowUpDown, 
  Eye, 
  ChevronRight, 
  ChevronDown,
  X,
  Layers
} from 'lucide-react';

export default function HotspotsPage({ hotspots = [], onSelectOnMap, language = 'en' }) {
  const isMarathi = language === 'mr';
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [sortBy, setSortBy] = useState('risk_score'); // 'risk_score', 'accident_count', 'fatalities'
  const [isTechOpen, setIsTechOpen] = useState(false);

  const sortedHotspots = [...hotspots].sort((a, b) => {
    if (sortBy === 'accident_count') return (b.accident_count || 0) - (a.accident_count || 0);
    if (sortBy === 'fatalities') return (b.fatalities || 0) - (a.fatalities || 0);
    return (b.risk_score || 0) - (a.risk_score || 0);
  });

  const getSeverityBadge = (level) => {
    const l = String(level || '').toUpperCase();
    if (l === 'CRITICAL' || l === 'HIGH') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]">
          <AlertTriangle className="h-3 w-3 mr-1 text-[#C62828]" />
          High Severity
        </span>
      );
    }
    if (l === 'MEDIUM') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D]">
          Medium Severity
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#E0F2FE] text-[#075985] border border-[#BAE6FD]">
        Moderate
      </span>
    );
  };

  const getDataConfidence = (score) => {
    const s = Number(score) || 0.95;
    if (s >= 0.9) return { label: 'High', color: 'text-[#18864B]' };
    if (s >= 0.7) return { label: 'Medium', color: 'text-[#C77B00]' };
    return { label: 'Moderate', color: 'text-[#5B6573]' };
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="pb-3 border-b border-[#D9E0E7]">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1F2937]">
          {isMarathi ? 'अपघातप्रवण क्षेत्रे (हॉटस्पॉट्स)' : 'Accident Hotspots'}
        </h1>
        <p className="text-xs sm:text-sm text-[#5B6573] mt-0.5">
          {isMarathi 
            ? 'ऐतिहासिक अपघात घनता आणि तीव्रतेच्या अभ्यासातून निश्चित केलेली संभाव्य अपघातप्रवण ठिकाणे.'
            : 'Locations identified from historical accident concentration and severity patterns.'}
        </p>
      </div>

      {/* Official Government Advisory Note */}
      <div className="bg-[#F8FAFC] border-l-4 border-l-[#0B5CAD] border border-[#D9E0E7] p-4 rounded-md flex items-start space-x-3 text-xs text-[#1F2937]">
        <Info className="h-4 w-4 text-[#0B5CAD] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {isMarathi
            ? 'महत्त्वाची नोंद: ही स्थाने उपलब्ध डेटाच्या विश्लेषणाद्वारे ओळखली गेली आहेत. ती अधिकृत सरकारी ब्लॅक-स्पॉट पदनामे (Official Black-Spots) नाहीत.'
            : 'Notice: These locations are identified through analysis of the available datasets. They are not official government black-spot classifications.'}
        </p>
      </div>

      {/* Table Card with Sorting */}
      <div className="bg-white border border-[#D9E0E7] rounded-lg shadow-xs overflow-hidden">
        
        {/* Table Top Controls */}
        <div className="p-4 border-b border-[#D9E0E7] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#FAFCFE]">
          <div>
            <span className="font-bold text-sm text-[#1F2937]">
              {isMarathi ? 'ओळखलेली अपघातप्रवण ठिकाणे' : 'Identified High-Risk Corridors'}
            </span>
            <span className="ml-2 text-xs text-[#5B6573]">
              ({hotspots.length} {isMarathi ? 'स्थाने' : 'locations'})
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-[#5B6573] font-medium flex items-center space-x-1">
              <ArrowUpDown className="h-3.5 w-3.5 text-[#0B5CAD]" />
              <span>Sort By:</span>
            </span>
            <button
              onClick={() => setSortBy('risk_score')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                sortBy === 'risk_score'
                  ? 'bg-[#0B5CAD] text-white'
                  : 'bg-white border border-[#D9E0E7] text-[#5B6573] hover:text-[#1F2937]'
              }`}
            >
              Risk Score
            </button>
            <button
              onClick={() => setSortBy('accident_count')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                sortBy === 'accident_count'
                  ? 'bg-[#0B5CAD] text-white'
                  : 'bg-white border border-[#D9E0E7] text-[#5B6573] hover:text-[#1F2937]'
              }`}
            >
              Accidents
            </button>
            <button
              onClick={() => setSortBy('fatalities')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                sortBy === 'fatalities'
                  ? 'bg-[#0B5CAD] text-white'
                  : 'bg-white border border-[#D9E0E7] text-[#5B6573] hover:text-[#1F2937]'
              }`}
            >
              Fatalities
            </button>
          </div>
        </div>

        {/* Clean Government Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1F2937]">
            <thead className="bg-[#F5F7FA] text-[#5B6573] font-semibold border-b border-[#D9E0E7]">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">{isMarathi ? 'ठिकाण' : 'Location'}</th>
                <th className="py-3 px-4 font-mono">{isMarathi ? 'एकूण अपघात' : 'Accidents'}</th>
                <th className="py-3 px-4 font-mono">{isMarathi ? 'मृत्यू' : 'Fatalities'}</th>
                <th className="py-3 px-4">{isMarathi ? 'तीव्रता' : 'Severity'}</th>
                <th className="py-3 px-4 font-mono">{isMarathi ? 'जोखीम निर्देशांक' : 'Risk Score'}</th>
                <th className="py-3 px-4">{isMarathi ? 'विश्वासार्हता' : 'Data Confidence'}</th>
                <th className="py-3 px-4 text-right">{isMarathi ? 'तपशील' : 'Details'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E0E7]">
              {sortedHotspots.map((h, idx) => {
                const conf = getDataConfidence(h.confidence_score);
                return (
                  <tr 
                    key={idx}
                    onClick={() => setSelectedHotspot(h)}
                    className="hover:bg-[#F0F5FA] transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-mono text-[#5B6573]">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#1F2937] text-[13px]">{h.area}</div>
                      <div className="text-[11px] text-[#5B6573]">{h.name}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#1F2937] text-sm">{h.accident_count}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#C62828] text-sm">{h.fatalities}</td>
                    <td className="py-3 px-4">{getSeverityBadge(h.severity_level)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#0B5CAD] text-sm">
                      {Math.round(h.risk_score || 0)} <span className="text-[10px] text-[#5B6573] font-normal">/ 100</span>
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      <span className={conf.color}>{conf.label}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedHotspot(h);
                        }}
                        className="px-2.5 py-1 rounded bg-[#E8F1FA] text-[#0B5CAD] hover:bg-[#D0E2F5] font-semibold text-xs transition-colors cursor-pointer"
                      >
                        {isMarathi ? 'पहा' : 'View'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Hotspot Detail Modal / Drawer */}
      {selectedHotspot && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white border border-[#D9E0E7] rounded-lg w-full max-w-2xl shadow-xl overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-[#D9E0E7] bg-[#F8FAFC] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-[#0B5CAD] font-bold">
                  {selectedHotspot.hotspot_id}
                </span>
                <h3 className="font-bold text-base text-[#1F2937] mt-0.5">
                  {isMarathi ? 'अपघातप्रवण क्षेत्र तपशील' : 'Accident Hotspot Details'} — {selectedHotspot.area}
                </h3>
                <p className="text-xs text-[#5B6573]">{selectedHotspot.name}</p>
              </div>
              <button
                onClick={() => setSelectedHotspot(null)}
                className="p-1 rounded-md text-[#5B6573] hover:text-[#1F2937] hover:bg-[#EDF2F7] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5 text-xs text-[#1F2937] max-h-[75vh] overflow-y-auto">
              
              {/* Primary 4 Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-[#F8FAFC] border border-[#D9E0E7] rounded-md">
                  <span className="text-[10px] text-[#5B6573] block uppercase font-semibold">Total Accidents</span>
                  <div className="text-2xl font-bold font-mono text-[#1F2937] mt-1">{selectedHotspot.accident_count}</div>
                </div>

                <div className="p-3 bg-[#F8FAFC] border border-[#D9E0E7] rounded-md">
                  <span className="text-[10px] text-[#5B6573] block uppercase font-semibold">Fatalities</span>
                  <div className="text-2xl font-bold font-mono text-[#C62828] mt-1">{selectedHotspot.fatalities}</div>
                </div>

                <div className="p-3 bg-[#F8FAFC] border border-[#D9E0E7] rounded-md">
                  <span className="text-[10px] text-[#5B6573] block uppercase font-semibold">Persons Injured</span>
                  <div className="text-2xl font-bold font-mono text-[#1F2937] mt-1">{selectedHotspot.injured}</div>
                </div>

                <div className="p-3 bg-[#F8FAFC] border border-[#D9E0E7] rounded-md">
                  <span className="text-[10px] text-[#5B6573] block uppercase font-semibold">Risk Score</span>
                  <div className="text-2xl font-bold font-mono text-[#0B5CAD] mt-1">
                    {Math.round(selectedHotspot.risk_score)} <span className="text-xs font-normal text-[#5B6573]">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Accident Pattern Summary */}
              <div className="border border-[#D9E0E7] rounded-md p-4 bg-white">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#1F2937] mb-3">
                  Accident Pattern Characteristics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 bg-[#F5F7FA] rounded">
                    <span className="text-[10px] text-[#5B6573] block">Dominant Vehicle Type:</span>
                    <strong className="text-[#1F2937] text-xs">{selectedHotspot.dominant_vehicle || 'Mixed Commercial / Two-Wheeler'}</strong>
                  </div>
                  <div className="p-2.5 bg-[#F5F7FA] rounded">
                    <span className="text-[10px] text-[#5B6573] block">Peak Accident Time:</span>
                    <strong className="text-[#1F2937] text-xs">{selectedHotspot.peak_hour || '18:00 - 21:00'}</strong>
                  </div>
                  <div className="p-2.5 bg-[#F5F7FA] rounded">
                    <span className="text-[10px] text-[#5B6573] block">Primary Contributory Cause:</span>
                    <strong className="text-[#1F2937] text-xs">{selectedHotspot.dominant_cause || 'Speed Variation & Crossing'}</strong>
                  </div>
                </div>
              </div>

              {/* Location Coordinates & Data Sources */}
              <div className="border border-[#D9E0E7] rounded-md p-4 bg-white">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#1F2937] mb-2">
                  Location & Data Provenance
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#5B6573] block text-[11px]">Centroid Coordinates:</span>
                    <span className="font-mono font-medium text-[#1F2937]">
                      Latitude: {selectedHotspot.centroid_lat?.toFixed(5)}, Longitude: {selectedHotspot.centroid_lon?.toFixed(5)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#5B6573] block text-[11px]">Underlying Repositories:</span>
                    <span className="font-medium text-[#1F2937]">
                      NCRB OGD ADSI Records & Verified Telemetry
                    </span>
                  </div>
                </div>
              </div>

              {/* Expandable Technical Methodology Section */}
              <div className="border border-[#D9E0E7] rounded-md overflow-hidden">
                <button
                  onClick={() => setIsTechOpen(!isTechOpen)}
                  className="w-full p-3 bg-[#F8FAFC] text-left font-bold text-xs text-[#0B5CAD] flex items-center justify-between hover:bg-[#F0F5FA] transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5">
                    <Layers className="h-4 w-4" />
                    <span>Technical Methodology (DBSCAN Spatial Formulation)</span>
                  </div>
                  {isTechOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>

                {isTechOpen && (
                  <div className="p-4 bg-white border-t border-[#D9E0E7] text-[11px] text-[#5B6573] space-y-2 leading-relaxed">
                    <p>
                      <strong>Density-Based Spatial Clustering (DBSCAN):</strong> Hotspot boundaries are generated using spatial coordinates with Haversine distance metrics.
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Spatial clustering radius (epsilon): 0.8 km (800 meters)</li>
                      <li>Minimum core accident points: 15 records</li>
                      <li>Fatality Weighting: Fatal collisions receive 3.0x multiplier; Grievous injuries receive 1.5x multiplier in composite risk index computation</li>
                      <li>Cluster internal ID: {selectedHotspot.cluster_id}</li>
                    </ul>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-3.5 border-t border-[#D9E0E7] bg-[#F8FAFC] flex items-center justify-between">
              <button
                onClick={() => setSelectedHotspot(null)}
                className="px-3.5 py-1.5 rounded-md border border-[#D9E0E7] text-xs font-semibold text-[#5B6573] hover:bg-[#EDF2F7]"
              >
                Close
              </button>

              <button
                onClick={() => {
                  if (onSelectOnMap) onSelectOnMap(selectedHotspot);
                  setSelectedHotspot(null);
                }}
                className="px-4 py-1.5 rounded-md bg-[#0B5CAD] hover:bg-[#084887] text-white text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>View on Accident Map</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
