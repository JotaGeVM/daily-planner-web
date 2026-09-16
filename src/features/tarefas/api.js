import { apiClient } from "../../shared/api/client";

export function getTarefas() {
  return apiClient("/tarefas").then((pagina) => pagina.content);
}

export function criarTarefa(dadosTarefa) {
  return apiClient("/tarefas", {
    method: "POST",
    body: JSON.stringify(dadosTarefa),
  });
}

export function atualizarTarefa(id, dadosTarefa) {
  return apiClient(`/tarefas/${id}`, {
    method: "PUT",
    body: JSON.stringify(dadosTarefa),
  });
}

export function deletarTarefa(id) {
  return apiClient(`/tarefas/${id}`, { method: "DELETE" });
}
