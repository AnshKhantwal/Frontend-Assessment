import { useState, useEffect, useRef } from 'react'
import { MdHome, MdChevronRight, MdClose } from 'react-icons/md'
import { showToast } from '../Toast/Toast'
import Sidebar from '../Sidebar/Sidebar'
import scanJson from '../../assets/mock-data/live-scan.json'
import './ScanDetail.css'

// pull out what we need from the json
const overview = scanJson.scanOverview
const logEntries = scanJson.activityLog
const allFindings = scanJson.findings
const footer = scanJson.footerStats

const phases = ['Spidering', 'Mapping', 'Testing', 'Validating', 'Reporting']

// severity badge colors
const sevColor = {
  Critical: '#e53935',
  High: '#f57c00',
  Medium: '#f9a825',
  Low: '#43a047'
}

// quick svg icons for each phase (kept inline to avoid extra files)
const phaseIcons = {
  Spidering: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2a10 10 0 0 1 0 20M12 2a10 10 0 0 0 0 20M2 12h20" />
    </svg>
  ),
  Mapping: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Testing: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 2v6l-2 4v8a2 2 0 002 2h6a2 2 0 002-2v-8l-2-4V2" /><line x1="8" y1="2" x2="16" y2="2" />
    </svg>
  ),
  Validating: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="3" /><polyline points="9 11 12 14 16 9" />
    </svg>
  ),
  Reporting: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

// parses the {{teal}}...{{/teal}} markup in log messages
function highlightText(raw) {
  let result = []
  let last = 0
  const pattern = /\{\{(teal|code|warn|crit)\}\}([\s\S]*?)\{\{\/\1\}\}/g
  let match

  while ((match = pattern.exec(raw)) !== null) {
    // push plain text before this match
    if (match.index > last) {
      result.push(raw.slice(last, match.index))
    }
    const tag = match[1]
    const inner = match[2]
    result.push(<span key={match.index} className={'hl-' + tag}>{inner}</span>)
    last = match.index + match[0].length
  }
  // leftover
  if (last < raw.length) result.push(raw.slice(last))
  return result
}

// format the start date nicely
function fmtStartDate(iso) {
  const d = new Date(iso)
  const month = d.toLocaleString('en-US', { month: 'short' })
  const day = d.getDate()
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  return month + ' ' + day + ', ' + time
}

