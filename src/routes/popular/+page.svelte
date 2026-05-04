<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Progress } from '$lib/components/ui/progress';
	import { Button } from '$lib/components/ui/button';
	import { Trophy, ArrowRight } from '@lucide/svelte';

	let { data } = $props();

	// Determine the max borrows to scale the progress bars
	const maxBorrows = $derived(data.popularBooks[0]?.times_borrowed || 1);
</script>

<div class="container mx-auto space-y-8 py-10">
	<header class="space-y-2 text-center">
		<div class="mb-4 flex justify-center">
			<div class="rounded-full bg-yellow-100 p-3">
				<Trophy class="h-8 w-8 text-yellow-600" />
			</div>
		</div>
		<h1 class="text-4xl font-extrabold tracking-tight">Hall of Fame</h1>
		<p class="text-lg text-muted-foreground">The most borrowed books in our Library.</p>
	</header>

	<div class="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
		{#each data.popularBooks as book, i}
			<Card.Root
				class="relative overflow-hidden border-2 {i === 0 ? 'border-yellow-400 shadow-lg' : ''}"
			>
				{#if i < 3}
					<div class="absolute top-0 right-0 p-2">
						<Badge variant={i === 0 ? 'default' : 'secondary'}>
							#{i + 1} Trending
						</Badge>
					</div>
				{/if}

				<Card.Header>
					<div class="flex items-start justify-between">
						<div>
							<Card.Title class="text-xl">{book.name}</Card.Title>
							<Card.Description>by {book.author || 'Unknown Author'}</Card.Description>
						</div>
					</div>
				</Card.Header>

				<Card.Content class="space-y-4">
					<div class="flex flex-wrap gap-1">
						{#each book.tags as tag}
							<Badge variant="outline" class="text-[10px] uppercase">{tag}</Badge>
						{/each}
					</div>

					<div class="space-y-2">
						<div class="flex justify-between text-sm">
							<span class="font-medium text-muted-foreground">Popularity Score</span>
							<span class="font-bold">{book.times_borrowed} borrows</span>
						</div>
						<Progress value={(book.times_borrowed / maxBorrows) * 100} class="h-2" />
					</div>
				</Card.Content>

				<Card.Footer class="flex justify-end">
					<Button size="sm" href="/books/{book.ISBN}" class="gap-2">
						View Details
						<ArrowRight class="h-4 w-4" />
					</Button>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>
</div>
