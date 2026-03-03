import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  MdDashboard, MdFolderOpen, MdRadar, MdSchedule,
  MdNotificationsNone, MdSettings, MdHelpOutline, MdChevronRight
} from 'react-icons/md';
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

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) setUser(JSON.parse(raw));
    } catch { /* skip */ }
  }, []);

  function handleClick(e, item) {
    if (item.to !== '/dashboard' && item.to !== '/scans') {
      e.preventDefault();
      showToast(`${item.label} — coming soon`, 'warning');
    }
  }

  function isActive(item, routeActive) {
    if (activePage && item.label.toLowerCase() === activePage) return true;
    return routeActive;
  }

  const email = user.email || 'admin@edu.com';

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <img src={logoImg} alt="Logo" className="sidebar-logo-img" />
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

      <div className="sidebar-profile">
        <img src={avatarImg} alt="User" className="profile-avatar" />
        <div className="profile-info">
          <span className="profile-email">{email}</span>
          <span className="profile-role">Security Lead</span>
        </div>
        <MdChevronRight size={18} className="profile-arrow" />
      </div>
    </aside>
  );
}

export default Sidebar;
