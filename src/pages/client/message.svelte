<script>
    import { metatags } from '@roxi/routify';
    metatags.title = 'Pesan - Buzzstrike';
    metatags.description = 'Buzzstrike Message';
    import Tabs from './_components/Tabs.svelte';
    import Search from './_components/Search.svelte';
    import {loading , modal} from '../_store';
    import { onMount } from 'svelte';
    import Broadcast from '../../services/Broadcast';
    import Dashboard from '../../services/Dashboard';
    import Noresult from './Noresult.svelte';
    
    
    onMount(fetchMessage);
    let mails = [];
    let bgActive = 0;
    let allActive;


    async function fetchMessage(){
        bgActive = 0;
        loading.set(false);
        let email = await Dashboard.get();
            let arr = [];
        for(const ms of email){
            const cm = ms.toJSON();
            const br = await Broadcast.getTitle(10);
            let mc = br.map(d=>{
                d = d.toJSON();
                const message = {
                    subject:d.title, send:cm.body,
                }
               arr.push(message);
            });
            mails = arr;
        } 
    }
    // function fetchMessage() {
    //     bgActive = 0;
    //     loading.set(true);
    //     Broadcast.getTitle(10).then(d=>{
    //         loading.set(false);
    //         if(d && d.length > 0)  {
    //             let arr = []
    //             d.forEach((element, i) => {
    //                 let el = element.toJSON();
    //                 el.isActive = false;
    //                 arr.push(el);
    //             });
    //                 mails = arr;
    //         } else {
    //             mails = [];
    //         }
    //     }).catch(e=>{
    //         console.log(e);
    //         loading.set(false);
    //         modal.set({active: true, message:"Terjadi masalah! " + "Error: [" + res.status + "] " + res.statusText + ".", ok: true});
    //     });
    // }
    
    // function removeItem(index) { 
    //     mails.splice(index, 1);
    //     mails = mails;
    // }

    function activeItem(idx) {
        for (let i = 0; i < data.length; i++) {
            if(i == idx) data[i].isActive = !data[i].isActive;
        }
        mails = mails;
    }
    function removeItem(objId) {
        loading.set(true);
        return new Promise((resolve, reject)=>{
            Broadcast.remove(objId).then(()=>{
                loading.set(false);
                fetchMessage();
                return resolve(true);
            }).catch(e=>{
                loading.set(false);
                console.log(e);
                modal.set({active: true, message:"Terjadi masalah! " + "Error: [" + res.status + "] " + res.statusText + ".", ok: true});
                return reject(false);
            });
        });
        
    }

    const stateTab = (index) => {
        if(index == 0){
            mails = terkirim;
        } else {
            mails = terjadwal;
        }
    }
    function checkAllClicked() {
        if(allActive) {
            for(let i=0; i < mails.length; i++){
                mails[i].isActive = false;
            }
        } else {
            for(let i=0; i < mails.length; i++){
                mails[i].isActive = true;
            }
        }
    }
    function setLabel(index) {
        // if(mails[index].isLabel == false) {
        //     mails[index].isLabel = true;
        // } else {
        //     mails[index].isLabel = false;
        // }
        mails[index].isLabel = !mails[index].isLabel;
    }
    function setRemove() {
        mails = mails.filter(remove => !remove.isActive);
    }
    function labelItem () {
        mails = mails.concat(remove => !remove.isActive);
    }
    $: console.log(labelItem);

    // search message
    export let searchTerm="";
    let sear = [];

    $: if (searchTerm)searchedPosts();
     
    const searchedPosts = () => {
      return sear = mails.filter(d => {
          let searchContact = d.subject + d.send;
          return searchContact.includes(searchTerm)
      });
  }

