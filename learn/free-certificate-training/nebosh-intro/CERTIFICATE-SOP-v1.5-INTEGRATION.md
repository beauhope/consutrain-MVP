# CT-03 | NEBOSH introductory training | certificate integration
Status: DEVELOPMENT ONLY - SOP v1.5 (18 October 2026).

Authoritative source: ConsuTrain Courses & Certificates SOP v1.5 AR, sections 32-34. Older n8n and Cloud Buffer proposals are superseded.
Live path: AR/FR training page -> Google Apps Script cloud -> certificate-submissions -> server-side answer-key validation -> Cloudflare PDF -> private Drive -> Certificate_Verifications -> Certificate_Delivery_Queue -> Resend SMTP.
Cloud triggers: ctAutoRunNewSubmissionsV1 and ctDeliveryProcessNextV1 each every five minutes. Do not operate local n8n as a parallel certificate issuer.

PROPOSED COURSE METADATA
trainingId=nebosh-intro; language=ar; trainingTitle=مدخل إلى الصحة والسلامة المهنية والاستعداد لدراسة النيبوش; trainingCategory=occupational_health_safety; learningType=free_training; certificateType=free_test; isActive=FALSE until final go-live.

EXAM COMPATIBILITY
Existing backend uses a fixed answerKeyJson for 20 numbered questions and passThreshold 14. Use a fixed approved 20-question certificate exam with exactly matching answer IDs and option letters. Retain 60-question bank for practice unless versioned dynamic sets are supported and verified on server. Browser score is never authoritative.

APPROVED REUSE
Use the current certificate-request HTML, free-certificate-training-brand-cx.js cloud submission wrapper and backend statuses. Request includes fullName, email, normalized certificateKey, distinct submissionId per attempt, trainingId, answersJson, legalAcknowledgment, optional marketingConsent, and required metadata. The deployed Apps Script recalculates results and stores them. Handle accepted / issued / duplicate / assessment_failed / configuration_error and pending-retry behavior in same way as older courses.

RELEASE GATES
1. Integrate actual Arabic course and a fixed 20-question form using existing reusable components.
2. Configure Training_Registry and training-answer-keys in inactive/staging state; do not send live requests during construction.
3. Test backend pass 14/20, fail 13/20, tampered score and conflicting submissions.
4. Verify one issued certificate and one message only, Valid public verification, private Drive file, Resend Accepted separately from Delivered.
5. Regression-check existing Arabic/French training pages and never alter historical records.
6. Obtain owner approval prior to live production launch and enablement.

DISCLAIMERS
ConsuTrain free certificate is a course completion certificate, not an official NEBOSH qualification or endorsement. NEBOSH logo must not be used.

OPEN ISSUE
SOP v1.5 notes certificate-submissions.emailStatus can remain Pending after Certificate_Delivery_Queue Accepted. This does not justify re-sending; resolve carefully using the existing delivery lifecycle.

NO production Sheet writes, Apps Script changes, secret exposure, trigger edits or main merge in this task.