// Media lives in the app's public folder at public/video/deepfakes/, so it's
// referenced here by absolute URL path rather than imported as a module.
// Files that don't exist yet simply 404 at runtime — DeepfakeModule.jsx
// catches that per-item (onError) and shows a "coming soon" placeholder
// instead of a broken image/video, so nothing needs to change here once a
// real file is dropped into that folder with the matching name.

const ASSET_BASE = '/video/deepfakes'

/* =========================================================================
   SECTION 1 — SPOT THE SIGNS
   ========================================================================= */

export const deepfakeInspectionExamples = [
  {
    id: 'synthetic-avatar-video-1',
    type: 'AI avatar / synthetic video — clip 1',
    caption: 'A single frame from a short AI-generated "spokesperson" clip.',
    image: { src: `${ASSET_BASE}/video1-frame.jpg`, label: 'Clip 1' },
    clues: [
      {
        id: 'fabric-texture',
        x: 47, y: 65,
        title: 'Fabric pattern does not hold together',
        explanation: 'Zoom into the sweater vest and the argyle diamonds warp and blur instead of lining up like real woven fabric. Clothing texture that "swims" or fails to stay geometrically consistent is a common generative-video artefact.',
      },
      {
        id: 'hand-blur',
        x: 50, y: 88,
        title: 'Blurred, indistinct finger joints',
        explanation: 'Hands are still one of the hardest things for AI video models to render. Look closely and the fingers melt together at the knuckles instead of separating cleanly.',
      },
      {
        id: 'static-pose',
        x: 46, y: 28,
        title: 'Rigid, template-like presenter pose',
        explanation: 'A direct-to-camera stare, clasped hands and minimal head movement give an almost frozen quality. That stiffness is typical of AI-generated talking-head clips rather than a candid recording.',
      },
      {
        id: 'background-logic',
        x: 58, y: 17,
        title: 'Background object does not quite make sense',
        explanation: 'The plaster patch on the wall is an odd, blobby shape with no real architectural purpose, and the decorative object mounted on it appears to merge straight into the brickwork with no visible fixing. Backdrops like this are often generated rather than filmed.',
      },
    ],
  },
  {
    id: 'synthetic-avatar-video-2',
    type: 'AI avatar / synthetic video — clip 2',
    caption: 'A single frame from a second, unrelated AI-generated clip.',
    image: { src: `${ASSET_BASE}/video4-frame.jpg`, label: 'Clip 2' },
    clues: [
      {
        id: 'malformed-fingers',
        x: 56, y: 87,
        title: 'Malformed fingers',
        explanation: 'The lower hand does not resolve into a believable set of fingers — the shapes blur and overlap in a way no real hand bends. Hands remain one of the most reliable tells in synthetic video.',
      },
      {
        id: 'ring-melt',
        x: 59, y: 41,
        title: 'Jewellery blends into the finger',
        explanation: 'The ring on the raised hand does not sit as a distinct band — it fades and merges into the skin instead of having a clean, consistent edge, a common sign of generated hands and accessories.',
      },
      {
        id: 'background-noise',
        x: 83, y: 14,
        title: 'Unnatural scratchy background texture',
        explanation: 'Parts of the plain backdrop show a scratchy, static-like texture instead of a smooth, even surface. Real studio backdrops do not spontaneously develop this kind of noisy patterning.',
      },
      {
        id: 'floating-hair',
        x: 32, y: 26,
        title: 'A stray strand of hair floats free',
        explanation: 'A thin loop of hair appears disconnected from the rest of the hairstyle, hovering next to the neck rather than following gravity or attaching to the head — a small but telling rendering glitch.',
      },
    ],
  },
  {
    id: 'face-swapped-photo',
    type: 'Face-swapped photo',
    caption: 'A friendly "team member" headshot used in a profile, ad or fake review.',
    image: { src: `${ASSET_BASE}/face-swap-example.jpg`, label: 'Photo' },
    clues: [
      {
        id: 'skin-hair-mismatch',
        x: 63, y: 19,
        title: 'Face detail does not match the hair',
        explanation: 'The skin is almost porcelain-smooth with no pores or fine texture, while individual hair strands right next to it are crisply rendered. That gap in detail level between the face and everything around it is a classic face-swap / inpainting tell.',
      },
      {
        id: 'hidden-ears',
        x: 56, y: 37,
        title: 'Ears conveniently hidden',
        explanation: 'Both ears are fully covered by hair. Ears are difficult for face-generation and face-swap models to render convincingly, so they are often quietly hidden.',
      },
      {
        id: 'eye-asymmetry',
        x: 71, y: 24,
        title: 'Subtle asymmetry between the eyes',
        explanation: 'Zoomed in, the catchlights and lid/lash shaping differ slightly between the left and right eye — a small but telling deviation from natural bilateral symmetry.',
      },
      {
        id: 'blend-seam',
        x: 60, y: 46,
        title: 'Soft blending seam at the hairline / jaw',
        explanation: 'Where hair strands cross the cheek and jaw there is a faint soft-blur transition rather than a crisp strand-over-skin edge, consistent with a warped face mask being composited onto the original image.',
      },
    ],
  },
]

export const totalDeepfakeClues = deepfakeInspectionExamples.reduce(
  (total, example) => total + example.clues.length,
  0,
)

/* =========================================================================
   SECTION 2 — REAL OR FAKE
   ========================================================================= */

