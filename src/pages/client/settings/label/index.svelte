<script>
    import { metatags } from '@roxi/routify';
    metatags.title = 'Label - Buzzstrike';
    metatags.description = 'Buzzstrike Label';

    import Search from '../../_components/Search.svelte';
    import { loading, modal } from '../../../_store';
    import { onMount } from 'svelte';
    import Label from '../../../../services/Label';
    import Detail from './_components/Detail.svelte';
    import Create from './_components/Create.svelte';

    onMount(fetchLabel);

    let data = [];
    let allChecked = false;
    let bgActive = 0;
    let add = false;
    let action = "";

    $: checkAll(allChecked);

    function fetchLabel() {
        bgActive = 0;
        loading.set(true);
        Label.get(10).then(d=>{
            loading.set(false);
            if(d && d.length > 0)  {
                let arr = []
                d.forEach((element, i) => {
                    let el = element.toJSON();
                    el.isActive = false;
                    arr.push(el);
                });
                data = arr;
            } else {
                data = [];
            }
        }).catch(e=>{
            console.log(e);
            loading.set(false);
            modal.set({active: true, message:"Terjadi masalah! " + "Error: [" + res.status + "] " + res.statusText + ".", ok: true});
        });
    }

    function callbackConfirm(isSubmit) {
        if(isSubmit) {
            if(action == "all") {
                removeChecked();
            } else {
                removeItem(data[bgActive].objectId);
            }
        }
        action = "";
    }

    function needConfirm(a) {
        action = a;
        modal.set({active: true, message: "Anda yakin ingin menghapus data", cancel: true, ok: true, callback: callbackConfirm})
    }

    function checkAll(all) {
        data.forEach(element => {
            return element.isActive = all ? true : false;
        }, data);
        data = data;
    }

    function activeItem(idx) {
        for (let i = 0; i < data.length; i++) {
            if(i == idx) data[i].isActive = !data[i].isActive;
        }
        data = data;
    }

    function callbackFunc() {
        add = false;
        fetchLabel();
    }

    function removeItem(objId) {
        loading.set(true);
        return new Promise((resolve, reject)=>{
            Label.remove(objId).then(()=>{
                loading.set(false);
                fetchLabel();
                return resolve(true);
            }).catch(e=>{
                loading.set(false);
                console.log(e);
                modal.set({active: true, message:"Terjadi masalah! " + "Error: [" + res.status + "] " + res.statusText + ".", ok: true});
                return reject(false);
            });
        });
        
    }

    async function removeChecked() {
        loading.set(true);
        for (let i = 0; i < data.length; i++) {
            if(data[i].isActive) {
                const r = await Label.remove(data[i].objectId);
                if(!r) return false;
            }
        }
        fetchLabel();
    }
</script>

{#if add}
    <Create callback={callbackFunc} />
{/if}

<div class="flex h-full overflow-hidden">
    <div class="left w-full h-auto" >
        <div class="bg-white rounded-full w-auto mr-3 h-14 mt-6 ml-3 flex">
            <div class="w-2/4 flex">
                <div class="border-2 font-xl p-3 h-14 bg-green-500 rounded-l-full text-white w-3/5 text-xl flex">Daftar Campaign
                </div>
                <div class="grid grid-flow-col gap-4 w-1/3 ml-auto h-10 mt-4">
                    <svg on:click={fetchLabel} class="w-6 h-6 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    <svg on:click={()=>needConfirm("all")} class="w-6 h-6 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    <input bind:checked={allChecked} type="checkbox" class="form-checkbox h-6 w-5 text-orange-600 cursor-pointer">
                </div>
            </div>
            <div class="w-full px-2 mt-2.5">
                <Search />
            </div>
        </div>
        <div class="bg-white rounded-2xl mt-6 mx-5 h-5/6 p-2">
            <div class="w-full h-5/6 flex">
                <div class="w-2/4 h-full border border-gray-400 rounded-xl pb-4 flex">
                    <div class="w-full rounded-3xl p-0.4">
                        {#each data as datum, i}
                        <div on:click={()=>bgActive = i} class=" {bgActive == i ? "bg-green-100" : "bg-white hover:bg-gray-200"} group relative wrapper p-2 flex border-b border-gray-400 w-full h-16 rounded-t-xl cursor-pointer">
                            <!-- <div class=" inline-block w-12 h-12 pt-2 bg-gray-300 rounded-full text-center text-xl">{datum.name.charAt(0)}</div> -->
                            <div class="w-10 h-10 relative mb-4">
                                <div class="group w-full h-full rounded-full overflow-hidden text-center bg-gray-100 table cursor-pointer">
                                  <span class="table-cell text-gray-500 font-bold align-middle">{datum.name.charAt(0)}</span>
                                  <!-- <img src="https://pickaface.net/gallery/avatar/unr_random_180410_1905_z1exb.png" alt="lovely avatar" class="object-cover object-center w-full h-full visible group-hover:hidden" /> -->
                                </div>
                            </div>
                            <h1 class="px-3 text-gray-500">{datum.name} <br /> {datum.desc ? datum.desc : "-"}</h1>
                            <div class="ml-auto mt-4">
                                <label class=" w-6 h-4">
                                    <input on:click={()=>activeItem(i)} bind:checked={datum.isActive} type="checkbox" class="form-checkbox h-6 w-5 text-orange-600 cursor-pointer">
                                </label>
                            </div>
                            <div on:click={()=>needConfirm("single")} class="absolute right-12 top-6 hidden group-hover:block cursor-pointer">
                                <svg class="w-8 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </div>
                        </div>
                        {/each}
                    </div>
                </div>
                <Detail callback={callbackFunc} data={data.length > 0 ? data[bgActive] : {}} />
                <button on:click={()=>add=true} class="hover:bg-green-300 focus:outline-none fixed right-10 bottom-10 w-16 h-16 bg-green-500 rounded-full ">
                    <svg class="w-12 text-white ml-1 -mt-1 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 11L13 11 13 5 11 5 11 11 5 11 5 13 11 13 11 19 13 19 13 13 19 13z"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</div>