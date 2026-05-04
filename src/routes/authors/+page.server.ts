import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    // Fetch all books with authors, ordered by author name
    const [books]: any = await db.query(`
        SELECT ISBN, name, author, times_borrowed, language
        FROM Book
        WHERE author IS NOT NULL AND author != ''
        ORDER BY author ASC, name ASC
    `);

    return {
        books
    };
};
