<script>
// @ts-nocheck

    import { navigate,Link } from "svelte-routing";
    import { onMount } from "svelte";
    import { authenticateUser, isAuthenticated } from "../auth";
    let login = "";
    let password ="";
    let password2 = "";
    let message  = "";
    onMount(()=>{
        const isAuth = isAuthenticated();
        if(isAuth) window.location.pathname = "converter";
    })
    const registerUser = () =>{
        if(password != password2){
            message = "hasła nie są takie same";
            return;
        }
        else if(password.length < 6)
        {
            message = "hasło musi mieć co najmniej 6 znaków"
            return;
        }
        else if(login.trim().length == 0 || password.trim().length == 0)
        {
            message = "login i hasło muszą zawierać znaki";
            return;
        }

        fetch("http://localhost:3001/register",{
            method: "POST",
            body: JSON.stringify({"login" : login, "password" : password}),
        }).then(res => res.json()).then((servRes) =>{
            if(servRes.ok)
            {
                authenticateUser(login,password)
                window.location.pathname = "/converter"
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
    <div class="flex justify-center align-middle mx-auto  gap-3">
        <p>LOGIN: </p>
        <input type="text" name="login" id="login" bind:value={login} class="text-black">
    </div>
    <div class="flex justify-center align-middle mx-auto gap-3">
        <p>PASSWORD: </p>
        <input type="text" name="password" id="password"bind:value={password}  class="text-black">
    </div>
    <div class="flex justify-center align-middle mx-auto gap-3">
        <p>PASSWORD: </p>
        <input type="text" name="password" id="password"bind:value={password2} class="text-black" >
    </div>
</div>
<p id="response">{message}</p>
<button type="button" on:click={registerUser}>register user</button>

<Link to={""}>masz konto? zaloguj się</Link>

</main>
