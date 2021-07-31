<script>
    import ModalSlot from '../../../../_components/ModalSlot.svelte';
    import Group from '../../../../../services/Group';
    import { loading, modal } from '../../../../_store';
    import Form from './Form.svelte';
    import UserList from "./UserList.svelte";
    
    let edit = false;

    export let data;
    export let callback;

    function callbackModal(isSubmit) {
        if(isSubmit) {
            loading.set(true);
            Group.update(data.objectId, data.name, data.desc).then(d=>{
                edit = false;
                loading.set(false);
                if(callback) callback();
            }).catch(e=>{
                loading.set(false);
                console.log(e);
            });
        } else {
            edit = false;
        }
    }

    function onRefresh() {
        data = data;
    }
</script>

{#if edit}
<ModalSlot callback={callbackModal} ok={true}>
<h3 class="text-lg leading-6 font-medium text-gray-900 mt-2" id="modal-title">
    Edit Grup
</h3>
<div class="mt-2">
<Form data={data} />
</div>
</ModalSlot>
{/if}

<div class="w-full rounded-xl h-full ml-1">
    <div class="border border-gray-400 rounded-xl h-full">
        <h1 class="p-2 text-2xl">Informasi Detail</h1>
        <div class="flex">
            <div class="flex-2 w-72">
                <h1 class="px-2 pt-2 text-lg">Nama</h1>
                <h1 class="px-2 text-lg font-thin text-gray-500">{data.name ? data.name : "Data tidak tersedia."}</h1>
                <h1 class="px-2 pt-3 text-lg">Keterangan</h1>
                <h1 class="px-2 text-lg font-thin text-gray-500">{data.desc ? data.desc : "Data tidak tersedia."}</h1>
                <button on:click={()=>edit=true} class="bg-yellow-400 rounded-md px-4 h-8 my-4 bg-transparent flex items-center transform hover:scale-105 motion-reduce:transform-none duration-200 ml-2">
                    <div class="list-icon mr-1 inline-block">
                        <svg class="w-4 text-white h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                        </svg>
                    </div>
                    <div class="list-status inline-block font-normal text-white">Edit</div>
                </button>
            </div>
            <div class="flex-auto">
                <UserList data={data} onRefresh={onRefresh} />
            </div>
        </div>
    </div>
</div>