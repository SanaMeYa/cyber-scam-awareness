const dialogue = (success, failure) => ({ success, failure })

// These are retained as content for future use. The current release uses the
// existing target-level progression rather than individual technique locks.
export const lockedTechniqueDialogue = {
  derek: {
    social: {
      line: "Derek does not accept the request - he only connects with people who share a mutual contact.",
      tag: 'Checking for a genuine mutual connection blocks many fake profiles.',
    },
  },
  sarah: {
    vishing: {
      line: 'Sarah refuses to discuss sensitive information over an unverified call and uses the official directory to call back.',
      tag: 'Callback verification is a reliable defence against vishing.',
    },
  },
  marcus: {
    phishing: {
      line: 'The request does not reach Marcus because his assistant screens direct contact.',
      tag: 'An executive-assistant screening layer provides an effective defensive barrier.',
    },
    social: {
      line: 'The request does not reach Marcus because his assistant screens direct contact.',
      tag: 'An executive-assistant screening layer provides an effective defensive barrier.',
    },
    deepfake: {
      line: 'There is not enough usable audio or video to create a convincing deepfake.',
      tag: 'Deepfake attacks require suitable source material.',
    },
  },
}

// Dialogue adapted from Michael's Defensive Dialogue Reference v1.
// Each outcome is a pool so the UI can vary its feedback between attempts.
const characterDialogue = {
  jordan: {
    phishing: {
      default: dialogue(
        [
          { line: "Jordan doesn't think twice - he resets the account like he's asked.", tag: 'No verification of an urgent request - a classic phishing weak point.' },
          { line: "Jordan doesn't want to seem unhelpful, so he pushes through even though he is not fully sure the request is right.", tag: 'Eagerness to help overriding caution.' },
        ],
        [
          { line: 'Something feels off - Jordan asks the caller to confirm the ticket number first.', tag: 'A basic verification habit can be enough to stop an attack.' },
          { line: 'He decides to check with his supervisor before making any account changes.', tag: 'Escalating when uncertain closes off the attempt.' },
        ],
      ),
      vishing: dialogue(
        [
          { line: "The caller's exact knowledge of internal terms wins Jordan over despite his nerves.", tag: 'Even a cautious person can be persuaded by an attacker who has done their homework.' },
          { line: 'The caller catches Jordan in a rush, and he lets his guard down just enough to answer.', tag: 'Time pressure can override a wary instinct.' },
        ],
        [
          { line: 'Jordan gets flustered, hangs up and reports the call to his supervisor.', tag: 'Reporting a suspicious call is an effective defence.' },
          { line: 'He says he will only discuss account details through the ticketing system.', tag: 'Redirecting the request to an official channel stops the attempt.' },
        ],
      ),
    },
    social: {
      facebook: dialogue(
        [
          { line: 'Jordan accepts the friend request without a second look.', tag: 'Accepting unfamiliar requests allows fake profiles to establish trust.' },
          { line: 'He sees a few mutual friends and assumes the profile must be legitimate.', tag: 'Mutual-friend counts should not be treated as proof of identity.' },
        ],
        [
          { line: 'Jordan does not recognise the profile photo from anywhere real, and ignores it.', tag: 'A quick check of an unfamiliar profile can be enough.' },
          { line: 'The account has almost no post history, which makes Jordan suspicious.', tag: 'Sparse account history is a common fake-profile warning sign.' },
        ],
      ),
    },
  },
  priya: {
    phishing: {
      vishing: dialogue(
        [
          { line: 'Already handling another call, Priya waves the request through to save time.', tag: 'Verification is often skipped when people are rushed.' },
          { line: 'Priya wants to clear the growing queue, so she does not push back.', tag: 'Queue pressure can override scrutiny.' },
        ],
        [
          { line: 'The timing does not add up, so Priya puts the caller on hold to check.', tag: 'Pausing to investigate a mismatch can stop an attack.' },
          { line: 'Priya checks the request against internal records and finds no match.', tag: 'Cross-check requests against an authoritative internal source.' },
        ],
      ),
      default: dialogue(
        [
          { line: 'The message references a real recent visitor, and Priya lowers her guard.', tag: 'Contextual familiarity can weaken an otherwise strict habit.' },
          { line: 'The request looks like it came from someone Priya has dealt with before, so she makes an exception.', tag: 'Familiarity can erode consistent verification.' },
        ],
        [
          { line: 'Priya refuses to act without using the proper channel first.', tag: 'A consistently applied procedure can close an entire attack path.' },
          { line: 'She completes the standard verification step despite the apparent urgency.', tag: 'Security procedures remain important under time pressure.' },
        ],
      ),
    },
    social: {
      instagram: dialogue(
        [
          { line: 'The profile looks like someone Priya has seen before, so she accepts.', tag: 'A familiar-looking profile is not necessarily verified.' },
          { line: 'The account uses a familiar-looking handle, and Priya misses the difference.', tag: 'Lookalike usernames exploit quick visual scanning.' },
        ],
        [
          { line: 'Priya checks the account history and notices that it does not add up.', tag: 'Account age and posting history can expose impersonation.' },
          { line: 'She does not recognise the name from anywhere real and scrolls past.', tag: 'Not every target takes the bait; matching a trait is not a guarantee.' },
        ],
      ),
    },
  },
  derek: {
    phishing: {
      default: dialogue(
        [
          { line: "Derek is sure he would spot anything suspicious, so he does not check the ticket properly.", tag: 'Confidence is not the same as caution.' },
          { line: 'Derek trusts his judgement, reads too quickly and misses the warning signs.', tag: 'Overconfidence reduces scrutiny.' },
        ],
        [
          { line: 'Derek runs the request past his own team before acting.', tag: 'A reliable process helps regardless of individual confidence.' },
          { line: 'He asks a technical question that only the real colleague would know.', tag: 'Challenge-based verification can expose impersonation.' },
        ],
      ),
    },
    social: {
      default: dialogue(
        [
          { line: 'Seeing Jordan among the mutual contacts, Derek accepts the request.', tag: 'Attackers exploit transitive trust from shared connections.' },
          { line: "Derek recognises Jordan's name and assumes the profile is safe.", tag: 'A mutual connection creates credibility without direct verification.' },
        ],
        [
          { line: 'Derek asks Jordan directly whether he knows the person.', tag: 'Verify a claimed mutual connection rather than taking it at face value.' },
          { line: "The profile's work history conflicts with what Derek knows, so he flags it.", tag: 'Cross-reference profile details against known facts.' },
        ],
      ),
    },
  },
  sarah: {
    phishing: {
      vishing: dialogue(
        [
          { line: 'Caught between meetings, Sarah skips the callback just this once.', tag: 'Even a strong security habit can slip under time pressure.' },
          { line: "The caller knows Sarah's schedule, making the request feel legitimate.", tag: 'Known scheduling details can create false credibility.' },
        ],
        [
          { line: 'Sarah verifies the request through internal chat before answering.', tag: 'A lightweight independent check can stop an attack.' },
          { line: "The caller's phrasing does not match how her team normally speaks, so Sarah remains cautious.", tag: 'Subtle language mismatches can reveal impersonation.' },
        ],
      ),
      default: dialogue(
        [
          { line: 'The story about a struggling colleague persuades Sarah to bend the rule.', tag: 'Appeals to compassion are an effective manipulation technique.' },
          { line: "Concern for a colleague's wellbeing overrides Sarah's instinct to verify.", tag: 'Emotional urgency can bypass standard procedure.' },
        ],
        [
          { line: 'Sarah checks the story directly with the colleague before acting.', tag: 'Direct verification with the person involved stops the attempt.' },
          { line: 'She offers to help but insists on involving the real colleague first.', tag: 'Include the person concerned before acting on their behalf.' },
        ],
      ),
    },
  },
  marcus: {
    deepfake: {
      voice: dialogue(
        [
          { line: 'It sounds exactly like Marcus, so his assistant puts the call through.', tag: 'Public audio provides raw material for convincing voice cloning.' },
          { line: 'The urgency and familiar tone match how Marcus normally speaks under pressure.', tag: 'Matching behaviour as well as voice increases believability.' },
        ],
        [
          { line: 'The phrasing sounds slightly wrong, and the call is flagged before reaching Marcus.', tag: 'Cadence and word choice can expose synthetic audio.' },
          { line: 'A listener notices an unnatural steadiness in the audio and stops the request.', tag: 'Subtle audio artefacts can reveal a voice clone.' },
        ],
      ),
    },
  },
}

