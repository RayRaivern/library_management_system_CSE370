import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
	const { type, value } = params;

	try {
		/**
		 * We join Books with Book_Categories to find all books
		 * that match the specific category_type and value.
		 */
		const [books] = await db.query(
			`
            SELECT b.*
            FROM Book b
            JOIN Book_Categories bc ON b.ISBN = bc.ISBN
            WHERE bc.category_type = ? AND bc.value = ?
        `,
			[type, value]
		);

		return {
			category: {
				type,
				value
			},
			books: books as any[]
		};
	} catch (error) {
		console.error('Error fetching books by category:', error);
		return {
			category: { type, value },
			books: [],
			error: 'Could not retrieve books for this category.'
		};
	}
};
