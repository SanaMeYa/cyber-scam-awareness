import {
  ALERT_MODIFIER, INTEL_MODIFIER, MAX_SUCCESS_CHANCE, MIN_SUCCESS_CHANCE,
  REPEAT_ATTEMPT_MODIFIER, TARGET_MODIFIER, TECHNIQUE_BASE_CHANCE, TRAIT_MODIFIER,
} from '../defense/defenseConfig.js'

function requireConfigValue(group, key, label) {
  const value = group[key]
  if (value === undefined) throw new Error(`Unknown ${label}: ${key}`)
  return value
}

function getAttemptModifier(attemptNumber) {
  if (attemptNumber <= 1) return REPEAT_ATTEMPT_MODIFIER.first
  if (attemptNumber === 2) return REPEAT_ATTEMPT_MODIFIER.second
  if (attemptNumber === 3) return REPEAT_ATTEMPT_MODIFIER.third
  return REPEAT_ATTEMPT_MODIFIER.fourthOrLater
}

function getAlertModifier(alertLevel) {
  if (alertLevel < 50) return ALERT_MODIFIER.low
  if (alertLevel < 75) return ALERT_MODIFIER.elevated
  return ALERT_MODIFIER.high
}

export function calculateSuccessChance({ technique, intelLevel = 'none',
  traitMatch = 'neutral', targetTier, attemptNumber = 1, alertLevel = 0,
  defenceModifier = 0 }) {
  const modifiers = {
    intel: requireConfigValue(INTEL_MODIFIER, intelLevel, 'intel level'),
    trait: requireConfigValue(TRAIT_MODIFIER, traitMatch, 'trait match'),
    target: requireConfigValue(TARGET_MODIFIER, targetTier, 'target tier'),
    repeatAttempt: getAttemptModifier(attemptNumber),
    alert: getAlertModifier(alertLevel),
    defence: defenceModifier,
  }
  const baseChance = requireConfigValue(TECHNIQUE_BASE_CHANCE, technique, 'technique')
  const unclampedChance = baseChance + Object.values(modifiers)
    .reduce((total, value) => total + value, 0)
  const finalChance = Math.max(MIN_SUCCESS_CHANCE,
    Math.min(MAX_SUCCESS_CHANCE, unclampedChance))

  return { baseChance, modifiers, unclampedChance, finalChance }
}
