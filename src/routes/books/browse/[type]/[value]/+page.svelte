<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { ChevronLeft, BookOpen, User, Hash, Languages, ChartBar } from '@lucide/svelte';

	interface Book {
		ISBN: string;
		name: string;
		author: string;
		price: number;
		language: string;
		times_borrowed: number;
	}

	interface PageData {
		category: { type: string; value: string };
		books: Book[];
		error?: string;
	}

	let { data }: { data: PageData } = $props();
	const books = $derived(data.books || []);
</script>

<div class="container mx-auto space-y-6 py-10">
	<div class="flex flex-col gap-4">
		<Button variant="ghost" href="/books/browse" class="-ml-4 w-fit text-muted-foreground">
			<ChevronLeft class="mr-2 h-4 w-4" />
			Back to Categories
		</Button>

		<div class="space-y-1">
			<h1 class="text-3xl font-bold tracking-tight capitalize">
				{data.category.value}
			</h1>
			<p class="text-muted-foreground">
				Browsing books in <span class="font-medium text-foreground">{data.category.type}</span>
			</p>
		</div>
	</div>

	<Separator />

	{#if data.error}
		<div class="rounded-md bg-destructive/15 p-4 text-destructive">
			{data.error}
		</div>
	{:else if books.length === 0}
		<div class="flex flex-col items-center justify-center rounded-lg border border-dashed py-20">
			<BookOpen class="mb-4 h-10 w-10 text-muted-foreground" />
			<p class="text-lg font-medium">No books found</p>
			<p class="text-sm text-muted-foreground">Try exploring a different category value.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each books as book (book.ISBN)}
				<Card.Root
					class="flex h-full flex-col border-2 transition-all duration-200 hover:shadow-lg"
				>
					<Card.Header class="pb-2">
						<div class="flex items-start justify-between">
							<Card.Title class="line-clamp-2 min-h-[3.5rem] text-lg leading-tight font-bold">
								{book.name}
							</Card.Title>
						</div>
						<div class="mt-2 flex items-center text-sm text-muted-foreground">
							<User class="mr-1.5 h-4 w-4 shrink-0" />
							<span class="truncate">{book.author || 'Unknown Author'}</span>
						</div>
					</Card.Header>

					<Card.Content class="flex-1 space-y-4">
						<Separator />
						<div class="grid grid-cols-1 gap-3 text-sm">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2 text-muted-foreground">
									<Hash class="h-4 w-4" />
									<span>ISBN</span>
								</div>
								<span class="font-mono text-xs">{book.ISBN}</span>
							</div>

							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2 text-muted-foreground">
									<Languages class="h-4 w-4" />
									<span>Lang</span>
								</div>
								<span class="font-medium">{book.language || 'N/A'}</span>
							</div>

							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2 text-muted-foreground">
									<ChartBar class="h-4 w-4" />
									<span>Borrows</span>
								</div>
								<span class="font-medium">{book.times_borrowed}</span>
							</div>
						</div>
					</Card.Content>

					<Card.Footer class="flex flex-col gap-3 bg-muted/20 p-4">
						<div class="flex w-full items-center justify-between">
							<span class="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
								>Price</span
							>
							<span class="text-xl font-black">৳ {book.price}</span>
						</div>
						<Button class="w-full" variant="default" href="/books/{book.ISBN}">View Details</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	{/if}
</div>
