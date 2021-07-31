<script>
    export let data;
</script>

<form action="#" method="POST">
    <div class="sm:rounded-md sm:overflow-hidden">
        <div class="py-5 bg-white space-y-6">
            <div class="grid grid-cols-3 gap-6">
                <div class="col-span-3">
                <label for="company_website" class="block text-sm font-medium text-gray-700">
                    Nama
                </label>
                <div class="mt-1 flex rounded-md shadow">
                    <input bind:value={data.name} type="text" name="name" id="name" class="focus:outline-none flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 h-9 " placeholder="Tulis Nama disini">
                </div>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-6">
                <div class="col-span-3">
                <label for="company_website" class="block text-sm font-medium text-gray-700">
                    Keterangan
                </label>
                <div class="mt-1 flex rounded-md shadow">
                    <input bind:value={data.desc} type="text" name="desc" id="desc" class="focus:outline-none flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 h-9 " placeholder="Tulis Keterangan disini">
                </div>
                </div>
            </div>
        </div>
    </div>
</form>