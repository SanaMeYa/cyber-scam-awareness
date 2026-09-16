import SocialTrainingModule from './SocialTrainingModule.jsx'
import {
  instagramComparisonExamples,
  instagramInspectionExamples,
  instagramSummaryData,
} from './instagramData.js'

export default function InstagramModule({ completed, onComplete, onClose }) {
  return (
    <SocialTrainingModule
      platform="instagram"
      kicker="MODULE 06 // FAKE INSTAGRAM & DM PHISHING"
      title="INSTAGRAM SCAMS & 2FA HIJACKING AWARENESS"
      inspectionExamples={instagramInspectionExamples}
      comparisonExamples={instagramComparisonExamples}
      summaryData={instagramSummaryData}
      completed={completed}
      onComplete={onComplete}
      onClose={onClose}
    />
  )
}
