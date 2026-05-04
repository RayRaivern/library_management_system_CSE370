import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    // 1. Fetch top 10 books by popularity
    // We group by ISBN to handle the join with tags correctly
    const [books]: any = await db.query(`
        SELECT 
            b.ISBN, 
            b.name, 
            b.author, 
            b.times_borrowed,
            GROUP_CONCAT(bt.tag) as tags
        FROM Book b
        LEFT JOIN Book_Tags bt ON b.ISBN = bt.ISBN
        GROUP BY b.ISBN
        ORDER BY b.times_borrowed DESC
        LIMIT 10
    `);

    return {
        popularBooks: books.map((book: any) => ({
            ...book,
            // Convert the comma-separated string from GROUP_CONCAT into an array
            tags: book.tags ? book.tags.split(',') : []
        }))
    };
};
