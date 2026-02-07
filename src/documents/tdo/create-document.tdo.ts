export class CreateDocumentDto {
  document: Record<string, unknown>;
  id?: string;
}

export class UpdateDocumentDto {
  document: Record<string, unknown>;
}

export class SearchDocumentDto {
  query: Record<string, unknown>;
  size?: number;
  from?: number;
  sort?: Record<string, unknown>[];
}
