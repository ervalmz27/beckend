<script>
    import ModalSlot from '../../../../_components/ModalSlot.svelte';
    import Label from '../../../../../services/Label';
    import { loading } from '../../../../_store';
    import Form from './Form.svelte';

    let data = {name: "", desc: ""};
    export let callback;

    function callbackAdd(isSubmit) {
        if(isSubmit) {
            loading.set(true);
            Label.create(data).then(d=>{
                loading.set(false);
                if(callback) callback();
            }).catch(e=>{
                loading.set(false);
                console.log(e);
                modal.set({active:true, message: e, ok: true});
            });
        }
        if(callback) callback(isSubmit);
    }
</script>

<ModalSlot callback={callbackAdd} ok={true}>
    <h3 class="text-lg leading-6 font-medium text-gray-900 mt-2" id="modal-title">
        Tambah Campaign
    </h3>
    <div class="mt-2">
        <Form data={data} />
    </div>
</ModalSlot>