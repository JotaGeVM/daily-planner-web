import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TarefaForm from "./TarefaForm";
import { getCategorias } from "../../categorias/api";
vi.mock("../../categorias/api", () => ({ getCategorias: vi.fn() }));
describe("TarefaForm", () => {
  const categoriasFake = [
    { id: 1, nome: "Trabalho", corHex: "#6366f1" },
    { id: 2, nome: "Pessoal", corHex: "#22c55e" },
  ];

  beforeEach(() => {
    getCategorias.mockResolvedValue(categoriasFake);
  });

  it("carrega e exibe as categorias no select", async () => {
    render(<TarefaForm onSalvar={vi.fn()} onCancelar={vi.fn()} />);

    expect(
      await screen.findByRole("option", { name: "Trabalho" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("option", { name: "Pessoal" })).toBeInTheDocument();
  });

  it("mostra erros em todos os campos obrigatórios quando vazios", async () => {
    const onSalvar = vi.fn();
    render(<TarefaForm onSalvar={onSalvar} onCancelar={vi.fn()} />);
    await screen.findByRole("option", { name: "Trabalho" });
    fireEvent.click(screen.getByText("Salvar"));
    expect(await screen.findByText("Nome é obrigatório.")).toBeInTheDocument();
    expect(screen.getByText("Descrição é obrigatória.")).toBeInTheDocument();
    expect(screen.getByText("Selecione uma categoria.")).toBeInTheDocument();
    expect(screen.getByText("Selecione o tipo.")).toBeInTheDocument();
    expect(screen.getByText("Selecione a recorrência.")).toBeInTheDocument();
    expect(onSalvar).not.toHaveBeenCalled();
  });

  it("limpa só o erro do campo editado, mantendo os outros", async () => {
    render(<TarefaForm onSalvar={vi.fn()} onCancelar={vi.fn()} />);
    await screen.findByRole("option", { name: "Trabalho" });
    fireEvent.click(screen.getByText("Salvar"));
    await screen.findByText("Nome é obrigatório.");

    fireEvent.change(screen.getByLabelText("Nome", {exact: false}), {
      target: { value: "Reunião" },
    });

    expect(screen.queryByText("Nome é obrigatório.")).not.toBeInTheDocument();
    expect(screen.getByText("Descrição é obrigatória.")).toBeInTheDocument();
  });

  it("chama onSalvar com os dados corretos quando o formulário é válido", async () => {
    const onSalvar = vi.fn().mockResolvedValue();
    render(<TarefaForm onSalvar={onSalvar} onCancelar={vi.fn()} />);
    await screen.findByRole("option", { name: "Trabalho" });
    fireEvent.change(screen.getByLabelText("Nome"), {
      target: { value: "Reunião" },
    });
    fireEvent.change(screen.getByLabelText("Descrição"), {
      target: { value: "Reunião do time" },
    });
    fireEvent.change(screen.getByLabelText("Categoria"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText("Tipo"), {
      target: { value: "TAREFA" },
    });
    fireEvent.change(screen.getByLabelText("Recorrência"), {
      target: { value: "NENHUMA" },
    });
    fireEvent.click(screen.getByText("Salvar"));
    await waitFor(() => {
      expect(onSalvar).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          nome: "Reunião",
          descricao: "Reunião do time",
          categoriaId: "1",
          tipo: "TAREFA",
          recorrencia: "NENHUMA",
        }),
      );
    });
  });

  it("mostra a mensagem geral de erro quando onSalvar rejeita com uma mensagem", async () => {
    const onSalvar = vi
      .fn()
      .mockRejectedValue({ message: "Erro inesperado ao salvar" });

    render(<TarefaForm onSalvar={onSalvar} onCancelar={vi.fn()} />);
    await screen.findByRole("option", { name: "Trabalho" });

    fireEvent.change(screen.getByLabelText("Nome"), {
      target: { value: "Reunião" },
    });

    fireEvent.change(screen.getByLabelText("Descrição"), {
      target: { value: "Reunião do time" },
    });

    fireEvent.change(screen.getByLabelText("Categoria"), {
      target: { value: "1" },
    });

    fireEvent.change(screen.getByLabelText("Tipo"), {
      target: { value: "TAREFA" },
    });

    fireEvent.change(screen.getByLabelText("Recorrência"), {
      target: { value: "NENHUMA" },
    });

    fireEvent.click(screen.getByText("Salvar"));

    expect(
      await screen.findByText("Erro inesperado ao salvar"),
    ).toBeInTheDocument();
  });

  it("mostra o erro no campo específico quando onSalvar rejeita com camposInvalidos", async () => {
    const onSalvar = vi
      .fn()
      .mockRejectedValue({ camposInvalidos: { nome: "nome inválido" } });

    render(<TarefaForm onSalvar={onSalvar} onCancelar={vi.fn()} />);
    await screen.findByRole("option", { name: "Trabalho" });

    fireEvent.change(screen.getByLabelText("Nome"), {
      target: { value: "Reunião" },
    });

    fireEvent.change(screen.getByLabelText("Descrição"), {
      target: { value: "Reunião do time" },
    });

    fireEvent.change(screen.getByLabelText("Categoria"), {
      target: { value: "1" },
    });

    fireEvent.change(screen.getByLabelText("Tipo"), {
      target: { value: "TAREFA" },
    });

    fireEvent.change(screen.getByLabelText("Recorrência"), {
      target: { value: "NENHUMA" },
    });

    fireEvent.click(screen.getByText("Salvar"));
    expect(await screen.findByText("nome inválido")).toBeInTheDocument();
  });
});
