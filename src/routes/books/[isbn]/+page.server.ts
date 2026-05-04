import { db } from '$lib/server/db';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	// Getting isbn from the link parameter
	const { isbn } = params;

	const [bookRows]: any = await db.query('SELECT * FROM Book WHERE ISBN = ?', [isbn]);

	if (bookRows.length === 0) {
		throw error(404, 'Book not found');
	}

	const [categoryRows]: any = await db.query(
		'SELECT category_type, value FROM Book_Categories WHERE ISBN = ?',
		[isbn]
	);

	const [copyRows]: any = await db.query(
		'SELECT barcode, status, `condition`, acquisition_date FROM Copy WHERE ISBN = ?',
		[isbn]
	);

	// Feature 7
	const [reviewRows]: any = await db.query(
		`SELECT r.*, u.username 
    FROM Review r 
    JOIN User u ON r.user_id = u.id 
    WHERE r.ISBN = ? 
      ORDER BY r.date_and_time DESC`,
		[isbn]
	);

	// Feature 8 (Checking status of copies by deriving from Loans table)
	const [loanRows]: any = await db.query(
		`SELECT l.* FROM Loans l
   JOIN Copy c ON l.barcode = c.barcode
   WHERE c.ISBN = ?`,
		[isbn]
	);

	const [reservationRows]: any = locals.user
		? await db.query('SELECT * FROM Reservations WHERE ISBN = ? AND user_id = ?', [
				isbn,
				locals.user.id
			])
		: [[]];

	const userHasReserved = reservationRows.length > 0;

	const userHasReviewed = locals.user
		? reviewRows.some((r: any) => r.user_id === locals.user.id)
		: false;

	return {
		book: bookRows[0],
		categories: categoryRows,
		reviews: reviewRows,
		copies: copyRows,
		loans: loanRows,
		userHasReserved,
		userHasReviewed
	};
};

export const actions: Actions = {
	// Feature 7
	addReview: async ({ request, params, locals }) => {
		// Check if loggged in or not
		if (!locals.user) {
			throw redirect(303, '/login');
		}

		// Get user inputs
		const data = await request.formData();
		const title = data.get('title');
		const rating = data.get('rating');
		const content = data.get('content');
		const isbn = params.isbn;
		const userId = locals.user.id;

		// Insert Review to database
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
			return fail(500, { message: 'Failed to submit review.' });
		}
	},

	// Feature 7
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
			return fail(500, { message: 'Update failed' });
		}
	},

	borrowBook: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/login');

		const data = await request.formData();
		const barcode = data.get('barcode');
		const userId = locals.user.id;

		if (!barcode) return fail(400, { message: 'Barcode is required.' });

		try {
			// 1. Get User's Membership Limit and Current Active Loan Count
			const [userLimit]: any = await db.query(
				`SELECT m.borrow_limit, (SELECT COUNT(*) FROM Loans WHERE user_id = ? AND return_date IS NULL) as current_loans
                 FROM User u JOIN Membership_Tiers m ON u.membership_tier = m.tier_name
                 WHERE u.id = ?`,
				[userId, userId]
			);

			if (userLimit[0].current_loans >= userLimit[0].borrow_limit) {
				return fail(400, {
					message: `Borrowing limit reached (${userLimit[0].borrow_limit} books).`
				});
			}

			const borrowDate = new Date().toISOString().slice(0, 10);
			const dueDateObj = new Date();
			dueDateObj.setDate(dueDateObj.getDate() + 14);
			const dueDate = dueDateObj.toISOString().slice(0, 10);

			await db.query(
				`INSERT INTO Loans (barcode, user_id, borrow_date, due_date) VALUES (?, ?, ?, ?)`,
				[barcode, userId, borrowDate, dueDate]
			);

			await db.query(`UPDATE Copy SET status = 'Loaned' WHERE barcode = ?`, [barcode]);

			return { success: true, action: 'borrow' };
		} catch (err) {
			return fail(500, { message: 'Failed to process the loan.' });
		}
	},

	reserveBook: async ({ params, locals }) => {
		if (!locals.user) throw redirect(303, '/login');

		const isbn = params.isbn;
		const userId = locals.user.id;

		try {
			// 1. Get User's Membership Limit and Current Active Reservation Count
			const [userLimit]: any = await db.query(
				`SELECT m.reservation_limit, (SELECT COUNT(*) FROM Reservations WHERE user_id = ?) as current_reservations
                 FROM User u JOIN Membership_Tiers m ON u.membership_tier = m.tier_name
                 WHERE u.id = ?`,
				[userId, userId]
			);

			if (userLimit[0].current_reservations >= userLimit[0].reservation_limit) {
				return fail(400, {
					message: `Reservation limit reached (${userLimit[0].reservation_limit} books).`
				});
			}

			// 2. Prevent duplicate reservation for the same book[cite: 2]
			const [existing]: any = await db.query(
				'SELECT 1 FROM Reservations WHERE ISBN = ? AND user_id = ?',
				[isbn, userId]
			);
			if (existing.length > 0) return fail(400, { message: 'Already reserved.' });

			const reserveDate = new Date().toISOString().slice(0, 10);
			await db.query(`INSERT INTO Reservations (ISBN, user_id, reserve_date) VALUES (?, ?, ?)`, [
				isbn,
				userId,
				reserveDate
			]);

			return { success: true, action: 'reserve' };
		} catch (err) {
			return fail(500, { message: 'Failed to process the reservation.' });
		}
	}
};
