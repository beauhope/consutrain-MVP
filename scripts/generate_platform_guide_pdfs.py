#!/usr/bin/env python3
"""Generate branded, marketing-ready Arabic and French ConsuTrain guide PDFs.

Sources of truth:
- assets/data/platform-guide.json
- assets/data/fr-platform-guide.json
- assets/data/platform-contact.json

Stable PDF filenames are overwritten so existing links always resolve to the
latest published edition.
"""
from __future__ import annotations

import argparse
import base64
import datetime as dt
import hashlib
import html
import io
import json
import os
from pathlib import Path
from typing import Any
from urllib.parse import urljoin

import qrcode
from playwright.sync_api import sync_playwright


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def esc(value: Any) -> str:
    return html.escape(str(value or ""), quote=True)


def file_data_uri(path: Path) -> str:
    if not path.exists():
        return ""
    suffix = path.suffix.lower()
    mime = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".svg": "image/svg+xml",
    }.get(suffix, "application/octet-stream")
    payload = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{payload}"


def qr_data_uri(value: str) -> str:
    qr = qrcode.QRCode(version=None, box_size=7, border=2)
    qr.add_data(value)
    qr.make(fit=True)
    image = qr.make_image(fill_color="#0f2747", back_color="white").convert("RGB")
    buffer = io.BytesIO()
    image.save(buffer, format="PNG", optimize=True)
    payload = base64.b64encode(buffer.getvalue()).decode("ascii")
    return f"data:image/png;base64,{payload}"


def absolute_site_url(contact: dict[str, Any], value: str) -> str:
    if not value:
        return contact["website"]["url"]
    if value.startswith(("http://", "https://", "mailto:", "tel:")):
        return value
    return urljoin(contact["website"]["url"].rstrip("/") + "/", value.lstrip("/"))


