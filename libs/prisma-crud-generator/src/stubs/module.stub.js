"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleStub = void 0;
exports.moduleStub = `
/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/

import { Module } from '@nestjs/common';
import { #{ServiceName} } from './#{ServicePath}';
import { DictionariesController } from './dictionaries.controller';

@Module({
  controllers: [DictionariesController],
  providers: [DictionariesService]
})
export class DictionariesModule {}`;
//# sourceMappingURL=module.stub.js.map