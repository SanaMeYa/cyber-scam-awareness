import { useEffect, useRef, useState } from 'react'
import {
  deepfakeInspectionExamples,
  totalDeepfakeClues,
  deepfakeRealOrFakeRounds,
  deepfakeSignsRecap,
  deepfakeLearningResources,
} from './videoDeepfakeData.js'
import './VideoDeepfakeModule.css'

export default function VideoDeepfakeModule({ completed, onComplete, onClose }) {
  const deepfakeLessonOpen = true
  const deepfakeLessonMode = 'library'
  const [deepfakeLessonStep, setDeepfakeLessonStep] = useState(0)
  const [deepfakeCluesFound, setDeepfakeCluesFound] = useState(() => new Set())
  const [deepfakeRealOrFakeAnswers, setDeepfakeRealOrFakeAnswers] = useState({})
  const [mediaErrors, setMediaErrors] = useState(() => new Set())
  const deepfakeLessonContentRef = useRef(null)

  useEffect(() => {
    if (!deepfakeLessonOpen || deepfakeLessonMode === 'required') return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [deepfakeLessonMode, deepfakeLessonOpen, onClose])

  useEffect(() => {
    if (deepfakeLessonOpen && deepfakeLessonContentRef.current) {
      deepfakeLessonContentRef.current.scrollTop = 0
    }
  }, [deepfakeLessonOpen, deepfakeLessonStep])

  const revealDeepfakeClue = (clueId) => {
    setDeepfakeCluesFound((current) => new Set(current).add(clueId))
  }

  const answerDeepfakeRound = (roundId, optionKey) => {
    setDeepfakeRealOrFakeAnswers((current) => ({ ...current, [roundId]: optionKey }))
  }

  const markMediaFailed = (mediaKey) => {
    setMediaErrors((current) => new Set(current).add(mediaKey))
  }

  const deepfakeRoundsComplete = deepfakeRealOrFakeRounds.every((round) => deepfakeRealOrFakeAnswers[round.id] === round.correct)
  const correctComparisonCount = deepfakeRealOrFakeRounds.filter((round) => deepfakeRealOrFakeAnswers[round.id] === round.correct).length

  const currentLessonStepComplete = deepfakeLessonStep === 0
    ? deepfakeCluesFound.size === totalDeepfakeClues
    : deepfakeLessonStep === 1
      ? deepfakeRoundsComplete
      : true

  const lessonStepProgress = deepfakeLessonStep === 0
    ? deepfakeCluesFound.size / totalDeepfakeClues
    : deepfakeLessonStep === 1
      ? correctComparisonCount / deepfakeRealOrFakeRounds.length
      : 1

  const lessonProgressPercent = Math.round(((deepfakeLessonStep + lessonStepProgress) / 3) * 100)

  const advanceDeepfakeLesson = () => {
    if (deepfakeLessonStep === 0 && deepfakeCluesFound.size < totalDeepfakeClues) return
    if (deepfakeLessonStep === 1 && !deepfakeRoundsComplete) return

    if (deepfakeLessonStep < 2) {
      setDeepfakeLessonStep((current) => current + 1)
      return
    }

    onComplete()
    onClose()
  }

  // Renders a Section 2 media slot (video or photo). If the file at `src`
  // hasn't been added to public/video/deepfakes/ yet, the load fails and
  // this falls back to a "coming soon" placeholder instead of a broken
  // player/image — nothing else needs to change once the real file exists.
  const renderComparisonMedia = (round, key, option) => {
    const mediaKey = `${round.id}-${key}`
    if (mediaErrors.has(mediaKey)) {
      return (
        <div className="media-placeholder">
          <span>{round.kind === 'video' ? '🎬' : '🖼'}</span>
          <p>{round.kind === 'video' ? 'Video coming soon' : 'Photo coming soon'}</p>
        </div>
      )
    }

    if (round.kind === 'video') {
      return <video src={option.src} controls playsInline preload="metadata" onError={() => markMediaFailed(mediaKey)} />
    }

    return <img src={option.src} alt={option.label} onError={() => markMediaFailed(mediaKey)} />
  }

  return (
    <div className="email-lesson-backdrop deepfake-lesson-backdrop">
      <section className="email-lesson-modal universal-lesson deepfake-lesson-modal" role="dialog" aria-modal="true" aria-labelledby="deepfake-lesson-title">
        <header className="email-lesson-header deepfake-lesson-header">
          <div>
            <span className="lesson-kicker">UNIVERSAL TRAINING MODULE // VIDEO &amp; IMAGE DEEPFAKE</span>
            <h2 id="deepfake-lesson-title">DEEPFAKE AWARENESS</h2>
          </div>
          <button className="lesson-close" type="button" aria-label="Close Deepfake training and return to the game" onClick={() => onClose()}>×</button>
        </header>

        <div className="lesson-progress deepfake-lesson-progress" aria-label={`Training step ${deepfakeLessonStep + 1} of 3`}>
          {['SPOT THE SIGNS', 'REAL OR FAKE', 'SUMMARY'].map((label, index) => (
            <div className={`${index === deepfakeLessonStep ? 'current' : ''} ${index < deepfakeLessonStep ? 'complete' : ''}`} key={label}>
              <span>{index < deepfakeLessonStep ? '✓' : index + 1}</span>
              <small>{label}</small>
            </div>
          ))}
        </div>

        <div className="email-lesson-content" ref={deepfakeLessonContentRef}>
          {deepfakeLessonStep === 0 && (
            <div className="lesson-stage inspection-stage deepfake-stage">
              <div className="lesson-overview-banner">
                <div>
                  <span className="lesson-step-label">STEP 1 // INSPECT THREE EXAMPLES</span>
                  <h3>Identify the warning signs</h3>
                </div>
                <div className="clue-counter">
                  <strong>{deepfakeCluesFound.size} / {totalDeepfakeClues}</strong>
                  <span>warning signs found</span>
                </div>
                <p>
                  Deepfakes can imitate a spokesperson in a video call or clone a person's
                  likeness for a fake profile photo. Select every highlighted marker to learn
                  what deserves a second look before you trust what you see.
                </p>
              </div>

              <div className="inspection-list deepfake-inspection-list">
                {deepfakeInspectionExamples.map((example, index) => (
                  <article className="inspection-example" key={example.id}>
                    <header className="inspection-example-header">
                      <span>EXAMPLE {index + 1}</span>
                      <strong>{example.type}</strong>
                    </header>

                    <div className="inspection-email-layout deepfake-example-layout">
                      <div className="deepfake-media-column">
                        <p className="deepfake-caption">{example.caption}</p>
                        <div className="deepfake-media-frame">
                          <span className="deepfake-media-label">{example.image.label}</span>
                          <div className="deepfake-media-inner">
                            {mediaErrors.has(example.id) ? (
                              <div className="media-placeholder">
                                <span>🖼</span>
                                <p>Image coming soon</p>
                              </div>
                            ) : (
                              <img src={example.image.src} alt={example.type} onError={() => markMediaFailed(example.id)} />
                            )}
                            {example.clues.map((clue) => {
                              const found = deepfakeCluesFound.has(clue.id)
                              return (
                                <button
                                  key={clue.id}
                                  type="button"
                                  className={`deepfake-hotspot ${found ? 'found' : ''}`}
                                  style={{ left: `${clue.x}%`, top: `${clue.y}%` }}
                                  aria-pressed={found}
                                  aria-label={found ? clue.title : 'Reveal warning sign'}
                                  onClick={() => revealDeepfakeClue(clue.id)}
                                >
                                  <span>{found ? '✓' : '?'}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="example-clue-results" aria-live="polite">
                        {example.clues.map((clue) => (
                          <div className={deepfakeCluesFound.has(clue.id) ? 'revealed' : ''} key={clue.id}>
                            <span>{deepfakeCluesFound.has(clue.id) ? '✓' : '?'}</span>
                            <div>
                              <strong>{deepfakeCluesFound.has(clue.id) ? clue.title : 'Clue hidden'}</strong>
                              <p>
                                {deepfakeCluesFound.has(clue.id)
                                  ? clue.explanation
                                  : 'Select a highlighted marker on the media to the left.'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="deepfake-checklist">
                <h3>Quick verification checklist</h3>
                <ul>
                  <li>Check hands, ears, teeth and jewellery closely — small anatomical details are still the hardest thing for AI to render consistently.</li>
                  <li>Watch fabric, hair and background texture for warping, "swimming" or scratchy noise.</li>
                  <li>Look for background elements that don't quite make physical sense.</li>
                  <li>Never rely on a familiar face or voice alone for a high-stakes request — verify through a separate, known channel (a callback to a saved number, an in-person check, or a second colleague).</li>
                </ul>
              </div>

              {deepfakeCluesFound.size === totalDeepfakeClues && (
                <div className="completion-callout">
                  <span>✓</span>
                  <div>
                    <strong>ALL WARNING SIGNS FOUND</strong>
                    <p>Nice work — you spotted every sign across all three examples. Real deepfakes are rarely this obvious once compression and motion are added, so verification habits matter more than spotting glitches. Continue to Section 2 below.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {deepfakeLessonStep === 1 && (
            <div className="lesson-stage comparison-stage deepfake-real-or-fake-stage">
              <div className="lesson-overview-banner">
                <div>
                  <span className="lesson-step-label">STEP 2 // REAL OR FAKE</span>
                  <h3>Pick the genuine video or photo</h3>
                </div>
                <div className="clue-counter">
                  <strong>{correctComparisonCount} / {deepfakeRealOrFakeRounds.length}</strong>
                  <span>correct choices</span>
                </div>
                <p>
                  Two options, one real and one synthetic. Watch or look closely, then choose
                  the one you believe is the authentic, unedited version. An incorrect choice
                  can be reconsidered.
                </p>
              </div>

              <div className="comparison-list">
                {deepfakeRealOrFakeRounds.map((round, index) => (
                  <article className="comparison-example" key={round.id}>
                    <header>
                      <span>ROUND {index + 1}</span>
                      <div><strong>{round.title}</strong><small>{round.prompt}</small></div>
                    </header>

                    <div className="comparison-grid deepfake-comparison-grid">
                      {Object.entries(round.options).map(([key, option]) => {
                        const selected = deepfakeRealOrFakeAnswers[round.id] === key
                        const answerClass = selected ? (key === round.correct ? 'correct' : 'incorrect') : ''
                        return (
                          <div className={`comparison-media-option ${selected ? 'selected' : ''} ${answerClass}`} key={key}>
                            <span className="media-choice-label">{option.label}</span>
                            <div className="media-choice-frame">
                              {renderComparisonMedia(round, key, option)}
                            </div>
                            <button
                              type="button"
                              className="media-select-button"
                              aria-pressed={selected}
                              onClick={() => answerDeepfakeRound(round.id, key)}
                            >
                              {selected ? (key === round.correct ? '✓ Selected — Real' : '✓ Selected') : `Select ${option.label}`}
                            </button>
                          </div>
                        )
                      })}
                    </div>

                    {deepfakeRealOrFakeAnswers[round.id] && (
                      <div className={`answer-feedback ${deepfakeRealOrFakeAnswers[round.id] === round.correct ? 'correct' : 'incorrect'}`}>
                        <strong>{deepfakeRealOrFakeAnswers[round.id] === round.correct ? '✓ Correct choice' : '× Look again'}</strong>
                        <p>{deepfakeRealOrFakeAnswers[round.id] === round.correct ? round.explanation : round.hint}</p>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}

          {deepfakeLessonStep === 2 && (
            <div className="lesson-stage summary-stage deepfake-summary-stage">
              <div className="lesson-overview-banner summary-banner">
                <div><span className="lesson-step-label">STEP 3 // TRAINING SUMMARY</span><h3>Pause. Inspect. Verify. Report.</h3></div>
                <p className="deepfake-summary-intro">
                  A deepfake is a photo, video or audio clip of a real person that has been
                  created or edited with AI to make it look or sound like they said or did
                  something they did not. The technology keeps improving, so no single clue
                  proves content is fake — the goal is to build a habit of pausing and
                  verifying, not just spotting glitches.
                </p>
              </div>

              <div className="summary-principles">
                <article><span>01</span><strong>PAUSE</strong><p>Slow down when a video, call or image pressures you to act immediately, move money, or keep a request secret.</p></article>
                <article><span>02</span><strong>INSPECT</strong><p>Check hands, ears, texture, background logic and audio/lip-sync for the kinds of inconsistencies covered in Section 1.</p></article>
                <article><span>03</span><strong>VERIFY</strong><p>Confirm identity through a separate, trusted channel — a callback to a saved number, an in-person check, or a second colleague — never through contact details supplied by the suspicious content itself.</p></article>
                <article><span>04</span><strong>REPORT</strong><p>Use the organisation's reporting process so security staff can investigate and warn other potential targets.</p></article>
              </div>

              <div className="deepfake-signs-recap">
                <div><span className="lesson-step-label">RECAP // WHAT TO LOOK FOR</span><h3>Four categories of warning sign</h3></div>
                <div className="deepfake-signs-recap-grid">
                  {deepfakeSignsRecap.map((item) => (
                    <article key={item.title}><strong>{item.title}</strong><p>{item.description}</p></article>
                  ))}
                </div>
              </div>

              <section className="summary-impact">
                <div><span className="lesson-step-label">WHY DEEPFAKE ATTACKS CAN REDUCE COMPANY FUNDS</span><h3>A convincing fake can bypass normal checks</h3><p>The game's funds meter represents total simulated business harm, not only money directly transferred.</p></div>
                <div className="summary-impact-grid">
                  <article><strong>FRAUDULENT PAYMENTS</strong><p>A convincing fake executive on a call or video can persuade staff to approve an unauthorised transfer.</p></article>
                  <article><strong>REPUTATIONAL DAMAGE</strong><p>Fake video or audio of company leaders can spread online before it is confirmed and debunked.</p></article>
                  <article><strong>INVESTIGATION COSTS</strong><p>Confirming what is genuine often needs forensic review, legal input and time from multiple teams.</p></article>
                  <article><strong>ERODED TRUST</strong><p>Repeated incidents make staff second-guess genuine calls and messages, slowing normal work.</p></article>
                </div>
              </section>

              <section className="learning-resources">
                <div><span className="lesson-step-label">CONTINUE LEARNING</span><h3>Official Australian guidance</h3><p>Open these resources in a new tab for current prevention and reporting advice.</p></div>
                <div className="resource-links">
                  {deepfakeLearningResources.map((resource) => (
                    <a href={resource.href} target="_blank" rel="noreferrer" key={resource.href}>
                      <strong>{resource.title}</strong><span>{resource.description}</span>
                    </a>
                  ))}
                </div>
              </section>

              <div className="completion-callout">
                <span>✓</span>
                <div>
                  <strong>MODULE READY TO COMPLETE</strong>
                  <p>{completed ? 'You have reviewed the complete Deepfake Awareness training module again.' : 'Complete the module to mark Video / Image Deepfake as finished in your Learning Library.'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="email-lesson-footer deepfake-lesson-footer">
          <button className="lesson-secondary" type="button" disabled={deepfakeLessonStep === 0} onClick={() => setDeepfakeLessonStep((current) => Math.max(0, current - 1))}>‹ PREVIOUS</button>
          <div><span>LEARNING PROGRESS</span><strong>{lessonProgressPercent}%</strong></div>
          <button className="lesson-primary" type="button" disabled={!currentLessonStepComplete} onClick={advanceDeepfakeLesson}>
            {deepfakeLessonStep === 2 ? (completed ? 'FINISH REVIEW' : 'COMPLETE MODULE') : 'CONTINUE'} <span>›</span>
          </button>
        </footer>
      </section>
    </div>
  )
}
