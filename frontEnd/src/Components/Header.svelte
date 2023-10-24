<script>
    import { onMount } from "svelte";
    import { isAuthenticated, logOut,authenticated} from "../auth";
    onMount(() => {
        $authenticated = !!isAuthenticated();
    });
</script>

<div class="mx-auto w-screen p-4 bg-gray-800">
    <h1
        class=" text-4xl font-bold tracking-tight leading-none md:text-5xl lg:text-6xl"
    >
        converter h.265
    </h1>
    {#if $authenticated}
        <h2 on:click={logOut} class="cursor-pointer">log out</h2>
    {/if}
</div>
