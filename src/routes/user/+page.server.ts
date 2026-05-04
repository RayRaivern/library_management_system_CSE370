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
        `SELECT mt.borrow_limit
         FROM User u
         JOIN Membership_Tiers mt 
         ON u.membership_tier = mt.tier_name
         WHERE u.id = ?`,
        [userId]
    );
    const borrow_limit = tierRows[0]?.borrow_limit ?? 0;

    const [reservationRows]: any = await db.query(
        `SELECT 
            r.reservation_id,
            r.reserve_date,
            b.name AS title,
            b.author
        FROM Reservations r
        JOIN Book b ON r.ISBN = b.ISBN
        WHERE r.user_id = ?
        ORDER BY r.reserve_date DESC`,
        [userId]
    );

    const { admin, ...safeUser } = locals.user;
    return {
        user: safeUser,
        history: historyRows,
        borrow_limit,
        reservations: reservationRows
    };
};
