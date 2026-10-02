import React from 'react';
import { X } from 'lucide-react';

export default function AccidentDetailModal({ accident, onClose }) {
  if (!accident) return null;

  const isFatal = accident.severity?.toLowerCase() === 'fatal';
  const isGrievous = accident.severity?.toLowerCase().includes('grievous') || accident.severity?.toLowerCase().includes('major');

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white border border-[#D9E0E7] rounded-lg w-full max-w-lg shadow-xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-4 border-b border-[#D9E0E7] flex items-center justify-between bg-[#F8FAFC]">
          <div>
            <span className="font-mono text-xs text-[#0B5CAD] font-bold">
              {accident.accident_id || accident.accidentId}
            </span>
            <h3 className="font-bold text-[#1F2937] text-sm sm:text-base mt-0.5">
              {accident.location || 'Mumbai Incident Location'}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-md hover:bg-[#EDF2F7] text-[#5B6573] hover:text-[#1F2937] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs text-[#1F2937]">
          
          {/* Status Bar */}
          <div className="flex items-center justify-between p-3 rounded-md bg-[#F8FAFC] border border-[#D9E0E7]">
            <div>
              <span className="text-[10px] text-[#5B6573] uppercase font-semibold block">Severity</span>
              <span 
                className={`font-bold font-mono text-sm ${
                  isFatal ? 'text-[#C62828]' : isGrievous ? 'text-[#C77B00]' : 'text-[#0B5CAD]'
                }`}
              >
                {accident.severity}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-[#5B6573] uppercase font-semibold block">Casualties</span>
              <span className="font-bold text-[#1F2937] font-mono text-sm">
                <span className={accident.fatalities > 0 ? 'text-[#C62828]' : ''}>{accident.fatalities} Fatal</span> / {accident.injured} Injured
              </span>
            </div>

            <div>
              <span className="text-[10px] text-[#5B6573] uppercase font-semibold block">Quality Score</span>
              <span className="font-bold text-[#18864B] font-mono text-sm">
                {Math.round((accident.data_quality_score || accident.dataQualityScore || 1.0) * 100)}%
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 bg-[#FFFFFF] p-4 rounded-md border border-[#D9E0E7]">
            <div>
              <span className="text-[#5B6573] block text-[10px] uppercase font-semibold">Date & Time</span>
              <strong className="text-[#1F2937]">{accident.date} {accident.time ? `at ${accident.time}` : ''}</strong>
            </div>

            <div>
              <span className="text-[#5B6573] block text-[10px] uppercase font-semibold">Vehicle Involved</span>
              <strong className="text-[#1F2937]">{accident.vehicle_type || accident.vehicleType || 'Not Specified'}</strong>
            </div>

            <div>
              <span className="text-[#5B6573] block text-[10px] uppercase font-semibold">Area / Corridor</span>
              <strong className="text-[#1F2937]">{accident.area || 'Mumbai Urban Corridor'}</strong>
            </div>

            <div>
              <span className="text-[#5B6573] block text-[10px] uppercase font-semibold">Road Classification</span>
              <strong className="text-[#1F2937]">{accident.road_type || 'Major Arterial Road'}</strong>
            </div>

            {accident.weather && (
              <div>
                <span className="text-[#5B6573] block text-[10px] uppercase font-semibold">Weather Conditions</span>
                <strong className="text-[#1F2937]">{accident.weather}</strong>
              </div>
            )}

            {accident.cause && (
              <div>
                <span className="text-[#5B6573] block text-[10px] uppercase font-semibold">Primary Cause</span>
                <strong className="text-[#1F2937]">{accident.cause}</strong>
              </div>
            )}
          </div>

          {/* Coordinates & Provenance */}
          <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#D9E0E7] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[#5B6573] text-[11px]">Geographic Coordinates:</span>
              <span className="font-mono text-[#1F2937] font-medium text-[11px]">
                {accident.latitude ? `${accident.latitude.toFixed(5)}, ${accident.longitude.toFixed(5)}` : 'Spatial point mapped'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#5B6573] text-[11px]">Data Source:</span>
              <span className="text-[#0B5CAD] font-bold text-[11px] font-mono">
                {accident.source}
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#D9E0E7] bg-[#F8FAFC] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-[#0B5CAD] hover:bg-[#084887] text-white text-xs font-semibold cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
