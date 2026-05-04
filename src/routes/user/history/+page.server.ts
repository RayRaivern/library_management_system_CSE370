import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	// 1. Get userId from cookies
	const userId = cookies.get('userId');

	if (!userId) {
		throw redirect(303, '/login');
	}

	// 2. Fetch User basic info
	const [userRows]: any = await db.query(
		'SELECT id, username, membership_tier FROM User WHERE id = ?',
		[userId]
	);

	if (userRows.length === 0) {
		throw redirect(303, '/login');
	}

	// 3. Fetch Borrow History with Book details
	// We join Loans -> Copy -> Book to get the book name and ISBN
	const [loans]: any = await db.query(
		`
        SELECT 
            l.*,
            c.barcode,
            b.name as book_title,
            b.ISBN
        FROM Loans l
        JOIN Copy c ON l.barcode = c.barcode
        JOIN Book b ON c.ISBN = b.ISBN
        WHERE l.user_id = ?
        ORDER BY l.borrow_date DESC
    `,
		[userId]
	);

	return {
		user: userRows[0],
		loans: loans
	};
};
