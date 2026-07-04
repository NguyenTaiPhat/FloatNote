const { execSync } = require('child_process');

console.log('🔨 Building Electron files...\n');

const electronFiles = [
    'electron/main.ts',
    'electron/preload.ts',
    'electron/database.ts',
    'electron/backup.ts',
    'electron/settings.ts',
    'electron/ipc/cards.ts',
    'electron/ipc/workspaces.ts',
    'electron/ipc/settings.ts',
];

const tscCommand = `tsc ${electronFiles.join(' ')} --outDir electron --module commonjs --target ES2020 --moduleResolution node --esModuleInterop --skipLibCheck --types node --declaration false`;

try {
    console.log('Compiling TypeScript files...');
    execSync(tscCommand, { stdio: 'inherit' });
    console.log('\n✅ Electron files compiled successfully!\n');
} catch (error) {
    console.error('\n❌ TypeScript compilation failed:', error.message);
    process.exit(1);
}
