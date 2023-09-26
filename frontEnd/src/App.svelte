<script>
    let source;
    let video;
    function uploadFile(event) {
        const data = new FormData();
        data.append('file', event.target.files[0]);
        fetch("http://localhost:3001/api/upload", {
            method: 'POST',
            body: data
        })
        .then(res => res.blob())
        .then((snap)=>{
            source.src = URL.createObjectURL(new Blob([snap],{type:"video/mp4"}))
            video.load();
        })
        .catch((err)=>{
            console.log("err: ", err)
        });
    }
  </script>

<input type="file" on:change={uploadFile} />
<video bind:this={video} width="500" controls>
    <source bind:this={source} type="video/mp4"/>
</video>