function ScanDetail() {
  const [activeTab, setActiveTab] = useState('activity')
  const [isRunning, setIsRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [pct, setPct] = useState(0)
  const [currentPhase, setCurrentPhase] = useState(-1)
  const [logs, setLogs] = useState([])
  const [foundItems, setFoundItems] = useState([])

  const consoleRef = useRef(null)
  const timerRef = useRef(null)
  const startedAt = useRef(null)

  const DURATION = 30000 // total scan time in ms

  // progress ticker - runs every 120ms while scanning
  useEffect(() => {
    if (!isRunning) return

    startedAt.current = Date.now()

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt.current
      const percent = Math.min(100, Math.round(elapsed / DURATION * 100))
      setPct(percent)

      // each phase takes 1/5 of total time
      const phase = Math.min(4, Math.floor(elapsed / DURATION * 5))
      setCurrentPhase(phase)

      if (percent >= 100) {
        clearInterval(timerRef.current)
        timerRef.current = null
        setIsRunning(false)
        setDone(true)
        setCurrentPhase(4) // keep at last phase, mark all done
        showToast('Scan completed successfully', 'success')
      }
    }, 120)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning])

  // stream log entries at even intervals
  useEffect(() => {
    if (!isRunning) return

    let count = 0
    const gap = DURATION / logEntries.length

    const id = setInterval(() => {
      if (count >= logEntries.length) {
        clearInterval(id)
        return
      }
      setLogs(prev => [...prev, logEntries[count]])
      count++
    }, gap)

    return () => clearInterval(id)
  }, [isRunning])

  // reveal findings progressively during scan
  useEffect(() => {
    if (!isRunning) return

    const timeouts = allFindings.map((finding, idx) => {
      // space them out in the first 80% of scan time
      const wait = ((idx + 1) / allFindings.length) * DURATION * 0.8
      return setTimeout(() => {
        setFoundItems(prev => [...prev, finding])
      }, wait)
    })

    return () => timeouts.forEach(t => clearTimeout(t))
  }, [isRunning])

  // auto-scroll console to bottom when new logs come in
  useEffect(() => {
    const el = consoleRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [logs])

  function handleStart() {
    // reset state for a fresh scan
    setPct(0)
    setCurrentPhase(0)
    setDone(false)
    setLogs([])
    setFoundItems([])
    setIsRunning(true)
    showToast('Scan started', 'success')
  }

  function handleStop() {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsRunning(false)
    showToast('Scan paused', 'warning')
  }

  // figure out phase state for the stepper display
  function getPhaseState(idx) {
    if (currentPhase < 0) return 'waiting'
    if (done && idx <= 4) return 'complete'
    if (idx < currentPhase) return 'complete'
    if (idx === currentPhase) return 'running'
    return 'waiting'
  }

  // ring math
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (pct / 100) * circumference

  // status text for console header
  let statusLabel = 'Idle'
  if (isRunning) statusLabel = 'Running...'
  else if (done) statusLabel = 'Completed'

  return (
    <div className="scan-pg">
      <Sidebar activePage="scans" />

      <main className="scan-content">
        {/* top bar with breadcrumbs + action btns */}
        <div className="scan-topbar">
          <div className="breadcrumbs">
            <h2 className="pg-title">Scan</h2>
            <MdHome size={14} />
            <span className="bc-sep">/</span>
            <span>Private Assets</span>
            <span className="bc-sep">/</span>
            <span className="bc-current">Scans</span>
          </div>
          <div className="topbar-actions">
            <button className="btn-export" onClick={() => showToast('Report exported!', 'success')}>
              Export Report
            </button>
            {isRunning ? (
              <button className="btn-stop" onClick={handleStop}>Stop Scan</button>
            ) : (
              <button className="btn-go" onClick={handleStart}>
                {done ? 'Restart Scan' : 'Start Scan'}
              </button>
            )}
          </div>
        </div>

        {/* overview: progress ring + phase stepper + metadata */}
        <div className="overview-box">
          <div className="overview-upper">
            <div className="progress-ring">
              <svg viewBox="0 0 120 120" className="ring-svg">
                <circle cx="60" cy="60" r={radius} className="ring-track" />
                <circle cx="60" cy="60" r={radius} className="ring-bar"
                  style={{ strokeDasharray: circumference, strokeDashoffset: dashOffset }}
                />
              </svg>
              <div className="ring-inner">
                <span className="ring-percent">{pct}%</span>
                <span className="ring-sub">{done ? 'Complete' : 'In Progress'}</span>
              </div>
            </div>

            <div className="stepper">
              {phases.map((name, i) => {
                const state = getPhaseState(i)
                return (
                  <div className="step" key={name}>
                    <div className={'step-icon ' + state}>
                      {phaseIcons[name]}
                    </div>
                    <span className={'step-name ' + state}>{name}</span>
                    {i < phases.length - 1 && (
                      <div className={'step-line ' + (state === 'complete' ? 'filled' : '')} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="meta-strip">
            <div className="meta-item">
              <span className="meta-label">Scan Type</span>
              <span className="meta-value">{overview.scanType}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Targets</span>
              <span className="meta-value">{overview.target}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Started At</span>
              <span className="meta-value">{fmtStartDate(overview.startedAt)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Credentials</span>
              <span className="meta-value">{overview.credentials} Active</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Files</span>
              <span className="meta-value">{overview.files}</span>
            </div>
            <div className="meta-item no-border">
              <span className="meta-label">Checklists</span>
              <span className="meta-value accent">{overview.checklistsCompleted}/{overview.checklistsTotal}</span>
            </div>
          </div>
        </div>

        {/* console panel + findings panel */}
        <div className="two-col">
          <div className="console-card">
            <div className="console-header">
              <div className="console-left">
                <span className="status-dot" />
                <span className="console-heading">Live Scan Console</span>
                <span className="console-badge">{statusLabel}</span>
              </div>
              <div className="console-actions">
                <MdChevronRight size={16} />
                <MdClose size={16} />
              </div>
            </div>

            <div className="console-tabs">
              <button
                className={activeTab === 'activity' ? 'ctab active' : 'ctab'}
                onClick={() => setActiveTab('activity')}
              >Activity Log</button>
              <button
                className={activeTab === 'verify' ? 'ctab active' : 'ctab'}
                onClick={() => setActiveTab('verify')}
              >Verification Loops</button>
            </div>

            <div className="console-output" ref={consoleRef}>
              {activeTab === 'activity' ? (
                logs.length === 0 ? (
                  <p className="log-line">
                    <span className="log-time">[--:--:--]</span>
                    <span className="log-text">Waiting for scan to start...</span>
                  </p>
                ) : logs.map((entry, i) => (
                  <p className="log-line" key={i}>
                    <span className="log-time">[{entry.timestamp}]</span>
                    <span className="log-text">{highlightText(entry.message)}</span>
                  </p>
                ))
              ) : (
                <p className="log-line">
                  <span className="log-time">[09:00:00]</span>
                  <span className="log-text">No verification loops recorded yet.</span>
                </p>
              )}
            </div>
          </div>

          <div className="findings-card">
            <h3 className="findings-heading">Finding Log</h3>
            <div className="findings-body">
              {foundItems.length === 0 && (
                <p className="no-findings">Findings appear here once scan is running.</p>
              )}
              {foundItems.map(f => (
                <div className="finding" key={f.id}>
                  <div className="finding-top">
                    <span className="sev-badge" style={{ background: sevColor[f.severity] }}>
                      {f.severity}
                    </span>
                    <span className="finding-timestamp">{f.detectedAt}</span>
                  </div>
                  <h4 className="finding-title">{f.title}</h4>
                  <span className="finding-endpoint">{f.endpoint}</span>
                  <p className="finding-detail">{f.description} {f.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* bottom stats bar */}
        <div className="bottom-bar">
          <span className="bar-stat">
            <span className="bar-dot" />Sub-Agents: <b>{footer.subAgents}</b>
          </span>
          <span className="bar-stat">
            <span className="bar-dot" />Parallel Executions: <b>{footer.parallelExecutions}</b>
          </span>
          <span className="bar-stat">
            <span className="bar-dot" />Operations: <b>{footer.operations}</b>
          </span>
          <span className="flex-spacer" />
          <span className="bar-sev" style={{ color: sevColor.Critical }}>Critical: {footer.critical}</span>
          <span className="bar-sev" style={{ color: sevColor.High }}>High: {footer.high}</span>
          <span className="bar-sev" style={{ color: sevColor.Medium }}>Medium: {footer.medium}</span>
          <span className="bar-sev" style={{ color: sevColor.Low }}>Low: {footer.low}</span>
        </div>
      </main>
    </div>
  )
}

export default ScanDetail
