<script>
    import  Contact  from '../../../../../services/Contact';
    import ModalFile from '../../../../_components/ModalFile.svelte';  
    import { loading, modal } from '../../../../_store';
    import  readXlsxFile from 'read-excel-file';
   
    export let context;
    // export let okText;
    // export let ok = false;
    
    function callbackInput(){
       
        readXlsxFile(input.files[0]).then((post)=>{
        post.forEach((i)=>{
        if(i[0]!="name" && i[1]!="number"){
            let xl = {name:`${i[0]}`,number:i[1]};
            Contact.create(xl);
            console.log(xl);
        }      
        });
        }).catch(e=>{
          console.log(e);
          modal.set({active:true, message: e, ok:true});
        });
      } 
</script>

<ModalFile  >
    <h3 class="text-lg leading-6 font-bold text-gray-900 mt-2 mb-4" id="modal-title">
        Import excel
    </h3>
<form method="POST" encType="multipart/form-data">
  <input type="file" id="input"  name="files" on:change={callbackInput} accept=".xlsx, .xls, .csv">
    
    
    <div class=" px-4 py-3  sm:px-6 sm:flex sm:flex-row-reverse">
        {#if context}  
            <button on:click={() => context(true)} class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">Submit</button>
        <button on:click={() => context(false)} type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Cancel
        </button>
        {/if}
        </div>
</form>
</ModalFile>