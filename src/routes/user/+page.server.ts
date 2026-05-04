import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {

    const userId = locals.user.id;

    const [historyRows]: any = await db.query(
        `SELECT 
            l.loan_id,
            l.borrow_date,
            l.due_date,
            l.return_date,
            b.name AS title,
            b.author,
            c.barcode
        FROM Loans l
        JOIN Copy c ON l.barcode = c.barcode
        JOIN Book b ON c.ISBN = b.ISBN
        WHERE l.user_id = ?
        ORDER BY l.borrow_date DESC`,
        [userId]
    );

    const [tierRows]: any = await db.query(
        `SELECT borrow_limit 
         FROM Membership_Tiers 
         WHERE tier_name = ?`,
        [locals.user.membership_tier]
    );

    const borrow_limit = tierRows.length > 0 ? tierRows[0].borrow_limit : 0;

    return {
        user: locals.user,
        history: historyRows,
        borrow_limit
    };
};
