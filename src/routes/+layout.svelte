<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

  import { ModeWatcher } from 'mode-watcher';
  import Navbar from '$lib/components/main/Navbar.svelte';
  import Separator from '$lib/components/ui/separator/separator.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<ModeWatcher />
<Navbar />
<Separator />
{@render children()}
