<script>
    import { modal, compose, loading, minimize } from '../../_store';
    import { isActive } from '@roxi/routify';
    import { User } from '../../../parsemi';
    function callbackLogout(isSubmit) {
        if(isSubmit) {
            loading.set(true);
            User.logout().then(()=>{
                window.location.href = "/login";
            }).catch((e)=>{
                console.log(e);
                loading.set(true);
                modal.set({active: true, message: "Tidak dapat login!", ok: true});
            });
        }
    }
    function onLogout() {
        modal.set({active: true, message: "Anda yakin ingin keluar?", callback: callbackLogout, cancel: true, ok: true});
    }
    function onBroadcast() {
        compose.update(v => !v);
    }
    
    let side = [
        {icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', name: 'Dashboard', url: '/client/index'},
        {icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", name: 'Pesan', url: "/client/message"},
        {icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", name: 'Pengirim', url: "/client/settings/sender"},
        {icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z", name: 'Kontak', url: "/client/settings/contact"},
        {icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z", name: 'Grup', url: "/client/settings/group"},
        {icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z", name: 'Intance', url: "/client/settings/intance"},
        {icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z", name: 'Campaign', url: "/client/settings/label"}
    ];
</script>

<div class="{$minimize ? "h-screen pr-4":"left w-1/5 h-screen pr-4"}">
    <div class="add-new-btn-wrapper my-6 ">
        <div  class=" {$minimize ? "rounded-full cursor-pointer mx-3 bg-white w-14 h-14" : "rounded-full cursor-pointer mx-3 h-14 bg-white hover:bg-gray-100 w-full"}">
            <button on:click={onBroadcast} class="focus:bg-green-100 focus:border-0 py-3 px-3  bg-transparent flex items-center rounded-full w-full focus:outline-none">
                <div class="list-icon mr-1 inline-block font-extrabold">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </div>
                <div class="{$minimize ? " hidden transition-all" : "list-statu inline-block text-xl font-black"}">Broadcast</div>
            </button>
        </div>
    </div>
    <div class="{$minimize ? "rounded-md pt-2 mx-3 w-14 overflow-hidden h-5/6 bg-white" : "bg-white rounded-2xl pt-3 mx-3 h-5/6 w-full"}">
        <div class=" {$minimize ? "" :"overflow-y-auto"}">
            {#each side as side, i}
                <div class="{$isActive(side.url, true) ? "bg-green-600 text-white" : "hover:bg-gray-200 hover:text-black"} mr-2 rounded-r-full cursor-pointer h-8">
                    <a class="pt-1 px-4 my-1 bg-transparent flex items-center " href={side.url}>
                        <div class="list-icon mr-3 inline-block">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d='{side.icon}'></path></svg>
                        </div>
                        <div class="{$minimize ? "hidden" : "leading-6 font-normal"}">{side.name}</div>
                    </a>
                </div>
            {/each}
                <!-- <div class="transition duration-100 ease-in-out transform hover:-translate-x-1 hover:scale-105 lite-item-wrapper mr-2 rounded-r-full cursor-pointer ">
                    <div class="py-3 px-8 my-1 bg-transparent flex items-center ">
                        <div class="list-icon mr-5 inline-block">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
                            </svg>
                        </div>
                        <div class="list-statu inline-block text-gray-500font-normal text-gray-500">Atur Template</div>
                    </div>
                </div> -->
                <!-- <div class="transition duration-100 ease-in-out transform hover:-translate-x-1 hover:scale-105 lite-item-wrapper mr-2 rounded-r-full cursor-pointer ">
                    <div class="py-3 px-8 my-1 bg-transparent flex items-center ">
                        <div class="list-icon mr-5 inline-block">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                            </svg>
                        </div>
                        <div class="list-statu inline-block text-gray-500font-normal text-gray-500">Atur Label</div>
                    </div>
                </div> -->
                <hr class="border my-2"/>
            <div class=" hover:bg-gray-200 lite-item-wrapper mr-2 rounded-r-full cursor-pointer h-8">
                <div on:click={onLogout} class="pt-1 px-5 flex items-center">
                    <div class="{$minimize ? "text-center left":" list-icon mr-3 inline-block"}">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    </div>
                    <div class="{$minimize ? "hidden" : "leading-6 font-normal"}">Log Out</div>
                </div>
            </div>
        </div>
    </div>
</div>