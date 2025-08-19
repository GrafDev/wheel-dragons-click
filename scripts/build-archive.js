import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

// Read current version
const versionPath = 'version.js';
const versionContent = readFileSync(versionPath, 'utf-8');
const currentVersion = versionContent.match(/VERSION = '([^']+)'/)[1];

// Get project name from command line argument or default to 'button'
const projectMode = process.argv[2] || 'button';
const projectDir = `dist/wheel-dragon-${projectMode}`;

if (!existsSync(projectDir)) {
    console.error(`Project directory ${projectDir} does not exist!`);
    process.exit(1);
}

// Create archive with version in name
const archiveName = `wheel-dragon-${projectMode}-v${currentVersion}.zip`;
const archivePath = `dist/${archiveName}`;

console.log(`Creating archive: ${archiveName}`);

// Move old archives to 00_ARCHIVES folder
const archiveFolder = 'dist/00_ARCHIVES';
try {
    // Check if archive folder exists, if not create it
    if (!existsSync(archiveFolder)) {
        execSync(`mkdir -p "${archiveFolder}"`);
    } else {
        // Clear old archives from 00_ARCHIVES folder
        execSync(`rm -f "${archiveFolder}"/*.zip`);
        console.log('Cleared old archives from 00_ARCHIVES folder');
    }
    
    // Move existing archives of same project type to 00_ARCHIVES
    const existingArchives = execSync(`find dist/ -maxdepth 1 -name "wheel-dragon-${projectMode}-*.zip"`, { encoding: 'utf8' }).trim();
    if (existingArchives) {
        execSync(`mv ${existingArchives.split('\n').join(' ')} "${archiveFolder}/" 2>/dev/null || true`);
        console.log(`Moved old ${projectMode} archives to 00_ARCHIVES`);
    }
} catch (error) {
    console.log('No old archives to move or error moving archives');
}

try {
    // Create zip archive
    execSync(`cd ${projectDir} && zip -r ../${archiveName} .`, { stdio: 'inherit' });
    console.log(`Archive created successfully: ${archivePath}`);
} catch (error) {
    console.error('Failed to create archive:', error.message);
    process.exit(1);
}