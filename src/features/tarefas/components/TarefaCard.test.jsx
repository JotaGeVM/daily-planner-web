import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TarefaCard from "./TarefaCard";
describe("TarefaCard", () => {
  const tarefaFake = { id: 1, nome: "Academia", categoriaNome: "Saúde" };
  function renderizar(props = {}) {
    return render(
      <TarefaCard
        tarefa={tarefaFake}
        ocorrenciaHoje={null}
        onCriarOcorrencia={vi.fn()}
        onDeletarOcorrencia={vi.fn()}
        onDeletar={vi.fn()}
        onAbrirInfo={vi.fn()}
        {...props}
      />,
    );
  }
  it("renderiza o nome e a categoria da tarefa", () => {
    renderizar();
    expect(screen.getByText("Academia")).toBeInTheDocument();
    expect(screen.getByText("Saúde")).toBeInTheDocument();
  });
  it("checkbox fica desmarcado quando não há ocorrência hoje", () => {
    renderizar({ ocorrenciaHoje: null });
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });
  it("checkbox fica marcado quando existe ocorrência hoje", () => {
    renderizar({ ocorrenciaHoje: { id: 5 } });
    expect(screen.getByRole("checkbox")).toBeChecked();
  });
  it("chama onCriarOcorrencia ao marcar o checkbox (sem ocorrência hoje)", () => {
    const onCriarOcorrencia = vi.fn();
    renderizar({ ocorrenciaHoje: null, onCriarOcorrencia });
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onCriarOcorrencia).toHaveBeenCalledWith(1);
  });
  it("chama onDeletarOcorrencia ao desmarcar o checkbox (com ocorrência hoje)", () => {
    const onDeletarOcorrencia = vi.fn();
    renderizar({ ocorrenciaHoje: { id: 5 }, onDeletarOcorrencia });
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onDeletarOcorrencia).toHaveBeenCalledWith(5);
  });
  it("chama onAbrirInfo com o id da tarefa ao clicar no nome", () => {
    const onAbrirInfo = vi.fn();
    renderizar({ onAbrirInfo });
    fireEvent.click(screen.getByText("Academia"));
    expect(onAbrirInfo).toHaveBeenCalledWith(1);
  });
  it("chama onDeletar com o id da tarefa ao clicar em Deletar (via SwipeToDelete)", () => {
    const onDeletar = vi.fn();
    renderizar({ onDeletar });
    fireEvent.click(screen.getByText("Deletar"));
    expect(onDeletar).toHaveBeenCalledWith(1);
  });
  it("aplica texto riscado no nome quando concluída hoje", () => {
    renderizar({ ocorrenciaHoje: { id: 5 } });
    expect(screen.getByText("Academia")).toHaveStyle({
      textDecoration: "line-through",
    });
  });
  it("não aplica texto riscado quando não concluída hoje", () => {
    renderizar({ ocorrenciaHoje: null });
    expect(screen.getByText("Academia")).toHaveStyle({
      textDecoration: "none",
    });
  });
});
