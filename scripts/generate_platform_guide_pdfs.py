#!/usr/bin/env python3
"""Generate the latest Arabic and French ConsuTrain platform guide PDFs.

Source of truth:
- assets/data/platform-guide.json
- assets/data/fr-platform-guide.json

The script overwrites stable PDF filenames so old links remain compatible.
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import html
import json
import os
from pathlib import Path
from typing import Any

from playwright.sync_api import sync_playwright


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def esc(value: Any) -> str:
    return html.escape(str(value or ""), quote=True)


def build_document(data: dict[str, Any], lang: str, repo_root: Path) -> str:
    is_ar = lang == "ar"
    direction = "rtl" if is_ar else "ltr"
    locale = "ar" if is_ar else "fr"
    meta = data.get("meta", {})
    sections = data.get("sections", [])
    item_total = sum(len(section.get("items", [])) for section in sections)

    logo_path = repo_root / "assets/images/consutrain-logo-horizontal.png"
    logo_uri = logo_path.resolve().as_uri() if logo_path.exists() else ""

    font_regular = repo_root / "assets/fonts/Cairo-Regular.ttf"
    font_bold = repo_root / "assets/fonts/Cairo-Bold.ttf"
    font_css = ""
    if font_regular.exists() and font_bold.exists():
        font_css = f"""
        @font-face {{ font-family: 'CairoPDF'; src: url('{font_regular.resolve().as_uri()}'); font-weight: 400; }}
        @font-face {{ font-family: 'CairoPDF'; src: url('{font_bold.resolve().as_uri()}'); font-weight: 700; }}
        """

    labels = {
        "ar": {
            "guide": "الدليل المتجدد للخدمات والتعلّم والموارد",
            "updated": "آخر تحديث",
            "sections": "الأقسام",
            "items": "العناصر المتاحة",
            "contents": "محتويات الدليل",
            "visit": "للحصول على الروابط التفاعلية وآخر الإضافات، زر الصفحة الحية للدليل على الموقع.",
            "closing": "تعلّم - طبّق - طوّر - واطلب الدعم المخصص عند الحاجة",
            "site": "consutrain.com/consutrain-guide.html",
        },
        "fr": {
            "guide": "Guide actualisé des services, formations et ressources",
            "updated": "Dernière mise à jour",
            "sections": "Rubriques",
            "items": "Éléments disponibles",
            "contents": "Sommaire du guide",
            "visit": "Pour accéder aux liens interactifs et aux nouveautés, consultez la page vivante du guide sur le site.",
            "closing": "Apprendre - appliquer - progresser - demander un accompagnement sur mesure",
            "site": "consutrain.com/fr/consutrain-guide.html",
        },
    }[lang]

    toc = "".join(
        f"<li><span>{i:02d}</span><strong>{esc(s.get('title'))}</strong><em>{len(s.get('items', []))}</em></li>"
        for i, s in enumerate(sections, 1)
    )

    section_html = []
    for index, section in enumerate(sections, 1):
        cards = []
        for item in section.get("items", []):
            tags = "".join(f"<span>{esc(tag)}</span>" for tag in item.get("tags", [])[:4])
            cards.append(f"""
              <article class="item-card">
                <div class="item-top">
                  <span class="badge">{esc(item.get('badge'))}</span>
                </div>
                <h3>{esc(item.get('title'))}</h3>
                <p>{esc(item.get('description'))}</p>
                <div class="tags">{tags}</div>
              </article>
            """)
        section_html.append(f"""
          <section class="guide-section">
            <header class="section-head">
              <span class="section-number">{index:02d}</span>
              <div>
                <small>{esc(section.get('eyebrow'))}</small>
                <h2>{esc(section.get('title'))}</h2>
                <p>{esc(section.get('description'))}</p>
              </div>
            </header>
            <div class="items-grid">{''.join(cards)}</div>
          </section>
        """)

    logo = f'<img class="logo" src="{logo_uri}" alt="ConsuTrain">' if logo_uri else '<div class="text-logo">Consu<span>Train</span></div>'

    return f"""<!doctype html>
