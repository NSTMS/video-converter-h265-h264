<script>

import { onMount } from "svelte";
import { isAuthenticated, authenticated } from "../auth";
import { connecion } from "../static/connection";

export let vid_id;

let status, login, video, source;
const link = `${connecion.protocole}://${connecion.host}`;

onMount(() => {
    if (!$authenticated) {
      window.location.pathname = "/";
    }
    else{
        login = isAuthenticated();
        getVid(vid_id);
    }
});

const getVid = (vid) => {
    fetch(`${link}/vid/${vid}?login=${login}`)
    .then((res) => res.blob())
    .then((snap) => {
        status = true;
        const blob = new Blob([snap], { type: "video/mp4" });
        source.src = URL.createObjectURL(blob);
        video.load();
    });
};

</script>

<main>
    <a href="/gallery"><p>Go Back</p></a>
    <video bind:this={video}
      class="mx-auto aspect-video w-1/2 h-auto p-4"
      controls
    >
      <source bind:this={source} type="video/mp4" />
    </video>
</main>