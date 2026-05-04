import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ cookies }) => {
		// Clear the session cookie (adjust 'session' to match your cookie name)
		cookies.delete('session', { path: '/' });

		// Redirect to login or home page
		throw redirect(303, '/login');
	}
};
