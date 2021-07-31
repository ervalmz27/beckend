<script>
    import { compose } from '../_store';
    import Navbar from './_components/Navbar.svelte';
    import Sidebar from './_components/Sidebar.svelte';
    import Broadcast from './_components/Broadcast.svelte';
    import { User } from '../../parsemi';
    import {minimize} from '../_store';
    if(!User.current()) {
        window.location.href = "/login";
    }
</script>
{#if User.current()}
<div class="wrap">
    <Navbar />
    <div class="flex h-full bg-green-600">
        <Sidebar />
        <section class="{$minimize ? "w-full": "w-4/5"}">
        <slot />
        </section>
        {#if $compose}
        <div class="fixed bottom-0 right-0">
            <Broadcast />
        </div>
        {/if}
    </div>
</div>
{/if}