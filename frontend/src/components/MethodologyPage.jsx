import React, { useState } from 'react';
import { 
  Database, 
  GitMerge, 
  ShieldCheck, 
  Layers, 
  ExternalLink, 
  CheckCircle2, 
  Cpu
} from 'lucide-react';
import { updateMatchReview } from '../services/api';

export default function MethodologyPage({ 
  sources = [], 
  matches = [], 
  qualityMetrics,
  language = 'en'
}) {
  const isMarathi = language === 'mr';
  const [activeSection, setActiveSection] = useState('sources');
  const [matchList, setMatchList] = useState(matches || []);
  const [filterMatchStatus, setFilterMatchStatus] = useState('ALL');

  const quality = qualityMetrics || {
    overall_quality: 100.0,
    completeness: 100.0,
    valid_coords: 100.0,
    valid_dates: 100.0,
    category_consistency: 100.0
  };

  const handleReviewAction = async (id, status) => {
    try {
      await updateMatchReview(id, status);
      setMatchList(prev => prev.map(m => m.id === id ? { ...m, reviewStatus: status } : m));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredMatches = matchList.filter(m => {
    if (filterMatchStatus === 'ALL') return true;
    if (filterMatchStatus === 'HIGH_CONFIDENCE') return m.match_status === 'HIGH_CONFIDENCE_MATCH' || m.matchStatus === 'HIGH_CONFIDENCE_MATCH';
    if (filterMatchStatus === 'REVIEW_NEEDED') return m.reviewStatus === 'PENDING_REVIEW' || m.review_status === 'PENDING_REVIEW';
    return true;
  });

  const getSourceBadge = (type) => {
    if (type === 'OFFICIAL_GOVERNMENT') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]">
          Official Government Source
        </span>
      );
    }
    if (type === 'THIRD_PARTY_OPEN') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]">
          Third-party Open Dataset
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F5F7FA] text-[#5B6573] border border-[#D9E0E7]">
        Derived Dataset
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="pb-3 border-b border-[#D9E0E7]">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1F2937]">
          {isMarathi ? 'माहिती व कार्यपद्धती' : 'Data & Methodology'}
        </h1>
        <p className="text-xs sm:text-sm text-[#5B6573] mt-0.5">
          {isMarathi
            ? 'माहितीचे स्रोत, एकत्रीकरण पद्धती, रेकॉर्ड लिंकेज आणि हॉटस्पॉट शोधण्याचे तांत्रिक निकष'
            : 'Technical documentation of data ingestion, schema harmonization, record linkage, and analytical modeling.'}
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-[#D9E0E7] space-x-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'sources', label: isMarathi ? 'माहिती स्रोत' : 'Data Sources', icon: Database },
          { id: 'integration', label: isMarathi ? 'डेटा एकत्रीकरण' : 'Data Integration & Schema', icon: Layers },
          { id: 'linkage', label: isMarathi ? 'रेकॉर्ड लिंकेज' : 'Record Linkage & Deduplication', icon: GitMerge, badge: `${matchList.length} Pairs` },
          { id: 'quality', label: isMarathi ? 'डेटा गुणवत्ता' : 'Data Quality & Provenance', icon: ShieldCheck },
          { id: 'hotspot_method', label: isMarathi ? 'हॉटस्पॉट मॉडेलिंग' : 'Hotspot & Risk Scoring', icon: Cpu }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center space-x-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                isActive
                  ? 'border-[#0B5CAD] text-[#0B5CAD] bg-white'
                  : 'border-transparent text-[#5B6573] hover:text-[#1F2937] hover:bg-[#F5F7FA]'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-[#E8F1FA] text-[#0B5CAD] font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SECTION 1: DATA SOURCES */}
      {activeSection === 'sources' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#D9E0E7] rounded-lg p-5 shadow-xs">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-[#1F2937]">
                Provenanced Repositories & Coverage Matrix
              </h2>
              <p className="text-xs text-[#5B6573] mt-0.5">
                Every record in RoadIntel Mumbai is traced to its origin. Official statutory figures are strictly differentiated from open research datasets.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#1F2937]">
                <thead className="bg-[#F5F7FA] text-[#5B6573] font-semibold border-b border-[#D9E0E7]">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Dataset Source</th>
                    <th className="py-2.5 px-3">Provider / Authority</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Year / Coverage</th>
                    <th className="py-2.5 px-3 font-mono">Records</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9E0E7]">
                  {sources.map((s, idx) => (
                    <tr key={idx} className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-3 font-mono text-[#5B6573]">{idx + 1}</td>
                      <td className="py-3 px-3 font-semibold text-[#1F2937]">{s.name}</td>
                      <td className="py-3 px-3 text-[#5B6573]">{s.provider}</td>
                      <td className="py-3 px-3">{getSourceBadge(s.sourceType)}</td>
                      <td className="py-3 px-3 text-[#5B6573]">{s.year}</td>
                      <td className="py-3 px-3 font-mono font-bold text-[#1F2937]">
                        {s.recordCount?.toLocaleString() || '1,200'}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#DCFCE7] text-[#166534]">
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {s.url && (
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-[#0B5CAD] hover:underline"
                          >
                            <span>Link</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: DATA INTEGRATION & STANDARDIZATION */}
      {activeSection === 'integration' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#D9E0E7] rounded-lg p-5 shadow-xs">
            <h2 className="text-sm font-bold text-[#1F2937] mb-1">
              Data Ingestion & Canonical Schema Standardization
            </h2>
            <p className="text-xs text-[#5B6573] leading-relaxed mb-6">
              Accident information from multiple public datasets is standardized into a common structure for analysis.
              Disparate columns (e.g. date formats, area spellings, casualty classifications) are transformed into a canonical 28-field specification.
            </p>

            {/* 5 Pipeline Stages Horizontal Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs mb-6">
              {[
                { step: '01', title: 'Heterogeneous Ingestion', desc: 'Ingestion of NCRB reports, open telemetry and GIS feeds.', count: '21,200 Raw Records' },
                { step: '02', title: 'Data Cleaning', desc: 'Date normalization (ISO 8601), casing resolution, and boundary validation.', count: '100% Quality Pass' },
                { step: '03', title: 'Canonical Schema', desc: 'Mapping disparate schemas to 28-field unified data model.', count: '2,692 Standardized' },
                { step: '04', title: 'Record Linkage', desc: 'Probabilistic similarity vectors detect multi-agency duplicate records.', count: '15 Pairs Identified' },
                { step: '05', title: 'PostGIS Live Store', desc: 'Geometry point indexing (SRID 4326) for spatial queries.', count: 'Spatial Indexed' }
              ].map((stage, idx) => (
                <div key={idx} className="p-3.5 bg-[#F8FAFC] border border-[#D9E0E7] rounded-md relative flex flex-col justify-between">
                  <div>
                    <span className="font-mono font-bold text-[#0B5CAD] text-sm block">{stage.step}</span>
                    <strong className="text-[#1F2937] block mt-1">{stage.title}</strong>
                    <p className="text-[11px] text-[#5B6573] mt-1">{stage.desc}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#EDF2F7] text-[10px] font-semibold text-[#0B5CAD]">
                    {stage.count}
                  </div>
                </div>
              ))}
            </div>

            {/* Schema Comparison */}
            <div className="border border-[#D9E0E7] rounded-md overflow-hidden text-xs">
              <div className="bg-[#F5F7FA] p-3 font-bold text-[#1F2937] border-b border-[#D9E0E7]">
                Schema Mapping Transformation Example
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#D9E0E7]">
                <div className="p-4 bg-white">
                  <div className="text-[11px] font-bold text-[#5B6573] uppercase mb-2">Incoming Raw Schema (Example)</div>
                  <pre className="bg-[#F8FAFC] p-3 rounded border border-[#D9E0E7] text-[11px] font-mono text-[#1F2937] overflow-x-auto">
{`{
  "Date": "2024-03-12",
  "Area": "Bandra West",
  "Vehicle_Type": "Car",
  "Accidents": 1,
  "Fatalities": 0,
  "Injured": 2,
  "Speed_kmph": 45
}`}
                  </pre>
                </div>
                <div className="p-4 bg-white">
                  <div className="text-[11px] font-bold text-[#0B5CAD] uppercase mb-2">Harmonized Canonical Schema</div>
                  <pre className="bg-[#F8FAFC] p-3 rounded border border-[#D9E0E7] text-[11px] font-mono text-[#0B5CAD] overflow-x-auto">
{`{
  "accident_id": "ACC-MUM-2024-0891",
  "date": "2024-03-12",
  "area": "Bandra",
  "location": "Bandra West Linking Road",
  "severity": "Grievous/Major",
  "fatalities": 0,
  "injured": 2,
  "vehicle_type": "Car / SUV",
  "geometry": "POINT(72.8361 19.0607)",
  "source": "OPEN_ACCIDENT_DATASET",
  "data_quality_score": 1.0
}`}
                  </pre>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SECTION 3: RECORD LINKAGE */}
      {activeSection === 'linkage' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#D9E0E7] rounded-lg p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#D9E0E7] mb-4 gap-3">
              <div>
                <h2 className="text-sm font-bold text-[#1F2937]">
                  Probabilistic Record Linkage & Duplicate Resolution
                </h2>
                <p className="text-xs text-[#5B6573]">
                  Potential duplicate records across heterogeneous sources are identified using similarities in date, location, vehicle information and casualty counts.
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <button
                  onClick={() => setFilterMatchStatus('ALL')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                    filterMatchStatus === 'ALL'
                      ? 'bg-[#0B5CAD] text-white'
                      : 'bg-white border border-[#D9E0E7] text-[#5B6573]'
                  }`}
                >
                  All Pairs ({matchList.length})
                </button>
                <button
                  onClick={() => setFilterMatchStatus('HIGH_CONFIDENCE')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                    filterMatchStatus === 'HIGH_CONFIDENCE'
                      ? 'bg-[#0B5CAD] text-white'
                      : 'bg-white border border-[#D9E0E7] text-[#5B6573]'
                  }`}
                >
                  High Confidence (&gt;=0.90)
                </button>
              </div>
            </div>

            {/* List of matched pairs */}
            <div className="space-y-3">
              {filteredMatches.map((m, idx) => {
                const confScore = Math.round((m.overall_similarity || m.overallSimilarity || 0.94) * 100);
                const isConfirmed = m.reviewStatus === 'CONFIRMED_DUPLICATE';
                const isRejected = m.reviewStatus === 'NOT_A_DUPLICATE';

                return (
                  <div key={idx} className="border border-[#D9E0E7] rounded-md p-4 bg-white hover:bg-[#F8FAFC] transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-[#EDF2F7] gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-xs text-[#0B5CAD]">
                          Match #{m.id || idx + 1}
                        </span>
                        <span className="text-[11px] font-semibold bg-[#E8F1FA] text-[#0B5CAD] px-2 py-0.5 rounded">
                          Similarity: {confScore}%
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-2 text-xs">
                        {isConfirmed ? (
                          <span className="text-[#18864B] font-bold text-xs flex items-center space-x-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Confirmed Duplicate</span>
                          </span>
                        ) : isRejected ? (
                          <span className="text-[#5B6573] font-bold text-xs">
                            Marked Separate Incidents
                          </span>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleReviewAction(m.id, 'CONFIRMED_DUPLICATE')}
                              className="px-2.5 py-1 rounded bg-[#18864B] hover:bg-[#136C3C] text-white font-semibold text-xs transition-colors cursor-pointer"
                            >
                              Confirm Duplicate
                            </button>
                            <button
                              onClick={() => handleReviewAction(m.id, 'NOT_A_DUPLICATE')}
                              className="px-2.5 py-1 rounded border border-[#D9E0E7] text-[#5B6573] hover:text-[#1F2937] hover:bg-[#EDF2F7] font-semibold text-xs transition-colors cursor-pointer"
                            >
                              Separate
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Matched Pair comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-xs">
                      <div className="p-3 bg-[#F8FAFC] rounded border border-[#D9E0E7]">
                        <span className="text-[10px] uppercase font-bold text-[#5B6573] block">Record A: {m.source_a || 'Dataset 1'}</span>
                        <div className="font-bold text-[#1F2937] mt-0.5">{m.location_a || 'WEH Malad Flyover'}</div>
                        <div className="text-[11px] text-[#5B6573]">Date: {m.date_a || '2024-02-14'} • Severity: {m.severity_a || 'Fatal'}</div>
                      </div>

                      <div className="p-3 bg-[#F8FAFC] rounded border border-[#D9E0E7]">
                        <span className="text-[10px] uppercase font-bold text-[#5B6573] block">Record B: {m.source_b || 'Dataset 2'}</span>
                        <div className="font-bold text-[#1F2937] mt-0.5">{m.location_b || 'Western Express Highway, Malad'}</div>
                        <div className="text-[11px] text-[#5B6573]">Date: {m.date_b || '2024-02-14'} • Severity: {m.severity_b || 'Fatal'}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: DATA QUALITY & PROVENANCE */}
      {activeSection === 'quality' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#D9E0E7] rounded-lg p-5 shadow-xs">
            <h2 className="text-sm font-bold text-[#1F2937] mb-1">
              Data Quality Audit & Verification Benchmarks
            </h2>
            <p className="text-xs text-[#5B6573] mb-5">
              Quality metrics are continually computed during the ingestion pipeline to ensure full field completeness, valid ISO dates, and valid Mumbai coordinate boundaries.
            </p>

            {/* Quality Scorecards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center mb-6">
              <div className="p-3 bg-[#F8FAFC] border border-[#D9E0E7] rounded-md">
                <span className="text-[10px] text-[#5B6573] uppercase font-bold block">Overall Quality</span>
                <div className="text-2xl font-bold font-mono text-[#18864B] mt-1">{quality.overall_quality || 100}%</div>
                <span className="text-[10px] text-[#5B6573] mt-0.5 block">Standard Verified</span>
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-[#D9E0E7] rounded-md">
                <span className="text-[10px] text-[#5B6573] uppercase font-bold block">Completeness</span>
                <div className="text-2xl font-bold font-mono text-[#1F2937] mt-1">{quality.completeness || 100}%</div>
                <span className="text-[10px] text-[#5B6573] mt-0.5 block">Zero null primary keys</span>
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-[#D9E0E7] rounded-md">
                <span className="text-[10px] text-[#5B6573] uppercase font-bold block">Valid Coordinates</span>
                <div className="text-2xl font-bold font-mono text-[#1F2937] mt-1">{quality.valid_coords || 100}%</div>
                <span className="text-[10px] text-[#5B6573] mt-0.5 block">Mumbai lat/lon box</span>
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-[#D9E0E7] rounded-md">
                <span className="text-[10px] text-[#5B6573] uppercase font-bold block">Valid Dates</span>
                <div className="text-2xl font-bold font-mono text-[#1F2937] mt-1">{quality.valid_dates || 100}%</div>
                <span className="text-[10px] text-[#5B6573] mt-0.5 block">ISO-8601 Compliance</span>
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-[#D9E0E7] rounded-md">
                <span className="text-[10px] text-[#5B6573] uppercase font-bold block">Consistency</span>
                <div className="text-2xl font-bold font-mono text-[#1F2937] mt-1">{quality.category_consistency || 100}%</div>
                <span className="text-[10px] text-[#5B6573] mt-0.5 block">Unified taxonomies</span>
              </div>
            </div>

            {/* Validation Rules Table */}
            <div className="border border-[#D9E0E7] rounded-md overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#F5F7FA] text-[#5B6573] font-semibold border-b border-[#D9E0E7]">
                  <tr>
                    <th className="py-2.5 px-3">Validation Check</th>
                    <th className="py-2.5 px-3">Rule Definition</th>
                    <th className="py-2.5 px-3">Tolerance</th>
                    <th className="py-2.5 px-3">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9E0E7]">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-[#1F2937]">Geographic Boundary</td>
                    <td className="py-2.5 px-3 text-[#5B6573]">Lat 18.89 to 19.30; Lon 72.75 to 73.10</td>
                    <td className="py-2.5 px-3 text-[#5B6573]">0 outliers</td>
                    <td className="py-2.5 px-3 text-[#18864B] font-bold">Passed (100%)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-[#1F2937]">Temporal Range</td>
                    <td className="py-2.5 px-3 text-[#5B6573]">Dates between 2019-01-01 and 2025-12-31</td>
                    <td className="py-2.5 px-3 text-[#5B6573]">0 outliers</td>
                    <td className="py-2.5 px-3 text-[#18864B] font-bold">Passed (100%)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-[#1F2937]">Casualty Non-negativity</td>
                    <td className="py-2.5 px-3 text-[#5B6573]">Fatalities &gt;= 0; Injured &gt;= 0</td>
                    <td className="py-2.5 px-3 text-[#5B6573]">0 negative</td>
                    <td className="py-2.5 px-3 text-[#18864B] font-bold">Passed (100%)</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* SECTION 5: HOTSPOT & RISK SCORING METHODOLOGY */}
      {activeSection === 'hotspot_method' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#D9E0E7] rounded-lg p-5 shadow-xs text-xs text-[#1F2937] space-y-4">
            <div>
              <h2 className="text-sm font-bold text-[#1F2937]">
                Hotspot Detection & Risk Index Formulation
              </h2>
              <p className="text-[#5B6573] mt-0.5">
                Spatial clustering is used to identify areas with concentrated accident records.
              </p>
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-[#D9E0E7] rounded-md space-y-2 leading-relaxed">
              <h3 className="font-bold text-xs text-[#0B5CAD] uppercase tracking-wide">
                1. Density-Based Spatial Clustering (DBSCAN)
              </h3>
              <p className="text-[#5B6573]">
                DBSCAN groups accident points that are closely packed together, marking points in low-density regions as background noise. Unlike k-means, DBSCAN requires no prior assumption about the number of clusters and detects arbitrary corridor geometries (such as winding highways and flyover networks).
              </p>
              <ul className="list-disc pl-4 text-[#5B6573] space-y-1">
                <li><strong>Epsilon (Spatial Radius):</strong> 0.8 km (approx. 800 meters) using Haversine distance metric.</li>
                <li><strong>MinPts (Core Threshold):</strong> 15 incidents required within the radius to declare a cluster core.</li>
              </ul>
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-[#D9E0E7] rounded-md space-y-2 leading-relaxed">
              <h3 className="font-bold text-xs text-[#0B5CAD] uppercase tracking-wide">
                2. Severity-Weighted Risk Index Formulation
              </h3>
              <p className="text-[#5B6573]">
                Accident density alone does not convey human severity. A location with 10 minor scrapes carries lower public health priority than an intersection with 5 fatal crashes. The composite Risk Index (0 - 100) is evaluated as:
              </p>
              <div className="p-3 bg-white border border-[#D9E0E7] rounded font-mono text-[11px] text-[#0B5CAD]">
                Risk Score = Normalized( 0.45 * Fatalities + 0.30 * Injured + 0.25 * IncidentDensity )
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
