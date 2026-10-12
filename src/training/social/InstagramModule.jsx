import SocialTrainingModule from './SocialTrainingModule.jsx'
import {
  instagramInspectionExamples,
  instagramResponseScenario,
  instagramSummaryData,
  instagramVerificationChallenges,
} from './instagramData.js'

export default function InstagramModule({ completed, onComplete, onClose }) {
  return (
    <SocialTrainingModule
      platform="instagram"
      kicker="MODULE 06 // FAKE PROFILE & ACCOUNT DEFENCE"
      title="INSTAGRAM IDENTITY & ACCOUNT TAKEOVER DEFENCE"
      inspectionExamples={instagramInspectionExamples}
      verificationChallenges={instagramVerificationChallenges}
      responseScenario={instagramResponseScenario}
      summaryData={instagramSummaryData}
      completed={completed}
      onComplete={onComplete}
      onClose={onClose}
    />
  )
}
