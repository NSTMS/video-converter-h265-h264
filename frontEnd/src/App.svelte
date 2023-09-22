<script>
    function uploadFile(event) {
        const data = new FormData();
        data.append('file', event.target.files[0]);
        fetch("http://localhost:3001/api/upload", {
            method: 'POST',
            body: data
        })
            .then(res => {
            console.log(res.statusText);
            }).catch((err)=>{
                console.log("err: ", err)
            });
}

  </script>

<input type="file" on:change={uploadFile} />
