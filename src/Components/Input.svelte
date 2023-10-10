<script>
    export let uploadFile;
</script>

<div>
    <input
        type="file"
        on:change={uploadFile}
        id="input"
        name="input"
        style="display:none;"
        accept="video/*"
    />
    <label
        for="input"
        class="bg-gray-800 text-neutral-200 font-bold py-2 px-4 rounded inline-flex items-center cursor-pointer border-2 border-gray-800 hover:bg-gray-600 hover:border-gray-600"
        >choose file</label
    >
</div>
