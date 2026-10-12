import { useEffect, useMemo, useRef, useState } from 'react'
import { teamsAttackChain, teamsFieldRules, teamsInvestigationCases, teamsResponseScenario } from './teamsData.js'
import './TeamsPhishingModule.css'

const stages = ['INVESTIGATE THE DM', 'TRACE THE ATTACK', 'CONTROL THE OUTCOME', 'DEFENCE PLAYBOOK']

function ShieldIcon({ checked = false }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 20 6v6c0 5-3.2 8.1-8 10-4.8-1.9-8-5-8-10V6l8-3Z" />{checked && <path d="m8.5 12 2.4 2.4 4.8-5" />}</svg>
}

function TeamsAvatar({ initials, presence = 'Available' }) {
  return <span className="teams-avatar" aria-hidden="true">{initials}<i className={presence.toLowerCase().replaceAll(' ', '-')} /></span>
}

function EvidenceButton({ clue, foundClueIds, hintedClueId, onReveal, children, className = '' }) {
  if (!clue) return children
  const found = foundClueIds.has(clue.id)
  return <button className={`teams-evidence ${className} ${found ? 'found' : ''} ${!found && hintedClueId === clue.id ? 'hinted' : ''}`} type="button" aria-pressed={found} aria-label={`${found ? 'Found' : 'Inspect'} warning sign: ${clue.label}`} onClick={() => onReveal(clue.id)}>{children}{found && <i aria-hidden="true">✓</i>}</button>
}

function TeamsMessage({ message, investigationCase, foundClueIds, hintedClueId, onReveal }) {
  return (
    <article className="teams-chat-message">
      <TeamsAvatar initials={investigationCase.initials} presence={investigationCase.presence} />
      <div>
        <header><strong>{investigationCase.contact}</strong><span>{message.time}</span></header>
        <p>{message.parts.map((part, index) => <EvidenceButton clue={investigationCase.clues.find((item) => item.id === part.clueId)} foundClueIds={foundClueIds} hintedClueId={hintedClueId} onReveal={onReveal} key={`${message.time}-${index}`}>{part.text}</EvidenceButton>)}</p>
        {message.attachment && <EvidenceButton clue={investigationCase.clues.find((item) => item.id === message.attachment.clueId)} foundClueIds={foundClueIds} hintedClueId={hintedClueId} onReveal={onReveal} className="teams-attachment-evidence"><span className="teams-file-icon">{message.attachment.name.endsWith('.xlsm') ? 'X' : 'PDF'}</span><span><strong>{message.attachment.name}</strong><small>{message.attachment.meta}</small></span><em>⋯</em></EvidenceButton>}
      </div>
    </article>
  )
}

function TeamsInvestigationWindow({ investigationCase, foundClueIds, hintedClueId, onReveal }) {
  const identityClue = investigationCase.clues.find((clue) => clue.area === 'identity')
  return (
    <section className="teams-client" aria-label={`Fictional Microsoft Teams conversation with ${investigationCase.contact}`}>
      <div className="teams-client-rail" aria-hidden="true"><span className="teams-app-mark">T</span><i>⌂</i><i className="active">◫</i><i>♙</i><i>▦</i><i>☎</i><b>•••</b></div>
      <aside className="teams-chat-list">
        <header><strong>Chat</strong><span>⌕ • □</span></header><div className="teams-chat-filter"><span className="active">Chat</span><span>Channels</span></div><small>RECENT</small>
        <article className="selected"><TeamsAvatar initials={investigationCase.initials} presence={investigationCase.presence} /><div><strong>{investigationCase.contact}</strong><p>{investigationCase.messages.at(-1).parts.map((part) => part.text).join('').slice(0, 42)}…</p></div><time>{investigationCase.messages.at(-1).time}</time></article>
        <article><TeamsAvatar initials="FP" /><div><strong>Finance &amp; Procurement</strong><p>Jordan: Approved—thanks.</p></div></article><article><TeamsAvatar initials="PO" /><div><strong>Project Orion</strong><p>Meeting notes published</p></div></article>
      </aside>
      <main className="teams-chat-pane">
        <header className="teams-chat-header"><TeamsAvatar initials={investigationCase.initials} presence={investigationCase.presence} /><div><strong>{investigationCase.contact}</strong><span>{investigationCase.role}</span></div><nav aria-hidden="true"><span>▱</span><span>☎</span><span>＋</span></nav></header>
        <EvidenceButton clue={identityClue} foundClueIds={foundClueIds} hintedClueId={hintedClueId} onReveal={onReveal} className="teams-identity-banner"><span>ⓘ</span><div><strong>{investigationCase.opening}</strong><small>{investigationCase.badge} • {investigationCase.tenant}</small></div><em>View profile</em></EvidenceButton>
        <div className="teams-message-stream"><div className="teams-date-divider"><span>TODAY</span></div>{investigationCase.messages.map((message) => <TeamsMessage message={message} investigationCase={investigationCase} foundClueIds={foundClueIds} hintedClueId={hintedClueId} onReveal={onReveal} key={message.time} />)}</div>
        <footer className="teams-compose" aria-hidden="true"><div>Type a message</div><span>✚ • A • ☺ • GIF • ➤</span></footer>
      </main>
    </section>
  )
}

