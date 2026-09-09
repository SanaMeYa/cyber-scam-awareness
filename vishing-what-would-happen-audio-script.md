# “What Would Happen?” Vishing Audio Script

Place the finished files in:

`public/audio/vishing/what-would-happen/`

There are 42 clips in total:

- 6 caller prompts
- 18 player/employee responses
- 18 caller replies

Use one consistent voice for every `caller` clip and a different consistent voice for every `player` clip. Record only the words inside quotation marks.

## Stage 1 — Suspicious transfer alert

### Caller prompt

**Filename:** `wwh_s01_caller_prompt.mp3`

> “Hi, this is Mia from Harbour Bank security. We’ve got a $2,400 transfer sitting on the company account, and I just need to check I’m speaking with the authorised cardholder.”

### Safe branch

**Player — `wwh_s01_player_safe.mp3`**

> “Hmm, I’m gonna hang up and check the banking app myself.”

**Caller reply — `wwh_s01_caller_reply_safe.mp3`**

> “You can, but if you disconnect now the transfer might go through before you reach anyone.”

### Risky branch

**Player — `wwh_s01_player_risky.mp3`**

> “Yeah, I manage the card. What do you need from me?”

**Caller reply — `wwh_s01_caller_reply_risky.mp3`**

> “Great, thanks. Just grab the card and read me the number so I can open the fraud case.”

### Uncertain branch

**Player — `wwh_s01_player_uncertain.mp3`**

> “Wait, what transfer? How come it needs me to approve anything?”

**Caller reply — `wwh_s01_caller_reply_uncertain.mp3`**

> “I understand it’s confusing, but the cancellation window is already counting down.”

## Stage 2 — Card details request

### Caller prompt

**Filename:** `wwh_s02_caller_prompt.mp3`

> “The payment’s marked as urgent. I only need the company card number to pull up the right account and block it for you.”

### Safe branch

**Player — `wwh_s02_player_safe.mp3`**

> “Nah, I’m not giving card details on an incoming call, mate. I’ll ring the bank myself.”

**Caller reply — `wwh_s02_caller_reply_safe.mp3`**

> “That’s your choice, but the normal number may put you in a queue while the transfer completes.”

### Risky branch

**Player — `wwh_s02_player_risky.mp3`**

> “OK, I’ve got the card here. I’ll read the number out now.”

**Caller reply — `wwh_s02_caller_reply_risky.mp3`**

> “Perfect, that matches. Next, I’ll need the security code to approve the cancellation.”

### Uncertain branch

**Player — `wwh_s02_player_uncertain.mp3`**

> “I mean, I can give you the last four digits. Is that enough?”

**Caller reply — `wwh_s02_caller_reply_uncertain.mp3`**

> “The full number would be quicker, but yes, the last four might let me get started.”

## Stage 3 — Security code request

### Caller prompt

**Filename:** `wwh_s03_caller_prompt.mp3`

> “You should have a six-digit security code on the finance phone now. Read that out and I can reverse the payment straight away.”

### Safe branch

**Player — `wwh_s03_player_safe.mp3`**

> “What? No, those codes are private. I’m ending this call and reporting it.”

**Caller reply — `wwh_s03_caller_reply_safe.mp3`**

> “Please don’t hang up—the transfer is about to leave and a report won’t stop it in time.”

### Risky branch

**Player — `wwh_s03_player_risky.mp3`**

> “Right, the code is 418920. Can you cancel it now?”

**Caller reply — `wwh_s03_caller_reply_risky.mp3`**

> “Got it. I’m processing that, but the account needs one more security check.”

### Uncertain branch

**Player — `wwh_s03_player_uncertain.mp3`**

> “Well, I got the code, but how do I know you actually work for the bank?”

**Caller reply — `wwh_s03_caller_reply_uncertain.mp3`**

> “Fair question. My staff reference is HB-7714, but that code will expire while we keep checking.”

## Stage 4 — Banking-app approval

### Caller prompt

**Filename:** `wwh_s04_caller_prompt.mp3`

