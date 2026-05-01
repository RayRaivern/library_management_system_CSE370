import { db } from '$lib/server/db';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// 1. Grab the cookie
	const userId = event.cookies.get('userId');

	// 2. If cookie exists, get the user data from MariaDB
	if (userId) {
		const [rows]: any = await db.query(
			'SELECT id, username, admin, membership_tier FROM User WHERE id = ?',
			[userId]
		);

		if (rows.length > 0) {
			// Populate locals so all pages can access the user data
			event.locals.user = rows[0];
		}
	}

	// 3. Logic for Protected Routes (e.g., any page starting with /user)
	if (event.url.pathname.startsWith('/user')) {
		if (!event.locals.user) {
			// If trying to access user pages without being logged in, send to login
			throw redirect(303, '/login');
		}
	}

	// 4. Logic for Auth Pages (prevent logged-in users from seeing /login or /signup)
	if (event.url.pathname === '/login' || event.url.pathname === '/signup') {
		if (event.locals.user) {
			// If already logged in, send them to the user dashboard
			throw redirect(303, '/user');
		}
	}

	return await resolve(event);
};
