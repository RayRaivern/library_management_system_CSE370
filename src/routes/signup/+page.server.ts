import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		// Extract values from the form
		const username = data.get('username');
		const password = data.get('password');
		const contact_number = data.get('contact_number');
		const address = data.get('address');
		const join_date = new Date().toISOString().split('T')[0];

		try {
			await db.query(
				`INSERT INTO User (username, password, contact_number, address, join_date, membership_tier) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
				[username, password, contact_number, address, join_date, 'Standard']
			);
		} catch (error) {
			console.error('Database Error:', error);
			return { success: false, message: 'Could not create user.' };
		}

		throw redirect(303, '/login');
	}
};
