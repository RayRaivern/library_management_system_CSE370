<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import * as Accordion from "$lib/components/ui/accordion";
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    import { User, Book as BookIcon, ArrowRight } from "@lucide/svelte";

    let { data } = $props();

    // Group books by author name reactively
    const authorsMap = $derived.by(() => {
        const groups: Record<string, any[]> = {};
        data.books.forEach((book: any) => {
            if (!groups[book.author]) {
                groups[book.author] = [];
            }
            groups[book.author].push(book);
        });
        return groups;
    });

    const authorNames = $derived(Object.keys(authorsMap));
</script>

<div class="container mx-auto py-10 space-y-8">
    <header class="space-y-2">
        <h1 class="text-4xl font-extrabold tracking-tight">Browse Authors</h1>
        <p class="text-muted-foreground text-lg">
            Exploring {authorNames.length} authors in our collection.
        </p>
    </header>

    <div class="max-w-4xl">
        <Accordion.Root class="w-full">
            {#each authorNames as name}
                <Accordion.Item value={name} class="border-b py-2">
                    <Accordion.Trigger class="hover:no-underline">
                        <div class="flex items-center gap-4 text-left">
                            <div class="bg-primary/10 p-2 rounded-full">
                                <User class="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <span class="text-xl font-semibold">{name}</span>
                                <p class="text-sm text-muted-foreground">
                                    {authorsMap[name].length} {authorsMap[name].length === 1 ? 'book' : 'books'} available
                                </p>
                            </div>
                        </div>
                    </Accordion.Trigger>
                    
                    <Accordion.Content class="pt-4 pb-6 px-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {#each authorsMap[name] as book}
                                <Card.Root class="bg-muted/30">
                                    <Card.Header class="p-4">
                                        <div class="flex justify-between items-start gap-2">
                                            <div class="space-y-1">
                                                <Card.Title class="text-base">{book.name}</Card.Title>
                                                <div class="flex gap-2">
                                                    <Badge variant="outline" class="text-[10px]">{book.language}</Badge>
                                                    <Badge variant="secondary" class="text-[10px]">{book.times_borrowed} borrows</Badge>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" href="/books/{book.ISBN}">
                                                <ArrowRight class="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </Card.Header>
                                </Card.Root>
                            {/each}
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
            {:else}
                <div class="py-20 text-center border rounded-lg border-dashed">
                    <BookIcon class="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                    <p class="mt-4 text-muted-foreground">No authors found in the library database.</p>
                </div>
            {/each}
        </Accordion.Root>
    </div>
</div>
