#!/bin/bash
# Puts back the CloudFront function exactly as it was before 26-Oct-2026 (no 301 for the made-up-cost post).
# Then remove "redirect_to" from that slug in yt-shorts-bot/blog_history.json and run "Rebuild Blog Index".
set -e
cd "$(dirname "$0")"
ETAG=$(aws cloudfront describe-function --name catalog-url-rewrite --stage DEVELOPMENT --query ETag --output text)
NEW=$(aws cloudfront update-function --name catalog-url-rewrite --if-match "$ETAG" \
  --function-config Comment="catalog + blog url rewrite and 301s",Runtime=cloudfront-js-1.0 \
  --function-code fileb://catalog-url-rewrite.LIVE.js --query ETag --output text)
aws cloudfront publish-function --name catalog-url-rewrite --if-match "$NEW" --query 'FunctionSummary.Status' --output text
echo "Restored. Old URL serves the post again after CloudFront cache (max-age 86400 on the 301) or an invalidation:"
echo "aws cloudfront create-invalidation --distribution-id E21QLU9SBUBY7Z --paths /p/rs-120-sweatshirt-vs-rs-180-hoodie-profit-breakdown-shocks.html"
