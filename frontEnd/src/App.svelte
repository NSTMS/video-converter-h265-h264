<script>
    let source = "";
    function uploadFile(event) {
        const data = new FormData();
        data.append('file', event.target.files[0]);
        fetch("http://localhost:3001/api/upload", {
            method: 'POST',
            body: data
        })
        .then(res => res.blob())
        .then(async(video) =>{
            const buf = await video.arrayBuffer();
            source = URL.createObjectURL(new Blob([buf]));
        })
        .catch((err)=>{
            console.log("err: ", err)
        });
}

  </script>

<input type="file" on:change={uploadFile} />
<video width="500" controls>
    <source src={source} type="video/mp4"/>
</video>
