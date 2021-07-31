<script>
    import { compose, loading, modal } from '../../_store';
    import { onMount } from 'svelte';
    import Sender from '../../../services/Sender';
    import ContactListView from './ContactListView.svelte';
    import GroupListView from './GroupListView.svelte';
    import ModalSlot from '../../_components/ModalSlot.svelte';
    import CustomSelect from './CustomSelect.svelte';
    import Label from '../../../services/Label';
    import Broadcast from '../../../services/Broadcast';
    import Group from '../../../services/Group';

    let senders = [];
    let labels = [];
    let senderList = [];
    let labelList = [];
    let senderOptions = [
        {value: 0, label: "Belum memilih"}
    ];
    let labelOptions = [
        {value: 0, label: "Belum memilih"}
    ];
    let contactList = [];
    let groupList = [];
    let contactModal = false;
    let groupModal = false;
    let contactAll = false;
    let contactIndex;
    let contactOptions = [
        {value: 0, label: "Belum memilih"},
        {value: 1, label: "Semua Kontak"},
        {value: 2, label: "Pilih Kontak"},
        {value: 3, label: "Pilih Grup"},
    ];
    let title = "";
    let message = "";
    let hashtag = "";
    // let allActive = false;

    onMount(()=>{
      Sender.get().then(getSender).catch(catchError);
      Label.get(20).then(getLabel).catch(catchError);
    })

    function getSender(data) {
      if(data && data.length > 0){
        // let s = [{value: 0, label: "Belum memilih"}];
        let s = [];
        let sm = data.map((d, i)=>{
          return {
            value: (i+1),
            label: d.get('name') + " (" + d.get('number') + ")",
            number: d.get('number')
          };
        });
        s = [...s, ...sm];
        senderOptions = s;
        senders = data.map(d=>d.toJSON());
        senderList.push(senders[0]);
      }
    }

    function getLabel(data) {
      if(data && data.length > 0){
        let s = [{value: 0, label: "Belum memilih"}];
        let sm = data.map((d, i)=>{
          return {
            value: (i+1),
            label: d.get('name')
          };
        });
        s = [...s, ...sm];
        labelOptions = s;
        labels = data.map(d=>d.toJSON());
      }
    }

    function catchError(e) {
      loading.set(false);
      modal.set({active:true, ok: true, message: "Terjadi kesalahan! Error: " + e})
    }

    function getHashTag(str) {
      const r = /\B\#\w\w+\b/g;
      return str.match(r);
    }

    function containHashTag(str, hashtag) {
      let h = getHashTag(str);
      if(h && h.length > 0) {
        let f = h.filter(d=>d == hashtag);
        if(f && f.length > 0) return true;
      }
      return false;
    }

    function onBroadcast() {
      if(!hashtag || (hashtag && hashtag.length < 4) || (hashtag && hashtag.indexOf('#'))) {
        modal.set({active:true, ok: true, message: "Pastikan hashtag terdiri dari 3 karakter atau lebih dan dimulai dengan tanda #"});
        return;
      }
      if(senderList.length <= 0 || contactList.length <= 0) {
        modal.set({active:true, ok: true, message: "Pastikan Pengirim dan Penerima dipilih!"});
        return;
      }
      if(title.length < 3 || message.length < 5) {
        modal.set({active:true, ok: true, message: "Pastikan Judul memiliki minimal 3 karakter, dan Pesan 5 karakter!"});
        return;
      }
      // check hashtag
      if(!containHashTag(message, hashtag)){
        modal.set({active:true, ok: true, message: "Pastikan hashtag merupakan bagian dari pesan!"});
        return;
      }

      modal.set({active: true, ok: true, cancel: true, message: "Pastikan Whatsapp Sender sedang Aktif! Anda yakin ingin mengirimkan Broadcast?", callback: onBroadcastConfirm});
    }

    function onBroadcastConfirm(isSubmit) {
      if(isSubmit) {
        loading.set(true);
        const obj = {
          title,
          hashtag,
          message,
          senders: senderList.map(d=>{
            return {objectId: d.objectId, number: d.number+""}}),
          contacts: contactList.map(d=>{
            return {objectId: d.objectId, number: d.number}
          }),
          receiveCount: contactList.length,
          labels: labelList.map(d=>{
            return {objectId: d.objectId, name: d.name}
          })
        }
        Broadcast.save(obj).then(broadcastSaved).catch(catchError);
      }
    }

    function resetBroadcast() {
      title = "";
      message = "";
      senderList = [];
      contactList = [];
      labelList = [];
    }

    function broadcastSaved() {
      compose.set(false);
      loading.set(false);
      resetBroadcast();
      modal.set({active: true, ok: true, message: "Broadcast berhasi disimpan. Anda dapat memantau pesan tersebut di Menu Dashboard."})
    }

    function closeCompose() {
        compose.set(false);
    }

    function callbackModal(isSubmit) {
      if(isSubmit) {
        if(!contactAll) {
          contactOptions[2].label = contactList.length + " kontak terpilih";
        }
      } else {
        contactList = [];
        contactOptions[2].label = "Pilih Kontak";
        contactIndex = 0;
        contactAll = false;
      }
      contactModal = false;
    }

    async function groupToContact() {
      // remove existing contact list
      contactList = [];
      for(const group of groupList) {
        // get members
        const g = await Group.getMembers(group.objectId);
        g.relation('members').query().each((relatedObject) => {
            const contact = relatedObject.toJSON();
            contact.isActive = false;
            contactList = [...contactList, contact];
        });
      }
    }

    function callbackGroupModal(isSubmit) {
      if(isSubmit) {
        contactOptions[3].label = groupList.length + " grup terpilih";
        // convert group to contact list
        groupToContact();
      } else {
        groupList = [];
        contactOptions[3].label = "Pilih Grup";
        contactIndex = 0;
      }
      groupModal = false;
    }

    function onContactChange(option, index) {
      if(option.value == 1) {
        contactModal = true;
        contactAll = true;
      } else if(option.value == 2) { // contact
        contactModal = true;
      } else if(option.value == 3) { // group
        groupModal = true;
      } else {
        contactAll = false;
        contactList = [];
        contactOptions[2].label = "Pilih Kontak";
      }
      if(index) {
        contactIndex = index;
      }
    }

    function onSenderChange(value) {
      senderList = senders.filter(d=>d.number == value.number);
    }

    function onLabelChange(value) {
      labelList = labels.filter(d=>d.name == value.label);
    }

    function updateContact(data) {
      contactList = data;
    }

    function updateGroup(data) {
      groupList = data;
    }

    async function onHashtagBlur() {
      if(!hashtag || (hashtag && hashtag.length < 4) || (hashtag && hashtag.indexOf('#'))) {
        modal.set({active:true, ok: true, message: "Pastikan hashtag terdiri dari 3 karakter atau lebih dan dimulai dengan tanda #"});
        return;
      }
      if(hashtag && hashtag.length > 3) {
        // check today hashtag
        const brd = await Broadcast.checkHashtag(hashtag);
        if(brd && brd.id) {
          modal.set({active: true, ok: true, message: "Hashtag " + hashtag + " telah digunakan hari ini. Gunakan hashtag lain!"});
          hashtag = "";
        }
      }
    }
