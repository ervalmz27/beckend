<script>
    import { onMount } from 'svelte';
    import Group from '../../../services/Group';
    import { modal } from '../../_store';
    
    export let updateGroup;
    export let selected = [];

    let data = [];

    onMount(()=>{
      Group.get(10).then(getGroup).catch(catchError);
    })

    function getGroup(d) {
        if(d && d.length > 0){
            data = d.map(d=>{
                const dt =  d.toJSON();
                const checkSelected = selected.filter(ds=>ds.objectId == dt.objectId);
                dt.isActive = checkSelected.length > 0 ? true : false;
                return dt;
            });
        }
    }

    function catchError(e) {
        modal.set({active:true, ok: true, message: "Terjadi kesalahan ketika mengambil data Kontak! Error: " + e})
    }

    function onCheckBox(datum) {
        if(!datum.isActive) {
            selected = [...selected, datum];
        } else {
            const s = selected.filter(d=>d.number != datum.number);
            selected = s;
        }
        if(updateGroup){
            updateGroup(selected);
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
    <h1 class="px-3 text-gray-500">{datum.name} <br /> {datum.desc}</h1>
    <div class="ml-auto mt-4">
        <label class=" w-6 h-4">
            <input on:click={()=>onCheckBox(datum)} bind:checked={datum.isActive} type="checkbox" class="form-checkbox h-6 w-5 text-orange-600 cursor-pointer" >
        </label>
    </div>
</div>
{/each}