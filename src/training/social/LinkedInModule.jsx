import SocialTrainingModule from './SocialTrainingModule.jsx'
import {
  linkedinInspectionExamples,
  linkedinResponseScenario,
  linkedinSummaryData,
  linkedinVerificationChallenges,
} from './linkedinData.js'

export default function LinkedInModule({ completed, onComplete, onClose }) {
  return (
    <SocialTrainingModule
      platform="linkedin"
      kicker="MODULE 07 // PROFESSIONAL IDENTITY DEFENCE"
      title="LINKEDIN RECRUITMENT & IMPERSONATION DEFENCE"
      inspectionExamples={linkedinInspectionExamples}
      verificationChallenges={linkedinVerificationChallenges}
      responseScenario={linkedinResponseScenario}
      summaryData={linkedinSummaryData}
      completed={completed}
      onComplete={onComplete}
      onClose={onClose}
    />
  )
}
