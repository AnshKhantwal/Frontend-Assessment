import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaApple } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { FaMeta } from 'react-icons/fa6'
import { FiEyeOff, FiEye } from 'react-icons/fi'
import { showToast } from '../Toast/Toast'
import logoImg from '../../assets/logo.png'
import './SignupPage.css'

function SignupPage() {
  const nav = useNavigate()
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [agreed, setAgreed] = useState(false)

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
  }

  function onSubmit(e) {
    e.preventDefault()

    // collect every empty / invalid field at once
    let missing = []
    if (!first.trim()) missing.push('First name')
    if (!last.trim()) missing.push('Last name')
    if (!email.trim()) missing.push('Email')
    else if (!isValidEmail(email)) missing.push('Valid email')
    if (!pass) missing.push('Password')
    else if (pass.length < 8) missing.push('Password (8+ chars)')
    if (!agreed) missing.push('Terms agreement')

    if (missing.length) {
      return showToast(missing.join(', ') + ' required')
    }

    localStorage.setItem('user', JSON.stringify({ firstName: first, lastName: last, email }))
    showToast('Account created!', 'success')
    setTimeout(() => nav('/dashboard'), 800)
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-inner">
          <div className="auth-logo">
            <img src={logoImg} alt="Logo" width="105" height="56" />
          </div>

          <h1 className="auth-heading">
            Expert level Cybersecurity<br />
            in <em className="teal">hours</em> not weeks.
          </h1>

          <div className="auth-features">
            <h3>What's included</h3>
            <ul>
              <li>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9.5L7 13.5L15 5.5" stroke="#0CC8A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Effortlessly spider and map targets to uncover hidden security flaws
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9.5L7 13.5L15 5.5" stroke="#0CC8A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Deliver high-quality, validated findings in hours, not weeks.
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9.5L7 13.5L15 5.5" stroke="#0CC8A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Generate professional, enterprise-grade security reports automatically.
              </li>
            </ul>
          </div>

          <div className="auth-trust">
            <div className="trust-top">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 0L10.12 5.26L16 6.08L11.84 9.94L12.94 16L8 13.27L3.06 16L4.16 9.94L0 6.08L5.88 5.26L8 0Z" fill="#0CC8A8"/>
              </svg>
              <span>Trustpilot</span>
            </div>
            <p className="trust-rating">
              <strong>Rated 4.5/5.0</strong> <span>(100k+ reviews)</span>
            </p>
          </div>
        </div>
      </div>

      {/* right side - form card */}
      <div className="auth-right">
        <div className="auth-card">
          <h2>Sign up</h2>
          <p className="auth-subtitle">
            Already have an account? <a href="#" className="link-teal">Log in</a>
          </p>

          <form onSubmit={onSubmit} noValidate>
            <input
              type="text"
              placeholder="First name*"
              value={first}
              onChange={e => setFirst(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last name*"
              value={last}
              onChange={e => setLast(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email address*"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <div className="pass-wrap">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password (8+ characters)*"
                value={pass}
                onChange={e => setPass(e.target.value)}
              />
              <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEye size={18} /> : <FiEyeOff size={18} />}
              </button>
            </div>

            <label className="terms-row">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="sr-only"
              />
              <span className={'cbox' + (agreed ? ' checked' : '')}>
                {agreed && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span className="terms-txt">
                I agree to Aps's <a href="#">Terms & Conditions</a> and acknowledge the <a href="#">Privacy Policy</a>
              </span>
            </label>

            <button type="submit" className="btn-submit">Create account</button>
          </form>

          <div className="socials">
            <button className="soc-btn apple"><FaApple size={22} color="#fff" /></button>
            <button className="soc-btn google"><FcGoogle size={22} /></button>
            <button className="soc-btn meta"><FaMeta size={22} color="#fff" /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
