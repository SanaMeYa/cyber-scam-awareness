export const TECHNIQUE_BASE_ALERT = { social: 5, phishing: 7, deepfake: 10 }
export const ALERT_TRAIT_ADJUSTMENT = { positive: -2, neutral: 0, negative: 4 }
export const FAILURE_ALERT_PENALTY = { success: 0, failure: 8 }
export const ALERT_TARGET_MULTIPLIER = { employee: 1, manager: 1.2, ceo: 1.5 }
export const FATIGUE_MULTIPLIER = {
  first: 1, second: 1.1, third: 1.25, fourthOrLater: 1.45,
}
