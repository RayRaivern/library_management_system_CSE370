import { db } from '$lib/server/db';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  const { isbn } = params;

  // 1. Fetch main book details
  const [bookRows]: any = await db.query(
    'SELECT * FROM Book WHERE ISBN = ?',
    [isbn]
  );

  if (bookRows.length === 0) {
    throw error(404, 'Book not found');
  }

  // 2. Fetch authors
  const [authorRows]: any = await db.query(
    `SELECT a.author_id, a.name 
     FROM Author a
     JOIN Book_Authors ba ON a.author_id = ba.author_id
     WHERE ba.ISBN = ?`,
    [isbn]
  );

  // 3. Fetch categories
  const [categoryRows]: any = await db.query(
    'SELECT category_type, value FROM Book_Categories WHERE ISBN = ?',
    [isbn]
  );

  // 4. Fetch reviews
  const [reviewRows]: any = await db.query(
    `SELECT r.*, u.username 
     FROM Review r 
     JOIN User u ON r.user_id = u.id 
     WHERE r.ISBN = ? 
     ORDER BY r.date_and_time DESC`,
    [isbn]
  );

  const userHasReviewed = locals.user
    ? reviewRows.some((r: any) => r.user_id === locals.user.id)
    : false;

  return {
    book: bookRows[0],
    authors: authorRows,
    categories: categoryRows,
    reviews: reviewRows,
    userHasReviewed
  };
};

export const actions: Actions = {
  addReview: async ({ request, params, locals }) => {
    if (!locals.user) throw redirect(303, '/login');

    const data = await request.formData();
    const title = data.get('title');
    const rating = data.get('rating');
    const content = data.get('content');
    const isbn = params.isbn;
    const userId = locals.user.id;

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
      await db.query(
        `INSERT INTO Review (ISBN, user_id, date_and_time, rating, title, content) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [isbn, userId, now, rating, title, content]
      );

      return { success: true };
    } catch {
      return fail(500, { message: "Failed to submit review." });
    }
  },

  editReview: async ({ request, params, locals }) => {
    if (!locals.user) throw redirect(303, '/login');

    const data = await request.formData();
    const title = data.get('title');
    const rating = data.get('rating');
    const content = data.get('content');

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
      await db.query(
        `UPDATE Review 
         SET title = ?, rating = ?, content = ?, last_edit_date = ? 
         WHERE ISBN = ? AND user_id = ?`,
        [title, rating, content, now, params.isbn, locals.user.id]
      );

      return { success: true };
    } catch {
      return fail(500, { message: "Update failed" });
    }
  },

  // ✅ STEP 5: Add Book
  addBook: async ({ request }) => {
    const data = await request.formData();

    const isbn = data.get('isbn');
    const name = data.get('name');
    const price = data.get('price');
    const language = data.get('language');
    const authors = data.getAll('authors'); // array of author names

    try {
      // Insert book
      await db.query(
        `INSERT INTO Book (ISBN, name, price, language) 
         VALUES (?, ?, ?, ?)`,
        [isbn, name, price, language]
      );

      // Insert authors + link
      for (const authorName of authors) {
        // check if exists
        const [existing]: any = await db.query(
          `SELECT author_id FROM Author WHERE name = ?`,
          [authorName]
        );

        let authorId;

        if (existing.length > 0) {
          authorId = existing[0].author_id;
        } else {
          const [result]: any = await db.query(
            `INSERT INTO Author (name) VALUES (?)`,
            [authorName]
          );
          authorId = result.insertId;
        }

        await db.query(
          `INSERT INTO Book_Authors (ISBN, author_id) VALUES (?, ?)`,
          [isbn, authorId]
        );
      }

      return { success: true };
    } catch (err) {
      console.error(err);
      return fail(500, { message: 'Failed to add book' });
    }
  },

  // ✅ STEP 6: Search
  searchBooks: async ({ request }) => {
    const data = await request.formData();
    const query = data.get('query');

    try {
      const [rows]: any = await db.query(
        `SELECT b.*, GROUP_CONCAT(a.name SEPARATOR ', ') AS authors
         FROM Book b
         LEFT JOIN Book_Authors ba ON b.ISBN = ba.ISBN
         LEFT JOIN Author a ON ba.author_id = a.author_id
         WHERE b.name LIKE ? OR a.name LIKE ?
         GROUP BY b.ISBN`,
        [`%${query}%`, `%${query}%`]
      );

      return { results: rows };
    } catch {
      return fail(500, { message: 'Search failed' });
    }
  }
};
