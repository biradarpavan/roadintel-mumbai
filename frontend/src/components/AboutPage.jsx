import React from 'react';
import { 
  ShieldCheck, 
  Info, 
  Phone, 
  Database, 
  Award
} from 'lucide-react';

export default function AboutPage({ language = 'en' }) {
  const isMarathi = language === 'mr';

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="pb-3 border-b border-[#D9E0E7]">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1F2937]">
          {isMarathi ? 'रोडइंटेल मुंबई बद्दल' : 'About RoadIntel Mumbai'}
        </h1>
        <p className="text-xs sm:text-sm text-[#5B6573] mt-0.5">
          {isMarathi
            ? 'मुंबई महानगर प्रदेशातील रस्ता सुरक्षा आणि डेटा पारदर्शकतेसाठी नागरी उपक्रम'
            : 'Civic data intelligence initiative dedicated to evidence-based road safety in the Mumbai Metropolitan Region.'}
        </p>
      </div>

      {/* Main Mission Card */}
      <div className="bg-white border border-[#D9E0E7] border-l-4 border-l-[#0B5CAD] rounded-lg p-6 shadow-xs">
        <div className="flex items-center space-x-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-[#0B5CAD] text-white flex items-center justify-center font-bold text-sm">
            MH
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#1F2937]">
              RoadIntel Mumbai — Unified Road Accident Intelligence Platform
            </h2>
            <p className="text-xs text-[#5B6573]">
              Unified Accident Data Harmonization & Geospatial Intelligence
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#1F2937] leading-relaxed mt-4">
          RoadSafe Mumbai bridges the fragmentation between public datasets by standardizing heterogeneous accident reports from governmental bodies, police traffic branches, and urban transport open data repositories into a unified canonical schema.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white border border-[#D9E0E7] rounded-lg p-5 shadow-xs">
          <div className="h-9 w-9 rounded-md bg-[#E8F1FA] text-[#0B5CAD] flex items-center justify-center mb-3">
            <Database className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm text-[#1F2937]">Data Provenance</h3>
          <p className="text-xs text-[#5B6573] mt-1.5 leading-relaxed">
            Every statistic is strictly linked to its original publisher. Official National Crime Records Bureau (NCRB) figures are clearly separated from third-party open datasets.
          </p>
        </div>

        <div className="bg-white border border-[#D9E0E7] rounded-lg p-5 shadow-xs">
          <div className="h-9 w-9 rounded-md bg-[#E8F1FA] text-[#0B5CAD] flex items-center justify-center mb-3">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm text-[#1F2937]">Probabilistic Linkage</h3>
          <p className="text-xs text-[#5B6573] mt-1.5 leading-relaxed">
            Advanced cross-source deduplication algorithm resolves multi-agency reports of identical collisions without altering source records.
          </p>
        </div>

        <div className="bg-white border border-[#D9E0E7] rounded-lg p-5 shadow-xs">
          <div className="h-9 w-9 rounded-md bg-[#E8F1FA] text-[#0B5CAD] flex items-center justify-center mb-3">
            <Award className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm text-[#1F2937]">Spatial Cluster Modeling</h3>
          <p className="text-xs text-[#5B6573] mt-1.5 leading-relaxed">
            DBSCAN spatial clustering pinpoints 23 accident-prone corridors across Mumbai, calculating fatality-weighted risk scores to prioritize interventions.
          </p>
        </div>

      </div>

      {/* Official Disclaimer & Statutory Guidance */}
      <div className="bg-[#F8FAFC] border border-[#D9E0E7] rounded-lg p-5 text-xs text-[#1F2937] space-y-2 leading-relaxed">
        <div className="flex items-center space-x-2 font-bold text-[#0B5CAD] text-sm">
          <Info className="h-4 w-4" />
          <span>Statutory Disclaimer & Project Scope</span>
        </div>
        <p>
          RoadSafe Mumbai is a civic technology and data analytics prototype for road safety research, urban planning analysis, and public awareness. 
        </p>
        <p>
          The accident hotspot designations and risk scores displayed throughout this portal are analytical outputs derived from statistical algorithms. They do not constitute official police First Information Reports (FIRs), judicial determinations of fault, or official Ministry of Road Transport and Highways (MoRTH) black-spot designations unless explicitly cited as such.
        </p>
      </div>

      {/* Emergency Contacts Box */}
      <div className="bg-white border border-[#D9E0E7] rounded-lg p-5 shadow-xs">
        <h3 className="font-bold text-sm text-[#1F2937] mb-3 flex items-center space-x-2">
          <Phone className="h-4 w-4 text-[#0B5CAD]" />
          <span>Emergency Contacts & Helplines (Mumbai)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-[#F8FAFC] border border-[#D9E0E7] rounded-md">
            <span className="text-[#5B6573] block text-[11px]">National Emergency Service</span>
            <div className="text-base font-bold font-mono text-[#0B5CAD] mt-0.5">112</div>
            <span className="text-[11px] text-[#5B6573]">Police, Fire & Medical Response</span>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-[#D9E0E7] rounded-md">
            <span className="text-[#5B6573] block text-[11px]">Mumbai Traffic Police Control</span>
            <div className="text-base font-bold font-mono text-[#0B5CAD] mt-0.5">103 / 8454999999</div>
            <span className="text-[11px] text-[#5B6573]">Traffic congestion, accidents & towing</span>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-[#D9E0E7] rounded-md">
            <span className="text-[#5B6573] block text-[11px]">Emergency Medical Ambulance</span>
            <div className="text-base font-bold font-mono text-[#0B5CAD] mt-0.5">108</div>
            <span className="text-[11px] text-[#5B6573]">Government Emergency Medical Services</span>
          </div>
        </div>
      </div>

    </div>
  );
}
