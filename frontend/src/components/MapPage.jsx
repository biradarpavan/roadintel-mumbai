import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip as MapTooltip, useMap } from 'react-leaflet';
import { 
  Layers, 
  Search, 
  RotateCcw, 
  X,
  AlertTriangle
} from 'lucide-react';
import { isValidAccidentCoordinate } from '../services/api';

const MUMBAI_CENTER = [19.0760, 72.8777];

function MapViewController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 11);
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapPage({ 
  accidents = [], 
  hotspots = [], 
  onSelectAccident,
  language = 'en'
}) {
  const isMarathi = language === 'mr';
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [showAccidents, setShowAccidents] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mapCenter, setMapCenter] = useState(MUMBAI_CENTER);
  const [mapZoom, setMapZoom] = useState(11);

  // First: validate coordinates — reject nulls, zeros, and offshore/ocean points
  const validAccidents = accidents.filter(a => isValidAccidentCoordinate(a.latitude, a.longitude));
  const invalidCoordCount = accidents.length - validAccidents.length;

  // Then: apply user filters on valid records only
  const filteredAccidents = validAccidents.filter(a => {
    if (severityFilter !== 'all' && a.severity?.toLowerCase() !== severityFilter.toLowerCase()) {
      return false;
    }
    if (vehicleFilter !== 'all' && !a.vehicle_type?.toLowerCase().includes(vehicleFilter.toLowerCase())) {
      return false;
    }
    if (areaFilter !== 'all' && !a.area?.toLowerCase().includes(areaFilter.toLowerCase())) {
      return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = a.accident_id?.toLowerCase().includes(q) ||
                    a.location?.toLowerCase().includes(q) ||
                    a.area?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Limit rendering points for browser responsiveness
  const displayedAccidents = filteredAccidents.slice(0, 350);

  const getMarkerColor = (sev) => {
    const s = String(sev || '').toLowerCase();
    if (s.includes('fatal')) return '#C62828'; // Red
    if (s.includes('major') || s.includes('grievous')) return '#C77B00'; // Amber/Orange
    if (s.includes('minor')) return '#0B5CAD'; // Blue
    return '#5B6573'; // Grey
  };

  const handleHotspotClick = (h) => {
    setSelectedHotspot(h);
    setMapCenter([h.centroid_lat, h.centroid_lon]);
    setMapZoom(13);
  };

  const handleReset = () => {
    setSeverityFilter('all');
    setVehicleFilter('all');
    setAreaFilter('all');
    setSearchTerm('');
    setMapCenter(MUMBAI_CENTER);
    setMapZoom(11);
    setSelectedHotspot(null);
  };

  return (
    <div className="space-y-4">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-[#D9E0E7] gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1F2937]">
            {isMarathi ? 'अपघात नकाशा' : 'Accident Map'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6573]">
            {isMarathi 
              ? 'मुंबई महानगर प्रदेशातील अपघातांचे भौगोलिक वितरण व क्लस्टर्स'
              : 'Geospatial distribution of reported road accidents and identified clusters.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#5B6573] self-start sm:self-auto font-mono">
          <span className="bg-white border border-[#D9E0E7] px-2.5 py-1 rounded">
            {filteredAccidents.length.toLocaleString()} {isMarathi ? 'अपघात दर्शविले' : 'incidents filtered'}
          </span>
        </div>
      </div>

      {/* Control Panel Above Map */}
      <div className="bg-white border border-[#D9E0E7] rounded-lg p-3 sm:p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Search */}
            <div className="relative w-48 sm:w-56">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[#5B6573]" />
              <input
                type="text"
                placeholder={isMarathi ? 'ठिकाण शोधा...' : 'Search location or ID...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#F5F7FA] border border-[#D9E0E7] rounded-md pl-8 pr-2.5 py-1 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B5CAD]"
              />
            </div>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-white border border-[#D9E0E7] rounded-md px-2.5 py-1 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B5CAD]"
            >
              <option value="all">All Severities</option>
              <option value="Fatal">Fatal</option>
              <option value="Grievous/Major">Major / Grievous</option>
              <option value="Minor">Minor</option>
              <option value="Non-Injury">Non-Injury</option>
            </select>

            {/* Vehicle Type Filter */}
            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="bg-white border border-[#D9E0E7] rounded-md px-2.5 py-1 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B5CAD]"
            >
              <option value="all">All Vehicle Types</option>
              <option value="Two-Wheeler">Two-Wheeler</option>
              <option value="Car">Car / SUV</option>
              <option value="Truck">Truck / Heavy</option>
              <option value="Auto">Auto-Rickshaw</option>
              <option value="Bus">Bus</option>
            </select>

            {/* Area Filter */}
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="bg-white border border-[#D9E0E7] rounded-md px-2.5 py-1 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B5CAD]"
            >
              <option value="all">All Areas</option>
              <option value="Western">Western Suburbs</option>
              <option value="Eastern">Eastern Suburbs</option>
              <option value="Andheri">Andheri</option>
              <option value="Bandra">Bandra</option>
              <option value="Dadar">Dadar</option>
              <option value="Malad">Malad</option>
              <option value="Sion">Sion</option>
              <option value="Kurla">Kurla</option>
            </select>

            <button
              onClick={handleReset}
              className="p-1 rounded-md border border-[#D9E0E7] text-[#5B6573] hover:text-[#1F2937] hover:bg-[#F5F7FA] transition-colors"
              title="Reset Filters"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Layer Toggles */}
          <div className="flex items-center space-x-3 text-xs text-[#1F2937]">
            <span className="font-semibold text-[#5B6573] flex items-center space-x-1">
              <Layers className="h-3.5 w-3.5 text-[#0B5CAD]" />
              <span>Layers:</span>
            </span>

            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showAccidents}
                onChange={(e) => setShowAccidents(e.target.checked)}
                className="rounded border-[#D9E0E7] text-[#0B5CAD] focus:ring-0"
              />
              <span className="flex items-center space-x-1">
                <span className="h-2 w-2 rounded-full bg-[#0B5CAD] inline-block"></span>
                <span>Accident Points</span>
              </span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showHotspots}
                onChange={(e) => setShowHotspots(e.target.checked)}
                className="rounded border-[#D9E0E7] text-[#C77B00] focus:ring-0"
              />
              <span className="flex items-center space-x-1">
                <span className="h-2 w-2 rounded-full bg-[#C77B00] inline-block"></span>
                <span>Hotspot Clusters</span>
              </span>
            </label>
          </div>

        </div>
      </div>

      {/* Main Map Box & Optional Hotspot Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Leaflet Light Map Container */}
        <div className={`relative rounded-lg overflow-hidden border border-[#D9E0E7] shadow-xs bg-white h-[600px] ${selectedHotspot ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <MapViewController center={mapCenter} zoom={mapZoom} />

            {/* Standard OpenStreetMap Free Tiles - NO API KEY, NO WATERMARK */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render Accident Points — pre-validated by isValidAccidentCoordinate() */}
            {showAccidents && displayedAccidents.map((acc, idx) => {
              // Coordinates already validated above; skip any that slipped through
              if (!isValidAccidentCoordinate(acc.latitude, acc.longitude)) return null;
              const col = getMarkerColor(acc.severity);
              const isFatal = acc.severity?.toLowerCase() === 'fatal';

              return (
                <CircleMarker
                  key={`acc-${acc.accident_id || idx}`}
                  center={[acc.latitude, acc.longitude]}
                  radius={isFatal ? 6 : 4}
                  pathOptions={{
                    color: col,
                    fillColor: col,
                    fillOpacity: 0.8,
                    weight: 1.5
                  }}
                  eventHandlers={{
                    click: () => onSelectAccident && onSelectAccident(acc)
                  }}
                >
                  <Popup>
                    <div className="text-xs space-y-1.5 py-1">
                      <div className="flex items-center justify-between border-b border-[#D9E0E7] pb-1">
                        <span className="font-mono font-bold text-[#0B5CAD]">
                          {acc.accident_id}
                        </span>
                        <span 
                          className="px-1.5 py-0.2 rounded text-[10px] font-bold"
                          style={{ 
                            backgroundColor: isFatal ? '#FEE2E2' : '#E8F1FA', 
                            color: isFatal ? '#C62828' : '#0B5CAD' 
                          }}
                        >
                          {acc.severity}
                        </span>
                      </div>

                      <div className="font-semibold text-[#1F2937] text-[13px]">
                        {acc.location}
                      </div>

                      <div className="text-[#5B6573] text-[11px] grid grid-cols-2 gap-1 pt-1">
                        <div>
                          <span className="text-[#94A3B8] block text-[9px] uppercase">Date & Time</span>
                          <strong>{acc.date} {acc.time ? `• ${acc.time}` : ''}</strong>
                        </div>
                        <div>
                          <span className="text-[#94A3B8] block text-[9px] uppercase">Vehicle</span>
                          <strong>{acc.vehicle_type || 'Unknown'}</strong>
                        </div>
                        <div>
                          <span className="text-[#94A3B8] block text-[9px] uppercase">Fatalities</span>
                          <strong className={acc.fatalities > 0 ? 'text-[#C62828]' : ''}>
                            {acc.fatalities}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[#94A3B8] block text-[9px] uppercase">Injured</span>
                          <strong>{acc.injured}</strong>
                        </div>
                      </div>

                      <div className="text-[10px] text-[#5B6573] pt-1 border-t border-[#EDF2F7]">
                        Source: <strong>{acc.source}</strong>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}

            {/* Render Hotspot Clusters — validate centroid coordinates */}
            {showHotspots && hotspots.map((h, idx) => {
              if (!isValidAccidentCoordinate(h.centroid_lat, h.centroid_lon)) return null;
              const isCrit = h.severity_level === 'CRITICAL' || h.risk_score >= 60;
              const clusterColor = isCrit ? '#C62828' : '#C77B00';

              return (
                <React.Fragment key={`hotspot-${h.hotspot_id || idx}`}>
                  {/* Danger zone circle */}
                  <CircleMarker
                    center={[h.centroid_lat, h.centroid_lon]}
                    radius={Math.min(28, Math.max(14, (h.accident_count || 30) / 2.5))}
                    pathOptions={{
                      color: clusterColor,
                      fillColor: clusterColor,
                      fillOpacity: 0.15,
                      weight: 1.5,
                      dashArray: '3, 3'
                    }}
                  />

                  {/* Centroid Marker */}
                  <CircleMarker
                    center={[h.centroid_lat, h.centroid_lon]}
                    radius={7}
                    pathOptions={{
                      color: '#FFFFFF',
                      fillColor: clusterColor,
                      fillOpacity: 0.95,
                      weight: 2
                    }}
                    eventHandlers={{
                      click: () => handleHotspotClick(h)
                    }}
                  >
                    <MapTooltip direction="top" offset={[0, -8]} opacity={0.95}>
                      <span className="font-bold text-xs">{h.name || h.area}</span>
                    </MapTooltip>
                  </CircleMarker>
                </React.Fragment>
              );
            })}

          </MapContainer>

          {/* Map Legend (Bottom Left) */}
          <div className="absolute bottom-4 left-4 z-[400] bg-white p-3 rounded-md border border-[#D9E0E7] shadow-sm text-xs text-[#1F2937] space-y-1.5 select-none">
            <div className="font-bold text-xs text-[#1F2937] mb-1">
              {isMarathi ? 'नकाशा सूची (Legend)' : 'Map Legend'}
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#C62828]"></span>
              <span>{isMarathi ? 'प्राणघातक अपघात' : 'Fatal Accident'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#C77B00]"></span>
              <span>{isMarathi ? 'गंभीर अपघात' : 'Grievous / Major'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0B5CAD]"></span>
              <span>{isMarathi ? 'किरकोळ अपघात' : 'Minor Accident'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#C77B00] opacity-50 border border-dashed border-[#C77B00]"></span>
              <span>{isMarathi ? 'अपघात हॉटस्पॉट' : 'Hotspot Cluster'}</span>
            </div>
            {invalidCoordCount > 0 && (
              <div className="mt-2 pt-2 border-t border-[#EDF2F7] flex items-start space-x-1.5 text-[#92400E]">
                <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                <span className="text-[10px]">
                  {invalidCoordCount} record{invalidCoordCount > 1 ? 's' : ''} excluded (invalid/offshore coords)
                </span>
              </div>
            )}
          </div>

        </div>

        {/* Selected Hotspot Details Sidebar (if a cluster is clicked) */}
        {selectedHotspot && (
          <div className="bg-white border border-[#D9E0E7] rounded-lg p-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#D9E0E7]">
                <span className="font-mono text-xs text-[#0B5CAD] font-bold">
                  {selectedHotspot.hotspot_id}
                </span>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="p-1 text-[#5B6573] hover:text-[#1F2937]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#5B6573] block">Identified Hotspot</span>
                <h3 className="font-bold text-sm text-[#1F2937] mt-0.5">{selectedHotspot.name}</h3>
                <p className="text-xs text-[#5B6573]">{selectedHotspot.area}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#F8FAFC] border border-[#D9E0E7] rounded-md text-xs">
                <div>
                  <span className="text-[10px] text-[#5B6573] block">Accidents</span>
                  <strong className="text-base font-bold text-[#1F2937]">{selectedHotspot.accident_count}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#5B6573] block">Fatalities</span>
                  <strong className="text-base font-bold text-[#C62828]">{selectedHotspot.fatalities}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#5B6573] block">Persons Injured</span>
                  <strong className="text-base font-bold text-[#1F2937]">{selectedHotspot.injured}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#5B6573] block">Risk Score</span>
                  <strong className="text-base font-bold text-[#0B5CAD]">{selectedHotspot.risk_score} / 100</strong>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-[#5B6573]">
                <div>Dominant Vehicle: <strong className="text-[#1F2937]">{selectedHotspot.dominant_vehicle}</strong></div>
                <div>Peak Hours: <strong className="text-[#1F2937]">{selectedHotspot.peak_hour}</strong></div>
                <div>Dominant Cause: <strong className="text-[#1F2937]">{selectedHotspot.dominant_cause}</strong></div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#D9E0E7] text-center">
              <span className="text-[11px] text-[#5B6573]">
                Analytical output derived from spatial density calculations.
              </span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
