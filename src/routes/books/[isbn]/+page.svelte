<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Table from '$lib/components/ui/table';
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
	const copies = $derived(data.copies);
	const userHasReviewed = $derived(data.userHasReviewed);
	const user = $derived(data.user);
	const loans = $derived(data.loans);

	// variables used for borrowing and reserving books
	const availableCopies = $derived(
		copies.filter((copy: App.Copies) => copy.status?.toLowerCase() === 'available')
	);

	const isAnyCopyAvailable = $derived(availableCopies.length > 0);
	let selectedBarcode = $state('');
	$effect(() => {
		if (availableCopies.length > 0 && !selectedBarcode) {
			selectedBarcode = availableCopies[0].barcode;
		}
	});

	const isUserBorrowing = $derived(
		user && loans.some((loan: App.Loan) => loan.user_id === user.id && loan.return_date === null)
	);

  const userHasReserved = $derived(data.userHasReserved);

	// variables used for reviews
	let open = $state(false);
	let isEditOpen = $state(false);
	let reviewToEdit = $state<any>(null);
</script>

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
					<p class="text-lg">৳ {book.price || '0.00'}</p>
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

			{#if isUserBorrowing}
				<Button disabled variant="secondary">Already Borrowing</Button>
			{:else if isAnyCopyAvailable}
				<Button disabled variant="outline">Reserve Book</Button>
      {:else if userHasReserved}
				<Button disabled variant="secondary">Already Reserved</Button>
			{:else}
				<form method="POST" action="?/reserveBook" use:enhance>
					<Button type="submit">Reserve Book</Button>
				</form>
			{/if}
		</Card.Footer>
	</Card.Root>
</div>

<div class="mx-auto max-w-4xl">
	<h2 class="mb-6 text-2xl font-bold">Physical Copies ({copies.length})</h2>

	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Barcode</Table.Head>
					<Table.Head>Condition</Table.Head>
					<Table.Head>Acquisition Date</Table.Head>
					<Table.Head>Due Date</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each copies as copy}
					{@const activeLoan = data.loans?.find(
						(l: App.Loan) => l.barcode === copy.barcode && !l.return_date
					)}

					<Table.Row>
						<Table.Cell class="font-medium">{copy.barcode}</Table.Cell>
						<Table.Cell>{copy.condition || 'Not specified'}</Table.Cell>
						<Table.Cell>
							{copy.acquisition_date ? new Date(copy.acquisition_date).toLocaleDateString() : 'N/A'}
						</Table.Cell>
						<Table.Cell>
							{#if activeLoan}
								<span class="font-medium text-destructive">
									{new Date(activeLoan.due_date).toLocaleDateString()}
								</span>
							{:else}
								<span class="text-muted-foreground">N/A</span>
							{/if}
						</Table.Cell>
						<Table.Cell>
							{#if copy.status?.toLowerCase() === 'available'}
								<form method="POST" action="?/borrowBook" use:enhance>
									<input type="hidden" name="barcode" value={copy.barcode} />
									<Button size="sm" type="submit">Borrow</Button>
								</form>
							{:else}
								<Button size="sm" variant="outline">Loaned</Button>
							{/if}
						</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={5} class="h-24 text-center text-muted-foreground">
							No physical copies are currently cataloged for this book.
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
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
						<Card.Title class="mt-1 text-lg">{review.title}</Card.Title>
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
					<Input
						id="edit-rating"
						name="rating"
						type="number"
						min="1"
						max="5"
						value={reviewToEdit.rating}
						required
					/>
				</div>

				<div class="space-y-2">
					<Label for="edit-content">Your Review</Label>
					<Textarea id="edit-content" name="content" value={reviewToEdit.content} required />
				</div>

				<Dialog.Footer>
					<Button type="submit">Update Review</Button>
				</Dialog.Footer>
			</form>
		{/if}
	</Dialog.Content>
</Dialog.Root>
