import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import EmailPhishingModule from './phishing/EmailPhishingModule.jsx'
import SmsPhishingModule from './phishing/SmsPhishingModule.jsx'
import VishingModule from './phishing/VishingModule.jsx'
import TeamsPhishingModule from './phishing/TeamsPhishingModule.jsx'
import FacebookModule from './social/FacebookModule.jsx'
import InstagramModule from './social/InstagramModule.jsx'
import LinkedInModule from './social/LinkedInModule.jsx'
import VoiceCloneModule from './deepfake/VoiceCloneModule.jsx'
import VideoDeepfakeModule from './deepfake/VideoDeepfakeModule.jsx'
import { trainingModules } from './trainingRegistry.js'
import './TrainingLibrary.css'

const moduleComponents = {
  email: EmailPhishingModule,
  sms: SmsPhishingModule,
  vishing: VishingModule,
  teams: TeamsPhishingModule,
  facebook: FacebookModule,
  instagram: InstagramModule,
  linkedin: LinkedInModule,
  'voice-clone': VoiceCloneModule,
  'video-deepfake': VideoDeepfakeModule,
}

const TrainingLibrary = forwardRef(function TrainingLibrary({ completedModuleIds, onModuleComplete, onAudioChange }, ref) {
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [activeModuleId, setActiveModuleId] = useState(null)
  const triggerRef = useRef(null)

  const closeLibrary = () => {
    setLibraryOpen(false)
    window.setTimeout(() => triggerRef.current?.focus(), 0)
  }

  const openModule = (moduleId) => {
    const module = trainingModules.find((item) => item.id === moduleId)
    if (!module?.available) return
    setActiveModuleId(moduleId)
  }

  useImperativeHandle(ref, () => ({
    openModule,
    closeAll() {
      setActiveModuleId(null)
      setLibraryOpen(false)
      onAudioChange?.(false)
    },
  }))

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && libraryOpen && !activeModuleId) closeLibrary()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  })

  const completeModule = (moduleId) => {
    onModuleComplete(moduleId)
    setActiveModuleId(null)
    setLibraryOpen(true)
    onAudioChange?.(false)
  }

  const activeModule = trainingModules.find((item) => item.id === activeModuleId)
  const ActiveModule = activeModuleId ? moduleComponents[activeModuleId] : null
  const availableCount = trainingModules.filter((module) => module.available).length
  const completedCount = trainingModules.filter((module) => completedModuleIds.has(module.id)).length

  return (
    <div className="learning-library">
      <button ref={triggerRef} className="utility-button learning-library-trigger" type="button" aria-haspopup="dialog" aria-expanded={libraryOpen} aria-controls="learning-library-dialog" onClick={() => setLibraryOpen(true)}>
        <span className="learning-icon">◈</span> LEARNING
        <span className={`learning-status-dot ${completedCount > 0 ? 'unlocked' : ''}`} aria-hidden="true" />
      </button>

      {libraryOpen && <div className="learning-library-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeLibrary() }}>
        <section className="learning-library-modal" id="learning-library-dialog" role="dialog" aria-modal="true" aria-labelledby="learning-library-title" onMouseDown={(event) => event.stopPropagation()}>
          <div className="library-scan-line" aria-hidden="true" />
          <header className="learning-library-header">
            <div className="learning-library-title-block"><span className="library-eyebrow">KNOWLEDGE // DEFENCE NETWORK</span><div><span className="library-core-icon" aria-hidden="true">◈</span><div><h2 id="learning-library-title">Awareness Training Library</h2><p>Build practical recognition and response skills through interactive modules.</p></div></div></div>
            <div className="learning-library-stats" aria-label="Learning library status"><div><strong>09</strong><span>TOTAL MODULES</span></div><div><strong>{String(availableCount).padStart(2, '0')}</strong><span>AVAILABLE NOW</span></div><div className="complete"><strong>{String(completedCount).padStart(2, '0')}</strong><span>COMPLETED</span></div></div>
            <button className="learning-library-close" type="button" aria-label="Close Learning Library" onClick={closeLibrary}>×</button>
          </header>

          <div className="learning-library-category-strip" aria-label="Module categories"><span className="phishing"><i />4 PHISHING MODULES</span><span className="social"><i />3 FAKE PROFILE MODULES</span><span className="deepfake"><i />2 DEEPFAKE MODULES</span></div>

          <div className="learning-library-grid">
            {trainingModules.map((module) => {
              const completed = completedModuleIds.has(module.id)
              return <article className={`library-module-card ${module.theme} ${module.available ? 'available' : 'coming-soon'} ${completed ? 'completed' : ''}`} key={module.id}>
                <header><span>MODULE {module.number}</span><em>{completed ? '✓ COMPLETED' : module.available ? 'AVAILABLE' : 'COMING SOON'}</em></header>
                <div className="library-module-main"><span className="library-module-icon" aria-hidden="true">{module.icon}</span><div><small>{module.category}</small><h3>{module.title}</h3></div></div>
                <p>{module.description}</p>
                <footer><span>{module.format}</span><button type="button" disabled={!module.available} onClick={() => openModule(module.id)}>{module.available ? (completed ? 'REVIEW MODULE' : 'START MODULE') : 'IN DEVELOPMENT'} <i>›</i></button></footer>
              </article>
            })}
          </div>

          <footer className="learning-library-footer"><div><span>◉</span><p><strong>OPTIONAL TRAINING</strong> Complete an available module to unlock its matching attack in gameplay.</p></div><small>SESSION-ONLY PROGRESS • NO PERSONAL DATA STORED</small></footer>
        </section>
      </div>}

      {ActiveModule && activeModule && <ActiveModule completed={completedModuleIds.has(activeModuleId)} onComplete={() => completeModule(activeModuleId)} onClose={() => { setActiveModuleId(null); onAudioChange?.(false) }} onAudioChange={onAudioChange} />}
    </div>
  )
})

export default TrainingLibrary
