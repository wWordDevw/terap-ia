import { Module } from '@nestjs/common';
import { NotesControllerSimple } from './notes.controller.simple';
import { NotesServiceSimple } from './notes.service.simple';

@Module({
  controllers: [NotesControllerSimple],
  providers: [NotesServiceSimple],
  exports: [NotesServiceSimple],
})
export class NotesModuleSimple {}
