<script>
    export let options = [];
    export let onChange;
    export let index = 0;
    let focusing = false;

    function onfocus() {
        focusing = true;
    }

    function onLeaving() {
        focusing = false;
    }

    function onSelected(i) {
        index = i;
        if(onChange){
            onChange(options[i], i);
        }
        onLeaving();
    }
</script>

{#if focusing}
<div on:mouseleave={onLeaving} class="relative w-full mt-1 text-sm cursor-pointer z-50">
    <div class="absolute bg-white w-full border rounded-md text-sm left-0 p-1">
    {#each options as option, i}
        <div on:click={()=>onSelected(i)} class="{index == i ? "text-green-700" : "hover:text-green-700"} cursor-pointer">{option.label}</div>
    {/each}
    </div>
    <svg class="w-7 h-7 absolute top-0 right-0 cursor-pointer rounded-md p-1" fill="currentColor" stroke="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 6.879L4.939 13.939 7.061 16.061 12 11.121 16.939 16.061 19.061 13.939z"></path>
    </svg>
</div>
{:else}
<div on:click={onfocus} class="relative w-full mt-1 text-sm cursor-pointer">
    <div class="mt-1 border rounded-md p-1 shadow-sm">{options[index].label}</div>
    <svg class="w-7 h-7 absolute top-0 right-0 cursor-pointer rounded-md p-1" fill="currentColor" stroke="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.939 7.939L12 12.879 7.061 7.939 4.939 10.061 12 17.121 19.061 10.061z"></path>
    </svg>
</div>
{/if}