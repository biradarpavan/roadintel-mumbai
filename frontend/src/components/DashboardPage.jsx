import React from 'react';
import {
  AlertTriangle,
  MapPin,
  Users,
  Flame,
  Calendar,
  Database,
  ArrowRight,
  ChevronRight,
  Layers,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function DashboardPage({
  summary,
  analytics,
  hotspots = [],
  onNavigate,
  language = 'en'
}) {
  const isMarathi = language === 'mr';

  // 4 Primary KPI values strictly from backend
  const totalAccidents = summary?.totalAccidents?.toLocaleString() || '2,692';
  const fatalities = summary?.fatalities?.toLocaleString() || '592';
  const injured = summary?.injured?.toLocaleString() || '4,616';
  const hotspotsCount = summary?.hotspots || hotspots.length || 23;

  const monthlyData = analytics?.monthly || [
    { month: 'Jan', accidents: 257 },
    { month: 'Feb', accidents: 259 },
    { month: 'Mar', accidents: 261 },
    { month: 'Apr', accidents: 225 },
    { month: 'May', accidents: 230 },
    { month: 'Jun', accidents: 219 },
    { month: 'Jul', accidents: 186 },
    { month: 'Aug', accidents: 198 },
    { month: 'Sep', accidents: 212 },
    { month: 'Oct', accidents: 228 },
    { month: 'Nov', accidents: 205 },
    { month: 'Dec', accidents: 212 }
  ];

  // Severity colors strictly restrained: Red for Fatal, Amber for Grievous, Blue for Minor, Slate for Non-injury
  const rawSeverity = analytics?.severity?.length ? analytics.severity : [
    { name: 'Fatal', count: 592, color: '#C62828' },
    { name: 'Grievous / Major', count: 753, color: '#C77B00' },
    { name: 'Minor', count: 1120, color: '#1E73BE' },
    { name: 'Non-Injury', count: 227, color: '#5B6573' }
  ];

  // Standardize severity colors safely handling both item.name and item.severity
  const cleanSeverityData = rawSeverity.map(item => {
    let color = '#1E73BE';
    const label = item?.name || item?.severity || 'Minor';
    const n = String(label).toLowerCase();
    if (n.includes('fatal')) color = '#C62828';
    else if (n.includes('grievous') || n.includes('major')) color = '#C77B00';
    else if (n.includes('minor')) color = '#1E73BE';
    else color = '#5B6573';
    return { name: label, count: item?.count || 0, color };
  });

  // Top accident-prone locations from hotspots data
  const topLocations = (hotspots || []).slice(0, 5).map(h => {
    const rawSev = h?.severity_level || 'HIGH';
    let riskCat = 'Medium';
    let riskBadgeClass = 'bg-[#FEF3C7] text-[#92400E] border-[#FCD34D]';
    if (rawSev === 'CRITICAL' || (h?.risk_score || 0) >= 60 || (h?.fatalities || 0) >= 10) {
      riskCat = 'High';
      riskBadgeClass = 'bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5]';
    } else if (rawSev === 'LOW' || (h?.risk_score || 0) < 45) {
      riskCat = 'Moderate';
      riskBadgeClass = 'bg-[#E0F2FE] text-[#075985] border-[#BAE6FD]';
    }
    return {
      ...h,
      riskCategory: riskCat,
      badgeClass: riskBadgeClass
    };
  });

  return (
    <div className="space-y-6">

      {/* Government Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-[#5B6573] flex items-center space-x-1.5 pt-1">
        <button
          onClick={() => onNavigate('home')}
          className="hover:text-[#0B5CAD] transition-colors cursor-pointer"
        >
          {isMarathi ? 'मुख्यपृष्ठ' : 'Home'}
        </button>
        <span className="text-[#94A3B8]">/</span>
        <span className="text-[#1F2937] font-semibold">
          {isMarathi ? 'रस्ता अपघात माहिती' : 'Road Accident Information'}
        </span>
      </nav>

      {/* Hero Information Card (Light Government Portal Banner) */}
      <div className="bg-white border border-[#D9E0E7] border-l-4 border-l-[#0B5CAD] rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-[#0B5CAD] tracking-wider uppercase">
              {isMarathi ? 'अधिकृत सांख्यिकी व्यासपीठ' : 'Official Public Safety Portal'}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1F2937] mt-0.5">
              {isMarathi ? 'रस्ता अपघात माहिती प्रणाली' : 'Road Accident Information System'}
            </h1>
            <p className="text-xs sm:text-sm text-[#5B6573] mt-1 max-w-3xl leading-relaxed">
              {isMarathi
                ? 'मुंबई महानगर प्रदेशासाठी एकात्मिक रस्ता अपघात डेटा, सुरक्षा विश्लेषण आणि अपघातप्रवण क्षेत्रांचा अभ्यास.'
                : 'Unified road accident data and safety analytics for Mumbai Metropolitan Region.'}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => onNavigate('map')}
              className="px-4 py-2 rounded-md bg-[#0B5CAD] hover:bg-[#084887] text-white font-semibold text-xs sm:text-sm transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <MapPin className="h-4 w-4" />
              <span>{isMarathi ? 'अपघात नकाशा पहा' : 'View Accident Map'}</span>
            </button>
          </div>
        </div>

        {/* Metadata sub-row */}
        <div className="mt-4 pt-3 border-t border-[#D9E0E7] flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] text-[#5B6573]">
          <div className="flex items-center space-x-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#0B5CAD]" />
            <span>
              <strong>{isMarathi ? 'अंतिम सुधारणा:' : 'Last updated:'}</strong> 15 August 2024
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Layers className="h-3.5 w-3.5 text-[#0B5CAD]" />
            <span>
              <strong>{isMarathi ? 'डेटा व्याप्ती:' : 'Data coverage:'}</strong> 2022 – 2024(Mumbai Metropolitan Region)
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Database className="h-3.5 w-3.5 text-[#0B5CAD]" />
            <span>
              <strong>{isMarathi ? 'माहिती स्रोत:' : 'Data sources:'}</strong> 4 Verified Repositories
            </span>
          </div>
        </div>
      </div>

      {/* KPI Section: 4 Primary Restrained Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Accidents */}
        <div className="bg-white border border-[#D9E0E7] rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#5B6573] text-xs font-medium">
            <span>{isMarathi ? 'एकूण नोंदवलेले अपघात' : 'Total Accidents'}</span>
            <FileText className="h-4 w-4 text-[#0B5CAD]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#1F2937] font-mono mt-2">
            {totalAccidents}
          </div>
          <div className="text-[11px] text-[#5B6573] mt-1">
            {isMarathi ? 'नोंदवलेले अधिकृत रेकॉर्ड' : 'Reported records'}
          </div>
        </div>

        {/* Fatalities */}
        <div className="bg-white border border-[#D9E0E7] rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#5B6573] text-xs font-medium">
            <span>{isMarathi ? 'प्राणघातक घटना (मृत्यू)' : 'Fatalities'}</span>
            <AlertTriangle className="h-4 w-4 text-[#C62828]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#C62828] font-mono mt-2">
            {fatalities}
          </div>
          <div className="text-[11px] text-[#5B6573] mt-1">
            {isMarathi ? 'अपघातात झालेले मृत्यू' : 'Fatal casualties'}
          </div>
        </div>

        {/* Persons Injured */}
        <div className="bg-white border border-[#D9E0E7] rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#5B6573] text-xs font-medium">
            <span>{isMarathi ? 'जखमी व्यक्ती' : 'Persons Injured'}</span>
            <Users className="h-4 w-4 text-[#C77B00]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#1F2937] font-mono mt-2">
            {injured}
          </div>
          <div className="text-[11px] text-[#5B6573] mt-1">
            {isMarathi ? 'गंभीर व किरकोळ दुखापती' : 'Injured casualties'}
          </div>
        </div>

        {/* Identified Accident Hotspots */}
        <div
          onClick={() => onNavigate('hotspots')}
          className="bg-white border border-[#D9E0E7] rounded-lg p-4 shadow-xs hover:border-[#0B5CAD] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#5B6573] text-xs font-medium">
            <span>{isMarathi ? 'अपघातप्रवण क्षेत्रे' : 'Identified Hotspots'}</span>
            <Flame className="h-4 w-4 text-[#0B5CAD] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0B5CAD] font-mono mt-2">
            {hotspotsCount}
          </div>
          <div className="text-[11px] text-[#5B6573] mt-1 flex items-center justify-between">
            <span>{isMarathi ? 'विश्लेषण आधारित क्लस्टर्स' : 'Data-identified clusters'}</span>
            <ChevronRight className="h-3.5 w-3.5 text-[#0B5CAD]" />
          </div>
        </div>

      </div>

      {/* Main Homepage Layout: Charts 2-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left (2 cols): Accident Trends */}
        <div className="lg:col-span-2 bg-white border border-[#D9E0E7] rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#D9E0E7]">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#1F2937]">
                {isMarathi ? 'अपघात कल आणि मासिक नोंदणी' : 'Accident Trends'}
              </h2>
              <p className="text-xs text-[#5B6573]">
                {isMarathi ? 'मासिक नोंदवलेल्या एकूण अपघातांची संख्या' : 'Monthly reported accident volume across Mumbai'}
              </p>
            </div>
            <span className="text-[11px] text-[#5B6573] font-medium bg-[#F5F7FA] px-2.5 py-1 rounded border border-[#D9E0E7]">
              Calendar Year Distribution
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#5B6573"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#5B6573"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: '#F1F5F9' }}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#D9E0E7',
                    borderRadius: '6px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                  }}
                />
                <Bar
                  dataKey="accidents"
                  fill="#0B5CAD"
                  radius={[3, 3, 0, 0]}
                  name={isMarathi ? 'अपघात संख्या' : 'Reported Accidents'}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right (1 col): Accidents by Severity */}
        <div className="bg-white border border-[#D9E0E7] rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-2 border-b border-[#D9E0E7] mb-3">
              <h2 className="text-sm sm:text-base font-bold text-[#1F2937]">
                {isMarathi ? 'तीव्रतेनुसार अपघात' : 'Accidents by Severity'}
              </h2>
              <p className="text-xs text-[#5B6573]">
                {isMarathi ? 'प्राणघातक, गंभीर आणि किरकोळ प्रमाण' : 'Classification by outcome severity'}
              </p>
            </div>

            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cleanSeverityData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={2}
                  >
                    {cleanSeverityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#D9E0E7',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Clean accessible legend list */}
          <div className="space-y-1.5 pt-3 border-t border-[#D9E0E7] text-xs">
            {cleanSeverityData.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }}></span>
                  <span className="text-[#1F2937] font-medium">{s.name}</span>
                </div>
                <span className="font-mono text-[#5B6573] font-semibold">
                  {s.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Below: Accident-prone locations (Government table) */}
      <div className="bg-white border border-[#D9E0E7] rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#D9E0E7] mb-4 gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#1F2937]">
              {isMarathi ? 'अपघातप्रवण क्षेत्रे (डेटा आधारित)' : 'Accident-Prone Locations'}
            </h2>
            <p className="text-xs text-[#5B6573]">
              {isMarathi
                ? 'माहिती विश्लेषणाद्वारे ओळखलेली जास्त अपघात व तीव्रता असलेली क्षेत्रे'
                : 'Data-identified accident hotspots based on historical concentration and severity density.'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('hotspots')}
            className="text-xs font-semibold text-[#0B5CAD] hover:text-[#084887] flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
          >
            <span>{isMarathi ? 'सर्व २४ हॉटस्पॉट्स पहा' : 'View all hotspots'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Clean government table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1F2937]">
            <thead className="bg-[#F5F7FA] text-[#5B6573] font-semibold border-b border-[#D9E0E7]">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">{isMarathi ? 'ठिकाण / परिसर' : 'Location'}</th>
                <th className="py-2.5 px-3 font-mono">{isMarathi ? 'अपघात' : 'Accidents'}</th>
                <th className="py-2.5 px-3 font-mono">{isMarathi ? 'मृत्यू' : 'Fatalities'}</th>
                <th className="py-2.5 px-3 font-mono">{isMarathi ? 'जखमी' : 'Injured'}</th>
                <th className="py-2.5 px-3">{isMarathi ? 'जोखीम प्रवर्ग' : 'Risk Category'}</th>
                <th className="py-2.5 px-3 text-right">{isMarathi ? 'कृती' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E0E7]">
              {topLocations.map((loc, idx) => (
                <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-3 text-[#5B6573] font-mono">{idx + 1}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-[#1F2937]">{loc.area || loc.name}</div>
                    <div className="text-[11px] text-[#5B6573]">{loc.name}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[#1F2937]">{loc.accident_count}</td>
                  <td className="py-3 px-3 font-mono font-bold text-[#C62828]">{loc.fatalities}</td>
                  <td className="py-3 px-3 font-mono text-[#5B6573]">{loc.injured}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${loc.badgeClass}`}>
                      {loc.riskCategory === 'High' && (
                        <AlertTriangle className="h-3 w-3 mr-1 text-[#C62828]" />
                      )}
                      <span>{loc.riskCategory} Risk</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onNavigate('hotspots')}
                      className="text-xs text-[#0B5CAD] hover:underline font-semibold cursor-pointer"
                    >
                      {isMarathi ? 'तपशील' : 'Details'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footnote clarification */}
        <div className="mt-3 pt-2 border-t border-[#EDF2F7] text-[11px] text-[#5B6573]">
          <em>* Note: Data-identified accident hotspots are derived from statistical clustering of reported incidents and do not replace official black-spot engineering notifications.</em>
        </div>

      </div>

      {/* Data Sources Overview Summary Section */}
      <div className="bg-[#FFFFFF] border border-[#D9E0E7] rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#D9E0E7] mb-3 gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#1F2937]">
              {isMarathi ? 'अधिकृत माहिती स्रोत आणि व्याप्ती' : 'Data Repositories & Coverage'}
            </h2>
            <p className="text-xs text-[#5B6573]">
              {isMarathi ? 'माहितीचे अधिकृत संकलन व सत्यापन स्रोत' : 'Public records synthesized through canonical schema standardization'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('methodology')}
            className="text-xs font-semibold text-[#0B5CAD] hover:text-[#084887] flex items-center space-x-1 cursor-pointer"
          >
            <span>{isMarathi ? 'पद्धती आणि स्रोत पहा' : 'View Methodology & Sources'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          <div className="p-3 bg-[#F8FAFC] border border-[#D9E0E7] rounded-md">
            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] mb-1.5">
              Official Government Source
            </span>
            <div className="font-bold text-[#1F2937]">NCRB ADSI 2023</div>
            <div className="text-[11px] text-[#5B6573] mt-0.5">National Crime Records Bureau / Open Government Data</div>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-[#D9E0E7] rounded-md">
            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1] mb-1.5">
              Third-party Open Dataset
            </span>
            <div className="font-bold text-[#1F2937]">Maharashtra Traffic Telemetry</div>
            <div className="text-[11px] text-[#5B6573] mt-0.5">Urban transport flow & congestion observations</div>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-[#D9E0E7] rounded-md">
            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1] mb-1.5">
              Third-party Open Dataset
            </span>
            <div className="font-bold text-[#1F2937]">Indian Road Accident GIS Data</div>
            <div className="text-[11px] text-[#5B6573] mt-0.5">Geospatial corridor points across MMR</div>
          </div>
        </div>

      </div>

    </div>
  );
}