</script>
<div id="main area" class="flex">
    <div class="left w-full min-h-full" >
    <Tabs stateTab={stateTab} />
    <div class="content bg-white rounded-3xl sm:p-2 mx-3 mt-3" >
        <div class="nav flex items-stretch py-1 rounded-full bg-white" >
            <div class="left flex items-center justify-start w-full mr-6 p-2" >
                <Search bind:searchTerm on:input={searchedPosts}/> 
                <div class="seclet-icon inline-block mr-8" >
                </div>
                <div class="refresh-icon inline-block mr-8 cursor-pointer" >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                </div>
                <div on:click={labelItem} class="more-icon inline-block cursor-pointer w-10 mr-1">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                </div>
                <div on:click={removeItem} class="more-icon cursor-pointer inline-block pt-1 pr-4 pl-4 mb-0.5 mr-2" >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </div>
                <label class="inline-flex items-center mt-1">
                    <input on:click={checkAllClicked} bind:checked={allActive} type="checkbox" class="form-checkbox h-5 w-5 text-orange-600 cursor-pointer" ><span class="ml-5 text-gray-700"></span>
                </label>
            </div>
        </div>
        <div  class="mail-lists ">
    <!-- {#if searchTerm && sear.length === 0}
		<Noresult />		
	{:else if sear.length > 0}
            {#each sear as mail, i}
            <div  class="group relative  wrapper mt-3 mr-2 ml-2 h-16 flex hover:bg-gray-100 rounded-full">
                <img class="inline-block mt-2 h-12 w-12 rounded-full ring-2 ring-white" src="{mail.img}" alt="">
                <div  class="flex border-b border-gray-300 item-center py-1 px-6 w-full mr-3 l-2 mh-full">
                    <div  class=" h-5 main-title">
                        <h1 class="font-normal text-lg mt {mail.isActive == true ? "text-blue-500" : ""}">{mail.subject}</h1>
                        <h1 class="font-light {mail.isActive == true ? "text-blue-500" : ""}">{mail.send}</h1>
                    </div>
                    <label class="inline-flex items-center mt-1 ml-auto">
                        <input on:click={()=>activeItem(i)} bind:checked={mail.isActive} type="checkbox" class="form-checkbox h-5 w-5 text-orange-600 cursor-pointer">
                    </label>
                    <div on:click={()=>setLabel(i)} class="absolute cursor-pointer {mail.isLabel ? "text-red-500" : ""} right-36 top-5 hidden group-hover:block ">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                        </svg>
                    </div>
                    <div on:click={()=>removeItem(i)} class="absolute cursor-pointer right-24 top-5 ml-4 hidden group-hover:block">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </div>
                </div>
            </div>
            {/each}
            {:else} -->
            {#each mails as mail, i}
            <div  class="group relative  wrapper mt-3 mr-2 ml-2 h-16 flex hover:bg-gray-100 rounded-full">
                <img class="inline-block mt-2 h-12 w-12 rounded-full ring-2 ring-white" src="{mail.img}" alt="">
                <div  class="flex border-b border-gray-300 item-center py-1 px-6 w-full mr-3 l-2 mh-full">
                    <div  class=" h-5 main-title">
                        <h1 class="font-normal text-lg mt {mail. isActive == true ? "text-blue-500" : ""}">{mail.title}</h1>
                        <h1 class="font-light {mail.isActive == true ? "text-blue-500" : ""}">{mail.message}</h1>
                    </div>
                    <label class="inline-flex items-center mt-1 ml-auto">
                        <input type="checkbox" bind:checked={mail.isActive} class="form-checkbox h-5 w-5 text-orange-600 cursor-pointer" ><span class="ml-2 text-gray-700"></span>
                    </label>
                    <div on:click={()=>setLabel(i)} class="absolute cursor-pointer {mail.isLabel ? "text-red-500" : ""} right-36 top-5 hidden group-hover:block ">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                        </svg>
                    </div>
                    <div on:click={()=>removeItem(i)} class="absolute cursor-pointer right-24 top-5 ml-4 hidden group-hover:block">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </div>
                </div>
            </div>
            <!-- {/each}
            {/if} -->
        </div>
        <div class=" pt-7">
            <div class="footer flex px-12" >
                <div class="w-1/3 text-gray-600 text-xs text-left" >
                    0 GB of 15 GB used 
                </div>
                <div class="w-1/3 text-gray-600 text-xs text-center" >
                    Terms Privacy Programme Policies  
                </div>
                <div class="w-1/3 text-gray-600 text-xs text-right" >
                    Last acount activity: 14 hours ago<br >
                    Details
                </div>
            </div>
        </div>
     </div>  
</div>
</div>