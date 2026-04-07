# Content Playbook — Lost Luggage Legends

> One document to onboard any team member. Everything you need to create, review, and publish an article.

---

## Quick Start (5 Minutes to Your First Article)

### 1. Generate a Draft
```bash
cd /home/nostradamus/lost-luggage-legends
node src/scripts/generate-article.mjs "Your Article Title" --category carry-on-bags
```
Categories: `carry-on-bags`, `packing-essentials`, `tsa-rules`, `business-travel`

### 2. Find Your Draft
```bash
# List all drafts
grep -l "draft: true" src/content/articles/*.mdx
```

### 3. Review It
- Open `REVIEW_QUEUE.md` — your article is listed there
- Read the full article, check accuracy and tone
- When satisfied, add `ready_for_qa: true` to the frontmatter

### 4. Run QA
- Complete every item in **QA Checklist** below
- All items must pass before publishing

### 5. Publish
```bash
# Remove draft flag
git checkout -b article/[slug]
# Edit: set draft: false in frontmatter
git commit -m "publish: [article title]"
git push origin article/[slug]
# Create PR → Merge → Vercel deploys automatically
```

---

## Publishing Workflow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  GENERATE   │ -> │   STORE     │ -> │   REVIEW    │ -> │     QA      │ -> │   PUBLISH   │
│  (CLI/Ollama)   │   (MDX file) │    │  (Human)    │    │ (Checklist) │    │  (Merge PR) │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
     Step 1           Step 2            Step 3            Step 4             Step 5
```

**Tools at each stage:**
- Step 1: `generate-article.mjs` (Ollama: deepseek-r1:32b or qwen2.5-coder:14b)
- Step 2: File lands in `src/content/articles/[slug].mdx` with `draft: true`
- Step 3: Human review in `REVIEW_QUEUE.md`
- Step 4: `QA_CHECKLIST.md` — all items must pass
- Step 5: Git branch → PR → Merge → Vercel deploy

---

## Article Templates

### Template A: Product Roundup ("Best X for Y")

```markdown
# [Number] Best [Products] for [Audience] in [Year]

*[Estimated read time: X minutes]*

**Quick Answer**: If you're short on time, our top pick is [PRODUCT NAME] for [specific reason]. 
For budget-conscious travelers, go with [BUDGET OPTION]. For premium quality, choose [PREMIUM OPTION].

*Disclosure: Lost Luggage Legends is reader-supported. When you buy through links on our site, 
we may earn an affiliate commission. This article contains affiliate links.*

## The Problem with [Topic]

[2-3 paragraphs on pain points for business travelers]

## Our Top Picks at a Glance

| Product | Best For | Price | Weight | Key Feature |
|---------|----------|-------|--------|-------------|
| [Name] | [Use case] | $XXX | X lbs | [Feature] |

## What to Look for in [Product Category]

### [Criterion 1]
[Explanation with business traveler context]

### [Criterion 2]
[Explanation...]

## Detailed Reviews

### [Product #1 Name] — Best Overall

**Specs**: Dimensions: XX" x XX" x XX" | Weight: X.X lbs | Price: $XXX | Warranty: X years

**The Bottom Line**: [2-3 sentence recommendation]

**What We Like**:
- [Specific feature with detail]
- [Specific feature with detail]

**What Could Be Better**:
- [Drawback]
- [Drawback]

**Best For**: [Specific traveler type]

---

## Final Verdict

[Summary with clear recommendations by use case]

## Frequently Asked Questions

### [Question 1]?
[Answer]

### [Question 2]?
[Answer]

---

*Want more business travel gear recommendations? Subscribe to our newsletter for weekly picks.*
```

### Template B: Scenario Guide ("How to X")

```markdown
# How to [Achieve Outcome] for [Specific Scenario]

*[Estimated read time: X minutes]*

## The [Scenario] Challenge

[Set up the situation — e.g., "You've got a 5-day conference in Frankfurt..."]

## Step-by-Step: [Process Name]

### Step 1: [Action]
[Detailed instructions and why this matters]

### Step 2: [Action]
[Detailed instructions...]

## [Scenario] Packing Checklist

- [ ] [Item 1]
- [ ] [Item 2]
- [ ] ...

## Pro Tips from Frequent Flyers

1. [Tip with specific detail]
2. [Tip with specific detail]

## Recommended Gear for This Scenario

[3-5 product recommendations with brief rationale]

---

