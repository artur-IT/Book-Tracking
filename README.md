# Book Tracking

Recruitment project.

Application for tracking reading books by user.

### Tech stack:

- React
- TypeScript
- Vite
- CSS Modules
- Database: **Dexie.js**
- Database: **200 000 records** (books)
- useContext for authentication
- Deploy: GitHub Pages

### Implemented features:

- Add a book:
  - Title
  - Author
  - ISBN
  - Pages
  - Rating 1-5
- View all books
- **Live search** book by title or author
- User:
  - Login
  - Logout
  - loading 200 000 books from Dexie database

### How to run project:

1. Clone repository
2. Run `npm install`
3. Run `npm run dev`

---

#### I'm Junior with no experience in first programming job, so I focused on time and I didn't have much time for all features:

- Better styling UI
- Optimize render components (10 mln records in database)
- Git: comments, branches, Pull Request descriptions, refactoring (not included in this project)
- Testing in Firefox, Edge (only Chrome is tested)
- Testing (Vitest, React Testing Library - only basic)
- Backend: PocketBase - I'm choosing it because it's minimal backend for web applications. It's new for me and I nedd to meet this technology

### COMMENTS

Realy nice idea (tracking books) project for me.

1. My real work time was approximately 10 hours (not included thinking time without computer).

2. Project descripton not included User login / logout features, but I think it's necessary so I added it. I'm using simple user and password for login - art / mat (in code base - I know it's not safe, but for this project it's enough).

3. Now I'm will finish project in my private time and develop it for including:

- build PocketBase backend
- build BookEdit / delete functionality
- build tests (**DONE**)
- checks for 10 mln records in database (partly **DONE** - for 200 000 books)
- better styling (**DONE**)
- crypting data in IndexedDB? (**DONE** - selected data in InexedDB is encrypted. Decrypted on the fly after login and displayed on screen (still encrypted in InedxedDB))

### AI

Only if I really needed. I used it for:

- fix errors in code (useContext, Dexie.js problems, routing problems)
- research for minimal free backend (choice: PocketBase)
- research for minimal free local DB (choice: Dexie.js)
- asking and explaining for proposal solutions
