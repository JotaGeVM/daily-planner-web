import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SwipeToDelete from "./SwipeToDelete";
describe("SwipeToDelete", () => {
  it("renderiza o conteúdo filho e o botão Deletar", () => {
    render(
      <SwipeToDelete onDeletar={vi.fn()}>
        <p>Conteúdo do item</p>
      </SwipeToDelete>,
    );
    expect(screen.getByText("Conteúdo do item")).toBeInTheDocument();
    expect(screen.getByText("Deletar")).toBeInTheDocument();
  });
  it("chama onDeletar ao clicar no botão Deletar", () => {
    const onDeletar = vi.fn();
    render(
      <SwipeToDelete onDeletar={onDeletar}>
        <p>Item</p>
      </SwipeToDelete>,
    );
    fireEvent.click(screen.getByText("Deletar"));
    expect(onDeletar).toHaveBeenCalledTimes(1);
  });
  it("mantém fechado (translateX(0px)) ao arrastar menos da metade do limite", () => {
    const { container } = render(
      <SwipeToDelete onDeletar={vi.fn()}>
        <p>Item</p>
      </SwipeToDelete>,
    );
    const conteudo = container.querySelector(".swipe-conteudo");
    fireEvent.pointerDown(conteudo, { clientX: 100 });
    fireEvent.pointerMove(conteudo, { clientX: 80 });
    fireEvent.pointerUp(conteudo);
    expect(conteudo.style.transform).toBe("translateX(0px)");
  });
  it("abre totalmente (translateX(-80px)) ao arrastar além da metade do limite", () => {
    const { container } = render(
      <SwipeToDelete onDeletar={vi.fn()}>
        <p>Item</p>
      </SwipeToDelete>,
    );
    const conteudo = container.querySelector(".swipe-conteudo");
    fireEvent.pointerDown(conteudo, { clientX: 100 });
    fireEvent.pointerMove(conteudo, { clientX: 40 });
    fireEvent.pointerUp(conteudo);
    expect(conteudo.style.transform).toBe("translateX(-80px)");
  });
  it("não permite arrastar para a direita (offset nunca fica positivo)", () => {
    const { container } = render(
      <SwipeToDelete onDeletar={vi.fn()}>
        <p>Item</p>
      </SwipeToDelete>,
    );
    const conteudo = container.querySelector(".swipe-conteudo");
    fireEvent.pointerDown(conteudo, { clientX: 100 });
    fireEvent.pointerMove(conteudo, { clientX: 150 });
    fireEvent.pointerUp(conteudo);
    expect(conteudo.style.transform).toBe("translateX(0px)");
  });
  it("fecha ao clicar fora do container depois de estar aberto", () => {
    render(
      <div>
        <SwipeToDelete onDeletar={vi.fn()}>
          <p>Item</p>
        </SwipeToDelete>
        <button>Fora</button>
      </div>,
    );
    const conteudo = document.querySelector(".swipe-conteudo");
    fireEvent.pointerDown(conteudo, { clientX: 100 });
    fireEvent.pointerMove(conteudo, { clientX: 0 });
    fireEvent.pointerUp(conteudo);
    expect(conteudo.style.transform).toBe("translateX(-80px)");
    fireEvent.mouseDown(screen.getByText("Fora"));
    expect(conteudo.style.transform).toBe("translateX(0px)");
  });
});