*Subscribe for more business travel guides.*
```

### Template C: Policy Update ("TSA Rules 2026")

```markdown
# [Policy Name] [Year]: What Business Travelers Need to Know

**Updated**: [Date] | **[Read time: X minutes]**

## What's Changing

[Clear summary of changes in plain English]

## Key Details for [Year]

| Category | Previous Rule | New Rule | Effective Date |
|----------|--------------|----------|----------------|
| [Item] | [Old] | [New] | [Date] |

## Why This Matters for Business Travel

[Specific implications for frequent business travelers]

## Action Items

1. [What to do]
2. [What to do]

## Common Questions

### [Question]?
[Answer]

---

*Stay ahead of travel changes. Subscribe for policy updates in your inbox.*
```

---

## QA Checklist

> Complete before publishing any article. All items must pass.

### Affiliate Compliance
- [ ] `<AffiliateDisclosure />` component included at end of article
- [ ] All affiliate links use `rel="sponsored nofollow"`
- [ ] Disclosure appears in first 100 words
- [ ] No misleading product claims or prices

### SEO & Meta
- [ ] Meta description: 150-160 chars, keyword-first
- [ ] Title includes target keyword
- [ ] Keyword in first 100 words
- [ ] Internal links to at least 2 other articles
- [ ] External links to authoritative sources (TSA.gov, etc.)
- [ ] Proper heading hierarchy (H2, H3 only)
- [ ] Alt-text on all images

### Content Quality
- [ ] No placeholder text ("[insert]", "TBD", etc.)
- [ ] All claims backed by facts or stated as opinion
- [ ] 2026 current — no outdated statistics or rules
- [ ] Brand tone: Confident, specific, no fluff
- [ ] Article length: 1000-2500 words (format-dependent)

### Technical
- [ ] Valid MDX syntax
- [ ] Frontmatter complete: title, description, category, categories, publishedDate, author, tags, draft: false
- [ ] No broken links
- [ ] Images load correctly

### Facts & Citations
- [ ] TSA rules cited from official sources
- [ ] Product prices checked (note: may vary)
- [ ] Stats have source attribution
- [ ] "Last updated" footer present

### Quick QA Commands
```bash
cd /home/nostradamus/lost-luggage-legends

# Verify AffiliateDisclosure component
ls src/components/AffiliateDisclosure.astro

# Check draft flag is removed before publish
grep "^draft:" src/content/articles/[slug].mdx

# Word count
wc -w src/content/articles/[slug].mdx

# Test build
npm run build
```

---

## Editorial Guidelines

### Brand Voice

**We Are**: Knowledgeable, efficient, trustworthy  
**We Are Not**: Gimmicky, overly casual, salesy

| Do This | Not This |
|---------|----------|
| "Here's what actually matters..." | "OMG you NEED this bag!!!" |
| Get to the point in first paragraph | Rambling intro with no value |
| Speak to the busy professional | Generic travel blogger persona |
| Include specific product details | Vague "great quality" claims |
| Admit drawbacks honestly | Unwarranted 5-star praise |
| Use "we tested" or "we reviewed" | "I think" or "in my opinion" |

### Minimum Word Counts
- Roundups: 2,500+ words
- Single Reviews: 1,500+ words
- Scenario Guides: 1,200+ words
- Comparisons: 1,800+ words
- Policy Updates: 800+ words

### Formatting Rules
- H2 for main sections, H3 for subsections
- Every article must have a comparison/specs table
- Bullet points for lists (max 7 items)
- Bold key terms for scannability
- Include estimated read time at top
- End with clear CTA (newsletter or related articles)

---

## Key Files

| File | Purpose |
|------|---------|
| `CONTENT_PLAYBOOK.md` | This document — start here |
| `CONTENT_PIPELINE.md` | Pipeline reference |
| `QA_CHECKLIST.md` | Detailed QA checklist |
| `REVIEW_QUEUE.md` | Current drafts in review |
| `docs/content-strategy-and-editorial-guidelines.md` | Full editorial strategy |
| `src/scripts/generate-article.mjs` | Article generation script |

---

## Categories

| Category | Slug | Content Type |
|----------|------|--------------|
| Carry-On Bags | `carry-on-bags` | Gear guides, roundups |
| Packing Essentials | `packing-essentials` | Tips, cubes, organization |
| TSA Rules | `tsa-rules` | Policy, compliance |
| Business Travel | `business-travel` | General business travel |

---

*Document Version: 1.0*  
*On behalf of: Ops/QA (Subutai)*  
*Last Updated: April 4, 2026*
