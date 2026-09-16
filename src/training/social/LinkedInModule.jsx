import SocialTrainingModule from './SocialTrainingModule.jsx'
import {
  linkedinComparisonExamples,
  linkedinInspectionExamples,
  linkedinSummaryData,
} from './linkedinData.js'

export default function LinkedInModule({ completed, onComplete, onClose }) {
  return (
    <SocialTrainingModule
      platform="linkedin"
      kicker="MODULE 07 // PROFESSIONAL INMAIL & RECRUITER TRAPS"
      title="LINKEDIN CAREER & RECRUITMENT SCAM AWARENESS"
      inspectionExamples={linkedinInspectionExamples}
      comparisonExamples={linkedinComparisonExamples}
      summaryData={linkedinSummaryData}
      completed={completed}
      onComplete={onComplete}
      onClose={onClose}
    />
  )
}
