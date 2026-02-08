import type { IndexSettings, IndexMappings } from '../tdo/create-index.tdo';

export const moviesIndexSettings: IndexSettings = {
  analysis: {
    tokenizer: {
      edge_ngram_tokenizer: {
        type: 'edge_ngram',
        min_gram: 2,
        max_gram: 10,
        token_chars: ['letter', 'digit'],
      },
    },
    analyzer: {
      edge_ngram_analyzer: {
        type: 'custom',
        tokenizer: 'edge_ngram_tokenizer',
      },
    },
  },
};

export const moviesIndexMappings: IndexMappings = {
  properties: {
    name: {
      type: 'text',
      analyzer: 'edge_ngram_analyzer',
      search_analyzer: 'standard',
    },
    title: {
      type: 'text',
      analyzer: 'edge_ngram_analyzer',
      search_analyzer: 'standard',
    },
    description: {
      type: 'text',
      analyzer: 'edge_ngram_analyzer',
      search_analyzer: 'standard',
    },
    suggest: { type: 'completion' },
  },
};
