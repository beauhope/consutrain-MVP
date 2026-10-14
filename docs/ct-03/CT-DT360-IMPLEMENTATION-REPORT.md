# CT-03 — CT-DT360 Website & Public Guide Implementation Report

**Status:** Review branch only — not published to production  
**Branch:** `ct-03/ct-dt360-course-guide`  
**Date:** 14 October 2026

## 1. Source-of-truth review

Implementation was checked against the current CT-DT360 production bundle and the approved instructional design.

Verified current bundle state:
- EDU-001 v1.0 and EDU-002 v1.0 are approved instructional references.
- MOD-001 through MOD-014 are present as v1.0.
- SLD-M01 through SLD-M14 are present as v1.0, together with SLD-001.
- TMP-001 through TMP-008, TRN-001, LRN-001 and ASM-001 are present.
- REG-001 v4.4 records G3 as production-complete.
- G4 pilot testing and G5 final release approval remain open.

Public copy therefore describes the approved program design and available training materials without claiming that the operational pilot or final launch gate has already been completed.

## 2. Website changes

### New professional course page
- `courses/ct-dt360.html`
- True Arabic RTL document.
- Uses the existing shared ConsuTrain CSS and page components.
- Includes Course + Breadcrumb structured data.
- Includes canonical and Arabic/x-default hreflang metadata.
- Does not classify CT-DT360 as a free or self-paced course.
- No price, delivery date or external accreditation claim was added.

### Professional catalogue
- `courses/index.html`
- Added CT-DT360 card under professional courses.
- Course catalogue count updated from 11 to 12.
- Card communicates program name, 72-hour scope, advanced level and professional focus.

### Quote request mapping
- `quote-request.html`
- Added `ct-dt360` to the existing request-item mapping.

### Internal indexing
- `assets/data/platform-guide.json`
- Added CT-DT360 under “الدورات والورش المهنية”.
- Existing platform-guide PDF automation remains unchanged. Its current workflow is designed to regenerate the general platform PDFs after a data change reaches `main`.

### Sitemap
- `sitemap.xml`
- Added `https://consutrain.com/courses/ct-dt360.html`.

No shared header/footer/CSS architecture was changed.

## 3. CT-DT360 public PDF guide

### Stable public path
- `assets/course-guides/ct-dt360-ar.pdf`

### Reproducible sources
- `assets/data/ct-dt360-course-guide.json`
- `scripts/generate_ct_dt360_course_guide.py`
- `assets/data/ct-dt360-course-guide-manifest.json`
- `.github/workflows/update-ct-dt360-guide-pdf.yml`

The PDF generator reads the official ConsuTrain logo and Cairo fonts from the repository and the approved contact values from `assets/data/platform-contact.json`.

The guide is 15 A4 pages and contains:
- cover and program identity;
- program value and profile;
- target audience and prerequisites;
- learning outcomes;
- 70/30 instructional methodology note;
- six phases and 14 modules;
- applications and simulations;
- 14-hour capstone;
- participant vs internal training materials;
- delivery modes and technical requirements;
- assessment and completion/certificate governance;
- professional capability outcomes;
- organizational customization;
- contact page with clickable links and QR codes.

## 4. Storage decision

The repository already stores public PDF assets and contains a controlled PDF-generation workflow for the general ConsuTrain guide. CT-DT360 therefore follows the same repository-based pattern.

**Decision:** keep `assets/course-guides/ct-dt360-ar.pdf` in GitHub with a stable path.

Cloudflare R2 was not introduced because it would add an architectural layer without a current requirement for large-volume binary storage, access control or download-scale separation.

## 5. QA results

Automated checks passed:
- HTML language/direction: Arabic + RTL.
- Canonical URL present.
- Course structured data present.
- 14 module cards present.
- PDF, quote-request and WhatsApp CTAs present.
- No free/self-paced classification.
- JSON module count = 14.
- Sum of module hours = 72.
- Sum of phase hours = 72.
- Capstone = 14 hours inside the 72.
- Catalogue card present and catalogue count updated.
- Quote-request mapping present.
- Sitemap entry present.
- Platform-guide index entry present.
- PDF manifest produced successfully.
- Module-table subtotals corrected to 32 hours (01–07) and 40 hours (08–14).
- Certificate wording states that graduation/certificate conditions are finalized before official launch.

PDF workflow result:
- GitHub Actions run completed successfully.
- Generated PDF SHA-256: `a65c7ad97957fbaddc94df60438e8e10d9c748818bf32e0d1dc5d77f7a4a0d30`.

Local visual QA also rendered the 15-page layout page-by-page before the branch workflow was finalized.

## 6. Governance / release note

The current production bundle states that G3 is complete while G4 (pilot) and G5 (final training-release approval) remain open. Therefore:
- the public material does not announce a fixed cohort date or price;
- assessment/pass/attendance conditions are explicitly presented as an instructional framework subject to final certificate-policy approval;
- no external professional accreditation is claimed;
- trainer-only materials, answer keys and controlled production files are not exposed publicly.

## 7. Review status

All changes remain on the review branch. No direct production publication has been performed.

A Pull Request should be reviewed before merge. After an approved merge to `main`, the existing platform-guide workflow will regenerate the general ConsuTrain guide PDF because `assets/data/platform-guide.json` has changed.
