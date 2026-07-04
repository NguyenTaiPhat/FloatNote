module.exports = {
    appId: 'com.floatnote.app',
    productName: 'FloatNote',
    files: [
        'dist/**/*',
        'electron/**/*.js',
        'assets/**/*',
        'package.json',
        '!electron/**/*.ts',
        '!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme,test,__tests__,tests,powered-test,example,examples}',
        '!**/node_modules/*/.bin',
        '!**/node_modules/*.d.ts',
        '!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}',
        '!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}',
        '!**/{__pycache__,thumbs.db,.flowconfig,.idea,.vs,.nyc_output}',
        '!**/{npm-debug.log,yarn.lock,.yarn-integrity,.yarn-metadata.json}'
    ],
    asarUnpack: [
        'node_modules/better-sqlite3/**/*',
        'node_modules/sharp/**/*'
    ],
    directories: {
        buildResources: 'assets'
    },
    win: {
        target: [
            {
                target: 'nsis',
                arch: ['x64', 'ia32']
            },
            {
                target: 'portable',
                arch: ['x64']
            }
        ],
        icon: 'assets/icon.ico'
    },
    compression: 'maximum',
    removePackageScripts: true,
    npmRebuild: true,
    beforePack: async (context) => {
        // Remove dev dependencies before packing
        const { execSync } = require('child_process');
        console.log('🧹 Pruning dev dependencies...');
        try {
            execSync('npm prune --production', {
                cwd: context.appDir,
                stdio: 'inherit'
            });
        } catch (error) {
            console.warn('Warning: Failed to prune dependencies');
        }
    },
    afterPack: async (context) => {
        // Reinstall all deps after packing
        const { execSync } = require('child_process');
        console.log('📦 Reinstalling all dependencies...');
        try {
            execSync('npm install', {
                cwd: context.appDir,
                stdio: 'inherit'
            });
        } catch (error) {
            console.warn('Warning: Failed to reinstall dependencies');
        }
    }
};
