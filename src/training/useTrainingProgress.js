import { useCallback, useState } from 'react'

const learningProgressSessionKey = 'breach-point:learning-progress:v1'

function readSessionLearningProgress() {
  try {
    const storedProgress = JSON.parse(window.sessionStorage.getItem(learningProgressSessionKey) ?? '[]')
    return Array.isArray(storedProgress) ? storedProgress : []
  } catch {
    return []
  }
}

function saveSessionLearningProgress(moduleIds) {
  try {
    window.sessionStorage.setItem(learningProgressSessionKey, JSON.stringify(moduleIds))
  } catch {
    // The game remains usable when browser storage is unavailable.
  }
}

export default function useTrainingProgress() {
  const [completedModuleIds, setCompletedModuleIds] = useState(() => new Set(readSessionLearningProgress()))

  const completeModule = useCallback((moduleId) => {
    setCompletedModuleIds((current) => {
      if (current.has(moduleId)) return current
      const next = new Set(current)
      next.add(moduleId)
      saveSessionLearningProgress([...next])
      return next
    })
  }, [])

  const isModuleComplete = useCallback((moduleId) => completedModuleIds.has(moduleId), [completedModuleIds])

  return { completedModuleIds, completeModule, isModuleComplete }
}
