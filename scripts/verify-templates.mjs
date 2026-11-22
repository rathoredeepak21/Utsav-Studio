// Comprehensive Verification Script for Module 3 Templates
import { ALL_TEMPLATES, WEDDING_TEMPLATES, BIRTHDAY_TEMPLATES, ENGAGEMENT_TEMPLATES, ANNIVERSARY_TEMPLATES, BABY_SHOWER_TEMPLATES, HOUSEWARMING_TEMPLATES, MUNDAN_TEMPLATES, OTHER_TEMPLATES } from '../src/data/templates/index.ts';

console.log('=== UTSAV STUDIO MODULE 3 VERIFICATION ===');
console.log(`Total Templates loaded: ${ALL_TEMPLATES.length}`);

const expectedCounts = {
  wedding: 12,
  birthday: 8,
  engagement: 4,
  anniversary: 4,
  'baby-shower': 3,
  housewarming: 3,
  mundan: 3,
  other: 3,
};

let errors = 0;

// 1. Verify exact counts
for (const [cat, expected] of Object.entries(expectedCounts)) {
  const actual = ALL_TEMPLATES.filter((t) => t.category === cat).length;
  if (actual === expected) {
    console.log(`✓ Category "${cat}": ${actual}/${expected}`);
  } else {
    console.error(`✗ Category "${cat}": expected ${expected}, got ${actual}`);
    errors++;
  }
}

// 2. Verify unique IDs
const idSet = new Set();
for (const t of ALL_TEMPLATES) {
  if (idSet.has(t.id)) {
    console.error(`✗ Duplicate template ID: ${t.id}`);
    errors++;
  }
  idSet.add(t.id);

  if (!t.name || !t.nameHindi) {
    console.error(`✗ Template ${t.id} missing name or nameHindi`);
    errors++;
  }
  if (!t.background || !t.decorations || !t.texts) {
    console.error(`✗ Template ${t.id} missing background, decorations, or texts`);
    errors++;
  }
  if (t.dimensions.width !== 1080 || t.dimensions.height !== 1920) {
    console.error(`✗ Template ${t.id} invalid dimensions ${t.dimensions.width}x${t.dimensions.height}`);
    errors++;
  }
}

console.log(`Unique template IDs verified: ${idSet.size}`);
if (errors === 0) {
  console.log('★ ALL 40 TEMPLATES PASSED STRUCTURAL INTEGRITY CHECKS ★');
} else {
  console.error(`Found ${errors} errors.`);
  process.exit(1);
}
