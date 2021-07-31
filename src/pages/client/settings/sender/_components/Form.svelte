<script>
    export let data;
    export let isEdit;
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
                    Nomor Whatsapp
                </label>
                <div class="mt-1 flex rounded-md shadow">
                    <span class="inline-flex items-center px-3 rounded-l-md text-gray-500 text-sm h-9">
                    +62
                    </span>
                    <input disabled={isEdit} bind:value={data.number} type="number" name="number" id="number" class="focus:outline-none flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 h-9" placeholder="8xxxxxxxxxx">
                </div>
                </div>
            </div>
        </div>
    </div>
</form>