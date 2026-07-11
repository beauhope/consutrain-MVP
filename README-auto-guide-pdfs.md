# Automatic latest platform guide PDFs

The Arabic and French platform guides are generated automatically as branded, marketing-ready PDFs.

## Sources of truth

- `assets/data/platform-guide.json`
- `assets/data/fr-platform-guide.json`
- `assets/data/platform-contact.json`

The contact file centralizes the website, WhatsApp number, email, guide pages and request links. Updating it refreshes both PDFs on the next workflow run.

## Marketing features generated automatically

- ConsuTrain logo in the header of every page;
- website, WhatsApp number and pagination in every footer;
- clickable links on course, service, tool and resource cards;
- a conversion block after every main section;
- a final contact page with website, WhatsApp, email and service-request links;
- QR codes for the latest live guide and WhatsApp;
- Arabic and French wording adapted to each audience.

## Automatic generation

The workflow `.github/workflows/update-platform-guide-pdfs.yml` runs whenever guide content, contact data, the generator, logo or PDF fonts change. It installs Playwright, Chromium and `qrcode`, generates both PDFs, updates the manifest and commits only the generated PDFs and manifest when needed.

Stable filenames remain compatible with all existing links:

- `resources/downloads/profile/ConsuTrain_Profile_and_Services_AR.pdf`
- `resources/downloads/profile/ConsuTrain_Profile_and_Services_FR.pdf`

## Manual regeneration

```bash
python -m pip install playwright "qrcode[pil]"
python -m playwright install chromium
python scripts/generate_platform_guide_pdfs.py --root . --force
```
