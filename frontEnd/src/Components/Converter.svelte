<script>
  import Input from "./Input.svelte";
  import { Link } from "svelte-routing";
  import "../app.css";
  let source;
  let video,
    vidFile,
    prgsBar,
    status = false,
    vidName;

  let percentage = "";

  const prgCheck = (vid) => {
    fetch("http://localhost:3001/prg/" + vid)
      .then((res) => res.json())
      .then((snap) => {
        percentage = Number(snap.perc).toFixed(2) + "%";
        if (percentage != "100.00%") {    
          prgsBar.value = snap.perc.toFixed(2) * 100;
          setTimeout(() => prgCheck(vid), 1000);
        } else {
          prgsBar.value = 10000;
          getVid(vid);
        }
      });
  };

  const getVid = (vid) => {
    fetch("http://localhost:3001/vid/" + vid)
      .then((res) => res.blob())
      .then((snap) => {
        status = true;
        const blob = new Blob([snap], { type: "video/mp4" });
        source.src = URL.createObjectURL(blob);
        vidFile = source.src;
        vidName = vid;
        video.classList.toggle("hidden");
        video.load();
      });
  };

  function uploadFile(event) {
    status = false;
    const data = new FormData();
    data.append("file", event.target.files[0]);
    fetch("http://localhost:3001/api/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((snap) => {
        prgCheck(snap.video);
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  }
</script>

<div class="flex flex-col gap-4 justify-center p-10">
  {#if !status}
    <div class="flex flex-col gap-4 justify-center mx-auto">
      <div
        class="input-file-and-progres-bar mx-auto grid grid-cols-2 justify-center align-middle gap-4"
      >
        <Input {uploadFile} />
        <div>
          <Link
            to={"gallery"}
            class=" bg-gray-800 text-neutral-200 font-bold py-2 px-4 rounded inline-flex items-center cursor-pointer border-2 border-gray-800 hover:bg-gray-600 hover:border-gray-600"
          >
            <span>view files</span>
          </Link>
        </div>
      </div>
      <div class="progress-wrapper">
        <progress bind:this={prgsBar} value="0" max="10000"/>
        <p class="progress-text">{percentage}</p>
      </div>
    </div>
  {/if}

  <div class="mx-auto">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video
      bind:this={video}
      class="mx-auto aspect-video hidden w-1/2 h-auto p-4"
      controls
    >
      <source bind:this={source} type="video/mp4" />
    </video>
    {#if status}
      <div class="flex gap-4 mx-auto justify-center">
        <a
          href={vidFile}
          download={vidName}
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center cursor-pointer"
        >
          <svg
            class="fill-current w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            ><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg
          >
          <span>download</span>
        </a>
        <div>
          <Link
            to={"gallery"}
            class=" bg-gray-800 text-neutral-200 font-bold py-2 px-4 rounded inline-flex items-center cursor-pointer border-2 border-gray-800 hover:bg-gray-600 hover:border-gray-600"
          >
            <span>view files</span>
          </Link>
        </div>
        <button
          on:click={() => {
            status = false;
            percentage = "";
            video.classList.toggle("hidden");
          }}
          class="bg-gray-800 text-neutral-200 font-bold py-2 px-4 rounded inline-flex items-center cursor-pointer border-2 border-gray-800 hover:bg-gray-600 hover:border-gray-600"
        >
          <span>convert next</span>
        </button>
      </div>
    {/if}
  </div>
</div>
