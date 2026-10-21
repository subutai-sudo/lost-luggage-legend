# SEO routes and regression checks

This project runs **Next.js App Router**, not the older Astro stack described in parts of `TECHNICAL_PLAYBOOK.md`.

## Source of truth

- `src/lib/site.ts`: public origin, shared metadata helper and indexable static paths.
- `src/app/robots.ts`: generated `/robots.txt`, including the API exclusion and sitemap URL.
- `src/app/sitemap.ts`: generated `/sitemap.xml` from the static page list and `DESTINATION_GUIDES`.
- Route-level metadata: homepage, `/guides`, each guide, and each legal page own their canonical URL.
- The root layout owns the title template and shared defaults, **not a sitewide canonical**. Never add a manual canonical link to that layout.

Always use `https://lostluggagelegend.com` for public canonical/social/sitemap URLs, including when inspecting a localhost or Vercel preview. Do not use a request Host header or preview hostname. Next.js may serialize the root canonical without a final slash; URL-normalized `https://lostluggagelegend.com` and `https://lostluggagelegend.com/` are equivalent.

Adding a guide to `DESTINATION_GUIDES` includes it automatically in the generated sitemap. Do not recreate static `public/robots.txt` or `public/sitemap.xml`: they conflict with the metadata routes. Add an indexable non-guide page to `INDEXABLE_STATIC_PATHS` and give the route its own metadata. Avoid invented last-modified dates.

Document titles should omit the brand suffix at the page level, because the root template adds it. Explicit social titles do not inherit that document-title template.

## Local verification

```bash
npm ci
npm run build
```

The build should not require newsletter credentials. In one terminal start an isolated local production-mode preview:

```bash
RESEND_API_KEY= RESEND_AUDIENCE_ID= npm run start -- --hostname 127.0.0.1 --port 3031
```

In another terminal:

```bash
npm run test:seo
npm run typecheck
git diff --check
TEST_NEWSLETTER_UNCONFIGURED=1 node --test tests/newsletter.unconfigured.test.mjs
```

`test:seo` performs read-only HTTP checks on the running server. It discovers all guide links from the guide index, checks every one, compares them with the sitemap, verifies static/legal metadata, confirms the footer index link, and requires a true 404 for unknown guides. Set `SEO_BASE_URL` to inspect another preview with GET-only checks. Preview protection may need account authorization; do not disable protection merely to run this test.

The newsletter suite makes local POST requests and rejects non-loopback targets. Run it **only** against the explicit empty-credential server above. It tests missing-configuration failure and malformed input, not actual email delivery or configured Resend integration. Do not submit real subscriber addresses or production forms as part of SEO testing.

## Preview and release

1. Keep repairs on a feature branch and inspect the diff.
2. Run build, typecheck and both suites against the production-mode local server.
3. Push only the feature branch once GitHub access and the Vercel deployment configuration are verified.
4. Read back the branch/PR and preview URL, rerun GET-only SEO tests on the preview, and review rendered pages.
5. Merge/promote only with explicit release authorization, then rerun public checks and inspect Search Console. Correct metadata does not itself prove Google indexation.

No production release is implied by successful local tests. Fixing the newsletter build-time initialization also does not validate its complete subscription/delivery workflow.
