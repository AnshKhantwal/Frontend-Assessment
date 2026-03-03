import { useState } from 'react';
import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FaMeta } from 'react-icons/fa6';
import { FiEyeOff, FiEye } from 'react-icons/fi';
import { showToast } from '../Toast/Toast';
import './SignupPage.css';

const SignupPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName.trim()) return showToast('First name is required');
    if (!lastName.trim()) return showToast('Last name is required');
    if (!email.trim()) return showToast('Email address is required');
    if (!validateEmail(email)) return showToast('Please enter a valid email address');
    if (!password) return showToast('Password is required');
    if (password.length < 8) return showToast('Password must be at least 8 characters');
    if (!agreedToTerms) return showToast('You must agree to the Terms & Conditions');
    showToast('Account created successfully!', 'success');
  };

  return (
    <div className="signup-page">
      {/* Left Side */}
      <div className="signup-left">
        <div className="signup-left-content">
          {/* Logo */}
          <div className="signup-logo">
            <div className="signup-logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="14" fill="#0CC8A8" />
                <circle cx="14" cy="14" r="5" fill="#0A3D35" />
              </svg>
            </div>
            <span className="signup-logo-text">aps</span>
          </div>

          {/* Tagline */}
          <div className="signup-tagline">
            <h1>
              Expert level Cybersecurity
              <br />
              in <span className="highlight">hours</span> not weeks.
            </h1>
          </div>

          {/* Features */}
          <div className="signup-features">
            <h3 className="features-title">What's included</h3>
            <ul className="features-list">
              <li>
                <svg className="check-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9.5L7 13.5L15 5.5" stroke="#0CC8A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Effortlessly spider and map targets to uncover hidden security flaws</span>
              </li>
              <li>
                <svg className="check-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9.5L7 13.5L15 5.5" stroke="#0CC8A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Deliver high-quality, validated findings in hours, not weeks.</span>
              </li>
              <li>
                <svg className="check-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9.5L7 13.5L15 5.5" stroke="#0CC8A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Generate professional, enterprise-grade security reports automatically.</span>
              </li>
            </ul>
          </div>

          {/* Trustpilot */}
          <div className="signup-trustpilot">
            <div className="trustpilot-badge">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 0L10.12 5.26L16 6.08L11.84 9.94L12.94 16L8 13.27L3.06 16L4.16 9.94L0 6.08L5.88 5.26L8 0Z" fill="#0CC8A8"/>
              </svg>
              <span className="trustpilot-text">Trustpilot</span>
            </div>
            <div className="trustpilot-rating">
              <span className="rating-value">Rated 4.5/5.0</span>
              <span className="rating-count">(100k+ reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="signup-right">
        <div className="signup-card">
          <h2 className="signup-card-title">Sign up</h2>
          <p className="signup-card-subtitle">
            Already have an account?{' '}
            <a href="#" className="login-link">Log in</a>
          </p>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="First name*"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Last name*"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                placeholder="Email address*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group password-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password (8+ characters)*"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
              </button>
            </div>

            <div className="form-group terms-group">
              <label className="terms-label">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="terms-checkbox"
                />
                <span className="custom-checkbox">
                  {agreedToTerms && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span className="terms-text">
                  I agree to Aps's{' '}
                  <a href="#" className="terms-link">Terms & Conditions</a>
                  {' '}and acknowledge the{' '}
                  <a href="#" className="terms-link">Privacy Policy</a>
                </span>
              </label>
            </div>

            <button type="submit" className="create-account-btn">
              Create account
            </button>
          </form>

          {/* Social Login */}
          <div className="social-login">
            <button className="social-btn apple-btn">
              <FaApple size={22} color="#fff" />
            </button>
            <button className="social-btn google-btn">
              <FcGoogle size={22} />
            </button>
            <button className="social-btn meta-btn">
              <FaMeta size={22} color="#fff" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
