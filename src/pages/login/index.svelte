<script>
    import { loading, modal } from '../_store';
    import { onMount } from 'svelte';
    import { metatags, goto } from '@roxi/routify';
    import { User } from '../../parsemi.js';

    metatags.title = 'Login - Buzzstrike';
    metatags.description = 'Login to Buzzstrike';

    onMount(()=>{
        if(User.current()){
            onSuccess();
        } else {
            loading.set(false);
        }
    });

    let username = "";
    let password = "";

    function onSuccess() {
        $goto("/client/message");
    }

    async function handleSubmit(e) {
        e.preventDefault();
        loading.set(true);
        User.login(username, password).then(onSuccess).catch((e)=>{
            console.log(e);
            loading.set(false);
            modal.set({active: true, message: "Login Gagal, pastikan Username dan Password Anda benar!", cancel: false, ok: true});
        });
    }

</script>

<section class="w-full bg-img-lg bg-no-repeat bg-cover h-screen">
    <div class="w-full h-full grid place-items-center ">
    <div class="w-3/4 h-4/6 grid place-items-center">
        <div class="flex">
            <div class="w-full">
                <h2 class="text-8xl font-normal text-white leading-normal mb-16">
                    Don't Buzz, Do Strike
                </h2>
                <p class="text-xl text-white">Perfect to know how the customers works, publish a new idea, and suggest a tips to share online.</p>
            </div>
            <div class="w-2/5">
                <div class="bg-white py-10 px-6 rounded-3xl">
                <form on:submit={handleSubmit}>
                    <div class="mx-14 mb-10 ml-11 mt-5 ">
                        <img src="/images/logo.svg" alt="logo" />
                    </div>
                    <div class="relative bg text-gray-50  bg my-6 py-1 mx-5">
                        <span class="absolute inset-y-1 left-0 flex items-center rounded-full">
                            <div class="p-2 mb-3  h-10 rounded-full">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                            </svg>
                            </div>
                        </span>
                        <input bind:value={username} minlength="5" type="text" name="password" class="rounded-3xl py-3 text-sm text-white bg-green-500  px-7 mb-3 w-full pl-10 focus:outline-none focus:bg-green-700 placeholder-gray-300" placeholder="username" required/>
                    </div>
                   
                    <div class="relative bg text-gray-50  bg my-6 py-1 mx-5">
                        <span class="absolute inset-y-1 left-0 flex items-center rounded-full">
                            <div class="p-2 mb-3 h-10 rounded-full">
                            <svg class="w-6 h-6 rounded-full" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
                            </svg>
                            </div>
                        </span>
                        <input bind:value={password} minlength="6" type="password" name="password" class=" rounded-3xl py-3 text-sm text-white bg-green-500  px-7 mb-3 w-full pl-10 focus:outline-none focus:bg-green-700 placeholder-gray-300" placeholder="Password" required/>
                    </div>
                    
                    <!-- <div class="mx-64">
                        <a href="#_" class="text-blue-500 underline">forgot?</a>
                     </div> -->
                    
                    <button type="submit" class="bg-gray-300 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-purple-50 focus:ring-opacity-50 transform hover:scale-110 px-8 py-2 rounded-3xl mx-32">
                        Login
                    </button>
                </form>
                </div>
            </div>
        </div>
    </div>
</div>
</section>