export default function TeamsPhishingModule({ completed, onComplete, onClose }) {
  const [stage, setStage] = useState(0)
  const [caseIndex, setCaseIndex] = useState(0)
  const [foundClueIds, setFoundClueIds] = useState(() => new Set())
  const [hintedClueId, setHintedClueId] = useState(null)
  const [activeFindingId, setActiveFindingId] = useState(null)
  const [exploredChainIds, setExploredChainIds] = useState(() => new Set())
  const [activeChainIndex, setActiveChainIndex] = useState(0)
  const [responseTurn, setResponseTurn] = useState(0)
  const [responseHistory, setResponseHistory] = useState([])
  const [responseFinished, setResponseFinished] = useState(false)
  const contentRef = useRef(null)
  const conversationRef = useRef(null)
  const currentCase = teamsInvestigationCases[caseIndex]
  const totalClues = teamsInvestigationCases.reduce((total, item) => total + item.clues.length, 0)
  const currentCaseFound = currentCase.clues.filter((clue) => foundClueIds.has(clue.id)).length
  const activeFinding = teamsInvestigationCases.flatMap((item) => item.clues).find((clue) => clue.id === activeFindingId)
  const firstUnresolvedClueId = currentCase.clues.find((clue) => !foundClueIds.has(clue.id))?.id ?? null
  const currentTurn = teamsResponseScenario.turns[responseTurn]
  const currentResponse = responseHistory[responseTurn]
  const exposure = responseHistory.reduce((total, item) => total + item.option.risk, 0)
  const safeDecisions = responseHistory.filter((item) => item.option.risk === 0).length
  const score = useMemo(() => Math.round((foundClueIds.size / totalClues) * 40 + (exploredChainIds.size / teamsAttackChain.length) * 25 + (safeDecisions / teamsResponseScenario.turns.length) * 35), [exploredChainIds.size, foundClueIds.size, safeDecisions, totalClues])

  useEffect(() => { const closeOnEscape = (event) => { if (event.key === 'Escape') onClose() }; window.addEventListener('keydown', closeOnEscape); return () => window.removeEventListener('keydown', closeOnEscape) }, [onClose])
  useEffect(() => { contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' }) }, [stage])
  useEffect(() => { conversationRef.current?.scrollTo({ top: conversationRef.current.scrollHeight, behavior: 'smooth' }) }, [responseHistory])
  useEffect(() => { if (stage !== 0 || currentCaseFound > 0 || !firstUnresolvedClueId) return undefined; const timer = window.setTimeout(() => setHintedClueId(firstUnresolvedClueId), 15000); return () => window.clearTimeout(timer) }, [stage, currentCase.id, currentCaseFound, firstUnresolvedClueId])

  const revealClue = (clueId) => { setHintedClueId(null); setActiveFindingId(clueId); setFoundClueIds((current) => new Set(current).add(clueId)) }
  const selectCase = (index) => { setHintedClueId(null); setActiveFindingId(null); setCaseIndex(index) }
  const exploreChainNode = (index) => { if (index > exploredChainIds.size) return; setActiveChainIndex(index); setExploredChainIds((current) => new Set(current).add(teamsAttackChain[index].id)) }
  const chooseResponse = (option) => { if (!currentResponse) setResponseHistory((current) => [...current, { turn: currentTurn, option }]) }
  const resetConversation = () => { setResponseTurn(0); setResponseHistory([]); setResponseFinished(false) }
  const stageComplete = stage === 0 ? foundClueIds.size === totalClues : stage === 1 ? exploredChainIds.size === teamsAttackChain.length : stage === 2 ? responseFinished : true
  const advance = () => { if (!stageComplete) return; if (stage < 3) setStage((current) => current + 1); else { onComplete(); onClose() } }
  const stageProgress = stage === 0 ? foundClueIds.size / totalClues : stage === 1 ? exploredChainIds.size / teamsAttackChain.length : stage === 2 ? responseHistory.length / teamsResponseScenario.turns.length : 1
  const overallProgress = Math.round(((stage + stageProgress) / 4) * 100)

  return (
    <div className="email-lesson-backdrop teams-module-backdrop">
      <section className="email-lesson-modal universal-lesson teams-module" role="dialog" aria-modal="true" aria-labelledby="teams-module-title">
        <header className="email-lesson-header teams-module-header"><div className="teams-module-heading"><span className="teams-module-logo" aria-hidden="true">T</span><div><span className="lesson-kicker">UNIVERSAL TRAINING MODULE // COLLABORATION PHISHING</span><h2 id="teams-module-title">TEAMS DM DEFENCE LAB</h2></div></div><div className="teams-overall-progress"><span>MODULE PROGRESS</span><div><i style={{ width: `${overallProgress}%` }} /></div><strong>{overallProgress}%</strong></div><button className="lesson-close" type="button" aria-label="Close Teams DM training" onClick={onClose}>×</button></header>
        <nav className="lesson-progress teams-module-progress" aria-label={`Teams DM training stage ${stage + 1} of 4`}>{stages.map((label, index) => <button type="button" className={`${index === stage ? 'current' : ''} ${index < stage ? 'complete' : ''}`} disabled={index > stage} onClick={() => index < stage && setStage(index)} key={label}><span>{index < stage ? '✓' : String(index + 1).padStart(2, '0')}</span><small>{label}</small></button>)}</nav>
        <div className="email-lesson-content teams-module-content" ref={contentRef}>
          {stage === 0 && <div className="teams-stage teams-investigation-stage">
            <div className="teams-stage-intro"><div><span>STAGE 01 // MESSAGE FORENSICS</span><h3>Investigate the conversation—not just the display name</h3><p>Select suspicious details directly inside each fictional Teams conversation. Examine identity labels, wording, links, files and requests together.</p></div><div className="teams-stage-meter"><strong>{foundClueIds.size}<small> / {totalClues}</small></strong><span>EVIDENCE FOUND</span></div></div>
            <div className="teams-case-tabs" role="tablist" aria-label="Teams phishing investigations">{teamsInvestigationCases.map((item, index) => { const found = item.clues.filter((clue) => foundClueIds.has(clue.id)).length; const complete = found === item.clues.length; return <button type="button" role="tab" aria-selected={caseIndex === index} className={`${caseIndex === index ? 'active' : ''} ${complete ? 'complete' : ''}`} onClick={() => selectCase(index)} key={item.id}><span>{complete ? '✓' : `0${index + 1}`}</span><div><small>{item.channel}</small><strong>{item.tab}</strong></div><em>{found}/{item.clues.length}</em></button> })}</div>
            <div className="teams-investigation-layout"><TeamsInvestigationWindow investigationCase={currentCase} foundClueIds={foundClueIds} hintedClueId={hintedClueId} onReveal={revealClue} /><aside className="teams-finding-panel"><header><span className="teams-scan-icon">⌖</span><div><small>LIVE FINDINGS</small><strong>{currentCaseFound === currentCase.clues.length ? 'Case evidence complete' : 'Select suspicious details'}</strong></div><em>{currentCaseFound}/{currentCase.clues.length}</em></header>{activeFinding && currentCase.clues.some((clue) => clue.id === activeFinding.id) ? <article className="teams-active-finding" key={activeFinding.id}><span>WARNING SIGN IDENTIFIED</span><h4>{activeFinding.title}</h4><p>{activeFinding.explanation}</p><div><strong>SAFER RESPONSE</strong><p>{activeFinding.safer}</p></div></article> : <div className="teams-empty-finding"><span>◎</span><p>Inspect the Teams window and select the details that feel inconsistent, pressured or unsafe.</p><small>One clue will flash after 15 seconds if you need help getting started.</small></div>}<div className="teams-finding-list">{currentCase.clues.map((clue) => <span className={foundClueIds.has(clue.id) ? 'found' : ''} key={clue.id}><i>{foundClueIds.has(clue.id) ? '✓' : '○'}</i>{clue.label}</span>)}</div></aside></div>
          </div>}
          {stage === 1 && <div className="teams-stage teams-chain-stage">
            <div className="teams-stage-intro"><div><span>STAGE 02 // ATTACK PATH</span><h3>Trace how one Teams message becomes company damage</h3><p>Follow the attack from the first DM to its operational impact. Activate each connected stage to expose what the attacker gains and where defenders can break the chain.</p></div><div className="teams-stage-meter"><strong>{exploredChainIds.size}<small> / {teamsAttackChain.length}</small></strong><span>STAGES TRACED</span></div></div>
            <section className="teams-attack-map"><div className="teams-chain-track" aria-label="Teams phishing attack chain">{teamsAttackChain.map((node, index) => { const explored = exploredChainIds.has(node.id); const available = index <= exploredChainIds.size; return <button type="button" className={`${activeChainIndex === index ? 'active' : ''} ${explored ? 'explored' : ''} ${available ? 'available' : ''}`} disabled={!available} onClick={() => exploreChainNode(index)} key={node.id}><span>{explored ? '✓' : node.icon}</span><small>PHASE {index + 1}</small><strong>{node.title}</strong><em>{node.subtitle}</em></button> })}</div><article className="teams-chain-detail" key={teamsAttackChain[activeChainIndex].id}><header><span>{teamsAttackChain[activeChainIndex].icon}</span><div><small>PHASE {activeChainIndex + 1} ANALYSIS</small><h4>{teamsAttackChain[activeChainIndex].title}</h4></div></header><p>{teamsAttackChain[activeChainIndex].detail}</p><div className="teams-chain-insights"><section><span>BUSINESS EFFECT</span><p>{teamsAttackChain[activeChainIndex].impact}</p></section><section><span>BREAK THE CHAIN</span><p>{teamsAttackChain[activeChainIndex].defence}</p></section></div>{!exploredChainIds.has(teamsAttackChain[activeChainIndex].id) && <button type="button" onClick={() => exploreChainNode(activeChainIndex)}>ACTIVATE THIS PHASE →</button>}</article></section>
          </div>}
          {stage === 2 && <div className="teams-stage teams-outcome-stage">
            <div className="teams-stage-intro"><div><span>STAGE 03 // CONTROL THE OUTCOME</span><h3>Respond inside a live impersonation attempt</h3><p>Every choice changes the next message. Keep normal business controls intact while the attacker changes tactics.</p></div><div className={`teams-risk-meter ${exposure >= 70 ? 'critical' : exposure > 0 ? 'elevated' : ''}`}><strong>{Math.min(100, exposure)}%</strong><span>COMPROMISE RISK</span><i><b style={{ width: `${Math.min(100, exposure)}%` }} /></i></div></div>
            <div className="teams-outcome-layout"><section className="teams-live-chat"><header><TeamsAvatar initials={teamsResponseScenario.initials} /><div><strong>{teamsResponseScenario.contact}</strong><span>{teamsResponseScenario.role}</span></div><nav>▱ • ☎ • ⋯</nav></header><div className="teams-live-thread" ref={conversationRef}><article className="incoming"><TeamsAvatar initials={teamsResponseScenario.initials} /><div><header><strong>{teamsResponseScenario.contact}</strong><span>2:41 PM</span></header><p>{teamsResponseScenario.opening}</p></div></article>{responseHistory.map(({ turn, option }, index) => <div className="teams-live-exchange" key={turn.id}><article className={`outgoing ${option.risk === 0 ? 'safe' : option.risk >= 30 ? 'risky' : 'uncertain'}`}><p>{option.reply}</p><span>You • Sent</span></article><article className="incoming reaction"><TeamsAvatar initials={teamsResponseScenario.initials} /><div><header><strong>{teamsResponseScenario.contact}</strong><span>{`2:${43 + index * 2} PM`}</span></header><p>{option.attackerReply}</p></div></article>{index < responseTurn && <small>{option.feedback}</small>}</div>)}</div><footer><div>{currentResponse ? 'Response sent' : 'Choose a response from the decision console'}</div><span>➤</span></footer></section>
              <section className="teams-decision-console">{!responseFinished ? <><header><span>DECISION {responseTurn + 1} OF {teamsResponseScenario.turns.length}</span><h4>{currentTurn.prompt}</h4></header><div className="teams-decision-options">{currentTurn.options.map((option) => <button type="button" className={currentResponse?.option.id === option.id ? (option.risk === 0 ? 'selected safe' : option.risk >= 30 ? 'selected risky' : 'selected uncertain') : ''} disabled={Boolean(currentResponse)} onClick={() => chooseResponse(option)} key={option.id}><span>{option.label}</span><p>{option.action}</p></button>)}</div>{currentResponse && <div className={`teams-decision-feedback ${currentResponse.option.risk === 0 ? 'safe' : 'risk'}`}><strong>{currentResponse.option.resultTitle}</strong><p>{currentResponse.option.feedback}</p>{responseTurn < teamsResponseScenario.turns.length - 1 ? <button type="button" onClick={() => setResponseTurn((current) => current + 1)}>CONTINUE CONVERSATION →</button> : <button type="button" onClick={() => setResponseFinished(true)}>VIEW OUTCOME →</button>}</div>}</> : <div className={`teams-outcome-result ${exposure === 0 ? 'safe' : exposure >= 70 ? 'critical' : 'mixed'}`}><span><ShieldIcon checked={exposure === 0} /></span><small>SIMULATION COMPLETE</small><h4>{exposure === 0 ? teamsResponseScenario.outcomes.safe.title : exposure >= 70 ? teamsResponseScenario.outcomes.risky.title : teamsResponseScenario.outcomes.mixed.title}</h4><p>{exposure === 0 ? teamsResponseScenario.outcomes.safe.text : exposure >= 70 ? teamsResponseScenario.outcomes.risky.text : teamsResponseScenario.outcomes.mixed.text}</p><div><span>SAFE DECISIONS</span><strong>{safeDecisions} / {teamsResponseScenario.turns.length}</strong></div><button type="button" onClick={resetConversation}>↻ REPLAY CONVERSATION</button></div>}</section></div>
          </div>}
          {stage === 3 && <div className="teams-stage teams-summary-stage">
            <section className="teams-summary-hero"><div className="teams-summary-shield"><ShieldIcon checked /></div><div><span>STAGE 04 // DEFENCE PLAYBOOK</span><h3>Teams DM threat responder</h3><p>You have investigated identity signals, traced the attack chain and practised responding without surrendering normal business controls.</p></div><div className="teams-summary-score"><strong>{score}</strong><span>AWARENESS SCORE</span></div></section>
            <div className="teams-summary-actions"><article><span>01</span><div><small>PAUSE</small><h4>Separate urgency from legitimacy</h4><p>A short deadline, senior title or confidential project does not remove the need to verify.</p></div></article><article><span>02</span><div><small>VERIFY</small><h4>Leave the suspicious DM</h4><p>Use internal directories, saved contacts, official portals and existing approval processes.</p></div></article><article><span>03</span><div><small>CONTAIN</small><h4>Report before deleting</h4><p>Preserve the identity, message, link and file so security can protect everybody else.</p></div></article></div>
            <section className="teams-field-rules"><header><span>TEAMS DM FIELD RULES</span><p>Four behaviours to use after the simulation.</p></header><div>{teamsFieldRules.map((rule) => <article key={rule.title}><span>{rule.icon}</span><div><strong>{rule.title}</strong><p>{rule.text}</p></div></article>)}</div></section><div className="teams-summary-warning"><span>!</span><p><strong>Remember:</strong> Teams is a communication channel, not proof of identity. External accounts, guest access and compromised internal accounts can all display familiar names and photos.</p></div><div className="teams-completion-callout"><span>✓</span><div><strong>MODULE READY TO COMPLETE</strong><p>{completed ? 'You have reviewed the complete Teams DM Defence Lab again.' : 'Complete the module to unlock Teams / Slack DM attacks in gameplay.'}</p></div></div>
          </div>}
        </div>
        <footer className="email-lesson-footer teams-module-footer"><div><strong>{stage === 0 ? `${foundClueIds.size}/${totalClues}` : stage === 1 ? `${exploredChainIds.size}/${teamsAttackChain.length}` : stage === 2 ? `${responseHistory.length}/${teamsResponseScenario.turns.length}` : `${score}%`}</strong><span>{stage === 0 ? 'EVIDENCE FOUND' : stage === 1 ? 'PHASES TRACED' : stage === 2 ? 'DECISIONS MADE' : 'FINAL SCORE'}</span></div><button className="lesson-secondary" type="button" onClick={() => setStage((current) => Math.max(0, current - 1))} disabled={stage === 0}>BACK</button><button className="lesson-primary" type="button" disabled={!stageComplete} onClick={advance}>{stage < 3 ? 'CONTINUE →' : completed ? 'COMPLETE REVIEW ✓' : 'COMPLETE MODULE ✓'}</button></footer>
      </section>
    </div>
  )
}
