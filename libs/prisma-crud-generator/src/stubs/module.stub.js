"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleStub = void 0;
exports.moduleStub = `
/*****    AUTO-GENERATED FILE - DO NOT MODIFY   *****/

import { Module } from '@nestjs/common';
import { #{ServiceName} } from './#{ServiceFileName}';
import { #{ControllerName} } from './#{ControllerFileName}';

@Module({
  controllers: [#{ControllerName}],
  providers: [#{ServiceName}]
})
export class #{Model}Module {}`;
//# sourceMappingURL=module.stub.js.map