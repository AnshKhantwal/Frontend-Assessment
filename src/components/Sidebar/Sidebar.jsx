import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  MdDashboard, MdFolderOpen, MdRadar, MdSchedule,
  MdNotificationsNone, MdSettings, MdHelpOutline, MdChevronRight,
  MdMenu, MdClose
} from 'react-icons/md';
import { IoSunnyOutline, IoMoonOutline } from 'react-icons/io5';
import { useTheme } from '../../context/ThemeContext';
import { showToast } from '../Toast/Toast';
import avatarImg from '../../assets/avatar.jpg';
import logoImg from '../../assets/logo.png';
import './Sidebar.css';

const mainNav = [
  { to: '/dashboard', icon: MdDashboard, label: 'Dashboard' },
  { to: '/projects',  icon: MdFolderOpen, label: 'Projects' },
  { to: '/scans',     icon: MdRadar,      label: 'Scans' },
  { to: '/schedule',  icon: MdSchedule,   label: 'Schedule' },
];

const secondaryNav = [
  { to: '/notifications', icon: MdNotificationsNone, label: 'Notifications' },
  { to: '/settings',      icon: MdSettings,          label: 'Settings' },
  { to: '/support',       icon: MdHelpOutline,       label: 'Support' },
];

function Sidebar({ activePage }) {
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '' });
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggle } = useTheme();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) setUser(JSON.parse(raw));
    } catch { /* skip */ }
  }, []);

  // close sidebar on route change (mobile)
  useEffect(() => {
    setMobileOpen(false);
  }, [activePage]);

  // lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  function handleClick(e, item) {
    if (item.to !== '/dashboard' && item.to !== '/scans') {
      e.preventDefault();
      showToast(`${item.label} — coming soon`, 'warning');
    } else {
      setMobileOpen(false);
    }
  }

  function isActive(item, routeActive) {
    if (activePage && item.label.toLowerCase() === activePage) return true;
    return routeActive;
  }

  const email = user.email || 'admin@edu.com';

  return (
    <>
      {/* mobile hamburger */}
      <button className={`mobile-burger${mobileOpen ? ' hidden' : ''}`} onClick={() => setMobileOpen(true)} aria-label="Open menu">
        <MdMenu size={24} />
      </button>

      {/* overlay backdrop */}
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <img src={logoImg} alt="Logo" className="sidebar-logo-img" />
            <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <MdClose size={20} />
            </button>
          </div>

        <nav className="nav-group">
          {mainNav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={e => handleClick(e, item)}
              className={({ isActive: routeActive }) =>
                `nav-link ${isActive(item, routeActive) ? 'active' : ''}`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <nav className="nav-group nav-lower">
          {secondaryNav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={e => handleClick(e, item)}
              className={({ isActive: routeActive }) =>
                `nav-link ${isActive(item, routeActive) ? 'active' : ''}`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <button className="theme-toggle" onClick={toggle} aria-label={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
          <span className="toggle-track">
            <span className="toggle-thumb">
              {mode === 'light' ? <IoMoonOutline size={13} /> : <IoSunnyOutline size={13} />}
            </span>
          </span>
          <span className="toggle-label">{mode === 'light' ? 'Dark mode' : 'Light mode'}</span>
        </button>

        <div className="sidebar-profile">
          <img src={avatarImg} alt="User" className="profile-avatar" />
          <div className="profile-info">
            <span className="profile-email">{email}</span>
            <span className="profile-role">Security Lead</span>
          </div>
          <MdChevronRight size={18} className="profile-arrow" />
        </div>
      </div>
      </aside>
    </>
  );
}

export default Sidebar;
