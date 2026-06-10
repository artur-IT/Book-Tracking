import 'fake-indexeddb/auto';

vi.mock('../database/largeBooks.json', () => ({
  default: { books: [] },
}));
