import { db } from '$lib/server/db';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {

  if (!locals.user) {
    throw redirect(303, '/login');
  }

  const userId = locals.user.id;
  const { isbn } = params;

  // Borrow history
  const [historyRows]: any = await db.query(
    `SELECT 
        l.loan_id,
        l.borrow_date,
        l.due_date,
        l.return_date,
        b.name AS book_name,
        b.ISBN,
        c.barcode
     FROM Loans l
     JOIN Copy c ON l.barcode = c.barcode
     JOIN Book b ON c.ISBN = b.ISBN
     WHERE l.user_id = ?
     ORDER BY l.borrow_date DESC`,
    [userId]
  );

  // Book
  const [bookRows]: any = await db.query(
    'SELECT * FROM Book WHERE ISBN = ?',
    [isbn]
  );

  if (bookRows.length === 0) {
    throw error(404, 'Book not found');
  }

  // Categories
  const [categoryRows]: any = await db.query(
    'SELECT category_type, value FROM Book_Categories WHERE ISBN = ?',
    [isbn]
  );

  // Reviews
  const [reviewRows]: any = await db.query(
    `SELECT r.*, u.username 
     FROM Review r 
     JOIN User u ON r.user_id = u.id 
     WHERE r.ISBN = ? 
     ORDER BY r.date_and_time DESC`,
    [isbn]
  );

  const userHasReviewed = reviewRows.some((r: any) => r.user_id === userId);

  return {
    history: historyRows,
    book: bookRows[0],
    categories: categoryRows,
    reviews: reviewRows,
    userHasReviewed
  };
};

export const actions: Actions = {
  addReview: async ({ request, params, locals }) => {
    // Check if loggged in or not
    if (!locals.user) {
      throw redirect(303, '/login');
    }

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
    } catch (err) {
      console.error(err);
      return fail(500, { message: "Failed to submit review." });
    }
  },

  editReview: async ({ request, params, locals }) => {
    if (!locals.user) throw redirect(303, '/login');

    const data = await request.formData();
    const title = data.get('title');
    const rating = data.get('rating');
    const content = data.get('content');
    const originalDate = data.get('date_and_time'); 

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
      await db.query(
        `UPDATE Review 
        SET title = ?, rating = ?, content = ?, last_edit_date = ? 
          WHERE ISBN = ? AND user_id = ?`,
          [title, rating, content, now, params.isbn, locals.user.id]
      );
      return { success: true };
    } catch (err) {
      return fail(500, { message: "Update failed" });
    }
  }
};
