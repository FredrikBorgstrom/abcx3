const esbuild = require('esbuild');

/* const {nodeExternalsPlugin} = require ('esbuild-node-externals');

esbuild.build({
    entryPoints: ['./libs/prisma-generator-dart/src/generator.ts'],
    outfile: 'built/prisma-generator-dart.js',
    bundle: true,
    minify: true,
    platform: 'node',
    sourcemap: true,
    target: 'node18',
    plugins: [nodeExternalsPlugin()]
}).catch((err) => {
    console.log(err);
    process.exit(1);
}); */


esbuild.build({
    entryPoints: ['./libs/prisma-generator-dart/src/generator.ts'],
    outfile: 'built/dart/prisma-generator-dart.js',
    bundle: true,
    minify: true,
    platform: 'node',
    sourcemap: false,
    target: 'node18'
}).catch((err) => {
    console.log(err);
    process.exit(1);
});