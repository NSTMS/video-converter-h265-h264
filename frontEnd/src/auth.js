import { writable } from "svelte/store";
export const authenticated = writable(false);
export async function hashCode(text) {
  const msgBuffer = new TextEncoder().encode(text);                    
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export function logOut() {
  window.sessionStorage.removeItem("auth");
  authenticated.set(false);
  window.location.reload();
}

export function isAuthenticated() {
  const isAuth = window.sessionStorage.getItem('auth');
  if (!isAuth) return false;

  const [login] = isAuth.split(" ");
  authenticated.set(true);
  return login;
}

export async function authenticateUser(login, password) {
  const pass = await hashCode(password);
  window.sessionStorage.setItem("auth", login + " ?jsgspt? " + pass)
  return true;
}
