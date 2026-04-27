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
			<Card.Title class="text-2xl">Welcome back</Card.Title>
			<Card.Description>Sign in to your account to continue</Card.Description>
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
					<Input
						id="username"
						name="username"
						type="text"
						placeholder="Anas"
						required
						autocomplete="username"
					/>
				</div>

				<div class="space-y-1.5">
					<Label for="password">Password</Label>
					<Input
						id="password"
						name="password"
						type="password"
						placeholder="••••••••"
						required
						autocomplete="current-password"
					/>
				</div>

				<Button type="submit" class="w-full" disabled={loading}>
					{#if loading}
						Signing in…
					{:else}
						Sign in
					{/if}
				</Button>
			</form>
		</Card.Content>

		<Card.Footer class="justify-center text-sm text-muted-foreground">
			Don't have an account?&nbsp;
			<a href="/signup" class="font-medium text-foreground underline-offset-4 hover:underline">
				Sign up
			</a>
		</Card.Footer>
	</Card.Root>
</div>
