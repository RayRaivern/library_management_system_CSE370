<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { enhance } from '$app/forms';
	import { LogOut } from '@lucide/svelte';

	// Access the data returned from +page.server.ts
	let { data } = $props();

	// Deconstruct for easier access
	const user = $derived(data.user);
	const borrowed_books = $derived(data.loans || []);
	const reserved_books = $derived(data.reservations || []);

	function formatDate(dateStr: string | null) {
		if (!dateStr) return 'N/A';
		return new Date(dateStr).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	function isOverdue(dueDateStr: string | null) {
		if (!dueDateStr) return false;
		// Only mark as overdue if it hasn't been returned yet
		return new Date(dueDateStr) < new Date();
	}
</script>

<div class="min-h-dvh bg-background">
	<div class="mx-auto max-w-3xl space-y-6 px-4 py-10">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-semibold tracking-tight">Welcome back, {user.username}</h1>
				<p class="text-sm text-muted-foreground">Joined on {formatDate(user.join_date)}</p>
			</div>
			<Button variant="outline" href="user/history">View Borrowing History</Button>
		</div>

		<Separator />

		<!-- Stats row -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<Card.Root class="shadow-sm">
				<Card.Content class="pt-6">
					<p class="text-xs tracking-wide text-muted-foreground uppercase">Membership Tier</p>
					<p class="mt-1 text-xl font-semibold">{user.membership_tier}</p>
				</Card.Content>
			</Card.Root>

			<Card.Root class="shadow-sm">
				<Card.Content class="pt-6">
					<p class="text-xs tracking-wide text-muted-foreground uppercase">Active Loans</p>
					<p class="mt-1 text-xl font-semibold">
						{borrowed_books.filter((b: any) => !b.return_date).length}
					</p>
				</Card.Content>
			</Card.Root>

			<Card.Root class="shadow-sm {Number(user.fine_amount) > 0 ? 'border-destructive' : ''}">
				<Card.Content class="pt-6">
					<p class="text-xs tracking-wide text-muted-foreground uppercase">Outstanding Fine</p>
					<p
						class="mt-1 text-xl font-semibold"
						class:text-destructive={Number(user.fine_amount) > 0}
					>
						${Number(user.fine_amount).toFixed(2)}
					</p>
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Currently Borrowed -->
		<Card.Root class="shadow-sm">
			<Card.Header>
				<Card.Title class="text-base">Current Loans</Card.Title>
				<Card.Description>Books you are currently responsible for.</Card.Description>
			</Card.Header>
			<Card.Content>
				<!-- Filter to only show books that haven't been returned yet -->
				{@const activeLoans = borrowed_books.filter((b: any) => !b.return_date)}
				{#if activeLoans.length === 0}
					<p class="text-sm text-muted-foreground">You have no active loans.</p>
				{:else}
					<div class="space-y-3">
						{#each activeLoans as loan}
							<div class="flex items-center justify-between rounded-md border px-4 py-3">
								<div>
									<p class="text-sm font-medium">{loan.title}</p>
									<p class="text-xs text-muted-foreground">{loan.author}</p>
									<p class="mt-1 text-[10px] text-muted-foreground">Barcode: {loan.barcode}</p>
								</div>
								<div class="flex flex-col items-end gap-1">
									<Badge variant={isOverdue(loan.due_date) ? 'destructive' : 'secondary'}>
										{isOverdue(loan.due_date) ? 'Overdue' : `Due ${formatDate(loan.due_date)}`}
									</Badge>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</Card.Content>
		</Card.Root>

		<!-- Currently Reserved -->
		<Card.Root class="shadow-sm">
			<Card.Header>
				<Card.Title class="text-base">Active Reservations</Card.Title>
				<Card.Description>Books waiting for you to pick up.</Card.Description>
			</Card.Header>
			<Card.Content>
				{#if reserved_books.length === 0}
					<p class="text-sm text-muted-foreground">You have no active reservations.</p>
				{:else}
					<div class="space-y-3">
						{#each reserved_books as res}
							<div class="flex items-center justify-between rounded-md border px-4 py-3">
								<div>
									<p class="text-sm font-medium">{res.title}</p>
									<p class="text-xs text-muted-foreground">{res.author}</p>
								</div>
								<div class="flex flex-col items-end gap-1">
									<Badge variant="outline" class="border-primary text-primary">Reserved</Badge>
									<span class="text-xs text-muted-foreground">
										Since {formatDate(res.reserve_date)}
									</span>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</Card.Content>
		</Card.Root>

		<div class="mt-12 pb-10">
			<form method="POST" action="?/logout" use:enhance>
				<Button
					type="submit"
					variant="destructive"
					class="flex items-center justify-center gap-3 py-8 text-xl font-bold shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99]"
				>
					<LogOut class="h-6 w-6" />
					Logout
				</Button>
			</form>
		</div>
	</div>
</div>
