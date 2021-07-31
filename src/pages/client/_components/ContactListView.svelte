<script>
    import { onMount } from 'svelte';
    import Contact from '../../../services/Contact';
    import { modal } from '../../_store';
    
    export let updateContact;
    export let selected = [];
    export let contactAll = false;

    let data = [];

    onMount(()=>{
      Contact.get(10).then(getContact).catch(catchError);
    })

    function getContact(d) {
        if(d && d.length > 0){
            data = d.map(d=>{
                const dt =  d.toJSON();
                if(contactAll) {
                    dt.isActive = true;
                } else {
                    const checkSelected = selected.filter(ds=>ds.number == dt.number);
                    dt.isActive = checkSelected.length > 0 ? true : false;
                }
                return dt;
            });

            if(contactAll && updateContact){
                updateContact(data);
            }
        }
    }

    function catchError(e) {
        modal.set({active:true, ok: true, message: "Terjadi kesalahan ketika mengambil data Kontak! Error: " + e})
    }

    function onCheckBox(datum) {
        if(contactAll) return;
        if(!datum.isActive) {
            selected = [...selected, datum];
        } else {
            const s = selected.filter(d=>d.number != datum.number);
            selected = s;
        }
        if(updateContact){
            updateContact(selected);
        }
    }
    
</script>

{#each data as datum}
<div class="bg-white hover:bg-gray-200 group relative wrapper p-2 flex border-b border-gray-400 w-full h-16">
    <div class="w-10 h-10 relative mb-4">
        <div class="group w-full h-full rounded-full overflow-hidden text-center bg-gray-100 table">
          <span class="table-cell text-gray-500 font-bold align-middle">{datum.name ? datum.name.charAt(0) : "X"}</span>
          <!-- <img src="https://pickaface.net/gallery/avatar/unr_random_180410_1905_z1exb.png" alt="lovely avatar" class="object-cover object-center w-full h-full visible group-hover:hidden" /> -->
        </div>
    </div>
    <h1 class="px-3 text-gray-500">{datum.name} <br /> +62 {datum.number}</h1>
    <div class="ml-auto mt-4">
        <label class=" w-6 h-4">
            <input on:click={()=>onCheckBox(datum)} bind:checked={datum.isActive} type="checkbox" class="form-checkbox h-6 w-5 text-orange-600 cursor-pointer" disabled={contactAll}>
        </label>
    </div>
</div>
{/each}