<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button/';
	import { enhance } from '$app/forms';
	import { User, BookCopy, CalendarClock } from '@lucide/svelte';

	let { data } = $props();

	const users = $derived(data.allUsers || []);
	const loans = $derived(data.allLoans || []);
	const reservations = $derived(data.allReservations || []);

	function getActiveLoans(userId: number) {
		return loans.filter((l: any) => l.user_id === userId);
	}

	function getActiveReservations(userId: number) {
		return reservations.filter((r: any) => r.user_id === userId);
	}
</script>

<div class="container mx-auto space-y-8 py-10">
	<div class="flex flex-col gap-2">
		<h1 class="text-3xl font-bold tracking-tight">Library Administration</h1>
		<p class="text-muted-foreground">Manage users, track active loans, and monitor reservations.</p>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>User Registry</Card.Title>
			<Card.Description>Click a user to view their current activity.</Card.Description>
		</Card.Header>
		<Card.Content>
			<Accordion.Root class="w-full">
				{#each users as user (user.id)}
					{@const userLoans = getActiveLoans(user.id)}
					{@const userRes = getActiveReservations(user.id)}

					<Accordion.Item value="user-{user.id}" class="border-b px-2">
						<Accordion.Trigger class="hover:no-underline">
							<div class="flex w-full items-center justify-between pr-4 text-left">
								<div class="flex items-center gap-4">
									<div
										class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
									>
										<User class="h-5 w-5 text-primary" />
									</div>
									<div>
										<p class="font-semibold">{user.username}</p>
										<p class="text-xs text-muted-foreground">{user.membership_tier} Member</p>
									</div>
								</div>

								<div class="hidden gap-6 md:flex">
									<div class="text-center">
										<p class="text-[10px] font-bold text-muted-foreground uppercase">Fine</p>
										<p class="text-sm font-medium" class:text-destructive={user.fine_amount > 0}>
											${Number(user.fine_amount).toFixed(2)}
										</p>
									</div>
									<div class="text-center">
										<p class="text-[10px] font-bold text-muted-foreground uppercase">Loans</p>
										<p class="text-sm font-medium">{userLoans.length} / {user.borrow_limit}</p>
									</div>
								</div>
							</div>
						</Accordion.Trigger>

						<Accordion.Content class="space-y-6 pt-4 pb-6">
							<!-- Active Loans Table -->
							<div class="space-y-3">
								<div class="flex items-center gap-2 text-sm font-bold text-primary">
									<BookCopy class="h-4 w-4" />
									Active Loans
								</div>
								<Table.Root>
									<Table.Header>
										<Table.Row>
											<Table.Head>Book Title</Table.Head>
											<Table.Head>Barcode</Table.Head>
											<Table.Head>Due Date</Table.Head>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{#each userLoans as loan}
											<Table.Row>
												<Table.Cell class="font-medium">{loan.title}</Table.Cell>
												<Table.Cell>{loan.barcode}</Table.Cell>
												<Table.Cell>{new Date(loan.due_date).toLocaleDateString()}</Table.Cell>
												<Table.Cell>
													<div class="flex flex-col items-end gap-2">
														<form method="POST" action="?/returnBook" use:enhance>
															<input type="hidden" name="barcode" value={loan.barcode} />
															<input type="hidden" name="loan_id" value={loan.loan_id} />
															<Button size="sm" variant="outline" type="submit">Return Book</Button>
														</form>
													</div>
												</Table.Cell>
											</Table.Row>
										{:else}
											<Table.Row>
												<Table.Cell colspan={3} class="text-center text-muted-foreground py-4">
													No active loans.
												</Table.Cell>
											</Table.Row>
										{/each}
									</Table.Body>
								</Table.Root>
							</div>

							<!-- Active Reservations Table -->
							<div class="space-y-3">
								<div class="flex items-center gap-2 text-sm font-bold text-orange-600">
									<CalendarClock class="h-4 w-4" />
									Active Reservations
								</div>
								<Table.Root>
									<Table.Header>
										<Table.Row>
											<Table.Head>Book Title</Table.Head>
											<Table.Head>Reserved On</Table.Head>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{#each userRes as res}
											<Table.Row>
												<Table.Cell class="font-medium">{res.title}</Table.Cell>
												<Table.Cell>{new Date(res.reserve_date).toLocaleDateString()}</Table.Cell>
											</Table.Row>
										{:else}
											<Table.Row>
												<Table.Cell colspan={2} class="text-center text-muted-foreground py-4">
													No active reservations.
												</Table.Cell>
											</Table.Row>
										{/each}
									</Table.Body>
								</Table.Root>
							</div>
						</Accordion.Content>
					</Accordion.Item>
				{/each}
			</Accordion.Root>
		</Card.Content>
	</Card.Root>
</div>
