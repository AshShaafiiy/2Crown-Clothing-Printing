# Artifact classification for contract cleanup

This bounded inventory records decisions, not a general cleanup instruction. No database, backup, Docker volume, or branding asset was deleted or moved. Ignoring a tracked historical file does not untrack it; `patch_categories_modal.cjs` remains tracked. No staging or commits were performed.

The maintained verification entrypoints are `npm run test --prefix backend`, `npm run build --prefix backend`, `npm run build`, focused frontend Vitest tests, and the existing Playwright configuration/specs. `run-qa-final.cjs` is retained because `QA_REPORT.md` references it as historical CDP evidence; it is not claimed to be a current authoritative release gate. Historical root/scratch probes are retained locally, not executed by this batch.

## Verified external archive

Archive: `/home/ash-shaafi-iy/2crown-artifact-archive/contract-cleanup-20260928/`.
Manifest: `manifest.json`, SHA-256 `103e381f61db76b0e4f7a25b89cda7449924f51a81c48d1a01ef964cfb480660`.
All 98 files (24,122,730 bytes) were copied and individually verified for byte length and SHA-256 before any approved deletion. Copies and manifest use mode 0600. The external manifest records every source path, archive path, size, and digest. Nine files were independently confirmed obsolete and deleted; 88 historical root/scratch files and the GCP archive remain in the repository as ignored local originals. The archive is outside the repository and Docker build context.

The three removed JavaScript tests were stale generated CommonJS copies excluded by Vitest; their maintained TypeScript replacements retain current coverage. The import probes and debug script had no maintained callers. Both upload components had no runtime callers; the active administrator single `imageUrl` input remains intact. `Dockerfile.test` installed an unrelated `better-sqlite3` package and had no maintained callers; the production Dockerfile and application `sqlite3` dependency are unchanged.

The maintained `backend/knexfile.cjs` now selects the installed `sqlite3` driver, matching the application. Migration/seed CLI verification is recorded in the release-candidate checks. No `PROJECT_HANDOFF.md` was recreated.

## Per-file decisions

