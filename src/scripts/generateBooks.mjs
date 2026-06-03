import { writeFileSync } from 'fs';

const randomAuthor = () => {
  const authors = [
    'John Doe',
    'Jane Smith',
    'Bob Johnson',
    'Alice Brown',
    'Charlie Davis',
    'Diana White',
    'Ethan Green',
    'Fiona Black',
    'George Gray',
    'Hannah Blue',
  ];
  return authors[Math.floor(Math.random() * authors.length)];
};

const books = [];
for (let i = 0; i < 200000; i++) {
  books.push({
    id: Math.floor(Math.random() * 1_000_000_000_000),
    title: `Book ${i}`,
    author: randomAuthor(),
    isbn: Math.floor(Math.random() * 1_000_000_000_000),
    pages: Math.floor(Math.random() * 1000),
    rating: Math.floor(Math.random() * 5),
    createdAt: new Date().toISOString(),
  });
}

const data = { books };

writeFileSync(
  'src/database/largeBooks.json',
  JSON.stringify(data, null, 2),
  'utf-8',
);

console.log('Zapisano', books.length, 'książek');
