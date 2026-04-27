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

  // ✅ NEW: Fetch authors
  const [authorRows]: any = await db.query(
    `SELECT a.name 
     FROM Author a
     JOIN Book_Authors ba ON a.author_id = ba.author_id
     WHERE ba.ISBN = ?`,
    [isbn]
  );

  // 2. Fetch categories
  const [categoryRows]: any = await db.query(
    'SELECT category_type, value FROM Book_Categories WHERE ISBN = ?',
    [isbn]
  );

  // 3. Fetch reviews
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
    authors: authorRows, // ✅ NEW
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
  }
};
