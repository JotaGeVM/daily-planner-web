import { useState } from "react";
import "../tarefas.css";
import TarefaCard from "./TarefaCard";
import SwipeToDelete from "../../../shared/components/SwipeToDelete";
import StreakCard from "./StreakCard";

function HabitoOcorrenciaCard({
  tarefa,
  ordinalIndice,
  dataHora,
  onSolicitarExcluir,
  onExcluir,
}) {
  const percentual = Math.round((ordinalIndice / tarefa.metaDiaria) * 100);
  const hora = new Date(dataHora).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <SwipeToDelete onDeletar={onExcluir}>
      <div className="tarefa-card habito-card">
        <div className="habito-card-topo">
          <span
            className="categoria-indicador categoria-indicador-concluida"
            style={{ backgroundColor: tarefa.categoriaCorHex }}
          />
          <input type="checkbox" checked onChange={onSolicitarExcluir} />
          <h3 className="tarefa-nome-clicavel" style={{ cursor: "default" }}>
            {tarefa.nome}
          </h3>
          <span>{tarefa.categoriaNome}</span>
        </div>
        <div className="habito-progresso">
          <div className="habito-progresso-barra">
            <div
              className="habito-progresso-preenchimento"
              style={{ width: `${percentual}%` }}
            />
          </div>
          <span className="habito-progresso-texto">
            {ordinalIndice}/{tarefa.metaDiaria} · {percentual}% · {hora}
          </span>
        </div>
      </div>
    </SwipeToDelete>
  );
}

function ListarTarefas({
  tarefas,
  ocorrencias,
  carregando,
  hoje,
  onDeletar,
  onCriarOcorrencia,
  onDeletarOcorrencia,
  onAbrirInfo,
  onCriandoTarefa,
}) {
  const [ocorrenciaParaExcluir, setOcorrenciaParaExcluir] = useState(null);
  const [naoConfirmarExclusao, setNaoConfirmarExclusao] = useState(false);

  if (carregando) {
    return <p>Carregando tarefas...</p>;
  }

  const mapaTarefas = new Map(tarefas.map((t) => [t.id, t]));

  const ocorrenciasDeHabitosHoje = ocorrencias.filter((o) => {
    const tarefa = mapaTarefas.get(o.tarefaId);
    return tarefa?.tipo === "HABITO" && o.dataHora?.startsWith(hoje);
  });

  const ordenadasPorHorario = [...ocorrenciasDeHabitosHoje].sort(
    (a, b) => new Date(a.dataHora) - new Date(b.dataHora),
  );

  const contadorPorTarefa = {};
  const itensOcorrencias = ordenadasPorHorario.map((ocorrencia) => {
    contadorPorTarefa[ocorrencia.tarefaId] =
      (contadorPorTarefa[ocorrencia.tarefaId] ?? 0) + 1;
    return {
      ocorrencia,
      tarefa: mapaTarefas.get(ocorrencia.tarefaId),
      ordinalIndice: contadorPorTarefa[ocorrencia.tarefaId],
    };
  });

  return (
    <>
      <button className="btn-primary" onClick={onCriandoTarefa}>
        + Nova Tarefa
      </button>
      <div className="lista-tarefas">
        {tarefas.map((tarefa) => {
          const ocorrenciasHoje = ocorrencias.filter(
            (o) => o.tarefaId === tarefa.id && o.dataHora?.startsWith(hoje),
          );
          return (
            <TarefaCard
              key={tarefa.id}
              tarefa={tarefa}
              ocorrenciasHoje={ocorrenciasHoje}
              onCriarOcorrencia={onCriarOcorrencia}
              onDeletarOcorrencia={onDeletarOcorrencia}
              onDeletar={onDeletar}
              onAbrirInfo={onAbrirInfo}
            />
          );
        })}
        {itensOcorrencias.map(({ ocorrencia, tarefa, ordinalIndice }) => (
          <HabitoOcorrenciaCard
            key={ocorrencia.id}
            tarefa={tarefa}
            ordinalIndice={ordinalIndice}
            dataHora={ocorrencia.dataHora}
            onSolicitarExcluir={() => {
              if (naoConfirmarExclusao) {
                onDeletarOcorrencia(ocorrencia.id);
              } else {
                setOcorrenciaParaExcluir(ocorrencia);
              }
            }}
            onExcluir={() => onDeletarOcorrencia(ocorrencia.id)}
          />
        ))}
        {tarefas
          .filter((t) => t.tipo === "HABITO" && t.metaDiaria)
          .map((tarefa) => (
            <StreakCard
              key={`streak-${tarefa.id}`}
              tarefa={tarefa}
              ocorrenciasCount={
                ocorrencias.filter((o) => o.tarefaId === tarefa.id).length
              }
            />
          ))}
      </div>

      {ocorrenciaParaExcluir && (
        <div
          className="modal-overlay"
          onClick={(evento) => {
            if (evento.target === evento.currentTarget) {
              setOcorrenciaParaExcluir(null);
            }
          }}
        >
          <div className="modal-conteudo confirmar-exclusao">
            <p>
              Desmarcar essa conclusão vai excluir esse registro. Deseja
              continuar?
            </p>
            <div className="confirmar-exclusao-nao-mostrar">
              <input
                type="checkbox"
                checked={naoConfirmarExclusao}
                onChange={(e) => setNaoConfirmarExclusao(e.target.checked)}
              />
              <p>Não ver essa mensagem novamente</p>
            </div>
            <div className="confirmar-exclusao-botoes">
              <button
                type="button"
                onClick={() => setOcorrenciaParaExcluir(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => {
                  onDeletarOcorrencia(ocorrenciaParaExcluir.id);
                  setOcorrenciaParaExcluir(null);
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default ListarTarefas;
