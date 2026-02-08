export type IndexMappingProperty = {
  type:
    | 'text'
    | 'keyword'
    | 'long'
    | 'integer'
    | 'short'
    | 'byte'
    | 'double'
    | 'float'
    | 'boolean'
    | 'date'
    | 'nested'
    | 'object'
    | 'geo_point'
    | 'ip'
    | 'completion';
  analyzer?: string;
  search_analyzer?: string;
  format?: string;
  fields?: Record<string, IndexMappingProperty>;
  properties?: Record<string, IndexMappingProperty>;
};

export type IndexMappings = {
  properties: Record<string, IndexMappingProperty>;
};

export type IndexSettings = {
  number_of_shards?: number;
  number_of_replicas?: number;
  analysis?: {
    analyzer?: Record<
      string,
      { type: string; tokenizer?: string; filter?: string[] }
    >;
    tokenizer?: Record<string, { type: string; [key: string]: unknown }>;
    filter?: Record<string, { type: string; [key: string]: unknown }>;
  };
};

export class CreateIndexDto {
  name: string;
  settings?: IndexSettings;
  mappings?: IndexMappings;
}
