# QA Checklist — Lost Luggage Legends

> Complete before publishing any article. All items must pass.

## Pre-Publish Checklist

### 1. Affiliate Compliance ✓
- [ ] `import AffiliateDisclosure from '../../components/AffiliateDisclosure.astro';` present
- [ ] `<AffiliateDisclosure />` component included at end of article
- [ ] All affiliate links use `rel="sponsored nofollow"` 
- [ ] No misleading product claims or prices

### 2. SEO & Meta ✓
- [ ] Meta description: 150-160 chars, keyword-first
- [ ] Title includes target keyword
- [ ] Keyword in first 100 words
- [ ] Internal links to at least 2 other articles
- [ ] External links to authoritative sources (TSA.gov, etc.)
- [ ] Proper heading hierarchy (H2, H3 only)
- [ ] Alt-text on any images

### 3. Content Quality ✓
- [ ] No placeholder text ("[insert]", "TBD", etc.)
- [ ] All claims backed by facts or stated as opinion
- [ ] 2026 current — no outdated statistics or rules
- [ ] Brand tone: Confident, specific, no fluff ✓
- [ ] Article length: 1000-2500 words

### 4. Technical ✓
- [ ] Valid MDX syntax
- [ ] Frontmatter complete:
  - title, description, category, categories
  - publishedDate, author, tags
  - draft: false (for publish)
- [ ] No broken links
- [ ] Images load correctly (if any)

### 5. Facts & Citations ✓
- [ ] TSA rules cited from official sources
- [ ] Product prices checked (note: may vary)
- [ ] Any stats have source attribution
- [ ] "Last updated" footer present

---

## Quick QA Command

```bash
# Verify all checklist items
cd /home/nostradamus/lost-luggage-legends

# Check AffiliateDisclosure component exists
ls src/components/AffiliateDisclosure.astro

# Verify draft flag is removed
grep "^draft:" src/content/articles/[slug].mdx

# Check word count
wc -w src/content/articles/[slug].mdx

# Test build
npm run build
```

---

## Pass Criteria

All items must be checked YES before creating PR to merge and publish.
