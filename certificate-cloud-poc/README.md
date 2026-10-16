# ConsuTrain Certificate Cloud POC (isolated)

This branch is separate from main. **NOT DEPLOYED**. No production paths changed.

## Purpose
Use original AR/FR HTML templates to generate PDF via Cloudflare Browser Run Quick Actions, without a local Windows browser. Hardcoded fictional samples only; no real student data or Google Sheets/Gmail integration.

## Safety
- Requires secret `POC_ACCESS_KEY` before deployment. Never commit its value.
- Routes: `/ar.pdf` and `/fr.pdf`; header `X-POC-Key` required.
- This proof-of-concept has no queue, scheduler, verification registry, mail delivery, or per-user endpoint.
- Do not use on production traffic; deploy only after reviewing Access controls and rate limits.

## Deployment after approval (not performed)
1. In an isolated Wrangler project based on this folder, install Wrangler.
2. Set `POC_ACCESS_KEY` using `wrangler secret put POC_ACCESS_KEY`, storing the value privately.
3. Deploy to a distinct `*.workers.dev` test worker. This consumes free-tier Browser Run time per rendering.
4. Invoke each test route with `X-POC-Key`; save PDFs locally.
5. Inspect A4 landscape, single-page, Arabic font, logos, correctness of dummy values, and response header `X-Browser-Ms-Used`.
6. Compare against current locally-generated certificate PDF; do not publish until both match sufficiently.
7. Delete/deactivate test Worker after POC if unnecessary.

## Implementation
- Original templates copied from main at creation.
- Image paths resolved to public ConsuTrain assets; Cairo font fetched from public ConsuTrain asset.
- quickAction("pdf") browser binding requires compatibility_date >= 2026-03-24.
- Worker Free Browser Run has 10 min/day shared account quota; starts a new UTC day after a 429 quota exhaustion.
- No guarantee of unlimited free processing; monitor response usage / dashboard.

## Queue architecture recommendation (future separate work)
- Durable pending state in existing Sheets, atomic claim lease, idempotent certificateId and mail status.
- Count budgets by measured milliseconds, reserve headroom (do not simply count certificates).
- On HTTP 429 quota exhaustion stop processing until next UTC day; no automatic charge/upgrade.
- Display 'pending, estimated next processing window' rather than promise of delivery tomorrow.
- Notify admin only on persistent backlog / failures, not every quota breach.
