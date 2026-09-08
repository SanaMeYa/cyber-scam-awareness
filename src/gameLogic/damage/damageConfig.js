export const TECHNIQUE_BASE_DAMAGE = {
  social: 300_000,
  phishing: 450_000,
  deepfake: 800_000,
}
export const DAMAGE_TARGET_MULTIPLIER = { employee: 0.75, manager: 1, ceo: 1.5 }
export const DAMAGE_INTEL_MULTIPLIER = { none: 1, relevant: 1.25, multiple: 1.5 }
export const DAMAGE_ROUNDING_INCREMENT = 10_000
export const FAILED_ATTACK_DAMAGE_MULTIPLIER = 0
