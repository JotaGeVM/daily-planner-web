import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TarefaInfo from "./TarefaInfo";
describe("TarefaInfo", () => {
  const tarefaFake = { id: 1, nome: "Academia", descricao: "Ir à academia" };
  it("renderiza o nome e a descrição da tarefa", () => {
    render(
      <TarefaInfo
        tarefa={tarefaFake}
        ocorrenciasTarefa={[]}
        onEditar={vi.fn()}
        onDeletarOcorrencia={vi.fn()}
        onFechar={vi.fn()}
      />,
    );
    expect(screen.getByText("Academia")).toBeInTheDocument();
    expect(screen.getByText("Ir à academia")).toBeInTheDocument();
  });
  it("chama onEditar ao clicar em Editar", () => {
    const onEditar = vi.fn();
    render(
      <TarefaInfo
        tarefa={tarefaFake}
        ocorrenciasTarefa={[]}
        onEditar={onEditar}
        onDeletarOcorrencia={vi.fn()}
        onFechar={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText("Editar"));
    expect(onEditar).toHaveBeenCalledTimes(1);
  });
  it("chama onFechar ao clicar no X", () => {
    const onFechar = vi.fn();
    render(
      <TarefaInfo
        tarefa={tarefaFake}
        ocorrenciasTarefa={[]}
        onEditar={vi.fn()}
        onDeletarOcorrencia={vi.fn()}
        onFechar={onFechar}
      />,
    );
    fireEvent.click(screen.getByText("X"));
    expect(onFechar).toHaveBeenCalledTimes(1);
  });
  it("fecha ao clicar no overlay (fora do conteúdo)", () => {
    const onFechar = vi.fn();
    render(
      <TarefaInfo
        tarefa={tarefaFake}
        ocorrenciasTarefa={[]}
        onEditar={vi.fn()}
        onDeletarOcorrencia={vi.fn()}
        onFechar={onFechar}
      />,
    );
    fireEvent.click(document.querySelector(".modal-overlay"));
    expect(onFechar).toHaveBeenCalledTimes(1);
  });
  it("não fecha ao clicar dentro do conteúdo do modal", () => {
    const onFechar = vi.fn();
    render(
      <TarefaInfo
        tarefa={tarefaFake}
        ocorrenciasTarefa={[]}
        onEditar={vi.fn()}
        onDeletarOcorrencia={vi.fn()}
        onFechar={onFechar}
      />,
    );
    fireEvent.click(screen.getByText("Academia"));
    expect(onFechar).not.toHaveBeenCalled();
  });
  it("histórico começa fechado", () => {
    render(
      <TarefaInfo
        tarefa={tarefaFake}
        ocorrenciasTarefa={[]}
        onEditar={vi.fn()}
        onDeletarOcorrencia={vi.fn()}
        onFechar={vi.fn()}
      />,
    );
    expect(
      screen.queryByText("Nenhum registro ainda."),
    ).not.toBeInTheDocument();
  });
  it("mostra 'Nenhum registro ainda.' quando não há ocorrências e o histórico é aberto", () => {
    render(
      <TarefaInfo
        tarefa={tarefaFake}
        ocorrenciasTarefa={[]}
        onEditar={vi.fn()}
        onDeletarOcorrencia={vi.fn()}
        onFechar={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText(/Histórico de conclusão/));
    expect(screen.getByText("Nenhum registro ainda.")).toBeInTheDocument();
  });
  it("ordena o histórico da data mais recente para a mais antiga", () => {
    const ocorrencias = [
      { id: 1, dataHora: "2026-09-10T10:00:00" },
      { id: 2, dataHora: "2026-09-14T10:00:00" },
      { id: 3, dataHora: "2026-09-12T10:00:00" },
    ];
    render(
      <TarefaInfo
        tarefa={tarefaFake}
        ocorrenciasTarefa={ocorrencias}
        onEditar={vi.fn()}
        onDeletarOcorrencia={vi.fn()}
        onFechar={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText(/Histórico de conclusão/));
    const datas = screen.getAllByText(/às/).map((el) => el.textContent);
    expect(datas).toEqual([
      "14/09/2026 às 10:00",
      "12/09/2026 às 10:00",
      "10/09/2026 às 10:00",
    ]);
  });
  it("chama onDeletarOcorrencia com o id correto ao deletar do histórico", () => {
    const onDeletarOcorrencia = vi.fn();
    const ocorrencias = [{ id: 5, dataHora: "2026-09-14T10:00:00" }];
    render(
      <TarefaInfo
        tarefa={tarefaFake}
        ocorrenciasTarefa={ocorrencias}
        onEditar={vi.fn()}
        onDeletarOcorrencia={onDeletarOcorrencia}
        onFechar={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText(/Histórico de conclusão/));
    fireEvent.click(screen.getByText("Deletar"));
    expect(onDeletarOcorrencia).toHaveBeenCalledWith(5);
  });
});
