import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdFilterList, MdViewColumn, MdAdd, MdHome, MdAccessTime } from 'react-icons/md';
import { showToast } from '../Toast/Toast';
import Sidebar from '../Sidebar/Sidebar';
import { orgStats, severityStats, scans } from '../../data/mockData';
import './Dashboard.css';

const statusMap = {
  Completed: { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' },
  Running:   { bg: '#e3f2fd', color: '#1565c0', border: '#90caf9' },
  Scheduled: { bg: '#f5f5f5', color: '#666',    border: '#ddd' },
  Failed:    { bg: '#fbe9e7', color: '#c62828', border: '#ef9a9a' },
};

const vulnColors = { critical: '#e53935', high: '#f57c00', medium: '#f9a825', low: '#43a047' };
const sevIcons = { critical: '⊘', high: '⚠', medium: '⚠', low: '🔍' };

function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = scans.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dash-layout">
      <Sidebar />

      <main className="dash-main">
        <header className="dash-header">
          <div className="breadcrumb">
            <span className="breadcrumb-title">Scan</span>
            <MdHome size={14} className="breadcrumb-icon" />
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-page">Dashboard</span>
          </div>
        </header>

        <div className="org-bar">
          <div className="org-stat">
            <span className="org-label">Org:</span>
            <span className="org-val">{orgStats.org}</span>
          </div>
          <div className="org-stat">
            <span className="org-label">Owner:</span>
            <span className="org-val">{orgStats.owner}</span>
          </div>
          <div className="org-stat">
            <span className="org-label">Total Scans:</span>
            <span className="org-val">{orgStats.totalScans}</span>
          </div>
          <div className="org-stat">
            <span className="org-label">Scheduled:</span>
            <span className="org-val">{orgStats.scheduled}</span>
          </div>
          <div className="org-stat">
            <span className="org-label">Rescans:</span>
            <span className="org-val">{orgStats.rescans}</span>
          </div>
          <div className="org-stat last-stat">
            <span className="org-label">Failed Scans:</span>
            <span className="org-val">{orgStats.failedScans}</span>
          </div>
          <div className="org-updated">
            <MdAccessTime size={14} />
            {orgStats.lastUpdated}
          </div>
        </div>

        {/* severity overview */}
        <div className="severity-row">
          {severityStats.map((s, i) => (
            <div key={i} className="sev-card">
              <div className="sev-top">
                <span className="sev-label">{s.label}</span>
                <span className={`sev-icon sev-${s.icon}`}>{sevIcons[s.icon]}</span>
              </div>
              <div className="sev-count">{s.count}</div>
              <div className={`sev-change ${s.direction}`}>
                {s.direction === 'up' ? '↑' : '↓'} {s.change} {s.note}
              </div>
            </div>
          ))}
        </div>

        <div className="toolbar">
          <div className="search-box">
            <MdSearch size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search scans by name or type..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="toolbar-btns">
            <button className="btn-tool" onClick={() => showToast('Filters applied', 'success')}>
              <MdFilterList size={16} /> Filter
            </button>
            <button className="btn-tool" onClick={() => showToast('Columns updated', 'success')}>
              <MdViewColumn size={16} /> Column
            </button>
            <button className="btn-new" onClick={() => showToast('New scan created!', 'success')}>
              <MdAdd size={18} /> New scan
            </button>
          </div>
        </div>

        <div className="table-wrap">
          <table className="scan-table">
            <thead>
              <tr>
                <th>Scan Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Vulnerability</th>
                <th>Last Scan</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(scan => {
                const st = statusMap[scan.status] || statusMap.Scheduled;
                return (
                  <tr key={scan.id} className="scan-row" onClick={() => navigate(`/scan/${scan.id}`)}>
                    <td className="col-name">{scan.name}</td>
                    <td>{scan.type}</td>
                    <td>
                      <span
                        className="status-chip"
                        style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}
                      >
                        {scan.status}
                      </span>
                    </td>
                    <td>
                      <div className="progress-cell">
                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${scan.progress}%`,
                              background: scan.status === 'Failed' ? '#e53935' : '#0CC8A8'
                            }}
                          />
                        </div>
                        <span className="progress-pct">{scan.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="vuln-row">
                        {['critical', 'high', 'medium', 'low'].map(lvl =>
                          scan.vulns[lvl] != null ? (
                            <span key={lvl} className="vuln-pill" style={{ background: vulnColors[lvl] }}>
                              {scan.vulns[lvl]}
                            </span>
                          ) : null
                        )}
                      </div>
                    </td>
                    <td className="col-date">{scan.lastScan}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
