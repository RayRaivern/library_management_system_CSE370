import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Basic Admin Check (referencing your 'admin' tinyint column)
	if (!locals.user || !locals.user.admin) {
		throw error(403, 'Forbidden: Admin access only');
	}

	// New: Fetch all books and their total copy counts
	const [booksWithCounts]: any = await db.query(`
        SELECT b.ISBN, b.name, b.author, COUNT(c.barcode) as copy_count
        FROM Book b
        LEFT JOIN Copy c ON b.ISBN = c.ISBN
        GROUP BY b.ISBN
        ORDER BY b.name ASC
    `);

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
		allReservations: activeReservations,
		allBooks: booksWithCounts
	};
};

export const actions: Actions = {
	returnBook: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { message: 'Unauthorized' });

		const data = await request.formData();
		const barcode = data.get('barcode');
		const loanId = data.get('loan_id');

		if (!barcode || !loanId) return fail(400, { message: 'Missing info' });

		const today = new Date();
		const todayStr = today.toISOString().slice(0, 10);

		try {
			// 1. Fetch current loan info to check for overdue status
			const [loanRows]: any = await db.query(
				'SELECT user_id, due_date FROM Loans WHERE loan_id = ?',
				[loanId]
			);

			if (loanRows.length === 0) return fail(404, { message: 'Loan record not found' });

			const { user_id, due_date } = loanRows[0];
			const dueDate = new Date(due_date);

			// 2. Calculate fine if overdue (+100 per day)
			if (today > dueDate) {
				const diffTime = Math.abs(today.getTime() - dueDate.getTime());
				const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
				const fineIncrease = diffDays * 100;

				// Update the User's fine_amount in the User table
				await db.query('UPDATE User SET fine_amount = fine_amount + ? WHERE id = ?', [
					fineIncrease,
					user_id
				]);
			}

			// 3. Mark the current loan as returned
			await db.query('UPDATE Loans SET return_date = ? WHERE loan_id = ?', [todayStr, loanId]);

			// 4. Find the ISBN of this book to check for reservations
			const [copyInfo]: any = await db.query('SELECT ISBN FROM Copy WHERE barcode = ?', [barcode]);
			const isbn = copyInfo[0].ISBN;

			// 5. Check for the earliest reservation for this ISBN[cite: 1]
			const [reservations]: any = await db.query(
				'SELECT * FROM Reservations WHERE ISBN = ? ORDER BY reserve_date ASC LIMIT 1',
				[isbn]
			);

			if (reservations.length > 0) {
				const nextUser = reservations[0];
				const nextDueDateObj = new Date();
				nextDueDateObj.setDate(nextDueDateObj.getDate() + 14);
				const nextDueDate = nextDueDateObj.toISOString().slice(0, 10);

				// 6. Automatically create a new loan for the reserving user[cite: 1]
				await db.query(
					`INSERT INTO Loans (barcode, user_id, borrow_date, due_date) 
                     VALUES (?, ?, ?, ?)`,
					[barcode, nextUser.user_id, todayStr, nextDueDate]
				);

				// 7. Delete the reservation now that it has been fulfilled[cite: 1]
				await db.query('DELETE FROM Reservations WHERE reservation_id = ?', [
					nextUser.reservation_id
				]);

				return {
					success: true,
					message: 'Book returned. Fine calculated if overdue. Assigned to next reserver.'
				};
			} else {
				// 8. No reservations? Set the status back to Available[cite: 1]
				await db.query("UPDATE Copy SET status = 'Available' WHERE barcode = ?", [barcode]);
				return {
					success: true,
					message: 'Book returned. Fine calculated if overdue. Status: Available.'
				};
			}
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'Failed to process return.' });
		}
	}
};