<html lang="{locale}" dir="{direction}">
<head>
<meta charset="utf-8">
<style>
{font_css}
@page {{ size: A4; margin: 15mm 13mm 18mm; }}
* {{ box-sizing: border-box; }}
html {{ background: #fff; }}
body {{ margin: 0; font-family: 'CairoPDF', 'DejaVu Sans', Arial, sans-serif; color: #172033; direction: {direction}; text-align: {'right' if is_ar else 'left'}; font-size: 10.5pt; line-height: 1.65; }}
h1,h2,h3,p {{ margin-top: 0; }}
.cover {{ min-height: 255mm; display: flex; flex-direction: column; justify-content: space-between; padding: 12mm 8mm; border: 1px solid #dfe5ee; border-radius: 8mm; background: radial-gradient(circle at top {'left' if is_ar else 'right'}, rgba(212,166,58,.22), transparent 28%), linear-gradient(145deg,#f7faff,#fff 60%,#fbf5e5); page-break-after: always; }}
.logo {{ width: 66mm; max-height: 20mm; object-fit: contain; object-position: {'right' if is_ar else 'left'} center; }}
.text-logo {{ font-size: 28pt; font-weight: 700; color:#0f2747; }} .text-logo span{{color:#d4a63a}}
.cover-kicker {{ color:#b48218; font-weight:700; margin-top:18mm; }}
.cover h1 {{ color:#0f2747; font-size: 29pt; line-height:1.35; margin-bottom:7mm; }}
.cover-desc {{ color:#5f6b7c; font-size:13pt; max-width:165mm; }}
.cover-stats {{ display:grid; grid-template-columns:repeat(3,1fr); gap:5mm; margin-top:12mm; }}
.cover-stats div {{ border-radius:5mm; padding:6mm 4mm; background:#0f2747; color:#fff; text-align:center; }}
.cover-stats strong {{ display:block; font-size:22pt; color:#d4a63a; }} .cover-stats span {{ font-size:9pt; }}
.cover-bottom {{ border-top:1px solid #dfe5ee; padding-top:6mm; display:flex; justify-content:space-between; gap:8mm; color:#5f6b7c; font-size:9.5pt; }}
.toc {{ page-break-after: always; }}
.page-title {{ color:#0f2747; font-size:22pt; border-bottom:3px solid #d4a63a; padding-bottom:4mm; margin-bottom:7mm; }}
.toc ol {{ list-style:none; padding:0; margin:0; display:grid; gap:3mm; }}
.toc li {{ display:grid; grid-template-columns:13mm 1fr 12mm; gap:4mm; align-items:center; padding:4mm 5mm; border:1px solid #e4e7ec; border-radius:4mm; background:#fafcff; }}
.toc li span {{ width:10mm; height:10mm; border-radius:3mm; display:grid; place-items:center; background:#0f2747; color:#fff; font-weight:700; }}
.toc li strong {{ color:#0f2747; }} .toc li em {{ color:#b48218; font-style:normal; font-weight:700; text-align:center; }}
.guide-section {{ page-break-before: always; }}
.section-head {{ display:grid; grid-template-columns:18mm 1fr; gap:5mm; align-items:start; margin-bottom:7mm; padding:6mm; border-radius:5mm; background:linear-gradient(135deg,#0f2747,#173d69); color:#fff; }}
.section-number {{ display:grid; place-items:center; width:15mm; height:15mm; border-radius:4mm; background:#d4a63a; color:#0f2747; font-weight:700; font-size:14pt; }}
.section-head small {{ color:#f1d893; font-weight:700; }} .section-head h2 {{ color:#fff; font-size:20pt; margin:1mm 0 2mm; line-height:1.35; }} .section-head p {{ color:rgba(255,255,255,.84); margin:0; }}
.items-grid {{ display:grid; grid-template-columns:1fr 1fr; gap:5mm; }}
.item-card {{ break-inside:avoid; border:1px solid #dfe5ee; border-radius:5mm; padding:5mm; min-height:47mm; background:#fff; box-shadow:0 2mm 6mm rgba(15,39,71,.05); }}
.item-top {{ min-height:7mm; }}
.badge {{ display:inline-block; background:#f5ead0; color:#0f2747; border-radius:99px; padding:1.3mm 3mm; font-size:8pt; font-weight:700; }}
.item-card h3 {{ color:#0f2747; font-size:13pt; line-height:1.45; margin:3mm 0 2mm; }}
.item-card p {{ color:#5f6b7c; font-size:9.2pt; margin-bottom:3mm; }}
.tags {{ display:flex; flex-wrap:wrap; gap:1.5mm; }} .tags span {{ background:#f2f5f9; color:#526174; border-radius:99px; padding:1mm 2.2mm; font-size:7.5pt; }}
.final-page {{ page-break-before:always; min-height:240mm; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; border-radius:8mm; padding:18mm; background:linear-gradient(145deg,#0f2747,#1c4b7d); color:#fff; }}
.final-page h2 {{ font-size:25pt; color:#fff; max-width:165mm; }} .final-page p {{ color:rgba(255,255,255,.85); font-size:12pt; max-width:155mm; }}
.final-url {{ margin-top:9mm; padding:4mm 7mm; border-radius:99px; background:#d4a63a; color:#0f2747; font-weight:700; direction:ltr; }}
</style>
</head>
<body>
<section class="cover">
  <div>
    {logo}
    <div class="cover-kicker">{esc(labels['guide'])}</div>
    <h1>{esc(meta.get('title'))}</h1>
    <p class="cover-desc">{esc(meta.get('description'))}</p>
    <div class="cover-stats">
      <div><strong>{len(sections)}</strong><span>{esc(labels['sections'])}</span></div>
      <div><strong>{item_total}</strong><span>{esc(labels['items'])}</span></div>
      <div><strong>4</strong><span>{'دورات مجانية مع شهادة' if is_ar else 'formations gratuites avec certificat'}</span></div>
    </div>
  </div>
  <div class="cover-bottom"><span>{esc(labels['updated'])}: {esc(meta.get('lastUpdated'))}</span><span>ConsuTrain</span></div>
</section>
<section class="toc">
  <h2 class="page-title">{esc(labels['contents'])}</h2>
  <ol>{toc}</ol>
</section>
{''.join(section_html)}
<section class="final-page">
  <h2>{esc(labels['closing'])}</h2>
  <p>{esc(labels['visit'])}</p>
  <div class="final-url">{esc(labels['site'])}</div>
</section>
</body></html>"""


def render_pdf(html_content: str, output_path: Path, lang: str) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser_path = os.environ.get("PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH")
        launch_args = {"headless": True}
        if browser_path:
            launch_args["executable_path"] = browser_path
        browser = p.chromium.launch(**launch_args)
        page = browser.new_page()
        page.set_content(html_content, wait_until="load")
        page.emulate_media(media="print")
        page.pdf(
            path=str(output_path),
            format="A4",
            print_background=True,
            prefer_css_page_size=True,
            display_header_footer=True,
            header_template="<div></div>",
            footer_template=(
                "<div style='width:100%;font-size:8px;color:#7b8797;padding:0 13mm;"
                "display:flex;justify-content:space-between;font-family:Arial,sans-serif;'>"
                "<span>ConsuTrain</span><span><span class='pageNumber'></span> / <span class='totalPages'></span></span></div>"
            ),
            margin={"top": "15mm", "right": "13mm", "bottom": "18mm", "left": "13mm"},
        )
        browser.close()


def calculate_source_hash(root: Path, data_paths: list[Path]) -> str:
    digest = hashlib.sha256()
    tracked = [
        *data_paths,
        Path(__file__).resolve(),
        root / "assets/images/consutrain-logo-horizontal.png",
        root / "assets/fonts/Cairo-Regular.ttf",
        root / "assets/fonts/Cairo-Bold.ttf",
    ]
    for path in tracked:
        digest.update(str(path.relative_to(root) if path.is_relative_to(root) else path.name).encode("utf-8"))
        if path.exists():
            digest.update(path.read_bytes())
    return digest.hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".", help="Repository root")
    parser.add_argument("--force", action="store_true", help="Regenerate even when the source hash is unchanged")
    args = parser.parse_args()
    root = Path(args.root).resolve()

    jobs = [
        ("ar", root / "assets/data/platform-guide.json"),
        ("fr", root / "assets/data/fr-platform-guide.json"),
    ]
    data_paths = [path for _, path in jobs]
    manifest_path = root / "assets/data/platform-guide-pdf-manifest.json"
    source_hash = calculate_source_hash(root, data_paths)

    existing_manifest = {}
    if manifest_path.exists():
        try:
            existing_manifest = load_json(manifest_path)
        except (OSError, json.JSONDecodeError):
            existing_manifest = {}

    expected_outputs = []
    loaded_jobs = []
    for lang, data_path in jobs:
        data = load_json(data_path)
        pdf_meta = data.get("meta", {}).get("pdf", {})
        pdf_url = pdf_meta.get("url")
        if not pdf_url:
            raise ValueError(f"Missing meta.pdf.url in {data_path}")
        output = root / pdf_url
        expected_outputs.append(output)
        loaded_jobs.append((lang, data, output, pdf_meta))

    if (
        not args.force
        and existing_manifest.get("sourceHash") == source_hash
        and all(path.exists() and path.stat().st_size > 0 for path in expected_outputs)
    ):
        print("Platform guide PDFs are already up to date.")
        return 0

    manifest = {
        "sourceHash": source_hash,
        "updatedAt": dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat(),
    }

    for lang, data, output, pdf_meta in loaded_jobs:
        document = build_document(data, lang, root)
        render_pdf(document, output, lang)
        pdf_hash = hashlib.sha256(output.read_bytes()).hexdigest()
        manifest[lang] = {
            "url": str(output.relative_to(root)).replace("\\", "/"),
            "version": source_hash[:16],
            "fileHash": pdf_hash,
            "downloadName": (
                "ConsuTrain_Profile_AR_Latest.pdf"
                if lang == "ar"
                else "ConsuTrain_Profile_FR_Latest.pdf"
            ),
        }
        print(f"Generated {output.relative_to(root)}")

    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Updated {manifest_path.relative_to(root)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
