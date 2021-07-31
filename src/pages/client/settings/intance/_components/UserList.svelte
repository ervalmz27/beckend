<script>
    import { modal, loading } from "../../../../_store";
    import Group from "../../../../../services/Group";
    import ModalSlot from "../../../../_components/ModalSlot.svelte";
    import ContactListView from "../../../_components/ContactListView.svelte";
    import Parse from "../../../../../parsemi";

    export let data = [];
    export let onRefresh;
    let group = {};
    let members = [];
    let membersObject = [];
    let bgActive = 0;
    let allChecked = false;
    let action = "";
    let contactModal = false;
    let contactList = [];
    let lastObjectId = "";

    $: getMembers(data);
    $: checkAll(allChecked);

    async function addMember(obj) {
        let relation = group.relation('members');
        relation.add(obj);
        await group.save();
    }

    async function removeMember(index) {
        lastObjectId = null;
        let relation = group.relation('members');
        relation.remove(membersObject[index]);
        await group.save();
        getMembers(data);
    }

    async function getMembers(data) {
        if(data && data.objectId && data.objectId != lastObjectId) {
            loading.set(true);
            lastObjectId = data.objectId;
            members = [];
            membersObject = [];
            group = await Group.getMembers(data.objectId);
            group.relation('members').query().each((relatedObject) => {
                membersObject = [...membersObject, relatedObject];
                const contact = relatedObject.toJSON();
                contact.isActive = false;
                members = [...members, contact];
            });
            loading.set(false);
        }
    }

    function checkAll(all) {
        if(!members) return;
        members.forEach(element => {
            return element.isActive = all ? true : false;
        }, members);
        members = members;
    }

    function callbackConfirm(isSubmit) {
        if(isSubmit) {
            if(action == "all") {
                // removeChecked();
                console.log("TODO");
            } else {
                removeMember(bgActive);
            }
        }
        action = "";
    }

    function needConfirm(a) {
        action = a;
        modal.set({active: true, message: "Anda yakin ingin menghapus data", cancel: true, ok: true, callback: callbackConfirm})
    }

    function activeItem(idx) {
        for (let i = 0; i < members.length; i++) {
            if(i == idx) members[i].isActive = !members[i].isActive;
        }
        members = members;
    }

    function updateContact(data) {
        contactList = data;
    }

    function addContactClicked() {
        contactModal=true;
        contactList = members;
    }

    async function checkAndSave() {
        if(contactList.length <= 0) return;
        loading.set(true);
        // TODO: do best way to save bulk
        let relation = group.relation('members');
        for(const c of contactList) {
            let contact = new Parse.Object("Contact");
            contact.id = c.objectId;
            relation.add(contact);
        }
        await group.save();
        loading.set(false);
        // if(onRefresh) onRefresh();
        lastObjectId = null;
        getMembers(data);
    }

    function callbackModal(isSubmit) {
      if(isSubmit) {
          checkAndSave();
      } else {
        contactList = [];
      }
      contactModal = false;
    }
</script>

{#if contactModal}
<ModalSlot callback={callbackModal} ok={true} okText="Ok">
    <div class="flex">
      <h3 class="flex-1 text-lg leading-6 font-medium text-gray-900 mt-2" id="modal-title">
          Daftar Kontak
      </h3>
    </div>
    <div class="mt-2">
      <ContactListView updateContact={updateContact} selected={contactList} />
    </div>
  </ModalSlot>
{/if}

<div class="flex h-full">
    <div class="left w-full h-auto" >
        <div class="bg-white rounded-full w-auto mr-3 h-14 mt-4 ml-3 flex">
            <div class="w-full flex">
                <div class="border-2 font-md p-1 pl-3 h-10 bg-green-500 rounded-l-full text-white w-3/5 text-lg flex">Daftar Anggota
                </div>
                <div class="grid grid-cols-6 gap-2 w-full h-10 pt-1 border-2 rounded-r-full">
                    <span class="col-span-2"></span>
                    <div class="flex-1 items-center justify-center mx-auto">
                        <svg on:click={addContactClicked} class="w-6 h-6 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11L13 11 13 5 11 5 11 11 5 11 5 13 11 13 11 19 13 19 13 13 19 13z"></path>
                        </svg>
                    </div>
                    <div class="flex-1 items-center justify-center mx-auto">
                        <svg on:click={onRefresh} class="w-6 h-6 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                    </div>
                    <div class="flex-1 items-center justify-center mx-auto">
                        <svg on:click={()=>needConfirm("all")} class="w-6 h-6 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </div>
                    <div class="flex-1 items-center justify-center ml-1">
                        <input bind:checked={allChecked} type="checkbox" class="form-checkbox h-6 w-5 text-orange-600 cursor-pointer">
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-2xl mx-5 h-5/6">
            <div class="w-full h-5/6 flex">
                <div class="w-full h-full border border-gray-400 rounded-xl pb-4 flex">
                    <div class="w-full rounded-3xl p-0.4">
                        {#each members as datum, i}
                        <div on:click={()=>bgActive = i} class=" {bgActive == i ? "bg-green-100" : "bg-white hover:bg-gray-200"} group relative wrapper p-2 flex border-b border-gray-400 w-full h-16 rounded-t-xl cursor-pointer">
                            <!-- <div class=" inline-block w-12 h-12 pt-2 bg-gray-300 rounded-full text-center text-xl">{datum.name.charAt(0)}</div> -->
                            <div class="w-10 h-10 relative mb-4">
                                <div class="group w-full h-full rounded-full overflow-hidden text-center bg-gray-100 table cursor-pointer">
                                  <span class="table-cell text-gray-500 font-bold align-middle">{datum.name.charAt(0)}</span>
                                  <!-- <img src="https://pickaface.net/gallery/avatar/unr_random_180410_1905_z1exb.png" alt="lovely avatar" class="object-cover object-center w-full h-full visible group-hover:hidden" /> -->
                                </div>
                            </div>
                            <h1 class="px-3 text-gray-500">{datum.name} <br /> +62 {datum.number}</h1>
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
            </div>
        </div>
    </div>
</div>