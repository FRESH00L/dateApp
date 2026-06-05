import { useEffect, useState } from 'react'
import emailjs from '@emailjs/browser'
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, TO_EMAIL } from './emailConfig'

function pad(n) { return String(n).padStart(2, '0') }

export default function Final({ date, hour, minute, location, answers, name }) {
  const [status, setStatus] = useState('sending') // 'sending' | 'ok' | 'error'

  const dateStr = date
    ? `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
    : '—'
  const timeStr = hour !== null ? `${pad(hour)}:${pad(minute)}` : '—'
  const locationStr = location
    ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`
    : '—'

  useEffect(() => {
    const params = {
      to_email:   TO_EMAIL,
      name:       name ?? '—',
      datetime:   `${dateStr} o ${timeStr}`,
      location:   locationStr,
      drink:      answers.drink   ?? '—',
      food:       answers.food    ?? '—',
      music:      answers.music   ?? '—',
      flowers:    answers.flowers ?? '—',
    }

    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params, EMAILJS_PUBLIC_KEY)
      .then(() => setStatus('ok'))
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div className="final">
      <h1 className="final-title">Wszystko gotowe! 🎉</h1>
      <p className="final-sub">Nie mogę się doczekać! 💖</p>

      <div className="final-summary">
        <div className="final-row"><span>📅 Data</span><strong>{dateStr}</strong></div>
        <div className="final-row"><span>🕐 Godzina</span><strong>{timeStr}</strong></div>
        <div className="final-row"><span>📍 Miejsce</span><strong>{locationStr}</strong></div>
        <div className="final-row"><span>☕ Napój</span><strong>{answers.drink}</strong></div>
        <div className="final-row"><span>🍽 Jedzenie</span><strong>{answers.food}</strong></div>
        <div className="final-row"><span>🎵 Muzyka</span><strong>{answers.music}</strong></div>
        <div className="final-row"><span>🌸 Kwiaty</span><strong>{answers.flowers}</strong></div>
      </div>
    </div>
  )
}
