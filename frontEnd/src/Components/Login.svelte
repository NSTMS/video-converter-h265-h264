<script>
// @ts-nocheck

    import { onMount } from "svelte";

// @ts-nocheck
    import { authenticateUser, hashCode, isAuthenticated } from "../auth";
    import { navigate,Link } from "svelte-routing";
    let login = "";
    let password ="";
    let message  = "";
  
    onMount(()=>{
        const isAuth = isAuthenticated();
        if(isAuth) window.location.pathname = "converter";
    })

    const logUser = () =>{
        fetch("http://localhost:3001/login",{
            method: "POST",
            body: JSON.stringify({"login" : login, "password" : hashCode(password)}),
            headers: {
                "Content-Type": "application/json",
            }
        }).then(res => res.json()).then((servRes) =>{
            if(servRes.ok)
            {
                authenticateUser(login, password).then(()=>{
                    navigate("/converter");
                });
            }       
            else{
                message = servRes.msg;
                login = ""
                password = "";
            }
        })
        

    }
</script>

<main class="flex flex-col mt-20 text-center">
<div class="flex flex-col gap-4 w-1/2 justify-center align-middle mx-auto">
    <div class="flex justify-center align-middle mx-auto gap-3">
        <p>LOGIN: </p>
        <input type="text" class="text-black" name="login" id="login" bind:value={login}>
    </div>
    <div class="flex justify-center align-middle mx-auto gap-3">
        <p>PASSWORD: </p>
        <input type="password"class="text-black"  name="password" id="password"bind:value={password} >
    </div>
</div>
<p id="response">{message}</p>
<button type="button" on:click={logUser}>log in</button>
<Link to={"register"}>nie masz konta? załóż</Link>
</main>
