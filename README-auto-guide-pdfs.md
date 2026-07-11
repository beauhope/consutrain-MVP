# Automatic latest platform guide PDFs

This package makes every Arabic and French guide download or preview resolve to the latest published PDF.

## Source of truth

- `assets/data/platform-guide.json`
- `assets/data/fr-platform-guide.json`

When a service, course, certificate training, tool, resource, or learning path changes, update the relevant JSON file.

## Automatic generation

The workflow `.github/workflows/update-platform-guide-pdfs.yml` runs after a guide-data, generator, logo, or PDF-font update. It:

1. installs Playwright and Chromium;
2. generates the Arabic and French PDFs;
3. creates `assets/data/platform-guide-pdf-manifest.json` with a source hash and current PDF versions;
4. commits only the two PDFs and the manifest when they changed.

Stable PDF filenames remain compatible with old links:

- `resources/downloads/profile/ConsuTrain_Profile_and_Services_AR.pdf`
- `resources/downloads/profile/ConsuTrain_Profile_and_Services_FR.pdf`

## Always-latest links

The website buttons point to resolver pages:

- `resources/downloads/profile/latest-ar.html`
- `resources/downloads/profile/latest-fr.html`

Each resolver fetches the manifest using `cache: no-store`, adds the current version hash to the PDF URL, then opens or downloads that version. The service worker also treats the profile PDFs and resolver pages as network-first assets and does not precache the PDFs.

## Manual regeneration

```bash
python -m pip install playwright
python -m playwright install chromium
python scripts/generate_platform_guide_pdfs.py --root .
```

Use `--force` only when you need to rebuild despite an unchanged source hash.