> “Your banking app should be showing an approval request now. Tap Approve and I can attach the cancellation to your account.”

### Safe branch

**Player — `wwh_s04_player_safe.mp3`**

> “Nope, I didn’t start that. I’m denying it and calling the bank through the app.”

**Caller reply — `wwh_s04_caller_reply_safe.mp3`**

> “If you deny it, you could remove the protection I’ve already placed on the transfer.”

### Risky branch

**Player — `wwh_s04_player_risky.mp3`**

> “OK, I see the prompt. I’ve approved it—what now?”

**Caller reply — `wwh_s04_caller_reply_risky.mp3`**

> “Thanks, approval received. Keep the app open while I secure the online account.”

### Uncertain branch

**Player — `wwh_s04_player_uncertain.mp3`**

> “OK, but like, what does that approval actually give you?”

**Caller reply — `wwh_s04_caller_reply_uncertain.mp3`**

> “It only connects the cancellation, but it expires soon, so I need you to decide now.”

## Stage 5 — Remote-support software

### Caller prompt

**Filename:** `wwh_s05_caller_prompt.mp3`

> “I’m still seeing another device interfering with the account. I’ll send you our support tool—install it and I can remove the device remotely.”

### Safe branch

**Player — `wwh_s05_player_safe.mp3`**

> “Yeah, no. I’m not installing anything from some random call. Our security team can handle it.”

**Caller reply — `wwh_s05_caller_reply_safe.mp3`**

> “I’m trying to help, but your team may not even see the transfer until tomorrow’s reconciliation.”

### Risky branch

**Player — `wwh_s05_player_risky.mp3`**

> “Righto, send the link and just talk me through what I need to press.”

**Caller reply — `wwh_s05_caller_reply_risky.mp3`**

> “It’s on the way. When it opens, allow every permission so the secure session works.”

### Uncertain branch

**Player — `wwh_s05_player_uncertain.mp3`**

> “Can’t I just search for the support app myself instead of using your link?”

**Caller reply — `wwh_s05_caller_reply_uncertain.mp3`**

> “Not for this case. Only the version in my message connects to the fraud record.”

## Stage 6 — Final pressure

### Caller prompt

**Filename:** `wwh_s06_caller_prompt.mp3`

> “This is the last chance to stop the transfer. I need you to stay with me and finish the security process now.”

### Safe branch

**Player — `wwh_s06_player_safe.mp3`**

> “No, I’m done. I’m hanging up, locking the account properly, and reporting this call.”

**Outcome narration — `wwh_s06_caller_reply_safe.mp3`**

> “The caller disconnects once the employee refuses to continue through the unverified process.”

### Risky branch

**Player — `wwh_s06_player_risky.mp3`**

> “OK, fine. Just tell me what else you need and let’s finish this.”

**Outcome narration — `wwh_s06_caller_reply_risky.mp3`**

> “The caller continues using the information and access gathered during the conversation.”

### Uncertain branch

**Player — `wwh_s06_player_uncertain.mp3`**

> “I don’t know… give me another minute. I’m still not sure about this.”

**Outcome narration — `wwh_s06_caller_reply_uncertain.mp3`**

> “The caller stays on the line and keeps applying pressure while the account remains at risk.”

## Recording checklist

- Keep the caller voice consistent across all caller prompt and caller reply files.
- Keep the player voice consistent across all player files.
- Use a natural Australian or neutral English delivery.
- Record the caller as calm, helpful and increasingly urgent—not cartoonishly evil.
- Record the player informally and naturally, including the hesitation already written into the lines.
- Do not read the filenames, headings or quotation marks aloud.
- Export every clip as MP3 using its exact filename.
- Leave only a short amount of silence at the beginning and end of each recording.
- Avoid background music because the application already manages its own music and volume.

The three final `s06_caller_reply` clips are outcome narration in the current code rather than words spoken directly by the caller. They can use a neutral narrator voice, or the lines can be rewritten as direct caller dialogue before recording.
