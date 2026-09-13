import { apiClient } from "../../shared/api/client";

export function getOcorrencias() {
  return apiClient("/ocorrencias");
}

export function criarOcorrencia(ocorrencia) {
  return apiClient("/ocorrencias", {
    method: "POST",
    body: JSON.stringify(ocorrencia),
  });
}

export function deletarOcorrencia(id) {
  return apiClient(`/ocorrencias/${id}`, { method: "DELETE" });
}
