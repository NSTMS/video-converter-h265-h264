<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import { Link } from "svelte-routing";
  import { isAuthenticated, authenticated } from "../auth";
  import { connecion } from "../static/connection";
  let videos = [];
  let hiddenDownload;
  let vis = false;
  let login;
  onMount(() => {
    if (!$authenticated) {
      window.location.pathname = "/";
    } else {
      vis = true;
      login = isAuthenticated();
      getVids();
    }
  });

  const getVids = () => {
    fetch(`${connecion.protocole}://${connecion.host}/vids?login=${login}`)
      .then((res) => res.json())
      .then((snap) => {
        videos = [...snap.vids];
        console.log(videos);
      });
  };

  const fetchVid = (vid) => {
    fetch(
      `${connecion.protocole}://${connecion.host}/vid/${vid}?login=${login}`
    )
      .then((res) => res.blob())
      .then((snap) => {
        hiddenDownload.href = URL.createObjectURL(snap);
        hiddenDownload.download = vid;
        hiddenDownload.click();
      });
  };

  const sizeInMb = (size) => {
    return `${(size / 1024 / 1024).toFixed(2)} Mb`;
  };
</script>

{#if vis}
  <div class="mx-auto flex justify-center align-middle g-8 p-10">
    <Link
      to={""}
      class="w-fit mx-auto bg-gray-800 text-neutral-200 font-bold py-2 px-4 rounded inline-flex items-center cursor-pointer border-2 border-gray-800 hover:bg-gray-600 hover:border-gray-600"
    >
      <span>back to converter</span>
    </Link>
  </div>
  <main class="gallery">
    <a href="#" class="hidden" bind:this={hiddenDownload}>
      <p>Hidden Dowload Btw.</p>
    </a>
    <div>
      {#each videos as video, i}
        <div class="flex gap-3 align-middle justify-center">
          <Link to={`/gallery/${video.name}`}><h2>{i + 1}. {video.name}</h2></Link>
          <div
            on:click={() => fetchVid(video.name)}
            class="cursor-pointer grid place-items-center"
          >
            <svg
              class="fill-current w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              ><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg
            >
            <p>{sizeInMb(video.size)}</p>
          </div>
        </div>
      {/each}

      {#if videos.length == 0}
        <p>no converted videos</p>
      {/if}
    </div>
  </main>
{/if}