// Drop the actual files into public/video/deepfakes/ using these exact
// filenames and each round starts working immediately — no code changes
// needed. Until a file exists at a given path, that option shows a
// "coming soon" placeholder instead of a broken player/image.
//
// Expected files:
//   video-round1-real.mp4   video-round1-fake.mp4
//   video-round2-real.mp4   video-round2-fake.mp4
//   image-round1-real.jpg   image-round1-fake.jpg
//   image-round2-real.jpg   image-round2-fake.jpg
//
// Also double check `correct` / `explanation` / `hint` on each round still
// match which option (a/b) is actually the genuine one once real footage
// is in place — the values below were written before the footage existed.

export const deepfakeRealOrFakeRounds = [
  {
    id: 'video-round-1',
    kind: 'video',
    title: 'Video pair 1',
    prompt: 'Which clip is the real, unedited video?',
    correct: 'a',
    explanation: 'Video A is the genuine recording. Look back for the signs from Section 1 in Video B — unstable texture, off hand movement, or a background that does not behave like a real space.',
    hint: 'Replay both clips and watch the hands, jewellery and background for anything that warps or behaves inconsistently.',
    options: {
      a: { label: 'VIDEO A', src: `${ASSET_BASE}/video-round1-real.mp4` },
      b: { label: 'VIDEO B', src: `${ASSET_BASE}/video-round1-fake.mp4` },
    },
  },
  {
    id: 'video-round-2',
    kind: 'video',
    title: 'Video pair 2',
    prompt: 'Which clip is the real, unedited video?',
    correct: 'b',
    explanation: 'Video B is the genuine recording. Video A is the synthetic one — the same kinds of small physical inconsistencies from Section 1 give it away on a closer look.',
    hint: 'Pay attention to lighting consistency, skin texture and whether the mouth movement lines up naturally with speech.',
    options: {
      a: { label: 'VIDEO A', src: `${ASSET_BASE}/video-round2-fake.mp4` },
      b: { label: 'VIDEO B', src: `${ASSET_BASE}/video-round2-real.mp4` },
    },
  },
  {
    id: 'image-round-1',
    kind: 'image',
    title: 'Photo pair 1',
    prompt: 'Which photo is the real, unedited photo?',
    correct: 'a',
    explanation: 'Photo A is the genuine photo. Photo B shows the face-swap signs from Section 1 — mismatched skin/hair detail, hidden ears, or a soft blending seam.',
    hint: 'Zoom in mentally on the ears, the eyes, and the edge where the hair meets the face.',
    options: {
      a: { label: 'PHOTO A', src: `${ASSET_BASE}/image-round1-real.jpg` },
      b: { label: 'PHOTO B', src: `${ASSET_BASE}/image-round1-fake.jpg` },
    },
  },
  {
    id: 'image-round-2',
    kind: 'image',
    title: 'Photo pair 2',
    prompt: 'Which photo is the real, unedited photo?',
    correct: 'b',
    explanation: 'Photo B is the genuine photo. Photo A is the synthetic or face-swapped one, once you look closely at the same kinds of details as Photo pair 1.',
    hint: 'Compare the fine texture of the skin against the fine texture of the hair — a mismatch is a strong tell.',
    options: {
      a: { label: 'PHOTO A', src: `${ASSET_BASE}/image-round2-fake.jpg` },
      b: { label: 'PHOTO B', src: `${ASSET_BASE}/image-round2-real.jpg` },
    },
  },
]

export const totalDeepfakeRounds = deepfakeRealOrFakeRounds.length

/* =========================================================================
   SECTION 3 — SUMMARY
   ========================================================================= */

export const deepfakeSignsRecap = [
  {
    title: 'HANDS & JEWELLERY',
    description: 'Fingers that blur, merge or bend unnaturally, and rings or watches that do not hold a clean, consistent edge.',
  },
  {
    title: 'FABRIC & TEXTURE',
    description: 'Clothing patterns that warp or "swim", skin that looks airbrushed next to crisply detailed hair, or backgrounds with unnatural static-like noise.',
  },
  {
    title: 'BACKGROUND LOGIC',
    description: 'Objects, architecture or shadows that do not quite make physical sense, or a backdrop reused identically across unrelated clips.',
  },
  {
    title: 'FACE & MOTION',
    description: 'Hidden or asymmetric ears, subtle asymmetry between the eyes, stiff or overly minimal movement, and audio that does not quite line up with the lips.',
  },
]

export const deepfakeLearningResources = [
  { href: 'https://www.esafety.gov.au/industry/tech-trends-and-challenges/deepfakes', title: 'eSafety — Deepfake trends and challenges', description: 'Background on how deepfakes are made and the risks they pose ›' },
  { href: 'https://www.scamwatch.gov.au/about-us/news-and-alerts/scam-alert-fake-celebrity-online-investment-scams', title: 'Scamwatch — Fake celebrity deepfake scams', description: 'A real example of deepfakes used in investment scams ›' },
  { href: 'https://www.csc.gov.au/members/articles/cyber-security-spotlight-deepfakes', title: 'Cyber Security Spotlight — Deepfakes', description: 'A concise list of red flags to check in suspicious media ›' },
  { href: 'https://www.asic.gov.au/about-asic/news-centre/find-a-media-release/2026-releases/26-195mr-asic-warns-scammers-are-using-ai-to-spin-vast-webs-of-deception', title: 'ASIC — AI deepfake scam networks', description: 'How deepfakes are combined with fake sites and reviews ›' },
]
