import { useState } from 'react'

const DAYS   = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd']
const MONTHS = [
  'Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec',
  'Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień',
]
const HOURS   = Array.from({ length: 13 }, (_, i) => i + 10) // 10–22
const MINUTES = [0, 15, 30, 45]

function pad(n) { return String(n).padStart(2, '0') }

// SVG clock constants (viewBox coords)
const CS = 280, CX = 140, CY = 140, FR = 120, NR = 97

function ClockFace({ items, selected, onSelect, dotR, formatLabel }) {
  const count  = items.length
  const selIdx = items.indexOf(selected)

  return (
    <svg viewBox={`0 0 ${CS} ${CS}`} width="100%" style={{ display: 'block' }}>
      {/* face */}
      <circle cx={CX} cy={CY} r={FR}
        fill="rgba(255,255,255,0.15)"
        stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

      {/* hand */}
      {selIdx >= 0 && (() => {
        const angle = (selIdx * 360 / count - 90) * (Math.PI / 180)
        const hx = CX + Math.cos(angle) * (NR - dotR * 0.45)
        const hy = CY + Math.sin(angle) * (NR - dotR * 0.45)
        return (
          <line x1={CX} y1={CY} x2={hx} y2={hy}
            stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" />
        )
      })()}

      {/* center dot */}
      <circle cx={CX} cy={CY} r={5} fill="#fff" />

      {/* number dots */}
      {items.map((val, i) => {
        const angle  = (i * 360 / count - 90) * (Math.PI / 180)
        const x      = CX + Math.cos(angle) * NR
        const y      = CY + Math.sin(angle) * NR
        const active = val === selected
        return (
          <g key={val} onClick={() => onSelect(val)} style={{ cursor: 'pointer' }}>
            <circle cx={x} cy={y} r={dotR}
              fill={active ? '#fff' : 'rgba(255,255,255,0.12)'}
              stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
            <text x={x} y={y}
              textAnchor="middle" dominantBaseline="central"
              fill={active ? '#e91e8c' : '#fff'}
              fontSize={count > 6 ? '11' : '14'}
              fontWeight={active ? '800' : '600'}
              style={{ userSelect: 'none', pointerEvents: 'none' }}>
              {formatLabel(val)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function DatePicker({ onSelect }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [year,      setYear]      = useState(today.getFullYear())
  const [month,     setMonth]     = useState(today.getMonth())
  const [selDate,   setSelDate]   = useState(null)
  const [hour,      setHour]      = useState(null)
  const [minute,    setMinute]    = useState(null)
  const [clockMode, setClockMode] = useState('hour')

  const firstDayMon = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const canGoPrev   =
    year > today.getFullYear() ||
    (year === today.getFullYear() && month > today.getMonth())

  const prevMonth = () => {
    if (!canGoPrev) return
    if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1)
  }

  const isPast     = day => new Date(year, month, day) < today
  const isToday    = day => day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  const isSelected = day =>
    selDate && selDate.getDate() === day && selDate.getMonth() === month && selDate.getFullYear() === year

  const cells = [
    ...Array(firstDayMon).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const canConfirm = selDate !== null && hour !== null && minute !== null

  const handleHourSelect = (h) => {
    setHour(h)
    setClockMode('minute')
  }

  return (
    <div className="datepicker ">
      <h2 className="dp-title">Wybierz datę i godzinę 📅</h2>

      {/* ── calendar + clock row ── */}
      <div className="dp-row flex items-stretch gap-6">

      <div className="calendar min-h-[400px]">
        <div className="cal-header">
          <button className="cal-nav" onClick={prevMonth} disabled={!canGoPrev}>‹</button>
          <span className="cal-month-label">{MONTHS[month]} {year}</span>
          <button className="cal-nav" onClick={nextMonth}>›</button>
        </div>
        <div className="cal-grid">
          {DAYS.map(d => <div key={d} className="cal-dayname">{d}</div>)}
          {cells.map((day, i) => (
            <div
              key={i}
              className={[
                'cal-day',
                !day                   ? 'cal-empty'    : '',
                day && isPast(day)     ? 'cal-past'     : '',
                day && isToday(day)    ? 'cal-today'    : '',
                day && isSelected(day) ? 'cal-selected' : '',
                day && !isPast(day)    ? 'cal-available': '',
              ].filter(Boolean).join(' ')}
              onClick={() => day && !isPast(day) && setSelDate(new Date(year, month, day))}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* ── clock picker ── */}
      <div className="clockpicker">
        {/* digital display — click to switch mode */}
        <div className="clock-display">
          <span
            className={`clock-segment${clockMode === 'hour' ? ' clock-seg-active' : ''}`}
            onClick={() => setClockMode('hour')}
          >
            {hour !== null ? pad(hour) : '--'}
          </span>
          <span className="clock-colon">:</span>
          <span
            className={`clock-segment${clockMode === 'minute' ? ' clock-seg-active' : ''}`}
            onClick={() => setClockMode('minute')}
          >
            {minute !== null ? pad(minute) : '--'}
          </span>
        </div>

        <p className="tp-label" style={{ textAlign: 'center', marginBottom: 0 }}>
          {clockMode === 'hour' ? 'Wybierz godzinę' : 'Wybierz minuty'}
        </p>

        {clockMode === 'hour' ? (
          <ClockFace
            items={HOURS}
            selected={hour}
            onSelect={handleHourSelect}
            dotR={18}
            formatLabel={h => pad(h)}
          />
        ) : (
          <ClockFace
            items={MINUTES}
            selected={minute}
            onSelect={m => setMinute(m)}
            dotR={28}
            formatLabel={m => pad(m)}
          />
        )}
      </div>

      </div>{/* end dp-row */}

      {canConfirm && (
        <button className="btn btn-yes dp-confirm" onClick={() => onSelect({ date: selDate, hour, minute })}>
          Dalej →
        </button>
      )}
    </div>
  )
}
