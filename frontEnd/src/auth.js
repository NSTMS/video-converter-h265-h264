 export function hashCode(text) {
  var hash = 0,
    i, chr;
  if (text.length === 0) return hash;
  for (i = 0; i < text.length; i++) {
    chr = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export function isAuthenticated() {
    const isAuth = window.sessionStorage.getItem('auth');
    if(!isAuth) return false;

    const [login, _] = isAuth.split(" ");
    return login;
  }
  
  export function authenticateUser(login,password){
    window.sessionStorage.setItem("auth",login + " " + hashCode(password))
    return true;
  }


  