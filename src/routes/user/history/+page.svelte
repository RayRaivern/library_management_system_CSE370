<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';

	let { data } = $props();

	// Helper to check if a book is overdue
	function isOverdue(dueDate: string, returnDate: string | null) {
		if (returnDate) return false;
		return new Date(dueDate) < new Date();
	}
</script>

<div class="container mx-auto space-y-6 py-10">
	<header class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Borrowing History</h1>
			<p class="text-muted-foreground">
				Viewing records for <strong>{data.user.username}</strong> ({data.user.membership_tier} Tier)
			</p>
		</div>
		<Badge variant="outline">{data.loans.length} Total Loans</Badge>
	</header>

	<Card.Root>
		<Card.Content class="p-0">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Book Title</Table.Head>
						<Table.Head>Barcode</Table.Head>
						<Table.Head>Borrowed</Table.Head>
						<Table.Head>Due Date</Table.Head>
						<Table.Head>Status</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.loans as loan}
						<Table.Row>
							<Table.Cell>
								<div class="font-medium">{loan.book_title}</div>
								<div class="text-xs text-muted-foreground">ISBN: {loan.ISBN}</div>
							</Table.Cell>
							<Table.Cell class="font-mono text-xs">{loan.barcode}</Table.Cell>
							<Table.Cell>{new Date(loan.borrow_date).toLocaleDateString()}</Table.Cell>
							<Table.Cell>{new Date(loan.due_date).toLocaleDateString()}</Table.Cell>
							<Table.Cell>
								{#if loan.return_date}
									<Badge variant="secondary">
										Returned on {new Date(loan.return_date).toLocaleDateString()}
									</Badge>
								{:else if isOverdue(loan.due_date, loan.return_date)}
									<Badge variant="destructive">Overdue</Badge>
								{:else}
									<Badge variant="default">Active</Badge>
								{/if}
							</Table.Cell>
						</Table.Row>
					{:else}
						<Table.Row>
							<Table.Cell colspan={5} class="text-center py-10 text-muted-foreground">
								You haven't borrowed any books yet.
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</div>
