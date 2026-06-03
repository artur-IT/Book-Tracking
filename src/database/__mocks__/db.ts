const noop = async () => undefined;

export const db = {
  books: {
    clear: noop,
    count: async () => 0,
    bulkPut: noop,
  },
};

export type Book = {
  id: number;
  title: string;
  author: string;
  isbn: number;
  pages: number;
  rating: number;
  createdAt: string;
};
