import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import SignupPage from './components/SignupPage/SignupPage';
import Dashboard from './components/Dashboard/Dashboard';
import ScanDetail from './components/ScanDetail/ScanDetail';
import { ToastContainer } from './components/Toast/Toast';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scan/:scanId" element={<ScanDetail />} />
          <Route path="/scans" element={<Navigate to="/scan/SCAN-021" replace />} />
          <Route path="*" element={<Navigate to="/signup" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
