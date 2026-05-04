<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';

	let { data } = $props();

	const user = data.user;

	// Full history
	const history = data.history;

	// Only currently borrowed (NOT returned)
	const borrowed_books = history.filter((b) => !b.return_date);

	const reserved_books = [
		{
			id: 3,
			title: 'Designing Data-Intensive Applications',
			author: 'Martin Kleppmann',
			reserved_on: '2025-04-22'
		}
	];

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	function isOverdue(dateStr: string) {
		return new Date(dateStr) < new Date();
	}

	function calculateFine(due_date: string, return_date: string | null) {
		const today = new Date();
		const due = new Date(due_date);

		if (return_date) {
			const returned = new Date(return_date);
			if (returned <= due) return 0;
			const diff = (returned.getTime() - due.getTime()) / (1000 * 60 * 60 * 24);
			return Math.ceil(diff);
		}

		if (today <= due) return 0;

		const diff = (today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24);
		return Math.ceil(diff);
	}

	const total_fine = history.reduce(
		(sum, b) => sum + calculateFine(b.due_date, b.return_date),
		0
	);
</script>

<div class="min-h-dvh bg-background">
	<div class="mx-auto max-w-3xl space-y-6 px-4 py-10">

		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-semibold tracking-tight">
					Welcome back, {user.username}
				</h1>
				<p class="text-sm text-muted-foreground">
					Here's an overview of your library activity.
				</p>
			</div>
		</div>

		<Separator />

		<div class="grid grid-cols-3 gap-4">
			<Card.Root class="shadow-sm">
				<Card.Content class="pt-6">
					<p class="text-xs tracking-wide text-muted-foreground uppercase">
						Membership Tier
					</p>
					<p class="mt-1 text-xl font-semibold">{user.membership_tier}</p>
				</Card.Content>
			</Card.Root>

			<Card.Root class="shadow-sm">
				<Card.Content class="pt-6">
					<p class="text-xs tracking-wide text-muted-foreground uppercase">
						Books Borrowed
					</p>
					<p class="mt-1 text-xl font-semibold">
						{borrowed_books.length}
						<span class="text-sm font-normal text-muted-foreground">
										/ {data.borrow_limit}
									</span>
					</p>
				</Card.Content>
			</Card.Root>

			<Card.Root class="shadow-sm {total_fine > 0 ? 'border-destructive' : ''}">
				<Card.Content class="pt-6">
					<p class="text-xs tracking-wide text-muted-foreground uppercase">
						Outstanding Fine
					</p>
					<p class="mt-1 text-xl font-semibold" class:text-destructive={total_fine > 0}>
						${total_fine.toFixed(2)}
					</p>
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Currently Borrowed -->
		<Card.Root class="shadow-sm">
			<Card.Header>
				<Card.Title class="text-base">Currently Borrowing</Card.Title>
				<Card.Description>
					Books you have checked out right now.
				</Card.Description>
			</Card.Header>

			<Card.Content>
				{#if borrowed_books.length === 0}
					<p class="text-sm text-muted-foreground">
						You have no books checked out.
					</p>
				{:else}
					<div class="space-y-3">
						{#each borrowed_books as book}
							<div class="flex items-center justify-between rounded-md border px-4 py-3">
								<div>
									<p class="text-sm font-medium">{book.title}</p>
									<p class="text-xs text-muted-foreground">{book.author}</p>
								</div>

								<div class="flex flex-col items-end gap-1">
									<Badge
										variant={
											isOverdue(book.due_date)
												? 'destructive'
												: 'secondary'
										}
									>
										{isOverdue(book.due_date) ? 'Overdue' : 'Borrowed'}
									</Badge>

									{#if calculateFine(book.due_date, book.return_date) > 0}
										<span class="text-xs text-destructive">
											Fine: ${calculateFine(book.due_date, book.return_date)}
										</span>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</Card.Content>
		</Card.Root>

		<!-- Reserved (unchanged) -->
		<Card.Root class="shadow-sm">
			<Card.Header>
				<Card.Title class="text-base">Currently Reserving</Card.Title>
				<Card.Description>
					Books you have reserved and are waiting for.
				</Card.Description>
			</Card.Header>

			<Card.Content>
				{#if reserved_books.length === 0}
					<p class="text-sm text-muted-foreground">
						You have no active reservations.
					</p>
				{:else}
					<div class="space-y-3">
						{#each reserved_books as book}
							<div class="flex items-center justify-between rounded-md border px-4 py-3">
								<div>
									<p class="text-sm font-medium">{book.title}</p>
									<p class="text-xs text-muted-foreground">{book.author}</p>
								</div>

								<div class="flex flex-col items-end gap-1">
									<Badge variant="outline">Reserved</Badge>
									<span class="text-xs text-muted-foreground">
										Since {formatDate(book.reserved_on)}
									</span>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</Card.Content>
		</Card.Root>

	</div>
</div>
