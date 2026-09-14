# UNDO — sale91 price increase (+5%, rounded UP), 14 Sep 2026

Ketu's instruction (14-Sep-2026 17:20 IST): raise SEVEN products by 5%, every size,
"5% or the next big integer" (ceil), everywhere. Sample-piece price raised by the same
rule. Everything else untouched.

| Sheet row | Product | Price Bulk (D) before → after | Price Sample (F) before → after |
|---|---|---|---|
| 4  | Oversize 240gsm | 195,195,195,195,195,195 → 205,205,205,205,205,205 | 233 → 245 |
| 5  | Oversize 210gsm | 190,190,190,190,190 → 200,200,200,200,200 | 227 → 239 |
| 7  | Kids Rneck | 116,116,116,116,126,126,126,126 → 122,122,122,122,133,133,133,133 | 146 → 154 |
| 8  | Oversize 180gsm | 177,177,177,177,177 → 186,186,186,186,186 | 212 → 223 |
| 9  | True Bio Rneck | 150,150,150,150,155,155 → 158,158,158,158,163,163 | 185 → 195 |
| 10 | Bio Rneck | 142,142,142,142,147,147 → 150,150,150,150,155,155 | 176 → 185 |
| 13 | Premium Polo | 237,237,237,237,237,242 → 249,249,249,249,249,255 | 290 → 305 |

## 1. Shop (pc.js) — Update Product sheet `1ARwVxH4n5Jn3HulbzAx6x2T_4mMB-qazd6Wd7LKeVcs`, tab Sheet1

Cells D4, D5, D7, D8, D9, D10, D13 and F4, F5, F7, F8, F9, F10, F13 typed via the Name Box
(column D is Plain-text formatted, so the comma lists stay text), then the red **Save** button →
"Are you sure you want to Update?" → Yes → "Updated". pc.js republished 14-Sep 12:09:44 GMT
(17:39 IST); verified on the CloudFront origin: 7 products changed, 15 unchanged, OOS map identical.

### Rollback — fastest (shop back in ~30 s, sheet still shows new numbers)
```bash
cd ~/Projects/MadeByKetuCompleteNewMain
./abin/restore-pcjs.sh backup/pc.js.20260914T120120Z
```
That file is the live catalogue captured immediately BEFORE the change (22 products, 13806 bytes,
sanity OK). `./abin/restore-pcjs.sh --list` also shows every S3 version.

### Rollback — full (sheet too)
Put the "before" values from the table above back into D4/D5/D7/D8/D9/D10/D13 and
F4/F5/F7/F8/F9/F10/F13, then press Save.

## 2. /catalog (sale91.com/catalog = bulkplaintshirt.com/catalog) — repo `~/Projects/catalog`

Separate copy of every price (`data/catalog.js`). Updated the same 7 products by nickname
(OS240, OS210, Kids, OS180, True Bio, YL Bio, Bio Polo), regenerated pages + products.json +
llms feeds. Also in the same commit: NORMAL_SIZE_STEP 10 → 11 (so the Kids card keeps a single
headline price — its normal size step became ₹11 after the rise), the hand-written AI block in
index.html refreshed from data (it still quoted pre-Aug prices for every product), Hindi quick-picks
and worked examples, Tamil "₹2/pc website discount" claim removed (discontinued Jun-2026),
"prices starting from ₹102" → ₹107, invented "RATING 4.8/5 from 87+ reviews" comment removed.

### Rollback
```bash
cd ~/Projects/catalog
git revert <commit>   # or: git reset --hard pre-price-increase-2026-09-14-undo && git push --force-with-lease
git push origin master   # GitHub Action redeploys to S3 + CloudFront in ~3 min
```
Backup of the data file: `.deploy-backup/2026-09-14-price-increase/catalog.js.before`.

## 3. Digital Ketu (dk2)
Reads prices ONLY from live `bulkplaintshirt.com/catalog/products.json` (5-min TTL) + pc.js.
Nothing to roll back there — it follows whatever /catalog serves. Knowledge chunks re-synced via
`POST /api/sync/catalog` (cosmetic; retrieval excludes CATALOG chunks for prices).

## 4. Everything else reads pc.js live (no action, no rollback)
Website checkout, lambda-bookdl price verify, reseller-api, offline app, WOD, Khata (snapshots
by dispatch date), dropshipper stores (cost refreshes every 5 min; below-cost repair runs at boot).
