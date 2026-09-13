import { useState } from "react";
import OcorrenciaCard from "../../ocorrencias/components/OcorrenciaCard";
import "../../ocorrencias/ocorrencias.css";
function TarefaInfo({
  tarefa,
  ocorrenciasTarefa,
  onEditar,
  onDeletarOcorrencia,
  onFechar,
}) {
  const [historicoAberto, setHistoricoAberto] = useState(false);
  const historicoOrdenado = [...ocorrenciasTarefa].sort(
    (a, b) => new Date(b.dataHora) - new Date(a.dataHora),
  );
  return (
    <div
      className="modal-overlay"
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) {
          onFechar();
        }
      }}
    >
      <div className="modal-conteudo tarefa-info">
        <button className="btn-fechar" onClick={onFechar}>
          X
        </button>
        <div className="tarefa-info-header">
          <h3>{tarefa.nome}</h3>
          <button className="btn-primary" onClick={onEditar}>
            Editar
          </button>
        </div>
        <p>{tarefa.descricao}</p>
        <button
          className="historico-toggle"
          onClick={() => setHistoricoAberto((atual) => !atual)}
        >
          Histórico de conclusão {historicoAberto ? "−" : "+"}
        </button>
        {historicoAberto && (
          <div className="historico-panel">
            {historicoOrdenado.length === 0 ? (
              <p className="historico-vazio">Nenhum registro ainda.</p>
            ) : (
              historicoOrdenado.map((ocorrencia) => (
                <OcorrenciaCard
                  key={ocorrencia.id}
                  ocorrencia={ocorrencia}
                  onDeletar={onDeletarOcorrencia}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default TarefaInfo;
