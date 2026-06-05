import { useState } from 'react'

const QUESTIONS = [
  { id: 'drink',   q: 'Co wolisz pić?',     a: { emoji: '☕', label: 'Kawa'      }, b: { emoji: '🍵', label: 'Herbata'  } },
  { id: 'food',    q: 'Co wolisz jeść?',    a: { emoji: '🍕', label: 'Pizza'     }, b: { emoji: '🍣', label: 'Sushi'     } },
  { id: 'music',   q: 'Jaka muzyka?',       a: { emoji: '🎤', label: 'Rap'       }, b: { emoji: '🎵', label: 'Pop'      } },
  { id: 'flowers', q: 'Jakie kwiaty?',      a: { emoji: '🌸', label: 'Goździki'  }, b: { emoji: '🌺', label: 'Piwonie'  } },
]

export default function Quiz({ onComplete }) {
  const [index, setIndex]     = useState(0)
  const [answers, setAnswers] = useState({})
  const [picked, setPicked]   = useState(null) // 'a' | 'b' – animacja przed przejściem

  const current = QUESTIONS[index]

  const handlePick = (side) => {
    if (picked) return
    const value = current[side].label
    setPicked(side)

    setTimeout(() => {
      const next = { ...answers, [current.id]: value }
      setAnswers(next)
      setPicked(null)

      if (index + 1 < QUESTIONS.length) {
        setIndex(i => i + 1)
      } else {
        onComplete(next)
      }
    }, 420)
  }

  return (
    <div className="quiz">
      <p className="quiz-progress">{index + 1} / {QUESTIONS.length}</p>
      <h2 className="quiz-question">{current.q}</h2>

      <div className="quiz-cards">
        {(['a', 'b']).map(side => {
          const opt = current[side]
          const isChosen = picked === side
          const isRejected = picked && picked !== side
          return (
            <button
              key={side}
              className={[
                'quiz-card',
                isChosen   ? 'quiz-chosen'   : '',
                isRejected ? 'quiz-rejected' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => handlePick(side)}
            >
              <span className="quiz-emoji">{opt.emoji}</span>
              <span className="quiz-label">{opt.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
