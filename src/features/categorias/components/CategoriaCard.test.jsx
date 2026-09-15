import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CategoriaCard from "./CategoriaCard";
describe("CategoriaCard", () => {
  const categoriaFake = { id: 1, nome: "Trabalho", corHex: "#6366f1" };
  it("renderiza o nome da categoria", () => {
    render(
      <CategoriaCard
        categoria={categoriaFake}
        onDeletar={vi.fn()}
        onAbrirInfo={vi.fn()}
      />,
    );
    expect(screen.getByText("Trabalho")).toBeInTheDocument();
  });
  it("aplica a cor da categoria na borda esquerda", () => {
    render(
      <CategoriaCard
        categoria={categoriaFake}
        onDeletar={vi.fn()}
        onAbrirInfo={vi.fn()}
      />,
    );
    const card = document.querySelector(".categoria-card");
    expect(card).toHaveStyle({ borderLeftColor: "rgb(99, 102, 241)" });
  });
  it("chama onAbrirInfo com o id da categoria ao clicar no nome", () => {
    const onAbrirInfo = vi.fn();
    render(
      <CategoriaCard
        categoria={categoriaFake}
        onDeletar={vi.fn()}
        onAbrirInfo={onAbrirInfo}
      />,
    );
    fireEvent.click(screen.getByText("Trabalho"));
    expect(onAbrirInfo).toHaveBeenCalledWith(1);
  });
  it("chama onDeletar com o id da categoria ao clicar em Deletar", () => {
    const onDeletar = vi.fn();
    render(
      <CategoriaCard
        categoria={categoriaFake}
        onDeletar={onDeletar}
        onAbrirInfo={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText("Deletar"));
    expect(onDeletar).toHaveBeenCalledWith(1);
  });
});
