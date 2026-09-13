import { useState, useEffect } from "react";
import {
  getTarefas,
  deletarTarefa,
  atualizarTarefa,
  criarTarefa,
} from "./features/tarefas/api";
import {
  getOcorrencias,
  criarOcorrencia,
  deletarOcorrencia,
} from "./features/ocorrencias/api";
import ListaTarefas from "./features/tarefas/components/ListarTarefas";
import ListaCategorias from "./features/categorias/components/ListarCategorias";
import TarefaForm from "./features/tarefas/components/TarefaForm";
import TarefaInfo from "./features/tarefas/components/TarefaInfo";
import "./shared/styles/global.css";
function App() {
  const [tema, setTema] = useState(
    () => localStorage.getItem("tema") || "dark",
  );
  const [tarefas, setTarefas] = useState([]);
  const [ocorrencias, setOcorrencias] = useState([]);
  const [carregandoTarefas, setCarregandoTarefas] = useState(true);
  const [tarefaEditandoId, setTarefaEditandoId] = useState(null);
  const [criandoTarefa, setCriandoTarefa] = useState(false);
  const [tarefaInfoId, setTarefaInfoId] = useState(null);
  const hoje = new Date().toISOString().split("T")[0];
  useEffect(() => {
    if (tema === "light") {
      document.body.setAttribute("data-theme", "light");
    } else {
      document.body.removeAttribute("data-theme");
    }
    localStorage.setItem("tema", tema);
  }, [tema]);
  useEffect(() => {
    getTarefas()
      .then((dados) => {
        setTarefas(dados);
        setCarregandoTarefas(false);
      })
      .catch((erro) => {
        console.error("Erro ao buscar tarefas:", erro);
        setCarregandoTarefas(false);
      });
  }, []);
  useEffect(() => {
    getOcorrencias()
      .then(setOcorrencias)
      .catch((erro) => console.error("Erro ao buscar ocorrências:", erro));
  }, []);
  function handleToggleTema() {
    setTema((atual) => (atual === "dark" ? "light" : "dark"));
  }
  function handleDeletarTarefa(id) {
    deletarTarefa(id)
      .then(() => {
        setTarefas((atuais) => atuais.filter((tarefa) => tarefa.id !== id));
      })
      .catch((erro) => console.error("Erro ao deletar tarefa:", erro));
  }
  function handleIniciarEdicaoTarefa(id) {
    setTarefaInfoId(null);
    setTarefaEditandoId(id);
  }
  function fecharModalTarefa() {
    const idEditado = tarefaEditandoId;
    setTarefaEditandoId(null);
    setCriandoTarefa(false);

    if (idEditado) {
      setTarefaInfoId(idEditado);
    }
  }
  function handleSalvarTarefa(id, dados) {
    if (id) {
      return atualizarTarefa(id, dados).then((tarefaAtualizada) => {
        setTarefas((atuais) =>
          atuais.map((tarefa) =>
            tarefa.id === id ? tarefaAtualizada : tarefa,
          ),
        );
        fecharModalTarefa();
      });
    } else {
      return criarTarefa(dados).then((novaTarefa) => {
        setTarefas((atuais) => [...atuais, novaTarefa]);
        fecharModalTarefa();
      });
    }
  }

  function handleCriarOcorrencia(tarefaId) {
    criarOcorrencia({
      tarefaId,
      dataHora: new Date().toISOString().slice(0, 19),
    })
      .then((novaOcorrencia) => {
        setOcorrencias((atuais) => [...atuais, novaOcorrencia]);
      })
      .catch((erro) => console.error("Erro ao criar ocorrência:", erro));
  }

  function handleDeletarOcorrencia(id) {
    deletarOcorrencia(id)
      .then(() => {
        setOcorrencias((atuais) => atuais.filter((o) => o.id !== id));
      })
      .catch((erro) => console.error("Erro ao deletar ocorrência:", erro));
  }

  function handleAbrirTarefaInfo(id) {
    setTarefaInfoId(id);
  }

  function handleFecharTarefaInfo() {
    setTarefaInfoId(null);
  }

  function handleEditarDaInfo() {
    const id = tarefaInfoId;
    handleFecharTarefaInfo();
    handleIniciarEdicaoTarefa(id);
  }

  const tarefaSelecionada = tarefas.find(
    (tarefa) => tarefa.id === tarefaEditandoId,
  );
  const modalTarefaAberto = criandoTarefa || tarefaEditandoId !== null;
  const tarefaParaForm = criandoTarefa ? null : tarefaSelecionada;
  const tarefaParaInfo = tarefas.find((tarefa) => tarefa.id === tarefaInfoId);
  const ocorrenciasDaTarefaInfo = ocorrencias.filter(
    (o) => o.tarefaId === tarefaInfoId,
  );

  return (
    <>
      <button className="theme-toggle" onClick={handleToggleTema}>
        {tema === "dark" ? "☀️ Tema Claro" : "🌙 Tema Escuro"}
      </button>
      <section id="center">
        <div className="secao">
          <h2>Tarefas</h2>
          <ListaTarefas
            tarefas={tarefas}
            ocorrencias={ocorrencias}
            carregando={carregandoTarefas}
            hoje={hoje}
            onDeletar={handleDeletarTarefa}
            onCriarOcorrencia={handleCriarOcorrencia}
            onDeletarOcorrencia={handleDeletarOcorrencia}
            onAbrirInfo={handleAbrirTarefaInfo}
            onCriandoTarefa={() => setCriandoTarefa(true)}
          />
        </div>
        <div className="secao">
          <h2>Categorias</h2>
          <ListaCategorias
            tarefas={tarefas}
            onAbrirTarefaInfo={handleAbrirTarefaInfo}
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
              onSalvar={handleSalvarTarefa}
              onCancelar={fecharModalTarefa}
            />
          </div>
        </div>
      )}
      {tarefaInfoId !== null && tarefaParaInfo && (
        <TarefaInfo
          tarefa={tarefaParaInfo}
          ocorrenciasTarefa={ocorrenciasDaTarefaInfo}
          onEditar={handleEditarDaInfo}
          onDeletarOcorrencia={handleDeletarOcorrencia}
          onFechar={handleFecharTarefaInfo}
        />
      )}
    </>
  );
}
export default App;
