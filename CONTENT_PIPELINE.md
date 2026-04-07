# AI Content Generation Pipeline — Lost Luggage Legends

## Pipeline Overview

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  GENERATE   │ -> │   STORE     │ -> │   REVIEW    │ -> │     QA      │ -> │   PUBLISH   │
│  (Ollama)   │    │   (MDX)     │    │   (Queue)   │    │  (Checklist)│    │  (Merge PR) │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
     CLI             Draft              Review             Checks             Vercel
                   flag: true          queue              required           deploy
```

## Step 1: Generate

```bash
cd /home/nostradamus/lost-luggage-legends
node src/scripts/generate-article.mjs "Article Title" --category carry-on-bags
```

- Uses Ollama (deepseek-r1:32b or qwen2.5-coder:14b)
- Output saved to `src/content/articles/[slug].mdx` with `draft: true`

## Step 2: Store (Automatic)

- Generated articles land in `src/content/articles/` with `draft: true` frontmatter
- Listed in `DRAFTS.md` for tracking

## Step 3: Review Queue

- All drafts listed in `REVIEW_QUEUE.md`
- Human reviews content in GitHub PR or local review
- Mark as `ready_for_qa: true` when approved

## Step 4: QA Checklist

- Complete `QA_CHECKLIST.md` before publishing
- Required checks: affiliate disclosure, alt-text, internal links, facts, meta description

## Step 5: Publish

1. Remove `draft: true` from frontmatter (set `draft: false`)
2. Create/commit to branch: `git checkout -b article/[slug]`
3. Push and create PR: `git push origin article/[slug]`
4. Merge PR → GitHub Actions → Vercel deploy

---

## Quick Commands

```bash
# Generate new article
node src/scripts/generate-article.mjs "Best Packing Cubes for Business Travelers" --category packing-essentials

# Check draft status
cat src/content/articles/*mdx | grep -E "^draft:|^title:"

# List all drafts
grep -l "draft: true" src/content/articles/*.mdx

# Count published vs drafts
echo "Published: $(grep -L 'draft: true' src/content/articles/*.mdx | wc -l)"
echo "Drafts: $(grep -l 'draft: true' src/content/articles/*.mdx | wc -l)"
```

## Categories

- `carry-on-bags` — Gear guides for carry-on luggage
- `packing-essentials` — Packing tips, cubes, organization
- `tsa-rules` — TSA regulations and compliance
- `business-travel` — General business travel content

## Models

- Default: `deepseek-r1:32b` (high quality, slower)
- Fast: `qwen2.5-coder:14b` (faster, good for shorter content)