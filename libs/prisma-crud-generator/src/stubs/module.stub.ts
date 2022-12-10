export const moduleStub = `
/*****    AUTO-GENERATED FILE - DO NOT MODIFY   *****/

import { Module } from '@nestjs/common';
import { #{ServiceName} } from './#{ServiceFileName}';
import { #{ControllerName} } from './#{ControllerFileName}';

@Module({
  controllers: [#{ControllerName}],
  providers: [#{ServiceName}]
})
export class #{Model}Module {}`;