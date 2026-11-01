import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClockService } from '../common/clock/clock.service';
import { loadJson } from '../common/utils/load-json';
import { buildDocuments } from './documents.logic';
import { DocumentsFile } from './documents.types';

@Injectable()
export class DocumentsService implements OnModuleInit {
  private file!: DocumentsFile;

  constructor(private readonly clock: ClockService) {}

  onModuleInit() {
    this.file = loadJson<DocumentsFile>('mock-documents.json');
  }

  getDocuments() {
    return buildDocuments(this.file, this.clock.today());
  }
}
