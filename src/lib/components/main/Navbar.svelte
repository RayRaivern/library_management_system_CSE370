<script lang="ts">
	import { Menu, Sun, Moon, User } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/';
	import { buttonVariants } from '$lib/components/ui/button/';
	import * as Sheet from '$lib/components/ui/sheet/';
	import { Separator } from '$lib/components/ui/separator';
	import { toggleMode } from 'mode-watcher';

	const navLinks = [
		{ label: 'Home', href: '/' },
		{ label: 'Advanced Search', href: '/search' },
		{ label: 'Browse Books', href: '/books' },
		{ label: 'Browse Authors', href: '/authors' },
		{ label: 'Popular Books', href: '/popular' },
	];
</script>

<header class="border-b bg-background px-6">
	<div class="flex h-14 items-center gap-4">

		<!-- Site title / logo -->
		<a href="/" class="mr-4 text-lg font-semibold tracking-tight select-none whitespace-nowrap">
			Library
		</a>

		<!-- Desktop nav links -->
		<nav class="hidden md:flex items-center gap-1">
			{#each navLinks as link}
				<Button variant="ghost" href={link.href} class="text-sm">
					{link.label}
				</Button>
			{/each}
		</nav>

		<!-- Right-side actions -->
		<div class="ml-auto flex items-center gap-2">
			<!-- Theme toggle (always visible) -->
			<Button onclick={toggleMode} variant="outline" size="icon">
				<Sun class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90" />
				<Moon class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0" />
				<span class="sr-only">Toggle theme</span>
			</Button>

			<!-- User profile (always visible) -->
			<Button variant="outline" href="/user" size="icon">
				<User />
			</Button>

			<!-- Mobile menu trigger (hidden on desktop) -->
			<Sheet.Root>
				<Sheet.Trigger class="{buttonVariants({ variant: 'outline', size: 'icon' })} md:hidden">
					<Menu />
				</Sheet.Trigger>
				<Sheet.Content side="left">
					<Sheet.Header>
						<Sheet.Title class="text-4xl select-none">Menu</Sheet.Title>
						<Separator />
						<nav class="flex flex-1 flex-col gap-4 py-6">
							{#each navLinks as link}
								<Button variant="ghost" href={link.href} class="justify-start text-2xl">
									{link.label}
								</Button>
								<Separator />
							{/each}
						</nav>
					</Sheet.Header>
				</Sheet.Content>
			</Sheet.Root>
		</div>

	</div>
</header>
