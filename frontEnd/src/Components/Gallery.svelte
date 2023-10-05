<script>
    import { Link } from "svelte-routing";
    let videos = [];
    let hiddenDownload;

    const getVids = () => {
        fetch("http://localhost:3001/vids")
        .then((res) => res.json())
        .then((snap) => {
            videos = [...snap.vids];
            console.log(videos)
        });
    };
    getVids();

    const fetchVid = (vid)=>{
        fetch("http://localhost:3001/vid/"+vid)
        .then((res) => res.blob())
        .then((snap) => {
            hiddenDownload.href = URL.createObjectURL(snap);
            hiddenDownload.download = vid;
            hiddenDownload.click();
        });
    }
</script>
<div class="mx-auto flex justify-center align-middle g-8 p-10">
    <Link
        to={""}
        class="w-fit mx-auto bg-gray-800 text-neutral-200 font-bold py-2 px-4 rounded inline-flex items-center cursor-pointer border-2 border-gray-800 hover:bg-gray-600 hover:border-gray-600" >
    <span>back to converter</span>
    </Link>
</div>
<main class="gallery">
    <a href="#" class="hidden" bind:this={hiddenDownload}><p>Hidden Dowload Btw.</p></a>
    <div>
        

    {#each videos as video,i}
        <div class="flex gap-3 align-middle justify-center">
            <h2>{i+1}. {video}</h2>
            <div on:click={()=>fetchVid(video)} class="cursor-pointer grid place-items-center">
                <svg
                class="fill-current w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                ><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg
            >
            </div>
        </div>
    {/each}

    {#if videos.length == 0}
        <p>no converted videos</p>
    {/if}
</div>
</main>
