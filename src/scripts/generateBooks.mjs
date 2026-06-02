import { writeFileSync } from 'fs';

const books = [];
for (let i = 0; i < 200000; i++) {
  books.push({
    id: Math.floor(Math.random() * 1_000_000_000_000),
    title: `Book ${i}`,
    author: `Author ${i}`,
    isbn: Math.floor(Math.random() * 1_000_000_000_000),
    pages: Math.floor(Math.random() * 1000),
    rating: Math.floor(Math.random() * 5),
  });
}

const data = { books };

writeFileSync(
  'src/database/largeBooks.json',
  JSON.stringify(data, null, 2),
  'utf-8',
);

console.log('Zapisano', books.length, 'książek');
