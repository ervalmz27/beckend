<script>
    import ModalSlot from '../../../../_components/ModalSlot.svelte';
    import Sender from '../../../../../services/Sender';
    import { loading, modal } from '../../../../_store';
    import Form from './Form.svelte';
    import QrCode from "svelte-qrcode";
    import { onDestroy } from 'svelte';
    
    let edit = false;
    let subs = null;
    let isConnecting = false;

    export let data;
    export let callback;

    onDestroy(()=>{
        if(subs){
            subs.unsubscribe();
        }
    });

    async function fetchState(objectId) {
        const res = await Sender.state(objectId);
        if(res.ok) {
            return res.json();
        } else {
            return false;
        }
    }

    function checkState() {
        loading.set(true);
        let objectId = data.objectId;
        if(!objectId) return;
        fetchState(objectId).then(d=>{
            if(!d) {
                d = {state: "UNPAIRED"};
            }
            Sender.updateState(objectId, d.state).then(()=>{
                loading.set(false);
                if(callback){
                    callback();
                }
            });
        }).catch(e=>{
            loading.set(false);
            modal.set({active: true, message:"Terjadi masalah saat cek state! " + "Error: " + e, ok: true});
        });
    }

    async function initialize() {
        const res = await Sender.initialize(data.objectId);
        if(res.ok) {
            return true;
        } else {
            return false;
        }
    }

    async function callbackConfirm(isSubmit) {
        if(isSubmit) {
            loading.set(true);
            // subscribe to get realtime data
            if(!subs){
                subs = await Sender.subscribe();
                subs.on('update', onUpdate);
            }
            // initialize state
            initialize().then(d=>{
                loading.set(true);
            }).catch(e=>{
                loading.set(false);
                modal.set({active: true, message:"Terjadi masalah saat subscribe! " + "Error: " + e, ok: true});
            });
        }
    }

    function connectClicked() {
        // isConnecting = true;
        modal.set({active: true, callback: callbackConfirm, ok: true, cancel: true, message: "Pastikan Whatsapp di Smartphone telah disiapkan!"});
    }

    function onUpdate(obj) {
        data.qrCode = obj.get('qrCode');
        data = data;
        loading.set(false);
        isConnecting = true;
        const state = obj.get('state');
        if(state == 'READY' || state == 'CONNECTED') {
            isConnecting = false;
            if(callback) {
                callback();
            }
        }
    }

    function callbackModal(isSubmit) {
        if(isSubmit) {
            loading.set(true);
            Sender.update(data.objectId, data.name, data.number).then(d=>{
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

    function callbackQr() {
        isConnecting = false;
    }
</script>

{#if edit}
<ModalSlot callback={callbackModal} ok={true}>
<h3 class="text-lg leading-6 font-medium text-gray-900 mt-2" id="modal-title">
    Edit Pengirim
</h3>
<div class="mt-2">
<Form data={data} isEdit={true} />
</div>
</ModalSlot>
{/if}

<div class="w-full rounded-xl h-auto ml-1">
    <div class="border border-gray-400 rounded-xl h-full">
        <h1 class="p-2 text-2xl">Informasi Detail</h1>
        <div class="float-left w-3/6">
            <h1 class="px-2 pt-2 text-lg">Nama</h1>
            <h1 class="px-2 text-lg font-thin text-gray-500">{data.name ? data.name : "Data tidak tersedia."}</h1>
            <h1 class="px-2 pt-3 text-lg">Nomor Whatsapp</h1>
            <h1 class="px-2 text-lg font-thin text-gray-500">{data.number ? "+62 "+data.number : "Data tidak tersedia."}</h1>
            {#if data.objectId}
            <button on:click={()=>edit=true} class="bg-yellow-400 rounded-md px-4 h-8 my-4 bg-transparent flex items-center transform hover:scale-105 motion-reduce:transform-none duration-200 ml-2">
                <div class="list-icon mr-1 inline-block">
                    <svg class="w-4 text-white h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                    </svg>
                </div>
                <div class="list-status inline-block font-normal text-white">Edit</div>
            </button>
            {/if}
        </div>
        {#if data.objectId}
        <div class="float-left w-3/6">
            <center>
                
            <button on:click={checkState} class="bg-blue-400 rounded-md px-4 h-8 my-4 bg-transparent flex items-center transform hover:scale-105 motion-reduce:transform-none duration-200 ml-2">
                <div class="list-icon mr-1 inline-block">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                </div>
                <div class="list-status inline-block font-normal text-white text-lg">Refresh</div>
            </button>

            {#if data.state == "READY" || data.state ==  'CONNECTED'}
                <div class="bg-green-500 text-white px-10 py-3">{data.state}</div>
            {:else}
                <button on:click={connectClicked} class="bg-red-500 px-10 py-2 hover:bg-red-700 text-white rounded-md mb-5" >Hubungkan WA</button>
            {/if}
            </center>
        </div>
        {/if}
    </div>
</div>
{#if isConnecting}
    <ModalSlot callback={callbackQr} okText="Ok">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mt-2" id="modal-title">
            Memindai QR Code
        </h3>
        <div class="mt-2">
            <div class="mb-5">
                <ol class="list-decimal">
                    <li> Buka aplikasi <span class="bg-gray-200 px-2 rounded-md">WhatsApp</span> di smartphone </li>
                    <hr class="my-2" />
                    <li> Klik menu <span class="bg-gray-200 px-2 rounded-md">titik-tiga</span> yang ada di pojok kanan atas </li>
                    <hr class="my-2" />
                    <li> Pilih <span class="bg-gray-200 px-2 rounded-md">"WhatsApp Web"</span> </li>
                    <hr class="my-2" />
                    <li> Setelah itu, <span class="bg-gray-200 px-2 rounded-md">Scan QR Code</span> di bawah ini </li>
                    <hr class="my-2" />
                </ol>
            </div>
            <center>
            <QrCode value={data.qrCode} />
            </center>
        </div>
    </ModalSlot>
{/if}