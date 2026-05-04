import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	try {
		const [rows] = await db.query(`
            SELECT DISTINCT category_type, value 
            FROM Book_Categories 
            ORDER BY category_type, value
        `);

		const categoryRows = rows as { category_type: string; value: string }[];

		/**
		 * We want to transform the flat rows into a grouped format:
		 * {
		 * "Genre": ["Fiction", "Mystery"],
		 * "Language": ["English", "Bengali"]
		 * }
		 */
		const groupedCategories = categoryRows.reduce(
			(acc, row) => {
				const { category_type, value } = row;
				if (!acc[category_type]) {
					acc[category_type] = [];
				}
				if (value && !acc[category_type].includes(value)) {
					acc[category_type].push(value);
				}
				return acc;
			},
			{} as Record<string, string[]>
		);

		return {
			categories: groupedCategories
		};
	} catch (error) {
		console.error('Error fetching categories:', error);
		return {
			categories: {},
			error: 'Failed to load categories.'
		};
	}
};
