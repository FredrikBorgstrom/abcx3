const {build} = require('esbuild');

const {nodeExternals} = require ('esbuild-plugin-node-externals');

build({
    entryPoints: ['./libs/prisma-generator-dart/src/generator.ts'],
    outfile: 'built/prisma-generator-dart/index.js',
    bundle: true,
    minify: true,
    platform: 'node',
    sourcemap: false,
    target: 'node18',
    plugins: [nodeExternals({
        packagePaths: ['package.json', './libs/prisma-generator-dart/package.json']
    })]
}).catch((err) => {
    console.log(err);
    process.exit(1);
});


/* esbuild.build({
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
}); */