import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import EmailPhishingModule from './phishing/EmailPhishingModule.jsx'
import SmsPhishingModule from './phishing/SmsPhishingModule.jsx'
import VishingModule from './phishing/VishingModule.jsx'
import VoiceCloneModule from './deepfake/VoiceCloneModule.jsx'
import VideoDeepfakeModule from './deepfake/VideoDeepfakeModule.jsx'
import FacebookModule from './social/FacebookModule.jsx'
import InstagramModule from './social/InstagramModule.jsx'
import LinkedInModule from './social/LinkedInModule.jsx'
import { learningModuleCatalog } from './trainingRegistry.js'
import './TrainingModules.css'

const TrainingLibrary = forwardRef(function TrainingLibrary({ completedModuleIds, onModuleComplete, onAudioChange, onBeforeModuleOpen }, ref) {
  const [learningMenuOpen, setLearningMenuOpen] = useState(false)
  const [activeModuleId, setActiveModuleId] = useState(null)
  const learningMenuRef = useRef(null)

  useEffect(() => {
    if (!learningMenuOpen) return undefined

    const closeLearningMenu = (event) => {
      if (!learningMenuRef.current?.contains(event.target)) setLearningMenuOpen(false)
    }
    const closeLearningMenuWithKeyboard = (event) => {
      if (event.key === 'Escape') setLearningMenuOpen(false)
    }

    document.addEventListener('mousedown', closeLearningMenu)
    document.addEventListener('keydown', closeLearningMenuWithKeyboard)
    return () => {
      document.removeEventListener('mousedown', closeLearningMenu)
      document.removeEventListener('keydown', closeLearningMenuWithKeyboard)
    }
  }, [learningMenuOpen])

  const learningModuleCompletion = {
    email: completedModuleIds.has('email'),
    sms: completedModuleIds.has('sms'),
    vishing: completedModuleIds.has('vishing'),
    teams: completedModuleIds.has('teams'),
    facebook: completedModuleIds.has('facebook'),
    instagram: completedModuleIds.has('instagram'),
    linkedin: completedModuleIds.has('linkedin'),
    'voice-clone': completedModuleIds.has('voice-clone'),
    'video-deepfake': completedModuleIds.has('video-deepfake'),
  }
  const completedLearningModules = Object.values(learningModuleCompletion).filter(Boolean).length
  const availableLearningModules = learningModuleCatalog.filter((module) => module.available).length

  const openLearningModule = (moduleId) => {
    const module = learningModuleCatalog.find((item) => item.id === moduleId)
    if (!module?.available) return
    onBeforeModuleOpen()
    setLearningMenuOpen(false)
    setActiveModuleId(moduleId)
  }

  const closeModule = () => {
    setActiveModuleId(null)
    onAudioChange(false)
  }

  const completeModule = (moduleId) => {
    onModuleComplete(moduleId)
    closeModule()
  }

  useImperativeHandle(ref, () => ({
    openModule: openLearningModule,
    closeAll() {
      setLearningMenuOpen(false)
      setActiveModuleId(null)
      onAudioChange(false)
    },
  }))

  return (
    <>
            <div className="learning-library" ref={learningMenuRef}>
              <button className="utility-button learning-library-trigger" type="button" aria-haspopup="dialog" aria-expanded={learningMenuOpen} aria-controls="learning-library-dialog" onClick={() => setLearningMenuOpen((current) => !current)}>
                <span className="learning-icon">◈</span> LEARNING
                <span className={`learning-status-dot ${completedLearningModules > 0 ? 'unlocked' : ''}`} aria-hidden="true" />
              </button>
              {learningMenuOpen && (
                <div className="learning-library-backdrop" role="presentation" onMouseDown={(event) => {
                  if (event.target === event.currentTarget) setLearningMenuOpen(false)
                }}>
                  <section className="learning-library-modal" id="learning-library-dialog" role="dialog" aria-modal="true" aria-labelledby="learning-library-title" onMouseDown={(event) => event.stopPropagation()}>
                    <div className="library-scan-line" aria-hidden="true" />
                    <header className="learning-library-header">
                      <div className="learning-library-title-block">
                        <span className="library-eyebrow">KNOWLEDGE // DEFENCE NETWORK</span>
                        <div>
                          <span className="library-core-icon" aria-hidden="true">◈</span>
                          <div><h2 id="learning-library-title">Awareness Training Library</h2><p>Build practical recognition and response skills through optional interactive modules.</p></div>
                        </div>
                      </div>
                      <div className="learning-library-stats" aria-label="Learning library status">
                        <div><strong>09</strong><span>TOTAL MODULES</span></div>
                        <div><strong>{String(availableLearningModules).padStart(2, '0')}</strong><span>AVAILABLE NOW</span></div>
                        <div className="complete"><strong>{String(completedLearningModules).padStart(2, '0')}</strong><span>COMPLETED</span></div>
                      </div>
                      <button className="learning-library-close" type="button" aria-label="Close Learning Library" onClick={() => setLearningMenuOpen(false)}>×</button>
                    </header>

                    <div className="learning-library-category-strip" aria-label="Module categories">
                      <span className="phishing"><i />4 PHISHING MODULES</span>
                      <span className="social"><i />3 FAKE PROFILE MODULES</span>
                      <span className="deepfake"><i />2 DEEPFAKE MODULES</span>
                    </div>

                    <div className="learning-library-grid">
                      {learningModuleCatalog.map((module) => {
                        const completed = Boolean(learningModuleCompletion[module.id])
                        return (
                          <article className={`library-module-card ${module.theme} ${module.available ? 'available' : 'coming-soon'} ${completed ? 'completed' : ''}`} key={module.id}>
                            <header><span>MODULE {module.number}</span><em>{completed ? '✓ COMPLETED' : module.available ? 'AVAILABLE' : 'COMING SOON'}</em></header>
                            <div className="library-module-main">
                              <span className="library-module-icon" aria-hidden="true">{module.icon}</span>
                              <div><small>{module.category}</small><h3>{module.title}</h3></div>
                            </div>
                            <p>{module.description}</p>
                            <footer>
                              <span>{module.format}</span>
                              <button type="button" disabled={!module.available} onClick={() => openLearningModule(module.id)}>
                                {module.available ? (completed ? 'REVIEW MODULE' : 'START MODULE') : 'IN DEVELOPMENT'} <i>›</i>
                              </button>
                            </footer>
                          </article>
                        )
                      })}
                    </div>

                    <footer className="learning-library-footer">
                      <div><span>◉</span><p><strong>OPTIONAL TRAINING</strong> Modules no longer interrupt gameplay. Open this library whenever you want to practise.</p></div>
                      <small>SESSION-ONLY PROGRESS • NO PERSONAL DATA STORED</small>
                    </footer>
                  </section>
                </div>
              )}
            </div>
      {activeModuleId === 'email' && <EmailPhishingModule completed={completedModuleIds.has('email')} onComplete={() => completeModule('email')} onClose={closeModule} />}
      {activeModuleId === 'sms' && <SmsPhishingModule completed={completedModuleIds.has('sms')} onComplete={() => completeModule('sms')} onClose={closeModule} />}
      {activeModuleId === 'vishing' && <VishingModule completed={completedModuleIds.has('vishing')} onComplete={() => completeModule('vishing')} onClose={closeModule} onAudioChange={onAudioChange} />}
      {activeModuleId === 'voice-clone' && <VoiceCloneModule completed={completedModuleIds.has('voice-clone')} onComplete={() => completeModule('voice-clone')} onClose={closeModule} />}
      {activeModuleId === 'video-deepfake' && <VideoDeepfakeModule completed={completedModuleIds.has('video-deepfake')} onComplete={() => completeModule('video-deepfake')} onClose={closeModule} />}
      {activeModuleId === 'facebook' && <FacebookModule completed={completedModuleIds.has('facebook')} onComplete={() => completeModule('facebook')} onClose={closeModule} />}
      {activeModuleId === 'instagram' && <InstagramModule completed={completedModuleIds.has('instagram')} onComplete={() => completeModule('instagram')} onClose={closeModule} />}
      {activeModuleId === 'linkedin' && <LinkedInModule completed={completedModuleIds.has('linkedin')} onComplete={() => completeModule('linkedin')} onClose={closeModule} />}
    </>
  )
})

export default TrainingLibrary
