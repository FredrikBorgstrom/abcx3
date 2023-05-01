const esbuild = require('esbuild');
const { nodeExternals } = require('esbuild-plugin-node-externals');
const fs = require('fs');

const libDir = 'libs';
const distDir = './dist';

module.exports = {

    buildLib: async function (libName, watch) {

        if (!fs.existsSync(`${distDir}/${libName}`)) {
            fs.mkdirSync(`${distDir}/${libName}`, { recursive: true });
        }

        fs.copyFileSync(`./${libDir}/${libName}/package.dist.json`,
            `${distDir}/${libName}/package.json`);

        fs.copyFileSync(`./${libDir}/${libName}/README.md`,
            `${distDir}/${libName}/README.md`);

        const context = await esbuild.context({
            entryPoints: [`./${libDir}/${libName}/src/generator.ts`],
            outfile: `${distDir}/${libName}/index.js`,
            bundle: true,
            minify: false,
            platform: 'node',
            sourcemap: false,
            target: 'node18',
            plugins: [nodeExternals({
                packagePaths: ['package.json', `./${libDir}/${libName}/package.json`]
            })]
        });

        // Manually do an incremental build
        const result = await context.rebuild();

        if (watch) {
            // Enable watch mode
            await context.watch();
        } else {
            // Manually dispose the context when done
            context.dispose();
        }
    }
}


/* module.exports = {

    buildLib: function (libName, watch) {

        if (!fs.existsSync(`${distDir}/${libName}`)) {
            fs.mkdirSync(`${distDir}/${libName}`, { recursive: true });
        }

        fs.copyFileSync(`./${libDir}/${libName}/package.dist.json`,
            `${distDir}/${libName}/package.json`);

        const buildParams = {
            entryPoints: [`./${libDir}/${libName}/src/generator.ts`],
            outfile: `${distDir}/${libName}/index.js`,
            bundle: true,
            minify: false,
            platform: 'node',
            sourcemap: false,
            target: 'node18',
            plugins: [nodeExternals({
                packagePaths: ['package.json', `./${libDir}/${libName}/package.json`]
            })]
        };

        if (watch) {
            buildParams.watch = {
                onRebuild(error, result) {
                    if (error) console.error('watch build failed:', error)
                    else console.log('watch build succeeded:', result)
                }
            }
        }

        build(buildParams).catch((err) => {
            console.log(err);
            process.exit(1);
        });
    }
} */


