<script lang="ts">
	import { Menu, Sun, Moon, User } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/';
	import { buttonVariants } from '$lib/components/ui/button/';
	import * as Sheet from '$lib/components/ui/sheet/';
	import { Separator } from '$lib/components/ui/separator';
	import { toggleMode } from 'mode-watcher';
</script>

<div class="m-6 flex">
	<Sheet.Root>
		<Sheet.Trigger class={buttonVariants({ variant: 'outline', size: 'icon-lg' })}
			><Menu /></Sheet.Trigger
		>
		<Sheet.Content side="left">
			<Sheet.Header>
				<Sheet.Title class="text-4xl select-none">Menu</Sheet.Title>

				<Separator />

				<nav class="flex flex-1 flex-col gap-4 py-6">
					<Button variant="ghost" href="/" class="justify-start text-2xl">Home</Button>
					<Separator />
					<Button variant="ghost" href="/categories" class="justify-start text-2xl">
						Browse Categories
					</Button>
					<Separator />
					<Button variant="ghost" href="/tags" class="justify-start text-2xl">Browse Tags</Button>
					<Separator />
					<Button variant="ghost" href="/recents" class="justify-start text-2xl">
						Browse Recents
					</Button>
					<Separator />
				</nav>
			</Sheet.Header>
			<Sheet.Footer>
				<div class="container flex justify-end">
					<Button onclick={toggleMode} variant="outline" size="icon">
						<Sun
							class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
						/>
						<Moon
							class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
						/>
						<span class="sr-only">Toggle theme</span>
					</Button>
				</div>
			</Sheet.Footer>
		</Sheet.Content>
	</Sheet.Root>

	<Button variant="outline" href="/user" size="icon-lg" class="ml-auto">
		<User />
	</Button>
</div>
