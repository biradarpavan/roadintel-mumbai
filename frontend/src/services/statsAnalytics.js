// Statistics Analytics Service
// Computes dynamic statistics, aggregations, and metrics for filtered datasets

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Classifies an accident record into a geographic Mumbai corridor.
 */
export function getCorridorKey(item) {
  if (!item) return 'other';
  const area = String(item.area || '').toLowerCase();
  const loc = String(item.location || '').toLowerCase();

  // Thane & Extended MMR
  if (area.includes('thane') || loc.includes('thane') || loc.includes('ghodbunder')) {
    return 'thane';
  }

  // Harbour / Navi Mumbai Corridor
  if (
    area.includes('navi mumbai') ||
    loc.includes('mankhurd') ||
    loc.includes('vashi') ||
    loc.includes('panvel') ||
    loc.includes('sion panvel')
  ) {
    return 'harbour';
  }

  // South / Island City (Dadar, Lower Parel, Marine Drive, Colaba, Worli, etc.)
  if (
    area.includes('south mumbai') ||
    area.includes('dadar') ||
    area.includes('lower parel') ||
    loc.includes('marine drive') ||
    loc.includes('dadar') ||
    loc.includes('lower parel') ||
    loc.includes('senapati') ||
    loc.includes('ambedkar') ||
    loc.includes('colaba') ||
    loc.includes('worli') ||
    loc.includes('byculla') ||
    loc.includes('fort') ||
    loc.includes('churchgate') ||
    loc.includes('prabhadevi')
  ) {
    return 'island';
  }

  // Western Suburbs / WEH Corridor
  if (
    area.includes('western') ||
    area.includes('bandra') ||
    area.includes('andheri') ||
    area.includes('malad') ||
    area.includes('powai') ||
    loc.includes('western') ||
    loc.includes('weh') ||
    loc.includes('sv road') ||
    loc.includes('kandivali') ||
    loc.includes('goregaon') ||
    loc.includes('santacruz') ||
    loc.includes('vile parle') ||
    loc.includes('borivali') ||
    loc.includes('linking road') ||
    loc.includes('jvlr')
  ) {
    return 'western';
  }

  // Eastern Suburbs / EEH Corridor
  if (
    area.includes('eastern') ||
    area.includes('kurla') ||
    area.includes('sion') ||
    area.includes('chembur') ||
    area.includes('ghatkopar') ||
    loc.includes('eastern') ||
    loc.includes('eeh') ||
    loc.includes('sclr') ||
    loc.includes('lbs marg') ||
    loc.includes('vikhroli') ||
    loc.includes('bhandup') ||
    loc.includes('mulund')
  ) {
    return 'eastern';
  }

  return 'other';
}

/**
 * Checks whether an accident matches the selected year and corridor.
 */
export function matchesFilter(item, year, corridor) {
  if (year && year !== 'all') {
    const yr = item.year !== undefined && item.year !== null
      ? String(item.year)
      : (item.date ? String(item.date).substring(0, 4) : '');
    if (yr !== String(year)) return false;
  }

  if (corridor && corridor !== 'all') {
    const c = getCorridorKey(item);
    // Eastern Suburbs includes EEH and Harbour/Sion-Panvel unless explicitly separated
    if (corridor === 'eastern' && (c === 'eastern' || c === 'harbour')) return true;
    if (c !== corridor) return false;
  }

  return true;
}

/**
 * Computes aggregated statistics from raw accident records based on year and corridor.
 */
