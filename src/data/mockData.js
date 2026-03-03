import scanData from '../assets/mock-data/scans.json';

const { dashboardSummary, scans: rawScans } = scanData;

// org-level stats for the top bar
export const orgStats = {
  org: dashboardSummary.organization,
  owner: dashboardSummary.owner,
  totalScans: dashboardSummary.totalScans,
  scheduled: dashboardSummary.scheduledScans,
  rescans: dashboardSummary.rescans,
  failedScans: dashboardSummary.failedScans,
  lastUpdated: '10 mins ago',
};

// pull direction + delta from trend strings like "+2.5% increase"
function parseTrend(trend) {
  const m = trend.match(/([+-]?\d+\.?\d*)%\s*(increase|decrease)/i);
  if (!m) return { change: trend, direction: 'up', note: '' };
  const dir = m[2].toLowerCase();
  return {
    change: (dir === 'decrease' ? '-' : '+') + m[1] + '%',
    direction: dir === 'increase' ? 'up' : 'down',
    note: dir + ' than yesterday',
  };
}

const sev = dashboardSummary.severityOverview;

export const severityStats = [
  { label: 'Critical Severity', count: sev.critical.count, ...parseTrend(sev.critical.trend), color: '#e53935', icon: 'critical' },
  { label: 'High Severity',     count: sev.high.count,     ...parseTrend(sev.high.trend),     color: '#f59e0b', icon: 'high' },
  { label: 'Medium Severity',   count: sev.medium.count,   ...parseTrend(sev.medium.trend),   color: '#f59e0b', icon: 'medium' },
  { label: 'Low Severity',      count: sev.low.count,      ...parseTrend(sev.low.trend),      color: '#0CC8A8', icon: 'low' },
];

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export const scans = rawScans.map(s => ({
  id: s.id,
  name: s.name,
  type: s.type,
  status: s.status,
  progress: s.progress,
  vulns: s.vulnerabilities,
  lastScan: fmtDate(s.lastScan),
}));
