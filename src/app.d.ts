// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Copies {
			ISBN: string;
			barcode: string;
			status: string;
			condition: string;
			acquisition_date: string;
		}

		interface Locals {
			user?: {
				id: number;
				username: string;
				fine_amount: number;
				membership_tier: string;
			};

			copy?: Copies;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
