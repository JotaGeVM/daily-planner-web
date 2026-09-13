import SwipeToDelete from "../../../shared/components/SwipeToDelete";
function TarefaCard({
  tarefa,
  ocorrenciaHoje,
  onCriarOcorrencia,
  onDeletarOcorrencia,
  onDeletar,
  onAbrirInfo,
}) {
  const concluidaHoje = Boolean(ocorrenciaHoje);
  function handleChangeCheckbox() {
    if (ocorrenciaHoje) {
      onDeletarOcorrencia(ocorrenciaHoje.id);
    } else {
      onCriarOcorrencia(tarefa.id);
    }
  }
  return (
    <SwipeToDelete onDeletar={() => onDeletar(tarefa.id)}>
      <div className="tarefa-card">
        <input
          type="checkbox"
          checked={concluidaHoje}
          onChange={handleChangeCheckbox}
        />
        <h3
          className="tarefa-nome-clicavel"
          style={{ textDecoration: concluidaHoje ? "line-through" : "none" }}
          onClick={() => onAbrirInfo(tarefa.id)}
        >
          {tarefa.nome}
        </h3>
        <span>{tarefa.categoriaNome}</span>
      </div>
    </SwipeToDelete>
  );
}
export default TarefaCard;
