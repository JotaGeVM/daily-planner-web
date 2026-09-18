import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import AuthForm from "./features/auth/components/AuthForm";
import TarefasPage from "./pages/TarefasPage";
import { getToken, setToken, clearToken } from "./shared/auth/authStorage";
import "./shared/styles/global.css";
import NavBar from "./shared/components/NavBar";
import SemanaPage from "./pages/SemanaPage";
import MesPage from "./pages/MesPage";

function App() {
  const [tema, setTema] = useState(
    () => localStorage.getItem("tema") || "dark",
  );
  const [autenticado, setAutenticado] = useState(() => Boolean(getToken()));
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
    if (!autenticado) return;
    getTarefas()
      .then((dados) => {
        setTarefas(dados);
        setCarregandoTarefas(false);
      })
      .catch((erro) => {
        console.error("Erro ao buscar tarefas:", erro);
        setCarregandoTarefas(false);
        if (erro.status === 401 || erro.status === 403) {
          handleLogout();
        }
      });
  }, [autenticado]);

  useEffect(() => {
    if (!autenticado) return;
    getOcorrencias()
      .then(setOcorrencias)
      .catch((erro) => console.error("Erro ao buscar ocorrências:", erro));
  }, [autenticado]);

  function handleAutenticado(token) {
    setToken(token);
    setAutenticado(true);
  }

  function handleLogout() {
    clearToken();
    setAutenticado(false);
    setTarefas([]);
    setOcorrencias([]);
  }

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

  if (!autenticado) {
    return <AuthForm onAutenticado={handleAutenticado} />;
  }

  return (
    <>
      <div className="topo-acoes">
        <NavBar />
        <button className="theme-toggle" onClick={handleToggleTema}>
          {tema === "dark" ? "☀️ Tema Claro" : "🌙 Tema Escuro"}
        </button>
        <button className="btn-logout" onClick={handleLogout}>
          Sair
        </button>
      </div>
      <Routes>
        <Route
          path="/tarefas"
          element={
            <TarefasPage
              tarefas={tarefas}
              ocorrencias={ocorrencias}
              carregandoTarefas={carregandoTarefas}
              hoje={hoje}
              onDeletarTarefa={handleDeletarTarefa}
              onCriarOcorrencia={handleCriarOcorrencia}
              onDeletarOcorrencia={handleDeletarOcorrencia}
              onAbrirTarefaInfo={handleAbrirTarefaInfo}
              onCriandoTarefa={() => setCriandoTarefa(true)}
              modalTarefaAberto={modalTarefaAberto}
              tarefaParaForm={tarefaParaForm}
              onSalvarTarefa={handleSalvarTarefa}
              fecharModalTarefa={fecharModalTarefa}
              tarefaInfoId={tarefaInfoId}
              tarefaParaInfo={tarefaParaInfo}
              ocorrenciasDaTarefaInfo={ocorrenciasDaTarefaInfo}
              onEditarDaInfo={handleEditarDaInfo}
              onFecharTarefaInfo={handleFecharTarefaInfo}
            />
          }
        />
        <Route path="/semana" element={<SemanaPage />} />
        <Route path="/mes" element={<MesPage />} />
        <Route path="*" element={<Navigate to="/tarefas" replace />} />
      </Routes>
    </>
  );
}
export default App;
