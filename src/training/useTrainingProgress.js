import { useCallback, useState } from 'react'

const progressKey = 'breach-point:learning-progress:v1'

function readProgress() {
  try {
    const stored = JSON.parse(window.sessionStorage.getItem(progressKey) ?? '[]')
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

function writeProgress(moduleIds) {
  try {
    window.sessionStorage.setItem(progressKey, JSON.stringify(moduleIds))
  } catch {
    // Training remains usable when browser storage is unavailable.
  }
}

export default function useTrainingProgress() {
  const [completedModuleIds, setCompletedModuleIds] = useState(() => new Set(readProgress()))

  const completeModule = useCallback((moduleId) => {
    setCompletedModuleIds((current) => {
      if (current.has(moduleId)) return current

      const next = new Set(current)
      next.add(moduleId)
      writeProgress([...next])
      return next
    })
  }, [])

  const isModuleComplete = useCallback(
    (moduleId) => completedModuleIds.has(moduleId),
    [completedModuleIds],
  )

  return { completedModuleIds, completeModule, isModuleComplete }
}
