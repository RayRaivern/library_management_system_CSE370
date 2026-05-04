// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user?: {
        id: number;
        username: string;
        admin: number;
        fine_amount: number;
        membership_tier: string;
      };
    }
    interface Book {
      ISBN: string;
      name: string;
      author?: string;
      price?: number;
      language?: string;
      times_borrowed?: number;
    }
    interface Author {
      author_id: number;
      name: string;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}
export {};
