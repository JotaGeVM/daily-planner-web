import "../tarefas.css";
import TarefaCard from "./TarefaCard";
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
  if (carregando) {
    return <p>Carregando tarefas...</p>;
  }
  return (
    <>
      <button className="btn-primary" onClick={onCriandoTarefa}>
        + Nova Tarefa
      </button>
      <div className="lista-tarefas">
        {tarefas.map((tarefa) => {
          const ocorrenciaHoje = ocorrencias.find(
            (o) => o.tarefaId === tarefa.id && o.dataHora?.startsWith(hoje),
          );
          return (
            <TarefaCard
              key={tarefa.id}
              tarefa={tarefa}
              ocorrenciaHoje={ocorrenciaHoje}
              onCriarOcorrencia={onCriarOcorrencia}
              onDeletarOcorrencia={onDeletarOcorrencia}
              onDeletar={onDeletar}
              onAbrirInfo={onAbrirInfo}
            />
          );
        })}
      </div>
    </>
  );
}
export default ListarTarefas;
