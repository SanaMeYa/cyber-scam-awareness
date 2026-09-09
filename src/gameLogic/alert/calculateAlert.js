import {
  ALERT_TARGET_MULTIPLIER, ALERT_TRAIT_ADJUSTMENT, FAILURE_ALERT_PENALTY,
  FATIGUE_MULTIPLIER, TECHNIQUE_BASE_ALERT,
} from './alertConfig.js'

function requireValue(group, key, label) {
  const value = group[key]
  if (value === undefined) throw new Error(`Unknown ${label}: ${key}`)
  return value
}

function getFatigueMultiplier(attemptNumber) {
  if (attemptNumber <= 1) return FATIGUE_MULTIPLIER.first
  if (attemptNumber === 2) return FATIGUE_MULTIPLIER.second
  if (attemptNumber === 3) return FATIGUE_MULTIPLIER.third
  return FATIGUE_MULTIPLIER.fourthOrLater
}

export function calculateAlert({ technique, targetTier, traitMatch = 'neutral',
  attemptNumber = 1, success }) {
  const baseAlert = requireValue(TECHNIQUE_BASE_ALERT, technique, 'technique')
  const traitAdjustment = requireValue(ALERT_TRAIT_ADJUSTMENT, traitMatch, 'trait match')
  const failurePenalty = FAILURE_ALERT_PENALTY[success ? 'success' : 'failure']
  const targetMultiplier = requireValue(ALERT_TARGET_MULTIPLIER, targetTier, 'target tier')
  const fatigueMultiplier = getFatigueMultiplier(attemptNumber)
  const unroundedAlert = (baseAlert + traitAdjustment + failurePenalty)
    * targetMultiplier * fatigueMultiplier
  const alertIncrease = Math.max(0, Math.round(unroundedAlert))

  return { alertIncrease, breakdown: { baseAlert, traitAdjustment, failurePenalty,
    targetMultiplier, fatigueMultiplier, unroundedAlert } }
}
