<script lang="ts">
  import * as InputGroup from "$lib/components/ui/input-group/";
  import { Search } from "@lucide/svelte";
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-12">
	<h1 class="scroll-m-20 text-center text-4xl font-bold tracking-widest select-none">
		Library Management System
	</h1>
	<InputGroup.Root class="lg:max-w-3xl max-w-xl">
		<InputGroup.Input placeholder="Search Book List..." />
		<InputGroup.Addon>
			<Search />
		</InputGroup.Addon>
	</InputGroup.Root>
	<div class="h-64"></div>
</div>
