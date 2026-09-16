const CHAVE_TOKEN = "daily_planner_token";

export function getToken() {
  return localStorage.getItem(CHAVE_TOKEN);
}

export function setToken(token) {
  localStorage.setItem(CHAVE_TOKEN, token);
}

export function clearToken() {
  localStorage.removeItem(CHAVE_TOKEN);
}