def build_document(
    data: dict[str, Any],
    contact: dict[str, Any],
    lang: str,
    repo_root: Path,
) -> tuple[str, str, str]:
    is_ar = lang == "ar"
    direction = "rtl" if is_ar else "ltr"
    locale = "ar" if is_ar else "fr"
    align = "right" if is_ar else "left"
    meta = data.get("meta", {})
    sections = data.get("sections", [])
    item_total = sum(len(section.get("items", [])) for section in sections)

    preferred_logo = (
        repo_root / "assets/images/consutrain-logo-horizontal.png"
        if is_ar
        else repo_root / "assets/images/consutrain-logo-horizontal-fr.png"
    )
    if not preferred_logo.exists():
        preferred_logo = repo_root / "assets/images/consutrain-logo-horizontal.png"
    logo_uri = file_data_uri(preferred_logo)

    font_regular = repo_root / "assets/fonts/Cairo-Regular.ttf"
    font_bold = repo_root / "assets/fonts/Cairo-Bold.ttf"
    font_css = ""
    if font_regular.exists() and font_bold.exists():
        font_css = f"""
        @font-face {{ font-family: 'CairoPDF'; src: url('{font_regular.resolve().as_uri()}'); font-weight: 400; }}
        @font-face {{ font-family: 'CairoPDF'; src: url('{font_bold.resolve().as_uri()}'); font-weight: 700; }}
        """

    guide_url = contact["guidePage"][lang]
    contact_url = contact["contactPage"][lang]
    quote_url = contact["quotePage"][lang]
    whatsapp_url = contact["whatsapp"]["url"]
    whatsapp_label = contact["whatsapp"]["label"]
    email_url = contact["email"]["url"]
    email_label = contact["email"]["label"]
    website_url = contact["website"]["url"]
    website_label = contact["website"]["label"]
    guide_qr = qr_data_uri(guide_url)
    whatsapp_qr = qr_data_uri(whatsapp_url)

    labels = {
        "ar": {
            "guide": "الدليل المتجدد للخدمات والتعلّم والموارد",
            "updated": "آخر تحديث",
            "sections": "الأقسام",
            "items": "العناصر المتاحة",
            "contents": "محتويات الدليل",
            "certificate": "دورات مجانية مع شهادة",
            "open": "فتح على الموقع",
            "section_cta_title": "تحتاج إلى تطبيق مخصص أو تدريب لفريقك؟",
            "section_cta_body": "تواصل مع ConsuTrain لتحديد الخدمة أو الدورة أو الورشة الأنسب، وبناء مخرج عملي يتوافق مع احتياجك.",
            "request": "اطلب خدمة أو تدريبًا مخصصًا",
            "whatsapp": "واتساب",
            "email": "البريد الإلكتروني",
            "visit": "زر الصفحة الحية للدليل للاطلاع على الروابط التفاعلية وآخر الخدمات والدورات والأدوات المضافة.",
            "closing": "حوّل احتياجك إلى خدمة أو برنامج عملي",
            "closing_body": "سواء كنت تحتاج إلى استشارة، خطة، نظام، ملف مهني، دورة متقدمة أو تدريب مخصص لفريقك، تساعدك ConsuTrain على تحديد المسار وبناء المخرجات المناسبة.",
            "contact_us": "تواصل معنا",
            "share": "شارك هذا الدليل",
            "share_body": "امسح الرمز لفتح أحدث نسخة من الدليل ومشاركتها مع من يمكنه الاستفادة.",
            "wa_qr": "تواصل مباشرة عبر واتساب",
            "save_share": "احتفظ بالدليل وشاركه مع زملائك والجهات المهتمة بالتطوير الإداري والتدريب المهني.",
            "site": "الموقع",
            "phone": "الهاتف وواتساب",
        },
        "fr": {
            "guide": "Guide actualisé des services, formations et ressources",
            "updated": "Dernière mise à jour",
            "sections": "Rubriques",
            "items": "Éléments disponibles",
            "contents": "Sommaire du guide",
            "certificate": "formations gratuites avec certificat",
            "open": "Ouvrir sur le site",
            "section_cta_title": "Besoin d’une application sur mesure ou d’une formation pour votre équipe ?",
            "section_cta_body": "Contactez ConsuTrain pour identifier le service, la formation ou l’atelier le plus adapté et construire un livrable utile à votre contexte.",
            "request": "Demander un service ou une formation",
            "whatsapp": "WhatsApp",
            "email": "E-mail",
            "visit": "Consultez la page vivante du guide pour accéder aux liens interactifs et aux dernières nouveautés de la plateforme.",
            "closing": "Transformez votre besoin en service ou programme concret",
            "closing_body": "Conseil, plan, système, document professionnel, formation avancée ou programme sur mesure : ConsuTrain vous aide à cadrer le besoin et à produire les livrables appropriés.",
            "contact_us": "Nous contacter",
            "share": "Partager ce guide",
            "share_body": "Scannez le code pour ouvrir la dernière version du guide et la partager avec votre réseau.",
            "wa_qr": "Contacter directement via WhatsApp",
            "save_share": "Conservez ce guide et partagez-le avec les professionnels et organisations intéressés par le management et la formation.",
            "site": "Site web",
            "phone": "Téléphone et WhatsApp",
        },
    }[lang]

    toc = "".join(
        f"<li><span>{i:02d}</span><strong>{esc(s.get('title'))}</strong><em>{len(s.get('items', []))}</em></li>"
        for i, s in enumerate(sections, 1)
    )

    section_html: list[str] = []
    for index, section in enumerate(sections, 1):
        cards: list[str] = []
        for item in section.get("items", []):
            tags = "".join(f"<span>{esc(tag)}</span>" for tag in item.get("tags", [])[:4])
            item_url = absolute_site_url(contact, str(item.get("url") or ""))
            cards.append(
                f"""
              <article class="item-card">
                <div class="item-top"><span class="badge">{esc(item.get('badge'))}</span></div>
                <h3>{esc(item.get('title'))}</h3>
                <p>{esc(item.get('description'))}</p>
                <div class="tags">{tags}</div>
                <a class="item-link" href="{esc(item_url)}">{esc(labels['open'])}</a>
              </article>
            """
            )
        footer_link = section.get("footerLink") or {}
        footer_url = absolute_site_url(contact, str(footer_link.get("url") or ""))
        section_html.append(
            f"""
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
            <aside class="section-cta">
              <div>
                <strong>{esc(labels['section_cta_title'])}</strong>
                <p>{esc(labels['section_cta_body'])}</p>
              </div>
              <div class="cta-links">
                <a class="cta-main" href="{esc(quote_url)}">{esc(labels['request'])}</a>
                <a href="{esc(whatsapp_url)}">{esc(labels['whatsapp'])}</a>
                <a href="{esc(email_url)}">{esc(labels['email'])}</a>
                {f'<a href="{esc(footer_url)}">{esc(footer_link.get("label"))}</a>' if footer_link else ''}
              </div>
            </aside>
          </section>
        """
        )

    logo = (
        f'<img class="logo" src="{logo_uri}" alt="ConsuTrain">'
        if logo_uri
        else '<div class="text-logo">Consu<span>Train</span></div>'
    )

    document = f"""<!doctype html>
<html lang="{locale}" dir="{direction}">
<head>
<meta charset="utf-8">
<style>
{font_css}
@page {{ size: A4; margin: 22mm 13mm 20mm; }}
* {{ box-sizing: border-box; }}
html {{ background: #fff; }}
body {{ margin: 0; font-family: 'CairoPDF', 'DejaVu Sans', Arial, sans-serif; color: #172033; direction: {direction}; text-align: {align}; font-size: 10.3pt; line-height: 1.65; }}
a {{ text-decoration: none; }}
h1,h2,h3,p {{ margin-top: 0; }}
.cover {{ min-height: 247mm; display: flex; flex-direction: column; justify-content: space-between; padding: 11mm 8mm; border: 1px solid #dfe5ee; border-radius: 8mm; background: radial-gradient(circle at top {'left' if is_ar else 'right'}, rgba(212,166,58,.22), transparent 28%), linear-gradient(145deg,#f7faff,#fff 60%,#fbf5e5); page-break-after: always; }}
.logo {{ width: 66mm; max-height: 20mm; object-fit: contain; object-position: {align} center; }}
.text-logo {{ font-size: 28pt; font-weight: 700; color:#0f2747; }} .text-logo span{{color:#d4a63a}}
.cover-kicker {{ color:#b48218; font-weight:700; margin-top:14mm; }}
.cover h1 {{ color:#0f2747; font-size: 28pt; line-height:1.35; margin-bottom:6mm; }}
.cover-desc {{ color:#5f6b7c; font-size:12.5pt; max-width:165mm; }}
.cover-stats {{ display:grid; grid-template-columns:repeat(3,1fr); gap:5mm; margin-top:10mm; }}
.cover-stats div {{ border-radius:5mm; padding:6mm 4mm; background:#0f2747; color:#fff; text-align:center; }}
.cover-stats strong {{ display:block; font-size:22pt; color:#d4a63a; }} .cover-stats span {{ font-size:8.8pt; }}
.cover-cta {{ margin-top:8mm; padding:5mm; border:1px solid rgba(15,39,71,.12); border-radius:5mm; background:rgba(255,255,255,.84); }}
.cover-cta strong {{ display:block; color:#0f2747; font-size:12pt; margin-bottom:2mm; }}
.cover-cta p {{ color:#5f6b7c; margin:0 0 3mm; }}
.cover-cta a {{ display:inline-block; margin-inline-end:2mm; padding:2mm 4mm; border-radius:99px; background:#d4a63a; color:#0f2747; font-weight:700; }}
.cover-bottom {{ border-top:1px solid #dfe5ee; padding-top:5mm; display:flex; justify-content:space-between; gap:8mm; color:#5f6b7c; font-size:9.2pt; }}
.toc {{ page-break-after: always; }}
.page-title {{ color:#0f2747; font-size:22pt; border-bottom:3px solid #d4a63a; padding-bottom:4mm; margin-bottom:7mm; }}
.toc ol {{ list-style:none; padding:0; margin:0; display:grid; gap:3mm; }}
.toc li {{ display:grid; grid-template-columns:13mm 1fr 12mm; gap:4mm; align-items:center; padding:4mm 5mm; border:1px solid #e4e7ec; border-radius:4mm; background:#fafcff; }}
.toc li span {{ width:10mm; height:10mm; border-radius:3mm; display:grid; place-items:center; background:#0f2747; color:#fff; font-weight:700; }}
.toc li strong {{ color:#0f2747; }} .toc li em {{ color:#b48218; font-style:normal; font-weight:700; text-align:center; }}
.guide-section {{ page-break-before: always; }}
.section-head {{ display:grid; grid-template-columns:18mm 1fr; gap:5mm; align-items:start; margin-bottom:7mm; padding:6mm; border-radius:5mm; background:linear-gradient(135deg,#0f2747,#173d69); color:#fff; }}
.section-number {{ display:grid; place-items:center; width:15mm; height:15mm; border-radius:4mm; background:#d4a63a; color:#0f2747; font-weight:700; font-size:14pt; }}
.section-head small {{ color:#f1d893; font-weight:700; }} .section-head h2 {{ color:#fff; font-size:19pt; margin:1mm 0 2mm; line-height:1.35; }} .section-head p {{ color:rgba(255,255,255,.84); margin:0; }}
.items-grid {{ display:grid; grid-template-columns:1fr 1fr; gap:5mm; }}
.item-card {{ break-inside:avoid; border:1px solid #dfe5ee; border-radius:5mm; padding:5mm; min-height:50mm; background:#fff; box-shadow:0 2mm 6mm rgba(15,39,71,.05); display:flex; flex-direction:column; }}
.item-top {{ min-height:7mm; }}
.badge {{ display:inline-block; background:#f5ead0; color:#0f2747; border-radius:99px; padding:1.3mm 3mm; font-size:8pt; font-weight:700; }}
.item-card h3 {{ color:#0f2747; font-size:12.5pt; line-height:1.45; margin:3mm 0 2mm; }}
.item-card p {{ color:#5f6b7c; font-size:9pt; margin-bottom:3mm; }}
.tags {{ display:flex; flex-wrap:wrap; gap:1.5mm; }} .tags span {{ background:#f2f5f9; color:#526174; border-radius:99px; padding:1mm 2.2mm; font-size:7.3pt; }}
.item-link {{ display:inline-block; width:max-content; margin-top:auto; padding-top:3mm; color:#0f2747; font-size:8.5pt; font-weight:700; border-bottom:1px solid #d4a63a; }}
.section-cta {{ break-inside:avoid; margin-top:7mm; padding:5mm; border-radius:5mm; background:linear-gradient(135deg,#f8fbff,#fbf4df); border:1px solid rgba(212,166,58,.35); display:grid; grid-template-columns:1.25fr .75fr; gap:5mm; align-items:center; }}
.section-cta strong {{ color:#0f2747; font-size:11.5pt; }} .section-cta p {{ margin:1mm 0 0; color:#5f6b7c; font-size:8.8pt; }}
.cta-links {{ display:flex; flex-wrap:wrap; gap:2mm; justify-content:{'flex-start' if is_ar else 'flex-end'}; }}
.cta-links a {{ padding:2mm 3mm; border-radius:99px; border:1px solid rgba(15,39,71,.15); color:#0f2747; background:#fff; font-size:7.8pt; font-weight:700; }} .cta-links .cta-main {{ background:#0f2747; color:#fff; }}
.final-page {{ page-break-before:always; min-height:242mm; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; border-radius:8mm; padding:13mm; background:linear-gradient(145deg,#0f2747,#1c4b7d); color:#fff; }}
.final-logo-wrap {{ display:inline-flex; align-items:center; justify-content:center; margin-bottom:7mm; padding:3mm 5mm; border-radius:5mm; background:#fff; }}
.final-logo-wrap .logo {{ object-position:center; width:55mm; max-height:16mm; margin:0; }}
.final-page h2 {{ font-size:23pt; color:#fff; max-width:165mm; margin-bottom:5mm; }} .final-page > p {{ color:rgba(255,255,255,.86); font-size:11pt; max-width:160mm; }}
.contact-grid {{ width:100%; display:grid; grid-template-columns:repeat(3,1fr); gap:4mm; margin:7mm 0; }}
.contact-card {{ padding:4mm; border:1px solid rgba(255,255,255,.18); border-radius:5mm; background:rgba(255,255,255,.08); }}
.contact-card strong {{ display:block; color:#f1d893; font-size:8.5pt; margin-bottom:1mm; }} .contact-card a {{ color:#fff; font-weight:700; font-size:9pt; direction:ltr; }}
.qr-grid {{ display:grid; grid-template-columns:1fr 1fr; gap:6mm; margin-top:5mm; width:115mm; }}
.qr-card {{ padding:4mm; border-radius:5mm; background:#fff; color:#0f2747; }} .qr-card img {{ width:33mm; height:33mm; display:block; margin:0 auto 2mm; }} .qr-card strong {{ display:block; font-size:8.5pt; }} .qr-card p {{ color:#5f6b7c; font-size:7.5pt; margin:1mm 0 0; }}
.final-actions {{ display:flex; flex-wrap:wrap; justify-content:center; gap:3mm; margin-top:6mm; }} .final-actions a {{ padding:3mm 5mm; border-radius:99px; font-weight:700; }} .final-actions .primary {{ background:#d4a63a; color:#0f2747; }} .final-actions .secondary {{ background:#fff; color:#0f2747; }}
.share-note {{ margin-top:6mm !important; font-size:9pt !important; color:#f1d893 !important; }}
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
      <div><strong>4</strong><span>{esc(labels['certificate'])}</span></div>
    </div>
    <div class="cover-cta">
      <strong>{esc(labels['section_cta_title'])}</strong>
      <p>{esc(labels['section_cta_body'])}</p>
      <a href="{esc(quote_url)}">{esc(labels['request'])}</a>
      <a href="{esc(whatsapp_url)}">{esc(labels['whatsapp'])}</a>
    </div>
  </div>
  <div class="cover-bottom"><span>{esc(labels['updated'])}: {esc(meta.get('lastUpdated'))}</span><span>{esc(website_label)} • {esc(whatsapp_label)}</span></div>
</section>
<section class="toc">
  <h2 class="page-title">{esc(labels['contents'])}</h2>
  <ol>{toc}</ol>
</section>
{''.join(section_html)}
<section class="final-page">
  <div class="final-logo-wrap">{logo}</div>
  <h2>{esc(labels['closing'])}</h2>
  <p>{esc(labels['closing_body'])}</p>
  <div class="contact-grid">
    <div class="contact-card"><strong>{esc(labels['site'])}</strong><a href="{esc(website_url)}">{esc(website_label)}</a></div>
    <div class="contact-card"><strong>{esc(labels['phone'])}</strong><a href="{esc(whatsapp_url)}"><bdi dir="ltr">{esc(whatsapp_label)}</bdi></a></div>
    <div class="contact-card"><strong>{esc(labels['email'])}</strong><a href="{esc(email_url)}">{esc(email_label)}</a></div>
  </div>
  <div class="qr-grid">
    <div class="qr-card"><img src="{guide_qr}" alt="QR"><strong>{esc(labels['share'])}</strong><p>{esc(labels['share_body'])}</p></div>
    <div class="qr-card"><img src="{whatsapp_qr}" alt="QR"><strong>{esc(labels['wa_qr'])}</strong><p><bdi dir="ltr">{esc(whatsapp_label)}</bdi></p></div>
  </div>
  <div class="final-actions">
    <a class="primary" href="{esc(quote_url)}">{esc(labels['request'])}</a>
    <a class="secondary" href="{esc(contact_url)}">{esc(labels['contact_us'])}</a>
  </div>
  <p class="share-note">{esc(labels['save_share'])}</p>
</section>
</body></html>"""

    header_logo = (
        f"<img src='{logo_uri}' style='height:24px;max-width:150px;object-fit:contain;'>"
        if logo_uri
        else "<strong style='color:#0f2747;font-size:12px;'>Consu<span style='color:#d4a63a'>Train</span></strong>"
    )
    header_template = (
        f"<div style='width:100%;padding:0 13mm;display:flex;align-items:center;justify-content:space-between;"
        f"direction:{direction};font-family:Arial,sans-serif;font-size:8px;color:#667085;'>"
        f"{header_logo}<span>{esc(labels['guide'])}</span></div>"
    )
    footer_template = (
        f"<div style='width:100%;padding:0 13mm;display:flex;align-items:center;justify-content:space-between;"
        f"direction:{direction};font-family:Arial,sans-serif;font-size:7.5px;color:#667085;'>"
        f"<span>{esc(website_label)} • {esc(whatsapp_label)}</span>"
        "<span style='direction:ltr;unicode-bidi:isolate;'><span class='pageNumber'></span> / <span class='totalPages'></span></span></div>"
    )
    return document, header_template, footer_template


