import { useState, useRef, useCallback, useEffect } from 'react'
import DatePicker from './DatePicker'
import MapPicker from './MapPicker'
import Quiz from './Quiz'
import Final from './Final'
import './App.css'

const SYMBOLS = ['❤️', '💖', '💗', '💓', '🌸', '✨', '⭐', '💕', '🦆']

function useFloatingParticles() {
  const [particles, setParticles] = useState([])
  const counterRef = useRef(0)

  useEffect(() => {
    const spawn = () => {
      const isDuck = Math.random() < 0.07
      const symbol = isDuck
        ? '🦆'
        : SYMBOLS[Math.floor(Math.random() * (SYMBOLS.length - 1))]
      const id = counterRef.current++
      const left = Math.random() * 96 + 2
      const duration = Math.random() * 4 + 5
      const size = Math.random() * 20 + 18
      const wobble = (Math.random() - 0.5) * 80

      setParticles(prev => [...prev, { id, symbol, left, duration, size, wobble }])
      setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), duration * 1000 + 200)
    }
    const interval = setInterval(spawn, 400)
    return () => clearInterval(interval)
  }, [])

  return particles
}

function getNameFromUrl() {
  const raw = window.location.pathname.replace(/^\//, '').trim()
  return raw || null
}

// views: 'question' | 'accepted' | 'datepicker' | 'map' | 'quiz' | 'final'
export default function App() {
  const name = getNameFromUrl()
  const [view, setView] = useState('question')
  const [noPos, setNoPos] = useState({ x: 0, y: 0 })

  // form data
  const [selectedDate,     setSelectedDate]     = useState(null)
  const [selectedHour,     setSelectedHour]     = useState(null)
  const [selectedMinute,   setSelectedMinute]   = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [quizAnswers,      setQuizAnswers]      = useState({})

  const noButtonRef = useRef(null)
  const particles = useFloatingParticles()

  // auto-advance from accepted message
  useEffect(() => {
    if (view !== 'accepted') return
    const t = setTimeout(() => setView('datepicker'), 2500)
    return () => clearTimeout(t)
  }, [view])

  // ── escape button ────────────────────────────────────────────────────────
  const escapeButton = useCallback(() => {
    const btn = noButtonRef.current
    if (!btn) return

    const rect = btn.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const pad = 20

    const cx = rect.left + rect.width  / 2
    const cy = rect.top  + rect.height / 2
    const dx = cx - vw / 2
    const dy = cy - vh / 2

    const rawX = (Math.random() * 100 + 80) * (dx >= 0 ? 1 : -1)
    const rawY = (Math.random() * 100 + 80) * (dy >= 0 ? 1 : -1)

    const maxRight = vw - pad - rect.right
    const maxLeft  = rect.left - pad
    const maxDown  = vh - pad - rect.bottom
    const maxUp    = rect.top  - pad

    const stepX = rawX > 0 ? Math.min(rawX, maxRight) : Math.max(rawX, -maxLeft)
    const stepY = rawY > 0 ? Math.min(rawY, maxDown)  : Math.max(rawY, -maxUp)

    setNoPos(prev => ({ x: prev.x + stepX, y: prev.y + stepY }))
  }, [])

  // ── handlers ────────────────────────────────────────────────────────────
  const handleDateSelect = ({ date, hour, minute }) => {
    setSelectedDate(date)
    setSelectedHour(hour)
    setSelectedMinute(minute)
    setView('map')
  }

  const handleMapSelect = position => {
    setSelectedLocation(position)
    setView('quiz')
  }

  const handleQuizComplete = answers => {
    setQuizAnswers(answers)
    setView('final')
  }

  return (
    <div className="app">
      {particles.map(p => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            '--wobble': `${p.wobble}px`,
          }}
        >
          {p.symbol}
        </span>
      ))}

      {view === 'question' && (
        <div className="view-question">
          <h1 className="question">Czy pójdziesz ze mną na randkę?</h1>
          <div className="buttons">
            <button className="btn btn-yes" onClick={() => setView('accepted')}>
              Tak 💖
            </button>
            <button
              ref={noButtonRef}
              className="btn btn-no"
              onClick={escapeButton}
              style={{
                transform: `translate(${noPos.x}px, ${noPos.y}px)`,
                transition: 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            >
              Nie
            </button>
          </div>
        </div>
      )}

      {view === 'accepted' && (
        <p className="accepted-msg">Omg nie wierzę, że się zgodziłaś! 🥹❤️</p>
      )}

      {view === 'datepicker' && (
        <DatePicker onSelect={handleDateSelect} />
      )}

      {view === 'map' && (
        <MapPicker onSelect={handleMapSelect} />
      )}

      {view === 'quiz' && (
        <Quiz onComplete={handleQuizComplete} />
      )}

      {view === 'final' && (
        <Final
          date={selectedDate}
          hour={selectedHour}
          minute={selectedMinute}
          location={selectedLocation}
          answers={quizAnswers}
          name={name}
        />
      )}
    </div>
  )
}
