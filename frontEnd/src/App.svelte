<script>
    let source;
    let video;

    let percentage = '0';

    const prgCheck = (vid)=>{
        fetch("http://localhost:3001/prg/"+vid)
        .then(res=>res.json())
        .then(snap=>{
            if(percentage != "End"){
                setTimeout(()=>prgCheck(vid), 1000)
                percentage = Number(snap.perc).toFixed(2) + "%";
            }
            else {
                getVid(vid);
                percentage = "End"
            }
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
<div class="progress-wrapper">
    <div class="progress-bar" style="width: {percentage}%; height: 20px;"></div>
    <p class="progress-text">{percentage}</p>
</div>
<video bind:this={video} width="500" controls>
    <source bind:this={source} type="video/mp4"/>
</video>


<style>
    .progress-wrapper {
        width: 300px;
        height: 20px;
        position: relative;
    }
    .progress-bar{
        background: lightgreen;
        height: 20px;
        position: absolute;
        top: 0;
        height: 0;
        z-index: -1;
    }
    .progress-text{
        z-index: 20;
        text-align: center;
    }

</style>