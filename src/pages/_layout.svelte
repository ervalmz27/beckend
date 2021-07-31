<!-- routify:options preload="proximity" -->

<script>
    import { modal, loading } from './_store';
    import Modal from './_components/Modal.svelte';
    import Loading from './_components/Loading.svelte';
</script>

<main>
    {#if $modal.active }
        <Modal />
    {/if}
    
    {#if $loading }
        <Loading />
    {/if}

    <slot />
</main>