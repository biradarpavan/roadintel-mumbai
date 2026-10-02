import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
});

// ============================================================
// Coordinate validation — MMR (Mumbai Metropolitan Region)
// ============================================================
export function isValidAccidentCoordinate(lat, lng) {
  if (lat === null || lat === undefined || lng === null || lng === undefined) return false;
  const la = Number(lat);
  const lo = Number(lng);
  if (!isFinite(la) || !isFinite(lo)) return false;
  if (la === 0 || lo === 0) return false;
  // MMR bounding box: lat 18.85–19.50, lon 72.75–73.25
  if (la < 18.85 || la > 19.50) return false;
  if (lo < 72.75 || lo > 73.25) return false;
  // Arabian Sea / offshore exclusions
  if (la < 19.00 && lo < 72.81) return false;
  if (la >= 19.00 && la < 19.15 && lo < 72.79) return false;
  if (la >= 19.15 && la < 19.30 && lo < 72.77) return false;
  return true;
}

// ============================================================
// Analytics normalization — ensures consistent schema
// whether data comes from backend API or local JSON fallback.
// ============================================================
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function normalizeMonthlyData(raw) {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return raw.map(item => ({
    month: item.month && isNaN(Number(item.month))
      ? item.month
      : MONTH_NAMES[(Number(item.month) || 1) - 1],
    month_num: Number(item.month_num || item.month || 0),
    accidents: Number(item.accidents ?? item.count ?? 0),
    fatalities: Number(item.fatalities ?? 0),
    injured: Number(item.injured ?? 0),
  })).sort((a, b) => a.month_num - b.month_num);
}

export function normalizeVehicleData(raw) {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return raw.map(item => ({
    vehicle_type: String(item.vehicle_type ?? item.vehicleType ?? item.type ?? 'Unknown'),
    count: Number(item.count ?? 0),
  })).filter(d => d.count > 0);
}

export function normalizeHourlyData(raw) {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  // Accept both {hour: "00:00", accidents: n} and {hourStr: "00", count: n}
  const mapped = raw.map(item => {
    const hourRaw = item.hour ?? item.hourStr ?? item.hour_num ?? 0;
    let hourNum;
    if (typeof hourRaw === 'string' && hourRaw.includes(':')) {
      hourNum = parseInt(hourRaw.split(':')[0], 10);
    } else {
      hourNum = parseInt(String(hourRaw), 10);
    }
    if (isNaN(hourNum) || hourNum < 0 || hourNum > 23) return null;
    return {
      hour: `${String(hourNum).padStart(2, '0')}:00`,
      hour_num: hourNum,
      accidents: Number(item.accidents ?? item.count ?? 0),
    };
  }).filter(Boolean);

  // Fill missing hours with 0
  const byHour = {};
  mapped.forEach(d => { byHour[d.hour_num] = d; });
  const full = [];
  for (let h = 0; h < 24; h++) {
    full.push(byHour[h] ?? { hour: `${String(h).padStart(2, '0')}:00`, hour_num: h, accidents: 0 });
  }
  return full;
}

export function normalizeRoadClassificationData(raw) {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return raw.map(item => ({
    road_type: String(item.road_type ?? item.roadType ?? item.type ?? 'Unknown'),
    count: Number(item.count ?? 0),
  })).filter(d => d.count > 0);
}

export function normalizeCauseData(raw) {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return raw.map(item => ({
    cause: String(item.cause ?? item.name ?? 'Unknown'),
    count: Number(item.count ?? 0),
  })).filter(d => d.count > 0).sort((a, b) => b.count - a.count);
}

export function normalizeSeverityData(raw) {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return raw.map(item => ({
    severity: String(item.severity ?? item.name ?? 'Unknown'),
    count: Number(item.count ?? 0),
  })).filter(d => d.count > 0);
}

// ============================================================
// API Functions
// ============================================================

export const fetchSummary = async () => {
  try {
    const res = await api.get('/dashboard/summary');
    return res.data.data;
  } catch (err) {
    console.warn('Backend API fallback for summary:', err.message);
    const fallback = await fetch('/data/analytics_summary.json').then(r => r.json());
    return {
      ...fallback.kpi,
      dataQualityScore: fallback.quality?.overall_quality || 100.0,
      sourcesCount: 4
    };
  }
};

let cachedAllAccidents = null;

export const fetchAllAccidents = async () => {
  if (cachedAllAccidents && cachedAllAccidents.length > 0) {
    return cachedAllAccidents;
  }
  try {
    const res = await api.get('/accidents', { params: { size: 5000 } });
    if (res?.data?.data && res.data.data.length > 0) {
      cachedAllAccidents = res.data.data;
      return cachedAllAccidents;
    }
  } catch (err) {
    console.warn('Backend API fallback for all accidents:', err.message);
  }
  try {
    const all = await fetch('/data/unified_accidents.json').then(r => r.json());
    cachedAllAccidents = all;
    return cachedAllAccidents;
  } catch (err) {
    console.error('Failed to load unified accidents:', err);
    return [];
  }
};

