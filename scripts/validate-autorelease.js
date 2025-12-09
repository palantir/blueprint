#!/usr/bin/env node
/**
 * Validate autorelease configuration and show what would be released
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const { execSync } = require('child_process');

console.log('=== Autorelease Configuration Validator ===\n');

// Read and parse autorelease.yml
const configPath = path.join(__dirname, '../.palantir/autorelease.yml');
let config;
try {
  config = yaml.parse(fs.readFileSync(configPath, 'utf8'));
  console.log('✓ YAML syntax is valid\n');
} catch (e) {
  console.error('✗ YAML syntax error:', e.message);
  process.exit(1);
}

// Validate groups
console.log(`Found ${Object.keys(config.groups).length} release groups:\n`);

const issues = [];
for (const [groupName, groupConfig] of Object.entries(config.groups)) {
  console.log(`📦 ${groupName}`);
  console.log(`   Tag prefix: ${groupConfig.tag_prefix}`);
  console.log(`   Method: ${groupConfig.method}`);
  console.log(`   Paths:`);

  const packages = [];
  for (const pkgPath of groupConfig.paths) {
    const fullPath = path.join(__dirname, '..', pkgPath);
    const pkgJsonPath = path.join(fullPath, 'package.json');

    if (fs.existsSync(pkgJsonPath)) {
      const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
      const isPrivate = pkgJson.private ? ' (private)' : '';
      console.log(`     - ${pkgPath} → ${pkgJson.name}@${pkgJson.version}${isPrivate}`);
      packages.push({ name: pkgJson.name, path: pkgPath, version: pkgJson.version, private: pkgJson.private });
    } else {
      console.log(`     - ${pkgPath} → ⚠️  package.json not found`);
      issues.push(`Group '${groupName}' references non-existent path: ${pkgPath}`);
    }
  }

  // Check for version consistency in multi-package groups
  if (packages.length > 1) {
    const versions = [...new Set(packages.map(p => p.version))];
    if (versions.length > 1) {
      console.log(`     ⚠️  Multiple versions in group: ${versions.join(', ')}`);
      issues.push(`Group '${groupName}' has packages with different versions`);
    }
  }

  console.log('');
}

// Check for packages not in any group
const allPackages = fs.readdirSync(path.join(__dirname, '../packages'))
  .filter(dir => {
    const pkgPath = path.join(__dirname, '../packages', dir, 'package.json');
    return fs.existsSync(pkgPath);
  });

const coveredPackages = new Set();
for (const groupConfig of Object.values(config.groups)) {
  for (const pkgPath of groupConfig.paths) {
    const dirName = pkgPath.replace('packages/', '');
    coveredPackages.add(dirName);
  }
}

const uncoveredPackages = allPackages.filter(pkg => !coveredPackages.has(pkg));
if (uncoveredPackages.length > 0) {
  console.log('⚠️  Packages not in any autorelease group:');
  for (const pkg of uncoveredPackages) {
    const pkgJson = JSON.parse(fs.readFileSync(
      path.join(__dirname, '../packages', pkg, 'package.json'),
      'utf8'
    ));
    const isPrivate = pkgJson.private ? ' (private - OK)' : ' (⚠️  will not be released)';
    console.log(`   - ${pkg}${isPrivate}`);
  }
  console.log('');
}

// Summary
if (issues.length > 0) {
  console.log('❌ Issues found:');
  issues.forEach(issue => console.log(`   - ${issue}`));
  process.exit(1);
} else {
  console.log('✅ Configuration looks good!');
  console.log('\nTo test on a real branch:');
  console.log('  1. Create a test branch');
  console.log('  2. Add a changelog entry to any package');
  console.log('  3. Push to GitHub and check the CI pipeline');
  console.log('  4. Autorelease will comment on the PR showing what it would release');
}
