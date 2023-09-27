<script>
    let source;
    let video;

    let percentage = 'None';

    const prgCheck = (vid)=>{
        fetch("http://localhost:3001/prg/"+vid)
        .then(res=>res.json())
        .then(snap=>{
            percentage = snap.perc;
            if(percentage != "End") setTimeout(()=>prgCheck(vid), 1000);
            else getVid(vid);
        })
    }

    const getVid = (vid)=>{
        fetch("http://localhost:3001/vid/"+vid)
        .then(res=>res.blob())
        .then(snap=>{
            source.src = URL.createObjectURL(new Blob([snap],{type:"video/mp4"}))
            video.load();
        })
    }

    function uploadFile(event) {
        const data = new FormData();
        data.append('file', event.target.files[0]);
        fetch("http://localhost:3001/api/upload", {
            method: 'POST',
            body: data
        })
        .then(res => res.json())
        .then((snap)=>{
            prgCheck(snap.video);
        })
        .catch((err)=>{
            console.log("err: ", err)
        });
    }
  </script>

<input type="file" on:change={uploadFile} />
<p>{percentage}</p>
<video bind:this={video} width="500" controls>
    <source bind:this={source} type="video/mp4"/>
</video>
