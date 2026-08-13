# 2026-08-13 — winter merge + rate card

Deployed 13-Aug-2026 ~14:45 IST. Repo commit `0ccba64` on master; the GitHub
Action synced it to `s3://bulkplaintshirt.com/catalog/` (run 31685615407).

## CloudFront function
`catalog-url-rewrite` gained six exact-match 301s (slash and no-slash) for the
three retired product URLs. **CI does not deploy this function** — it was
uploaded and published by hand:

    ETAG=$(aws cloudfront describe-function --name catalog-url-rewrite --stage DEVELOPMENT --query ETag --output text)
    aws cloudfront update-function --name catalog-url-rewrite --if-match "$ETAG" \
      --function-config '{"Comment":"catalog + blog url rewrite and 301s","Runtime":"cloudfront-js-1.0"}' \
      --function-code fileb://cloudfront/url-rewrite.js
    aws cloudfront publish-function --name catalog-url-rewrite --if-match "<new ETag>"

Published to LIVE at 2026-08-13T09:17:39Z. Verified: the three retired URLs 301,
`/catalog/p/hoodie-430gsm/` and `/catalog/` still 200.

## Undo
- Site: `git revert 0ccba64 && git push` — the Action redeploys. The pre-change
  tree is also tagged `pre-merge-ratecard-undo`.
- CloudFront function: `catalog-url-rewrite.LIVE.js` here is the exact code that
  was live before. Re-upload it with the same two commands and publish.
- Images: nothing was overwritten. Every new hero shipped as `m2.webp`; the old
  `m.webp` files are untouched, so reverting `data/catalog.js` restores them.
- Deleted: `images/sweatshirt-premium/` (9 watermarked duplicates of the
  sweatshirt-2 shoot). Recoverable from git.
