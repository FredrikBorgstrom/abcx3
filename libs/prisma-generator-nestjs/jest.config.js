"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    displayName: 'prisma-generator-nestjs',
    preset: '../../jest.preset.js',
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.spec.json',
        },
    },
    testEnvironment: 'node',
    transform: {
        '^.+\\.[tj]s$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: '../../coverage/libs/prisma-generator-nestjs',
};
//# sourceMappingURL=jest.config.js.map