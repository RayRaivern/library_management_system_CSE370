<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { Badge } from '$lib/components/ui/badge';

	let { data } = $props();

	// Mapping for shadcn select triggers
	const selectedTag = $derived(data.searchValues.tag || 'Select a tag');
	const selectedCategory = $derived(data.searchValues.category || 'Select a category');
</script>

<div class="container mx-auto space-y-8 py-10">
	<header>
		<h1 class="text-3xl font-bold tracking-tight">Advanced Search</h1>
		<p class="text-muted-foreground">Find books by title, author, or specific attributes.</p>
	</header>

	<Card.Root>
		<Card.Content class="pt-6">
			<form method="GET" class="grid grid-cols-1 items-end gap-4 md:grid-cols-2 lg:grid-cols-4">
				<!-- Book Title -->
				<div class="space-y-2">
					<Label for="name">Book Title</Label>
					<Input
						id="name"
						name="name"
						placeholder="e.g. Gatsby"
						value={data.searchValues.bookName}
					/>
				</div>

				<!-- Author -->
				<div class="space-y-2">
					<Label for="author">Author</Label>
					<Input
						id="author"
						name="author"
						placeholder="e.g. F. Scott"
						value={data.searchValues.author}
					/>
				</div>

				<!-- Tag Filter -->
				<div class="space-y-2">
					<Label>Tag</Label>
					<Select.Root type="single" name="tag" value={data.searchValues.tag}>
						<Select.Trigger>
							{selectedTag}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="">All Tags</Select.Item>
							{#each data.filterOptions.tags as tag}
								<Select.Item value={tag}>{tag}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<!-- Category Filter -->
				<div class="space-y-2">
					<Label>Category</Label>
					<Select.Root type="single" name="category" value={data.searchValues.category}>
						<Select.Trigger>
							{selectedCategory}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="">All Categories</Select.Item>
							{#each data.filterOptions.categories as cat}
								<Select.Item value={cat}>{cat}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="flex justify-end gap-2 lg:col-span-4">
					<Button variant="outline" href="/search">Reset</Button>
					<Button type="submit">Search Books</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>

	<!-- Results Table/Grid -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each data.books as book}
			<Card.Root>
				<Card.Header>
					<Card.Title>{book.name}</Card.Title>
					<Card.Description>by {book.author || 'Unknown'}</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="space-y-1 text-sm">
						<p><strong>ISBN:</strong> {book.ISBN}</p>
						<p><strong>Language:</strong> {book.language}</p>
						<p><strong>Price:</strong> ${book.price}</p>
					</div>
				</Card.Content>
				<Card.Footer>
					<Badge variant="secondary">{book.times_borrowed} borrows</Badge>
					<Button class="mr-2 ml-auto" href="/books/{book.ISBN}">Details</Button>
				</Card.Footer>
			</Card.Root>
		{:else}
			<div class="col-span-full py-10 text-center text-muted-foreground">
				No books found matching your criteria.
			</div>
		{/each}
	</div>
</div>
