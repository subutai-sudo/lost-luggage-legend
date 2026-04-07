#!/bin/bash
# Article generation script using Ollama

CATEGORY=$1
TITLE=$2
WORD_COUNT=${3:-2500}

echo "Generating article: $TITLE"
echo "Category: $CATEGORY"
echo "Word count target: $WORD_COUNT"

# Create prompt for Ollama
read -r -d '' PROMPT << 'PROMPT_END'
Write a complete, publication-ready product roundup article in markdown format. 

The article must:
1. Be written in professional editorial voice - knowledgeable, efficient, trustworthy
2. Use "we" for editorial perspective (not "I" or "you")
3. Include specific product names with real specifications
4. Be at least 2500 words
5. Include proper frontmatter with: title, description, category, categories, publishedDate, author, tags, draft
6. Include a comparison table early in the article
7. Have detailed individual product reviews with specs, pros/cons
8. End with FAQ section and newsletter CTA
9. Include affiliate disclosure

Use this structure:
- Frontmatter (YAML)
- Title and read time
- Quick Answer summary
- Affiliate disclosure
- Problem statement section
- Comparison table (What to Look For / Top Picks at a Glance)
- Detailed reviews (each product as H3 with specs, bottom line, pros, cons)
- Final Verdict
- FAQ section
- Newsletter CTA

Remember: Be specific, include real dimensions, prices, weights. No placeholder text. Write as if for a real publication.
PROMPT_END

# Call Ollama with the prompt
echo "$PROMPT" | ollama run deepseek-r1:32b --format markdown 2>&1