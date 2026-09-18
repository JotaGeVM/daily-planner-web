import SwipeToDelete from "../../../shared/components/SwipeToDelete";

function TarefaCard({
  tarefa,
  ocorrenciasHoje,
  onCriarOcorrencia,
  onDeletarOcorrencia,
  onDeletar,
  onAbrirInfo,
}) {
  const ehHabito = tarefa.tipo === "HABITO" && Boolean(tarefa.metaDiaria);

  if (ehHabito) {
    const totalHoje = ocorrenciasHoje.length;
    if (totalHoje >= tarefa.metaDiaria) return null;

    const percentual = Math.round((totalHoje / tarefa.metaDiaria) * 100);

    return (
      <SwipeToDelete onDeletar={() => onDeletar(tarefa.id)}>
        <div className="tarefa-card habito-card">
          <div className="habito-card-topo">
            <span
              className="categoria-indicador"
              style={{backgroundColor: tarefa.categoriaCorHex}}
            />
            <input
              type="checkbox"
              checked={false}
              onChange={() => onCriarOcorrencia(tarefa.id)}
            />
            <h3
              className="tarefa-nome-clicavel"
              onClick={() => onAbrirInfo(tarefa.id)}
            >
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
              {totalHoje}/{tarefa.metaDiaria} · {percentual}%
            </span>
          </div>
        </div>
      </SwipeToDelete>
    );
  }

  const totalHoje = ocorrenciasHoje.length;
  const concluidaHoje = totalHoje > 0;

  function handleChangeCheckbox() {
    if (concluidaHoje) {
      onDeletarOcorrencia(ocorrenciasHoje[0].id);
    } else {
      onCriarOcorrencia(tarefa.id);
    }
  }

  return (
    <SwipeToDelete onDeletar={() => onDeletar(tarefa.id)}>
      <div className="tarefa-card">
        <span
          className={`categoria-indicador ${concluidaHoje ? "categoria-indicador-concluida" : ""}`}
          style={{backgroundColor: tarefa.categoriaCorHex}}
        />
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
