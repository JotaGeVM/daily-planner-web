import { useState } from "react";
function CategoriaInfo({
  categoria,
  tarefasCategoria,
  onEditar,
  onFechar,
  onAbrirTarefaInfo,
}) {
  const [tarefasAbertas, setTarefasAbertas] = useState(false);
  const tarefasOrdenadas = [...tarefasCategoria].sort((a, b) =>
    a.nome.localeCompare(b.nome),
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
      <div className="modal-conteudo categoria-info">
        <button className="btn-fechar" onClick={onFechar}>
          x
        </button>
        <div className="categoria-info-header">
          <span
            className="categoria-cor"
            style={{ backgroundColor: categoria.corHex }}
          ></span>
          <h3>{categoria.nome}</h3>
          <button className="btn-primary" onClick={onEditar}>
            Editar
          </button>
        </div>
        {categoria.descricao && <p>{categoria.descricao}</p>}
        <button
          className="historico-toggle"
          onClick={() => setTarefasAbertas((atual) => !atual)}
        >
          Tarefas ({tarefasOrdenadas.length}) {tarefasAbertas ? "−" : "+"}
        </button>
        {tarefasAbertas && (
          <div className="historico-panel">
            {tarefasOrdenadas.length === 0 ? (
              <p className="historico-vazio">Nenhuma tarefa nesta categoria.</p>
            ) : (
              tarefasOrdenadas.map((tarefa) => (
                <button
                  key={tarefa.id}
                  className="tarefa-nome-lista"
                  onClick={() => onAbrirTarefaInfo(tarefa.id)}
                >
                  {tarefa.nome}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default CategoriaInfo;
