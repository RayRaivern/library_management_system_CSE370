import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Basic Admin Check (referencing your 'admin' tinyint column)
	if (!locals.user || !locals.user.admin) {
		throw error(403, 'Forbidden: Admin access only');
	}

	// Fetch all users and their tier limits
	const [users]: any = await db.query(`
        SELECT u.*, m.borrow_limit, m.reservation_limit 
        FROM User u
        LEFT JOIN Membership_Tiers m ON u.membership_tier = m.tier_name
    `);

	// Fetch ALL active loans (not returned) to filter in the frontend
	const [activeLoans]: any = await db.query(`
        SELECT l.*, b.name as title, u.id as user_id
        FROM Loans l
        JOIN Copy c ON l.barcode = c.barcode
        JOIN Book b ON c.ISBN = b.ISBN
        JOIN User u ON l.user_id = u.id
        WHERE l.return_date IS NULL
    `);

	// Fetch ALL active reservations
	const [activeReservations]: any = await db.query(`
        SELECT r.*, b.name as title, u.id as user_id
        FROM Reservations r
        JOIN Book b ON r.ISBN = b.ISBN
        JOIN User u ON r.user_id = u.id
    `);

	return {
		allUsers: users,
		allLoans: activeLoans,
		allReservations: activeReservations
	};
};

export const actions: Actions = {
	returnBook: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { message: 'Unauthorized' });

		const data = await request.formData();
		const barcode = data.get('barcode');
		const loanId = data.get('loan_id');

		if (!barcode || !loanId) return fail(400, { message: 'Missing info' });

		const today = new Date().toISOString().slice(0, 10);

		try {
			// 1. Mark the current loan as returned
			await db.query('UPDATE Loans SET return_date = ? WHERE loan_id = ?', [today, loanId]);

			// 2. Find the ISBN of this book to check for reservations
			const [copyInfo]: any = await db.query('SELECT ISBN FROM Copy WHERE barcode = ?', [barcode]);
			const isbn = copyInfo[0].ISBN;

			// 3. Check for the earliest reservation for this ISBN
			const [reservations]: any = await db.query(
				'SELECT * FROM Reservations WHERE ISBN = ? ORDER BY reserve_date ASC LIMIT 1',
				[isbn]
			);

			if (reservations.length > 0) {
				const nextUser = reservations[0];
				const dueDateObj = new Date();
				dueDateObj.setDate(dueDateObj.getDate() + 14);
				const dueDate = dueDateObj.toISOString().slice(0, 10);

				// 4. Automatically create a new loan for the reserving user
				await db.query(
					`INSERT INTO Loans (barcode, user_id, borrow_date, due_date) 
                 VALUES (?, ?, ?, ?)`,
					[barcode, nextUser.user_id, today, dueDate]
				);

				// 5. Delete the reservation now that it has been fulfilled[cite: 1]
				await db.query('DELETE FROM Reservations WHERE reservation_id = ?', [
					nextUser.reservation_id
				]);

				// Note: The Copy status remains 'Loaned' because it went from one user to another[cite: 1]
				return { success: true, message: 'Book returned and assigned to next reserver.' };
			} else {
				// 6. No reservations? Set the status back to Available[cite: 1]
				await db.query("UPDATE Copy SET status = 'Available' WHERE barcode = ?", [barcode]);
				return { success: true, message: 'Book returned and is now Available.' };
			}
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'Failed to process return.' });
		}
	}
};