const genericDialogue = {
  phishing: {
    email: dialogue(
      [
        { line: 'They click the link and enter their details without checking it.', tag: 'The sender address and destination domain were not verified.' },
        { line: 'The message closely copies a familiar internal format, so they trust it.', tag: 'Visual mimicry can exploit pattern recognition.' },
      ],
      [
        { line: 'They hover over the link, spot the mismatched domain and report it.', tag: 'Check where a link actually leads before opening it.' },
        { line: 'They notice that the display name does not match the sender address.', tag: 'Compare the display name with the actual email address.' },
      ],
    ),
    sms: dialogue(
      [
        { line: 'The urgency in the text prompts them to open the link immediately.', tag: 'Artificial urgency discourages careful verification.' },
        { line: 'The message references a plausible event, so they trust it.', tag: 'Contextual plausibility can lower suspicion.' },
      ],
      [
        { line: 'They use the official app instead of following the unsolicited link.', tag: 'Use a known channel rather than a link supplied in a message.' },
        { line: 'They contact someone they know to confirm the situation first.', tag: 'Verify through a separate trusted channel.' },
      ],
    ),
    vishing: dialogue(
      [
        { line: 'The caller sounds official, so they provide the requested information.', tag: 'Caller identity was not independently verified.' },
        { line: 'Time pressure prevents them from stopping to assess the request.', tag: 'Artificial urgency can override careful judgement.' },
      ],
      [
        { line: 'They end the call and call back through the official switchboard.', tag: 'Callback verification is a strong defence against vishing.' },
        { line: 'They refuse to discuss the request by phone and end the call.', tag: 'Declining and disengaging is a valid defensive response.' },
      ],
    ),
    teams: dialogue(
      [
        { line: 'The message looks internal, so they reply without checking the account.', tag: 'An internal-looking interface does not prove account identity.' },
        { line: 'The attacker copies internal shorthand and tone convincingly.', tag: 'Familiar communication styles can create false trust.' },
      ],
      [
        { line: 'They notice the account is marked as external and report it.', tag: 'Check whether an account is internal, external or a guest.' },
        { line: 'They compare the sender profile with the internal directory and find no match.', tag: 'Cross-reference identities with an authoritative source.' },
      ],
    ),
  },
  social: {
    default: dialogue(
      [
        { line: 'The profile appears familiar, so they accept without verifying it.', tag: 'Surface-level familiarity is not proof of identity.' },
        { line: 'Plausible account details make the request seem genuine.', tag: 'Attackers use contextual details to manufacture trust.' },
      ],
      [
        { line: 'They inspect the account history and decline the request.', tag: 'Account age, activity and connections can reveal a fake profile.' },
        { line: 'They confirm the claimed identity through a trusted contact.', tag: 'Independent verification can expose social impersonation.' },
      ],
    ),
  },
  deepfake: {
    voice: dialogue(
      [
        { line: 'The voice sounds right, so they act on the instruction.', tag: 'High-stakes voice requests need fallback verification.' },
        { line: 'Realistic background noise makes the cloned voice more convincing.', tag: 'Environmental audio can reinforce false authenticity.' },
      ],
      [
        { line: 'The pacing feels wrong, so they ask a question only the real person could answer.', tag: 'Challenge-response verification can expose voice cloning.' },
        { line: 'They insist on switching channels, and the caller abandons the request.', tag: 'Escalating to a harder-to-fake channel is an effective check.' },
      ],
    ),
    video: dialogue(
      [
        { line: 'The video looks convincing at a glance, so they proceed.', tag: 'Time pressure can prevent scrutiny of visual artefacts.' },
        { line: 'The familiar lighting and setting strengthen the illusion.', tag: 'Environmental consistency can manufacture credibility.' },
      ],
      [
        { line: 'They request an unscripted movement, and the video responds unnaturally.', tag: 'A live-action challenge is harder to fake in real time.' },
        { line: 'They notice unnatural blinking and verify the request separately.', tag: 'Visual artefacts can indicate manipulated media.' },
      ],
    ),
  },
}

function selectPool(attack) {
  const characterTechnique = characterDialogue[attack.targetId]?.[attack.technique]
  return characterTechnique?.[attack.subtype]
    ?? characterTechnique?.default
    ?? genericDialogue[attack.technique]?.[attack.subtype]
    ?? genericDialogue[attack.technique]?.default
}

export function selectDefensiveDialogue(attack, random = Math.random) {
  const pool = selectPool(attack)?.[attack.success ? 'success' : 'failure']
  if (!pool?.length) throw new Error(`No dialogue for ${attack.targetId}/${attack.technique}/${attack.subtype}`)

  const selected = pool[Math.floor(random() * pool.length)]
  return {
    title: attack.success ? 'Attack Successful' : 'Attack Blocked',
    ...selected,
  }
}
