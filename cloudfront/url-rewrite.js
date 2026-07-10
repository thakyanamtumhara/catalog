function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // 301 map: duplicate-cluster articles consolidated into one winner per
    // search query (Google indexes one per cluster and buries the rest —
    // 59 "Crawled - not indexed" pages as of Jul 2026). Redirect preserves
    // the losers' external backlinks (Reddit/Quora). Source of truth:
    // yt-shorts-bot/blog_history.json entries with redirect_to.
    var redirects = {
        '/p/180-gsm-vs-220-gsm-in-summer-600-pieces-unsold.html': '/p/stop-using-180-gsm-for-printing-heres-proof.html',
        '/p/200-gsm-but-feels-cheap-check-these-3-things.html': '/p/240-gsm-vs-200-gsm-plain-t-shirt-why-heavier-feels-cheap.html',
        '/p/240-gsm-quality.html': '/p/240-gsm-vs-200-gsm-plain-t-shirt-why-heavier-feels-cheap.html',
        '/p/240-gsm-t-shirt-feels-cheap-yarn-quality-vs-gsm-why-same.html': '/p/240-gsm-vs-200-gsm-plain-t-shirt-why-heavier-feels-cheap.html',
        '/p/300-t-shirts-wasted-check-colorfastness-before-printing.html': '/p/t-shirt-color-bleeding-in-monsoon-reactive-vs-pigment-dye.html',
        '/p/5-1000-t-shirts-summer-fabric.html': '/p/40-returns-in-1-week-dtg-on-polyester-in-summer.html',
        '/p/500-pieces-without-sample-this-gsm-mistake-cost-him-lakhs.html': '/p/200-t-shirts-ordered-without-sample-what-went-wrong-blanks.html',
        '/p/500-t-shirts-embroidery-cost-25000-single-vs-double-head.html': '/p/single-head-vs-double-head-embroidery-machine-40k-loss-on.html',
        '/p/5000-t-shirts-ordered-without-checking-gsm-12-lakh-lost.html': '/p/200-t-shirts-ordered-without-sample-what-went-wrong-blanks.html',
        '/p/5000-t-shirts-returned-one-stitching-mistake-cost-us-lakhs.html': '/p/t-shirt-stitching-quality-check-for-bulk-orders-how-12.html',
        '/p/50k-vs-2-lakh-dtf-printer-print-head-life-real-cost-which.html': '/p/2l-vs-8l-dtf-printer-one-died-in-90-days.html',
        '/p/50k-vs-3-lakh-dtf-printer-real-cost-difference-for-indian.html': '/p/2l-vs-8l-dtf-printer-one-died-in-90-days.html',
        '/p/boxy-fit-t-shirt-always-out-of-stock-manufacturing-cutting.html': '/p/boxy-fit-t-shirt-always-out-of-stock-manufacturing-reason.html',
        '/p/client-returned-full-batch-this-t-shirt-washing-mistake.html': '/p/t-shirt-shrinkage-test-for-bulk-orders-how-6-shrinkage.html',
        '/p/dtf-vs-screen-print-vs-embroidery-cost-on-500-t-shirt.html': '/p/dtf-vs-screen-print-vs-embroidery-real-cost-breakdown-on.html',
        '/p/dtf-vs-screen-print-vs-embroidery-cost-per-piece-500-t.html': '/p/dtf-vs-screen-print-vs-embroidery-real-cost-breakdown-on.html',
        '/p/dtg-print-cracked-in-3-washes-your-technique-is-wrong.html': '/p/dtg-print-cracked-in-3-washes-heres-why-quality-test.html',
        '/p/first-time-printing-t-shirts-this-waste-will-shock-you.html': '/p/20-rejected-out-of-500-screen-print-waste-truth-revealed.html',
        '/p/free-whatsapp-api-dropshipping-website-referral-system-for.html': '/p/free-whatsapp-api-for-bulk-t-shirt-business-stop-getting.html',
        '/p/girls-hoodies-wholesale-plain-how-adding-this-category-took.html': '/p/girls-hoodies-wholesale-india-60-college-merch-demand-youre.html',
        '/p/girls-summer-hoodie-business-india-0-to-5-lakh-plan-for.html': '/p/girls-hoodies-wholesale-india-60-college-merch-demand-youre.html',
        '/p/he-ordered-2000-pieces-without-sample-tshirtwholesaler.html': '/p/200-t-shirts-ordered-without-sample-what-went-wrong-blanks.html',
        '/p/polyester-blend-vs-pure-cotton-t-shirt-in-monsoon-12-cost.html': '/p/polyester-vs-cotton-t-shirts-for-monsoon-season-why-40k.html',
        '/p/polyester-vs-cotton-t-shirt-for-monsoon-why-200-pieces-got.html': '/p/polyester-vs-cotton-t-shirts-for-monsoon-season-why-40k.html',
        '/p/polyester-vs-cotton-t-shirt-in-rain-80k-stock-loss-monsoon.html': '/p/polyester-vs-cotton-t-shirts-for-monsoon-season-why-40k.html',
        '/p/print-crack-after-3-washes-you-used-the-wrong-ink.html': '/p/dtg-print-cracked-in-3-washes-heres-why-quality-test.html',
        '/p/royal-blue-240-gsm-oversized-t-shirt-wholesale-3-quality.html': '/p/royal-blue-240-gsm-oversized-t-shirt-why-5-suppliers-sent.html',
        '/p/stop-t-shirt-business-mein-ye-galti-mat-karo.html': '/p/he-bought-1000-t-shirts-shut-down-in-2-months.html',
        '/p/t-shirt-colour-bleed-in-monsoon-3-fabric-mistakes-to-check.html': '/p/t-shirt-color-bleeding-in-monsoon-reactive-vs-pigment-dye.html',
        '/p/t-shirt-colour-bleeding-test-before-bulk-order-5-trick-that.html': '/p/t-shirt-color-bleeding-in-monsoon-reactive-vs-pigment-dye.html',
        '/p/t-shirt-seam-ripped-after-1-wash-check-this-before-you-buy.html': '/p/t-shirt-stitching-quality-check-for-bulk-orders-how-12.html',
        '/p/whatsapp-bulk-messaging-for-t-shirt-business-without-ban.html': '/p/free-whatsapp-api-for-bulk-t-shirt-business-stop-getting.html',
        '/p/why-50-t-shirts-got-returned-washing-tag-galti.html': '/p/t-shirt-wash-care-label-size-tag-why-1000-printed-tees-got.html'
    };
    var target = redirects[uri];
    if (target) {
        return {
            statusCode: 301,
            statusDescription: 'Moved Permanently',
            headers: {
                'location': { value: 'https://www.bulkplaintshirt.com' + target },
                'cache-control': { value: 'max-age=86400' }
            }
        };
    }

    // /catalog/ -> /catalog/index.html
    if (uri.endsWith('/')) {
        request.uri += 'index.html';
    }
    // /catalog or /catalog/p/oversize-210gsm -> append /index.html
    // Skip files with extensions (.css, .js, .webp, etc.)
    else if (!uri.includes('.')) {
        request.uri += '/index.html';
    }

    return request;
}