export function computeFilteredStats(allAccidents = [], year = 'all', corridor = 'all', defaultAnalytics = null) {
  if (!allAccidents || allAccidents.length === 0) {
    if (defaultAnalytics) {
      return {
        totalAccidents: defaultAnalytics.kpi?.totalAccidents || 2692,
        fatalities: defaultAnalytics.kpi?.fatalities || 591,
        injured: defaultAnalytics.kpi?.injured || 4616,
        casualties: (defaultAnalytics.kpi?.fatalities || 591) + (defaultAnalytics.kpi?.injured || 4616),
        monthly: defaultAnalytics.monthly || [],
        hourly: defaultAnalytics.hourly || [],
        vehicles: defaultAnalytics.vehicles || [],
        roadTypes: defaultAnalytics.roadTypes || [],
        causes: defaultAnalytics.causes || [],
        isFiltered: false
      };
    }
    return {
      totalAccidents: 0,
      fatalities: 0,
      injured: 0,
      casualties: 0,
      monthly: [],
      hourly: [],
      vehicles: [],
      roadTypes: [],
      causes: [],
      isFiltered: false
    };
  }

  const isFiltered = year !== 'all' || corridor !== 'all';
  const filteredRecords = isFiltered
    ? allAccidents.filter(item => matchesFilter(item, year, corridor))
    : allAccidents;

  // Monthly buckets: 12 fixed calendar months
  const monthlyMap = {};
  for (let m = 1; m <= 12; m++) {
    monthlyMap[m] = {
      month: MONTH_NAMES[m - 1],
      month_num: m,
      accidents: 0,
      fatalities: 0,
      injured: 0
    };
  }

  // Hourly buckets: 24 fixed hours 00:00 - 23:00
  const hourlyMap = {};
  for (let h = 0; h < 24; h++) {
    hourlyMap[h] = {
      hour: `${String(h).padStart(2, '0')}:00`,
      hour_num: h,
      accidents: 0
    };
  }

  const vehicleMap = {};
  const roadMap = {};
  const causeMap = {};

  let totalFatalities = 0;
  let totalInjured = 0;

  for (let i = 0; i < filteredRecords.length; i++) {
    const r = filteredRecords[i];
    const fat = Number(r.fatalities) || 0;
    const inj = Number(r.injured) || 0;
    totalFatalities += fat;
    totalInjured += inj;

    // Month
    let m = Number(r.month);
    if (!m || m < 1 || m > 12) {
      if (r.date) {
        m = parseInt(String(r.date).split('-')[1], 10) || 1;
      } else {
        m = 1;
      }
    }
    if (monthlyMap[m]) {
      monthlyMap[m].accidents++;
      monthlyMap[m].fatalities += fat;
      monthlyMap[m].injured += inj;
    }

    // Hour
    let h = 0;
    if (r.time) {
      const parts = String(r.time).split(':');
      h = parseInt(parts[0], 10);
      if (isNaN(h) || h < 0 || h > 23) h = 0;
    }
    if (hourlyMap[h]) {
      hourlyMap[h].accidents++;
    }

    // Vehicle Type
    const vt = String(r.vehicle_type || 'Unknown').trim();
    vehicleMap[vt] = (vehicleMap[vt] || 0) + 1;

    // Road Classification
    const rt = String(r.road_type || 'Unknown').trim();
    roadMap[rt] = (roadMap[rt] || 0) + 1;

    // Cause
    const c = String(r.cause || 'Unknown').trim();
    causeMap[c] = (causeMap[c] || 0) + 1;
  }

  const monthly = Object.values(monthlyMap);
  const hourly = Object.values(hourlyMap);
  const vehicles = Object.entries(vehicleMap)
    .map(([vehicle_type, count]) => ({ vehicle_type, count }))
    .sort((a, b) => b.count - a.count);
  const roadTypes = Object.entries(roadMap)
    .map(([road_type, count]) => ({ road_type, count }))
    .sort((a, b) => b.count - a.count);
  const causes = Object.entries(causeMap)
    .map(([cause, count]) => ({ cause, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalAccidents: filteredRecords.length,
    fatalities: totalFatalities,
    injured: totalInjured,
    casualties: totalFatalities + totalInjured,
    monthly,
    hourly,
    vehicles,
    roadTypes,
    causes,
    isFiltered
  };
}
