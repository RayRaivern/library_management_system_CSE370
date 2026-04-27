import { db } from '$lib/server/db';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		// 1. Raw SQL query to find the user
		// In your schema, the table name is 'User'
		const [rows]: any = await db.query(
			'SELECT id, password FROM User WHERE username = ?', 
			[username]
		);

		const user = rows[0];

		// 2. Verify existence and password
		// Since we aren't using security/hashing, we compare the strings directly
		if (!user || user.password !== password) {
			return fail(400, { message: 'Invalid username or password' });
		}

		// 3. Set the cookie
		// Using SvelteKit's built-in cookies function
		cookies.set('userId', user.id.toString(), {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 // 1 day
		});

		// 4. Redirect to the dashboard or home page
		throw redirect(303, '/');
	}
};
