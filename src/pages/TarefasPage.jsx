import ListaTarefas from "../features/tarefas/components/ListarTarefas";
import ListaCategorias from "../features/categorias/components/ListarCategorias";
import TarefaForm from "../features/tarefas/components/TarefaForm";
import TarefaInfo from "../features/tarefas/components/TarefaInfo";

function TarefasPage({
  tarefas,
  ocorrencias,
  carregandoTarefas,
  hoje,
  onDeletarTarefa,
  onCriarOcorrencia,
  onDeletarOcorrencia,
  onAbrirTarefaInfo,
  onCriandoTarefa,
  modalTarefaAberto,
  tarefaParaForm,
  onSalvarTarefa,
  fecharModalTarefa,
  tarefaInfoId,
  tarefaParaInfo,
  ocorrenciasDaTarefaInfo,
  onEditarDaInfo,
  onFecharTarefaInfo,
  onNaoConfirmarExclusao,
}) {
  return (
    <>
      <section id="center">
        <div className="secao">
          <h2>Hoje</h2>
          <ListaTarefas
            tarefas={tarefas}
            ocorrencias={ocorrencias}
            carregando={carregandoTarefas}
            hoje={hoje}
            onDeletar={onDeletarTarefa}
            onCriarOcorrencia={onCriarOcorrencia}
            onDeletarOcorrencia={onDeletarOcorrencia}
            onAbrirInfo={onAbrirTarefaInfo}
            onCriandoTarefa={onCriandoTarefa}
            onNaoConfirmarExclusao={onNaoConfirmarExclusao}
          />
        </div>
        <div className="secao">
          <h2>Categorias</h2>
          <ListaCategorias
            tarefas={tarefas}
            onAbrirTarefaInfo={onAbrirTarefaInfo}
          />
        </div>
      </section>

      {modalTarefaAberto && (
        <div
          className="modal-overlay"
          onClick={(evento) => {
            if (evento.target === evento.currentTarget) {
              fecharModalTarefa();
            }
          }}
        >
          <div className="modal-conteudo">
            <TarefaForm
              tarefa={tarefaParaForm}
              onSalvar={onSalvarTarefa}
              onCancelar={fecharModalTarefa}
            />
          </div>
        </div>
      )}

      {tarefaInfoId !== null && tarefaParaInfo && (
        <TarefaInfo
          tarefa={tarefaParaInfo}
          ocorrenciasTarefa={ocorrenciasDaTarefaInfo}
          onEditar={onEditarDaInfo}
          onDeletarOcorrencia={onDeletarOcorrencia}
          onFechar={onFecharTarefaInfo}
        />
      )}
    </>
  );
}

export default TarefasPage;
