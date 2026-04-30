import { db } from '$lib/server/db';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		const [rows]: any = await db.query(
			'SELECT id, password FROM User WHERE username = ?', 
			[username]
		);

		const user = rows[0];

		if (!user || user.password !== password) {
			return fail(400, { message: 'Invalid username or password' });
		}

    // Cookie set
		cookies.set('userId', user.id.toString(), {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 // 1 day
		});

		throw redirect(303, '/');
	}
};
