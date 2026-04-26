<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';

	let username = $state('');
	let password = $state('');
	let contact_number = $state('');
	let address = $state('');
	let loading = $state(false);

	async function handleSignup(e: Event) {
		e.preventDefault();
		loading = true;
		// TODO: replace with your signup logic
		await new Promise((r) => setTimeout(r, 1200));
		loading = false;
	}
</script>

<div class="flex min-h-dvh items-center justify-center bg-background px-4 py-12">
	<Card.Root class="w-full max-w-sm shadow-md">
		<Card.Header class="text-center">
			<Card.Title class="text-2xl">Create an account</Card.Title>
			<Card.Description>Sign up to get started</Card.Description>
		</Card.Header>

		<Card.Content class="space-y-4">
			<form onsubmit={handleSignup} novalidate class="space-y-4">
				<div class="space-y-1.5">
					<Label for="username">Username</Label>
					<Input
						id="username"
						type="text"
						placeholder="Anas"
						bind:value={username}
						required
						autocomplete="username"
					/>
				</div>

				<div class="space-y-1.5">
					<Label for="password">Password</Label>
					<Input
						id="password"
						type="password"
						placeholder="••••••••"
						bind:value={password}
						required
						autocomplete="new-password"
					/>
				</div>

				<div class="space-y-1.5">
					<Label for="contact_number">Contact Number</Label>
					<Input
						id="contact_number"
						type="tel"
						placeholder="+880 1234 567890"
						bind:value={contact_number}
						required
						autocomplete="tel"
					/>
				</div>

				<div class="space-y-1.5">
					<Label for="address">Address</Label>
					<Input
						id="address"
						type="text"
						placeholder="645, Khilgaon, Dhaka"
						bind:value={address}
						required
						autocomplete="street-address"
					/>
				</div>

				<Button type="submit" class="w-full" disabled={loading}>
					{#if loading}
						<svg
							class="mr-2 h-4 w-4 animate-spin"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							/>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
							/>
						</svg>
						Creating account…
					{:else}
						Sign up
					{/if}
				</Button>
			</form>
		</Card.Content>

		<Card.Footer class="justify-center text-sm text-muted-foreground">
			Already have an account?&nbsp;
			<a href="/login" class="font-medium text-foreground underline-offset-4 hover:underline">
				Sign in
			</a>
		</Card.Footer>
	</Card.Root>
</div>
