const {build} = require('esbuild');

const {nodeExternals} = require ('esbuild-plugin-node-externals');

// import {build} from 'esbuild';

// import {nodeExternals}  from 'esbuild-plugin-node-externals';

build({
    entryPoints: ['./libs/prisma-generator-nestjs/src/generator.ts'],
    outfile: 'built/prisma-generator-nestjs/index.js',
    bundle: true,
    minify: true,
    platform: 'node',
    sourcemap: false,
    target: 'node18',
    plugins: [nodeExternals({
        packagePaths: ['package.json', './libs/prisma-generator-nestjs/package.json' ]
    })]
}).catch((err) => {
    console.log(err);
    process.exit(1);
});


/* esbuild.build({
    entryPoints: ['./libs/prisma-generator-nestjs/src/generator.ts'],
    outfile: 'built/nestjs/prisma-generator-nestjs.js',
    bundle: true,
    minify: true,
    platform: 'node',
    sourcemap: false,
    target: 'node18'
}).catch((err) => {
    console.log(err);
    process.exit(1);
}); */