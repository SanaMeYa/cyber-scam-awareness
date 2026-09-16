import SocialTrainingModule from './SocialTrainingModule.jsx'
import {
  facebookComparisonExamples,
  facebookInspectionExamples,
  facebookSummaryData,
} from './facebookData.js'

export default function FacebookModule({ completed, onComplete, onClose }) {
  return (
    <SocialTrainingModule
      platform="facebook"
      kicker="MODULE 05 // FAKE SOCIAL PROFILE DETECTIVE"
      title="FACEBOOK & MESSENGER SCAM AWARENESS"
      inspectionExamples={facebookInspectionExamples}
      comparisonExamples={facebookComparisonExamples}
      summaryData={facebookSummaryData}
      completed={completed}
      onComplete={onComplete}
      onClose={onClose}
    />
  )
}
