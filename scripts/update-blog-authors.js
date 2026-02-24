#!/usr/bin/env node
/**
 * Migration: Update blog post author schema from Organization → Person
 * Author: Christopher Müller (CEO & Founder, Muller y Pérez)
 *
 * Handles 3 patterns found across 47 blog posts:
 *   1. Multi-line block with url (most posts, any indentation)
 *   2. One-line without trailing comma
 *   3. One-line with trailing comma
 *
 * Run from project root: node scripts/update-blog-authors.js
 */

const fs = require('fs')
const path = require('path')

const BLOG_DIR = path.join(__dirname, '../app/blog')

// Build the Person schema replacement preserving original indentation
function personAuthorBlock(indent, trailingComma = true) {
  const i = indent
  const i2 = i + '  '
  const i3 = i + '    '
  return [
    `${i}author: {`,
    `${i2}'@type': 'Person',`,
    `${i2}name: 'Christopher Müller',`,
    `${i2}url: 'https://www.mulleryperez.cl/equipo/christopher-muller',`,
    `${i2}sameAs: [`,
    `${i3}'https://www.linkedin.com/in/christophermullerm/',`,
    `${i3}'https://www.mulleryperez.cl'`,
    `${i2}],`,
    `${i2}jobTitle: 'CEO & Founder',`,
    `${i2}worksFor: {`,
    `${i3}'@type': 'Organization',`,
    `${i3}name: 'Muller y Pérez',`,
    `${i3}url: 'https://www.mulleryperez.cl'`,
    `${i2}}`,
    `${i}}${trailingComma ? ',' : ''}`,
  ].join('\n')
}

const dirs = fs.readdirSync(BLOG_DIR).filter(d => {
  return fs.statSync(path.join(BLOG_DIR, d)).isDirectory()
})

let updated = 0
let skipped = 0
let errors = 0

for (const dir of dirs) {
  const filePath = path.join(BLOG_DIR, dir, 'page.tsx')
  if (!fs.existsSync(filePath)) continue

  let content = fs.readFileSync(filePath, 'utf8')
  const original = content

  try {
    // Pattern 1: Multi-line block with url and trailing comma
    // Matches any leading whitespace (indent), then the 4-line author block
    content = content.replace(
      /^([ \t]*)author: \{\r?\n[ \t]*'@type': 'Organization',\r?\n[ \t]*name: 'Muller y Pérez',\r?\n[ \t]*url: 'https:\/\/www\.mulleryperez\.cl'\r?\n[ \t]*\},/gm,
      (_, indent) => personAuthorBlock(indent, true)
    )

    // Pattern 2: One-line, no trailing comma (last property in object)
    content = content.replace(
      /^([ \t]*)author: \{ '@type': 'Organization', name: 'Muller y Pérez' \}$/gm,
      (_, indent) => personAuthorBlock(indent, false)
    )

    // Pattern 3: One-line, with trailing comma
    content = content.replace(
      /^([ \t]*)author: \{ '@type': 'Organization', name: 'Muller y Pérez' \},$/gm,
      (_, indent) => personAuthorBlock(indent, true)
    )

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8')
      console.log(`✓  ${dir}`)
      updated++
    } else {
      console.log(`—  ${dir} (sin cambios)`)
      skipped++
    }
  } catch (err) {
    console.error(`✗  ${dir}: ${err.message}`)
    errors++
  }
}

console.log(`\n✓ Actualizados: ${updated}`)
console.log(`— Sin cambios:  ${skipped}`)
if (errors > 0) console.log(`✗ Errores:      ${errors}`)
