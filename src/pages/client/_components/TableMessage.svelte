<script>
    import {Datemi} from '../../../parsemi';
    export let title = "";
    export let color = "";
    export let data = [];

    function customSplit(data, by, isDate) {
        if(!isDate) {
            const s = data.split(by);
            return s[0];
        }
        let d = new Date(data);
        d = Datemi.local(d);
        return d.getHours() + ":" + d.getMinutes();
    }
</script>

<div class="w-6/6 rounded-2xl bg-white  sm:pb-3">
    <div class="{color} rounded-t-2xl w-full h-12">
        <h1 class="text-white text-xl p-3">{title}</h1>
    </div>
    {#each data as datum}
    <div class="p-2 flex bg-white border-b border-gray-400 w-full h-16">
        <div class="px-3 text-gray-500"><div class="h-6 overflow-hidden">{datum.body}</div>{customSplit(datum.to, '@')}</div>
        <h1 class="text-gray-400 p-3 ml-auto">{customSplit(datum.createdAt, 'T', true)}</h1>
    </div>
    {/each}
</div>