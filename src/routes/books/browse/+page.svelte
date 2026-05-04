<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';

	interface PageData {
		categories: Record<string, string[]>;
		user?: any;
		error?: string;
	}

	// Svelte 5 props destructuring
	let { data }: { data: PageData } = $props();

	const categories = $derived(data.categories || {});
</script>

<div class="container mx-auto space-y-8 py-10">
	<div class="space-y-2">
		<h1 class="text-3xl font-bold tracking-tight">Browse Library</h1>
		<p class="text-muted-foreground">Select a category to explore our collection of books.</p>
	</div>

	<Separator />

	{#if Object.keys(categories).length === 0}
		<div class="flex h-[200px] items-center justify-center rounded-md border border-dashed">
			<p class="text-sm text-muted-foreground">No categories found in the database.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each Object.entries(categories) as [type, values]}
				<Card.Root>
					<Card.Header>
						<Card.Title class="capitalize">{type}</Card.Title>
						<Card.Description>
							Browse books filtered by {type.toLowerCase()}.
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="flex flex-wrap gap-2">
							{#each values as value}
								<a href="/books/browse/{encodeURIComponent(type)}/{encodeURIComponent(value)}">
									<Badge
										variant="secondary"
										class="cursor-pointer px-3 py-1.5 transition-colors hover:bg-primary hover:text-primary-foreground"
									>
										{value}
									</Badge>
								</a>
							{/each}
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{/if}
</div>
