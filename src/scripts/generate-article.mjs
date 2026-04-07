#!/usr/bin/env node
/**
 * Article Generator for Lost Luggage Legends
 * Uses Ollama to generate article content based on templates
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, '../content/articles');

// Ensure directory exists
if (!fs.existsSync(ARTICLES_DIR)) {
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });
}

const articleTemplates = {
  'carry-on-bags': {
    template: 'product-roundup',
    frontmatter: {
      category: 'carry-on-bags',
      categories: ['carry-on-bags', 'business-travel'],
      author: 'Rumi',
      tags: ['carry-on', 'luggage', 'business-travel']
    }
  },
  'packing-essentials': {
    template: 'scenario-guide',
    frontmatter: {
      category: 'packing-essentials',
      categories: ['packing-essentials', 'business-travel'],
      author: 'Rumi',
      tags: ['packing', 'business-travel', 'essentials']
    }
  },
  'business-travel': {
    template: 'comparison',
    frontmatter: {
      category: 'business-travel',
      categories: ['business-travel', 'tips'],
      author: 'Rumi',
      tags: ['business-travel', 'tips']
    }
  }
};

function generateArticle(title, category, slug) {
  console.log(`Generating: ${title}`);
  console.log(`Category: ${category}`);
  console.log(`Slug: ${slug}`);
  console.log('---');
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const title = args[0] || 'Sample Article';
  const category = args[1] || 'carry-on-bags';
  
  generateArticle(title, category, title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-'));
}

module.exports = { generateArticle };