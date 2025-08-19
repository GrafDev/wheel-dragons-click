import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

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

// Get project name from command line argument or default to 'button'
const projectMode = process.argv[2] || 'button';
const projectDir = `dist/wheel-dragon-${projectMode}`;

if (!existsSync(projectDir)) {
    console.error(`Project directory ${projectDir} does not exist!`);
    process.exit(1);
}

// Create archive with version in name
const archiveName = `wheel-dragon-${projectMode}-v${newVersion}.zip`;
const archivePath = `dist/${archiveName}`;

console.log(`Creating archive: ${archiveName}`);

try {
    // Create zip archive
    execSync(`cd ${projectDir} && zip -r ../${archiveName} .`, { stdio: 'inherit' });
    console.log(`Archive created successfully: ${archivePath}`);
} catch (error) {
    console.error('Failed to create archive:', error.message);
    process.exit(1);
}