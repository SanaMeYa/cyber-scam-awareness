import { calculateAlert } from './alert/calculateAlert.js'
import { calculateDamage } from './damage/calculateDamage.js'
import { selectDefensiveDialogue } from './dialogue/defensiveDialogue.js'
import { calculateSuccessChance } from './probability/calculateSuccessChance.js'

export function resolveTurn(attack, random = Math.random) {
  const probability = calculateSuccessChance({
    ...attack,
    defenceModifier: attack.defense.modifier,
  })
  const roll = random() * 100
  const success = roll < probability.finalChance
  const resolvedAttack = { ...attack, success }
  const damageResult = calculateDamage(resolvedAttack)
  const alertResult = calculateAlert(resolvedAttack)
  const dialogue = selectDefensiveDialogue(resolvedAttack, random)

  return {
    success,
    outcome: success ? 'success' : 'failure',
    successChance: probability.finalChance,
    roll: Math.round(roll * 100) / 100,
    damage: damageResult.damage,
    alertIncrease: alertResult.alertIncrease,
    defense: attack.defense,
    dialogue,
    fatigue: attack.attemptNumber > 1,
    calculationBreakdown: {
      probability,
      damage: damageResult.breakdown,
      alert: alertResult.breakdown,
    },
  }
}
