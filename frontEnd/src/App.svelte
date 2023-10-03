<script>
    import "./app.css";
  let source;
  let video;

  let percentage = "0";

  const prgCheck = (vid) => {
    fetch("http://localhost:3001/prg/" + vid)
      .then((res) => res.json())
      .then((snap) => {
        percentage = Number(snap.perc).toFixed(2) + "%";
        if (percentage != "100.00%") {
          setTimeout(() => prgCheck(vid), 1000);
        } else {
          getVid(vid);
        }
      });
  };

  const getVid = (vid) => {
    fetch("http://localhost:3001/vid/" + vid)
      .then((res) => res.blob())
      .then((snap) => {
        source.src = URL.createObjectURL(
          new Blob([snap], { type: "video/mp4" })
        );
        video.load();
      });
  };

  function uploadFile(event) {
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
<div class="mx-auto flex flex-col text-center w-screen h-screen bg-black text-white">
  <h1 class="m-10 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl">video converter</h1>
  <div class="grid grid-cols-2 gap-4 place-items-center p-10">
    <div class="input-file-and-progres-bar">
      <input type="file" on:change={uploadFile} id="input" name="input" style="display:none;"/>
      <label for="input" class="button">bierzemy plik</label>
      <div class="progress-wrapper">
        <div class="progress-bar" style="width: {percentage}; height: 20px;" />
        <p class="progress-text">{percentage}</p>
      </div>
    </div>
  <video bind:this={video} width="500" controls>
    <source bind:this={source} type="video/mp4" />
  </video>
  </div>

</div>
<style>
  .progress-wrapper {
    width: 300px;
    height: 20px;
    position: relative;
  }
  .progress-bar {
    background: lightgreen;
    height: 20px;
    position: absolute;
    top: 0;
    height: 0;
    z-index: -1;
  }
  .progress-text {
    z-index: 20;
    text-align: center;
  }
</style>
