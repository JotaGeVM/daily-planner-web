import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import OcorrenciaCard from "./OcorrenciaCard";
describe("OcorrenciaCard", () => {
  it("formata a data e a hora corretamente", () => {
    const ocorrencia = { id: 1, dataHora: "2026-09-14T14:30:00" };
    render(<OcorrenciaCard ocorrencia={ocorrencia} onDeletar={vi.fn()} />);
    expect(screen.getByText("14/09/2026 às 14:30")).toBeInTheDocument();
  });
  it("não quebra quando dataHora é null", () => {
    const ocorrencia = { id: 1, dataHora: null };
    render(<OcorrenciaCard ocorrencia={ocorrencia} onDeletar={vi.fn()} />);
    const spanData = document.querySelector(".ocorrencia-data");
    expect(spanData.textContent.trim()).toBe("às");
  });
  it("exibe o ícone de status concluída", () => {
    const ocorrencia = { id: 1, dataHora: "2026-09-14T14:30:00" };
    render(<OcorrenciaCard ocorrencia={ocorrencia} onDeletar={vi.fn()} />);
    expect(screen.getByText("✅")).toBeInTheDocument();
  });
  it("chama onDeletar com o id da ocorrência ao clicar em Deletar", () => {
    const onDeletar = vi.fn();
    const ocorrencia = { id: 7, dataHora: "2026-09-14T14:30:00" };
    render(<OcorrenciaCard ocorrencia={ocorrencia} onDeletar={onDeletar} />);
    fireEvent.click(screen.getByText("Deletar"));
    expect(onDeletar).toHaveBeenCalledWith(7);
  });
});
