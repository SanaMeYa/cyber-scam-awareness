import SocialTrainingModule from './SocialTrainingModule.jsx'
import {
  facebookInspectionExamples,
  facebookResponseScenario,
  facebookSummaryData,
  facebookVerificationChallenges,
} from './facebookData.js'

export default function FacebookModule({ completed, onComplete, onClose }) {
  return (
    <SocialTrainingModule
      platform="facebook"
      kicker="MODULE 05 // FAKE SOCIAL PROFILE DETECTIVE"
      title="FACEBOOK IDENTITY & MARKETPLACE DEFENCE"
      inspectionExamples={facebookInspectionExamples}
      verificationChallenges={facebookVerificationChallenges}
      responseScenario={facebookResponseScenario}
      summaryData={facebookSummaryData}
      completed={completed}
      onComplete={onComplete}
      onClose={onClose}
    />
  )
}
