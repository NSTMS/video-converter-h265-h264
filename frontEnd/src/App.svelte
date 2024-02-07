<script>
  // @ts-nocheck
  import { isAuthenticated, authenticated } from "./auth.js";

  import { Router, Route,navigate } from "svelte-routing";
  import { onMount } from "svelte";
  import Header from "./Components/Header.svelte";
  import Gallery from "./Components/Gallery.svelte";
  import Converter from "./Components/Converter.svelte";
  import Login from "./Components/Login.svelte";
  import Register from "./Components/Register.svelte";
    import { comment } from "svelte/internal";
    import PreviewVideo from "./Components/PreviewVideo.svelte";
  export let url = "";

  const ALLOWED_ROUTES = ["/", "/gallery", "/register", "/converter"];
  onMount(() => {
    isAuthenticated();
    if (!ALLOWED_ROUTES.includes(window.location.pathname)) {
      window.location.pathname = "/"
    }
    if(!$authenticated && (window.location.pathname != "/register" && window.location.pathname != "/login" )){
      navigate("/");
    }
    authenticated.subscribe((val) => {
      if(!val && (window.location.pathname != "/register" && window.location.pathname != "/login" )){
      navigate("/");
    }
    });
  });
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
    <Route path="/gallery/:vid" let:params >
      <PreviewVideo vid_id={params.vid}/>
    </Route>
  </Router>
</div>
