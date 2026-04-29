<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { enhance } from '$app/forms';
	import { Star } from '@lucide/svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';

	let { data } = $props();
	const book = $derived(data.book);
	const categories = $derived(data.categories);
	const reviews = $derived(data.reviews);
	const userHasReviewed = $derived(data.userHasReviewed);
	const user = $derived(data.user);

	const history = $derived(data.history);

	let open = $state(false);
	let isEditOpen = $state(false);
	let reviewToEdit = $state<any>(null);
</script>

{#if history.length > 0}
<div class="container mx-auto px-4 py-10">
	<h1 class="mb-6 text-3xl font-bold">Borrowing History</h1>

	<div class="space-y-4">
		{#each history as h}
			<Card.Root class="p-4">
				<Card.Header>
					<Card.Title class="text-xl">{h.book_name}</Card.Title>
					<p class="text-sm text-muted-foreground">
						Barcode: {h.barcode}
					</p>
				</Card.Header>

				<Card.Content class="space-y-2">
					<p><strong>Borrow Date:</strong> {h.borrow_date}</p>
					<p><strong>Due Date:</strong> {h.due_date}</p>
					<p><strong>Return Date:</strong> {h.return_date || 'Not returned'}</p>

					<p>
						<strong>Status:</strong>
						{#if !h.return_date && new Date(h.due_date) < new Date()}
							Overdue
						{:else if !h.return_date}
							Borrowed
						{:else if new Date(h.return_date) > new Date(h.due_date)}
							Overdue
						{:else}
							Returned
						{/if}
					</p>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</div>
{/if}

{#if data.books}
<div class="container mx-auto px-4 py-10">
	<h1 class="mb-6 text-3xl font-bold">Books</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each data.books as b}
			<Card.Root class="p-4">
				<Card.Header>
					<Card.Title class="text-xl">{b.name}</Card.Title>
					<p class="text-sm text-muted-foreground">
						by {b.authors || b.author || 'Unknown'}
					</p>
				</Card.Header>

				<Card.Content class="space-y-2">
					<p><strong>ISBN:</strong> {b.ISBN}</p>
					<p><strong>Language:</strong> {b.language || 'N/A'}</p>
					<p><strong>Price:</strong> ${b.price || '0.00'}</p>
				</Card.Content>

				<Card.Footer>
					<a href={`/books/${b.ISBN}`}>
						<Button variant="outline">View Details</Button>
					</a>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>
</div>
{:else}

<div class="container mx-auto px-4 py-10">
	<Card.Root class="mx-auto max-w-4xl shadow-lg">
		<Card.Header>
			<div class="flex items-start justify-between">
				<div>
					<Card.Title class="text-4xl font-bold">{book.name}</Card.Title>
					<p class="mt-2 text-xl text-muted-foreground">by {book.author || 'Unknown Author'}</p>
				</div>
				<Badge variant="outline" class="px-4 py-1 text-lg">
					ISBN: {book.ISBN}
				</Badge>
			</div>
		</Card.Header>

		<Card.Content class="space-y-6">
			<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
				<div class="space-y-1">
					<p class="text-sm font-medium text-muted-foreground">Language</p>
					<p class="text-lg">{book.language || 'N/A'}</p>
				</div>
				<div class="space-y-1">
					<p class="text-sm font-medium text-muted-foreground">Price</p>
					<p class="text-lg">${book.price || '0.00'}</p>
				</div>
				<div class="space-y-1">
					<p class="text-sm font-medium text-muted-foreground">Times Borrowed</p>
					<p class="text-lg">{book.times_borrowed}</p>
				</div>
			</div>

			<Separator />

			<div>
				<h3 class="mb-3 text-lg font-semibold">Categories</h3>
				<div class="flex flex-wrap gap-2">
					{#each categories as cat}
						<Badge variant="secondary">
							{cat.category_type}: {cat.value}
						</Badge>
					{/each}
					{#if categories.length === 0}
						<p class="text-sm text-muted-foreground">No categories listed.</p>
					{/if}
				</div>
			</div>
		</Card.Content>

		<Card.Footer class="flex justify-end gap-4 bg-muted/50 p-6">
			<Dialog.Root bind:open>
				<Dialog.Trigger disabled={userHasReviewed}>
					<Button variant="outline" disabled={userHasReviewed}>
						{userHasReviewed ? 'Already Reviewed' : 'Write a Review'}
					</Button>
				</Dialog.Trigger>
				<Dialog.Content class="sm:max-w-[425px]">
					<Dialog.Header>
						<Dialog.Title>Rate "{book.name}"</Dialog.Title>
						<Dialog.Description>Share your thoughts with the library community.</Dialog.Description>
					</Dialog.Header>

					<form
						method="POST"
						action="?/addReview"
						use:enhance={() => {
							return async ({ result, update }) => {
								if (result.type === 'success') open = false;
								update();
							};
						}}
						class="space-y-4 py-4"
					>
						<div class="space-y-2">
							<Label for="title">Review Title</Label>
							<Input id="title" name="title" placeholder="Great read!" required />
						</div>

						<div class="space-y-2">
							<Label for="rating">Rating (1-5)</Label>
							<Input id="rating" name="rating" type="number" min="1" max="5" required />
						</div>

						<div class="space-y-2">
							<Label for="content">Your Review</Label>
							<Textarea
								id="content"
								name="content"
								placeholder="What did you think about the characters or the plot?"
								required
							/>
						</div>

						<Dialog.Footer>
							<Button type="submit">Submit Review</Button>
						</Dialog.Footer>
					</form>
				</Dialog.Content>
			</Dialog.Root>

			<Button>Reserve Book</Button>
		</Card.Footer>
	</Card.Root>
</div>

<div class="container mx-auto space-y-8 px-4 py-10">
	<div class="mx-auto max-w-4xl">
		<h2 class="mb-6 text-2xl font-bold">User Reviews ({reviews.length})</h2>

		<div class="space-y-4">
			{#each reviews as review}
				<Card.Root>
					<Card.Header class="pb-2">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2">
								<span class="text-lg font-semibold">{review.username}</span>
								<div class="flex text-yellow-500">
									{#each Array(review.rating) as _}
										<Star class="h-4 w-4 fill-current" />
									{/each}
								</div>
							</div>
							<div class="flex items-center gap-3">
								<span class="text-sm text-muted-foreground">
									{new Date(review.date_and_time).toLocaleDateString()}
								</span>
								
								{#if user && user.username === review.username}
									<Button 
										variant="ghost" 
										size="sm" 
										onclick={() => {
											reviewToEdit = review;
											isEditOpen = true;
										}}
									>
										Edit
									</Button>
								{/if}
							</div>
						</div>
						<Card.Title class="text-lg mt-1">{review.title}</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-md">{review.content}</p>
					</Card.Content>
				</Card.Root>
			{:else}
				<div class="border-2 border-dashed rounded-lg py-10 text-center">
					<p class="text-muted-foreground">No reviews yet. Be the first to review this book!</p>
				</div>
			{/each}
		</div>
	</div>
</div>

<Dialog.Root bind:open={isEditOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Edit Review</Dialog.Title>
			<Dialog.Description>Update your review for "{book.name}".</Dialog.Description>
		</Dialog.Header>

		{#if reviewToEdit}
			<form
				method="POST"
				action="?/editReview"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'success') isEditOpen = false;
						update();
					};
				}}
				class="space-y-4 py-4"
			>
				<input type="hidden" name="date_and_time" value={reviewToEdit.date_and_time} />

				<div class="space-y-2">
					<Label for="edit-title">Review Title</Label>
					<Input id="edit-title" name="title" value={reviewToEdit.title} required />
				</div>

				<div class="space-y-2">
					<Label for="edit-rating">Rating (1-5)</Label>
					<Input id="edit-rating" name="rating" type="number" min="1" max="5" value={reviewToEdit.rating} required />
				</div>

				<div class="space-y-2">
					<Label for="edit-content">Your Review</Label>
					<Textarea
						id="edit-content"
						name="content"
						value={reviewToEdit.content}
						required
					/>
				</div>

				<Dialog.Footer>
					<Button type="submit">Update Review</Button>
				</Dialog.Footer>
			</form>
		{/if}
	</Dialog.Content>
</Dialog.Root>

{/if}
