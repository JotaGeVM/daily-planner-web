import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "./client";
describe("apiClient", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  it("retorna os dados quando a resposta for bem-sucedida", async () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 1, nome: "Teste" }),
    });

    const resultado = await apiClient("/tarefas");

    expect(resultado).toEqual({ id: 1, nome: "Teste" });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/tarefas",
      expect.objectContaining({
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  it("retorna null quando a resposta for 204 (sem conteúdo)", async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, status: 204 });

    const resultado = await apiClient("/tarefas/1", { method: "DELETE" });

    expect(resultado).toBeNull();
  });

  it("retorna ApiError com a mensagem do backend quando o erro tiver o campo mensagem", async () => {
    globalThis.fetch.mockResolvedValue({
      ok: false,
      status: 409,

      json: async () => ({
        status: 409,
        mensagem: "Categoria com nome 'Teste' já cadastrada",
        timestamp: "2026-09-14T10:00:00",
      }),
    });

    await expect(
      apiClient("/categorias", { method: "POST" }),
    ).rejects.toMatchObject({
      message: "Categoria com nome 'Teste' já cadastrada",
      camposInvalidos: null,
    });
  });

  it("retorna ApiError com camposInvalidos quando o erro for um mapa de validação", async () => {
    globalThis.fetch.mockResolvedValue({
      ok: false,
      status: 400,

      json: async () => ({ nome: "não deve estar em branco" }),
    });

    await expect(
      apiClient("/categorias", { method: "POST" }),
    ).rejects.toMatchObject({
      camposInvalidos: { nome: "não deve estar em branco" },
    });
  });
});
