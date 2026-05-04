import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    // 1. Get search params from URL
    const bookName = url.searchParams.get('name') || '';
    const author = url.searchParams.get('author') || '';
    const tag = url.searchParams.get('tag') || '';
    const category = url.searchParams.get('category') || '';

    // 2. Fetch filter options for the UI
    const [tags]: any = await db.query('SELECT DISTINCT tag FROM Book_Tags ORDER BY tag ASC');
    const [categories]: any = await db.query('SELECT DISTINCT value FROM Book_Categories ORDER BY value ASC');

    // 3. Build dynamic SQL query
    let query = `
        SELECT DISTINCT b.* 
        FROM Book b
        LEFT JOIN Book_Tags bt ON b.ISBN = bt.ISBN
        LEFT JOIN Book_Categories bc ON b.ISBN = bc.ISBN
        WHERE 1=1
    `;
    
    const params: any[] = [];

    if (bookName) {
        query += ' AND b.name LIKE ?';
        params.push(`%${bookName}%`);
    }
    if (author) {
        query += ' AND b.author LIKE ?';
        params.push(`%${author}%`);
    }
    if (tag) {
        query += ' AND bt.tag = ?';
        params.push(tag);
    }
    if (category) {
        query += ' AND bc.value = ?';
        params.push(category);
    }

    const [books]: any = await db.query(query, params);

    return {
        books,
        filterOptions: {
            tags: tags.map((t: any) => t.tag),
            categories: categories.map((c: any) => c.value)
        },
        searchValues: { bookName, author, tag, category }
    };
};
