<script>
    import {minimize} from '../../_store';

    const mini = () => {
        minimize.update(v => !v)
    }
</script>
    <header class="{$minimize ? "p-3 bg-green-600" : ""}">
        <div class="{$minimize ? "bg-white w-full md:flex md:items-center md:justify-between" : ""}md:flex md:items-center md:justify-between shado  bg-white w-full h-12 rounded-full">
            <button on:click={mini} class="w-12 h-12 toggle-btn flex items-center  p-4 cursor-pointer hover:bg-gray-200 rounded-full focus:outline-none" text-gray-500>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
            <div class="w-full md:mb-0 md:w-48 pt-2">
            <a href="/">
                <img src="/images/logo.svg" alt="logo" class="flex item-center py-3"/>
            </a>
        </div>
        <div class="p-1 " text-gray-500>
            <img class="inline-block h-10 w-10  rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2.25&amp;w=256&amp;h=256&amp;q=80" alt="user">
        </div>
    </div>
  </header> 
