export const moduleStub = `
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