import { readFileSync, writeFileSync } from 'fs';

// Read current version
const versionPath = 'version.js';
const versionContent = readFileSync(versionPath, 'utf-8');
const currentVersion = versionContent.match(/VERSION = '([^']+)'/)[1];

// Increment version (patch)
const versionParts = currentVersion.split('.').map(Number);
versionParts[2] += 1;
const newVersion = versionParts.join('.');

console.log(`Updating version from ${currentVersion} to ${newVersion}`);

// Update version.js
const newVersionContent = `export const VERSION = '${newVersion}';\n`;
writeFileSync(versionPath, newVersionContent);

console.log(`Version updated to ${newVersion}`);