export * from './file_utils';
export * from './stringFns';
export * from './prisma.helper';
export * from './utils';

import {config} from 'dotenv';
import { expand } from 'dotenv-expand';

export function initEnv() {
    const env = config();
    expand(env);
}
