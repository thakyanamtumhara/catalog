# UNDO — sale91 price increase, 22 Aug 2026

Applied the supplier's 01/08/2026 rate rise to the **Update Product** sheet
(`1ARwVxH4n5Jn3HulbzAx6x2T_4mMB-qazd6Wd7LKeVcs`, tab **Sheet1**), columns **D4:D23**
and **F4:F23**, then pressed the red **Save** button, which republishes `pc.js`.
Column E (NickName) was NOT touched.

## Rollback — fastest (shop back in ~30s, sheet still wrong)

```bash
cd ~/Projects/MadeByKetuCompleteNewMain
./abin/restore-pcjs.sh backup/pc.js.20260822T090337Z
```
That file is the exact live catalogue captured immediately BEFORE the change
(20 products, 13046 bytes, sanity OK). S3 versioning is Enabled, so
`./abin/restore-pcjs.sh --list` also shows every prior S3 version.

## Rollback — full (put the sheet back too)

Paste these back into **Sheet1 D4:D23**, then press Save:

```
190,190,190,190,190,190
185,185,185,185,185
190,195,205,220,225,230,240,255
114,114,114,114,124,124,124,124
173,173,173,173,173
146,146,146,146,151,151
136,136,136,136,141,141
105,105,105,105,110,110
118,118,118,118,123,123
232,232,232,232,232,237
185,185,185,185,185,190
295,295,295,295,305
325,325,325,325,335
225,225,225,225,235
240,240,240,240,250
217,217,217,217,217
380,380,380,380,390
418,418,418,418,428
233,233,233,233,233,233
60,60
```

And into **Sheet1 F4:F23**:

```
228
222
275
144
208
181
170
129
144
285
222
366
402
276
288
261
468
502
280
90
```

## What was written (for reference)

D4:D23
```
195,195,195,195,195,195
190,190,190,190,190
190,195,205,220,225,230,240,255
116,116,116,116,126,126,126,126
177,177,177,177,177
150,150,150,150,155,155
142,142,142,142,147,147
107,107,107,107,112,112
120,120,120,120,125,125
237,237,237,237,237,242
187,187,187,187,187,192
307,307,307,307,317
337,337,337,337,347
235,235,235,235,245
250,250,250,250,260
217,217,217,217,217
402,402,402,402,412
440,440,440,440,450
238,238,238,238,238,238
60,60
```

F4:F23
```
233
227
275
146
212
185
176
131
146
290
224
378
414
286
298
261
490
524
285
90
```

## Row map (Sheet1 row -> product)

- row 4: Oversize 240gsm  (+5)
- row 5: Oversize 210gsm  (+5)
- row 6: Oversize 260gsm  (no change)
- row 7: Kids Rneck  (+2)
- row 8: Oversize 180gsm  (+4)
- row 9: True Bio Rneck  (+4)
- row 10: Bio Rneck  (+6)
- row 11: Non Bio Rneck  (+2)
- row 12: Sublimation tshirt  (+2)
- row 13: Premium Polo  (+5)
- row 14: Cotton Polo  (+2)
- row 15: Hoodie 320gsm-1  (+12)
- row 16: Hoodie 320gsm-2  (+12)
- row 17: Sweatshirt  (+10)
- row 18: Sweatshirt-2  (+10)
- row 19: Shorts  (no change)
- row 20: Dropsho Hoodie 430gsm  (+22)
- row 21: Hoodie 430gsm-2  (+22)
- row 22: AcidWash OS  (+5)
- row 23: Sale: Kids Polo  (no change)

Left unchanged on purpose: **Oversize 260gsm** and **Sale: Kids Polo** (not on the
supplier list) and **Shorts** (line 17 struck out on the supplier list).

---

## /catalog repo rollback (this directory)

```bash
cd ~/Projects/catalog
git revert --no-edit <this commit>        # or:
git checkout pre-price-increase-2026-08-22-undo -- data/catalog.js
node generate-pages.js && node scripts/sync-llms.js && node scripts/sync-llms-i18n.js
git commit -am "Roll back the price increase" && git push
```
Tag `pre-price-increase-2026-08-22-undo` marks the last commit before the rise
(`d8d064b`). `catalog.js.before` in this directory is the pre-change data file.
