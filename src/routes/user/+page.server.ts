import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
    // If we reached this point, the hook has already guaranteed locals.user exists
    return {
        user: locals.user
    };
};
