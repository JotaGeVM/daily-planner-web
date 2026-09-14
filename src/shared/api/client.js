const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

class ApiError extends Error {
  constructor(message, camposInvalidos = null, status = null) {
    super(message);
    this.name = "ApiError";
    this.camposInvalidos = camposInvalidos;
    this.status = status;
  }
}

export async function apiClient(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    let mensagem = `Erro ${response.status}: ${response.statusText}`;
    let camposInvalidos = null;
    try {
      const corpo = await response.json();
      if (corpo && typeof corpo.mensagem === "string") {
        mensagem = corpo.mensagem;
      } else if (corpo && typeof corpo === "object") {
        camposInvalidos = corpo;
        mensagem = "Existem campos inválidos no formulário.";
      }
    } catch {
      // corpo não era JSON válido, mantém a mensagem padrão
    }
    throw new ApiError(mensagem, camposInvalidos, response.status);
  }
  if (response.status === 204) return null;
  return response.json();
}
