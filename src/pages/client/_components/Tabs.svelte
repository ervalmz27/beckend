<script>

    export let stateTab;

    let wClick = 0;

    let tabs = [
        {icon: `M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z`, name: "Terkirim"},
        {icon: `M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z`, name: "Terjadwal"}
    ];
    function tabClick(i) {
        wClick = i;
        stateTab(i);
    }
</script>

<div class="change-content-nav pl-4 flex" >
    {#each tabs as tab, i}
    <div on:click={() => tabClick(i)} class="w-1/5 px-3 py-4 text-2xl cursor-pointer">
        <div class="{i == wClick ? "border-b-4 border-white" : ""} flex py-3 items-center rounded-sm">
            <div class="icons inline-block mr-2" >
                <svg class="text-white w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d='{tab.icon}'></path>
                </svg>
            </div>
            <div class="inline align-middle text-white" >{tab.name}
            </div>
        </div>
    </div>
    {/each}
</div>
