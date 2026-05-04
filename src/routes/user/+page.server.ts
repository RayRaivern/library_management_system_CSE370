import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user.id;

	// 1. Get full User details
	const [userRows]: any = await db.query('SELECT * FROM User WHERE id = ?', [userId]);

	// 2. Get all Loans with Book/Copy details
	const [loanRows]: any = await db.query(
		`SELECT l.*, b.name as title, b.author 
         FROM Loans l
         JOIN Copy c ON l.barcode = c.barcode
         JOIN Book b ON c.ISBN = b.ISBN
         WHERE l.user_id = ?
         ORDER BY l.borrow_date DESC`,
		[userId]
	);

	// 3. Get all Reservations with Book details
	const [reservationRows]: any = await db.query(
		`SELECT r.*, b.name as title, b.author
         FROM Reservations r
         JOIN Book b ON r.ISBN = b.ISBN
         WHERE r.user_id = ?
         ORDER BY r.reserve_date DESC`,
		[userId]
	);

	return {
		// Return the full user object from DB (includes fine_amount, membership_tier, etc.)
		user: userRows[0] || locals.user,
		loans: loanRows,
		reservations: reservationRows
	};
};
