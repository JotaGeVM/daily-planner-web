import { apiClient } from "../../shared/api/client";

export function login(dados) {
  return apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function registrar(dados) {
  return apiClient("/auth/registrar", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}