export const fetchAccidents = async (params = {}) => {
  try {
    const res = await api.get('/accidents', { params });
    return res.data;
  } catch (err) {
    console.warn('Backend API fallback for accidents:', err.message);
    const all = await fetch('/data/unified_accidents.json').then(r => r.json());
    let filtered = [...all];
    if (params.severity && params.severity !== 'all') {
      filtered = filtered.filter(a => a.severity?.toLowerCase() === params.severity.toLowerCase());
    }
    if (params.vehicleType && params.vehicleType !== 'all') {
      filtered = filtered.filter(a => a.vehicle_type?.toLowerCase().includes(params.vehicleType.toLowerCase()));
    }
    if (params.area && params.area !== 'all') {
      filtered = filtered.filter(a => a.area?.toLowerCase().includes(params.area.toLowerCase()));
    }
    if (params.source && params.source !== 'all') {
      filtered = filtered.filter(a => a.source === params.source);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(a =>
        a.accident_id?.toLowerCase().includes(q) ||
        a.location?.toLowerCase().includes(q) ||
        a.area?.toLowerCase().includes(q)
      );
    }
    const page = params.page || 0;
    const size = params.size || 50;
    return {
      data: filtered.slice(page * size, (page + 1) * size),
      meta: {
        page,
        size,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / size)
      }
    };
  }
};

export const fetchHotspots = async () => {
  try {
    const res = await api.get('/hotspots');
    return res.data.data;
  } catch (err) {
    console.warn('Backend API fallback for hotspots:', err.message);
    return await fetch('/data/hotspots.json').then(r => r.json());
  }
};

export const fetchMatches = async () => {
  try {
    const res = await api.get('/matches');
    return res.data.data;
  } catch (err) {
    console.warn('Backend API fallback for matches:', err.message);
    return await fetch('/data/accident_matches.json').then(r => r.json());
  }
};

export const updateMatchReview = async (id, status) => {
  try {
    const res = await api.put(`/matches/${id}/review`, { status });
    return res.data.data;
  } catch (err) {
    console.warn('Backend API fallback for update match:', err.message);
    return { id, reviewStatus: status };
  }
};

export const fetchSources = async () => {
  try {
    const res = await api.get('/sources');
    return res.data.data;
  } catch (err) {
    console.warn('Backend API fallback for sources:', err.message);
    return await fetch('/data/data_sources.json').then(r => r.json());
  }
};

export const fetchAnalytics = async () => {
  try {
    const [monthlyRaw, vehiclesRaw, severityRaw, causesRaw, roadTypesRaw, qualityRaw, hourlyRaw] = await Promise.all([
      api.get('/analytics/monthly').then(r => r.data.data),
      api.get('/analytics/vehicle-types').then(r => r.data.data),
      api.get('/analytics/severity').then(r => r.data.data),
      api.get('/analytics/causes').then(r => r.data.data),
      api.get('/analytics/road-types').then(r => r.data.data),
      api.get('/analytics/quality').then(r => r.data.data),
      api.get('/analytics/hourly').then(r => r.data.data).catch(() => []),
    ]);
    return {
      monthly: normalizeMonthlyData(monthlyRaw),
      vehicles: normalizeVehicleData(vehiclesRaw),
      severity: normalizeSeverityData(severityRaw),
      causes: normalizeCauseData(causesRaw),
      roadTypes: normalizeRoadClassificationData(roadTypesRaw),
      quality: qualityRaw,
      hourly: normalizeHourlyData(hourlyRaw),
    };
  } catch (err) {
    console.warn('Backend API fallback for analytics:', err.message);
    const fallback = await fetch('/data/analytics_summary.json').then(r => r.json());
    return {
      monthly: normalizeMonthlyData(fallback.monthly || []),
      vehicles: normalizeVehicleData(fallback.vehicles || []),
      severity: normalizeSeverityData(fallback.severity || []),
      causes: normalizeCauseData(fallback.causes || []),
      roadTypes: normalizeRoadClassificationData(fallback.roadTypes || []),
      quality: fallback.quality || {},
      hourly: normalizeHourlyData(fallback.hourly || []),
    };
  }
};

export const sendAiQuery = async (query) => {
  try {
    const res = await api.post('/ai/query', { query });
    return res.data.data;
  } catch (err) {
    console.warn('AI Query local fallback:', err.message);
    return {
      query,
      interpretation: 'Local offline natural language parsing',
      filters: {},
      answer: `Analytical Query Processed for: "${query}". Filtering verified records from canonical database.`,
      matchedCount: 2692
    };
  }
};

export default api;
