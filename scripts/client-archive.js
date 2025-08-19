import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

// Read current version
const versionPath = 'version.js';
const versionContent = readFileSync(versionPath, 'utf-8');
const currentVersion = versionContent.match(/VERSION = '([^']+)'/)[1];

// Projects should already be built by npm run archive command

// Archive name with current version
const archiveName = `wheel-dragon-project-v${currentVersion}.zip`;
const archivePath = `dist/${archiveName}`;

console.log(`Creating client archive: ${archiveName}`);

// Backup original files
const gitignoreOriginal = readFileSync('.gitignore', 'utf-8');
const packageOriginal = readFileSync('package.json', 'utf-8');

try {
    // Create clean package.json for client
    const packageData = JSON.parse(packageOriginal);
    const cleanPackage = {
        name: packageData.name,
        private: packageData.private,
        version: packageData.version,
        type: packageData.type,
        scripts: {
            dev: packageData.scripts.dev,
            build: packageData.scripts.build,
            preview: packageData.scripts.preview,
            "build:all": packageData.scripts["build:all"],
            "build:button": packageData.scripts["build:button"],
            "build:auto": packageData.scripts["build:auto"],
            "build:button-canada": packageData.scripts["build:button-canada"],
            "build:auto-canada": packageData.scripts["build:auto-canada"],
            "deploy:all": packageData.scripts["deploy:all"]
        },
        devDependencies: packageData.devDependencies,
        dependencies: packageData.dependencies
    };
    
    // Remove CLAUDE.md from .gitignore temporarily
    const cleanGitignore = gitignoreOriginal.replace(/^# Claude Code\nCLAUDE\.md\n$/gm, '');
    
    // Write temporary files
    writeFileSync('package.json', JSON.stringify(cleanPackage, null, 2));
    writeFileSync('.gitignore', cleanGitignore);
    
    // Files and directories to exclude from client archive
    const excludePatterns = [
        '*.zip',           // existing archives
        '.env*',           // all environment files
        'node_modules/*',  // dependencies
        '.git/*',         // git history
        '.vscode/*',      // editor settings
        '.idea/*',        // IDE settings
        'CLAUDE.md',      // private instructions
        'scripts/*',      // archive scripts
        'pglite-debug.log', // debug logs
        '*.log',          // all log files
        '.firebase/*',    // firebase cache
        'firebase-debug.log',
        '.firebaserc'     // firebase config
    ];

    // Create zip archive excluding sensitive files
    const excludeArgs = excludePatterns.map(pattern => `-x "${pattern}"`).join(' ');
    const command = `zip -r "dist/${archiveName}" . ${excludeArgs}`;
    
    console.log('Excluding sensitive files from archive...');
    execSync(command, { stdio: 'inherit' });
    
    console.log(`Client archive created successfully: ${archivePath}`);
    console.log('Archive contains clean source code and built projects.');
    
} catch (error) {
    console.error('Failed to create client archive:', error.message);
    process.exit(1);
} finally {
    // Restore original files
    writeFileSync('package.json', packageOriginal);
    writeFileSync('.gitignore', gitignoreOriginal);
    console.log('Restored original files.');
}