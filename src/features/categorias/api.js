import { apiClient } from "../../shared/api/client";

export function getCategorias() {
  return apiClient("/categorias").then((pagina) => pagina.content);
}

export function criarCategoria(categoria) {
  return apiClient("/categorias", {
    method: "POST",
    body: JSON.stringify(categoria),
  });
}

export function atualizarCategoria(id, dadosCategoria) {
  return apiClient(`/categorias/${id}`, {
    method: "PUT",
    body: JSON.stringify(dadosCategoria),
  });
}

export function deletarCategoria(id) {
  return apiClient(`/categorias/${id}`, { method: "DELETE" });
}
