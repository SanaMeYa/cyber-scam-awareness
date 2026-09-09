import {
  DAMAGE_INTEL_MULTIPLIER, DAMAGE_ROUNDING_INCREMENT,
  DAMAGE_TARGET_MULTIPLIER, FAILED_ATTACK_DAMAGE_MULTIPLIER,
  TECHNIQUE_BASE_DAMAGE,
} from './damageConfig.js'

function requireValue(group, key, label) {
  const value = group[key]
  if (value === undefined) throw new Error(`Unknown ${label}: ${key}`)
  return value
}

export function calculateDamage({ technique, targetTier, intelLevel = 'none', success }) {
  const baseDamage = requireValue(TECHNIQUE_BASE_DAMAGE, technique, 'technique')
  const targetMultiplier = requireValue(DAMAGE_TARGET_MULTIPLIER, targetTier, 'target tier')
  const intelMultiplier = requireValue(DAMAGE_INTEL_MULTIPLIER, intelLevel, 'intel level')
  const outcomeMultiplier = success ? 1 : FAILED_ATTACK_DAMAGE_MULTIPLIER
  const rawDamage = baseDamage * targetMultiplier * intelMultiplier * outcomeMultiplier
  const damage = Math.round(rawDamage / DAMAGE_ROUNDING_INCREMENT)
    * DAMAGE_ROUNDING_INCREMENT

  return { damage, breakdown: { baseDamage, targetMultiplier, intelMultiplier,
    outcomeMultiplier, rawDamage } }
}
