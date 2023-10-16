<script>
  // @ts-nocheck
  import { isAuthenticated } from "./auth.js";

  import { Router, Route,navigate } from "svelte-routing";
  import { onMount } from "svelte";
  import Header from "./Components/Header.svelte";
  import Gallery from "./Components/Gallery.svelte";
  import Converter from "./Components/Converter.svelte";
  import Login from "./Components/Login.svelte";
  import Register from "./Components/Register.svelte";
  export let url = "";

  let authenticated = false;
  const ALLOWED_ROUTES = ["/", "/gallery", "/register", "/converter"];
  onMount(() => {
    authenticated = isAuthenticated();
    if (!ALLOWED_ROUTES.includes(window.location.pathname)) {
      window.location.pathname = "/"
    }
  });
  console.log(window.location.pathname)

</script>

<div
  class="mx-auto flex flex-col text-center w-screen min-h-screen h-full bg-black text-white"
>
  <Header />

  <Router {url}>
    <Route path="/" component={Login} />
    <Route path="/converter" component={Converter} />
    <Route path="/register" component={Register} />
    <Route path="/gallery" component={Gallery} />
  </Router>
</div>
