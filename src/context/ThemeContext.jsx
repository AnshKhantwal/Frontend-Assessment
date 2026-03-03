import { createContext, useContext, useState, useEffect } from 'react'

const ThemeCtx = createContext()

export function useTheme() {
  return useContext(ThemeCtx)
}

export function ThemeProvider({ children }) {
  // read saved preference or default to light
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
    localStorage.setItem('theme', mode)
  }, [mode])

  function toggle() {
    // enable smooth transitions for the switch
    const root = document.documentElement
    root.classList.add('theme-switching')
    setMode(prev => prev === 'light' ? 'dark' : 'light')
    // remove the class after transition completes
    setTimeout(() => root.classList.remove('theme-switching'), 400)
  }

  return (
    <ThemeCtx.Provider value={{ mode, toggle }}>
      {children}
    </ThemeCtx.Provider>
  )
}
