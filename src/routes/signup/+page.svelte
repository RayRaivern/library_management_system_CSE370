<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import { enhance } from '$app/forms';

	let loading = $state(false);
</script>

<div class="flex min-h-dvh items-center justify-center bg-background px-4 py-12">
	<Card.Root class="w-full max-w-sm shadow-md">
		<Card.Header class="text-center">
			<Card.Title class="text-2xl">Create an account</Card.Title>
			<Card.Description>Sign up to get started</Card.Description>
		</Card.Header>

		<Card.Content class="space-y-4">
			<form
				method="POST"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						update();
					};
				}}
				class="space-y-4"
			>
				<div class="space-y-1.5">
					<Label for="username">Username</Label>
					<Input id="username" name="username" type="text" placeholder="Anas" required />
				</div>

				<div class="space-y-1.5">
					<Label for="password">Password</Label>
					<Input id="password" name="password" type="password" placeholder="••••••••" required />
				</div>

				<div class="space-y-1.5">
					<Label for="contact_number">Contact Number</Label>
					<Input
						id="contact_number"
						name="contact_number"
						type="tel"
						placeholder="+880 1234 567890"
						required
					/>
				</div>

				<div class="space-y-1.5">
					<Label for="address">Address</Label>
					<Input
						id="address"
						name="address"
						type="text"
						placeholder="645, Khilgaon, Dhaka"
						required
					/>
				</div>

				<Button type="submit" class="w-full" disabled={loading}>
					{#if loading}
						Creating account…
					{:else}
						Sign up
					{/if}
				</Button>
			</form>
		</Card.Content>

		<Card.Footer class="justify-center text-sm text-muted-foreground">
			Already have an account?&nbsp;
			<a href="/login" class="font-medium text-foreground underline-offset-4 hover:underline"
				>Sign in</a
			>
		</Card.Footer>
	</Card.Root>
</div>
