import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CategoriaInfo from "./CategoriaInfo";
describe("CategoriaInfo", () => {
  const categoriaFake = {
    id: 1,
    nome: "Trabalho",
    corHex: "#6366f1",
    descricao: "Tarefas do trabalho",
  };
  it("renderiza o nome e a descrição da categoria", () => {
    render(
      <CategoriaInfo
        categoria={categoriaFake}
        tarefasCategoria={[]}
        onEditar={vi.fn()}
        onFechar={vi.fn()}
        onAbrirTarefaInfo={vi.fn()}
      />,
    );
    expect(screen.getByText("Trabalho")).toBeInTheDocument();
    expect(screen.getByText("Tarefas do trabalho")).toBeInTheDocument();
  });
  it("não renderiza parágrafo de descrição quando ela está vazia", () => {
    const categoriaSemDescricao = {
      id: 1,
      nome: "Trabalho",
      corHex: "#6366f1",
      descricao: "",
    };
    render(
      <CategoriaInfo
        categoria={categoriaSemDescricao}
        tarefasCategoria={[]}
        onEditar={vi.fn()}
        onFechar={vi.fn()}
        onAbrirTarefaInfo={vi.fn()}
      />,
    );
    expect(screen.queryByText("Tarefas do trabalho")).not.toBeInTheDocument();
  });
  it("aplica a cor da categoria na bolinha", () => {
    render(
      <CategoriaInfo
        categoria={categoriaFake}
        tarefasCategoria={[]}
        onEditar={vi.fn()}
        onFechar={vi.fn()}
        onAbrirTarefaInfo={vi.fn()}
      />,
    );
    const bolinha = document.querySelector(".categoria-cor");
    expect(bolinha).toHaveStyle({ backgroundColor: "rgb(99, 102, 241)" });
  });
  it("chama onEditar ao clicar em Editar", () => {
    const onEditar = vi.fn();
    render(
      <CategoriaInfo
        categoria={categoriaFake}
        tarefasCategoria={[]}
        onEditar={onEditar}
        onFechar={vi.fn()}
        onAbrirTarefaInfo={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText("Editar"));
    expect(onEditar).toHaveBeenCalledTimes(1);
  });
  it("chama onFechar ao clicar no botão de fechar", () => {
    const onFechar = vi.fn();
    render(
      <CategoriaInfo
        categoria={categoriaFake}
        tarefasCategoria={[]}
        onEditar={vi.fn()}
        onFechar={onFechar}
        onAbrirTarefaInfo={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText("x"));
    expect(onFechar).toHaveBeenCalledTimes(1);
  });
  it("fecha ao clicar no overlay, mas não ao clicar dentro do conteúdo", () => {
    const onFechar = vi.fn();
    render(
      <CategoriaInfo
        categoria={categoriaFake}
        tarefasCategoria={[]}
        onEditar={vi.fn()}
        onFechar={onFechar}
        onAbrirTarefaInfo={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText("Trabalho"));
    expect(onFechar).not.toHaveBeenCalled();
    fireEvent.click(document.querySelector(".modal-overlay"));
    expect(onFechar).toHaveBeenCalledTimes(1);
  });
  it("mostra a contagem de tarefas no botão, mesmo fechado", () => {
    const tarefas = [
      { id: 1, nome: "Reunião" },
      { id: 2, nome: "Email" },
    ];
    render(
      <CategoriaInfo
        categoria={categoriaFake}
        tarefasCategoria={tarefas}
        onEditar={vi.fn()}
        onFechar={vi.fn()}
        onAbrirTarefaInfo={vi.fn()}
      />,
    );
    expect(screen.getByText("Tarefas (2) +")).toBeInTheDocument();
  });
  it("mostra 'Nenhuma tarefa nesta categoria.' quando não há tarefas vinculadas", () => {
    render(
      <CategoriaInfo
        categoria={categoriaFake}
        tarefasCategoria={[]}
        onEditar={vi.fn()}
        onFechar={vi.fn()}
        onAbrirTarefaInfo={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText("Tarefas (0) +"));
    expect(
      screen.getByText("Nenhuma tarefa nesta categoria."),
    ).toBeInTheDocument();
  });
  it("ordena as tarefas alfabeticamente pelo nome", () => {
    const tarefas = [
      { id: 1, nome: "Zebra" },
      { id: 2, nome: "Academia" },
      { id: 3, nome: "Mercado" },
    ];
    render(
      <CategoriaInfo
        categoria={categoriaFake}
        tarefasCategoria={tarefas}
        onEditar={vi.fn()}
        onFechar={vi.fn()}
        onAbrirTarefaInfo={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText("Tarefas (3) +"));
    const nomes = screen
      .getAllByRole("button", { name: /Academia|Mercado|Zebra/ })
      .map((el) => el.textContent);
    expect(nomes).toEqual(["Academia", "Mercado", "Zebra"]);
  });
  it("chama onAbrirTarefaInfo com o id correto ao clicar numa tarefa da lista", () => {
    const onAbrirTarefaInfo = vi.fn();
    const tarefas = [{ id: 7, nome: "Reunião" }];
    render(
      <CategoriaInfo
        categoria={categoriaFake}
        tarefasCategoria={tarefas}
        onEditar={vi.fn()}
        onFechar={vi.fn()}
        onAbrirTarefaInfo={onAbrirTarefaInfo}
      />,
    );
    fireEvent.click(screen.getByText("Tarefas (1) +"));
    fireEvent.click(screen.getByText("Reunião"));
    expect(onAbrirTarefaInfo).toHaveBeenCalledWith(7);
  });
});
