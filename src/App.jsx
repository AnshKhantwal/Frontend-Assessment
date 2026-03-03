import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './components/SignupPage/SignupPage';
import { ToastContainer } from './components/Toast/Toast';
import './App.css';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