| Path | Classification | Evidence / disposition |
| --- | --- | --- |
| `Dockerfile.test` | DELETE_AFTER_CONFIRMED_OBSOLETE | Developer + Engineer approved; verified external archive before deletion |
| `QA_REPORT.md` | KEEP_AND_COMMIT | Maintained source/configuration/test or documented historical evidence; branding and lockfiles retained |
| `backend/*.sqlite3{,-wal,-shm,-journal}` | KEEP_LOCAL_AND_IGNORE | Local data/evidence; no contents inspected, moved, or deleted |
| `backend/knexfile.cjs` | KEEP_AND_COMMIT | Maintained source/configuration/test or documented historical evidence; branding and lockfiles retained |
| `backend/package-lock.json` | KEEP_AND_COMMIT | Maintained source/configuration/test or documented historical evidence; branding and lockfiles retained |
| `backend/scripts/build.js` | KEEP_AND_COMMIT | Maintained source/configuration/test or documented historical evidence; branding and lockfiles retained |
| `backend/src/db/migrations/*.js` | KEEP_AND_COMMIT | Maintained source/configuration/test or documented historical evidence; branding and lockfiles retained |
| `backend/src/db/seeds/*.js` | KEEP_AND_COMMIT | Maintained source/configuration/test or documented historical evidence; branding and lockfiles retained |
| `backend/test-import.ts` | DELETE_AFTER_CONFIRMED_OBSOLETE | Developer + Engineer approved; verified external archive before deletion |
| `backend/tests/api.test.js` | DELETE_AFTER_CONFIRMED_OBSOLETE | Developer + Engineer approved; verified external archive before deletion |
| `backend/tests/orderStateMachine.test.js` | DELETE_AFTER_CONFIRMED_OBSOLETE | Developer + Engineer approved; verified external archive before deletion |
| `backend/tests/setup.js` | DELETE_AFTER_CONFIRMED_OBSOLETE | Developer + Engineer approved; verified external archive before deletion |
| `backups/ and accepted backup/restore artifacts` | KEEP_LOCAL_AND_IGNORE | Local data/evidence; no contents inspected, moved, or deleted |
| `backups/prod_20260927_120459.sqlite3` | KEEP_LOCAL_AND_IGNORE | Local data/evidence; no contents inspected, moved, or deleted |
| `data_test.sqlite3{,-wal,-shm,-journal}` | KEEP_LOCAL_AND_IGNORE | Local data/evidence; no contents inspected, moved, or deleted |
| `debug.cjs` | DELETE_AFTER_CONFIRMED_OBSOLETE | Developer + Engineer approved; verified external archive before deletion |
| `dev.cjs` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `error.png` | KEEP_LOCAL_AND_IGNORE | Historical QA screenshot; retained locally |
| `fix-imports.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `fix-ts.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `fix_duplicates.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `google-cloud-cli-linux-x86_64.tar.gz` | ARCHIVE_OUTSIDE_REPO | 23,908,352 bytes; verified external copy; original retained locally and ignored |
| `logs / *.log` | KEEP_LOCAL_AND_IGNORE | Local data/evidence; no contents inspected, moved, or deleted |
| `package-lock.json` | KEEP_AND_COMMIT | Maintained source/configuration/test or documented historical evidence; branding and lockfiles retained |
| `page.html` | KEEP_LOCAL_AND_IGNORE | Rendered browser HTML; inspected without printing content; retained as potentially sensitive local output |
| `patch-script.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `patch.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `patch_admin.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `patch_admin2.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `patch_api_services.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `patch_categories.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `patch_categories_modal.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `patch_dash.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `patch_package.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `patch_products.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `patch_products_2.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `patch_products_state.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `patch_tables.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `playwright.config.ts` | KEEP_AND_COMMIT | Maintained build/development/Playwright configuration or package-script entrypoint |
| `postcss.config.js` | KEEP_AND_COMMIT | Maintained build/development/Playwright configuration or package-script entrypoint |
| `public/2Crown-logo.jpeg` | KEEP_AND_COMMIT | Maintained source/configuration/test or documented historical evidence; branding and lockfiles retained |
| `qa-categories-full.cjs` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `qa-categories.cjs` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `qa-last-login-tables.cjs` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `qa_full_regression.cjs` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `qa_part1.cjs` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `qa_part2.cjs` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `qa_tests.cjs` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `run-qa-final.cjs` | KEEP_AND_COMMIT | Historical QA entrypoint referenced by QA_REPORT.md; retained for reproducibility, not an authoritative release gate |
| `run-qa-headless.cjs` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `run-qa.cjs` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `run-toggle-test.cjs` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `scratch/audit.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/check_screen.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/debug_buttons.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/debug_layout.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/debug_qa.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/fix_admins.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/fix_everything.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/fix_product_details.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/package-lock.json` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/package.json` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_admin.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_admin_orders.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_administrators.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_admins.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_app.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_categories.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_categories_2.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_checkout.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_customers.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_db.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_dev.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_gallery_backend.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_gallery_services.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_gallery_services_remove.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_headers.py` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_headers_2.py` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_home.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_layout.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_mock_errors.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_mock_images.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_mock_product_tests.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_models.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_orders.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_product_card.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_product_card_final.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_product_details.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_product_details_images.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_product_details_thumb.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_products.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_products_2.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_products_multi_image.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_products_save.py` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_profile.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_readme.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_schemas.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_settings.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_settings.py` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_settings_2.py` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_settings_handlechange.py` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_settings_ngn.py` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_settings_revert.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_status.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_test.py` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/patch_track_order.cjs` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/qa_final_test.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/redo_products.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/redo_products_safe.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/repair_profile.py` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/repair_profile_2.py` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/replace_alerts.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/revert_layout.py` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/rewrite_admins.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/rewrite_products.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/test-admin-disable.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/test-backend.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/test-patch.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/test-routes.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/test.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/unify.py` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/unify_layout.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scratch/verify_profile.js` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `scripts/backup.sh` | KEEP_AND_COMMIT | Maintained source/configuration/test or documented historical evidence; branding and lockfiles retained |
| `scripts/restore.sh` | KEEP_AND_COMMIT | Maintained source/configuration/test or documented historical evidence; branding and lockfiles retained |
| `server.pid` | KEEP_LOCAL_AND_IGNORE | Numeric PID has no live /proc owner; retained rather than removed |
| `setup.sh` | KEEP_LOCAL_AND_IGNORE | Historical one-shot patch/probe; verified external copy retained, original left local |
| `src/components/ui/FileUpload.tsx` | DELETE_AFTER_CONFIRMED_OBSOLETE | Developer + Engineer approved; verified external archive before deletion |
| `src/components/ui/MultiImageUpload.tsx` | DELETE_AFTER_CONFIRMED_OBSOLETE | Developer + Engineer approved; verified external archive before deletion |
| `src/test-import.ts` | DELETE_AFTER_CONFIRMED_OBSOLETE | Developer + Engineer approved; verified external archive before deletion |
| `stop.sh` | KEEP_AND_COMMIT | Maintained build/development/Playwright configuration or package-script entrypoint |
| `tailwind.config.js` | KEEP_AND_COMMIT | Maintained build/development/Playwright configuration or package-script entrypoint |
| `test-login.cjs` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `test-login.js` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `test-nav.cjs` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `test-page.cjs` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `test-pw.mjs` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `test-raw.cjs` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `test_cdp.cjs` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `test_cdp.js` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `test_env.js` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `test_modal.cjs` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `test_persistence.ts` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `test_qa.cjs` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `test_qa2.cjs` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `test_qa_all.cjs` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `test_storefront.cjs` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `tests/*.spec.ts` | KEEP_AND_COMMIT | Maintained source/configuration/test or documented historical evidence; branding and lockfiles retained |
| `tests/*.test.tsx` | KEEP_AND_COMMIT | Maintained source/configuration/test or documented historical evidence; branding and lockfiles retained |
| `tests/qa.puppeteer.cjs` | KEEP_AND_COMMIT | Maintained source/configuration/test or documented historical evidence; branding and lockfiles retained |
| `verify.sh` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `verify_persistence.ts` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
| `vite.config.ts` | KEEP_AND_COMMIT | Maintained build/development/Playwright configuration or package-script entrypoint |
| `wait_and_verify.sh` | KEEP_LOCAL_AND_IGNORE | Local historical QA/probe; not invoked by maintained package/config gates, retained locally |
