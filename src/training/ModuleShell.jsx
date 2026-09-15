import { useEffect, useRef } from 'react'

export default function ModuleShell({
  moduleId,
  title,
  kicker,
  steps,
  step,
  canContinue,
  onContinue,
  onClose,
  children,
  completed,
}) {
  const contentRef = useRef(null)

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [step])

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const finalStep = step === steps.length - 1

  return (
    <div className={`training-backdrop training-${moduleId}`}>
      <section className="training-modal" role="dialog" aria-modal="true" aria-labelledby={`${moduleId}-training-title`}>
        <header className="training-header">
          <div>
            <span className="training-kicker">{kicker}</span>
            <h2 id={`${moduleId}-training-title`}>{title}</h2>
          </div>
          <button className="training-close" type="button" aria-label={`Close ${title}`} onClick={onClose}>×</button>
        </header>

        <div className="training-progress" style={{ '--training-steps': steps.length }} aria-label={`Training step ${step + 1} of ${steps.length}`}>
          {steps.map((label, index) => (
            <div className={`${index === step ? 'current' : ''} ${index < step || completed ? 'complete' : ''}`} key={label}>
              <span>{index < step || completed ? '✓' : index + 1}</span>
              <small>{label}</small>
            </div>
          ))}
        </div>

        <div className="training-content" ref={contentRef}>{children}</div>

        <footer className="training-footer">
          <div>
            <strong>{Math.round(((step + (canContinue ? 1 : 0)) / steps.length) * 100)}%</strong>
            <span>MODULE PROGRESS</span>
          </div>
          <button type="button" disabled={!canContinue} onClick={onContinue}>
            {finalStep ? (completed ? 'RETURN TO LIBRARY' : 'COMPLETE MODULE') : 'CONTINUE'} <span>›</span>
          </button>
        </footer>
      </section>
    </div>
  )
}