def render_pdf(
    html_content: str,
    output_path: Path,
    header_template: str,
    footer_template: str,
) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser_path = os.environ.get("PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH")
        launch_args: dict[str, Any] = {"headless": True}
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
            header_template=header_template,
            footer_template=footer_template,
            margin={"top": "22mm", "right": "13mm", "bottom": "20mm", "left": "13mm"},
        )
        browser.close()


def calculate_source_hash(root: Path, data_paths: list[Path], contact_path: Path) -> str:
    digest = hashlib.sha256()
    tracked = [
        *data_paths,
        contact_path,
        Path(__file__).resolve(),
        root / "assets/images/consutrain-logo-horizontal.png",
        root / "assets/images/consutrain-logo-horizontal-fr.png",
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
    contact_path = root / "assets/data/platform-contact.json"
    contact = load_json(contact_path)
    manifest_path = root / "assets/data/platform-guide-pdf-manifest.json"
    source_hash = calculate_source_hash(root, data_paths, contact_path)

    existing_manifest: dict[str, Any] = {}
    if manifest_path.exists():
        try:
            existing_manifest = load_json(manifest_path)
        except (OSError, json.JSONDecodeError):
            existing_manifest = {}

    expected_outputs: list[Path] = []
    loaded_jobs: list[tuple[str, dict[str, Any], Path, dict[str, Any]]] = []
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

    manifest: dict[str, Any] = {
        "sourceHash": source_hash,
        "updatedAt": dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat(),
        "contactSource": str(contact_path.relative_to(root)).replace("\\", "/"),
    }

    for lang, data, output, pdf_meta in loaded_jobs:
        document, header, footer = build_document(data, contact, lang, root)
        render_pdf(document, output, header, footer)
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
