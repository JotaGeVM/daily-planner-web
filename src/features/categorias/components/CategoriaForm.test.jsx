import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CategoriaForm from "./CategoriaForm";

describe("CategoriaForm", () => {
  it("renderiza campos vazios no modo criar", () => {
    render(<CategoriaForm onSalvar={vi.fn()} onCancelar={vi.fn()} />);
    expect(screen.getByLabelText("Nome")).toHaveValue("");
  });

  it("renderiza campos preenchidos no modo editar", () => {
    const categoria = {
      id: 1,
      nome: "Trabalho",
      corHex: "#6366f1",
      descricao: "Tarefas do trabalho",
    };

    render(
      <CategoriaForm
        categoria={categoria}
        onSalvar={vi.fn()}
        onCancelar={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Nome")).toHaveValue("Trabalho");
    expect(screen.getByLabelText("Descrição")).toHaveValue(
      "Tarefas do trabalho",
    );
  });

  it("mostra erro e não chama onSalvar quando o nome está vazio", async () => {
    const onSalvar = vi.fn();

    render(<CategoriaForm onSalvar={onSalvar} onCancelar={vi.fn()} />);

    fireEvent.click(screen.getByText("Salvar"));

    expect(await screen.findByText("Nome é obrigatório.")).toBeInTheDocument();

    expect(onSalvar).not.toHaveBeenCalled();
  });

  it("chama onSalvar com os dados corretos quando o formulário é válido", async () => {
    const onSalvar = vi.fn().mockResolvedValue();

    render(<CategoriaForm onSalvar={onSalvar} onCancelar={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("Nome"), {
      target: { value: "Saúde" },
    });

    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(onSalvar).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ nome: "Saúde" }),
      );
    });
  });

  it("chama onCancelar ao clicar em Cancelar", () => {
    const onCancelar = vi.fn();

    render(<CategoriaForm onSalvar={vi.fn()} onCancelar={onCancelar} />);

    fireEvent.click(screen.getByText("Cancelar"));

    expect(onCancelar).toHaveBeenCalledTimes(1);
  });

  it("mostra a mensagem geral de erro quando onSalvar rejeita com uma mensagem", async () => {
    const onSalvar = vi.fn().mockRejectedValue({
      message: "Categoria com nome 'Saúde' já cadastrada",
    });

    render(<CategoriaForm onSalvar={onSalvar} onCancelar={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("Nome"), {
      target: { value: "Saúde" },
    });

    fireEvent.click(screen.getByText("Salvar"));

    expect(
      await screen.findByText("Categoria com nome 'Saúde' já cadastrada"),
    ).toBeInTheDocument();
  });

  it("mostra o erro no campo específico quando onSalvar rejeita com camposInvalidos", async () => {
    const onSalvar = vi.fn().mockRejectedValue({
      camposInvalidos: { nome: "já existe uma categoria com esse nome" },
    });

    render(<CategoriaForm onSalvar={onSalvar} onCancelar={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("Nome"), {
      target: { value: "Saúde" },
    });

    fireEvent.click(screen.getByText("Salvar"));

    expect(
      await screen.findByText("já existe uma categoria com esse nome"),
    ).toBeInTheDocument();
  });
});
