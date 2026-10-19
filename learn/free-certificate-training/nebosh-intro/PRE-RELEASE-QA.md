# CT-03 — NEBOSH introductory course — pre-release QA
Scope: draft PR #16. Governing SOP: Courses & Certificates SOP v1.5 AR (2026-10-18), chapters 32-34.

CURRENT VERIFIED DEVELOPMENT
- Free-course route: learn/free-certificate-training/nebosh-intro/index.html
- Final assessment route: learn/free-certificate-training/nebosh-intro/final-assessment.html
- Certificate request route: learn/free-certificate-training/nebosh-intro/certificate-request.html
- JS: assets/js/free-certificate-training-nebosh-intro.js (certificate submission disabled).
- Registry entry: Training_Registry A10:G10, trainingId nebosh-intro, isActive FALSE.
- Answer key: training-answer-keys A7:F7, 20 questions, passThreshold 14, isActive FALSE.
- Website main unchanged; no verified online Cloudflare Pages branch Preview URL.

FRONTEND ACCEPTANCE CHECKS
- Arabic layout RTL; header/footer and CSS load; diagrams render on mobile and desktop.
- Course links navigate to final-assessment and certificate-request correctly.
- Practice score uses no certificate entitlement. A preview score must never trigger requests.
- Test all training form input and error states with dummy data and network interception.
- Check keyboard navigation, readable labels, focus, heading hierarchy and link targets.

SERVER/REGISTRY ACCEPTANCE CHECKS (AFTER EXPLICIT LAUNCH PREP)
- Keep registry and key inactive during development.
- Freeze fixed q1..q20 exam with matching option letters; compare against answerKeyJson.
- Use existing Google Apps Script endpoint and form_type certificate_submission; do not operate n8n.
- Validate accepted/issued/duplicate/assessment_failed and failed academic retry status.
- Confirm trusted backend ignores forged client score and recomputes from answersJson.
- Verify one PDF and one delivery queue item; Valid public verification; no duplicate issuance.
- Avoid treating Resend Accepted as Delivered. Compare delivery records before retry.
- End-to-end QA must use approved test identity and must not affect historic certificates.

DEPLOYMENT/PREVIEW
- GitHub source branch is NOT a published preview website.
- Do not invent a pages.dev URL. Confirm Cloudflare Pages branch deployment if present.
- If Cloudflare branch preview is unavailable, use local browser via static web server or configure a non-production preview deployment before publishing.
- No merge until training content, UX, assessment and certificate pipeline pass acceptance and owner review.

OPEN WORK
- Import full 60-question bank (currently an external validated web JSON artifact) into GitHub.
- Expand full teaching content and add topic-specific illustrative photographs when licensing/asset source is resolved.
- Formal course test must use existing centralized certificate pipeline, not the randomized training preview.
- Verify accessibility and performance in-browser on an actual deployed preview.