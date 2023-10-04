<script>
  import { Router, Route } from "svelte-routing";
  import { onMount } from "svelte";
  import Header from "./Components/Header.svelte";
  import Gallery from "./Components/Gallery.svelte";
  import Converter from "./Components/Converter.svelte";
  export let url = "";
  onMount(() => {
    if (url !== '' && url !== '/gallery') {
      window.location.href = '/';
    }
  });
</script>

<div
  class="mx-auto flex flex-col text-center w-screen min-h-screen h-full bg-black text-white"
>
  <Header />
  <Router {url}>
    <Route path="/" component={Converter} />
    <Route path="/gallery" component={Gallery} />
  </Router>
</div>