</script>

{#if contactModal}
<ModalSlot callback={callbackModal} ok={true} okText="Ok">
  <div class="flex">
    <h3 class="flex-1 text-lg leading-6 font-medium text-gray-900 mt-2" id="modal-title">
        Daftar Kontak
    </h3>
    <!-- <div class="flex-1 relative w-full p-2 text-right">
      <label class="inline-flex items-center mt-1">
          <input bind:checked={allActive} type="checkbox" class="form-checkbox h-5 w-5 text-orange-600" >
      </label>
    </div> -->
  </div>
  <div class="mt-2">
    <ContactListView updateContact={updateContact} selected={contactList} contactAll={contactAll} />
  </div>
</ModalSlot>  
{/if}

{#if groupModal}
<ModalSlot callback={callbackGroupModal} ok={true} okText="Ok">
  <div class="flex">
    <h3 class="flex-1 text-lg leading-6 font-medium text-gray-900 mt-2" id="modal-title">
        Daftar Grup
    </h3>
    <!-- <div class="flex-1 relative w-full p-2 text-right">
      <label class="inline-flex items-center mt-1">
          <input bind:checked={allActive} type="checkbox" class="form-checkbox h-5 w-5 text-orange-600" >
      </label>
    </div> -->
  </div>
  <div class="mt-2">
    <GroupListView updateGroup={updateGroup} selected={groupList} />
  </div>
</ModalSlot>  
{/if}

<div class="main area">
  <form>
    <div class="border w-3/4 bg-white sm:p-3 rounded-tl-2xl rounded-tr-2xl ml-auto">
      <header class="relative w-full h-1/6 pb-4">
        <h4 class=" font-semibold text-base">Broadcast Baru</h4>

        <!-- <svg class="w-5 h-6 absolute top-0 right-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
        </svg> -->

        <!-- <svg class="w-5 h-6 absolute top-0 right-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
        </svg> -->
        <svg on:click={closeCompose} class="w-7 h-7 absolute top-0 right-1 cursor-pointer hover:bg-gray-100 rounded-md p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </header>
      <div class="relative text-gray-200 focus-within:text-gray-400 w-full mb-2">
        <input bind:value={title} type="text" class="mb-1 border-b w-full py-1 text-sm text-black bg-white rounded-md pl-1 focus:outline-none focus:bg-gray-200 focus:text-gray-900" placeholder="Judul Broadcast">
      </div>
      <div class="grid grid-cols-6 gap-4">
        <div class="col-span-6 sm:col-span-3">
          <label for="label" class="block text-sm font-medium text-gray-700">Campaign</label>
          <CustomSelect onChange={onLabelChange} options={labelOptions} />
        </div>
        <div class="col-span-6 sm:col-span-3">
          <label for="hashtag" class="block text-sm font-medium text-gray-700">Hashtag</label>
          <input bind:value={hashtag} on:blur={onHashtagBlur} type="text" name="hashtag" id="hashtag" autocomplete="family-name" class="my-1 w-full py-1 text-sm text-black bg-white rounded-md pl-1 focus:outline-none focus:bg-gray-200 focus:text-gray-900 border-b" placeholder="Tambah #hashtag disini">
        </div>
        <div class="col-span-6 sm:col-span-3">
          <label for="sender" class="block text-sm font-medium text-gray-700">Pengirim</label>
          <CustomSelect onChange={onSenderChange} options={senderOptions} />
        </div>
        <div class="col-span-6 sm:col-span-3">
          <label for="contact" class="block text-sm font-medium text-gray-700">Penerima</label>
          <CustomSelect onChange={onContactChange} options={contactOptions} index={contactIndex} />
        </div>
        <div class="col-span-6  text-gray-200">
          <textarea bind:value={message} class="text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none" rows="5" placeholder="Tulis pesan disini" ></textarea>
        </div>
        <div class="">
          <button on:click={onBroadcast} type="button" class="bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transform hover:scale-105 px-8 py-2 rounded-lg transition duration-100 text-white">
            Kirim
          </button>
        </div>
        <!-- <div class="sm:px-8 col-span-4">
          <button type="button" class="hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transform hover:scale-105 px-6 py-2 rounded-lg transition duration-100">
            Jadwalkan Broadcast
          </button>
        </div> -->
      </div>
    </div>
  </form>
</div>
